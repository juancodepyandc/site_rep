import { getRedisClient } from "./_redis.js";

const ADMIN_MODIFY_KEY = String(process.env.ADMIN_MODIFY_KEY || process.env.ADMIN_SECRET || "").trim();
const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function readBody(req) {
  return req.body && typeof req.body === "object" ? req.body : {};
}

export default async function handler(req, res) {
  try {
    if (!["DELETE", "POST"].includes(req.method)) return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    if (!ADMIN_MODIFY_KEY) return res.status(503).json({ error: "ADMIN_NOT_CONFIGURED" });

    const body = readBody(req);
    const adminKey = String(body.admin_key || body.adminKey || "").trim();
    if (!adminKey || adminKey !== ADMIN_MODIFY_KEY) return res.status(403).json({ error: "ADMIN_KEY_INVALID" });

    const code = normalizeCode(body.code || "");
    if (!code) return res.status(400).json({ error: "MISSING_CODE" });
    if (!QUOTE_CODE_RE.test(code)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });

    const client = await getRedisClient();
    const [quoteDeleted, pendingDeleted] = await Promise.all([
      client.del(`quote:${code}`),
      client.del(`quote:modify:req:${code}`)
    ]);

    return res.status(200).json({
      ok: true,
      code,
      deleted: Number(quoteDeleted || 0) > 0,
      pendingDeleted: Number(pendingDeleted || 0) > 0
    });
  } catch (err) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
