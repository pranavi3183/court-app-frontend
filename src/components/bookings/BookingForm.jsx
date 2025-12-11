import React, { useEffect, useState } from "react";
import { fetchCourts } from "../../api/courts";
import { fetchCoaches } from "../../api/coaches";
import { createBooking } from "../../api/bookings";
import CourtsList from "../courts/CourtsList";
import CoachesList from "../coaches/CoachesList";

export default function BookingForm({ onSuccess }) {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [selectedCourtId, setSelectedCourtId] = useState("");
  const [selectedCoachId, setSelectedCoachId] = useState("");

  const [form, setForm] = useState({
    userName: "",
    date: "",
    startTime: "",
    endTime: "",
    rackets: 0,
    shoes: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const [courtsData, coachesData] = await Promise.all([
          fetchCourts(),
          fetchCoaches(),
        ]);
        setCourts(courtsData);
        setCoaches(coachesData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load courts/coaches");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rackets" || name === "shoes") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!selectedCourtId) {
        throw new Error("Please select a court.");
      }
      if (!form.date || !form.startTime || !form.endTime) {
        throw new Error("Please select date, start time and end time.");
      }

      const startISO = new Date(`${form.date}T${form.startTime}`).toISOString();
      const endISO = new Date(`${form.date}T${form.endTime}`).toISOString();

      const payload = {
        userName: form.userName,
        courtId: Number(selectedCourtId),
        coachId: selectedCoachId ? Number(selectedCoachId) : null,
        rackets: Number(form.rackets || 0),
        shoes: Number(form.shoes || 0),
        startTime: startISO,
        endTime: endISO,
      };

      const result = await createBooking(payload);
      onSuccess?.(result);

      // reset basic fields but keep courts/coaches loaded
      setForm({
        userName: "",
        date: "",
        startTime: "",
        endTime: "",
        rackets: 0,
        shoes: 0,
      });
      setSelectedCoachId("");
      // keep selected court for convenience
    } catch (err) {
      console.error(err);
      setError(err.message || "Booking failed, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-600">Loading booking form…</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* User name + date/time */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your name
          </label>
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Start time
          </label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            End time
          </label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Court selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Select court
        </label>
        <CourtsList
          courts={courts}
          selectedId={selectedCourtId}
          onSelect={setSelectedCourtId}
        />
      </div>

      {/* Coach + equipment */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Equipment
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-xs text-slate-600 mb-1">
                Rackets
              </span>
              <input
                type="number"
                min="0"
                name="rackets"
                value={form.rackets}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <span className="block text-xs text-slate-600 mb-1">Shoes</span>
              <input
                type="number"
                min="0"
                name="shoes"
                value={form.shoes}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Equipment availability is validated by the backend.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Optional coach
          </label>
          <CoachesList
            coaches={coaches}
            selectedId={selectedCoachId}
            onSelect={setSelectedCoachId}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Booking..." : "Book slot"}
      </button>

      <p className="text-[11px] text-slate-500">
        Final price is calculated dynamically on the server using your selected
        time, day, court type, and pricing rules.
      </p>
    </form>
  );
}
