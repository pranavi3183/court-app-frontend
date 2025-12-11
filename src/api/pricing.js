const BASE = import.meta.env.VITE_API_BASE_URL;

async function handleRes(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// GET all pricing rules
export async function fetchPricingRules() {
  const res = await fetch(`${BASE}/pricing`);
  return handleRes(res);
}

// ADMIN: Create pricing rule
export async function createPricingRule(rule) {
  const res = await fetch(`${BASE}/pricing/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rule),
  });
  return handleRes(res);
}
