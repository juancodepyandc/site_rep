import { getRedisClient } from "./_redis.js";

const QUOTE_CODE_RE = /^DV-[A-Z0-9]{6,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const TTL_SECONDS = 30 * 24 * 60 * 60;
const ALLOWED_SELECT_KEYS = new Set(["cpu", "mobo", "ram", "gpu", "storage", "psu", "case", "watercooling", "customCables", "cableMgmt", "delivery"]);

function clampText(value, max = 5000) {
  return String(value || "").trim().slice(0, max);
}

function sanitizeAdminStatus(status) {
  if (!status || typeof status !== "object") return undefined;
  const state = String(status.state || "").trim().toLowerCase();
  if (!["open", "settled"].includes(state)) return undefined;
  return {
    state,
    updatedAt: status.updatedAt || new Date().toISOString()
  };
}

function sanitizeMobileRequest(payload) {
  if (!payload || typeof payload !== "object") return undefined;
  return {
    deviceType: clampText(payload.deviceType || "", 120),
    issue: clampText(payload.issue || "", 160),
    model: clampText(payload.model || "", 220),
    description: clampText(payload.description || "", 4000)
  };
}

function sanitizeCameraDetail(detail) {
  if (detail && typeof detail === "object") {
    try {
      const serialized = JSON.stringify(detail);
      if (serialized.length <= 7000) return JSON.parse(serialized);
      return {
        _truncated: true,
        preview: serialized.slice(0, 6800)
      };
    } catch {
      return clampText(String(detail), 1200);
    }
  }
  return clampText(detail || "", 1200);
}

function sanitizeCameraClip(raw) {
  if (!raw || typeof raw !== "object") return null;
  const dataUrl = String(raw.dataUrl || "").trim();
  const isVideoDataUrl = dataUrl.startsWith("data:video/") && dataUrl.includes(";base64,");
  const safeDataUrl = isVideoDataUrl && dataUrl.length <= 220000 ? dataUrl : "";
  return {
    phase: clampText(raw.phase || "", 24),
    phaseLabel: clampText(raw.phaseLabel || "", 80),
    mimeType: clampText(raw.mimeType || "", 80),
    extension: clampText(raw.extension || "", 12),
    byteLength: Number(raw.byteLength || 0),
    durationMs: Number(raw.durationMs || 0),
    capturedAt: clampText(raw.capturedAt || "", 80),
    dataUrl: safeDataUrl,
    dropped: Boolean(raw.dropped) || !safeDataUrl,
    droppedReason: clampText(raw.droppedReason || (safeDataUrl ? "" : "DATA_TOO_LARGE_OR_INVALID"), 80),
    verification: raw.verification && typeof raw.verification === "object"
      ? {
          verdict: clampText(raw.verification.verdict || "", 24),
          positiveSignals: Array.isArray(raw.verification.positiveSignals)
            ? raw.verification.positiveSignals.slice(0, 8).map((v) => clampText(v || "", 180))
            : [],
          negativeSignals: Array.isArray(raw.verification.negativeSignals)
            ? raw.verification.negativeSignals.slice(0, 8).map((v) => clampText(v || "", 180))
            : []
        }
      : undefined
  };
}

function sanitizeCameraDiagnostics(payload) {
  if (!payload || typeof payload !== "object") return undefined;
  const runs = Array.isArray(payload.runs) ? payload.runs.slice(-8) : [];
  const safeRuns = runs.map((run) => {
    const entries = Array.isArray(run?.entries) ? run.entries.slice(-300) : [];
    const clips = Array.isArray(run?.media?.clips)
      ? run.media.clips.map((clip) => sanitizeCameraClip(clip)).filter(Boolean).slice(-2)
      : [];
    return {
      runId: clampText(run?.runId || "", 80),
      startedAt: clampText(run?.startedAt || "", 80),
      endedAt: clampText(run?.endedAt || "", 80),
      status: clampText(run?.status || "", 40),
      summary: run?.summary && typeof run.summary === "object"
        ? {
            supportsMediaDevices: Boolean(run.summary.supportsMediaDevices),
            supportsPermissionsApi: Boolean(run.summary.supportsPermissionsApi),
            supportsMediaRecorder: Boolean(run.summary.supportsMediaRecorder),
            cameraPermissionState: clampText(run.summary.cameraPermissionState || "", 40),
            detectedVideoInputs: Number(run.summary.detectedVideoInputs || 0),
            testedStreams: Number(run.summary.testedStreams || 0),
            successfulTests: Number(run.summary.successfulTests || 0),
            previewSequence: clampText(run.summary.previewSequence || "", 40),
            phaseSeconds: Number(run.summary.phaseSeconds || 0),
            recordingSeconds: Number(run.summary.recordingSeconds || 0),
            recordingMimeType: clampText(run.summary.recordingMimeType || "", 60),
            recordingCount: Number(run.summary.recordingCount || clips.length || 0),
            frontCameraStatus: clampText(run.summary.frontCameraStatus || "", 32),
            rearCameraStatus: clampText(run.summary.rearCameraStatus || "", 32),
            frontCameraVerification: clampText(run.summary.frontCameraVerification || "", 24),
            rearCameraVerification: clampText(run.summary.rearCameraVerification || "", 24),
            frontCameraError: clampText(run.summary.frontCameraError || "", 240),
            rearCameraError: clampText(run.summary.rearCameraError || "", 240),
            cameraSwitchCheck: clampText(run.summary.cameraSwitchCheck || "", 40),
            diagnosticHints: Array.isArray(run.summary.diagnosticHints)
              ? run.summary.diagnosticHints.slice(0, 12).map((v) => clampText(v || "", 260))
              : []
          }
        : undefined,
      entries: entries.map((entry) => ({
        ts: clampText(entry?.ts || "", 80),
        level: clampText(entry?.level || "", 16),
        event: clampText(entry?.event || "", 120),
        detail: sanitizeCameraDetail(entry?.detail)
      })),
      media: { clips }
    };
  });
  const result = {
    updatedAt: clampText(payload.updatedAt || "", 80),
    runs: safeRuns
  };
  let guard = 0;
  while (JSON.stringify(result).length > 300000 && guard < 64) {
    guard += 1;
    let removed = false;
    for (let i = 0; i < result.runs.length; i += 1) {
      const clips = result.runs[i]?.media?.clips;
      if (Array.isArray(clips) && clips.length) {
        clips.shift();
        if (result.runs[i]?.summary && typeof result.runs[i].summary === "object") {
          result.runs[i].summary.recordingCount = clips.length;
        }
        removed = true;
        break;
      }
    }
    if (!removed) break;
  }
  return result;
}

function sanitizeRecord(record, code, inheritedAdminStatus) {
  if (!record || typeof record !== "object") return null;
  const requester = record.requester && typeof record.requester === "object" ? record.requester : {};
  const email = clampText(requester.email || "", 200).toLowerCase();
  if (email && !EMAIL_RE.test(email)) return null;

  const rawSelects = record.selects && typeof record.selects === "object" ? record.selects : {};
  const rawExternal = record.external && typeof record.external === "object" ? record.external : {};
  const selects = Object.fromEntries(
    Object.entries(rawSelects)
      .filter(([k]) => ALLOWED_SELECT_KEYS.has(k))
      .map(([k, v]) => [k, clampText(v || "", 160)])
  );
  const external = Object.fromEntries(
    Object.entries(rawExternal)
      .filter(([k]) => ALLOWED_SELECT_KEYS.has(k))
      .map(([k, v]) => {
        if (!v || typeof v !== "object") return [k, { query: clampText(v || "", 240) }];
        const entry = { query: clampText(v.query || "", 240) };
        if (typeof v.note === "string" && v.note.trim()) entry.note = clampText(v.note, 600);
        if (v.resolved && typeof v.resolved === "object") {
          const r = v.resolved;
          const allowedSpecKeys = ["brand", "name", "socket", "ramType", "tier", "generation", "tdp", "watts", "vram", "length", "gb", "type", "tb", "maxGpu", "maxRad", "radiator", "rank", "score", "price"];
          const cleanResolved = {};
          allowedSpecKeys.forEach(specKey => {
            const val = r[specKey];
            if (typeof val === "number" && Number.isFinite(val)) cleanResolved[specKey] = val;
            else if (typeof val === "string") cleanResolved[specKey] = clampText(val, 200);
          });
          if (typeof r.sourceHint === "string") cleanResolved.sourceHint = clampText(r.sourceHint, 200);
          if (Object.keys(cleanResolved).length) entry.resolved = cleanResolved;
        }
        if (v.needsCompatConfirm === true || v.needsCompatConfirm === false) entry.needsCompatConfirm = Boolean(v.needsCompatConfirm);
        return [k, entry];
      })
  );

  return {
    code,
    createdAt: record.createdAt || new Date().toISOString(),
    requester: {
      name: clampText(requester.name || "", 200),
      email,
      details: clampText(requester.details || "", 8000),
      noviceMode: Boolean(requester.noviceMode),
      noviceBrief: clampText(requester.noviceBrief || "", 5000),
      budgetMin: Number(requester.budgetMin || 0) || 0,
      budgetMax: Number(requester.budgetMax || 0) || 0
    },
    signature: clampText(record.signature || "", 30000),
    selects,
    external,
    usage: clampText(record.usage || "", 200),
    config: record.config && typeof record.config === "object" ? record.config : null,
    preview3d: record.preview3d && typeof record.preview3d === "object" ? record.preview3d : null,
    serviceType: clampText(record.serviceType || "", 80),
    issueCategory: clampText(record.issueCategory || "", 120),
    mobileRequest: sanitizeMobileRequest(record.mobileRequest),
    cameraDiagnostics: sanitizeCameraDiagnostics(record.cameraDiagnostics),
    adminStatus: sanitizeAdminStatus(record.adminStatus) || sanitizeAdminStatus(inheritedAdminStatus),
    updatedAt: record.updatedAt || undefined,
    lastOtpModification: record.lastOtpModification && typeof record.lastOtpModification === "object" ? record.lastOtpModification : undefined,
    modificationHistory: Array.isArray(record.modificationHistory) ? record.modificationHistory.slice(-20) : undefined
  };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
      return;
    }

    const { record } = req.body || {};
    if (!record || !record.code) {
      res.status(400).json({ error: "INVALID_PAYLOAD" });
      return;
    }

    const client = await getRedisClient();
    const code = String(record.code).trim().toUpperCase();
    if (!QUOTE_CODE_RE.test(code)) {
      res.status(400).json({ error: "INVALID_CODE_FORMAT" });
      return;
    }

    let inheritedAdminStatus = undefined;
    try {
      const existingRaw = await client.get(`quote:${code}`);
      if (existingRaw) {
        const existing = JSON.parse(existingRaw);
        inheritedAdminStatus = existing?.adminStatus;
      }
    } catch {
      inheritedAdminStatus = undefined;
    }

    const sanitized = sanitizeRecord(record, code, inheritedAdminStatus);
    if (!sanitized) {
      res.status(400).json({ error: "INVALID_RECORD" });
      return;
    }
    if (JSON.stringify(sanitized).length > 380000) {
      res.status(413).json({ error: "RECORD_TOO_LARGE" });
      return;
    }

    await client.set(`quote:${code}`, JSON.stringify(sanitized), { EX: TTL_SECONDS });

    res.status(200).json({ ok: true, code });
  } catch (err) {
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      detail: String(err?.message || err)
    });
  }
}
