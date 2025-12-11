import React from "react";

export default function CoachesList({ coaches, selectedId, onSelect }) {
  if (!coaches || coaches.length === 0) {
    return <div className="text-sm text-slate-500">No coaches configured.</div>;
  }

  return (
    <div className="space-y-2">
      {coaches.map((coach) => {
        const disabled = coach.isAvailable === 0 || coach.isAvailable === false;
        return (
          <label
            key={coach.id}
            className={`flex items-center justify-between p-3 rounded-md border cursor-pointer ${
              disabled ? "bg-slate-50 opacity-60 cursor-not-allowed" : "hover:bg-slate-50"
            }`}
          >
            <div>
              <div className="font-medium text-slate-800">{coach.name}</div>
              <div className="text-xs text-slate-500">
                {disabled ? "Unavailable" : "Available"}
              </div>
            </div>
            <input
              type="radio"
              name="coach"
              className="h-4 w-4"
              disabled={disabled}
              checked={selectedId === coach.id}
              onChange={() => !disabled && onSelect(coach.id)}
            />
          </label>
        );
      })}
    </div>
  );
}
