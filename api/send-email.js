import { getRedisClient } from "./_redis.js";
import { sendMailWithFallback } from "../lib/mailer.js";

const EMAILJS_FORM_SERVICE_ID = String(
  process.env.EMAILJS_FORM_SERVICE_ID || process.env.EMAILJS_SERVICE_ID || ""
).trim();
const EMAILJS_FORM_TEMPLATE_ID = String(
  process.env.EMAILJS_FORM_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || ""
).trim();
const EMAILJS_FORM_PUBLIC_KEY = String(
  process.env.EMAILJS_FORM_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_USER_ID || ""
).trim();
const EMAILJS_FORM_PRIVATE_KEY = String(
  process.env.EMAILJS_FORM_PRIVATE_KEY || process.env.EMAILJS_PRIVATE_KEY || ""
).trim();
const EMAILJS_FORM_TO_EMAIL = String(
  process.env.EMAILJS_FORM_TO_EMAIL || process.env.ATELIER_COMPANY_EMAIL || "rabuteaujuandavid@gmail.com"
).trim().toLowerCase();
const ATELIER_COMPANY_NAME = String(process.env.ATELIER_COMPANY_NAME || "Atelier Electronique").trim();
const ATELIER_COMPANY_EMAIL = String(process.env.ATELIER_COMPANY_EMAIL || EMAILJS_FORM_TO_EMAIL || "rabuteaujuandavid@gmail.com").trim().toLowerCase();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const RATE_WINDOW_SECONDS = 60;
const RATE_MAX_PER_IP = 18;

function clampText(value, max = 5000) {
  return String(value || "").trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
    if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

    let redis = null;
    try {
      redis = await getRedisClient();
      const ip = readClientIp(req);
      const hits = await bumpCounter(redis, `rate:form-email:${ip}`, RATE_WINDOW_SECONDS);
      if (hits > RATE_MAX_PER_IP) return res.status(429).json({ error: "TOO_MANY_REQUESTS" });
    } catch {
      redis = null;
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const subject = clampText(body.subject || "", 220);
    const fromName = clampText(body.from_name || body.fromName || "", 200);
    const replyTo = clampText(body.reply_to || body.replyTo || "", 200).toLowerCase();
    const message = clampText(body.message || "", 18000);

    if (!subject) return res.status(400).json({ error: "MISSING_SUBJECT" });
    if (!fromName) return res.status(400).json({ error: "MISSING_FROM_NAME" });
    if (!replyTo || !EMAIL_RE.test(replyTo)) return res.status(400).json({ error: "INVALID_REPLY_TO" });
    if (!message) return res.status(400).json({ error: "MISSING_MESSAGE" });
    if (!EMAIL_RE.test(EMAILJS_FORM_TO_EMAIL)) return res.status(500).json({ error: "INVALID_TARGET_EMAIL" });

    const text = [
      `Sujet: ${subject}`,
      `Nom: ${fromName}`,
      `Email reponse: ${replyTo}`,
      "",
      message
    ].join("\n");
    const html = [
      `<div style="font-family:Arial,sans-serif;color:#17212e;line-height:1.5">`,
      `<h3 style="margin:0 0 8px;">${escapeHtml(subject)}</h3>`,
      `<p style="margin:0 0 6px;"><strong>Nom:</strong> ${escapeHtml(fromName)}</p>`,
      `<p style="margin:0 0 10px;"><strong>Email reponse:</strong> ${escapeHtml(replyTo)}</p>`,
      `<pre style="white-space:pre-wrap;background:#f5f7fb;border-radius:8px;padding:10px;margin:0;">${escapeHtml(message)}</pre>`,
      `</div>`
    ].join("");

    const send = await sendMailWithFallback({
      to: EMAILJS_FORM_TO_EMAIL,
      subject,
      text,
      html,
      replyTo,
      fromName: ATELIER_COMPANY_NAME,
      emailjsTemplateParams: {
        subject,
        from_name: fromName,
        reply_to: replyTo,
        message,
        to_email: EMAILJS_FORM_TO_EMAIL
      },
      emailjsConfig: {
        serviceId: EMAILJS_FORM_SERVICE_ID,
        templateId: EMAILJS_FORM_TEMPLATE_ID,
        publicKey: EMAILJS_FORM_PUBLIC_KEY,
        privateKey: EMAILJS_FORM_PRIVATE_KEY
      }
    });

    if (!send.ok) {
      return res.status(502).json({ error: "MAIL_SEND_FAILED", detail: String(send.error || "").slice(0, 260) });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
