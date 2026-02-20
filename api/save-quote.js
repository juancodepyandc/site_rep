import { getRedisClient } from "./_redis.js";

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

    // 30 jours
    const ttlSeconds = 30 * 24 * 60 * 60;

    await client.set(`quote:${code}`, JSON.stringify(record), { EX: ttlSeconds });

    res.status(200).json({ ok: true, code });
  } catch (err) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}