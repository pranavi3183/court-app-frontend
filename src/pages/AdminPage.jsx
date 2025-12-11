// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { fetchCourts, createCourt } from "../api/courts";
import { fetchPricingRules, createPricingRule } from "../api/pricing";
import { fetchEquipment, upsertEquipment, fetchEquipmentAvailability } from "../api/equipment";

/**
 * AdminPage — enhanced
 * - Manage Courts (existing)
 * - Manage Pricing Rules (existing)
 * - Manage Equipment per court (rackets/shoes)
 * - Check availability for a chosen court + date/time window
 */
export default function AdminPage() {
  // main data
  const [courts, setCourts] = useState([]);
  const [rules, setRules] = useState([]);
  const [equipmentRows, setEquipmentRows] = useState([]);

  // UI/feedback
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // COURT form
  const [courtForm, setCourtForm] = useState({ name: "", type: "indoor" });

  // PRICING form
  const [ruleForm, setRuleForm] = useState({
    name: "",
    type: "peak",
    value: 1.5,
    startHour: 18,
    endHour: 21,
    dayOfWeek: null,
  });

  // EQUIPMENT form
  const [equipForm, setEquipForm] = useState({ courtId: "", name: "racket", total: 6 });

  // AVAILABILITY checker form + result
  const [availForm, setAvailForm] = useState({
    courtId: "",
    date: "",
    startTime: "",
    endTime: ""
  });
  const [availResult, setAvailResult] = useState(null);
  const [availLoading, setAvailLoading] = useState(false);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [cData, rData, eqData] = await Promise.all([
          fetchCourts(),
          fetchPricingRules(),
          fetchEquipment(),
        ]);
        setCourts(cData);
        setRules(rData);
        setEquipmentRows(eqData);
      } catch (err) {
        console.error(err);
        setMessage(err?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // ---------- COURT handlers ----------
  const addCourt = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await createCourt(courtForm);
      setMessage(`Court added: ID ${res.id}`);
      const updated = await fetchCourts();
      setCourts(updated);
      setCourtForm({ name: "", type: "indoor" });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to add court");
    }
  };

  // ---------- PRICING handlers ----------
  const addRule = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await createPricingRule(ruleForm);
      setMessage(`Pricing rule added: ID ${res.id}`);
      const updated = await fetchPricingRules();
      setRules(updated);
      setRuleForm({
        name: "",
        type: "peak",
        value: 1.5,
        startHour: 18,
        endHour: 21,
        dayOfWeek: null,
      });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to add rule");
    }
  };

  // ---------- EQUIPMENT handlers ----------
  const submitEquipment = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (!equipForm.courtId) throw new Error("Select a court first");
      const res = await upsertEquipment({
        courtId: Number(equipForm.courtId),
        name: equipForm.name,
        total: Number(equipForm.total)
      });
      setMessage(`Equipment saved: ${res.name} = ${res.total} for court ${res.courtId}`);
      const updated = await fetchEquipment();
      setEquipmentRows(updated);
      setEquipForm({ courtId: "", name: "racket", total: 6 });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to save equipment");
    }
  };

  // ---------- AVAILABILITY handler ----------
  const checkAvailability = async (e) => {
    e.preventDefault();
    setAvailResult(null);
    setMessage("");
    if (!availForm.courtId || !availForm.date || !availForm.startTime || !availForm.endTime) {
      setMessage("Please select court, date, start time and end time to check availability");
      return;
    }

    // build ISO
    let startISO, endISO;
    try {
      startISO = new Date(`${availForm.date}T${availForm.startTime}`).toISOString();
      endISO = new Date(`${availForm.date}T${availForm.endTime}`).toISOString();
    } catch (err) {
      setMessage("Invalid date/time");
      return;
    }

    setAvailLoading(true);
    try {
      const data = await fetchEquipmentAvailability(Number(availForm.courtId), startISO, endISO);
      // data: { courtId, totals, used, available }
      setAvailResult(data);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to fetch availability");
    } finally {
      setAvailLoading(false);
    }
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>

        {message && (
          <div className="p-3 text-sm bg-yellow-50 border border-yellow-200 rounded">
            {message}
          </div>
        )}

        {/* COURTS */}
        <div className="bg-white p-6 shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-3">Courts</h2>

          <form onSubmit={addCourt} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              placeholder="Court Name"
              required
              className="p-2 border rounded"
              value={courtForm.name}
              onChange={(e) => setCourtForm((f) => ({ ...f, name: e.target.value }))}
            />
            <select
              className="p-2 border rounded"
              value={courtForm.type}
              onChange={(e) => setCourtForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>

            <button className="p-2 bg-blue-600 text-white rounded">Add Court</button>
          </form>

          <div className="space-y-2">
            {courts.map((court) => (
              <div key={court.id} className="p-2 border rounded">
                {court.name} — <span className="capitalize">{court.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* EQUIPMENT PER COURT */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Equipment per Court</h2>

          <form onSubmit={submitEquipment} className="grid md:grid-cols-4 gap-3 mb-4">
            <select
              required
              className="p-2 border rounded"
              value={equipForm.courtId}
              onChange={(e) => setEquipForm((f) => ({ ...f, courtId: e.target.value }))}
            >
              <option value="">Select court</option>
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded"
              value={equipForm.name}
              onChange={(e) => setEquipForm((f) => ({ ...f, name: e.target.value }))}
            >
              <option value="racket">Racket</option>
              <option value="shoes">Shoes</option>
            </select>

            <input
              type="number"
              min="0"
              className="p-2 border rounded"
              value={equipForm.total}
              onChange={(e) => setEquipForm((f) => ({ ...f, total: Number(e.target.value) }))}
            />

            <button className="p-2 bg-blue-600 text-white rounded">Set Equipment</button>
          </form>

          <div className="grid gap-2">
            {equipmentRows.length === 0 && (
              <div className="text-sm text-slate-500">No equipment configured yet.</div>
            )}

            {equipmentRows.map((row) => (
              <div key={row.id} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">Court {row.courtId} — {row.name}</div>
                  <div className="text-sm text-slate-600">Total: {row.total}</div>
                </div>
                <div className="text-sm text-slate-700">ID: {row.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING RULES */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Pricing Rules</h2>

          <form onSubmit={addRule} className="grid md:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              placeholder="Rule name"
              className="p-2 border rounded"
              value={ruleForm.name}
              onChange={(e) => setRuleForm((r) => ({ ...r, name: e.target.value }))}
            />

            <select
              className="p-2 border rounded"
              value={ruleForm.type}
              onChange={(e) => setRuleForm((r) => ({ ...r, type: e.target.value }))}
            >
              <option value="peak">Peak (multiplier)</option>
              <option value="weekend">Weekend (surcharge)</option>
              <option value="courtType">Court type surcharge</option>
            </select>

            <input
              type="number"
              step="0.01"
              className="p-2 border rounded"
              value={ruleForm.value}
              onChange={(e) => setRuleForm((r) => ({ ...r, value: Number(e.target.value) }))}
            />

            <button className="p-2 bg-green-600 text-white rounded">Add Rule</button>
          </form>

          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="p-2 border rounded">
                <div className="font-medium">
                  {rule.name} — <span className="text-slate-600">{rule.type}</span>
                </div>
                <div className="text-sm text-slate-500">
                  Value: {rule.value} {rule.startHour !== null && ` | ${rule.startHour}:00 - ${rule.endHour}:00`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AVAILABILITY CHECKER */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Check Equipment Availability</h2>

          <form onSubmit={checkAvailability} className="grid md:grid-cols-4 gap-3 mb-4">
            <select
              required
              className="p-2 border rounded"
              value={availForm.courtId}
              onChange={(e) => setAvailForm((f) => ({ ...f, courtId: e.target.value }))}
            >
              <option value="">Select court</option>
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>

            <input
              type="date"
              required
              className="p-2 border rounded"
              value={availForm.date}
              onChange={(e) => setAvailForm((f) => ({ ...f, date: e.target.value }))}
            />

            <input
              type="time"
              required
              className="p-2 border rounded"
              value={availForm.startTime}
              onChange={(e) => setAvailForm((f) => ({ ...f, startTime: e.target.value }))}
            />

            <input
              type="time"
              required
              className="p-2 border rounded"
              value={availForm.endTime}
              onChange={(e) => setAvailForm((f) => ({ ...f, endTime: e.target.value }))}
            />
          </form>

          <div className="flex gap-3 items-center mb-3">
            <button onClick={checkAvailability} className="p-2 bg-indigo-600 text-white rounded">
              {availLoading ? "Checking…" : "Check Availability"}
            </button>
            <div className="text-sm text-slate-600">(Checks confirmed bookings overlapping the selected window)</div>
          </div>

          {availResult && (
            <div className="p-3 border rounded bg-slate-50">
              <div className="text-sm"><strong>Court</strong>: {availResult.courtId}</div>
              <div className="text-sm">Totals: {JSON.stringify(availResult.totals)}</div>
              <div className="text-sm">Used: {JSON.stringify(availResult.used)}</div>
              <div className="text-sm">Available: {JSON.stringify(availResult.available)}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
