(function() {
const COOKIE_KEY = "galerie_cookies_v1";

const OPENING_HOURS = {
  1: null,
  2: [10, 19],
  3: [10, 19],
  4: [10, 19],
  5: [10, 19],
  6: [10, 18],
  0: null
};

function getAtelierStatus() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const today = OPENING_HOURS[day];
  if (today && hour >= today[0] && hour < today[1]) {
    const closeH = today[1];
    return { open: true, label: `Atelier ouvert · ferme à ${closeH}h` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const h = OPENING_HOURS[d];
    if (h) {
      const names = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
      if (i === 1) return { open: false, label: `Atelier fermé · ouvre demain ${h[0]}h` };
      return { open: false, label: `Atelier fermé · ouvre ${names[d]} ${h[0]}h` };
    }
  }
  return { open: false, label: "Atelier fermé" };
}

function getTickerItems() {
  const status = getAtelierStatus();
  return [
    { tone: status.open ? "ok" : "warn", text: status.label },
    { tone: "",    text: "Devis clair avant intervention" },
    { tone: "ok",  text: "Diagnostic transparent & documenté" },
    { tone: "",    text: "Réparation PC · Mobile · PC sur mesure" },
    { tone: "ok",  text: "Concierge en ligne · réponse instantanée" },
    { tone: "",    text: "Rendu réaliste Aurora" }
  ];
}

const NUMERAL_BY_VIEW = {
  pc: "01", mobile: "02", custom: "03", admin: "04", contact: "05", legal: "06", compare: "04"
};

const CONCIERGE_SUGGESTIONS = [
  "Aide-moi à choisir un GPU pour du 1440p",
  "Combien pour réparer un écran d'iPhone 13 ?",
  "Quelle config pour Blender + montage 4K ?",
  "Mon PC est lent, que faire ?"
];

const CONCIERGE_SYSTEM = `Tu es le Concierge de l'Atelier Électronique.

PERSONNALITÉ
- Réponses en français, ton chaleureux, précis, sans esbroufe.
- Concis : 2 à 5 phrases.
- Tu reconnais quand tu ne sais pas et invites à écrire à rabuteaujuandavid@gmail.com.

L'ATELIER PROPOSE
1) Réparation PC — diagnostic, pannes, récupération de données.
2) Réparation mobile — écran, batterie, charge, caméra, audio.
3) PC sur mesure — simulateur de configuration avec aperçu 3D, et rendu réaliste Aurora.

RÈGLES TARIFAIRES
- Tu ne donnes JAMAIS de prix exact, ni de fourchette, ni d'estimation chiffrée.
- Pour un tarif, tu invites l'utilisateur à demander un devis via la page Réparation PC ou Mobile, ou à ouvrir le simulateur PC sur mesure qui calcule le prix.
- Pas d'accès aux devis stockés — propose le code DV-XXXXXX dans la salle correspondante.

ACTIONS QUE TU PEUX DÉCLENCHER (un seul marqueur max, sur sa propre ligne, transformé en bouton par l'interface)
[[OPEN:home]] | [[OPEN:pc]] | [[OPEN:mobile]] | [[OPEN:custom]] | [[OPEN:compare]] | [[OPEN:contact]] | [[OPEN:legal]]`;

const SPECIMENS = [
  { cat: "Carte graphique", slot: "gpu" },
  { cat: "Processeur",      slot: "cpu" },
  { cat: "Refroidissement", slot: "cooling" },
  { cat: "Boîtier",         slot: "case" },
  { cat: "Mémoire vive",    slot: "ram" },
  { cat: "Stockage",        slot: "storage" }
];

const CARNET_ENTRIES = [];

function gq(sel, root = document) { return root.querySelector(sel); }
function gqq(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function clearLegacyTheme() {
  let shouldStrip = false;
  try {
    if (!localStorage.getItem("galerie_seen_v3")) {
      const raw = localStorage.getItem("ae_theme_v1");
      let stored = null;
      try { stored = raw ? JSON.parse(raw) : null; } catch {}
      if (!stored || stored.presetName !== "galerie") {
        localStorage.removeItem("ae_theme_v1");
        shouldStrip = true;
      }
      localStorage.setItem("galerie_seen_v3", "1");
    }
  } catch {}
  if (!shouldStrip) return;
  const root = document.documentElement;
  ["--bg","--text","--muted","--muted2","--stroke","--panel","--panel2","--accent","--accent2","--accent3","--accentWarm","--ui-panel-top","--ui-panel-bottom","--ui-input-bg","--ui-input-border","--ui-input-focus","--ui-btn-border","--ui-btn-bg","--ui-btn-hover-bg","--ui-btn-ghost-bg","--ui-btn-ghost-border","--ui-btn-primary-from","--ui-btn-primary-to","--ui-btn-primary-text"].forEach(v => root.style.removeProperty(v));
}

function buildTicker() {
  if (gq("#galerieTicker")) return;
  const t = document.createElement("div");
  t.className = "galerie-ticker"; t.id = "galerieTicker";
  const dotClass = tone => tone === "ok" ? " galerie-ticker__dot--ok" : tone === "warn" ? " galerie-ticker__dot--warn" : "";
  const make = () => getTickerItems().map(i => `<span><span class="galerie-ticker__dot${dotClass(i.tone)}"></span>${i.text}</span>`).join("");
  const render = () => { t.innerHTML = `<div class="galerie-ticker__strip">${make()}${make()}</div>`; };
  render();
  document.body.insertBefore(t, document.body.firstChild);
  setInterval(render, 60_000);
}

function injectNumerals() {
  gqq(".view").forEach(v => {
    const num = NUMERAL_BY_VIEW[v.dataset.view];
    if (!num) return;
    const head = v.querySelector(".section__head");
    if (!head || head.querySelector(".galerie-numeral")) return;
    const n = document.createElement("span");
    n.className = "galerie-numeral"; n.setAttribute("aria-hidden", "true"); n.textContent = num;
    head.appendChild(n);
  });
}

function buildCursor() {
  if (!matchMedia("(pointer: fine)").matches) return;
  if (gq("#galerieCursor")) return;
  document.body.classList.add("has-magnet");
  const c = document.createElement("div");
  c.className = "galerie-cursor"; c.id = "galerieCursor"; c.setAttribute("aria-hidden", "true");
  c.innerHTML = '<span class="galerie-cursor__ring"></span><span class="galerie-cursor__dot"></span>';
  document.body.appendChild(c);
  let tx = 0, ty = 0, x = 0, y = 0;
  document.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  document.addEventListener("pointerover", e => {
    const t = e.target.closest("a, button, input, select, textarea, .btn, .nav__link, .showcase__card, .chip, .combo-option, .picker__opt, [data-nav], .theme-chip, .specimen");
    c.classList.toggle("is-hover", !!t);
  });
  function loop() { x += (tx - x) * 0.22; y += (ty - y) * 0.22; c.style.transform = `translate(${x}px, ${y}px)`; requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
}

function loadCookies() { try { return JSON.parse(localStorage.getItem(COOKIE_KEY) || "null"); } catch { return null; } }
function saveCookies(c) { try { localStorage.setItem(COOKIE_KEY, JSON.stringify(c)); } catch {} }

function buildCookieBanner() {
  if (loadCookies()) return;
  if (gq("#galerieCookie")) return;
  const b = document.createElement("div");
  b.className = "galerie-cookie"; b.id = "galerieCookie";
  b.innerHTML = `
    <div class="galerie-cookie__icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r=".8" fill="currentColor"/><circle cx="14" cy="14" r=".8" fill="currentColor"/><circle cx="15" cy="9" r=".6" fill="currentColor"/></svg>
    </div>
    <div class="galerie-cookie__text">
      <div class="galerie-cookie__title">Cookies & confidentialité</div>
      <p class="galerie-cookie__desc">La maison utilise uniquement des cookies techniques nécessaires au fonctionnement des devis et diagnostics. Aucun suivi publicitaire.</p>
    </div>
    <div class="galerie-cookie__actions">
      <button class="btn btn--ghost btn--tiny" id="galerieCookieRefuse">Tout refuser</button>
      <button class="btn btn--primary btn--tiny" id="galerieCookieAccept">Tout accepter</button>
    </div>
  `;
  document.body.appendChild(b);
  setTimeout(() => b.classList.add("is-show"), 800);
  gq("#galerieCookieAccept").addEventListener("click", () => { saveCookies({ essentials: true, func: true, perf: true, stats: true, at: new Date().toISOString() }); b.classList.remove("is-show"); setTimeout(() => b.remove(), 400); });
  gq("#galerieCookieRefuse").addEventListener("click", () => { saveCookies({ essentials: true, func: false, perf: false, stats: false, at: new Date().toISOString() }); b.classList.remove("is-show"); setTimeout(() => b.remove(), 400); });
}

function injectHomeExtras() {
  const home = gq('.view[data-view="home"]');
  if (!home || gq("#galerieHomeExtras")) return;
  const wrap = document.createElement("div");
  wrap.id = "galerieHomeExtras";
  wrap.innerHTML = `
    <section class="galerie-manifesto">
      <div class="container">
        <span class="galerie-kicker"><span class="galerie-kicker__pulse"></span>Manifeste</span>
        <p class="galerie-manifesto__quote">
          Pas un PC.<br>
          <em>Une pièce</em><br>
          que vous gardez.
        </p>
        <div class="galerie-manifesto__sig">Atelier Électronique · Maison de précision</div>
      </div>
    </section>

    <section class="galerie-editorial">
      <div class="container">
        <div class="galerie-editorial__grid">
          <div class="galerie-editorial__col">
            <span class="galerie-eyebrow">L'approche</span>
            <h2 class="galerie-editorial__h">Diagnostic d'abord.<br>Devis ensuite.<br><em>Intervention en dernier.</em></h2>
          </div>
          <div class="galerie-editorial__col galerie-editorial__copy">
            <p>Chaque pièce reçue passe par un <strong>protocole de diagnostic documenté</strong> : tests de puissance, températures, intégrité des données, contrôle visuel. On photographie l'état initial. On vous transmet le compte-rendu.</p>
            <p>Le devis vient ensuite — <strong>chiffré, justifié, validable en un clic</strong>. Pas de surprise au remontage. Pas d'option ajoutée sans accord.</p>
            <p>Pour les configurations sur mesure, le simulateur <strong>vérifie en temps réel la cohérence électrique, thermique et mécanique</strong>. Vous gardez le contrôle, la maison garde la responsabilité du résultat.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="galerie-specimens">
      <div class="container">
        <header class="galerie-section-head">
          <span class="galerie-eyebrow">Spécimens</span>
          <h2 class="galerie-section-title">Pièces <em>exposées</em>.</h2>
          <p class="galerie-section-lead">Sélection rotative des composants qu'on aime monter cette saison. Cliquer pour inspecter — chaque pièce indique sa note atelier, son rôle et son prix indicatif.</p>
        </header>
        <div class="galerie-specimens__grid" id="galerieSpecimensGrid"></div>
      </div>
    </section>

    <section class="galerie-carnet">
      <div class="container">
        <header class="galerie-section-head">
          <span class="galerie-eyebrow">Carnet d'atelier</span>
          <h2 class="galerie-section-title">Vue sur l'<em>établi</em>.</h2>
          <p class="galerie-section-lead">Dernières interventions anonymisées. Pour donner une idée de ce qui se passe en ce moment dans la maison.</p>
        </header>
        <div class="galerie-carnet__list" id="galerieCarnetList"></div>
      </div>
    </section>
  `;
  home.appendChild(wrap);
  buildSpecimensGrid();
  buildCarnetList();
}

function buildSpecimensGrid() {
  const grid = gq("#galerieSpecimensGrid"); if (!grid) return;
  grid.innerHTML = "";
  SPECIMENS.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "galerie-specimen";
    card.dataset.specimen = i;
    card.dataset.slot = s.slot;
    card.innerHTML = `
      <div class="galerie-specimen__visual">
        <div class="galerie-specimen__empty">
          <div class="galerie-specimen__plinth" aria-hidden="true">
            <span class="galerie-specimen__plinth-line"></span>
            <span class="galerie-specimen__plinth-mark"></span>
            <span class="galerie-specimen__plinth-line"></span>
          </div>
          <div class="galerie-specimen__empty-text">Pas encore présenté</div>
          <div class="galerie-specimen__empty-sub">Spécimen en attente d'exposition</div>
        </div>
        <div class="galerie-specimen__corners"></div>
      </div>
      <div class="galerie-specimen__body">
        <div class="galerie-specimen__cat">${s.cat}</div>
        <div class="galerie-specimen__name">—</div>
        <div class="galerie-specimen__meta">Modèle en attente de mise en ligne</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function buildCarnetList() {
  const list = gq("#galerieCarnetList"); if (!list) return;
  list.innerHTML = "";
  if (CARNET_ENTRIES.length === 0) {
    const empty = document.createElement("div");
    empty.className = "galerie-carnet__empty";
    empty.innerHTML = `
      <div class="galerie-carnet__empty-mark"></div>
      <div class="galerie-carnet__empty-text">Pas encore d'entrée publiée</div>
      <div class="galerie-carnet__empty-sub">Le carnet sera ouvert au public dès que les premiers passages à l'atelier seront consignés.</div>
    `;
    list.appendChild(empty);
    return;
  }
  CARNET_ENTRIES.forEach(c => {
    const entry = document.createElement("div");
    entry.className = "galerie-carnet__entry";
    entry.innerHTML = `
      <div class="galerie-carnet__date">${c.date}</div>
      <div class="galerie-carnet__body">${c.body}</div>
      <div class="galerie-carnet__tag">${c.tag}</div>
    `;
    list.appendChild(entry);
  });
}

const HERO_REQUIRED_SLOTS = ["case", "motherboard", "cpu", "cooling", "gpu", "ram", "storage", "psu"];

function injectHeroFloats() {
  const heroRight = gq('.view[data-view="home"] .hero__right');
  if (!heroRight || gq("#galerieHeroStage")) return;
  const wrap = document.createElement("div");
  wrap.id = "galerieHeroStage";
  wrap.className = "galerie-hero-stage";
  wrap.innerHTML = `
    <div class="galerie-hero-stage__empty">
      <div class="galerie-hero-stage__frame" aria-hidden="true">
        <span class="galerie-hero-stage__corner galerie-hero-stage__corner--tl"></span>
        <span class="galerie-hero-stage__corner galerie-hero-stage__corner--tr"></span>
        <span class="galerie-hero-stage__corner galerie-hero-stage__corner--bl"></span>
        <span class="galerie-hero-stage__corner galerie-hero-stage__corner--br"></span>
      </div>
      <div class="galerie-hero-stage__center">
        <div class="galerie-hero-stage__plinth">
          <span class="galerie-hero-stage__plinth-line"></span>
          <span class="galerie-hero-stage__plinth-mark"></span>
          <span class="galerie-hero-stage__plinth-line"></span>
        </div>
        <div class="galerie-hero-stage__title">Pas présentable</div>
        <div class="galerie-hero-stage__sub" id="galerieHeroStageSub">L'exposition s'ouvrira dès que la galerie sera complète.</div>
      </div>
    </div>
  `;
  heroRight.appendChild(wrap);
  upgradeHeroStage();
}

async function upgradeHeroStage() {
  const wrap = gq("#galerieHeroStage");
  if (!wrap) return;
  try {
    const r = await fetch("/api/aurora?action=list", { cache: "no-store" });
    if (!r.ok) return;
    const data = await r.json();
    if (!data || !Array.isArray(data.files)) return;
    const haystack = data.files.map(f => f.name.toLowerCase()).join("|");
    const missing = HERO_REQUIRED_SLOTS.filter(slot => !haystack.includes(slot));
    const sub = gq("#galerieHeroStageSub");
    if (missing.length === 0) {
      wrap.classList.add("is-ready");
    } else if (sub && data.count > 0) {
      sub.textContent = `${data.count} pièce${data.count > 1 ? "s" : ""} déposée${data.count > 1 ? "s" : ""} · il manque ${missing.length} composant${missing.length > 1 ? "s" : ""}.`;
    }
  } catch {}
}

function injectCompareView() {
  if (gq('.view[data-view="compare"]')) return;
  const main = gq("main.main") || gq("main");
  if (!main) return;
  const section = document.createElement("section");
  section.className = "view"; section.dataset.view = "compare";
  section.innerHTML = `
    <div class="container section">
      <div class="section__head reveal">
        <h2 class="section__title">Étudier <em>A vs B</em>.</h2>
        <p class="section__subtitle">Comparez deux configurations préréglées côte à côte : prix, performances, équilibre.</p>
      </div>
      <div class="panel reveal">
        <div class="galerie-compare__actions">
          <button class="btn btn--ghost btn--tiny" id="galerieCompareLoadA">Charger configuration A (compétitive)</button>
          <button class="btn btn--ghost btn--tiny" id="galerieCompareLoadB">Charger configuration B (studio)</button>
          <button class="btn btn--ghost btn--tiny" id="galerieCompareReset">Réinitialiser</button>
        </div>
        <div class="galerie-compare__grid" id="galerieCompareGrid">
          <div class="galerie-compare__col" id="galerieCompareColA">
            <div class="galerie-compare__head"><div class="galerie-compare__name">Pièce A</div><span class="galerie-compare__badge">A</span></div>
            <div class="galerie-compare__empty">Cliquez "Charger A" pour comparer.</div>
          </div>
          <div class="galerie-compare__vs">VS</div>
          <div class="galerie-compare__col" id="galerieCompareColB">
            <div class="galerie-compare__head"><div class="galerie-compare__name">Pièce B</div><span class="galerie-compare__badge">B</span></div>
            <div class="galerie-compare__empty">Cliquez "Charger B" pour comparer.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  main.appendChild(section);
  section.querySelectorAll(".reveal").forEach(r => r.classList.add("is-in"));
  const nav = gq("#navLinks");
  if (nav && !gq('[data-nav="compare"]')) {
    const ref = nav.querySelector('[data-nav="custom"]');
    const a = document.createElement("a");
    a.href = "#comparer"; a.dataset.nav = "compare"; a.className = "nav__link"; a.textContent = "Comparer";
    a.addEventListener("click", e => {
      e.preventDefault();
      switchToView("compare");
    });
    if (ref) ref.after(a); else nav.appendChild(a);
  }
  bindCompare();
}

function switchToView(name) {
  gqq(".view").forEach(v => v.classList.toggle("is-active", v.dataset.view === name));
  gqq(".nav__link").forEach(l => l.classList.toggle("is-active", l.dataset.nav === name));
  const fresh = gq(`[data-view="${name}"]`);
  fresh?.querySelectorAll(".reveal").forEach(r => r.classList.add("is-in"));
  window.scrollTo({ top: 0, behavior: "smooth" });
  const sweep = gq("#galerieSpotlight");
  if (sweep) { sweep.classList.remove("is-flash"); void sweep.offsetWidth; sweep.classList.add("is-flash"); }
}

const COMPARE_PRESETS = {
  A: { name: "Tour Compétitive", lines: [["CPU", "Ryzen 5 7600"], ["GPU", "RTX 4060 8 GB"], ["RAM", "32 GB DDR5-6000"], ["Stockage", "1 TB NVMe Gen4"], ["PSU", "850 W Gold"], ["Boîtier", "Lian Li O11D Mini"]], total: "1 234 €" },
  B: { name: "Tour Studio",      lines: [["CPU", "Ryzen 9 7900X"], ["GPU", "RTX 4080 Super 16 GB"], ["RAM", "64 GB DDR5-6000"], ["Stockage", "2 TB NVMe Gen4"], ["PSU", "1000 W Gold"], ["Boîtier", "Corsair 5000D"]], total: "2 614 €" }
};
function bindCompare() {
  const state = { A: null, B: null };
  function render() {
    ["A", "B"].forEach(k => {
      const col = gq("#galerieCompareCol" + k);
      const c = state[k];
      if (!c) {
        col.innerHTML = `<div class="galerie-compare__head"><div class="galerie-compare__name">Pièce ${k}</div><span class="galerie-compare__badge">${k}</span></div><div class="galerie-compare__empty">Cliquez "Charger ${k}" pour comparer.</div>`;
        return;
      }
      const linesHTML = c.lines.map(([l, v]) => `<div class="galerie-compare__line"><span>${l}</span><span>${v}</span></div>`).join("");
      col.innerHTML = `<div class="galerie-compare__head"><div class="galerie-compare__name">${c.name}</div><span class="galerie-compare__badge">${k}</span></div><div class="galerie-compare__lines">${linesHTML}</div><div class="galerie-compare__total">${c.total}</div>`;
    });
  }
  gq("#galerieCompareLoadA")?.addEventListener("click", () => { state.A = COMPARE_PRESETS.A; render(); });
  gq("#galerieCompareLoadB")?.addEventListener("click", () => { state.B = COMPARE_PRESETS.B; render(); });
  gq("#galerieCompareReset")?.addEventListener("click", () => { state.A = null; state.B = null; render(); });
}

const CAT_LABELS = {
  cpu: "Processeur",
  mobo: "Carte mère",
  ram: "Mémoire vive",
  gpu: "Carte graphique",
  storage: "Stockage",
  psu: "Alimentation",
  case: "Boîtier",
  watercooling: "Refroidissement"
};

const CAT_FIELDS = {
  cpu: [
    { k: "brand", label: "Marque", required: true, placeholder: "AMD / Intel" },
    { k: "name", label: "Modèle", required: true, placeholder: "Ryzen 7 9700X" },
    { k: "socket", label: "Socket", type: "select", options: ["AM5", "AM4", "1700", "1851"], required: true },
    { k: "generation", label: "Génération", type: "number", placeholder: "9000" },
    { k: "tdp", label: "TDP (W)", type: "number", placeholder: "65" },
    { k: "rank", label: "Rang (1-10)", type: "number", step: "0.1" },
    { k: "score", label: "Score (1-10)", type: "number", step: "0.1" },
    { k: "price", label: "Prix (€)", type: "number", step: "0.01", required: true }
  ],
  mobo: [
    { k: "brand", label: "Marque", required: true, placeholder: "ASUS / MSI / Gigabyte" },
    { k: "name", label: "Modèle", required: true, placeholder: "B650 Aorus Elite AX" },
    { k: "socket", label: "Socket", type: "select", options: ["AM5", "AM4", "1700", "1851"], required: true },
    { k: "ramType", label: "Type RAM", type: "select", options: ["DDR5", "DDR4"], required: true },
    { k: "generation", label: "Génération chipset", type: "number", placeholder: "650" },
    { k: "tier", label: "Tier (1-5)", type: "number" },
    { k: "score", label: "Score (1-10)", type: "number", step: "0.1" },
    { k: "price", label: "Prix (€)", type: "number", step: "0.01", required: true }
  ],
  ram: [
    { k: "brand", label: "Marque", required: true, placeholder: "Corsair / G.Skill" },
    { k: "name", label: "Modèle", required: true, placeholder: "Vengeance 32 Go DDR5-6000" },
    { k: "type", label: "Type", type: "select", options: ["DDR5", "DDR4"], required: true },
    { k: "gb", label: "Capacité (Go)", type: "number", required: true },
    { k: "generation", label: "Fréquence (MHz)", type: "number", placeholder: "6000" },
    { k: "score", label: "Score (1-10)", type: "number", step: "0.1" },
    { k: "price", label: "Prix (€)", type: "number", step: "0.01", required: true }
  ],
  gpu: [
    { k: "brand", label: "Marque", required: true, placeholder: "NVIDIA / AMD" },
    { k: "name", label: "Modèle", required: true, placeholder: "GeForce RTX 4070 Super" },
    { k: "generation", label: "Génération", type: "number", placeholder: "4000" },
    { k: "vram", label: "VRAM (Go)", type: "number" },
    { k: "tdp", label: "TDP (W)", type: "number" },
    { k: "length", label: "Longueur (mm)", type: "number" },
    { k: "rank", label: "Rang (1-10)", type: "number", step: "0.1" },
    { k: "score", label: "Score (1-10)", type: "number", step: "0.1" },
    { k: "price", label: "Prix (€)", type: "number", step: "0.01", required: true }
  ],
  storage: [
    { k: "brand", label: "Marque", required: true, placeholder: "WD / Samsung" },
    { k: "name", label: "Modèle", required: true, placeholder: "SN850X 2 To" },
    { k: "generation", label: "PCIe Gen", type: "number", placeholder: "4" },
    { k: "tb", label: "Capacité (To)", type: "number", step: "0.1", required: true },
    { k: "score", label: "Score (1-10)", type: "number", step: "0.1" },
    { k: "price", label: "Prix (€)", type: "number", step: "0.01", required: true }
  ],
  psu: [
    { k: "brand", label: "Marque", required: true, placeholder: "Corsair / Seasonic" },
    { k: "name", label: "Modèle", required: true, placeholder: "RM850e Gold" },
    { k: "watts", label: "Watts", type: "number", required: true },
    { k: "generation", label: "Watts (génération)", type: "number" },
    { k: "score", label: "Score (1-10)", type: "number", step: "0.1" },
    { k: "price", label: "Prix (€)", type: "number", step: "0.01", required: true }
  ],
  case: [
    { k: "brand", label: "Marque", required: true, placeholder: "Lian Li / NZXT" },
    { k: "name", label: "Modèle", required: true, placeholder: "O11 Dynamic Mini" },
    { k: "generation", label: "Génération", type: "number" },
    { k: "maxGpu", label: "GPU max (mm)", type: "number", required: true },
    { k: "maxRad", label: "Radiateur max (mm)", type: "number", required: true },
    { k: "score", label: "Score (1-10)", type: "number", step: "0.1" },
    { k: "price", label: "Prix (€)", type: "number", step: "0.01", required: true }
  ],
  watercooling: [
    { k: "brand", label: "Marque", required: true, placeholder: "Noctua / Arctic / EK" },
    { k: "name", label: "Modèle", required: true, placeholder: "Liquid Freezer III 280" },
    { k: "type", label: "Type", type: "select", options: ["air", "aio", "custom", "none"], required: true },
    { k: "radiator", label: "Radiateur (mm)", type: "number", placeholder: "0 si air" },
    { k: "score", label: "Score (1-10)", type: "number", step: "0.1" },
    { k: "price", label: "Prix (€)", type: "number", step: "0.01", required: true }
  ]
};

let CATALOG_STATE = { activeCat: "cpu", extras: {}, glb: { count: 0, generated: 0, manual: 0 }, search: "" };

function injectAdminUpload() {
  const adminPanel = gq('.view[data-view="admin"] .admin-quotes');
  if (!adminPanel || gq("#galerieAdminCatalog")) return;
  const block = document.createElement("div");
  block.id = "galerieAdminCatalog";
  block.className = "galerie-admin-catalog";
  block.innerHTML = `
    <div class="galerie-admin-catalog__head">
      <div>
        <div class="panel__title">Catalogue composants · administration</div>
        <div class="galerie-admin-catalog__sub">
          Ajoute des marques et modèles par catégorie. Le composant est immédiatement utilisable dans le simulateur. Tu peux y attacher un fichier 3D (<code>.glb</code> ou <code>.gltf</code>) — facultatif. Persisté dans <code>assets/catalog-extras.json</code> via l'API GitHub.
        </div>
      </div>
      <div class="galerie-admin-catalog__status" id="galerieAdminCatalogStatus">Prêt</div>
    </div>
    <div class="galerie-admin-catalog__tabs" id="galerieAdminCatalogTabs">
      ${Object.keys(CAT_LABELS).map(k => `<button type="button" class="galerie-admin-catalog__tab" data-cat="${k}">${CAT_LABELS[k]} <span class="galerie-admin-catalog__tab-count" data-cat-count="${k}">—</span></button>`).join("")}
    </div>
    <div class="galerie-admin-catalog__body">
      <div class="galerie-admin-catalog__col galerie-admin-catalog__col--list">
        <div class="galerie-admin-catalog__list-head">
          <input type="search" class="galerie-admin-catalog__search" id="galerieAdminCatalogSearch" placeholder="Filtrer marque ou modèle…">
          <span class="galerie-admin-catalog__list-meta" id="galerieAdminCatalogListMeta">—</span>
        </div>
        <div class="galerie-admin-catalog__list" id="galerieAdminCatalogList"></div>
      </div>
      <div class="galerie-admin-catalog__col galerie-admin-catalog__col--form">
        <div class="galerie-admin-catalog__form-head">
          <span class="galerie-admin-catalog__form-title" id="galerieAdminCatalogFormTitle">Ajouter</span>
        </div>
        <form class="galerie-admin-catalog__form" id="galerieAdminCatalogForm"></form>
      </div>
    </div>
    <div class="galerie-admin-catalog__glb">
      <div class="galerie-admin-catalog__glb-head">
        <span class="galerie-admin-catalog__glb-title">Inventaire 3D (.glb)</span>
        <span class="galerie-admin-catalog__glb-count" id="galerieAdminGlbCount">—</span>
      </div>
      <div class="galerie-admin-catalog__glb-list" id="galerieAdminGlbList"></div>
    </div>
    <div class="galerie-admin-catalog__proposals">
      <div class="galerie-admin-catalog__proposals-head">
        <span class="galerie-admin-catalog__proposals-title">Propositions clients · références hors catalogue trouvées dans les devis</span>
        <span class="galerie-admin-catalog__proposals-count" id="galerieAdminPropsCount">—</span>
      </div>
      <div class="galerie-admin-catalog__proposals-list" id="galerieAdminPropsList"></div>
    </div>
  `;
  adminPanel.parentElement.appendChild(block);
  bindAdminCatalog();
  setActiveCategory("cpu");
  refreshAdminCatalog();
  refreshGlbInventory();
  refreshClientProposals();
  window.addEventListener("ae-admin-quotes", () => refreshClientProposals());
  window.addEventListener("ae-admin-state", () => refreshClientProposals());
}

function refreshClientProposals() {
  const list = gq("#galerieAdminPropsList");
  const count = gq("#galerieAdminPropsCount");
  if (!list || !count) return;
  const quotes = Array.isArray(window.AE_adminQuotes) ? window.AE_adminQuotes : [];
  const proposals = [];
  quotes.forEach(q => {
    const refs = Array.isArray(q?.externalRefs) ? q.externalRefs : [];
    refs.forEach(r => {
      proposals.push({
        quoteCode: q.code,
        requesterName: q.requesterName || "",
        requesterEmail: q.requesterEmail || "",
        createdAt: q.createdAt,
        category: r.category,
        categoryLabel: r.categoryLabel,
        query: r.query,
        note: r.note || "",
        resolved: r.resolved || null,
        needsCompatConfirm: r.needsCompatConfirm
      });
    });
  });
  const knownIds = new Set();
  Object.entries(CATALOG_STATE.extras || {}).forEach(([cat, items]) => {
    (Array.isArray(items) ? items : []).forEach(it => {
      if (it.fromProposal) knownIds.add(`${cat}::${(it.proposalQuery || "").toLowerCase().trim()}`);
    });
  });
  const open = proposals.filter(p => !knownIds.has(`${p.category}::${p.query.toLowerCase().trim()}`));
  count.textContent = open.length === 0
    ? (proposals.length ? `${proposals.length} déjà promu${proposals.length > 1 ? "s" : ""}` : "aucune en attente")
    : `${open.length} en attente · ${proposals.length} total`;
  if (open.length === 0) {
    list.innerHTML = `<div class="galerie-admin-catalog__proposals-empty">${quotes.length === 0 ? "Aucun devis chargé pour l'instant — passe en mode admin pour voir les références proposées par les clients dans leurs devis." : "Aucune proposition en attente. Les références hors catalogue typées par les clients dans le simulateur apparaîtront ici."}</div>`;
    return;
  }
  const grouped = new Map();
  open.forEach(p => {
    const key = `${p.category}::${p.query.toLowerCase().trim()}`;
    const ex = grouped.get(key);
    if (ex) {
      ex.occurrences += 1;
      if (!ex.quotes.includes(p.quoteCode)) ex.quotes.push(p.quoteCode);
      if (!ex.notes.includes(p.note) && p.note) ex.notes.push(p.note);
      if (!ex.requesters.find(r => r.email === p.requesterEmail) && p.requesterEmail) {
        ex.requesters.push({ name: p.requesterName, email: p.requesterEmail });
      }
      if (p.resolved && !ex.resolved) ex.resolved = p.resolved;
    } else {
      grouped.set(key, {
        ...p,
        occurrences: 1,
        quotes: [p.quoteCode],
        notes: p.note ? [p.note] : [],
        requesters: p.requesterEmail ? [{ name: p.requesterName, email: p.requesterEmail }] : []
      });
    }
  });
  const dedup = Array.from(grouped.values()).sort((a, b) => b.occurrences - a.occurrences);
  list.innerHTML = dedup.map((p, i) => {
    const compatVerdict = p.resolved ? evaluateCompatibility(p.category, p.resolved) : null;
    const specsRow = p.resolved ? renderResolvedSpecs(p.category, p.resolved) : "";
    const notesRow = p.notes.length ? `
      <div class="galerie-admin-catalog__prop-notes">
        <span class="galerie-admin-catalog__prop-notes-label">Note client</span>
        ${p.notes.map(n => `<span class="galerie-admin-catalog__prop-note">${escapeHTML(n)}</span>`).join("")}
      </div>` : "";
    const verdictRow = compatVerdict ? `
      <div class="galerie-admin-catalog__prop-verdict galerie-admin-catalog__prop-verdict--${compatVerdict.level}">
        <span class="galerie-admin-catalog__prop-verdict-icon">${compatVerdict.icon}</span>
        <span>${escapeHTML(compatVerdict.text)}</span>
      </div>` : "";
    const promoteLabel = p.resolved ? "Oui, je confirme · ajouter" : "Pré-remplir et compléter";
    return `
    <div class="galerie-admin-catalog__prop" data-prop-idx="${i}">
      <div class="galerie-admin-catalog__prop-main">
        <div class="galerie-admin-catalog__prop-head">
          <span class="galerie-admin-catalog__prop-cat">${escapeHTML(p.categoryLabel)}</span>
          <span class="galerie-admin-catalog__prop-occ">${p.occurrences} mention${p.occurrences > 1 ? "s" : ""}</span>
          ${p.resolved ? `<span class="galerie-admin-catalog__prop-tag">IA · specs récupérées</span>` : `<span class="galerie-admin-catalog__prop-tag galerie-admin-catalog__prop-tag--manual">Specs à compléter</span>`}
        </div>
        <div class="galerie-admin-catalog__prop-query">${escapeHTML(p.query)}</div>
        ${specsRow}
        ${notesRow}
        ${verdictRow}
        <div class="galerie-admin-catalog__prop-meta">Devis : ${p.quotes.map(c => `<code>${escapeHTML(c)}</code>`).join(" · ")}</div>
      </div>
      <div class="galerie-admin-catalog__prop-actions">
        <button type="button" class="btn btn--tiny galerie-admin-catalog__prop-promote">${escapeHTML(promoteLabel)}</button>
      </div>
    </div>`;
  }).join("");
  list.querySelectorAll(".galerie-admin-catalog__prop-promote").forEach(btn => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest("[data-prop-idx]");
      if (!wrap) return;
      const idx = Number(wrap.dataset.propIdx);
      const data = dedup[idx];
      if (!data) return;
      promoteProposal(data);
    });
  });
}

function renderResolvedSpecs(cat, r) {
  const parts = [];
  if (cat === "cpu" && r.socket) parts.push(["Socket", r.socket]);
  if (cat === "cpu" && r.tdp) parts.push(["TDP", `${r.tdp} W`]);
  if (cat === "mobo" && r.socket) parts.push(["Socket", r.socket]);
  if (cat === "mobo" && r.ramType) parts.push(["RAM", r.ramType]);
  if (cat === "ram" && r.type) parts.push(["Type", r.type]);
  if (cat === "ram" && r.gb) parts.push(["Capacité", `${r.gb} Go`]);
  if (cat === "gpu" && r.vram) parts.push(["VRAM", `${r.vram} Go`]);
  if (cat === "gpu" && r.length) parts.push(["Longueur", `${r.length} mm`]);
  if (cat === "gpu" && r.tdp) parts.push(["TDP", `${r.tdp} W`]);
  if (cat === "storage" && r.tb) parts.push(["Capacité", `${r.tb} To`]);
  if (cat === "psu" && r.watts) parts.push(["Puissance", `${r.watts} W`]);
  if (cat === "case" && r.maxGpu) parts.push(["GPU max", `${r.maxGpu} mm`]);
  if (cat === "case" && r.maxRad) parts.push(["Rad max", `${r.maxRad} mm`]);
  if (cat === "watercooling" && r.type) parts.push(["Type", r.type]);
  if (cat === "watercooling" && r.radiator) parts.push(["Radiateur", `${r.radiator} mm`]);
  if (typeof r.price === "number") parts.push(["Prix", formatEuro(r.price)]);
  if (!parts.length) return "";
  return `<div class="galerie-admin-catalog__prop-specs">${parts.map(([l, v]) => `<span><b>${escapeHTML(l)}</b> · ${escapeHTML(String(v))}</span>`).join("")}</div>`;
}

function evaluateCompatibility(cat, resolved) {
  const cpus = window.AE_CATALOG?.cpu || [];
  const mobos = window.AE_CATALOG?.mobo || [];
  const cases = window.AE_CATALOG?.case || [];
  if (cat === "cpu" && resolved.socket) {
    const matchingMobos = mobos.filter(m => m.socket === resolved.socket).length;
    if (!matchingMobos) return { level: "warn", icon: "△", text: `Aucune carte mère ${resolved.socket} au catalogue — ajouter une mobo avant validation.` };
    return { level: "ok", icon: "✓", text: `Compatible avec ${matchingMobos} carte${matchingMobos > 1 ? "s" : ""} mère ${resolved.socket} du catalogue.` };
  }
  if (cat === "mobo" && resolved.socket) {
    const matchingCpus = cpus.filter(c => c.socket === resolved.socket).length;
    if (!matchingCpus) return { level: "warn", icon: "△", text: `Aucun CPU ${resolved.socket} au catalogue — ajouter un CPU avant validation.` };
    return { level: "ok", icon: "✓", text: `Compatible avec ${matchingCpus} CPU ${resolved.socket} du catalogue.` };
  }
  if (cat === "gpu" && resolved.length) {
    const fittingCases = cases.filter(c => (c.maxGpu || 0) >= resolved.length).length;
    if (!fittingCases) return { level: "bad", icon: "✕", text: `Trop long (${resolved.length} mm) — aucun boîtier ne peut l'accueillir.` };
    return { level: "ok", icon: "✓", text: `Tient dans ${fittingCases} boîtier${fittingCases > 1 ? "s" : ""} du catalogue.` };
  }
  if (cat === "ram" && resolved.type) {
    const matchingMobos = mobos.filter(m => m.ramType === resolved.type).length;
    if (!matchingMobos) return { level: "warn", icon: "△", text: `Aucune mobo ${resolved.type} au catalogue.` };
    return { level: "ok", icon: "✓", text: `Compatible avec ${matchingMobos} mobo ${resolved.type}.` };
  }
  if (cat === "watercooling" && resolved.radiator) {
    const fitting = cases.filter(c => (c.maxRad || 0) >= resolved.radiator).length;
    if (!fitting) return { level: "bad", icon: "✕", text: `Radiateur trop grand (${resolved.radiator} mm).` };
    return { level: "ok", icon: "✓", text: `Compatible avec ${fitting} boîtier${fitting > 1 ? "s" : ""}.` };
  }
  return { level: "info", icon: "•", text: "Pas de contrainte de compatibilité bloquante détectée." };
}

function promoteProposal(prop) {
  const category = prop.category;
  const query = prop.query;
  setActiveCategory(category);
  const form = gq("#galerieAdminCatalogForm");
  if (!form) return;
  const resolved = prop.resolved || {};
  const parsed = parseQueryGuess(query);
  const setField = (name, value) => {
    const el = form.querySelector(`[name='${name}']`);
    if (el && value != null && value !== "") el.value = String(value);
  };
  setField("brand", resolved.brand || parsed.brand || "");
  setField("name", resolved.name || parsed.name || query);
  CAT_FIELDS[category].forEach(f => {
    if (f.k === "brand" || f.k === "name") return;
    if (resolved[f.k] != null && resolved[f.k] !== "") setField(f.k, resolved[f.k]);
  });
  let proposalMeta = form.querySelector("[name='_proposalQuery']");
  if (!proposalMeta) {
    proposalMeta = document.createElement("input");
    proposalMeta.type = "hidden";
    proposalMeta.name = "_proposalQuery";
    form.appendChild(proposalMeta);
  }
  proposalMeta.value = query;
  let requesterMeta = form.querySelector("[name='_proposalRequesters']");
  if (!requesterMeta) {
    requesterMeta = document.createElement("input");
    requesterMeta.type = "hidden";
    requesterMeta.name = "_proposalRequesters";
    form.appendChild(requesterMeta);
  }
  requesterMeta.value = JSON.stringify(prop.requesters || []);
  let quotesMeta = form.querySelector("[name='_proposalQuotes']");
  if (!quotesMeta) {
    quotesMeta = document.createElement("input");
    quotesMeta.type = "hidden";
    quotesMeta.name = "_proposalQuotes";
    form.appendChild(quotesMeta);
  }
  quotesMeta.value = JSON.stringify(prop.quotes || []);
  const msg = prop.resolved
    ? `Specs récupérées par l'IA — vérifie et clique Enregistrer. Un mail de confirmation sera envoyé aux ${prop.requesters.length || 0} client(s).`
    : `Pré-rempli depuis la proposition — complète les specs manquantes avant d'enregistrer.`;
  setCatalogStatus(msg, "running");
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function parseQueryGuess(query) {
  const q = String(query || "").trim();
  const known = ["AMD", "Intel", "NVIDIA", "Corsair", "G.Skill", "ASUS", "MSI", "Gigabyte", "ASRock", "WD", "Samsung", "Kingston", "Seagate", "Crucial", "Seasonic", "Be Quiet!", "NZXT", "Lian Li", "Fractal", "Cooler Master", "Noctua", "Arctic", "EK", "Thermalright"];
  const lower = q.toLowerCase();
  for (const b of known) {
    if (lower.startsWith(b.toLowerCase() + " ") || lower === b.toLowerCase()) {
      return { brand: b, name: q.slice(b.length).trim() || q };
    }
  }
  const first = q.split(/\s+/)[0] || "";
  return { brand: first, name: q.slice(first.length).trim() || q };
}

function setCatalogStatus(txt, tone) {
  const el = gq("#galerieAdminCatalogStatus");
  if (!el) return;
  el.textContent = txt;
  el.dataset.tone = tone || "";
}

function setActiveCategory(cat) {
  CATALOG_STATE.activeCat = cat;
  gqq(".galerie-admin-catalog__tab").forEach(t => t.classList.toggle("is-active", t.dataset.cat === cat));
  renderCatalogList();
  renderCatalogForm();
}

function bindAdminCatalog() {
  gqq("#galerieAdminCatalogTabs .galerie-admin-catalog__tab").forEach(t => {
    t.addEventListener("click", () => setActiveCategory(t.dataset.cat));
  });
  const search = gq("#galerieAdminCatalogSearch");
  search?.addEventListener("input", () => {
    CATALOG_STATE.search = search.value.toLowerCase();
    renderCatalogList();
  });
}

async function refreshAdminCatalog() {
  try {
    const r = await fetch("/api/aurora?action=catalogList", { cache: "no-store" });
    if (!r.ok) return;
    const data = await r.json();
    CATALOG_STATE.extras = data.extras || {};
    if (window.AE_mergeCatalogExtras) window.AE_mergeCatalogExtras(CATALOG_STATE.extras);
    renderTabCounts();
    renderCatalogList();
  } catch {}
}

function renderTabCounts() {
  Object.keys(CAT_LABELS).forEach(k => {
    const el = gq(`[data-cat-count="${k}"]`);
    if (!el) return;
    const base = Array.isArray(window.AE_CATALOG?.[k]) ? window.AE_CATALOG[k].length : 0;
    el.textContent = String(base);
  });
}

function renderCatalogList() {
  const list = gq("#galerieAdminCatalogList");
  const meta = gq("#galerieAdminCatalogListMeta");
  if (!list || !meta) return;
  const cat = CATALOG_STATE.activeCat;
  const items = Array.isArray(window.AE_CATALOG?.[cat]) ? [...window.AE_CATALOG[cat]] : [];
  const q = CATALOG_STATE.search.trim();
  const extras = new Set((CATALOG_STATE.extras[cat] || []).map(e => e.id));
  const filtered = q
    ? items.filter(it => `${it.brand || ""} ${it.name || ""}`.toLowerCase().includes(q))
    : items;
  meta.textContent = `${filtered.length} / ${items.length} référence${items.length > 1 ? "s" : ""}`;
  if (filtered.length === 0) {
    list.innerHTML = `<div class="galerie-admin-catalog__empty">Aucune référence ne correspond.</div>`;
    return;
  }
  list.innerHTML = filtered.slice(0, 200).map(it => {
    const isExtra = extras.has(it.id);
    const specs = catalogSpecsSummary(cat, it);
    return `
      <div class="galerie-admin-catalog__item${isExtra ? " is-extra" : ""}">
        <div class="galerie-admin-catalog__item-main">
          <div class="galerie-admin-catalog__item-name">${escapeHTML(it.brand)} · ${escapeHTML(it.name)}</div>
          <div class="galerie-admin-catalog__item-specs">${specs}</div>
        </div>
        <div class="galerie-admin-catalog__item-side">
          <span class="galerie-admin-catalog__item-price">${typeof it.price === "number" ? formatEuro(it.price) : "—"}</span>
          ${isExtra ? `<button type="button" class="galerie-admin-catalog__item-remove" data-remove-id="${escapeHTML(it.id)}" data-remove-cat="${cat}" title="Retirer">×</button>` : ""}
        </div>
      </div>`;
  }).join("");
  list.querySelectorAll("[data-remove-id]").forEach(btn => {
    btn.addEventListener("click", () => removeCatalogEntry(btn.dataset.removeCat, btn.dataset.removeId));
  });
}

function catalogSpecsSummary(cat, it) {
  const parts = [];
  if (cat === "cpu" && it.socket) parts.push(it.socket);
  if (cat === "cpu" && it.tdp) parts.push(`${it.tdp} W`);
  if (cat === "mobo" && it.socket) parts.push(it.socket);
  if (cat === "mobo" && it.ramType) parts.push(it.ramType);
  if (cat === "ram" && it.type) parts.push(it.type);
  if (cat === "ram" && it.gb) parts.push(`${it.gb} Go`);
  if (cat === "gpu" && it.vram) parts.push(`${it.vram} Go VRAM`);
  if (cat === "gpu" && it.length) parts.push(`${it.length} mm`);
  if (cat === "storage" && it.tb) parts.push(`${it.tb} To`);
  if (cat === "storage" && it.generation) parts.push(`Gen ${it.generation}`);
  if (cat === "psu" && it.watts) parts.push(`${it.watts} W`);
  if (cat === "case" && it.maxGpu) parts.push(`GPU ≤ ${it.maxGpu} mm`);
  if (cat === "case" && it.maxRad) parts.push(`Rad ≤ ${it.maxRad} mm`);
  if (cat === "watercooling" && it.type) parts.push(it.type);
  if (cat === "watercooling" && it.radiator) parts.push(`${it.radiator} mm`);
  if (typeof it.score === "number") parts.push(`score ${it.score.toFixed(1)}`);
  return parts.length ? escapeHTML(parts.join(" · ")) : "—";
}

function renderCatalogForm() {
  const form = gq("#galerieAdminCatalogForm");
  const title = gq("#galerieAdminCatalogFormTitle");
  if (!form) return;
  const cat = CATALOG_STATE.activeCat;
  if (title) title.textContent = `Ajouter — ${CAT_LABELS[cat]}`;
  const fields = CAT_FIELDS[cat] || [];
  form.innerHTML = fields.map(f => {
    if (f.type === "select") {
      return `
        <label class="galerie-admin-catalog__field">
          <span class="galerie-admin-catalog__field-label">${f.label}${f.required ? " *" : ""}</span>
          <select name="${f.k}" ${f.required ? "required" : ""}>
            <option value="">—</option>
            ${f.options.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
        </label>`;
    }
    return `
      <label class="galerie-admin-catalog__field">
        <span class="galerie-admin-catalog__field-label">${f.label}${f.required ? " *" : ""}</span>
        <input type="${f.type || "text"}" name="${f.k}" ${f.step ? `step="${f.step}"` : ""} ${f.required ? "required" : ""} placeholder="${f.placeholder || ""}">
      </label>`;
  }).join("") + `
    <label class="galerie-admin-catalog__field galerie-admin-catalog__field--file">
      <span class="galerie-admin-catalog__field-label">Modèle 3D (.glb / .gltf) — facultatif</span>
      <input type="file" name="_glb" accept=".glb,.gltf,model/gltf-binary">
    </label>
    <div class="galerie-admin-catalog__form-actions">
      <button type="submit" class="btn btn--tiny">Enregistrer</button>
      <button type="reset" class="btn btn--ghost btn--tiny">Vider</button>
    </div>
  `;
  form.onsubmit = handleCatalogFormSubmit;
}

async function handleCatalogFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const cat = CATALOG_STATE.activeCat;
  const fd = new FormData(form);
  const entry = {};
  CAT_FIELDS[cat].forEach(f => {
    const v = fd.get(f.k);
    if (v == null || v === "") return;
    if (f.type === "number") {
      const n = Number(v);
      if (Number.isFinite(n)) entry[f.k] = n;
    } else {
      entry[f.k] = String(v).trim();
    }
  });
  if (!entry.brand || !entry.name) { setCatalogStatus("Marque et modèle requis", "err"); return; }

  const file = fd.get("_glb");
  let glbPayload = null;
  if (file && file.size > 0) {
    if (!/\.(glb|gltf)$/i.test(file.name)) { setCatalogStatus("Fichier 3D refusé : extension non supportée", "err"); return; }
    if (file.size > 30 * 1024 * 1024) { setCatalogStatus("Fichier 3D refusé : > 30 Mo", "err"); return; }
    setCatalogStatus("Lecture du fichier 3D…", "running");
    try { glbPayload = await readFileBase64(file); }
    catch (e) { setCatalogStatus("Lecture du fichier 3D échouée", "err"); return; }
  }

  const proposalQuery = String(fd.get("_proposalQuery") || "").trim();
  let requesters = [];
  let quoteCodes = [];
  try { requesters = JSON.parse(String(fd.get("_proposalRequesters") || "[]")); } catch {}
  try { quoteCodes = JSON.parse(String(fd.get("_proposalQuotes") || "[]")); } catch {}
  if (proposalQuery) {
    entry.fromProposal = true;
    entry.proposalQuery = proposalQuery;
  }

  setCatalogStatus("Enregistrement…", "running");
  try {
    const body = { action: "catalogAdd", category: cat, entry };
    if (glbPayload) body.glb = { filename: glbPayload.filename, content: glbPayload.base64 };
    const r = await fetch("/api/aurora", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { setCatalogStatus("Erreur : " + (data.error || r.status), "err"); return; }
    if (proposalQuery && Array.isArray(requesters) && requesters.length > 0) {
      setCatalogStatus(`Ajouté · envoi du mail aux ${requesters.length} client(s)…`, "running");
      try {
        await fetch("/api/aurora", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "catalogConfirmEmail",
            category: cat,
            entry: data.entry,
            requesters,
            quoteCodes,
            proposalQuery
          })
        });
      } catch {}
      setCatalogStatus(`Ajouté · mail envoyé`, "ok");
    } else {
      setCatalogStatus(`Ajouté · ${data.entry?.brand || ""} ${data.entry?.name || ""}`, "ok");
    }
    form.reset();
    setTimeout(() => { refreshAdminCatalog(); refreshGlbInventory(); refreshClientProposals(); }, 800);
    if (typeof window.AE_recomputeFromCatalog === "function") {
      try { window.AE_recomputeFromCatalog(); } catch {}
    }
  } catch (e) {
    setCatalogStatus("Réseau : " + e.message, "err");
  }
}

function readFileBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result).split(",")[1];
      resolve({ filename: file.name, base64 });
    };
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.readAsDataURL(file);
  });
}

async function removeCatalogEntry(cat, id) {
  if (!confirm(`Retirer ${id} du catalogue ?`)) return;
  setCatalogStatus("Suppression…", "running");
  try {
    const r = await fetch("/api/aurora", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "catalogRemove", category: cat, id })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { setCatalogStatus("Erreur : " + (data.error || r.status), "err"); return; }
    setCatalogStatus("Supprimé", "ok");
    setTimeout(refreshAdminCatalog, 500);
  } catch (e) { setCatalogStatus("Réseau : " + e.message, "err"); }
}

async function refreshGlbInventory() {
  const list = gq("#galerieAdminGlbList");
  const count = gq("#galerieAdminGlbCount");
  if (!list || !count) return;
  try {
    const r = await fetch("/api/aurora?action=list", { cache: "no-store" });
    if (!r.ok) return;
    const data = await r.json();
    if (!data || !Array.isArray(data.files)) return;
    count.textContent = `${data.count} fichier${data.count > 1 ? "s" : ""} · ${data.generated} généré${data.generated > 1 ? "s" : ""} · ${data.manual} manuel${data.manual > 1 ? "s" : ""}`;
    const recent = data.files.slice(-12).reverse();
    list.innerHTML = recent.length
      ? recent.map(f => `
          <a class="galerie-admin-catalog__glb-item" href="${f.rawUrl}" target="_blank" rel="noopener">
            <span class="galerie-admin-catalog__glb-name">${escapeHTML(f.name)}</span>
            <span class="galerie-admin-catalog__glb-size">${formatBytes(f.size)}</span>
          </a>`).join("")
      : `<div class="galerie-admin-catalog__glb-empty">Aucun fichier 3D déposé.</div>`;
  } catch {}
}

function formatBytes(n) {
  if (!n) return "—";
  if (n < 1024) return n + " o";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " ko";
  return (n / 1024 / 1024).toFixed(2) + " Mo";
}

function formatEuro(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);
}

function escapeHTML(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}

function setupViewTransitions() {
  document.body.classList.add("galerie-stage");
  let pending = false;
  const sweep = document.createElement("div");
  sweep.className = "galerie-spotlight"; sweep.id = "galerieSpotlight";
  document.body.appendChild(sweep);

  document.addEventListener("click", e => {
    try {
      const t = e.target.closest("[data-nav]");
      if (!t || pending) return;
      pending = true;
      sweep.classList.remove("is-flash"); void sweep.offsetWidth; sweep.classList.add("is-flash");
      setTimeout(() => { pending = false; }, 320);
    } catch {}
  }, true);

  const observer = new MutationObserver(muts => {
    muts.forEach(m => {
      try {
        if (m.attributeName !== "class") return;
        const el = m.target;
        if (!el || !el.classList || !el.classList.contains("view")) return;
        const isActive = el.classList.contains("is-active");
        if (isActive && !el.dataset._entered) {
          el.dataset._entered = "1";
          requestAnimationFrame(() => {
            el.classList.add("galerie-view-entering");
            setTimeout(() => el.classList.remove("galerie-view-entering"), 600);
            try {
              el.querySelectorAll(".galerie-fadein:not(.galerie-fadein--in)").forEach((n, i) => {
                setTimeout(() => n.classList.add("galerie-fadein--in"), i * 40);
              });
            } catch {}
          });
        } else if (!isActive && el.dataset._entered) {
          delete el.dataset._entered;
        }
      } catch {}
    });
  });
  gqq(".view").forEach(v => observer.observe(v, { attributes: true, attributeFilter: ["class"] }));
}

async function initThreeFeatures() {
  return;
}

const Concierge = (() => {
  let open = false;
  const history = [];

  function build() {
    if (gq("#galerieConcierge")) return;
    const c = document.createElement("div");
    c.className = "galerie-concierge"; c.id = "galerieConcierge";
    c.innerHTML = `
      <button class="galerie-concierge__toggle" id="galerieConciergeOpen" aria-label="Ouvrir le concierge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4.255-.949L3 20l1.395-3.72A8.97 8.97 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"/></svg>
      </button>
      <div class="galerie-concierge__panel" role="dialog" aria-label="Concierge">
        <div class="galerie-concierge__head">
          <div class="galerie-concierge__avatar"></div>
          <div>
            <div class="galerie-concierge__name">Concierge</div>
            <div class="galerie-concierge__role" id="galerieConciergeRole">En ligne</div>
          </div>
          <button class="galerie-concierge__close" id="galerieConciergeClose" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <div class="galerie-concierge__body" id="galerieConciergeBody"></div>
        <div class="galerie-concierge__suggestions" id="galerieConciergeSuggestions"></div>
        <div class="galerie-concierge__input-bar">
          <input class="galerie-concierge__input" id="galerieConciergeInput" type="text" placeholder="Poser une question…">
          <button class="galerie-concierge__send" id="galerieConciergeSend" aria-label="Envoyer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12l14-7-3 14-4-5z"/></svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(c);
    gq("#galerieConciergeOpen").addEventListener("click", toggle);
    gq("#galerieConciergeClose").addEventListener("click", close);
    gq("#galerieConciergeSend").addEventListener("click", send);
    gq("#galerieConciergeInput").addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  }
  function toggle() { open = !open; gq("#galerieConcierge").classList.toggle("is-open", open); if (open && history.length === 0) intro(); }
  function close() { open = false; gq("#galerieConcierge").classList.remove("is-open"); }
  function intro() {
    const body = gq("#galerieConciergeBody"); body.innerHTML = ""; history.length = 0;
    addMsg("bot", "Bonjour. Je suis le concierge de l'Atelier Électronique. Je peux vous orienter, donner des fourchettes de prix ou pré-remplir un devis. Que puis-je faire ?");
    renderSuggestions();
  }
  function addMsg(side, text) {
    const body = gq("#galerieConciergeBody");
    const b = document.createElement("div"); b.className = `galerie-bubble galerie-bubble--${side}`; b.textContent = text;
    body.appendChild(b); body.scrollTop = body.scrollHeight;
  }
  function showTyping() {
    const body = gq("#galerieConciergeBody");
    const t = document.createElement("div"); t.className = "galerie-bubble galerie-bubble--bot galerie-bubble--typing"; t.id = "galerieTyping";
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t); body.scrollTop = body.scrollHeight;
  }
  function hideTyping() { gq("#galerieTyping")?.remove(); }
  function renderSuggestions() {
    const wrap = gq("#galerieConciergeSuggestions"); wrap.innerHTML = "";
    CONCIERGE_SUGGESTIONS.forEach(s => {
      const b = document.createElement("button"); b.className = "galerie-concierge__suggestion"; b.textContent = s;
      b.addEventListener("click", () => { gq("#galerieConciergeInput").value = s; send(); });
      wrap.appendChild(b);
    });
  }
  const ACTION_RX = /\[\[OPEN:([a-z-]+)\]\]/i;
  function parseAction(reply) { const m = reply.match(ACTION_RX); if (!m) return { text: reply.trim(), action: null }; return { text: reply.replace(ACTION_RX, "").trim(), action: { type: "open", view: m[1] } }; }
  function executeAction(action) {
    close();
    if (action.type === "open") {
      const link = document.querySelector(`[data-nav="${action.view}"]`);
      if (link && typeof link.click === "function") link.click();
      else location.hash = "#" + action.view;
    }
  }
  function renderAction(action) {
    const body = gq("#galerieConciergeBody");
    const labels = { home: "Accueil", pc: "Réparation PC", mobile: "Réparation Mobile", custom: "PC sur mesure", compare: "Comparer A/B", contact: "Contact", legal: "Mentions légales" };
    const btn = document.createElement("button"); btn.className = "galerie-concierge__action"; btn.textContent = `Ouvrir : ${labels[action.view] || action.view}`;
    btn.addEventListener("click", () => { executeAction(action); btn.disabled = true; btn.style.opacity = ".55"; btn.textContent = "✓ " + btn.textContent; });
    body.appendChild(btn); body.scrollTop = body.scrollHeight;
  }
  async function send() {
    const input = gq("#galerieConciergeInput"); const text = input.value.trim();
    if (!text) return;
    input.value = ""; gq("#galerieConciergeSuggestions").innerHTML = "";
    addMsg("user", text); history.push({ role: "user", content: text }); showTyping();
    try {
      const r = await fetch("/api/aurora", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "chat", messages: [{ role: "system", content: CONCIERGE_SYSTEM }, ...history], temperature: 0.6 })});
      const data = await r.json(); hideTyping();
      if (!r.ok || !data.reply) { addMsg("bot", "⚠ " + (data.error || "Erreur de connexion. Le tunnel Aurora est peut-être inactif.")); history.pop(); return; }
      history.push({ role: "assistant", content: data.reply });
      const parsed = parseAction(data.reply);
      if (parsed.text) addMsg("bot", parsed.text);
      if (parsed.action) renderAction(parsed.action);
    } catch (e) { hideTyping(); addMsg("bot", "⚠ Erreur réseau : " + e.message); history.pop(); }
  }
  return { build, toggle, close };
})();

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", e => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.key === "?" || (e.shiftKey && e.key === "/")) {
      e.preventDefault();
      try { Concierge.toggle(); } catch {}
    } else if (e.key === "Escape") {
      try { if (gq("#galerieConcierge.is-open")) Concierge.close(); } catch {}
    }
  });
}

function setupParallax() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 720) return;
  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const items = gqq(".view.is-active .galerie-numeral");
      const center = window.innerHeight / 2;
      items.forEach(el => {
        const r = el.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - center) / window.innerHeight;
        el.style.transform = `translate3d(0, ${offset * -22}px, 0)`;
      });
    });
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupRevealOnScroll() {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("galerie-fadein--in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
  const targets = [
    ".galerie-manifesto__title",
    ".galerie-manifesto__lead",
    ".galerie-editorial__copy",
    ".galerie-specimen",
    ".galerie-carnet__entry",
    ".galerie-compare__col"
  ];
  gqq(targets.join(",")).forEach((el, i) => {
    el.classList.add("galerie-fadein");
    el.style.transitionDelay = (i % 6) * 50 + "ms";
    io.observe(el);
  });
  setTimeout(() => {
    gqq(".view.is-active .galerie-fadein:not(.galerie-fadein--in)").forEach(el => el.classList.add("galerie-fadein--in"));
  }, 1500);
}

function init() {
  clearLegacyTheme();
  buildTicker();
  injectNumerals();
  buildCursor();
  buildCookieBanner();
  injectHomeExtras();
  injectHeroFloats();
  injectCompareView();
  injectAdminUpload();
  setupViewTransitions();
  Concierge.build();
  initThreeFeatures();
  setupKeyboardShortcuts();
  setupParallax();
  setupRevealOnScroll();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
})();
