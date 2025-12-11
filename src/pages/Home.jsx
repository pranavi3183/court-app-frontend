import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-xl w-full bg-white shadow-md p-8 rounded-xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Sports Facility Booking
        </h1>

        <p className="text-slate-600 mb-6">
          Book courts, equipment, and coaches in real-time. Dynamic pricing and availability checks included.
        </p>

        <div className="flex gap-4">
          <Link
            to="/book"
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Book Slot
          </Link>

          <Link
            to="/admin"
            className="px-4 py-2 rounded-md border border-slate-300 text-sm hover:bg-slate-50"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
