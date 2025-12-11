import React from "react";

export default function CourtsList({ courts, selectedId, onSelect }) {
  if (!courts || courts.length === 0) {
    return <div className="text-sm text-slate-500">No courts found.</div>;
  }

  return (
    <div className="space-y-2">
      {courts.map((court) => (
        <button
          key={court.id}
          type="button"
          onClick={() => onSelect(court.id)}
          className={`w-full text-left p-3 rounded-md border transition ${
            selectedId === court.id
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-slate-800">{court.name}</div>
              <div className="text-xs text-slate-500 capitalize">
                {court.type} court
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              ID: {court.id}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
