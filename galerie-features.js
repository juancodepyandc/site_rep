(function() {
const COOKIE_KEY = "galerie_cookies_v1";

const TICKER_ITEMS = [
  { tone: "ok",  text: "Atelier ouvert · Paris XI" },
  { tone: "",    text: "Devis clair avant intervention" },
  { tone: "ok",  text: "Diagnostic transparent & documenté" },
  { tone: "",    text: "Réparation PC · Mobile · PC sur mesure" },
  { tone: "ok",  text: "Concierge IA disponible · réponse instantanée" },
  { tone: "",    text: "Rendu 3D réaliste Aurora · 20-30 min" }
];

const NUMERAL_BY_VIEW = {
  pc: "01", mobile: "02", custom: "03", admin: "04", contact: "05", legal: "06", compare: "04"
};

const CONCIERGE_SUGGESTIONS = [
  "Aide-moi à choisir un GPU pour du 1440p",
  "Combien pour réparer un écran d'iPhone 13 ?",
  "Quelle config pour Blender + montage 4K ?",
  "Mon PC est lent, que faire ?"
];

const CONCIERGE_SYSTEM = `Tu es le Concierge de l'Atelier Électronique, maison technique parisienne (Paris XI).

PERSONNALITÉ
- Réponses en français, ton chaleureux, précis, sans esbroufe.
- Concis : 2 à 5 phrases.
- Tu reconnais quand tu ne sais pas et invites à écrire à rabuteaujuandavid@gmail.com.

L'ATELIER PROPOSE
1) Réparation PC — diagnostic, pannes, récupération de données. Main d'œuvre 45 €/h + pièces.
2) Réparation mobile — écran, batterie, charge, caméra, audio. iPhone 13 écran 109-149 €, batterie 69-89 €.
3) PC sur mesure — simulateur avec aperçu 3D procédural ou rendu IA réaliste Aurora.

CATALOGUE INDICATIF
- CPU : Ryzen 5 7600 (219 €), Ryzen 7 7700X (339 €), Ryzen 9 7900X (489 €), Core i5-14600K (329 €), Core i7-14700K (479 €)
- GPU : RTX 4060 (309 €), RTX 4070 Super (619 €) sweet 1440p, RTX 4080 Super (1099 €), RX 7800 XT (549 €), RTX 4090 (1799 €)
- RAM : 32 GB DDR5-6000 (109 €), 64 GB DDR5-6000 (229 €)
- Stockage : 1 TB NVMe Gen4 (99 €), 2 TB NVMe Gen4 (179 €)

ACTIONS QUE TU PEUX DÉCLENCHER (un seul marqueur max, sa propre ligne, transformé en bouton par l'interface)
[[OPEN:home]] | [[OPEN:pc]] | [[OPEN:mobile]] | [[OPEN:custom]] | [[OPEN:compare]] | [[OPEN:contact]] | [[OPEN:legal]]

RÈGLES : Tu ne donnes pas de prix exact si tu n'es pas sûr — fourchette. Pas d'accès aux devis stockés — propose le code DV-XXXXXX dans la salle correspondante.`;

const SPECIMENS = [
  { cat: "Carte graphique", name: "RTX 4070 Super", price: "619 €", meta: "12 GB GDDR6X · 220 W · sweet spot 1440p", colorA: 0x1a3a5c, colorB: 0xa8553a, shape: "box-wide" },
  { cat: "Processeur",      name: "Ryzen 7 7700X",   price: "339 €", meta: "8 cœurs · AM5 · 105 W",                  colorA: 0x9c8359, colorB: 0x14110e, shape: "thin-square" },
  { cat: "Refroidissement", name: "AIO 280 mm",      price: "169 €", meta: "Silencieux · TDP 350 W",                colorA: 0xebe6da, colorB: 0xa8553a, shape: "cylinder" },
  { cat: "Boîtier",         name: "Lian Li O11D Mini", price: "149 €", meta: "Verre trempé · airflow",              colorA: 0x14110e, colorB: 0x1a3a5c, shape: "box-tall" },
  { cat: "RAM",             name: "32 GB DDR5-6000",  price: "109 €", meta: "Kit dual-rank · CL30",                 colorA: 0x9c8359, colorB: 0x14110e, shape: "stick" },
  { cat: "Stockage",        name: "WD SN850X 2 TB",   price: "179 €", meta: "Gen4 · 7 300 MB/s",                   colorA: 0x1a3a5c, colorB: 0xebe6da, shape: "ssd" }
];

const CARNET_ENTRIES = [
  { date: "11 mai", body: "Tour signature livrée — <em>Ryzen 7 7700X + RTX 4070 Super</em>, finitions cuivre brossé.", tag: "Sur mesure" },
  { date: "10 mai", body: "Récupération de données sur SSD NVMe corrompu — <em>2,3 TB récupérés</em>.", tag: "Réparation PC" },
  { date: "09 mai", body: "Remplacement batterie iPhone 13 + nettoyage capteur photo arrière.", tag: "Mobile" },
  { date: "07 mai", body: "Repaste + nettoyage Lenovo Legion 5 — <em>température GPU − 12 °C</em>.", tag: "Réparation PC" },
  { date: "06 mai", body: "Audit thermique custom loop client — pas de fuite, débit nominal.", tag: "Diagnostic" }
];

function gq(sel, root = document) { return root.querySelector(sel); }
function gqq(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function clearLegacyTheme() {
  try {
    const v = localStorage.getItem("ae_theme_v1");
    if (v && !v.includes('"presetName":"galerie"')) localStorage.removeItem("ae_theme_v1");
  } catch {}
  const root = document.documentElement;
  ["--bg","--text","--muted","--muted2","--stroke","--panel","--panel2","--accent","--accent2","--accent3","--accentWarm","--ui-panel-top","--ui-panel-bottom","--ui-input-bg","--ui-input-border","--ui-input-focus","--ui-btn-border","--ui-btn-bg","--ui-btn-hover-bg","--ui-btn-ghost-bg","--ui-btn-ghost-border","--ui-btn-primary-from","--ui-btn-primary-to","--ui-btn-primary-text"].forEach(v => root.style.removeProperty(v));
}

function buildTicker() {
  if (gq("#galerieTicker")) return;
  const t = document.createElement("div");
  t.className = "galerie-ticker"; t.id = "galerieTicker";
  const make = () => TICKER_ITEMS.map(i => `<span><span class="galerie-ticker__dot${i.tone === "ok" ? " galerie-ticker__dot--ok" : ""}"></span>${i.text}</span>`).join("");
  t.innerHTML = `<div class="galerie-ticker__strip">${make()}${make()}</div>`;
  document.body.insertBefore(t, document.body.firstChild);
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
    card.innerHTML = `
      <div class="galerie-specimen__visual">
        <canvas id="galerieSp-${i}" data-specimen-canvas="${i}"></canvas>
        <div class="galerie-specimen__corners"></div>
        <div class="galerie-specimen__placeholder">Bientôt exposé · prévisualisation procédurale</div>
      </div>
      <div class="galerie-specimen__body">
        <div class="galerie-specimen__cat">${s.cat}</div>
        <div class="galerie-specimen__name">${s.name}</div>
        <div class="galerie-specimen__meta">${s.meta}</div>
        <div class="galerie-specimen__price">${s.price}</div>
      </div>
    `;
    grid.appendChild(card);
  });
  if (window.THREE_GALERIE) initSpecimenScenes();
}

function buildCarnetList() {
  const list = gq("#galerieCarnetList"); if (!list) return;
  list.innerHTML = "";
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

function injectHeroFloats() {
  const heroRight = gq('.view[data-view="home"] .hero__right');
  if (!heroRight || gq("#galerieHeroFloats")) return;
  const wrap = document.createElement("div");
  wrap.id = "galerieHeroFloats";
  wrap.className = "galerie-hero-floats";
  wrap.innerHTML = `
    <div class="galerie-hero-float galerie-hero-float--gpu" data-fdepth="1.8"><canvas data-float="gpu"></canvas><span>GPU · 12 GB</span></div>
    <div class="galerie-hero-float galerie-hero-float--ram" data-fdepth="1.2"><canvas data-float="ram"></canvas><span>RAM · 32 GB</span></div>
    <div class="galerie-hero-float galerie-hero-float--fan" data-fdepth="2.4"><canvas data-float="fan"></canvas><span>Fan · 140 mm</span></div>
    <div class="galerie-hero-float galerie-hero-float--cpu" data-fdepth="1.4"><canvas data-float="cpu"></canvas><span>CPU · AM5</span></div>
    <div class="galerie-hero-float galerie-hero-float--ssd" data-fdepth="3.0"><canvas data-float="ssd"></canvas><span>NVMe · Gen4</span></div>
  `;
  heroRight.appendChild(wrap);
  if (window.THREE_GALERIE) initHeroFloats();
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
  `;
  adminPanel.parentElement.appendChild(block);
  bindAdminUpload();
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
    const t = e.target.closest("[data-nav]");
    if (!t || pending) return;
    pending = true;
    sweep.classList.remove("is-flash"); void sweep.offsetWidth; sweep.classList.add("is-flash");
    const current = gq(".view.is-active");
    if (current) {
      current.classList.add("galerie-view-leaving");
      setTimeout(() => current.classList.remove("galerie-view-leaving"), 800);
    }
    setTimeout(() => { pending = false; }, 400);
  }, true);

  const observer = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.attributeName === "class" && m.target.classList?.contains("view") && m.target.classList.contains("is-active") && !m.target.dataset._entered) {
        m.target.classList.remove("galerie-view-entering");
        void m.target.offsetWidth;
        m.target.classList.add("galerie-view-entering");
        setTimeout(() => m.target.classList.remove("galerie-view-entering"), 1100);
      }
    });
  });
  gqq(".view").forEach(v => observer.observe(v, { attributes: true }));
}

async function initThreeFeatures() {
  if (window.THREE_GALERIE) return;
  try {
    const mod = await import("https://unpkg.com/three@0.161.0/build/three.module.js");
    window.THREE_GALERIE = mod;
    initHeroFloats();
    initSpecimenScenes();
  } catch (e) { console.warn("Galerie three load fail:", e.message); }
}

function initHeroFloats() {
  if (!window.THREE_GALERIE) return;
  const THREE = window.THREE_GALERIE;
  const stage = gq('.view[data-view="home"] .hero__right');
  if (!stage) return;
  gqq("canvas[data-float]", stage).forEach(canvas => {
    if (canvas.dataset._init) return;
    canvas.dataset._init = "1";
    const type = canvas.dataset.float;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
    cam.position.set(0, 0.8, 3); cam.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(2, 3, 2); scene.add(key);
    const rim = new THREE.PointLight(0xa8553a, 2.2, 6, 1.5); rim.position.set(-2, 0.5, -1); scene.add(rim);
    const grp = new THREE.Group(); scene.add(grp);
    let mesh, detail;
    if (type === "gpu") {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 0.65), new THREE.MeshStandardMaterial({ color: 0x1a3a5c, metalness: 0.6, roughness: 0.35 }));
      detail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.05), new THREE.MeshStandardMaterial({ color: 0xa8553a, metalness: 0.9, roughness: 0.2 })); detail.position.y = 0.32;
    } else if (type === "ram") {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.18), new THREE.MeshStandardMaterial({ color: 0x9c8359, metalness: 0.7, roughness: 0.3 }));
      detail = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.12), new THREE.MeshStandardMaterial({ color: 0x1a1814, metalness: 0.4, roughness: 0.6 })); detail.position.y = -0.16;
    } else if (type === "fan") {
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.18, 32), new THREE.MeshStandardMaterial({ color: 0xebe6da, metalness: 0.4, roughness: 0.45 }));
      detail = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 12, 48), new THREE.MeshStandardMaterial({ color: 0xa8553a, metalness: 0.9, roughness: 0.2 })); detail.rotation.x = Math.PI / 2;
    } else if (type === "cpu") {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.95), new THREE.MeshStandardMaterial({ color: 0x14110e, metalness: 0.85, roughness: 0.2 }));
      detail = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.55), new THREE.MeshStandardMaterial({ color: 0x9c8359, metalness: 0.95, roughness: 0.15 })); detail.position.y = 0.08;
    } else {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.35), new THREE.MeshStandardMaterial({ color: 0x1a3a5c, metalness: 0.5, roughness: 0.35 }));
      detail = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.2), new THREE.MeshStandardMaterial({ color: 0xebe6da, metalness: 0.2, roughness: 0.6 })); detail.position.y = 0.07;
    }
    grp.add(mesh); grp.add(detail);
    function resize() { const r = canvas.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); cam.aspect = r.width / Math.max(1, r.height); cam.updateProjectionMatrix(); }
    resize(); new ResizeObserver(resize).observe(canvas);
    const seed = Math.random() * 10;
    function loop(t) { grp.rotation.y = t / 2200 + seed; grp.rotation.x = Math.sin(t / 3000 + seed) * 0.25; renderer.render(scene, cam); requestAnimationFrame(loop); }
    requestAnimationFrame(loop);
  });
  bindHeroParallax();
}

function bindHeroParallax() {
  const stage = gq('.view[data-view="home"] .hero__right');
  if (!stage || stage.dataset._parallax) return;
  stage.dataset._parallax = "1";
  const floats = gqq(".galerie-hero-float", stage);
  let mx = 0, my = 0, fmx = 0, fmy = 0;
  stage.addEventListener("pointermove", e => {
    const r = stage.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
  });
  stage.addEventListener("pointerleave", () => { mx = 0; my = 0; });
  function loop() {
    fmx += (mx - fmx) * 0.08; fmy += (my - fmy) * 0.08;
    floats.forEach(f => {
      const d = parseFloat(f.dataset.fdepth || "1.5");
      f.style.transform = `translate3d(${-fmx * 40 * d}px, ${-fmy * 28 * d}px, 0) rotate(${fmx * 12 * d}deg)`;
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function initSpecimenScenes() {
  if (!window.THREE_GALERIE) return;
  const THREE = window.THREE_GALERIE;
  SPECIMENS.forEach((s, i) => {
    const canvas = gq(`#galerieSp-${i}`);
    if (!canvas || canvas.dataset._init) return;
    canvas.dataset._init = "1";
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    cam.position.set(0, 1.2, 3.6); cam.lookAt(0, 0.5, 0);
    scene.add(new THREE.AmbientLight(0xfbf8f0, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(2, 4, 3); scene.add(key);
    const rim = new THREE.PointLight(0xa8553a, 1.8, 8, 1.5); rim.position.set(-2, 1, -2); scene.add(rim);
    const grp = new THREE.Group(); scene.add(grp);
    let geom;
    switch (s.shape) {
      case "box-wide": geom = new THREE.BoxGeometry(1.6, 0.6, 0.8); break;
      case "thin-square": geom = new THREE.BoxGeometry(1.1, 0.12, 1.1); break;
      case "cylinder": geom = new THREE.CylinderGeometry(0.55, 0.55, 1.2, 32); break;
      case "box-tall": geom = new THREE.BoxGeometry(0.9, 1.5, 0.7); break;
      case "stick": geom = new THREE.BoxGeometry(1.6, 0.32, 0.18); break;
      case "ssd": geom = new THREE.BoxGeometry(1.4, 0.1, 0.45); break;
      default: geom = new THREE.BoxGeometry(1, 0.4, 0.6);
    }
    const body = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color: s.colorA, metalness: 0.5, roughness: 0.4 }));
    grp.add(body);
    const detail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.06), new THREE.MeshStandardMaterial({ color: s.colorB, metalness: 0.85, roughness: 0.2 }));
    detail.position.y = 0.4; grp.add(detail);
    function resize() { const r = canvas.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); cam.aspect = r.width / Math.max(1, r.height); cam.updateProjectionMatrix(); }
    resize(); new ResizeObserver(resize).observe(canvas);
    let target = i * 0.3, current = target;
    canvas.addEventListener("pointermove", e => {
      const r = canvas.getBoundingClientRect();
      target = ((e.clientX - r.left) / r.width - 0.5) * Math.PI;
    });
    function loop(t) {
      current += (target - current) * 0.1;
      grp.rotation.y = current + Math.sin(t / 3000 + i) * 0.3;
      grp.rotation.x = Math.sin(t / 4000 + i) * 0.15;
      renderer.render(scene, cam);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  });
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
  return { build };
})();

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
  setTimeout(clearLegacyTheme, 1500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
})();
