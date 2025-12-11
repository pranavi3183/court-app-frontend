import React from "react";

export default function BookingSuccess({ data }) {
  if (!data) return null;

  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      <div className="font-semibold text-emerald-900">
        Booking confirmed 
      </div>
      <div className="mt-1">
        Booking ID: <span className="font-mono">{data.id}</span>
      </div>
      {typeof data.price !== "undefined" && (
        <div className="mt-1">
          Total price:{" "}
          <span className="font-semibold">
            ₹{data.price}
          </span>
        </div>
      )}
      <div className="mt-1 text-[11px] text-emerald-900/80">
        Price includes dynamic rules (weekend / peak hours / court type / etc.)
        applied on the backend.
      </div>
    </div>
  );
}
