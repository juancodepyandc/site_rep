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
  try {
    if (localStorage.getItem("galerie_seen_v1")) return;
    localStorage.removeItem("ae_theme_v1");
    localStorage.setItem("galerie_seen_v1", "1");
  } catch {}
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

function injectAdminUpload() {
  const adminPanel = gq('.view[data-view="admin"] .admin-quotes');
  if (!adminPanel || gq("#galerieAdminUpload")) return;
  const block = document.createElement("div");
  block.id = "galerieAdminUpload";
  block.className = "galerie-admin-upload";
  block.innerHTML = `
    <div class="galerie-admin-upload__head">
      <div>
        <div class="panel__title">Dépôt manuel · Galerie 3D</div>
        <div class="galerie-admin-upload__sub">Glissez un fichier <code>.glb</code> ou <code>.gltf</code> ici, ou utilisez le bouton. Le fichier est commité dans <code>assets/aurora/manual/</code> du repo via l'API GitHub.</div>
      </div>
      <div class="galerie-admin-upload__status" id="galerieAdminUploadStatus">Prêt</div>
    </div>
    <div class="galerie-admin-upload__drop" id="galerieAdminUploadDrop">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
      <p>Glisser un fichier ici, ou</p>
      <label class="btn btn--ghost btn--tiny" for="galerieAdminUploadInput">Choisir un .glb…</label>
      <input type="file" id="galerieAdminUploadInput" accept=".glb,.gltf,model/gltf-binary" hidden>
    </div>
    <div class="galerie-admin-upload__hint">
      <strong>Code d'accès admin :</strong> tapez <code>admin:&lt;votre clé&gt;</code> dans le champ "code devis" du custom builder pour activer cette section.
      Le bouton apparaît uniquement quand <code>isAdmin = true</code>.
    </div>
    <div class="galerie-admin-upload__inventory" id="galerieAdminInventory" hidden>
      <div class="galerie-admin-upload__inventory-head">
        <span class="galerie-admin-upload__inventory-title">Inventaire Galerie</span>
        <span class="galerie-admin-upload__inventory-count" id="galerieAdminInventoryCount">—</span>
      </div>
      <div class="galerie-admin-upload__inventory-list" id="galerieAdminInventoryList"></div>
    </div>
  `;
  adminPanel.parentElement.appendChild(block);
  bindAdminUpload();
  refreshInventory();
}

async function refreshInventory() {
  const wrap = gq("#galerieAdminInventory");
  const list = gq("#galerieAdminInventoryList");
  const count = gq("#galerieAdminInventoryCount");
  if (!wrap || !list || !count) return;
  try {
    const r = await fetch("/api/aurora?action=list", { cache: "no-store" });
    if (!r.ok) return;
    const data = await r.json();
    if (!data || !Array.isArray(data.files)) return;
    wrap.hidden = false;
    count.textContent = `${data.count} pièce${data.count > 1 ? "s" : ""} · ${data.generated} générée${data.generated > 1 ? "s" : ""} · ${data.manual} manuelle${data.manual > 1 ? "s" : ""}`;
    const recent = data.files.slice(-12).reverse();
    list.innerHTML = recent.length
      ? recent.map(f => `
          <a class="galerie-admin-upload__inventory-item" href="${f.rawUrl}" target="_blank" rel="noopener">
            <span class="galerie-admin-upload__inventory-name">${f.name}</span>
            <span class="galerie-admin-upload__inventory-size">${formatBytes(f.size)}</span>
          </a>`).join("")
      : `<div class="galerie-admin-upload__inventory-empty">Aucune pièce déposée pour l'instant.</div>`;
  } catch {}
}

function formatBytes(n) {
  if (!n) return "—";
  if (n < 1024) return n + " o";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " ko";
  return (n / 1024 / 1024).toFixed(2) + " Mo";
}

function bindAdminUpload() {
  const input = gq("#galerieAdminUploadInput");
  const drop = gq("#galerieAdminUploadDrop");
  const status = gq("#galerieAdminUploadStatus");
  function setStatus(txt, tone) { status.textContent = txt; status.dataset.tone = tone || ""; }
  async function send(file) {
    if (!file) return;
    if (!/\.(glb|gltf)$/i.test(file.name)) { setStatus("Refusé : extension non supportée", "err"); return; }
    if (file.size > 30 * 1024 * 1024) { setStatus("Refusé : > 30 MB", "err"); return; }
    setStatus("Lecture du fichier…", "running");
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = String(reader.result).split(",")[1];
      setStatus("Envoi vers GitHub…", "running");
      try {
        const r = await fetch("/api/aurora", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "upload", filename: file.name, content: base64 })
        });
        const data = await r.json();
        if (!r.ok) { setStatus("Erreur : " + (data.error || r.status), "err"); return; }
        setStatus(`Déposé · ${data.localPath || file.name}`, "ok");
        setTimeout(refreshInventory, 1200);
      } catch (e) { setStatus("Réseau : " + e.message, "err"); }
    };
    reader.readAsDataURL(file);
  }
  input?.addEventListener("change", e => { send(e.target.files?.[0]); input.value = ""; });
  ["dragenter", "dragover"].forEach(ev => drop?.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach(ev => drop?.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("is-over"); }));
  drop?.addEventListener("drop", e => { const f = e.dataTransfer?.files?.[0]; if (f) send(f); });
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
