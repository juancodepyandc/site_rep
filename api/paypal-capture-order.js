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
const PAYPAL_CLIENT_ID_LIVE = String(process.env.PAYPAL_CLIENT_ID || "").trim();
const PAYPAL_CLIENT_SECRET_LIVE = String(process.env.PAYPAL_CLIENT_SECRET || "").trim();
const PAYPAL_CLIENT_ID_SANDBOX = String(process.env.PAYPAL_SANDBOX_CLIENT_ID || process.env.PAYPAL_CLIENT_ID_SANDBOX || "").trim();
const PAYPAL_CLIENT_SECRET_SANDBOX = String(process.env.PAYPAL_SANDBOX_CLIENT_SECRET || process.env.PAYPAL_CLIENT_SECRET_SANDBOX || "").trim();
const PAYPAL_SANDBOX_ENABLED = String(process.env.PAYPAL_SANDBOX_ENABLED || "0").trim() === "1";
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

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function compactAddress(address) {
  if (!address || typeof address !== "object") return "";
  return [
    address.address_line_1,
    address.address_line_2,
    [address.admin_area_2, address.admin_area_1].filter(Boolean).join(" "),
    address.postal_code,
    address.country_code
  ]
    .map((v) => String(v || "").trim())
    .filter(Boolean)
    .join(", ");
}

function extractPayPalDetails(captureData) {
  const payer = captureData?.payer || {};
  const shipping = captureData?.purchase_units?.[0]?.shipping || {};
  const payerPhone =
    payer?.phone?.phone_number?.national_number ||
    payer?.phone?.phone_number?.international_number ||
    captureData?.payment_source?.paypal?.phone?.phone_number?.national_number ||
    captureData?.payment_source?.paypal?.phone?.phone_number?.international_number ||
    "";
  return {
    payerName: [payer?.name?.given_name || "", payer?.name?.surname || ""].join(" ").trim(),
    payerEmail: String(payer?.email_address || "").trim().toLowerCase(),
    payerPhone: String(payerPhone || "").trim(),
    shippingName: String(shipping?.name?.full_name || "").trim(),
    shippingAddress: compactAddress(shipping?.address || {})
  };
}

function extractAmountAndCurrency(captureData) {
  const captureAmount = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.amount || {};
  const unitAmount = captureData?.purchase_units?.[0]?.amount || {};
  const value = Number(captureAmount?.value || unitAmount?.value || 0);
  const currency = String(captureAmount?.currency_code || unitAmount?.currency_code || "EUR").trim().toUpperCase();
  return { value, currency };
}

function normalizePayPalMode(value) {
  const mode = String(value || "").trim().toLowerCase();
  if (mode === "live" || mode === "sandbox") return mode;
  return "";
}

function resolvePayPalConfig({ requestedMode }) {
  const defaultMode = process.env.PAYPAL_ENV === "sandbox" ? "sandbox" : "live";
  const mode = requestedMode || defaultMode;

  if (mode === "sandbox") {
    if (!PAYPAL_SANDBOX_ENABLED) {
      return { error: "PAYPAL_SANDBOX_DISABLED" };
    }
    if (!PAYPAL_CLIENT_ID_SANDBOX || !PAYPAL_CLIENT_SECRET_SANDBOX) {
      return { error: "PAYPAL_SANDBOX_MISSING_CREDENTIALS" };
    }
    return {
      mode,
      baseUrl: "https://api-m.sandbox.paypal.com",
      clientId: PAYPAL_CLIENT_ID_SANDBOX,
      secret: PAYPAL_CLIENT_SECRET_SANDBOX
    };
  }

  if (!PAYPAL_CLIENT_ID_LIVE || !PAYPAL_CLIENT_SECRET_LIVE) {
    return { error: "PAYPAL_LIVE_MISSING_CREDENTIALS" };
  }
  return {
    mode: "live",
    baseUrl: "https://api-m.paypal.com",
    clientId: PAYPAL_CLIENT_ID_LIVE,
    secret: PAYPAL_CLIENT_SECRET_LIVE
  };
}

function buildEmailHtml(invoice) {
  const partsRows = invoice.parts
    .map((line) => {
      const [left, ...rest] = String(line || "").split(":");
      const right = rest.join(":").trim();
      return `<tr>
        <td style="padding:9px 11px;border-bottom:1px solid #e3ebf5;color:#3d526f;font-size:13px;width:38%;background:#fbfdff;">${escapeHtml(left || "Composant")}</td>
        <td style="padding:9px 11px;border-bottom:1px solid #e3ebf5;color:#12243b;font-size:13px;font-weight:600;background:#ffffff;">${escapeHtml(right || line)}</td>
      </tr>`;
    })
    .join("");
  const companyLine = [ATELIER_COMPANY_ADDRESS, ATELIER_COMPANY_PHONE, ATELIER_COMPANY_EMAIL].filter(Boolean).join(" • ");
  const usageLine = String(invoice.usage || "").trim();
  return [
    `<div style="margin:0;padding:28px 14px;background:#edf2f8;font-family:Arial,Helvetica,sans-serif;color:#12263f;">`,
    `<div style="max-width:820px;margin:0 auto;background:#ffffff;border:1px solid #d6e0ec;border-radius:16px;overflow:hidden;box-shadow:0 12px 28px rgba(14,32,56,.08);">`,
    `<div style="background:linear-gradient(130deg,#0f2f52 0%,#1f5f96 72%,#2f76b4 100%);padding:22px 24px;color:#ffffff;">`,
    `<div style="display:inline-block;padding:7px 11px;border-radius:999px;background:#ffffff;color:#153a61;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;font-weight:800;">${escapeHtml(ATELIER_COMPANY_NAME)}</div>`,
    `<div style="margin-top:10px;padding:12px 14px;border-radius:12px;background:#ffffff;color:#102844;font-size:28px;line-height:1.2;font-weight:900;letter-spacing:-0.01em;">Facture ${escapeHtml(invoice.invoiceNumber)}</div>`,
    `<div style="margin-top:10px;display:inline-block;padding:8px 11px;border-radius:999px;background:rgba(255,255,255,.92);border:1px solid rgba(20,57,91,.2);font-size:12px;font-weight:800;color:#1a4068;">Paiement PayPal confirme • ${escapeHtml(invoice.createdAtFr)}</div>`,
    `</div>`,
    `<div style="padding:22px 24px 10px 24px;">`,
    `<p style="margin:0 0 14px 0;font-size:14px;line-height:1.62;color:#1b2f49;">Bonjour <strong>${escapeHtml(invoice.buyerName)}</strong>,<br/>Merci pour votre commande. Cette facture reprend votre configuration validee et le paiement capture.</p>`,
    `<div style="margin:0 0 14px 0;padding:12px 14px;border:1px solid #c9daef;background:#f4f9ff;border-radius:12px;font-size:12px;line-height:1.55;color:#214162;"><strong style="display:block;font-size:12px;color:#163255;margin-bottom:4px;">Document de facturation</strong>Ce message vaut facture email. Conservez cette reference pour le suivi atelier.</div>`,
    `<table role="presentation" width="100%" style="border-collapse:separate;border-spacing:0 8px;margin:0 0 14px 0;">`,
    `<tr><td style="font-size:12px;color:#5a718f;width:33%;">Ref. devis</td><td style="font-size:13px;font-weight:700;color:#102743;">${escapeHtml(invoice.quoteCode)}</td></tr>`,
    `<tr><td style="font-size:12px;color:#5a718f;">Commande PayPal</td><td style="font-size:13px;font-weight:700;color:#102743;">${escapeHtml(invoice.orderID)}</td></tr>`,
    `<tr><td style="font-size:12px;color:#5a718f;">Capture</td><td style="font-size:13px;font-weight:700;color:#102743;">${escapeHtml(invoice.captureId)}</td></tr>`,
    invoice.payerPhone ? `<tr><td style="font-size:12px;color:#5a718f;">Telephone</td><td style="font-size:13px;font-weight:700;color:#102743;">${escapeHtml(invoice.payerPhone)}</td></tr>` : "",
    invoice.shippingAddress ? `<tr><td style="font-size:12px;color:#5a718f;">Adresse livraison</td><td style="font-size:13px;font-weight:700;color:#102743;">${escapeHtml(invoice.shippingAddress)}</td></tr>` : "",
    usageLine ? `<tr><td style="font-size:12px;color:#5a718f;">Usage</td><td style="font-size:13px;font-weight:700;color:#102743;">${escapeHtml(usageLine)}</td></tr>` : "",
    `</table>`,
    `<table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 16px 0;border:1px solid #d8e3f1;border-radius:12px;overflow:hidden;">`,
    `<tr style="background:#eff4fb;">`,
    `<td style="padding:11px 12px;font-size:12px;color:#456180;font-weight:700;">Montant HT</td>`,
    `<td style="padding:11px 12px;font-size:12px;color:#456180;font-weight:700;">TVA (20%)</td>`,
    `<td style="padding:11px 12px;font-size:12px;color:#456180;font-weight:700;">Montant TTC</td>`,
    `</tr>`,
    `<tr>`,
    `<td style="padding:11px 12px;font-size:14px;font-weight:700;color:#10243d;">${escapeHtml(invoice.subtotalLabel)}</td>`,
    `<td style="padding:11px 12px;font-size:14px;font-weight:700;color:#10243d;">${escapeHtml(invoice.vatLabel)}</td>`,
    `<td style="padding:11px 12px;font-size:16px;font-weight:800;color:#0d4b80;">${escapeHtml(invoice.amountLabel)}</td>`,
    `</tr>`,
    `</table>`,
    `<div style="font-size:13px;font-weight:800;color:#173552;margin:0 0 8px 0;">Configuration detaillee</div>`,
    `<table role="presentation" width="100%" style="border-collapse:collapse;border:1px solid #d8e3f1;border-radius:12px;overflow:hidden;margin:0 0 12px 0;">${partsRows}</table>`,
    `</div>`,
    `<div style="padding:13px 24px 16px 24px;background:#f6f9fe;border-top:1px solid #dfe8f4;font-size:12px;color:#576f8d;">${escapeHtml(companyLine || ATELIER_COMPANY_EMAIL)}</div>`,
    `</div>`,
    `</div>`
  ].join("");
}

function buildEmailText(invoice) {
  return [
    `${ATELIER_COMPANY_NAME} - FACTURE ${invoice.invoiceNumber}`,
    "========================================",
    `Date: ${invoice.createdAtFr}`,
    `Client: ${invoice.buyerName} <${invoice.buyerEmail}>`,
    `Ref devis: ${invoice.quoteCode}`,
    `Commande PayPal: ${invoice.orderID}`,
    `Capture: ${invoice.captureId}`,
    `Telephone: ${invoice.payerPhone || "N/A"}`,
    `Adresse livraison: ${invoice.shippingAddress || "N/A"}`,
    `Usage: ${invoice.usage || "N/A"}`,
    "",
    "MONTANTS",
    `- HT: ${invoice.subtotalLabel}`,
    `- TVA (20%): ${invoice.vatLabel}`,
    `- TTC: ${invoice.amountLabel}`,
    "",
    "CONFIGURATION",
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
  const { value: amount, currency } = extractAmountAndCurrency(captureData);
  const requesterName = String(record?.requester?.name || "").trim();
  const requesterEmail = String(record?.requester?.email || "").trim().toLowerCase();
  const paypalDetails = extractPayPalDetails(captureData);
  const payerEmail = String(paypalDetails.payerEmail || "").trim().toLowerCase();
  const buyerName = requesterName || paypalDetails.payerName;
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
    payerPhone: paypalDetails.payerPhone,
    shippingAddress: paypalDetails.shippingAddress,
    shippingName: paypalDetails.shippingName,
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
    const requestedMode = normalizePayPalMode(req.body?.paypalMode || req.body?.paypal_mode || "");
    if (!requestedMode && (req.body?.paypalMode || req.body?.paypal_mode)) {
      return res.status(400).json({ error: "INVALID_PAYPAL_MODE" });
    }
    const paypal = resolvePayPalConfig({ requestedMode });
    if (paypal.error === "PAYPAL_SANDBOX_DISABLED") return res.status(403).json({ error: paypal.error });
    if (paypal.error) return res.status(500).json({ error: paypal.error });

    const { orderID } = req.body || {};
    const order = String(orderID || "").trim();
    if (!order) return res.status(400).json({ error: "Missing orderID" });
    if (!/^[A-Z0-9\-]{10,64}$/i.test(order)) return res.status(400).json({ error: "Invalid orderID" });

    const auth = Buffer.from(`${paypal.clientId}:${paypal.secret}`).toString("base64");

    const tokenRes = await fetch(`${paypal.baseUrl}/v1/oauth2/token`, {
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
      `${paypal.baseUrl}/v2/checkout/orders/${encodeURIComponent(order)}/capture`,
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

    let quoteCode = pickQuoteCode(captureData);
    let quoteRecord = null;
    let redis = null;
    let orderLink = null;
    try {
      redis = await getRedisClient();
    } catch {
      redis = null;
    }
    if (redis) {
      try {
        const rawLink = await redis.get(`paypal:order:${order}`);
        if (rawLink) orderLink = JSON.parse(rawLink);
      } catch {
        orderLink = null;
      }
    }
    if (!QUOTE_CODE_RE.test(quoteCode) && QUOTE_CODE_RE.test(orderLink?.quoteCode || "")) {
      quoteCode = String(orderLink.quoteCode || "").trim().toUpperCase();
    }
    if (QUOTE_CODE_RE.test(quoteCode) && redis) {
      try {
        const raw = await redis.get(`quote:${quoteCode}`);
        if (raw) quoteRecord = JSON.parse(raw);
      } catch {
        quoteRecord = null;
      }
    }
    if (!quoteRecord && orderLink?.summary && typeof orderLink.summary === "object") {
      const summary = orderLink.summary;
      const parts = {};
      if (summary.cpu) parts.cpu = String(summary.cpu).trim();
      if (summary.gpu) parts.gpu = String(summary.gpu).trim();
      if (summary.ram) parts.ram = String(summary.ram).trim();
      const fallbackTotal = Number(orderLink.amount || 0);
      quoteRecord = {
        requester: {},
        config: {
          total: Number.isFinite(fallbackTotal) && fallbackTotal > 0 ? fallbackTotal : 0,
          parts
        },
        usage: ""
      };
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
        payer_phone: invoice.payerPhone || "",
        shipping_name: invoice.shippingName || "",
        shipping_address: invoice.shippingAddress || "",
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
          `[Commande ${paypal.mode === "sandbox" ? "SANDBOX" : "LIVE"}] ${invoice.invoiceNumber} - ${invoice.quoteCode}`
        );
      }
    }

    // Marque automatiquement le devis comme regle apres capture reussie en live.
    if (paypal.mode === "live" && redis && quoteRecord && QUOTE_CODE_RE.test(quoteCode)) {
      try {
        const nowIso = new Date().toISOString();
        quoteRecord.adminStatus = { state: "settled", updatedAt: nowIso };
        quoteRecord.updatedAt = nowIso;
        quoteRecord.payment = {
          provider: "paypal",
          mode: "live",
          orderID: invoice.orderID,
          captureId: invoice.captureId,
          amount: invoice.amountLabel,
          payerEmail: invoice.buyerEmail,
          payerPhone: invoice.payerPhone || "",
          shippingName: invoice.shippingName || "",
          shippingAddress: invoice.shippingAddress || "",
          paidAt: nowIso
        };
        await redis.set(`quote:${quoteCode}`, JSON.stringify(quoteRecord), { EX: 30 * 24 * 60 * 60 });
      } catch (err) {
        console.error("Failed to persist settled status after PayPal capture:", err);
      }
    }

    return res.status(200).json({
      ok: true,
      capture: captureData,
      quoteCode: quoteCode || "",
      receiptEmail,
      paypalMode: paypal.mode
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "PayPal capture failed" });
  }
}
