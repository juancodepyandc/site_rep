import { Resend } from "resend";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const RESEND_API_KEY = String(process.env.RESEND_API_KEY || "").trim();
const RESEND_FROM_EMAIL = String(process.env.RESEND_FROM_EMAIL || process.env.MAIL_FROM || "onboarding@resend.dev").trim();
const RESEND_FROM_NAME = String(process.env.RESEND_FROM_NAME || process.env.ATELIER_COMPANY_NAME || "Atelier Electronique").trim();

const EMAILJS_SERVICE_ID = String(process.env.EMAILJS_SERVICE_ID || "").trim();
const EMAILJS_TEMPLATE_ID = String(process.env.EMAILJS_TEMPLATE_ID || "").trim();
const EMAILJS_PUBLIC_KEY = String(process.env.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_USER_ID || "").trim();
const EMAILJS_PRIVATE_KEY = String(process.env.EMAILJS_PRIVATE_KEY || "").trim();

const SMTP_HOST = String(process.env.SMTP_HOST || "").trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || 0);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "").trim().toLowerCase() === "true";
const SMTP_USER = String(process.env.SMTP_USER || "").trim();
const SMTP_PASS = String(process.env.SMTP_PASS || "").trim();
const SMTP_FROM_EMAIL = String(process.env.SMTP_FROM_EMAIL || "").trim().toLowerCase();

const GMAIL_USER = String(process.env.GMAIL_USER || "").trim().toLowerCase();
const GMAIL_APP_PASSWORD = String(process.env.GMAIL_APP_PASSWORD || "").trim();

function normalizeEmailList(value) {
  const arr = Array.isArray(value) ? value : [value];
  return arr
    .map((v) => String(v || "").trim().toLowerCase())
    .filter((v) => EMAIL_RE.test(v));
}

function sanitizeSubject(value) {
  return String(value || "").trim().slice(0, 220);
}

function sanitizeText(value, max = 50000) {
  return String(value || "").trim().slice(0, max);
}

function buildFromHeader(fromName, fromEmail) {
  const name = String(fromName || RESEND_FROM_NAME || "Atelier Electronique").trim().replace(/[<>\r\n]/g, "");
  const email = String(fromEmail || RESEND_FROM_EMAIL || "onboarding@resend.dev").trim().toLowerCase();
  return `${name} <${email}>`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendMailViaResend({
  to,
  subject,
  text = "",
  html = "",
  replyTo = "",
  fromName = "",
  fromEmail = ""
}) {
  if (!RESEND_API_KEY) {
    return { ok: false, provider: "resend", error: "RESEND_NOT_CONFIGURED" };
  }

  const toList = normalizeEmailList(to);
  if (!toList.length) return { ok: false, provider: "resend", error: "INVALID_TO_EMAIL" };
  const safeSubject = sanitizeSubject(subject);
  if (!safeSubject) return { ok: false, provider: "resend", error: "MISSING_SUBJECT" };

  try {
    const resend = new Resend(RESEND_API_KEY);
    const basePayload = {
      to: toList,
      subject: safeSubject,
      text: sanitizeText(text),
      html: sanitizeText(html),
      replyTo: EMAIL_RE.test(String(replyTo || "").trim().toLowerCase())
        ? String(replyTo).trim().toLowerCase()
        : undefined
    };

    const attemptSend = async (senderEmail = "") => {
      const payload = {
        ...basePayload,
        from: buildFromHeader(fromName, senderEmail || fromEmail)
      };
      const run = async () => {
        const result = await resend.emails.send(payload);
        if (result?.error) {
          return { ok: false, provider: "resend", error: String(result.error?.message || "RESEND_SEND_FAILED") };
        }
        return { ok: true, provider: "resend", id: String(result?.data?.id || "") };
      };

      const first = await run();
      if (first.ok) return first;
      if (!String(first.error || "").toLowerCase().includes("too many requests")) return first;
      await sleep(700);
      return run();
    };

    const firstAttempt = await attemptSend();
    if (firstAttempt.ok) return firstAttempt;

    const firstError = String(firstAttempt.error || "");
    if (!firstError.toLowerCase().includes("domain is not verified")) {
      return firstAttempt;
    }

    const retryWithOnboarding = await attemptSend("onboarding@resend.dev");
    if (retryWithOnboarding.ok) {
      return {
        ...retryWithOnboarding,
        provider: "resend",
        fallbackSender: "onboarding@resend.dev"
      };
    }

    return {
      ok: false,
      provider: "resend",
      error: `${firstError} | ${String(retryWithOnboarding.error || "RESEND_SEND_FAILED")}`
    };
  } catch (err) {
    return { ok: false, provider: "resend", error: String(err?.message || err || "RESEND_SEND_FAILED") };
  }
}

export async function sendMailViaEmailJS({
  templateParams,
  serviceId = EMAILJS_SERVICE_ID,
  templateId = EMAILJS_TEMPLATE_ID,
  publicKey = EMAILJS_PUBLIC_KEY,
  privateKey = EMAILJS_PRIVATE_KEY
}) {
  if (!serviceId || !templateId || !publicKey) {
    return { ok: false, provider: "emailjs", error: "EMAILJS_NOT_CONFIGURED" };
  }

  const requestBody = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams && typeof templateParams === "object" ? templateParams : {}
  };
  if (privateKey) requestBody.accessToken = privateKey;

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, provider: "emailjs", error: `EMAILJS_SEND_FAILED:${res.status}${detail ? `:${detail.slice(0, 120)}` : ""}` };
    }
    return { ok: true, provider: "emailjs" };
  } catch (err) {
    return { ok: false, provider: "emailjs", error: String(err?.message || err || "EMAILJS_SEND_FAILED") };
  }
}

function buildSmtpTransport() {
  if (GMAIL_USER && GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
    });
  }
  if (SMTP_HOST && SMTP_PORT > 0 && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
  }
  return null;
}

export async function sendMailViaSmtp({
  to,
  subject,
  text = "",
  html = "",
  replyTo = "",
  fromName = "",
  fromEmail = ""
}) {
  const toList = normalizeEmailList(to);
  if (!toList.length) return { ok: false, provider: "smtp", error: "INVALID_TO_EMAIL" };
  const safeSubject = sanitizeSubject(subject);
  if (!safeSubject) return { ok: false, provider: "smtp", error: "MISSING_SUBJECT" };

  const transporter = buildSmtpTransport();
  if (!transporter) return { ok: false, provider: "smtp", error: "SMTP_NOT_CONFIGURED" };

  const senderEmail = String(
    fromEmail ||
    SMTP_FROM_EMAIL ||
    GMAIL_USER ||
    SMTP_USER ||
    RESEND_FROM_EMAIL ||
    "onboarding@resend.dev"
  ).trim().toLowerCase();
  const senderName = String(fromName || RESEND_FROM_NAME || "Atelier Electronique").trim().replace(/[<>\r\n]/g, "");
  const safeText = sanitizeText(text);
  const safeHtml = sanitizeText(html);

  try {
    const info = await transporter.sendMail({
      from: `${senderName} <${senderEmail}>`,
      to: toList.join(", "),
      subject: safeSubject,
      text: safeText || undefined,
      html: safeHtml || undefined,
      replyTo: EMAIL_RE.test(String(replyTo || "").trim().toLowerCase())
        ? String(replyTo).trim().toLowerCase()
        : undefined
    });
    return { ok: true, provider: "smtp", id: String(info?.messageId || "") };
  } catch (err) {
    return { ok: false, provider: "smtp", error: String(err?.message || err || "SMTP_SEND_FAILED") };
  }
}

export async function sendMailWithFallback({
  to,
  subject,
  text = "",
  html = "",
  replyTo = "",
  fromName = "",
  fromEmail = "",
  emailjsTemplateParams = null,
  emailjsConfig = null
}) {
  const resendAttempt = await sendMailViaResend({
    to,
    subject,
    text,
    html,
    replyTo,
    fromName,
    fromEmail
  });
  if (resendAttempt.ok) return resendAttempt;

  const smtpAttempt = await sendMailViaSmtp({
    to,
    subject,
    text,
    html,
    replyTo,
    fromName,
    fromEmail
  });
  if (smtpAttempt.ok) return smtpAttempt;

  if (!emailjsTemplateParams) {
    return {
      ok: false,
      provider: "none",
      error: `${resendAttempt.error || "RESEND_FAILED"} | ${smtpAttempt.error || "SMTP_FAILED"}`
    };
  }
  const emailjsAttempt = await sendMailViaEmailJS({
    templateParams: emailjsTemplateParams,
    serviceId: emailjsConfig?.serviceId,
    templateId: emailjsConfig?.templateId,
    publicKey: emailjsConfig?.publicKey,
    privateKey: emailjsConfig?.privateKey
  });
  if (emailjsAttempt.ok) return emailjsAttempt;

  return {
    ok: false,
    provider: "none",
    error: `${resendAttempt.error || "RESEND_FAILED"} | ${smtpAttempt.error || "SMTP_FAILED"} | ${emailjsAttempt.error || "EMAILJS_FAILED"}`
  };
}
