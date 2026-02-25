import { getRedisClient } from "./_redis.js";

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const RATE_WINDOW_SECONDS = 60;
const RATE_MAX_PER_IP = 18;

function clampText(value, max = 5000) {
  return String(value || "").trim().slice(0, max);
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

    if (!EMAILJS_FORM_SERVICE_ID || !EMAILJS_FORM_TEMPLATE_ID || !EMAILJS_FORM_PUBLIC_KEY) {
      return res.status(503).json({ error: "FORM_EMAIL_NOT_CONFIGURED" });
    }

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

    const payload = {
      service_id: EMAILJS_FORM_SERVICE_ID,
      template_id: EMAILJS_FORM_TEMPLATE_ID,
      user_id: EMAILJS_FORM_PUBLIC_KEY,
      template_params: {
        subject,
        from_name: fromName,
        reply_to: replyTo,
        message,
        to_email: EMAILJS_FORM_TO_EMAIL
      }
    };
    if (EMAILJS_FORM_PRIVATE_KEY) payload.accessToken = EMAILJS_FORM_PRIVATE_KEY;

    const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!emailRes.ok) {
      const detail = await emailRes.text().catch(() => "");
      return res.status(502).json({ error: "EMAILJS_SEND_FAILED", detail: detail.slice(0, 200) });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
