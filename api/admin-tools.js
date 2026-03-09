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
const ENABLE_TEST_RECEIPT = String(process.env.ENABLE_TEST_RECEIPT || "1").trim() !== "0";

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

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeSeed(value) {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return Math.floor(Date.now() % 2147483647);
  const normalized = Math.floor(Math.abs(raw)) % 2147483647;
  return normalized > 0 ? normalized : 1;
}

function createSeededRng(seed) {
  let t = normalizeSeed(seed) >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pickFromCatalog(entries, rng) {
  const list = Array.isArray(entries) ? entries : [];
  if (!list.length) return null;
  const idx = Math.max(0, Math.min(list.length - 1, Math.floor(rng() * list.length)));
  return list[idx];
}

const RANDOM_RECEIPT_CATALOG = {
  usage: [
    "Bureautique / etude",
    "Jeu competitif (1080p)",
    "Jeu AAA (1440p / ultrawide)",
    "Creation (montage / 3D / IA)",
    "Streaming + multitache"
  ],
  cpu: [
    { name: "AMD Ryzen 5 7600", price: 238.9 },
    { name: "AMD Ryzen 7 7800X3D", price: 427.5 },
    { name: "Intel Core i5-14600KF", price: 332.4 },
    { name: "Intel Core i7-14700F", price: 418.2 }
  ],
  mobo: [
    { name: "MSI B650 Gaming Plus WiFi", price: 199.99 },
    { name: "Gigabyte B760M DS3H DDR4", price: 129.0 },
    { name: "ASUS TUF B650-PLUS", price: 214.5 },
    { name: "ASRock B760 Pro RS", price: 153.9 }
  ],
  ram: [
    { name: "Corsair Vengeance 32 Go DDR5-6000", price: 124.9 },
    { name: "G.Skill Ripjaws 32 Go DDR5-6000", price: 118.0 },
    { name: "Kingston Fury 32 Go DDR4-3600", price: 88.9 }
  ],
  gpu: [
    { name: "NVIDIA GeForce RTX 4060 Ti 8 Go", price: 459.9 },
    { name: "NVIDIA GeForce RTX 4070 SUPER 12 Go", price: 699.0 },
    { name: "AMD Radeon RX 7800 XT 16 Go", price: 579.0 },
    { name: "AMD Radeon RX 7700 XT 12 Go", price: 469.0 }
  ],
  storage: [
    { name: "Kingston NV2 NVMe 1 To", price: 68.9 },
    { name: "Crucial P3 Plus NVMe 2 To", price: 118.0 },
    { name: "Samsung 990 EVO 1 To", price: 104.0 }
  ],
  psu: [
    { name: "Corsair RM750e Gold", price: 129.0 },
    { name: "MSI MAG A750GL Gold", price: 112.0 },
    { name: "be quiet! Pure Power 12M 750W", price: 124.0 }
  ],
  case: [
    { name: "MSI MAG Forge 100R", price: 79.9 },
    { name: "Corsair 4000D Airflow", price: 104.0 },
    { name: "NZXT H6 Flow", price: 134.9 }
  ],
  cooling: [
    { name: "Aucun Refroidissement inclus de base", price: 0 },
    { name: "Thermalright Peerless Assassin 120 SE", price: 49.9 },
    { name: "Arctic Liquid Freezer III 240", price: 99.0 }
  ],
  customCable: [
    { name: "Aucun Aucun cable custom", price: 0 },
    { name: "Lian Li Strimer Plus V2 (24-pin + GPU)", price: 92.0 },
    { name: "CableMod PRO Kit", price: 78.0 }
  ],
  cableMgmt: [
    { name: "Aucun Basique atelier", price: 0 },
    { name: "Premium atelier", price: 34.0 },
    { name: "Sync RGB via app", price: 59.0 }
  ],
  delivery: [
    { name: "Traitement economique", price: 39.0 },
    { name: "Traitement normal (3-5 jours ouvres)", price: 74.0 },
    { name: "Traitement prioritaire", price: 129.0 }
  ]
};

function buildRandomTestRecord({ seed, targetEmail = "" }) {
  const rng = createSeededRng(seed);
  const usage = pickFromCatalog(RANDOM_RECEIPT_CATALOG.usage, rng) || "Bureautique / etude";
  const selected = {
    cpu: pickFromCatalog(RANDOM_RECEIPT_CATALOG.cpu, rng),
    mobo: pickFromCatalog(RANDOM_RECEIPT_CATALOG.mobo, rng),
    ram: pickFromCatalog(RANDOM_RECEIPT_CATALOG.ram, rng),
    gpu: pickFromCatalog(RANDOM_RECEIPT_CATALOG.gpu, rng),
    storage: pickFromCatalog(RANDOM_RECEIPT_CATALOG.storage, rng),
    psu: pickFromCatalog(RANDOM_RECEIPT_CATALOG.psu, rng),
    case: pickFromCatalog(RANDOM_RECEIPT_CATALOG.case, rng),
    cooling: pickFromCatalog(RANDOM_RECEIPT_CATALOG.cooling, rng),
    customCable: pickFromCatalog(RANDOM_RECEIPT_CATALOG.customCable, rng),
    cableMgmt: pickFromCatalog(RANDOM_RECEIPT_CATALOG.cableMgmt, rng),
    delivery: pickFromCatalog(RANDOM_RECEIPT_CATALOG.delivery, rng)
  };

  const partNames = Object.fromEntries(
    Object.entries(selected).map(([key, value]) => [key, String(value?.name || "").trim()])
  );
  const total = Object.values(selected).reduce((sum, entry) => sum + Number(entry?.price || 0), 20);
  const safeSeed = normalizeSeed(seed);
  const codeSuffix = safeSeed.toString(36).toUpperCase().slice(-6).padStart(6, "0");

  return {
    seed: safeSeed,
    code: `DV-RND${codeSuffix}`,
    record: {
      requester: {
        name: "Client test",
        email: String(targetEmail || "").trim().toLowerCase()
      },
      usage,
      config: {
        total: Math.round(total * 100) / 100,
        parts: partNames
      }
    }
  };
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
  const known = fields
    .map(([label, key]) => {
      const value = String(parts[key] || "").trim();
      if (!value) return "";
      return `${label}: ${value}`;
    })
    .filter(Boolean)
    .slice(0, 12);
  if (known.length) return known;
  return Object.entries(parts)
    .map(([key, value]) => {
      const v = String(value || "").trim();
      if (!v) return "";
      return `${key}: ${v}`;
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
    `<div style="margin-top:10px;padding:12px 14px;border-radius:12px;background:#ffffff;color:#102844;font-size:28px;line-height:1.2;font-weight:900;letter-spacing:-0.01em;">Facture test ${escapeHtml(invoice.invoiceNumber)}</div>`,
    `<div style="margin-top:10px;display:inline-block;padding:8px 11px;border-radius:999px;background:rgba(255,255,255,.92);border:1px solid rgba(20,57,91,.2);font-size:12px;font-weight:800;color:#1a4068;">Simulation email (aucun debit) • ${escapeHtml(invoice.createdAtFr)}</div>`,
    `</div>`,
    `<div style="padding:22px 24px 10px 24px;">`,
    `<p style="margin:0 0 14px 0;font-size:14px;line-height:1.62;color:#1b2f49;">Bonjour <strong>${escapeHtml(invoice.buyerName)}</strong>,<br/>Ceci est un envoi de test pour verifier la mise en page de la facture. Aucun paiement n'a ete effectue.</p>`,
    `<div style="margin:0 0 14px 0;padding:12px 14px;border:1px solid #f0d9ad;background:#fff8e8;border-radius:12px;font-size:12px;line-height:1.55;color:#6c4a16;"><strong style="display:block;font-size:12px;color:#5a3c11;margin-bottom:4px;">Simulation uniquement</strong>Ce document est genere pour test. La facture finale est envoyee apres paiement confirme.</div>`,
    `<table role="presentation" width="100%" style="border-collapse:separate;border-spacing:0 8px;margin:0 0 14px 0;">`,
    `<tr><td style="font-size:12px;color:#5a718f;width:33%;">Ref. devis</td><td style="font-size:13px;font-weight:700;color:#102743;">${escapeHtml(invoice.quoteCode)}</td></tr>`,
    `<tr><td style="font-size:12px;color:#5a718f;">Reference test</td><td style="font-size:13px;font-weight:700;color:#102743;">${escapeHtml(invoice.orderID)}</td></tr>`,
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

function buildReceiptText(invoice) {
  return [
    `${ATELIER_COMPANY_NAME} - FACTURE TEST ${invoice.invoiceNumber}`,
    "========================================",
    `Date: ${invoice.createdAtFr}`,
    `Client: ${invoice.buyerName} <${invoice.buyerEmail}>`,
    `Ref devis: ${invoice.quoteCode}`,
    `Reference test: ${invoice.orderID}`,
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
    const cameraRuns = Array.isArray(record?.cameraDiagnostics?.runs) ? record.cameraDiagnostics.runs : [];
    const latestRun = cameraRuns.length ? cameraRuns[cameraRuns.length - 1] : null;
    const latestEntries = Array.isArray(latestRun?.entries) ? latestRun.entries : [];

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
      serviceType: String(record?.serviceType || "").trim(),
      issueCategory: String(record?.issueCategory || "").trim(),
      pendingModification: Boolean(pending),
      pendingExpiresAt: toIsoOrEmpty(pending?.expiresAt),
      priorityLevel: priority.level,
      priorityLabel: priority.label,
      priorityReason: priority.reason,
      partsSummary: buildPartsSummary(record),
      hasCameraLogs: latestEntries.length > 0,
      cameraLogCount: latestEntries.length,
      cameraLastRunAt: toIsoOrEmpty(latestRun?.endedAt || latestRun?.startedAt)
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
  const sendEmail = Boolean(body.send_email === true || body.sendEmail === true);
  const requestedEmail = String(body.to_email || body.toEmail || "").trim().toLowerCase();
  const mode = String(body.mode || "").trim().toLowerCase();
  const requestCode = normalizeCode(body.code || "");

  let code = requestCode;
  let record = null;
  let generatedRandom = false;
  let randomSeed = 0;

  if (requestCode) {
    if (!QUOTE_CODE_RE.test(requestCode)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });
    const raw = await client.get(`quote:${requestCode}`);
    if (!raw) return res.status(404).json({ error: "NOT_FOUND" });
    record = JSON.parse(raw);
  } else {
    const seed = normalizeSeed(body.seed || Date.now());
    const randomBuilt = buildRandomTestRecord({ seed, targetEmail: requestedEmail });
    code = randomBuilt.code;
    record = randomBuilt.record;
    randomSeed = randomBuilt.seed;
    generatedRandom = true;
  }

  const fallbackEmail = String(record?.requester?.email || "").trim().toLowerCase();
  let targetEmail = String(requestedEmail || fallbackEmail).trim().toLowerCase();
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
    generatedRandom,
    seed: randomSeed || undefined,
    mode: generatedRandom ? "random" : (mode || "quote"),
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
    if (action === "test-receipt") {
      if (!ENABLE_TEST_RECEIPT) return res.status(403).json({ error: "TEST_RECEIPT_DISABLED" });
      return handleTestReceipt(body, res, client);
    }

    return res.status(400).json({ error: "INVALID_ACTION" });
  } catch (err) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
