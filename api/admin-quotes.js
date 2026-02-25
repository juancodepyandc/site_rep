import { getRedisClient } from "./_redis.js";

const ADMIN_MODIFY_KEY = String(process.env.ADMIN_MODIFY_KEY || process.env.ADMIN_SECRET || "").trim();
const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;

function isAdminKeyValid(value) {
  const key = String(value || "").trim();
  return Boolean(ADMIN_MODIFY_KEY && key && key === ADMIN_MODIFY_KEY);
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

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    if (!ADMIN_MODIFY_KEY) return res.status(503).json({ error: "ADMIN_NOT_CONFIGURED" });

    const adminKey = String(req.query.admin_key || "").trim();
    if (!isAdminKeyValid(adminKey)) return res.status(403).json({ error: "ADMIN_KEY_INVALID" });

    const client = await getRedisClient();
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
    const pendingKeys = codes.map((code) => `quote:modify:req:${code}`);
    const pendingRaw = await client.mGet(pendingKeys);

    const quotes = [];
    for (let i = 0; i < quoteRaw.length; i += 1) {
      const raw = quoteRaw[i];
      const code = String(codes[i] || "").trim().toUpperCase();
      if (!raw || !QUOTE_CODE_RE.test(code)) continue;

      let record;
      try {
        record = JSON.parse(raw);
      } catch {
        continue;
      }

      const pendingEntry = pendingRaw[i];
      let pending = null;
      if (pendingEntry) {
        try {
          pending = JSON.parse(pendingEntry);
        } catch {
          pending = null;
        }
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
      const at = Date.parse(a.createdAt) || 0;
      const bt = Date.parse(b.createdAt) || 0;
      return at - bt;
    });

    const stats = quotes.reduce(
      (acc, q) => {
        if (q.status === "settled") acc.settled += 1;
        else acc.open += 1;
        if (q.pendingModification) acc.pendingModification += 1;
        return acc;
      },
      { open: 0, settled: 0, pendingModification: 0 }
    );

    return res.status(200).json({ ok: true, quotes, stats });
  } catch (err) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
