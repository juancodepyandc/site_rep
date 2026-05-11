const FALLBACK_BASE = "https://physical-thats-europe-comparable.trycloudflare.com";
const GH_TUNNEL_URL = "https://raw.githubusercontent.com/juancodepyandc/juan-of-bike-ia/main/tunnel_url.txt";

let cachedBase = null;
let cachedBaseAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function resolveAuroraBaseUrl() {
  const envUrl = (process.env.AURORA_BASE_URL || "").trim();
  if (envUrl) return envUrl.replace(/\/+$/, "");
  if (cachedBase && Date.now() - cachedBaseAt < CACHE_TTL_MS) return cachedBase;
  try {
    const r = await fetch(GH_TUNNEL_URL, { cache: "no-store" });
    if (r.ok) {
      const text = (await r.text()).trim();
      if (/^https?:\/\//i.test(text)) {
        cachedBase = text.replace(/\/+$/, "");
        cachedBaseAt = Date.now();
        return cachedBase;
      }
    }
  } catch {}
  return FALLBACK_BASE;
}

export function auroraKey() {
  return (process.env.AURORA_KEY || "").trim();
}

export async function auroraFetch(path, opts = {}) {
  const base = await resolveAuroraBaseUrl();
  const key = auroraKey();
  if (!key) throw new Error("AURORA_KEY_MISSING");
  const headers = {
    ...(opts.headers || {}),
    Authorization: `Bearer ${key}`
  };
  if (opts.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(`${base}${path}`, { ...opts, headers });
}

export function promptHash(prompt) {
  let h = 0xdeadbeef;
  const s = String(prompt || "");
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 2654435761) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
