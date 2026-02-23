import { getRedisClient } from "./_redis.js";

const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
      return;
    }

    const code = String(req.query.code || "").trim().toUpperCase();
    if (!code) {
      res.status(400).json({ error: "MISSING_CODE" });
      return;
    }
    if (!QUOTE_CODE_RE.test(code)) {
      res.status(400).json({ error: "INVALID_CODE_FORMAT" });
      return;
    }

    const client = await getRedisClient();
    const raw = await client.get(`quote:${code}`);

    if (!raw) {
      res.status(404).json({ error: "NOT_FOUND" });
      return;
    }

    const record = JSON.parse(raw);
    res.status(200).json({ ok: true, record });
  } catch (err) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
