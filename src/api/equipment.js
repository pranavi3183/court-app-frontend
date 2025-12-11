// src/api/equipment.js
const BASE = import.meta.env.VITE_API_BASE_URL;

async function handleRes(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * GET /equipment/availability?courtId=&start=&end=
 * Returns { courtId, totals, used, available }
 */
export async function fetchEquipmentAvailability(courtId, startISO, endISO) {
  const url = new URL(`${BASE}/equipment/availability`);
  url.searchParams.set("courtId", String(courtId));
  url.searchParams.set("start", startISO);
  url.searchParams.set("end", endISO);

  const res = await fetch(url.toString());
  return handleRes(res);
}

/** GET /equipment  -> list all equipment_per_court rows */
export async function fetchEquipment() {
  const res = await fetch(`${BASE}/equipment`);
  return handleRes(res);
}

/**
 * POST /equipment/admin
 * Body: { courtId, name, total }
 * Upserts equipment row for a court
 */
export async function upsertEquipment(payload) {
  const res = await fetch(`${BASE}/equipment/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}
