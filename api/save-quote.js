import { getRedisClient } from "./_redis.js";

const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const TTL_SECONDS = 30 * 24 * 60 * 60;
const ALLOWED_SELECT_KEYS = new Set(["cpu", "mobo", "ram", "gpu", "storage", "psu", "case", "watercooling", "customCables", "cableMgmt", "delivery"]);

function clampText(value, max = 5000) {
  return String(value || "").trim().slice(0, max);
}

function sanitizeAdminStatus(status) {
  if (!status || typeof status !== "object") return undefined;
  const state = String(status.state || "").trim().toLowerCase();
  if (!["open", "settled"].includes(state)) return undefined;
  return {
    state,
    updatedAt: status.updatedAt || new Date().toISOString()
  };
}

function sanitizeRecord(record, code, inheritedAdminStatus) {
  if (!record || typeof record !== "object") return null;
  const requester = record.requester && typeof record.requester === "object" ? record.requester : {};
  const email = clampText(requester.email || "", 200).toLowerCase();
  if (email && !EMAIL_RE.test(email)) return null;

  const rawSelects = record.selects && typeof record.selects === "object" ? record.selects : {};
  const rawExternal = record.external && typeof record.external === "object" ? record.external : {};
  const selects = Object.fromEntries(
    Object.entries(rawSelects)
      .filter(([k]) => ALLOWED_SELECT_KEYS.has(k))
      .map(([k, v]) => [k, clampText(v || "", 160)])
  );
  const external = Object.fromEntries(
    Object.entries(rawExternal)
      .filter(([k]) => ALLOWED_SELECT_KEYS.has(k))
      .map(([k, v]) => [k, v && typeof v === "object" ? { query: clampText(v.query || "", 240) } : { query: clampText(v || "", 240) }])
  );

  return {
    code,
    createdAt: record.createdAt || new Date().toISOString(),
    requester: {
      name: clampText(requester.name || "", 200),
      email,
      details: clampText(requester.details || "", 8000),
      noviceMode: Boolean(requester.noviceMode),
      noviceBrief: clampText(requester.noviceBrief || "", 5000),
      budgetMin: Number(requester.budgetMin || 0) || 0,
      budgetMax: Number(requester.budgetMax || 0) || 0
    },
    signature: clampText(record.signature || "", 30000),
    selects,
    external,
    usage: clampText(record.usage || "", 200),
    config: record.config && typeof record.config === "object" ? record.config : null,
    preview3d: record.preview3d && typeof record.preview3d === "object" ? record.preview3d : null,
    adminStatus: sanitizeAdminStatus(record.adminStatus) || sanitizeAdminStatus(inheritedAdminStatus),
    updatedAt: record.updatedAt || undefined,
    lastOtpModification: record.lastOtpModification && typeof record.lastOtpModification === "object" ? record.lastOtpModification : undefined,
    modificationHistory: Array.isArray(record.modificationHistory) ? record.modificationHistory.slice(-20) : undefined
  };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
      return;
    }

    const { record } = req.body || {};
    if (!record || !record.code) {
      res.status(400).json({ error: "INVALID_PAYLOAD" });
      return;
    }

    const client = await getRedisClient();
    const code = String(record.code).trim().toUpperCase();
    if (!QUOTE_CODE_RE.test(code)) {
      res.status(400).json({ error: "INVALID_CODE_FORMAT" });
      return;
    }

    let inheritedAdminStatus = undefined;
    try {
      const existingRaw = await client.get(`quote:${code}`);
      if (existingRaw) {
        const existing = JSON.parse(existingRaw);
        inheritedAdminStatus = existing?.adminStatus;
      }
    } catch {
      inheritedAdminStatus = undefined;
    }

    const sanitized = sanitizeRecord(record, code, inheritedAdminStatus);
    if (!sanitized) {
      res.status(400).json({ error: "INVALID_RECORD" });
      return;
    }
    if (JSON.stringify(sanitized).length > 380000) {
      res.status(413).json({ error: "RECORD_TOO_LARGE" });
      return;
    }

    await client.set(`quote:${code}`, JSON.stringify(sanitized), { EX: TTL_SECONDS });

    res.status(200).json({ ok: true, code });
  } catch (err) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
