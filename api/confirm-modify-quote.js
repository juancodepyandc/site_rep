import { getRedisClient } from "./_redis.js";
import { timingSafeEqual } from "node:crypto";

const QUOTE_TTL_SECONDS = 30 * 24 * 60 * 60;
const ADMIN_MODIFY_KEY = String(process.env.ADMIN_MODIFY_KEY || process.env.ADMIN_SECRET || "").trim();
const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const ALLOWED_SELECT_KEYS = new Set(["cpu", "mobo", "ram", "gpu", "storage", "psu", "case", "watercooling", "customCables", "cableMgmt", "delivery"]);
const OTP_FAIL_LIMIT = 10;
const OTP_FAIL_WINDOW_SECONDS = 24 * 60 * 60;

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

function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

function isValidCode(code) {
  return QUOTE_CODE_RE.test(String(code || ""));
}

function safeOtpEquals(a, b) {
  const sa = Buffer.from(String(a || "").trim());
  const sb = Buffer.from(String(b || "").trim());
  if (sa.length !== sb.length || sa.length === 0) return false;
  return timingSafeEqual(sa, sb);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeRecord(record, code, currentRecord) {
  if (!record || typeof record !== "object") return null;
  if (normalizeCode(record.code) !== code) return null;
  const nextEmail = normalizeEmail(record?.requester?.email || currentRecord?.requester?.email || "");
  if (nextEmail && !EMAIL_RE.test(nextEmail)) return null;
  const rawSelects = record.selects && typeof record.selects === "object" ? record.selects : {};
  const rawExternal = record.external && typeof record.external === "object" ? record.external : {};
  const selects = Object.fromEntries(
    Object.entries(rawSelects)
      .filter(([k]) => ALLOWED_SELECT_KEYS.has(k))
      .map(([k, v]) => [k, String(v || "").trim().slice(0, 160)])
  );
  const external = Object.fromEntries(
    Object.entries(rawExternal)
      .filter(([k]) => ALLOWED_SELECT_KEYS.has(k))
      .map(([k, v]) => [k, v && typeof v === "object" ? { query: String(v.query || "").trim().slice(0, 240) } : { query: String(v || "").trim().slice(0, 240) }])
  );
  return {
    code,
    createdAt: currentRecord?.createdAt || record.createdAt || new Date().toISOString(),
    requester: {
      name: String(record?.requester?.name || currentRecord?.requester?.name || "").trim(),
      email: nextEmail,
      details: String(record?.requester?.details || "").trim().slice(0, 8000),
      noviceMode: record?.requester?.noviceMode !== undefined
        ? Boolean(record?.requester?.noviceMode)
        : Boolean(currentRecord?.requester?.noviceMode),
      noviceBrief: String(
        record?.requester?.noviceBrief !== undefined
          ? record?.requester?.noviceBrief
          : currentRecord?.requester?.noviceBrief || ""
      ).trim().slice(0, 5000),
      budgetMin: Number(record?.requester?.budgetMin || 0) || 0,
      budgetMax: Number(record?.requester?.budgetMax || 0) || 0
    },
    signature: String(record.signature || ""),
    selects,
    external,
    usage: String(record.usage || ""),
    config: record.config && typeof record.config === "object" ? record.config : null,
    preview3d: record.preview3d && typeof record.preview3d === "object" ? record.preview3d : null
  };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
      return;
    }

    const { code, otp, recordUpdated, adminNote, adminSecret } = req.body || {};
    const c = normalizeCode(code);
    const otpStr = String(otp || "").trim();
    const incomingAdminSecret = String(adminSecret || "").trim();

    if (!c) return res.status(400).json({ error: "MISSING_CODE" });
    if (!isValidCode(c)) return res.status(400).json({ error: "INVALID_CODE_FORMAT" });
    if (!otpStr) return res.status(400).json({ error: "MISSING_OTP" });
    if (!/^\d{6}$/.test(otpStr)) return res.status(400).json({ error: "INVALID_OTP_FORMAT" });
    if (!ADMIN_MODIFY_KEY) return res.status(503).json({ error: "ADMIN_NOT_CONFIGURED" });
    if (incomingAdminSecret !== ADMIN_MODIFY_KEY) return res.status(403).json({ error: "ADMIN_KEY_INVALID" });

    const client = await getRedisClient();
    const ip = readClientIp(req);
    const otpFailIpKey = `quote:modify:otp:ipfail:${ip}`;
    const otpFailCodeKey = `quote:modify:otp:codefail:${c}`;
    const ipFails = Number(await client.get(otpFailIpKey) || 0);
    const codeFails = Number(await client.get(otpFailCodeKey) || 0);
    if (ipFails >= OTP_FAIL_LIMIT || codeFails >= OTP_FAIL_LIMIT) {
      return res.status(429).json({ error: "OTP_TOO_MANY_ATTEMPTS" });
    }

    const quoteRaw = await client.get(`quote:${c}`);
    if (!quoteRaw) return res.status(404).json({ error: "NOT_FOUND" });
    const currentRecord = JSON.parse(quoteRaw);

    const pendingRaw = await client.get(`quote:modify:req:${c}`);
    if (!pendingRaw) return res.status(403).json({ error: "OTP_EXPIRED_OR_MISSING" });
    const pending = JSON.parse(pendingRaw);
    if (!safeOtpEquals(pending?.otp || "", otpStr)) {
      const [newIpFails, newCodeFails] = await Promise.all([
        bumpCounter(client, otpFailIpKey, OTP_FAIL_WINDOW_SECONDS),
        bumpCounter(client, otpFailCodeKey, OTP_FAIL_WINDOW_SECONDS)
      ]);
      if (newIpFails >= OTP_FAIL_LIMIT || newCodeFails >= OTP_FAIL_LIMIT) {
        return res.status(429).json({ error: "OTP_TOO_MANY_ATTEMPTS" });
      }
      return res.status(403).json({ error: "OTP_INVALID" });
    }

    if (recordUpdated && JSON.stringify(recordUpdated).length > 360000) {
      return res.status(413).json({ error: "UPDATED_RECORD_TOO_LARGE" });
    }
    const candidateRecord = recordUpdated && recordUpdated.code ? recordUpdated : pending.requestedRecord;
    const nextRecord = sanitizeRecord(candidateRecord, c, currentRecord);
    if (!nextRecord) return res.status(400).json({ error: "MISSING_RECORD" });

    const nowIso = new Date().toISOString();
    const history = Array.isArray(currentRecord?.modificationHistory) ? currentRecord.modificationHistory.slice(-19) : [];
    history.push({
      appliedAt: nowIso,
      changeCount: Array.isArray(pending?.changes) ? pending.changes.length : 0,
      changes: Array.isArray(pending?.changes) ? pending.changes : [],
      requestedAt: pending?.createdAt || "",
      expiresAt: pending?.expiresAt || "",
      source: pending?.source || "client",
      adminNote: String(adminNote || "").trim().slice(0, 800)
    });

    nextRecord.updatedAt = nowIso;
    nextRecord.lastOtpModification = {
      appliedAt: nowIso,
      requestedAt: pending?.createdAt || "",
      expiresAt: pending?.expiresAt || "",
      source: pending?.source || "client"
    };
    nextRecord.modificationHistory = history;

    await client.set(`quote:${c}`, JSON.stringify(nextRecord), { EX: QUOTE_TTL_SECONDS });
    await client.del(`quote:modify:req:${c}`);
    await Promise.all([
      client.del(otpFailIpKey),
      client.del(otpFailCodeKey)
    ]);

    res.status(200).json({
      ok: true,
      code: c,
      appliedAt: nowIso,
      changesApplied: Array.isArray(pending?.changes) ? pending.changes.length : 0
    });
  } catch (err) {
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR", detail: String(err?.message || err) });
  }
}
