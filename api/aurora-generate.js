import { auroraFetch, promptHash } from "./_aurora.js";
import { getRedisClient } from "./_redis.js";

const JOB_META_TTL_S = 60 * 60 * 4;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const prompt = String(body.prompt || "").trim();
  const subjectKind = body.subject_kind ? String(body.subject_kind).trim() : undefined;
  const cacheTag = body.cache_tag ? String(body.cache_tag).slice(0, 80) : null;
  const force = Boolean(body.force);

  if (!prompt) return res.status(400).json({ error: "MISSING_PROMPT" });
  if (prompt.length > 600) return res.status(400).json({ error: "PROMPT_TOO_LONG" });

  const cacheKey = `aurora:cache:${cacheTag ? cacheTag + ":" : ""}${promptHash(prompt)}`;

  if (!force) {
    try {
      const redis = await getRedisClient();
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.url) {
          return res.status(200).json({ ok: true, cached: true, ...parsed });
        }
      }
    } catch {}
  }

  let r;
  try {
    r = await auroraFetch("/api/ext/3d/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, subject_kind: subjectKind, force })
    });
  } catch (e) {
    const code = e?.message === "AURORA_KEY_MISSING" ? "AURORA_KEY_MISSING" : "AURORA_UNREACHABLE";
    return res.status(code === "AURORA_KEY_MISSING" ? 503 : 502).json({ error: code, detail: e.message });
  }

  if (!r.ok) {
    const text = await r.text().catch(() => "");
    return res.status(r.status).json({ error: "AURORA_REJECTED", status: r.status, detail: text.slice(0, 400) });
  }

  let data;
  try { data = await r.json(); } catch { return res.status(502).json({ error: "AURORA_BAD_JSON" }); }
  if (!data.job_id) return res.status(502).json({ error: "AURORA_NO_JOB" });

  try {
    const redis = await getRedisClient();
    await redis.set(
      `aurora:job:${data.job_id}`,
      JSON.stringify({ prompt, cacheKey, subjectKind: subjectKind || null }),
      { EX: JOB_META_TTL_S }
    );
  } catch {}

  return res.status(200).json({ ok: true, jobId: data.job_id, cacheKey });
}
