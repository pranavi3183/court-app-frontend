const BASE = import.meta.env.VITE_API_BASE_URL;

async function handleRes(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchCoaches() {
  const res = await fetch(`${BASE}/coaches`);
  return handleRes(res);
}
