import { getRedisClient } from "./_redis.js";

const ADMIN_MODIFY_KEY = String(process.env.ADMIN_MODIFY_KEY || process.env.ADMIN_SECRET || "").trim();
const EMAILJS_SERVICE_ID = String(
  process.env.EMAILJS_RECEIPT_SERVICE_ID || process.env.EMAILJS_SERVICE_ID || ""
).trim();
const EMAILJS_TEMPLATE_ID_RECEIPT = String(
  process.env.EMAILJS_RECEIPT_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID_RECEIPT || process.env.EMAILJS_TEMPLATE_ID || ""
).trim();
const EMAILJS_PUBLIC_KEY = String(
  process.env.EMAILJS_RECEIPT_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_USER_ID || ""
).trim();
const EMAILJS_PRIVATE_KEY = String(process.env.EMAILJS_RECEIPT_PRIVATE_KEY || process.env.EMAILJS_PRIVATE_KEY || "").trim();
const ATELIER_RECEIPT_COPY_EMAIL = String(process.env.ATELIER_RECEIPT_COPY_EMAIL || "rabuteaujuandavid@gmail.com").trim().toLowerCase();
const ATELIER_COMPANY_NAME = String(process.env.ATELIER_COMPANY_NAME || "Atelier Electronique").trim();
const ATELIER_COMPANY_EMAIL = String(process.env.ATELIER_COMPANY_EMAIL || "rabuteaujuandavid@gmail.com").trim().toLowerCase();
const ATELIER_COMPANY_PHONE = String(process.env.ATELIER_COMPANY_PHONE || "").trim();
const ATELIER_COMPANY_ADDRESS = String(process.env.ATELIER_COMPANY_ADDRESS || "").trim();

const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function normalizeCode(value) {
  return String(value || "").trim().toUpperCase();
}

function clampText(value, max = 300) {
  return String(value || "").trim().slice(0, max);
}

function formatDateFr(dateLike) {
  const d = new Date(dateLike || Date.now());
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function parseKeyLabel(key) {
  const map = {
    cpu: "CPU",
    mobo: "Carte mere",
    ram: "RAM",
    gpu: "Carte graphique",
    storage: "Stockage",
    psu: "Alimentation",
    case: "Boitier",
    cooling: "Refroidissement",
    customCable: "Cables personnalises",
    cableMgmt: "Cable management",
    delivery: "Traitement atelier"
  };
  return map[String(key || "").trim()] || String(key || "").trim() || "Composant";
}

function formatMoney(value, currency = "EUR") {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return "N/A";
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

function buildEmailHtml(invoice) {
  const listHtml = invoice.parts
    .map((line) => `<li style="margin-bottom:4px;">${line}</li>`)
    .join("");
  const companyLine = [ATELIER_COMPANY_ADDRESS, ATELIER_COMPANY_PHONE, ATELIER_COMPANY_EMAIL].filter(Boolean).join(" • ");
  return [
    `<div style="font-family:Arial,sans-serif;color:#152030;line-height:1.5">`,
    `<h2 style="margin:0 0 10px;">${ATELIER_COMPANY_NAME} - Facture ${invoice.invoiceNumber}</h2>`,
    `<p style="margin:0 0 12px;">Bonjour ${invoice.buyerName},<br>Ceci est une previsualisation de facture (test sans paiement PayPal).</p>`,
    `<p style="margin:0 0 10px;"><strong>Code devis:</strong> ${invoice.quoteCode}<br><strong>Reference test:</strong> ${invoice.orderID}<br><strong>Date:</strong> ${invoice.createdAtFr}</p>`,
    `<p style="margin:0 0 10px;"><strong>Montant TTC:</strong> ${invoice.amountLabel}<br><strong>TVA (20%):</strong> ${invoice.vatLabel}<br><strong>Montant HT:</strong> ${invoice.subtotalLabel}</p>`,
    `<p style="margin:0 0 6px;"><strong>Configuration:</strong></p>`,
    `<ul style="margin:0 0 12px 18px;padding:0;">${listHtml}</ul>`,
    `<p style="margin:0 0 8px;">Email de test: aucune transaction n'a ete effectuee.</p>`,
    `<p style="margin:0;font-size:12px;color:#4b5a71">${companyLine}</p>`,
    `</div>`
  ].join("");
}

function buildEmailText(invoice) {
  return [
    `${ATELIER_COMPANY_NAME} - FACTURE TEST ${invoice.invoiceNumber}`,
    `Date: ${invoice.createdAtFr}`,
    `Client: ${invoice.buyerName} <${invoice.buyerEmail}>`,
    `Code devis: ${invoice.quoteCode}`,
    `Reference test: ${invoice.orderID}`,
    `Montant TTC: ${invoice.amountLabel}`,
    `TVA (20%): ${invoice.vatLabel}`,
    `Montant HT: ${invoice.subtotalLabel}`,
    "Configuration:",
    ...invoice.parts.map((line) => `- ${line}`),
    "",
    "Email de test sans paiement PayPal."
  ].join("\n");
}

function invoicePayload({ code, record, targetEmail }) {
  const quoteCode = normalizeCode(code);
  const amount = Number(record?.config?.total || 0);
  const subtotal = amount > 0 ? amount / 1.2 : 0;
  const vat = amount > 0 ? amount - subtotal : 0;
  const nowIso = new Date().toISOString();
  const orderID = `TEST-${Date.now().toString(36).toUpperCase()}`;
  const invoiceNumber = `FACT-TEST-${quoteCode}-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const parts = [];
  const sourceParts = record?.config?.parts && typeof record.config.parts === "object" ? record.config.parts : {};
  Object.entries(sourceParts).forEach(([key, value]) => {
    const clean = String(value || "").trim();
    if (!clean) return;
    parts.push(`${parseKeyLabel(key)}: ${clean}`);
  });
  if (!parts.length) {
    parts.push("Configuration non disponible.");
  }

  const buyerName = clampText(record?.requester?.name || "Client", 120);
  return {
    buyerName,
    buyerEmail: String(targetEmail || "").trim().toLowerCase(),
    quoteCode,
    orderID,
    invoiceNumber,
    amountLabel: Number.isFinite(amount) && amount > 0 ? formatMoney(amount, "EUR") : "N/A",
    subtotalLabel: Number.isFinite(subtotal) && subtotal > 0 ? formatMoney(subtotal, "EUR") : "N/A",
    vatLabel: Number.isFinite(vat) && vat > 0 ? formatMoney(vat, "EUR") : "N/A",
    createdAt: nowIso,
    createdAtFr: formatDateFr(nowIso),
    usage: String(record?.usage || "").trim() || "N/A",
    parts
  };
}

async function sendReceiptByEmailJS(payload) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID_RECEIPT || !EMAILJS_PUBLIC_KEY) {
    return { ok: false, error: "EMAILJS_NOT_CONFIGURED" };
  }

  const requestBody = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID_RECEIPT,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: payload
  };
  if (EMAILJS_PRIVATE_KEY) requestBody.accessToken = EMAILJS_PRIVATE_KEY;

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return { ok: false, error: `EMAILJS_SEND_FAILED:${res.status}${detail ? `:${detail.slice(0, 120)}` : ""}` };
  }
  return { ok: true };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    if (!ADMIN_MODIFY_KEY) return res.status(503).json({ error: "ADMIN_NOT_CONFIGURED" });

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const adminKey = String(body.admin_key || body.adminKey || "").trim();
    if (!adminKey || adminKey !== ADMIN_MODIFY_KEY) return res.status(403).json({ error: "ADMIN_KEY_INVALID" });

    const code = normalizeCode(body.code || "");
    if (!code) return res.status(400).json({ error: "MISSING_CODE" });
    if (!QUOTE_CODE_RE.test(code)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });

    const redis = await getRedisClient();
    const raw = await redis.get(`quote:${code}`);
    if (!raw) return res.status(404).json({ error: "NOT_FOUND" });
    const record = JSON.parse(raw);

    const sendEmail = Boolean(body.send_email === true || body.sendEmail === true);
    const fallbackEmail = String(record?.requester?.email || "").trim().toLowerCase();
    let targetEmail = String(body.to_email || body.toEmail || fallbackEmail).trim().toLowerCase();
    if (sendEmail && (!targetEmail || !EMAIL_RE.test(targetEmail))) {
      return res.status(400).json({ error: "INVALID_TARGET_EMAIL" });
    }
    if (!targetEmail || !EMAIL_RE.test(targetEmail)) {
      targetEmail = EMAIL_RE.test(ATELIER_COMPANY_EMAIL) ? ATELIER_COMPANY_EMAIL : "preview@atelier.local";
    }

    const invoice = invoicePayload({ code, record, targetEmail });
    const textBody = buildEmailText(invoice);
    const htmlBody = buildEmailHtml(invoice);

    const payload = {
      to_email: targetEmail,
      from_name: ATELIER_COMPANY_NAME,
      subject: `[TEST] Facture ${invoice.invoiceNumber} (${invoice.quoteCode})`,
      reply_to: ATELIER_COMPANY_EMAIL,
      buyer_name: invoice.buyerName,
      buyer_email: invoice.buyerEmail,
      quote_code: invoice.quoteCode,
      order_id: invoice.orderID,
      capture_id: invoice.orderID,
      invoice_number: invoice.invoiceNumber,
      invoice_date: invoice.createdAtFr,
      amount_paid: invoice.amountLabel,
      amount_subtotal: invoice.subtotalLabel,
      amount_vat: invoice.vatLabel,
      usage: invoice.usage,
      config_lines: invoice.parts.join(" | "),
      message_text: textBody,
      message_html: htmlBody
    };

    let emailSent = false;
    let sendError = "";

    if (sendEmail) {
      const sent = await sendReceiptByEmailJS(payload);
      emailSent = Boolean(sent.ok);
      if (!sent.ok) sendError = String(sent.error || "RECEIPT_EMAIL_SEND_FAILED");

      if (emailSent && ATELIER_RECEIPT_COPY_EMAIL && ATELIER_RECEIPT_COPY_EMAIL !== targetEmail && EMAIL_RE.test(ATELIER_RECEIPT_COPY_EMAIL)) {
        await sendReceiptByEmailJS({
          ...payload,
          to_email: ATELIER_RECEIPT_COPY_EMAIL,
          subject: `[Copie atelier][TEST] ${invoice.invoiceNumber} - ${invoice.quoteCode}`
        });
      }
    }

    return res.status(200).json({
      ok: true,
      code,
      sentTo: targetEmail,
      invoiceNumber: invoice.invoiceNumber,
      emailSent,
      sendError,
      preview: {
        subject: payload.subject,
        amount: invoice.amountLabel,
        html: payload.message_html,
        text: payload.message_text
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
