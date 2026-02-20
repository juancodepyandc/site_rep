import { getRedisClient } from "./_redis.js";

export default async function handler(req, res) {
  try {
    const code = String(req.query.code || "").trim().toUpperCase();
    if (!code) {
      res.status(400).json({ error: "MISSING_CODE" });
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