import React, { useState } from "react";
import BookingForm from "../components/bookings/BookingForm";
import BookingSuccess from "../components/bookings/BookingSuccess";

export default function BookingPage() {
  const [successData, setSuccessData] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
        
        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Book a Court</h2>
          <BookingForm onSuccess={setSuccessData} />
        </div>

        {/* Success & Info Panel */}
        <div className="space-y-4">
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-medium text-slate-800 mb-2">How it works</h3>
            <p className="text-sm text-slate-600">
              Select your preferred court, choose equipment and an optional coach,
              and the system performs availability and pricing checks for you.
            </p>
          </div>

          {successData && (
            <div className="bg-white rounded-xl shadow p-6">
              <BookingSuccess data={successData} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
