import { getRedisClient } from "./_redis.js";
import { Resend } from "resend";

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { code } = req.body || {};
  const c = String(code || "").trim().toUpperCase();
  if (!c) return res.status(400).json({ error: "MISSING_CODE" });

  const r = await (await getRedisClient()).get(`quote:${c}`);
  if (!r) return res.status(404).json({ error: "NOT_FOUND" });

  const record = JSON.parse(r);
  const email = String(record?.requester?.email || "").trim();
  if (!email) return res.status(400).json({ error: "NO_EMAIL" });

  const otp = genOtp();
  const client = await getRedisClient();
  await client.set(`quote:otp:${c}`, otp, { EX: 86400 });

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Code validation modification devis",
    text: `Code: ${otp}`
  });

  res.status(200).json({ ok: true });
}