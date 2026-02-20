import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const { record } = req.body || {};
  if (!record || !record.code) {
    return res.status(400).json({ error: "INVALID_PAYLOAD" });
  }

  const code = String(record.code).trim().toUpperCase();
  const ttlSeconds = 30 * 24 * 60 * 60; // 30 jours

  await kv.set(`quote:${code}`, record, { ex: ttlSeconds });
  return res.status(200).json({ ok: true, code });
}
