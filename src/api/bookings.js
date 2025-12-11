const BASE = import.meta.env.VITE_API_BASE_URL;

async function handleRes(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// CREATE booking
export async function createBooking(payload) {
  const res = await fetch(`${BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

// GET all bookings (optional)
export async function fetchBookings() {
  const res = await fetch(`${BASE}/bookings`);
  return handleRes(res);
}
