import { getRedisClient } from "./_redis.js";

const ADMIN_MODIFY_KEY = String(process.env.ADMIN_MODIFY_KEY || process.env.ADMIN_SECRET || "").trim();
const AUTH_WINDOW_SECONDS = 10 * 60;
const AUTH_MAX_ATTEMPTS = 20;
const AUTH_FAIL_LIMIT = 8;

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
    if (!ADMIN_MODIFY_KEY) return res.status(503).json({ error: "ADMIN_NOT_CONFIGURED" });

    let redis = null;
    const ip = readClientIp(req);
    try {
      redis = await getRedisClient();
      const allAttempts = await bumpCounter(redis, `rate:admin-auth:all:${ip}`, AUTH_WINDOW_SECONDS);
      if (allAttempts > AUTH_MAX_ATTEMPTS) return res.status(429).json({ error: "TOO_MANY_REQUESTS" });
      const failCount = Number(await redis.get(`rate:admin-auth:fail:${ip}`) || 0);
      if (failCount >= AUTH_FAIL_LIMIT) return res.status(429).json({ error: "AUTH_LOCKED_TEMPORARY" });
    } catch {
      redis = null;
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const incoming = String(body.admin_key || body.adminKey || "").trim();
    if (!incoming) return res.status(400).json({ error: "MISSING_ADMIN_KEY" });
    if (incoming !== ADMIN_MODIFY_KEY) {
      if (redis) {
        const fails = await bumpCounter(redis, `rate:admin-auth:fail:${ip}`, AUTH_WINDOW_SECONDS);
        if (fails >= AUTH_FAIL_LIMIT) return res.status(429).json({ error: "AUTH_LOCKED_TEMPORARY" });
      }
      return res.status(403).json({ error: "ADMIN_KEY_INVALID" });
    }

    if (redis) await redis.del(`rate:admin-auth:fail:${ip}`);

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", detail: String(err?.message || err) });
  }
}
