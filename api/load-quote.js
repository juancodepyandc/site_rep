import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const code = String(req.query?.code || "").trim().toUpperCase();
  if (!code) {
    return res.status(400).json({ error: "MISSING_CODE" });
  }

  const record = await kv.get(`quote:${code}`);
  if (!record) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  return res.status(200).json({ ok: true, record });
}
