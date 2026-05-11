import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const POLL_INTERVAL_MS = 5000;
const PROMPT_MAX = 580;
const STEP_ORDER = ["queued", "reference", "mesh", "polish", "rescue"];

const STEP_PATTERNS = [
  { id: "queued",    rx: /queue|attente|file/i },
  { id: "reference", rx: /reference|référence|flux|synth/i },
  { id: "mesh",      rx: /hunyuan|mesh|reconstruction|geometr/i },
  { id: "polish",    rx: /post[-\s]?traitement|polish|couleur|nettoy|finition/i },
  { id: "rescue",    rx: /rescue|score|valid/i }
];

function inferStepId(step) {
  if (!step) return "queued";
  for (const s of STEP_PATTERNS) if (s.rx.test(step)) return s.id;
  return "queued";
}

function fmtElapsed(s) {
  const sec = Math.max(0, Math.round(Number(s) || 0));
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

const CORE_KEYS = ["cpu", "mobo", "ram", "gpu", "storage", "psu", "case"];

function analyzeSelection(state) {
  const sel = state?.selection || {};
  const present = CORE_KEYS.filter(k => sel[k]);
  const cooling = sel.cooling && sel.cooling.isNone !== true ? sel.cooling : null;
  const customCable = sel.customCable && sel.customCable.isNone !== true ? sel.customCable : null;
  const cableMgmt = sel.cableMgmt && sel.cableMgmt.isNone !== true ? sel.cableMgmt : null;
  const finishings = [cooling, customCable, cableMgmt].filter(Boolean);
  const count = present.length + finishings.length;
  const hasCase = present.includes("case");
  const hasGpu = present.includes("gpu");
  const hasCpu = present.includes("cpu");

  if (count === 0) return { count: 0, kind: "empty", subjectKind: null, label: "Aucun composant" };

  if (count === 1) {
    const only = present[0] || (cooling ? "cooling" : customCable ? "customCable" : "cableMgmt");
    return {
      count: 1, kind: "single", subjectKind: only,
      label: `Composant seul : ${labelOne(only, sel)}`,
      only
    };
  }

  let combo = null;
  if (count === 2 || count === 3) {
    if (hasCase && hasGpu && !hasCpu) combo = "case+gpu";
    else if (hasCpu && cooling && !hasCase) combo = "cpu+cooling";
    else if (hasCpu && hasGpu && !hasCase) combo = "cpu+gpu";
    else if (hasCase && hasCpu && !hasGpu) combo = "case+cpu";
    else if (present.includes("psu") && hasCase) combo = "case+psu";
    else combo = "subassembly";
    return {
      count, kind: "subassembly", subjectKind: "subassembly",
      label: comboLabel(combo, sel, finishings),
      parts: present, combo
    };
  }

  if (hasCase) {
    return {
      count, kind: "tower", subjectKind: "pc_tower",
      label: `Tour complète (${present.length} composants principaux)`,
      parts: present
    };
  }
  return {
    count, kind: "exploded", subjectKind: "components",
    label: `Vue éclatée (${present.length} pièces, sans boîtier)`,
    parts: present
  };
}

function labelOne(kind, sel) {
  const it = sel[kind];
  if (!it) return kind;
  const brand = it.brand ? it.brand + " " : "";
  const name = it.name || "";
  switch (kind) {
    case "cpu": return `processeur ${brand}${name}`;
    case "gpu": return `carte graphique ${brand}${name}`;
    case "ram": return `RAM ${brand}${name}`;
    case "storage": return `SSD ${brand}${name}`;
    case "psu": return `${brand}${name}`;
    case "case": return `${brand}${name}`;
    case "mobo": return `carte mère ${brand}${name}`;
    default: return `${brand}${name}`;
  }
}

function comboLabel(combo, sel, finishings) {
  if (combo === "case+gpu") return `${labelOne("gpu", sel)} installée dans le ${labelOne("case", sel)}, panneau ouvert`;
  if (combo === "cpu+cooling") return `${finishings[0]?.brand || ""} ${finishings[0]?.name || "refroidissement"} monté sur ${labelOne("cpu", sel)}`;
  if (combo === "cpu+gpu") return `Diptyque atelier : ${labelOne("cpu", sel)} + ${labelOne("gpu", sel)}`;
  if (combo === "case+cpu") return `${labelOne("case", sel)} avec ${labelOne("cpu", sel)} installé sur carte mère partielle`;
  if (combo === "case+psu") return `${labelOne("psu", sel)} dans la chambre PSU du ${labelOne("case", sel)}`;
  return `Sous-ensemble : ${CORE_KEYS.filter(k => sel[k]).map(k => labelOne(k, sel)).join(", ")}`;
}

function buildPromptFromAnalysis(analysis, state) {
  const sel = state?.selection || {};
  const usage = sel.usage || null;
  const bits = [];

  if (analysis.kind === "single") {
    const k = analysis.only;
    const name = labelOne(k, sel);
    if (k === "gpu") bits.push(`Carte graphique ${sel.gpu?.brand || ""} ${sel.gpu?.name || ""}, vue produit 3/4, photo studio, fond gris dégradé`);
    else if (k === "cpu") bits.push(`Processeur ${sel.cpu?.brand || ""} ${sel.cpu?.name || ""}, vue close-up macro, IHS poli réfléchissant, fond uni`);
    else if (k === "ram") bits.push(`Kit RAM ${sel.ram?.brand || ""} ${sel.ram?.name || ""}, deux à quatre barrettes alignées avec dissipateur, vue produit 3/4`);
    else if (k === "storage") bits.push(`SSD ${sel.storage?.brand || ""} ${sel.storage?.name || ""}, vue produit close-up macro, étiquette lisible`);
    else if (k === "psu") bits.push(`${sel.psu?.brand || ""} ${sel.psu?.name || ""}, alimentation modulaire vue 3/4, câbles enroulés visibles`);
    else if (k === "case") bits.push(`${sel.case?.brand || ""} ${sel.case?.name || ""} vide, vue 3/4 isométrique, panneau verre ouvert, intérieur visible`);
    else if (k === "mobo") bits.push(`Carte mère ${sel.mobo?.brand || ""} ${sel.mobo?.name || ""}, vue de dessus, slots et socket visibles`);
    else bits.push(`${name}, vue produit studio`);
    bits.push("éclairage studio neutre 5500K, ombres douces, rendu hyperréaliste");
  } else if (analysis.kind === "subassembly") {
    const combo = analysis.combo;
    if (combo === "case+gpu") {
      bits.push(`Vue intérieure : ${sel.case?.brand || ""} ${sel.case?.name || ""} avec ${sel.gpu?.brand || ""} ${sel.gpu?.name || ""} installée horizontalement sur slot PCIe, panneau verre ouvert montrant l'intérieur, autres slots vides`);
    } else if (combo === "cpu+cooling") {
      const cooling = sel.cooling;
      bits.push(`Close-up isométrique : ${cooling?.brand || ""} ${cooling?.name || ""} monté sur ${sel.cpu?.brand || ""} ${sel.cpu?.name || ""}, carte mère partielle visible sous le socket, aucun boîtier`);
    } else if (combo === "cpu+gpu") {
      bits.push(`Diptyque produit : à gauche ${sel.cpu?.brand || ""} ${sel.cpu?.name || ""} en close-up, à droite ${sel.gpu?.brand || ""} ${sel.gpu?.name || ""} en 3/4, fond uni, espacement uniforme`);
    } else if (combo === "case+cpu") {
      bits.push(`${sel.case?.brand || ""} ${sel.case?.name || ""} avec ${sel.cpu?.brand || ""} ${sel.cpu?.name || ""} installé sur carte mère partielle, panneau verre ouvert`);
    } else if (combo === "case+psu") {
      bits.push(`Vue intérieure : ${sel.psu?.brand || ""} ${sel.psu?.name || ""} fixée dans la chambre PSU du ${sel.case?.brand || ""} ${sel.case?.name || ""}, panneau verre ouvert`);
    } else {
      const parts = CORE_KEYS.filter(k => sel[k]).map(k => labelOne(k, sel));
      bits.push(`Sous-ensemble atelier : ${parts.join(", ")}, alignés sur fond neutre, vue produit éditoriale`);
    }
    bits.push("éclairage studio 5500K, ombres douces, rendu hyperréaliste");
  } else if (analysis.kind === "tower") {
    bits.push(`Tour PC ATX entièrement assemblée, vue 3/4 atelier, ${sel.case?.brand || ""} ${sel.case?.name || ""} panneau verre trempé visible`);
    if (sel.gpu) bits.push(`${sel.gpu.brand || ""} ${sel.gpu.name || ""} installée horizontalement, backplate visible`);
    if (sel.cpu) bits.push(`${sel.cpu.brand || ""} ${sel.cpu.name || ""}${sel.cooling && sel.cooling.isNone !== true ? " sous " + (sel.cooling.brand || "") + " " + (sel.cooling.name || "") : ""}`);
    if (sel.ram) bits.push(`barrettes ${sel.ram.brand || ""} ${sel.ram.name || ""}`);
    if (sel.psu) bits.push(`${sel.psu.brand || ""} ${sel.psu.name || ""} dans la chambre PSU`);
    if (sel.storage) bits.push(`SSD M.2 ${sel.storage.brand || ""} visible sur carte mère`);
    if (sel.customCable && sel.customCable.isNone !== true) bits.push(`câbles personnalisés ${sel.customCable.name || ""}`);
    if (sel.cableMgmt && sel.cableMgmt.isNone !== true) bits.push("câble management impeccable");
    if (usage) bits.push(`config orientée ${usage}`);
    bits.push("éclairage studio chaud + froid contrasté, fond neutre, ratio carré, rendu hyperréaliste");
  } else if (analysis.kind === "exploded") {
    const parts = ["cpu","gpu","ram","storage","psu","mobo"].filter(k => sel[k]).map(k => labelOne(k, sel));
    bits.push(`Vue éclatée atelier : ${parts.join(", ")} disposés en grille produit sur fond neutre, ombres portées, aucune carcasse de boîtier, éclairage studio, rendu hyperréaliste`);
  }

  let p = bits.join(", ").replace(/\s+/g, " ").trim();
  if (p.length > PROMPT_MAX) p = p.slice(0, PROMPT_MAX - 1) + "…";
  return p;
}

function subjectShortLabel(a) {
  if (!a || a.kind === "empty") return "Aucun composant";
  return a.label;
}

const Loading = (() => {
  const root = () => document.getElementById("auroraLoading");
  const $1 = (id) => document.getElementById(id);
  return {
    open(prompt, subject) {
      const r = root(); if (!r) return;
      $1("auroraLoadingPrompt").textContent = prompt;
      $1("auroraLoadingSubject").textContent = subject || "—";
      this.update({ step: null, elapsedS: 0, attempts: 1, score: null });
      $1("auroraLoadingTitle").textContent = "Génération en cours";
      $1("auroraLoadingLead").textContent = "Le pipeline synthétise plusieurs vues de référence avant de reconstruire la géométrie 3D et de peindre le mesh. Comptez 20 à 30 minutes — vous pouvez continuer de naviguer.";
      r.classList.add("is-open");
      r.setAttribute("aria-hidden", "false");
    },
    show() { const r = root(); if (r) { r.classList.add("is-open"); r.setAttribute("aria-hidden", "false"); }},
    close() { const r = root(); if (r) { r.classList.remove("is-open"); r.setAttribute("aria-hidden", "true"); }},
    setError(msg) {
      const t = $1("auroraLoadingTitle"); if (t) t.textContent = "Erreur";
      const l = $1("auroraLoadingLead"); if (l) l.textContent = msg;
    },
    update({ step, elapsedS, attempts, score, fail }) {
      const r = root(); if (!r) return;
      const id = inferStepId(step);
      const idx = STEP_ORDER.indexOf(id);
      r.querySelectorAll("[data-step]").forEach(n => {
        const i = STEP_ORDER.indexOf(n.dataset.step);
        n.classList.toggle("is-active", i === idx);
        n.classList.toggle("is-done", i < idx);
      });
      const pct = fail ? 100 : Math.max(4, ((idx + 1) / STEP_ORDER.length) * 100);
      const fill = $1("auroraLoadingFill"); if (fill) fill.style.width = pct + "%";
      const e = $1("auroraLoadingElapsed"); if (e) e.textContent = fmtElapsed(elapsedS);
      const s = $1("auroraLoadingStep"); if (s) s.textContent = step || (id === "queued" ? "En attente" : id);
      const a = $1("auroraLoadingAttempt"); if (a) a.textContent = `${attempts || 1} / 2`;
      const sc = $1("auroraLoadingScore"); if (sc) sc.textContent = score == null ? "—" : `${Math.round(score)}/100`;
    }
  };
})();

const Ribbon = (() => {
  const root = () => document.getElementById("auroraRibbon");
  const txt = () => document.getElementById("auroraRibbonText");
  return {
    show(label) { const r = root(); if (r) { r.hidden = false; if (label && txt()) txt().textContent = label; }},
    hide() { const r = root(); if (r) r.hidden = true; },
    update(label) { const t = txt(); if (t) t.textContent = label; }
  };
})();

const Viewer = (() => {
  const root = () => document.getElementById("auroraViewer");
  const canvas = () => document.getElementById("auroraViewerCanvas");
  let renderer = null, scene = null, camera = null, controls = null;
  let currentModel = null, currentUrl = null, autoRotate = true, raf = 0, resizeObs = null;

  function init() {
    if (renderer) return;
    const c = canvas();
    renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c14);
    camera = new THREE.PerspectiveCamera(35, 1, 0.05, 200);
    camera.position.set(2.4, 1.6, 3.4);
    scene.add(new THREE.AmbientLight(0xc9dfff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(4, 6, 5); scene.add(key);
    const fill = new THREE.DirectionalLight(0x88aaff, 0.6); fill.position.set(-4, 2, -2); scene.add(fill);
    const rim = new THREE.PointLight(0x35f3b4, 0.8, 12, 2); rim.position.set(0, 2, -3); scene.add(rim);
    const grid = new THREE.GridHelper(10, 20, 0x224066, 0x152340); grid.position.y = -0.001; scene.add(grid);
    controls = new OrbitControls(camera, c);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.minDistance = 0.5; controls.maxDistance = 12;
    controls.target.set(0, 0.6, 0);
    resizeObs = new ResizeObserver(resize);
    resizeObs.observe(c.parentElement);
    resize();
  }
  function resize() {
    const c = canvas(); if (!renderer || !c) return;
    const r = c.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = Math.max(0.001, r.width / Math.max(1, r.height));
    camera.updateProjectionMatrix();
  }
  function frameModel(obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3(), center = new THREE.Vector3();
    box.getSize(size); box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 2.2;
    obj.scale.setScalar(targetSize / maxDim);
    box.setFromObject(obj); box.getCenter(center);
    obj.position.x -= center.x;
    obj.position.y -= box.min.y;
    obj.position.z -= center.z;
    controls.target.set(0, targetSize * 0.4, 0);
    camera.position.set(targetSize * 1.4, targetSize * 0.85, targetSize * 1.55);
    controls.update();
  }
  function loop() {
    if (autoRotate && currentModel) currentModel.rotation.y += 0.004;
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  async function load(url) {
    init();
    if (currentModel) {
      scene.remove(currentModel);
      currentModel.traverse(o => { if (o.isMesh) { o.geometry?.dispose?.(); const m = o.material; if (Array.isArray(m)) m.forEach(x => x?.dispose?.()); else m?.dispose?.(); }});
      currentModel = null;
    }
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    currentModel = gltf.scene;
    currentUrl = url;
    currentModel.traverse(o => { if (o.isMesh && o.material) {
      const m = o.material;
      if (Array.isArray(m)) m.forEach(x => { if (x && "envMapIntensity" in x) x.envMapIntensity = 0.85; });
      else if ("envMapIntensity" in m) m.envMapIntensity = 0.85;
    }});
    scene.add(currentModel);
    frameModel(currentModel);
    if (!raf) loop();
  }
  function setChips({ score, cached, ephemeral, localPath }) {
    const chips = document.getElementById("auroraViewerChips");
    if (!chips) return;
    chips.innerHTML = "";
    const mk = (cls, text) => { const e = document.createElement("span"); e.className = "aurora-viewer__chip " + cls; e.textContent = text; chips.appendChild(e); };
    if (score != null) mk("aurora-viewer__chip--score", `Score ${Math.round(score)}/100`);
    if (cached) mk("aurora-viewer__chip--cache", "Cache");
    if (ephemeral) mk("aurora-viewer__chip--cache", "URL temporaire");
    if (localPath) mk("aurora-viewer__chip--cache", `repo · ${localPath.split("/").pop()}`);
  }
  function open({ url, score, cached, ephemeral, localPath }) {
    const r = root(); if (!r) return;
    r.classList.add("is-open"); r.setAttribute("aria-hidden", "false");
    setChips({ score, cached, ephemeral, localPath });
    setTimeout(resize, 60);
    load(url).catch(err => { const h = document.querySelector(".aurora-viewer__hint"); if (h) h.textContent = "Échec chargement GLB : " + (err?.message || "inconnu"); });
  }
  function close() { const r = root(); if (r) { r.classList.remove("is-open"); r.setAttribute("aria-hidden", "true"); }}
  function setAutoRotate(v) { autoRotate = v; }
  function downloadCurrent() {
    if (!currentUrl) return;
    const a = document.createElement("a"); a.href = currentUrl; a.download = "atelier-rendu.glb";
    document.body.appendChild(a); a.click(); a.remove();
  }
  return { open, close, load, setAutoRotate, downloadCurrent };
})();

const State = {
  jobId: null,
  cacheKey: null,
  prompt: "",
  analysis: null,
  startedAt: 0,
  polling: false,
  background: false,
  abort: false,
  lastStatus: null
};

function showToast(text) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = text;
  el.classList.add("is-show");
  clearTimeout(el._auroraT);
  el._auroraT = setTimeout(() => el.classList.remove("is-show"), 3200);
}

function getState() {
  const fn = window.getAELatestConfigState;
  return typeof fn === "function" ? fn() : null;
}

function updateButtonLabel() {
  const btn = document.getElementById("openAuroraPreview");
  if (!btn) return;
  const state = getState();
  const a = analyzeSelection(state);
  let label;
  if (a.kind === "empty") label = "Aperçu réaliste · sélectionnez";
  else if (a.kind === "single") label = "Aperçu réaliste · composant seul";
  else if (a.kind === "subassembly") label = `Aperçu réaliste · sous-ensemble (${a.count})`;
  else if (a.kind === "tower") label = "Aperçu réaliste · tour complète";
  else if (a.kind === "exploded") label = `Aperçu réaliste · vue éclatée (${a.count})`;
  else label = "Aperçu réaliste (IA)";
  btn.textContent = label;
  btn.classList.toggle("is-disabled-ish", a.kind === "empty");
}

async function startJob(subjectKind) {
  const r = await fetch("/api/aurora", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: State.prompt, subject_kind: subjectKind || "pc_tower" })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || (!data.jobId && !data.cached)) {
    throw new Error(data.error || `HTTP_${r.status}`);
  }
  return data;
}

async function pollStatus(jobId) {
  const r = await fetch(`/api/aurora?job=${encodeURIComponent(jobId)}`);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `HTTP_${r.status}`);
  return data;
}

async function launch() {
  const state = getState();
  const analysis = analyzeSelection(state);
  if (analysis.kind === "empty") {
    showToast("Sélectionnez au moins un composant.");
    return;
  }
  if (State.polling && !State.background) return;

  State.abort = false;
  State.background = false;
  State.analysis = analysis;
  State.prompt = buildPromptFromAnalysis(analysis, state);
  State.lastStatus = null;

  Loading.open(State.prompt, subjectShortLabel(analysis));

  try {
    const startRes = await startJob(analysis.subjectKind);
    if (startRes.cached && startRes.url) {
      await new Promise(r => setTimeout(r, 350));
      Loading.close();
      Viewer.open({ url: startRes.url, score: startRes.score, cached: true, localPath: startRes.localPath });
      showToast("Rendu chargé depuis le cache.");
      return;
    }
    State.jobId = startRes.jobId;
    State.cacheKey = startRes.cacheKey;
    State.startedAt = Date.now();
    State.polling = true;
    await pollLoop();
  } catch (err) {
    State.polling = false;
    Loading.update({ step: "Erreur : " + (err.message || "inconnue"), elapsedS: 0, attempts: 1, score: null, fail: true });
    Loading.setError("Vérifie que AURORA_KEY est bien configurée côté Vercel, que le PC Aurora est allumé, et que GITHUB_TOKEN est défini pour la persistance.");
    showToast("Aurora indisponible : " + (err.message || "erreur"));
  }
}

async function pollLoop() {
  while (State.polling && !State.abort) {
    let data;
    try { data = await pollStatus(State.jobId); }
    catch (err) {
      const errStatus = { step: "Erreur poll : " + err.message, elapsedS: (Date.now() - State.startedAt) / 1000, attempts: State.lastStatus?.attempts || 1, score: State.lastStatus?.score ?? null, fail: true };
      State.lastStatus = errStatus;
      Loading.update(errStatus);
      if (State.background) Ribbon.update(`Aurora · erreur réseau · retry`);
      await new Promise(r => setTimeout(r, POLL_INTERVAL_MS * 2));
      continue;
    }
    const elapsed = typeof data.elapsedS === "number" ? data.elapsedS : (Date.now() - State.startedAt) / 1000;

    if (data.state === "done") {
      State.polling = false;
      Loading.close();
      Ribbon.hide();
      if (data.url) {
        Viewer.open({ url: data.url, score: data.score, cached: false, ephemeral: !!data.ephemeral, localPath: data.localPath });
        showToast("Rendu réaliste prêt.");
      } else {
        showToast("Pipeline terminé mais aucun GLB exposé.");
      }
      return;
    }
    if (data.state === "failed") {
      State.polling = false;
      const failStatus = { step: "Rendu rejeté : " + (data.error || "qualité insuffisante"), elapsedS: elapsed, attempts: data.attempts || 2, score: data.score, fail: true };
      State.lastStatus = failStatus;
      Loading.update(failStatus);
      Loading.setError("Le pipeline a essayé 2 passes et n'a pas atteint le seuil de qualité. Réessayez ou ajustez la configuration.");
      Ribbon.hide();
      showToast("Rendu rejeté par le pipeline.");
      return;
    }
    const status = { step: data.step, elapsedS: elapsed, attempts: data.attempts || 1, score: data.score };
    State.lastStatus = status;
    Loading.update(status);
    if (State.background) Ribbon.update(`Aurora · ${fmtElapsed(elapsed)} · ${(data.step || "en cours").slice(0, 40)}`);
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
  }
}

function init() {
  const btn = document.getElementById("openAuroraPreview");
  btn?.addEventListener("click", () => launch());

  document.getElementById("auroraLoadingBackground")?.addEventListener("click", () => {
    State.background = true;
    Loading.close();
    Ribbon.show(`Aurora · ${fmtElapsed((Date.now() - State.startedAt) / 1000)} · en arrière-plan`);
    showToast("Suivi minimisé.");
  });
  document.getElementById("auroraLoadingCancel")?.addEventListener("click", () => {
    State.abort = true; State.polling = false;
    Loading.close(); Ribbon.hide();
    showToast("Suivi annulé (le job continue côté serveur).");
  });
  document.getElementById("auroraRibbonOpen")?.addEventListener("click", () => {
    State.background = false; Ribbon.hide();
    Loading.show();
    if (State.lastStatus) Loading.update(State.lastStatus);
  });
  document.getElementById("auroraViewerRotate")?.addEventListener("click", () => {
    const b = document.getElementById("auroraViewerRotate");
    const on = b.textContent === "Rotation auto";
    Viewer.setAutoRotate(!on);
    b.textContent = on ? "Rotation libre" : "Rotation auto";
  });
  document.getElementById("auroraViewerDownload")?.addEventListener("click", () => Viewer.downloadCurrent());
  document.getElementById("auroraViewerClose")?.addEventListener("click", () => Viewer.close());
  document.querySelector("#auroraViewer .aurora-viewer__back")?.addEventListener("click", () => Viewer.close());

  window.addEventListener("ae:config-state", updateButtonLabel);
  updateButtonLabel();
  setInterval(updateButtonLabel, 1500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
