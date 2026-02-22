import { getRedisClient } from "./_redis.js";

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function formatExpiresAtFrance(msFromNow) {
  const d = new Date(Date.now() + msFromNow);
  return d.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function sendOtpEmail({ toEmail, quoteCode, otp, expiresAt }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID || "service_8r68jtk";
  const templateId = process.env.EMAILJS_TEMPLATE_ID || "template_f0r9jmg";
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || "FNOmFW1q3gEntsR0J";

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: toEmail,
      quote_code: quoteCode,
      otp,
      expires_at: expiresAt
    }
  };

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`EMAILJS_SEND_FAILED_${res.status}_${text}`);
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
      return;
    }

    const { code } = req.body || {};
    const c = String(code || "").trim().toUpperCase();
    if (!c) {
      res.status(400).json({ error: "MISSING_CODE" });
      return;
    }

    const client = await getRedisClient();

    const raw = await client.get(`quote:${c}`);
    if (!raw) {
      res.status(404).json({ error: "NOT_FOUND" });
      return;
    }

    const record = JSON.parse(raw);
    const email = String(record?.requester?.email || "").trim();
    if (!email) {
      res.status(400).json({ error: "MISSING_REQUESTER_EMAIL" });
      return;
    }

    const otpKey = `quote:otp:${c}`;
    const existingOtp = await client.get(otpKey);
    if (existingOtp) {
      res.status(200).json({ ok: true, pending: true });
      return;
    }

    const otp = genOtp();
    const ttlSeconds = 24 * 60 * 60;
    await client.set(otpKey, otp, { EX: ttlSeconds });

    const expiresAt = formatExpiresAtFrance(ttlSeconds * 1000);

    await sendOtpEmail({
      toEmail: email,
      quoteCode: c,
      otp,
      expiresAt
    });

    res.status(200).json({ ok: true, pending: false });
  } catch (err) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}