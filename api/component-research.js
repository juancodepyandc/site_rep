const UA = "Mozilla/5.0 (compatible; AtelierPCBot/1.0; +https://vercel.com)";
const ALLOWED_KEYS = new Set(["cpu", "mobo", "ram", "gpu", "storage", "psu", "case", "watercooling", "customCables", "cableMgmt", "delivery"]);

function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function rxNumber(text, regex) {
  const m = String(text).match(regex);
  if (!m?.[1]) return null;
  const n = Number(String(m[1]).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parseSocket(text) {
  const t = normalize(text);
  if (t.includes("am5")) return "AM5";
  if (t.includes("am4")) return "AM4";
  if (t.includes("1851")) return "1851";
  if (t.includes("1700")) return "1700";
  return null;
}

function parseRamType(text) {
  const t = normalize(text);
  if (t.includes("ddr5")) return "DDR5";
  if (t.includes("ddr4")) return "DDR4";
  return null;
}

async function fetchWithTimeout(url, ms = 7000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9,fr;q=0.8" },
      signal: ctrl.signal
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

async function duckduckgoSnippets(query) {
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const html = await fetchWithTimeout(url, 8000);
  if (!html) return "";
  const snippets = Array.from(html.matchAll(/result__snippet[^>]*>([\s\S]*?)<\/a>/gi))
    .map((m) => stripHtml(m[1]))
    .filter(Boolean)
    .slice(0, 8);
  return snippets.join(" | ");
}

async function wikipediaText(query) {
  const searchUrl = `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(query)}&limit=3`;
  const searchRaw = await fetchWithTimeout(searchUrl, 6000);
  if (!searchRaw) return "";
  let search;
  try {
    search = JSON.parse(searchRaw);
  } catch {
    return "";
  }
  const titles = (search?.pages || []).map((p) => p?.title).filter(Boolean).slice(0, 2);
  if (!titles.length) return "";

  const extracts = [];
  for (const title of titles) {
    const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const raw = await fetchWithTimeout(sumUrl, 5000);
    if (!raw) continue;
    try {
      const js = JSON.parse(raw);
      if (js?.extract) extracts.push(js.extract);
    } catch {
      // ignore
    }
  }
  return extracts.join(" | ");
}

function inferCpu(query, text, context) {
  const q = normalize(query);
  const t = normalize(`${query} ${text}`);
  const socket = parseSocket(t) || context?.mobo?.socket || (q.includes("ultra") ? "1851" : q.includes("intel") ? "1700" : "AM5");
  const tdp = rxNumber(t, /tdp[^0-9]{0,8}(\d{2,3})\s*w/i) || rxNumber(t, /(\d{2,3})\s*w[^a-z]{0,10}tdp/i) || (q.includes("k") || q.includes("x") ? 125 : 65);
  const tier = /i9|r9|ryzen 9|core i9/.test(q) ? 9 : /i7|r7|ryzen 7|core i7/.test(q) ? 8 : /i5|r5|ryzen 5|core i5/.test(q) ? 7 : 6;
  const generation = rxNumber(q, /(\d{4,5})/) || 0;
  return {
    brand: q.includes("intel") || q.includes("core") ? "Intel" : q.includes("amd") || q.includes("ryzen") ? "AMD" : "Référence externe",
    socket,
    tdp,
    generation,
    rank: tier,
    score: tier
  };
}

function inferMobo(query, text, context) {
  const q = normalize(query);
  const t = normalize(`${query} ${text}`);
  const socket = parseSocket(t) || context?.cpu?.socket || "AM5";
  const ramType = parseRamType(t) || context?.ram?.type || (socket === "AM4" ? "DDR4" : "DDR5");
  const generation = rxNumber(t, /([bxz]\d{3})/i) || (socket === "1851" ? 890 : socket === "1700" ? 790 : socket === "AM5" ? 650 : 550);
  const tier = /x|z/.test(q) ? 3 : /hero|master|godlike|apex/.test(q) ? 4 : 2;
  return { socket, ramType, generation, tier, score: 8.5 };
}

function inferRam(query, text, context) {
  const t = normalize(`${query} ${text}`);
  const type = parseRamType(t) || context?.mobo?.ramType || "DDR5";
  const gb = rxNumber(t, /\b(16|24|32|48|64|96|128)\s*(gb|go)\b/i) || 32;
  const generation = rxNumber(t, /(3[0-9]{3}|4[0-9]{3}|5[0-9]{3}|6[0-9]{3}|7[0-9]{3})/) || (type === "DDR5" ? 6000 : 3200);
  return { type, gb, generation, score: type === "DDR5" ? 9.0 : 7.6 };
}

function inferGpu(query, text) {
  const q = normalize(query);
  const t = normalize(`${query} ${text}`);
  const vram = rxNumber(t, /\b(6|8|10|12|16|20|24|32)\s*(gb|go)\b/i) || 12;
  const tdp = rxNumber(t, /tdp[^0-9]{0,8}(\d{2,3})\s*w/i) || (vram >= 20 ? 360 : vram >= 16 ? 300 : vram >= 12 ? 240 : 180);
  const length = rxNumber(t, /(\d{3})\s*mm/i) || 320;
  const rank = vram >= 24 ? 9.3 : vram >= 16 ? 8.5 : vram >= 12 ? 7.7 : 6.5;
  const generation = rxNumber(q, /(3\d{3}|4\d{3}|5\d{3}|6\d{3}|7\d{3}|9\d{3})/) || 0;
  return {
    brand: q.includes("nvidia") || q.includes("geforce") || q.includes("rtx") ? "NVIDIA" : q.includes("amd") || q.includes("radeon") || q.includes("rx") ? "AMD" : "Référence externe",
    vram,
    tdp,
    length,
    generation,
    rank,
    score: rank
  };
}

function inferStorage(query, text) {
  const t = normalize(`${query} ${text}`);
  const tb = rxNumber(t, /(\d+(?:[.,]\d+)?)\s*(tb|to)\b/i) || 1;
  const generation = /pcie\s*5|gen5|5\.0/.test(t) ? 5 : 4;
  return { tb, generation, score: generation === 5 ? 9.5 : 8.7 };
}

function inferPsu(query, text) {
  const t = normalize(`${query} ${text}`);
  const watts = rxNumber(t, /(\d{3,4})\s*w\b/i) || rxNumber(t, /\b(\d{3,4})\b/) || 850;
  return { generation: watts, watts, score: watts >= 1000 ? 9.2 : watts >= 850 ? 8.9 : 8.0 };
}

function inferCase(query, text) {
  const t = normalize(`${query} ${text}`);
  const maxGpu = rxNumber(t, /gpu[^0-9]{0,25}(\d{3})\s*mm/i) || rxNumber(t, /(\d{3})\s*mm/i) || 390;
  const maxRad = rxNumber(t, /(240|280|360|420)\s*mm[^a-z]{0,15}(rad|radiat)/i) || 360;
  return { maxGpu, maxRad, score: 8.9 };
}

function inferCooling(query, text) {
  const t = normalize(`${query} ${text}`);
  const type = t.includes("custom") ? "custom" : t.includes("air") ? "air" : "aio";
  const radiator = type === "air" ? 0 : (rxNumber(t, /(240|280|360|420)\s*mm/i) || 360);
  return { type, radiator, score: type === "air" ? 8.7 : 9.2, estimateOnly: type === "custom" };
}

function inferCable(query, text) {
  const t = normalize(`${query} ${text}`);
  const category = t.includes("gpu") || t.includes("12vhpwr") || t.includes("pcie")
    ? "Carte graphique (PCIe/12VHPWR)"
    : t.includes("eps") || t.includes("cpu")
      ? "CPU (EPS 8-pin)"
      : t.includes("24") || t.includes("atx")
        ? "Carte mère (24-pin)"
        : "Autres (SATA/ARGB/FAN)";
  return {
    category,
    requiredPcie8: t.includes("3x8") ? 3 : t.includes("2x8") ? 2 : t.includes("1x8") ? 1 : undefined,
    requiredEps8: t.includes("2eps") || t.includes("2xeps") ? 2 : t.includes("eps") ? 1 : undefined,
    requires12vhpwr: t.includes("12vhpwr") || t.includes("12v2x6"),
    score: 8.6
  };
}

function inferDelivery(query) {
  const q = normalize(query);
  const mode = q.includes("prioritaire") || q.includes("express") ? "priority" : q.includes("eco") || q.includes("econom") ? "economy" : "normal";
  return {
    mode,
    prepWindow: mode === "priority" ? "2-3 jours ouvrés" : mode === "economy" ? "5-8 jours ouvrés" : "3-5 jours ouvrés",
    baseFee: mode === "priority" ? 36 : mode === "economy" ? 8 : 18,
    speedFactor: mode === "priority" ? 1.35 : mode === "economy" ? 0.72 : 1.0,
    insuranceFactor: mode === "priority" ? 1.2 : mode === "economy" ? 0.8 : 1.0
  };
}

function inferByKey(key, query, webText, context) {
  if (key === "cpu") return inferCpu(query, webText, context);
  if (key === "mobo") return inferMobo(query, webText, context);
  if (key === "ram") return inferRam(query, webText, context);
  if (key === "gpu") return inferGpu(query, webText, context);
  if (key === "storage") return inferStorage(query, webText, context);
  if (key === "psu") return inferPsu(query, webText, context);
  if (key === "case") return inferCase(query, webText, context);
  if (key === "watercooling") return inferCooling(query, webText, context);
  if (key === "customCables") return inferCable(query, webText, context);
  if (key === "cableMgmt") return { score: 8.2, price: 39 };
  if (key === "delivery") return inferDelivery(query);
  return {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { key, query, context } = req.body || {};
    if (!key || !query) {
      return res.status(400).json({ ok: false, error: "Missing key or query" });
    }
    const safeKey = String(key || "").trim();
    if (!ALLOWED_KEYS.has(safeKey)) {
      return res.status(400).json({ ok: false, error: "Invalid key" });
    }
    const safeQuery = String(query || "").trim().slice(0, 180);
    if (!safeQuery) {
      return res.status(400).json({ ok: false, error: "Invalid query" });
    }

    const searchQuery = `${safeQuery} ${safeKey} specifications`;
    const [ddg, wiki] = await Promise.all([
      duckduckgoSnippets(searchQuery),
      wikipediaText(safeQuery)
    ]);
    const webText = [ddg, wiki].filter(Boolean).join(" | ");
    const parsed = inferByKey(safeKey, safeQuery, webText, context || {});
    const source = webText ? "internet-heuristic" : "fallback-heuristic";

    return res.status(200).json({
      ok: true,
      source,
      parsed,
      evidence: webText.slice(0, 600)
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "component research failed", detail: String(err?.message || err) });
  }
}
