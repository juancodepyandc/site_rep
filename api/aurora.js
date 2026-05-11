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

async function handleUpload(req, res) {
  let body = req.body || {};
  const filenameRaw = String(body.filename || "").trim();
  const content = String(body.content || "").trim();
  if (!filenameRaw || !content) return res.status(400).json({ error: "MISSING_FILE" });

  const safe = filenameRaw.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  if (!/\.(glb|gltf)$/i.test(safe)) return res.status(400).json({ error: "INVALID_EXTENSION" });

  let buffer;
  try { buffer = Buffer.from(content, "base64"); }
  catch { return res.status(400).json({ error: "INVALID_BASE64" }); }
  if (buffer.length === 0) return res.status(400).json({ error: "EMPTY_FILE" });
  if (buffer.length > 30 * 1024 * 1024) return res.status(413).json({ error: "FILE_TOO_LARGE" });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(503).json({ error: "GITHUB_TOKEN_MISSING" });
  const owner = (process.env.GITHUB_OWNER || "juancodepyandc").trim();
  const repo = (process.env.GITHUB_REPO || "site_rep").trim();
  const branch = (process.env.GITHUB_BRANCH || "main").trim();
  const path = `assets/aurora/manual/${safe}`;

  try {
    let sha = null;
    try {
      const g = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "atelier-aurora" }
      });
      if (g.ok) sha = (await g.json()).sha || null;
    } catch {}
    const putBody = { message: `aurora manual: ${safe}`, content: buffer.toString("base64"), branch };
    if (sha) putBody.sha = sha;
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/vnd.github+json", "User-Agent": "atelier-aurora" },
      body: JSON.stringify(putBody)
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return res.status(r.status).json({ error: "GITHUB_PUT_FAILED", detail: t.slice(0, 300) });
    }
    return res.status(200).json({
      ok: true,
      filename: safe,
      localPath: `/${path}`,
      rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`,
      size: buffer.length
    });
  } catch (e) {
    return res.status(500).json({ error: "UPLOAD_FAILED", detail: e.message });
  }
}

async function handleList(req, res) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(503).json({ error: "GITHUB_TOKEN_MISSING" });
  const owner = (process.env.GITHUB_OWNER || "juancodepyandc").trim();
  const repo = (process.env.GITHUB_REPO || "site_rep").trim();
  const branch = (process.env.GITHUB_BRANCH || "main").trim();

  async function listDir(path) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "atelier-aurora" }
    });
    if (r.status === 404) return [];
    if (!r.ok) throw new Error("LIST_FAILED_" + r.status);
    const data = await r.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter(f => f.type === "file" && /\.(glb|gltf)$/i.test(f.name))
      .map(f => ({
        name: f.name,
        path: f.path,
        size: f.size,
        rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${f.path}`
      }));
  }

  try {
    const [generated, manual] = await Promise.all([
      listDir("assets/aurora").catch(() => []),
      listDir("assets/aurora/manual").catch(() => [])
    ]);
    const all = [...generated.filter(f => f.path !== "assets/aurora/manual"), ...manual];
    return res.status(200).json({
      count: all.length,
      generated: generated.filter(f => f.path !== "assets/aurora/manual").length,
      manual: manual.length,
      files: all
    });
  } catch (e) {
    return res.status(500).json({ error: "LIST_FAILED", detail: e.message });
  }
}

const CATALOG_PATH = "assets/catalog-extras.json";
const CATALOG_CATEGORIES = ["cpu", "mobo", "ram", "gpu", "storage", "psu", "case", "watercooling"];

async function readCatalogExtras(token, owner, repo, branch) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${CATALOG_PATH}?ref=${encodeURIComponent(branch)}`;
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "atelier-aurora" }
  });
  if (r.status === 404) return { sha: null, data: {} };
  if (!r.ok) throw new Error("CATALOG_READ_FAILED_" + r.status);
  const meta = await r.json();
  const decoded = Buffer.from(meta.content || "", meta.encoding || "base64").toString("utf-8");
  let data = {};
  try { data = JSON.parse(decoded); } catch {}
  if (!data || typeof data !== "object") data = {};
  return { sha: meta.sha || null, data };
}

async function writeCatalogExtras(token, owner, repo, branch, data, sha, message) {
  const body = {
    message: message || "catalog: update extras",
    content: Buffer.from(JSON.stringify(data, null, 2), "utf-8").toString("base64"),
    branch
  };
  if (sha) body.sha = sha;
  const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${CATALOG_PATH}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/vnd.github+json", "User-Agent": "atelier-aurora" },
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error("CATALOG_WRITE_FAILED_" + r.status + ":" + t.slice(0, 200));
  }
  return r.json();
}

function slug(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

async function handleCatalogList(req, res) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(503).json({ error: "GITHUB_TOKEN_MISSING" });
  const owner = (process.env.GITHUB_OWNER || "juancodepyandc").trim();
  const repo = (process.env.GITHUB_REPO || "site_rep").trim();
  const branch = (process.env.GITHUB_BRANCH || "main").trim();
  try {
    const { data } = await readCatalogExtras(token, owner, repo, branch);
    const counts = {};
    CATALOG_CATEGORIES.forEach(c => { counts[c] = Array.isArray(data[c]) ? data[c].length : 0; });
    return res.status(200).json({ extras: data, counts });
  } catch (e) {
    return res.status(500).json({ error: "CATALOG_LIST_FAILED", detail: e.message });
  }
}

async function handleCatalogAdd(req, res) {
  let body = req.body || {};
  const category = String(body.category || "").trim();
  if (!CATALOG_CATEGORIES.includes(category)) return res.status(400).json({ error: "INVALID_CATEGORY" });
  const entry = body.entry && typeof body.entry === "object" ? { ...body.entry } : null;
  if (!entry) return res.status(400).json({ error: "MISSING_ENTRY" });
  const brand = String(entry.brand || "").trim();
  const name = String(entry.name || "").trim();
  if (!brand || !name) return res.status(400).json({ error: "MISSING_BRAND_OR_NAME" });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(503).json({ error: "GITHUB_TOKEN_MISSING" });
  const owner = (process.env.GITHUB_OWNER || "juancodepyandc").trim();
  const repo = (process.env.GITHUB_REPO || "site_rep").trim();
  const branch = (process.env.GITHUB_BRANCH || "main").trim();

  let glbInfo = null;
  if (body.glb && typeof body.glb === "object" && body.glb.content) {
    try {
      const safe = String(body.glb.filename || `${slug(brand)}-${slug(name)}.glb`).replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
      const ext = /\.gltf$/i.test(safe) ? ".gltf" : ".glb";
      const fname = /\.(glb|gltf)$/i.test(safe) ? safe : (safe + ext);
      const buffer = Buffer.from(body.glb.content, "base64");
      if (buffer.length > 30 * 1024 * 1024) return res.status(413).json({ error: "GLB_TOO_LARGE" });
      const path = `assets/aurora/manual/${fname}`;
      let sha = null;
      try {
        const g = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "atelier-aurora" }
        });
        if (g.ok) sha = (await g.json()).sha || null;
      } catch {}
      const putBody = { message: `catalog GLB: ${fname}`, content: buffer.toString("base64"), branch };
      if (sha) putBody.sha = sha;
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/vnd.github+json", "User-Agent": "atelier-aurora" },
        body: JSON.stringify(putBody)
      });
      if (!r.ok) {
        const t = await r.text().catch(() => "");
        return res.status(r.status).json({ error: "GLB_PUT_FAILED", detail: t.slice(0, 200) });
      }
      glbInfo = {
        filename: fname,
        url: `assets/aurora/manual/${fname}`,
        rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
      };
    } catch (e) {
      return res.status(500).json({ error: "GLB_UPLOAD_FAILED", detail: e.message });
    }
  }

  try {
    const { sha, data } = await readCatalogExtras(token, owner, repo, branch);
    if (!Array.isArray(data[category])) data[category] = [];
    const id = entry.id && String(entry.id).trim()
      ? String(entry.id).trim()
      : `${category}-${slug(brand)}-${slug(name)}-${Date.now().toString(36).slice(-4)}`;
    if (data[category].some(e => e.id === id)) return res.status(409).json({ error: "DUPLICATE_ID", id });
    const finalEntry = { ...entry, id, brand, name, addedAt: new Date().toISOString(), addedBy: "admin" };
    if (glbInfo) finalEntry.glb = glbInfo;
    data[category].push(finalEntry);
    await writeCatalogExtras(token, owner, repo, branch, data, sha, `catalog: add ${category}/${brand} ${name}`);
    return res.status(200).json({ ok: true, entry: finalEntry, totalInCategory: data[category].length });
  } catch (e) {
    return res.status(500).json({ error: "CATALOG_ADD_FAILED", detail: e.message });
  }
}

async function handleCatalogRemove(req, res) {
  let body = req.body || {};
  const category = String(body.category || "").trim();
  const id = String(body.id || "").trim();
  if (!CATALOG_CATEGORIES.includes(category) || !id) return res.status(400).json({ error: "BAD_REQUEST" });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(503).json({ error: "GITHUB_TOKEN_MISSING" });
  const owner = (process.env.GITHUB_OWNER || "juancodepyandc").trim();
  const repo = (process.env.GITHUB_REPO || "site_rep").trim();
  const branch = (process.env.GITHUB_BRANCH || "main").trim();
  try {
    const { sha, data } = await readCatalogExtras(token, owner, repo, branch);
    if (!Array.isArray(data[category])) return res.status(404).json({ error: "NOT_FOUND" });
    const before = data[category].length;
    data[category] = data[category].filter(e => e.id !== id);
    if (data[category].length === before) return res.status(404).json({ error: "NOT_FOUND" });
    await writeCatalogExtras(token, owner, repo, branch, data, sha, `catalog: remove ${category}/${id}`);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "CATALOG_REMOVE_FAILED", detail: e.message });
  }
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
    if (body.action === "upload") {
      req.body = body;
      return handleUpload(req, res);
    }
    if (body.action === "list") {
      req.body = body;
      return handleList(req, res);
    }
    if (body.action === "catalogAdd") {
      req.body = body;
      return handleCatalogAdd(req, res);
    }
    if (body.action === "catalogRemove") {
      req.body = body;
      return handleCatalogRemove(req, res);
    }
    req.body = body;
    return handleGenerate(req, res);
  }
  if (req.method === "GET") {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const act = url.searchParams.get("action");
    if (act === "list") return handleList(req, res);
    if (act === "catalogList") return handleCatalogList(req, res);
    return handleStatus(req, res);
  }
  return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
}
