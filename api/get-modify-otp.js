import { getRedisClient } from "./_redis.js";

const ADMIN_MODIFY_KEY = String(process.env.ADMIN_MODIFY_KEY || process.env.ADMIN_SECRET || "").trim();
const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const LOOKUP_WINDOW_SECONDS = 10 * 60;
const LOOKUP_LIMIT_PER_IP = 30;

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
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

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

    const code = normalizeCode(req.query.code || "");
    const email = normalizeEmail(req.query.email || "");
    const adminKey = String(req.query.admin_key || "").trim();

    if (!code) return res.status(400).json({ error: "MISSING_CODE" });
    if (!QUOTE_CODE_RE.test(code)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });

    const client = await getRedisClient();
    const ip = readClientIp(req);
    const hits = await bumpCounter(client, `rate:modify-lookup:${ip}`, LOOKUP_WINDOW_SECONDS);
    if (hits > LOOKUP_LIMIT_PER_IP) return res.status(429).json({ error: "TOO_MANY_REQUESTS" });

    const raw = await client.get(`quote:${code}`);
    if (!raw) return res.status(404).json({ error: "NOT_FOUND" });

    const record = JSON.parse(raw);
    const expected = normalizeEmail(record?.requester?.email || "");
    if (adminKey && (!ADMIN_MODIFY_KEY || adminKey !== ADMIN_MODIFY_KEY)) {
      return res.status(403).json({ error: "ADMIN_KEY_INVALID" });
    }
    const isAdmin = Boolean(adminKey && ADMIN_MODIFY_KEY && adminKey === ADMIN_MODIFY_KEY);

    if (!isAdmin) {
      if (!email) return res.status(400).json({ error: "MISSING_EMAIL" });
      if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "INVALID_EMAIL" });
      if (!expected) return res.status(400).json({ error: "NO_EMAIL_ON_QUOTE" });
      if (email !== expected) return res.status(403).json({ error: "EMAIL_MISMATCH" });
    }

    const pendingRaw = await client.get(`quote:modify:req:${code}`);
    if (!pendingRaw) return res.status(404).json({ error: "NO_PENDING_MODIFICATION" });
    const pending = JSON.parse(pendingRaw);

    const base = {
      ok: true,
      quote_code: code,
      pending: true,
      requestedAt: pending.createdAt || "",
      expiresAt: pending.expiresAt || "",
      changeCount: Array.isArray(pending.changes) ? pending.changes.length : 0,
      changes: Array.isArray(pending.changes) ? pending.changes : []
    };

    if (isAdmin) {
      return res.status(200).json({
        ...base,
        otp: pending.otp || ""
      });
    }

    return res.status(200).json({
      ...base,
      otp_hint: pending.otp ? `***${String(pending.otp).slice(-2)}` : ""
    });
  } catch (err) {
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", detail: String(err?.message || err) });
  }
}
