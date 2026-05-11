import { auroraFetch, resolveAuroraBaseUrl, promptHash } from "./_aurora.js";
import { getRedisClient } from "./_redis.js";

const CACHE_TTL_S = 60 * 60 * 24 * 90;
const JOB_META_TTL_S = 60 * 60 * 4;

async function githubGetSha(owner, repo, path, branch, token) {
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "atelier-aurora"
      }
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data.sha || null;
  } catch { return null; }
}

async function githubPutFile({ owner, repo, branch, path, buffer, message, token }) {
  const sha = await githubGetSha(owner, repo, path, branch, token);
  const body = { message, content: buffer.toString("base64"), branch };
  if (sha) body.sha = sha;
  const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "User-Agent": "atelier-aurora"
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`GITHUB_${r.status}_${t.slice(0, 200)}`);
  }
  return r.json();
}

async function commitGLBToRepo(filename, buffer, prompt) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, reason: "GITHUB_TOKEN_MISSING" };
  const owner = (process.env.GITHUB_OWNER || "juancodepyandc").trim();
  const repo = (process.env.GITHUB_REPO || "site_rep").trim();
  const branch = (process.env.GITHUB_BRANCH || "main").trim();
  const path = `assets/aurora/${filename}`;
  const summary = (prompt || "rendu").replace(/\s+/g, " ").trim().slice(0, 72);
  const message = `aurora: ${summary}`;
  try {
    await githubPutFile({ owner, repo, branch, path, buffer, message, token });
    return {
      ok: true,
      rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`,
      localPath: `/${path}`
    };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

async function handleGenerate(req, res) {
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

async function handleStatus(req, res) {
  const jobId = String(req.query.job || "").trim();
  if (!jobId) return res.status(400).json({ error: "MISSING_JOB" });

  let cacheKey = null;
  let prompt = null;
  try {
    const redis = await getRedisClient();
    const meta = await redis.get(`aurora:job:${jobId}`);
    if (meta) {
      const parsed = JSON.parse(meta);
      cacheKey = parsed.cacheKey || null;
      prompt = parsed.prompt || null;
    }
  } catch {}

  let r;
  try {
    r = await auroraFetch(`/api/ext/3d/status/${encodeURIComponent(jobId)}`);
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
  const state = data.state;

  if (state !== "done") {
    return res.status(200).json({
      jobId,
      state,
      step: data.step || null,
      elapsedS: typeof data.elapsed_s === "number" ? data.elapsed_s : 0,
      attempts: data.attempts || 1,
      score: data.score ?? null,
      error: data.error || null
    });
  }

  if (!data.glb_url) {
    return res.status(200).json({ jobId, state: "failed", error: data.error || "NO_GLB_URL" });
  }

  let buffer;
  try {
    const base = await resolveAuroraBaseUrl();
    const remote = data.glb_url.startsWith("http") ? data.glb_url : `${base}${data.glb_url}`;
    const fileRes = await fetch(remote);
    if (!fileRes.ok) throw new Error(`GLB_FETCH_${fileRes.status}`);
    buffer = Buffer.from(await fileRes.arrayBuffer());
  } catch (e) {
    return res.status(200).json({
      jobId,
      state: "done",
      url: null,
      persistError: e.message,
      score: data.score ?? null
    });
  }

  const filenameSeed = cacheKey ? cacheKey.replace(/^aurora:cache:/, "").replace(/[^a-zA-Z0-9_-]/g, "") : jobId.replace(/[^a-zA-Z0-9_-]/g, "");
  const filename = `${filenameSeed || jobId.slice(0, 16)}.glb`;
  const commit = await commitGLBToRepo(filename, buffer, prompt);

  let resultUrl = null;
  let ephemeral = false;
  let persistError = null;

  if (commit.ok) {
    resultUrl = commit.rawUrl;
  } else {
    persistError = commit.reason || "PERSIST_FAILED";
    const base = await resolveAuroraBaseUrl();
    resultUrl = data.glb_url.startsWith("http") ? data.glb_url : `${base}${data.glb_url}`;
    ephemeral = true;
  }

  if (cacheKey && resultUrl && commit.ok) {
    try {
      const redis = await getRedisClient();
      await redis.set(
        cacheKey,
        JSON.stringify({
          url: resultUrl,
          localPath: commit.localPath || null,
          score: data.score,
          audit: data.audit || null,
          prompt,
          savedAt: new Date().toISOString(),
          filename
        }),
        { EX: CACHE_TTL_S }
      );
    } catch {}
  }

  return res.status(200).json({
    jobId,
    state: "done",
    url: resultUrl,
    localPath: commit.ok ? commit.localPath : null,
    ephemeral,
    persistError,
    score: data.score ?? null,
    audit: data.audit || null
  });
}

async function handleChat(req, res) {
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || messages.length === 0) return res.status(400).json({ error: "MISSING_MESSAGES" });
  const trimmed = messages.slice(-20).map(m => ({
    role: m.role === "system" || m.role === "user" || m.role === "assistant" ? m.role : "user",
    content: typeof m.content === "string" ? m.content.slice(0, 8000) : ""
  })).filter(m => m.content);

  let r;
  try {
    r = await auroraFetch("/api/ext/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: trimmed,
        temperature: typeof body.temperature === "number" ? body.temperature : 0.6,
        model: body.model
      })
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
  return res.status(200).json({ reply: data.reply || "", model: data.model || null });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body || {};
    if (body.action === "chat") {
      req.body = body;
      return handleChat(req, res);
    }
    req.body = body;
    return handleGenerate(req, res);
  }
  if (req.method === "GET") return handleStatus(req, res);
  return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
}
