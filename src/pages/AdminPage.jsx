import React, { useEffect, useState } from "react";
import { fetchCourts, createCourt } from "../api/courts";
import { fetchPricingRules, createPricingRule } from "../api/pricing";

export default function AdminPage() {
  const [courts, setCourts] = useState([]);
  const [rules, setRules] = useState([]);
  const [message, setMessage] = useState("");

  const [courtForm, setCourtForm] = useState({
    name: "",
    type: "indoor",
  });

  const [ruleForm, setRuleForm] = useState({
    name: "",
    type: "peak",
    value: 1.5,
    startHour: 18,
    endHour: 21,
    dayOfWeek: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const [cData, rData] = await Promise.all([
          fetchCourts(),
          fetchPricingRules(),
        ]);
        setCourts(cData);
        setRules(rData);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  // ---------------------- COURT HANDLER ----------------------
  const addCourt = async (e) => {
    e.preventDefault();
    try {
      const res = await createCourt(courtForm);
      setMessage(`Court added: ID ${res.id}`);

      const updated = await fetchCourts();
      setCourts(updated);

      setCourtForm({ name: "", type: "indoor" });
    } catch (err) {
      setMessage(err.message);
    }
  };

  // ---------------------- PRICING HANDLER ----------------------
  const addRule = async (e) => {
    e.preventDefault();
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
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold text-slate-800 mb-4">Admin Dashboard</h1>

        {message && (
          <div className="p-3 text-sm bg-yellow-50 border border-yellow-200 rounded">
            {message}
          </div>
        )}

        {/* COURTS SECTION */}
        <div className="bg-white p-6 shadow rounded-xl">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Courts</h2>

          <form onSubmit={addCourt} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              placeholder="Court Name"
              required
              className="p-2 border rounded"
              value={courtForm.name}
              onChange={(e) =>
                setCourtForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <select
              className="p-2 border rounded"
              value={courtForm.type}
              onChange={(e) =>
                setCourtForm((f) => ({ ...f, type: e.target.value }))
              }
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>

            <button className="p-2 bg-blue-600 text-white rounded">
              Add Court
            </button>
          </form>

          <div className="space-y-2">
            {courts.map((court) => (
              <div key={court.id} className="p-2 border rounded">
                {court.name} — <span className="capitalize">{court.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING RULES SECTION */}
        <div className="bg-white p-6 shadow rounded-xl">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Pricing Rules
          </h2>

          <form onSubmit={addRule} className="grid md:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              placeholder="Rule name"
              className="p-2 border rounded"
              value={ruleForm.name}
              onChange={(e) =>
                setRuleForm((r) => ({ ...r, name: e.target.value }))
              }
            />

            <select
              className="p-2 border rounded"
              value={ruleForm.type}
              onChange={(e) =>
                setRuleForm((r) => ({ ...r, type: e.target.value }))
              }
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
              onChange={(e) =>
                setRuleForm((r) => ({ ...r, value: Number(e.target.value) }))
              }
            />

            <button className="p-2 bg-green-600 text-white rounded">
              Add Rule
            </button>
          </form>

          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="p-2 border rounded">
                <div className="font-medium">
                  {rule.name} —{" "}
                  <span className="text-slate-600">{rule.type}</span>
                </div>
                <div className="text-sm text-slate-500">
                  Value: {rule.value}{" "}
                  {rule.startHour !== null &&
                    ` | ${rule.startHour}:00 - ${rule.endHour}:00`}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
