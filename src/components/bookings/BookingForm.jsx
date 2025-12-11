import React, { useEffect, useState } from "react";
import { fetchCourts } from "../../api/courts";
import { fetchCoaches } from "../../api/coaches";
import { createBooking } from "../../api/bookings";
import CourtsList from "../courts/CourtsList";
import CoachesList from "../coaches/CoachesList";
import { fetchEquipmentAvailability } from "../../api/equipment";

export default function BookingForm({ onSuccess }) {
  const [availability, setAvailability] = useState({ racket: null, shoes: null });
  const [availLoading, setAvailLoading] = useState(false);

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

  // Load initial courts & coaches
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

  // Fetch availability for selected court + time window (debounced)
  useEffect(() => {
    // small debounce so we don't hammer backend while user types
    const t = setTimeout(() => {
      loadAvailability(selectedCourtId, form.date, form.startTime, form.endTime);
    }, 350);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourtId, form.date, form.startTime, form.endTime]);

  async function loadAvailability(courtId, date, startTime, endTime) {
    // reset if any required param missing
    if (!courtId || !date || !startTime || !endTime) {
      setAvailability({ racket: null, shoes: null });
      return;
    }

    // build ISO strings (frontend uses local -> toISOString())
    let startISO, endISO;
    try {
      startISO = new Date(`${date}T${startTime}`).toISOString();
      endISO = new Date(`${date}T${endTime}`).toISOString();
    } catch (err) {
      setAvailability({ racket: null, shoes: null });
      return;
    }

    setAvailLoading(true);
    try {
      const data = await fetchEquipmentAvailability(courtId, startISO, endISO);
      // backend returns available as { racket: n, shoes: m }
      const a = data && data.available ? data.available : { racket: null, shoes: null };
      setAvailability({ racket: a.racket ?? null, shoes: a.shoes ?? null });

      // If current inputs exceed newly available counts, clamp them
      setForm((prev) => {
        const next = { ...prev };
        if (a.racket != null && Number(prev.rackets) > a.racket) next.rackets = a.racket;
        if (a.shoes != null && Number(prev.shoes) > a.shoes) next.shoes = a.shoes;
        return next;
      });
    } catch (err) {
      console.error("availability fetch error", err);
      setAvailability({ racket: null, shoes: null });
    } finally {
      setAvailLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rackets") {
      // clamp using availability if present
      const num = Number(value || 0);
      const max = availability.racket == null ? Infinity : Number(availability.racket);
      setForm((prev) => ({ ...prev, rackets: Math.max(0, Math.min(num, max)) }));
      return;
    }

    if (name === "shoes") {
      const num = Number(value || 0);
      const max = availability.shoes == null ? Infinity : Number(availability.shoes);
      setForm((prev) => ({ ...prev, shoes: Math.max(0, Math.min(num, max)) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
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

      // final availability & booking is enforced on backend transactionally
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
      // If backend returned an object or text, prefer readable message
      const message = err?.message || (err?.error ? err.error : "Booking failed, please try again.");
      setError(message);
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
              <label className="block text-xs text-slate-600 mb-1">
                Rackets{" "}
                <span className="text-[11px] text-slate-500">
                  {availLoading ? "(checking…)" : availability.racket == null ? "" : `(available: ${availability.racket})`}
                </span>
              </label>

              <input
                type="number"
                min="0"
                name="rackets"
                value={form.rackets}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                // set max attr for UI where supported
                max={availability.racket == null ? undefined : availability.racket}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Shoes{" "}
                <span className="text-[11px] text-slate-500">
                  {availLoading ? "(checking…)" : availability.shoes == null ? "" : `(available: ${availability.shoes})`}
                </span>
              </label>

              <input
                type="number"
                min="0"
                name="shoes"
                value={form.shoes}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                max={availability.shoes == null ? undefined : availability.shoes}
              />
            </div>
          </div>

          <p className="mt-1 text-[11px] text-slate-500">
            Equipment availability is validated by the backend. Frontend shows live availability to help you choose.
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
