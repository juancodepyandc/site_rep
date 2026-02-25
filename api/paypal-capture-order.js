import { getRedisClient } from "./_redis.js";
import { sendMailWithFallback } from "../lib/mailer.js";

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

function toAscii(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ");
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
    `<p style="margin:0 0 12px;">Bonjour ${invoice.buyerName},<br>Merci pour votre commande. Votre paiement a bien ete valide.</p>`,
    `<p style="margin:0 0 10px;"><strong>Code devis:</strong> ${invoice.quoteCode}<br><strong>Commande PayPal:</strong> ${invoice.orderID}<br><strong>Date:</strong> ${invoice.createdAtFr}</p>`,
    `<p style="margin:0 0 10px;"><strong>Montant TTC:</strong> ${invoice.amountLabel}<br><strong>TVA (20%):</strong> ${invoice.vatLabel}<br><strong>Montant HT:</strong> ${invoice.subtotalLabel}</p>`,
    `<p style="margin:0 0 6px;"><strong>Configuration:</strong></p>`,
    `<ul style="margin:0 0 12px 18px;padding:0;">${listHtml}</ul>`,
    `<p style="margin:0 0 8px;">Cette facture est incluse directement dans cet email.</p>`,
    `<p style="margin:0;font-size:12px;color:#4b5a71">${companyLine}</p>`,
    `</div>`
  ].join("");
}

function buildEmailText(invoice) {
  return [
    `${ATELIER_COMPANY_NAME} - FACTURE ${invoice.invoiceNumber}`,
    `Date: ${invoice.createdAtFr}`,
    `Client: ${invoice.buyerName} <${invoice.buyerEmail}>`,
    `Code devis: ${invoice.quoteCode}`,
    `Commande PayPal: ${invoice.orderID}`,
    `Capture: ${invoice.captureId}`,
    `Montant TTC: ${invoice.amountLabel}`,
    `TVA (20%): ${invoice.vatLabel}`,
    `Montant HT: ${invoice.subtotalLabel}`,
    "Configuration:",
    ...invoice.parts.map((line) => `- ${line}`),
    "",
    `Contact atelier: ${ATELIER_COMPANY_EMAIL}`
  ].join("\n");
}

function pickQuoteCode(captureData) {
  const unit = captureData?.purchase_units?.[0] || {};
  const custom = String(unit?.custom_id || "").trim().toUpperCase();
  if (QUOTE_CODE_RE.test(custom)) return custom;
  const description = String(unit?.description || "").toUpperCase();
  const fromDesc = description.match(/DV-[A-Z0-9]{6,14}/);
  return fromDesc ? fromDesc[0] : "";
}

function invoicePayload({ quoteCode, orderID, captureData, record }) {
  const captureId = String(
    captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
    captureData?.id ||
    orderID
  ).trim();
  const amount = Number(captureData?.purchase_units?.[0]?.amount?.value || 0);
  const currency = String(captureData?.purchase_units?.[0]?.amount?.currency_code || "EUR").trim().toUpperCase();
  const requesterName = String(record?.requester?.name || "").trim();
  const requesterEmail = String(record?.requester?.email || "").trim().toLowerCase();
  const payerEmail = String(captureData?.payer?.email_address || "").trim().toLowerCase();
  const buyerName = requesterName || [
    captureData?.payer?.name?.given_name || "",
    captureData?.payer?.name?.surname || ""
  ].join(" ").trim();
  const buyerEmail = requesterEmail || payerEmail;
  const invoiceNumber = quoteCode
    ? `FACT-${quoteCode}-${String(captureId).slice(-6).toUpperCase()}`
    : `FACT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(captureId).slice(-6).toUpperCase()}`;

  const parts = [];
  const sourceParts = record?.config?.parts && typeof record.config.parts === "object" ? record.config.parts : {};
  Object.entries(sourceParts).forEach(([key, value]) => {
    const clean = String(value || "").trim();
    if (!clean) return;
    parts.push(`${parseKeyLabel(key)}: ${clean}`);
  });
  if (!parts.length) {
    const desc = String(captureData?.purchase_units?.[0]?.description || "").trim();
    if (desc) parts.push(`Description: ${desc}`);
  }

  const subtotal = amount > 0 ? amount / 1.2 : 0;
  const vat = amount > 0 ? amount - subtotal : 0;
  const createdAtIso = new Date().toISOString();
  return {
    buyerName: buyerName || "Client",
    buyerEmail,
    quoteCode: quoteCode || "N/A",
    orderID: String(orderID || "").trim(),
    captureId,
    invoiceNumber,
    amountLabel: Number.isFinite(amount) && amount > 0 ? formatMoney(amount, currency) : "N/A",
    subtotalLabel: Number.isFinite(subtotal) && subtotal > 0 ? formatMoney(subtotal, currency) : "N/A",
    vatLabel: Number.isFinite(vat) && vat > 0 ? formatMoney(vat, currency) : "N/A",
    createdAt: createdAtIso,
    createdAtFr: formatDateFr(createdAtIso),
    parts,
    usage: String(record?.usage || "").trim() || "N/A",
    totalLabel: Number.isFinite(record?.config?.total) && Number(record.config.total) > 0
      ? formatMoney(Number(record.config.total), "EUR")
      : ""
  };
}

async function sendReceiptMail(payload, toEmail, subjectOverride = "") {
  const subject = subjectOverride || String(payload?.subject || "").trim();
  return sendMailWithFallback({
    to: toEmail,
    subject,
    text: String(payload?.message_text || ""),
    html: String(payload?.message_html || ""),
    replyTo: String(payload?.reply_to || ""),
    fromName: ATELIER_COMPANY_NAME,
    emailjsTemplateParams: {
      ...payload,
      to_email: toEmail,
      subject
    },
    emailjsConfig: {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID_RECEIPT,
      publicKey: EMAILJS_PUBLIC_KEY,
      privateKey: EMAILJS_PRIVATE_KEY
    }
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const env = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
    const baseUrl = env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !secret) {
      return res.status(500).json({ error: "Missing PayPal credentials" });
    }

    const { orderID } = req.body || {};
    const order = String(orderID || "").trim();
    if (!order) return res.status(400).json({ error: "Missing orderID" });
    if (!/^[A-Z0-9\-]{10,64}$/i.test(order)) return res.status(400).json({ error: "Invalid orderID" });

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData?.access_token) {
      return res.status(502).json({ error: "PAYPAL_AUTH_FAILED" });
    }

    const captureRes = await fetch(
      `${baseUrl}/v2/checkout/orders/${encodeURIComponent(order)}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const captureData = await captureRes.json();
    if (!captureRes.ok || !captureData?.id) {
      return res.status(502).json({ error: "PAYPAL_CAPTURE_FAILED" });
    }

    const quoteCode = pickQuoteCode(captureData);
    let quoteRecord = null;
    if (QUOTE_CODE_RE.test(quoteCode)) {
      try {
        const redis = await getRedisClient();
        const raw = await redis.get(`quote:${quoteCode}`);
        if (raw) quoteRecord = JSON.parse(raw);
      } catch {
        quoteRecord = null;
      }
    }

    const invoice = invoicePayload({
      quoteCode,
      orderID: order,
      captureData,
      record: quoteRecord
    });

    let receiptEmail = { sent: false, reason: "NO_CUSTOMER_EMAIL" };
    if (invoice.buyerEmail) {
      const textBody = buildEmailText(invoice);
      const htmlBody = buildEmailHtml(invoice);
      const payload = {
        to_email: invoice.buyerEmail,
        from_name: ATELIER_COMPANY_NAME,
        subject: `Facture ${invoice.invoiceNumber} (${invoice.quoteCode})`,
        reply_to: ATELIER_COMPANY_EMAIL,
        buyer_name: invoice.buyerName,
        buyer_email: invoice.buyerEmail,
        quote_code: invoice.quoteCode,
        order_id: invoice.orderID,
        capture_id: invoice.captureId,
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
      const emailResult = await sendReceiptMail(payload, invoice.buyerEmail);
      receiptEmail = {
        sent: Boolean(emailResult.ok),
        reason: emailResult.ok ? "" : String(emailResult.error || "EMAIL_SEND_FAILED")
      };

      if (ATELIER_RECEIPT_COPY_EMAIL && ATELIER_RECEIPT_COPY_EMAIL !== invoice.buyerEmail) {
        await sendReceiptMail(
          payload,
          ATELIER_RECEIPT_COPY_EMAIL,
          `[Copie atelier] ${invoice.invoiceNumber} - ${invoice.quoteCode}`
        );
      }
    }

    return res.status(200).json({
      ok: true,
      capture: captureData,
      quoteCode: quoteCode || "",
      receiptEmail
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "PayPal capture failed" });
  }
}
