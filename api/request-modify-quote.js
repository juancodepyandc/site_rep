import { getRedisClient } from "./_redis.js";
import { randomInt } from "node:crypto";

function genOtp() {
  return String(randomInt(100000, 1000000));
}

const OTP_TTL_SECONDS = 24 * 60 * 60;
const ADMIN_MODIFY_KEY = String(process.env.ADMIN_MODIFY_KEY || process.env.ADMIN_SECRET || "").trim();
const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const ALLOWED_SELECT_KEYS = new Set(["cpu", "mobo", "ram", "gpu", "storage", "psu", "case", "watercooling", "customCables", "cableMgmt", "delivery"]);
const REQUEST_WINDOW_SECONDS = 10 * 60;
const REQUEST_LIMIT_PER_IP = 15;

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidCode(code) {
  return QUOTE_CODE_RE.test(String(code || ""));
}

function isValidEmail(email) {
  if (!email) return false;
  return EMAIL_RE.test(String(email || "").trim());
}

function readClientIp(req) {
  const xf = String(req.headers["x-forwarded-for"] || "").trim();
  if (xf) return xf.split(",")[0].trim();
  return String(req.socket?.remoteAddress || "unknown");
}

async function bumpCounter(client, key, ttlSeconds) {
  const next = await client.incr(key);
  if (next === 1) await client.expire(key, ttlSeconds);
  return Number(next || 0);
}

function sanitizeChanges(changes) {
  if (!Array.isArray(changes)) return [];
  return changes
    .slice(0, 40)
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const field = String(item.field || "").trim();
      const label = String(item.label || field || "").trim();
      const from = String(item.from ?? "").trim();
      const to = String(item.to ?? "").trim();
      if (!field || from === to) return null;
      return { field, label, from, to };
    })
    .filter(Boolean);
}

function sanitizeRequestedRecord(record, code) {
  if (!record || typeof record !== "object") return null;
  if (normalizeCode(record.code) !== code) return null;
  const noviceBrief = String(record?.requester?.noviceBrief || "").trim().slice(0, 5000);
  const rawSelects = record.selects && typeof record.selects === "object" ? record.selects : {};
  const rawExternal = record.external && typeof record.external === "object" ? record.external : {};
  const selects = Object.fromEntries(
    Object.entries(rawSelects)
      .filter(([k]) => ALLOWED_SELECT_KEYS.has(k))
      .map(([k, v]) => [k, String(v || "").trim().slice(0, 160)])
  );
  const external = Object.fromEntries(
    Object.entries(rawExternal)
      .filter(([k]) => ALLOWED_SELECT_KEYS.has(k))
      .map(([k, v]) => [k, v && typeof v === "object" ? { query: String(v.query || "").trim().slice(0, 240) } : { query: String(v || "").trim().slice(0, 240) }])
  );
  return {
    code,
    createdAt: record.createdAt || new Date().toISOString(),
    requester: {
      name: String(record?.requester?.name || "").trim(),
      email: normalizeEmail(record?.requester?.email || ""),
      details: String(record?.requester?.details || "").trim().slice(0, 8000),
      noviceMode: Boolean(record?.requester?.noviceMode),
      noviceBrief,
      budgetMin: Number(record?.requester?.budgetMin || 0) || 0,
      budgetMax: Number(record?.requester?.budgetMax || 0) || 0
    },
    signature: String(record.signature || ""),
    selects,
    external,
    usage: String(record.usage || ""),
    config: record.config && typeof record.config === "object" ? record.config : null,
    preview3d: record.preview3d && typeof record.preview3d === "object" ? record.preview3d : null
  };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

    const { code, email, requester, changes, requestedRecord, adminSecret, forceRegenerate } = req.body || {};
    const c = normalizeCode(code);
    if (!c) return res.status(400).json({ error: "MISSING_CODE" });
    if (!isValidCode(c)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });
    if (!requestedRecord || typeof requestedRecord !== "object") return res.status(400).json({ error: "MISSING_REQUEST_RECORD" });

    const client = await getRedisClient();
    const ip = readClientIp(req);
    const raw = await client.get(`quote:${c}`);
    if (!raw) return res.status(404).json({ error: "NOT_FOUND" });
    const quote = JSON.parse(raw);
    const expectedEmail = normalizeEmail(quote?.requester?.email || "");
    const incomingEmail = normalizeEmail(email || requester?.email || "");
    if (incomingEmail && !isValidEmail(incomingEmail)) return res.status(400).json({ error: "INVALID_EMAIL" });
    const incomingAdminSecret = String(adminSecret || "").trim();
    const isAdminRequest = Boolean(ADMIN_MODIFY_KEY) && incomingAdminSecret === ADMIN_MODIFY_KEY;
    if (incomingAdminSecret && !ADMIN_MODIFY_KEY) {
      return res.status(503).json({ error: "ADMIN_NOT_CONFIGURED" });
    }
    if (incomingAdminSecret && !isAdminRequest) {
      return res.status(403).json({ error: "ADMIN_KEY_INVALID" });
    }

    if (!isAdminRequest) {
      const count = await bumpCounter(client, `rate:modify-request:${ip}`, REQUEST_WINDOW_SECONDS);
      if (count > REQUEST_LIMIT_PER_IP) return res.status(429).json({ error: "TOO_MANY_REQUESTS" });
      if (!incomingEmail) return res.status(400).json({ error: "MISSING_EMAIL" });
      if (!isValidEmail(incomingEmail)) return res.status(400).json({ error: "INVALID_EMAIL" });
      if (expectedEmail && incomingEmail !== expectedEmail) return res.status(403).json({ error: "EMAIL_MISMATCH" });
    }

    const reqKey = `quote:modify:req:${c}`;
    const existing = await client.get(reqKey);
    if (existing && !forceRegenerate) {
      const pending = JSON.parse(existing);
      return res.status(200).json({
        ok: true,
        pending: true,
        otp: pending.otp || "",
        expiresAt: pending.expiresAt || "",
        requestedAt: pending.createdAt || "",
        changeCount: Array.isArray(pending.changes) ? pending.changes.length : 0
      });
    }

    const otp = genOtp();
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + (OTP_TTL_SECONDS * 1000)).toISOString();
    const sanitizedRequestedRecord = sanitizeRequestedRecord(requestedRecord, c);
    if (!sanitizedRequestedRecord) return res.status(400).json({ error: "INVALID_REQUEST_RECORD" });
    if (JSON.stringify(sanitizedRequestedRecord).length > 360000) {
      return res.status(413).json({ error: "REQUEST_RECORD_TOO_LARGE" });
    }
    const pendingPayload = {
      code: c,
      otp,
      createdAt,
      expiresAt,
      source: isAdminRequest ? "admin" : "client",
      requester: {
        name: String(requester?.name || quote?.requester?.name || "").trim(),
        email: incomingEmail || expectedEmail
      },
      changes: sanitizeChanges(changes),
      requestedRecord: sanitizedRequestedRecord
    };

    await client.set(reqKey, JSON.stringify(pendingPayload), { EX: OTP_TTL_SECONDS });
    return res.status(200).json({
      ok: true,
      pending: false,
      otp,
      requestedAt: createdAt,
      expiresAt,
      changeCount: pendingPayload.changes.length
    });
  } catch (err) {
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", detail: String(err?.message || err) });
  }
}
