import { getRedisClient } from "./_redis.js";

const ADMIN_MODIFY_KEY = String(process.env.ADMIN_MODIFY_KEY || process.env.ADMIN_SECRET || "").trim();
const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;
const QUOTE_TTL_SECONDS = 30 * 24 * 60 * 60;

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function readBody(req) {
  return req.body && typeof req.body === "object" ? req.body : {};
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    if (!ADMIN_MODIFY_KEY) return res.status(503).json({ error: "ADMIN_NOT_CONFIGURED" });

    const body = readBody(req);
    const adminKey = String(body.admin_key || body.adminKey || "").trim();
    if (!adminKey || adminKey !== ADMIN_MODIFY_KEY) return res.status(403).json({ error: "ADMIN_KEY_INVALID" });

    const code = normalizeCode(body.code || "");
    if (!code) return res.status(400).json({ error: "MISSING_CODE" });
    if (!QUOTE_CODE_RE.test(code)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });

    const nextStatus = String(body.status || "").trim().toLowerCase();
    if (!["open", "settled"].includes(nextStatus)) {
      return res.status(400).json({ error: "INVALID_STATUS" });
    }

    const client = await getRedisClient();
    const key = `quote:${code}`;
    const raw = await client.get(key);
    if (!raw) return res.status(404).json({ error: "NOT_FOUND" });

    const record = JSON.parse(raw);
    const nowIso = new Date().toISOString();
    record.adminStatus = {
      state: nextStatus,
      updatedAt: nowIso
    };
    record.updatedAt = nowIso;

    await client.set(key, JSON.stringify(record), { EX: QUOTE_TTL_SECONDS });
    return res.status(200).json({ ok: true, code, status: nextStatus, updatedAt: nowIso });
  } catch (err) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
