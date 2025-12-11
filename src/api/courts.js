const BASE = import.meta.env.VITE_API_BASE_URL;

async function handleRes(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// GET all courts
export async function fetchCourts() {
  const res = await fetch(`${BASE}/courts`);
  return handleRes(res);
}

// ADMIN: Add a court
export async function createCourt(data) {
  const res = await fetch(`${BASE}/courts/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}
