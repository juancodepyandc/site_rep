import { getRedisClient } from "./_redis.js";
import { sendMailWithFallback } from "../lib/mailer.js";

const ADMIN_MODIFY_KEY = String(process.env.ADMIN_MODIFY_KEY || process.env.ADMIN_SECRET || "").trim();
const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const QUOTE_TTL_SECONDS = 30 * 24 * 60 * 60;

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

function normalizeCode(value) {
  return String(value || "").trim().toUpperCase();
}

function isAdminKeyValid(value) {
  const key = String(value || "").trim();
  return Boolean(ADMIN_MODIFY_KEY && key && key === ADMIN_MODIFY_KEY);
}

function readBody(req) {
  return req.body && typeof req.body === "object" ? req.body : {};
}

function toIsoOrEmpty(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

function euro(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n) || n <= 0) return "";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
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

function priorityFromRecord(record, pendingExists) {
  const deliveryId = String(record?.selects?.delivery || "").toLowerCase();
  const usage = String(record?.usage || "");
  let level = 1;
  const reasons = [];

  if (deliveryId.includes("priority")) {
    level = Math.max(level, 3);
    reasons.push("Traitement prioritaire");
  } else if (deliveryId.includes("normal")) {
    level = Math.max(level, 2);
    reasons.push("Traitement normal");
  } else {
    reasons.push("Traitement économique");
  }

  if (pendingExists) {
    level = Math.max(level, 3);
    reasons.push("OTP modification en attente");
  }

  if (/stream|creation|ia|4k|aaa/i.test(usage)) {
    level = Math.max(level, 2);
    if (!reasons.includes("Usage exigeant")) reasons.push("Usage exigeant");
  }

  const label = level >= 3 ? "haute" : level >= 2 ? "normale" : "basse";
  return { level, label, reason: reasons.join(" • ") };
}

function buildPartsSummary(record) {
  const parts = record?.config?.parts;
  if (!parts || typeof parts !== "object") return [];
  const fields = [
    ["CPU", "cpu"],
    ["Carte mère", "mobo"],
    ["RAM", "ram"],
    ["GPU", "gpu"],
    ["Stockage", "storage"],
    ["Alimentation", "psu"],
    ["Boîtier", "case"],
    ["Refroidissement", "cooling"]
  ];
  return fields
    .map(([label, key]) => {
      const value = String(parts[key] || "").trim();
      if (!value) return "";
      return `${label}: ${value}`;
    })
    .filter(Boolean)
    .slice(0, 12);
}

async function scanQuoteKeys(client) {
  const out = [];
  let cursor = "0";
  do {
    const result = await client.scan(cursor, { MATCH: "quote:DV-*", COUNT: 200 });
    cursor = String(result?.cursor || "0");
    const keys = Array.isArray(result?.keys) ? result.keys : [];
    out.push(...keys);
  } while (cursor !== "0");
  return out;
}

function buildReceiptInvoice({ code, record, targetEmail }) {
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
  if (!parts.length) parts.push("Configuration non disponible.");

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
    createdAtFr: formatDateFr(nowIso),
    usage: String(record?.usage || "").trim() || "N/A",
    parts
  };
}

function buildReceiptHtml(invoice) {
  const listHtml = invoice.parts.map((line) => `<li style="margin-bottom:4px;">${line}</li>`).join("");
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

function buildReceiptText(invoice) {
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

async function handleList(req, res, client) {
  const adminKey = String(req.query.admin_key || "").trim();
  if (!isAdminKeyValid(adminKey)) return res.status(403).json({ error: "ADMIN_KEY_INVALID" });

  const quoteKeys = await scanQuoteKeys(client);
  if (!quoteKeys.length) {
    return res.status(200).json({
      ok: true,
      quotes: [],
      stats: { open: 0, settled: 0, pendingModification: 0 }
    });
  }

  const quoteRaw = await client.mGet(quoteKeys);
  const codes = quoteKeys.map((key) => String(key || "").replace(/^quote:/, ""));
  const pendingRaw = await client.mGet(codes.map((code) => `quote:modify:req:${code}`));

  const quotes = [];
  for (let i = 0; i < quoteRaw.length; i += 1) {
    const raw = quoteRaw[i];
    const code = String(codes[i] || "").trim().toUpperCase();
    if (!raw || !QUOTE_CODE_RE.test(code)) continue;

    let record;
    try { record = JSON.parse(raw); } catch { continue; }
    let pending = null;
    if (pendingRaw[i]) {
      try { pending = JSON.parse(pendingRaw[i]); } catch { pending = null; }
    }

    const totalValue = Number(record?.config?.total || 0) || 0;
    const status = String(record?.adminStatus?.state || "open").trim() === "settled" ? "settled" : "open";
    const priority = priorityFromRecord(record, Boolean(pending));

    quotes.push({
      code,
      createdAt: toIsoOrEmpty(record?.createdAt) || new Date(0).toISOString(),
      updatedAt: toIsoOrEmpty(record?.updatedAt || record?.adminStatus?.updatedAt || record?.createdAt),
      requesterName: String(record?.requester?.name || "").trim(),
      requesterEmail: String(record?.requester?.email || "").trim().toLowerCase(),
      usage: String(record?.usage || "").trim(),
      totalValue,
      totalLabel: totalValue > 0 ? euro(totalValue) : "—",
      deliveryName: String(record?.config?.parts?.delivery || "").trim() || String(record?.selects?.delivery || "").trim(),
      status,
      pendingModification: Boolean(pending),
      pendingExpiresAt: toIsoOrEmpty(pending?.expiresAt),
      priorityLevel: priority.level,
      priorityLabel: priority.label,
      priorityReason: priority.reason,
      partsSummary: buildPartsSummary(record)
    });
  }

  quotes.sort((a, b) => {
    if (b.priorityLevel !== a.priorityLevel) return b.priorityLevel - a.priorityLevel;
    return (Date.parse(a.createdAt) || 0) - (Date.parse(b.createdAt) || 0);
  });
  const stats = quotes.reduce((acc, q) => {
    if (q.status === "settled") acc.settled += 1;
    else acc.open += 1;
    if (q.pendingModification) acc.pendingModification += 1;
    return acc;
  }, { open: 0, settled: 0, pendingModification: 0 });

  return res.status(200).json({ ok: true, quotes, stats });
}

async function handleSetStatus(body, res, client) {
  const code = normalizeCode(body.code || "");
  if (!code) return res.status(400).json({ error: "MISSING_CODE" });
  if (!QUOTE_CODE_RE.test(code)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });
  const nextStatus = String(body.status || "").trim().toLowerCase();
  if (!["open", "settled"].includes(nextStatus)) return res.status(400).json({ error: "INVALID_STATUS" });

  const key = `quote:${code}`;
  const raw = await client.get(key);
  if (!raw) return res.status(404).json({ error: "NOT_FOUND" });
  const record = JSON.parse(raw);
  const nowIso = new Date().toISOString();
  record.adminStatus = { state: nextStatus, updatedAt: nowIso };
  record.updatedAt = nowIso;
  await client.set(key, JSON.stringify(record), { EX: QUOTE_TTL_SECONDS });
  return res.status(200).json({ ok: true, code, status: nextStatus, updatedAt: nowIso });
}

async function handleDelete(body, res, client) {
  const code = normalizeCode(body.code || "");
  if (!code) return res.status(400).json({ error: "MISSING_CODE" });
  if (!QUOTE_CODE_RE.test(code)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });
  const [quoteDeleted, pendingDeleted] = await Promise.all([
    client.del(`quote:${code}`),
    client.del(`quote:modify:req:${code}`)
  ]);
  return res.status(200).json({
    ok: true,
    code,
    deleted: Number(quoteDeleted || 0) > 0,
    pendingDeleted: Number(pendingDeleted || 0) > 0
  });
}

async function handleTestReceipt(body, res, client) {
  const code = normalizeCode(body.code || "");
  if (!code) return res.status(400).json({ error: "MISSING_CODE" });
  if (!QUOTE_CODE_RE.test(code)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });

  const raw = await client.get(`quote:${code}`);
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

  const invoice = buildReceiptInvoice({ code, record, targetEmail });
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
    message_text: buildReceiptText(invoice),
    message_html: buildReceiptHtml(invoice)
  };

  let emailSent = false;
  let sendError = "";
  if (sendEmail) {
    const sent = await sendReceiptMail(payload, targetEmail);
    emailSent = Boolean(sent.ok);
    if (!sent.ok) sendError = String(sent.error || "RECEIPT_EMAIL_SEND_FAILED");
    if (emailSent && ATELIER_RECEIPT_COPY_EMAIL && ATELIER_RECEIPT_COPY_EMAIL !== targetEmail && EMAIL_RE.test(ATELIER_RECEIPT_COPY_EMAIL)) {
      await sendReceiptMail(
        payload,
        ATELIER_RECEIPT_COPY_EMAIL,
        `[Copie atelier][TEST] ${invoice.invoiceNumber} - ${invoice.quoteCode}`
      );
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
}

export default async function handler(req, res) {
  try {
    if (!ADMIN_MODIFY_KEY) return res.status(503).json({ error: "ADMIN_NOT_CONFIGURED" });
    const client = await getRedisClient();

    if (req.method === "GET") {
      const action = String(req.query.action || "list").trim().toLowerCase();
      if (action !== "list") return res.status(400).json({ error: "INVALID_ACTION" });
      return handleList(req, res, client);
    }

    if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    const body = readBody(req);
    const adminKey = String(body.admin_key || body.adminKey || "").trim();
    if (!isAdminKeyValid(adminKey)) return res.status(403).json({ error: "ADMIN_KEY_INVALID" });
    const action = String(body.action || "").trim().toLowerCase();

    if (action === "set-status") return handleSetStatus(body, res, client);
    if (action === "delete") return handleDelete(body, res, client);
    if (action === "test-receipt") return handleTestReceipt(body, res, client);

    return res.status(400).json({ error: "INVALID_ACTION" });
  } catch (err) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
