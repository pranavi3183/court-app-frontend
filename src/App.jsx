import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Router>
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="font-bold text-lg text-slate-800">Sports Booking</div>

          <div className="flex gap-4 text-sm">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/book" className="hover:text-blue-600">Book</Link>
            <Link to="/admin" className="hover:text-blue-600">Admin</Link>
          </div>
        </div>
      </nav>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}
