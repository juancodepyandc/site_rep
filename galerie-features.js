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
  pc: "01",
  mobile: "02",
  custom: "03",
  admin: "04",
  contact: "05",
  legal: "06"
};

const CONCIERGE_SUGGESTIONS = [
  "Aide-moi à choisir un GPU pour du 1440p",
  "Combien pour réparer un écran d'iPhone 13 ?",
  "Quelle config pour Blender + montage 4K ?",
  "Mon PC est lent, que faire ?",
  "Mes données sont récupérables ?"
];

const CONCIERGE_SYSTEM = `Tu es le Concierge de l'Atelier Électronique, maison technique parisienne (Paris XI).

PERSONNALITÉ
- Réponses en français, ton chaleureux, précis, sans esbroufe.
- Concis : 2 à 5 phrases.
- Tu sais reconnaître quand tu ne sais pas, et invites à écrire à rabuteaujuandavid@gmail.com.

L'ATELIER PROPOSE
1) Réparation PC — diagnostic, pannes, récupération de données. Main d'œuvre 45 €/h + pièces.
2) Réparation mobile — écran, batterie, charge, caméra, audio. iPhone 13 écran 109-149 €, batterie 69-89 €.
3) PC sur mesure — simulateur complet avec aperçu 3D (procédural) ou rendu IA réaliste Aurora.

CATALOGUE INDICATIF
- CPU : Ryzen 5 7600 (219 €), Ryzen 7 7700X (339 €), Ryzen 9 7900X (489 €), Core i5-14600K (329 €), Core i7-14700K (479 €)
- GPU : RTX 4060 (309 €), RTX 4070 Super (619 €) sweet 1440p, RTX 4080 Super (1099 €), RX 7800 XT (549 €), RTX 4090 (1799 €)
- RAM : 32 GB DDR5-6000 CL30 (109 €), 64 GB DDR5-6000 (229 €)
- Stockage : 1 TB NVMe Gen4 (99 €), 2 TB NVMe Gen4 (179 €)
- PSU : 850 W Gold (149 €), 1000 W Gold (219 €)
- Boîtier : Lian Li O11D Mini (149 €), Corsair 5000D (169 €)

ACTIONS QUE TU PEUX DÉCLENCHER (un seul marqueur max, sur sa propre ligne, transformé en bouton par l'interface)
[[OPEN:home]] | [[OPEN:pc]] | [[OPEN:mobile]] | [[OPEN:custom]] | [[OPEN:contact]] | [[OPEN:legal]]

RÈGLES
- Réponses concises sauf si vraiment demandé.
- Tu ne donnes pas de prix exact pour un composant si tu n'es pas sûr, tu donnes une fourchette.
- Tu n'as pas accès aux devis stockés — pour suivi, propose de saisir le code DV-XXXXXX dans la salle correspondante.`;

function $(sel, root = document) { return root.querySelector(sel); }

function buildTicker() {
  if ($("#galerieTicker")) return;
  const t = document.createElement("div");
  t.className = "galerie-ticker";
  t.id = "galerieTicker";
  const make = () => TICKER_ITEMS.map(i => `<span><span class="galerie-ticker__dot${i.tone === "ok" ? " galerie-ticker__dot--ok" : ""}"></span>${i.text}</span>`).join("");
  t.innerHTML = `<div class="galerie-ticker__strip">${make()}${make()}</div>`;
  document.body.insertBefore(t, document.body.firstChild);
}

function injectNumerals() {
  document.querySelectorAll(".view").forEach(v => {
    const name = v.dataset.view;
    const num = NUMERAL_BY_VIEW[name];
    if (!num) return;
    const head = v.querySelector(".section__head");
    if (!head || head.querySelector(".galerie-numeral")) return;
    const n = document.createElement("span");
    n.className = "galerie-numeral";
    n.setAttribute("aria-hidden", "true");
    n.textContent = num;
    head.appendChild(n);
  });
}

function buildCursor() {
  if (!matchMedia("(pointer: fine)").matches) return;
  if ($("#galerieCursor")) return;
  document.body.classList.add("has-magnet");
  const c = document.createElement("div");
  c.className = "galerie-cursor";
  c.id = "galerieCursor";
  c.setAttribute("aria-hidden", "true");
  c.innerHTML = '<span class="galerie-cursor__ring"></span><span class="galerie-cursor__dot"></span>';
  document.body.appendChild(c);

  let tx = 0, ty = 0, x = 0, y = 0;
  document.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  document.addEventListener("pointerover", e => {
    const t = e.target.closest("a, button, input, select, textarea, .btn, .nav__link, .showcase__card, .chip, .combo-option, .picker__opt, [data-nav], .theme-chip");
    c.classList.toggle("is-hover", !!t);
  });
  function loop() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    c.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function loadCookies() {
  try { return JSON.parse(localStorage.getItem(COOKIE_KEY) || "null"); } catch { return null; }
}
function saveCookies(c) { try { localStorage.setItem(COOKIE_KEY, JSON.stringify(c)); } catch {} }

function buildCookieBanner() {
  if (loadCookies()) return;
  if ($("#galerieCookie")) return;
  const b = document.createElement("div");
  b.className = "galerie-cookie";
  b.id = "galerieCookie";
  b.innerHTML = `
    <div class="galerie-cookie__icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r=".8" fill="currentColor"/><circle cx="14" cy="14" r=".8" fill="currentColor"/><circle cx="15" cy="9" r=".6" fill="currentColor"/></svg>
    </div>
    <div class="galerie-cookie__text">
      <div class="galerie-cookie__title">Cookies & confidentialité</div>
      <p class="galerie-cookie__desc">La maison utilise uniquement des cookies techniques nécessaires au fonctionnement des devis et diagnostics. Aucun suivi publicitaire. Vos préférences sont modifiables à tout moment depuis le footer.</p>
    </div>
    <div class="galerie-cookie__actions">
      <button class="btn btn--ghost btn--tiny" id="galerieCookieRefuse">Tout refuser</button>
      <button class="btn btn--primary btn--tiny" id="galerieCookieAccept">Tout accepter</button>
    </div>
  `;
  document.body.appendChild(b);
  setTimeout(() => b.classList.add("is-show"), 800);
  $("#galerieCookieAccept").addEventListener("click", () => {
    saveCookies({ essentials: true, func: true, perf: true, stats: true, at: new Date().toISOString() });
    b.classList.remove("is-show");
    setTimeout(() => b.remove(), 400);
  });
  $("#galerieCookieRefuse").addEventListener("click", () => {
    saveCookies({ essentials: true, func: false, perf: false, stats: false, at: new Date().toISOString() });
    b.classList.remove("is-show");
    setTimeout(() => b.remove(), 400);
  });
}

const Concierge = (() => {
  let open = false;
  const history = [];

  function build() {
    if ($("#galerieConcierge")) return;
    const c = document.createElement("div");
    c.className = "galerie-concierge";
    c.id = "galerieConcierge";
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
    $("#galerieConciergeOpen").addEventListener("click", toggle);
    $("#galerieConciergeClose").addEventListener("click", close);
    $("#galerieConciergeSend").addEventListener("click", send);
    $("#galerieConciergeInput").addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  }

  function toggle() {
    open = !open;
    document.getElementById("galerieConcierge").classList.toggle("is-open", open);
    if (open && history.length === 0) intro();
  }
  function close() {
    open = false;
    document.getElementById("galerieConcierge").classList.remove("is-open");
  }

  function intro() {
    const body = $("#galerieConciergeBody");
    body.innerHTML = "";
    history.length = 0;
    addMsg("bot", "Bonjour. Je suis le concierge de l'Atelier Électronique. Je peux vous orienter, donner des fourchettes de prix ou pré-remplir un devis. Que puis-je faire ?");
    renderSuggestions();
  }

  function addMsg(side, text) {
    const body = $("#galerieConciergeBody");
    const b = document.createElement("div");
    b.className = `galerie-bubble galerie-bubble--${side}`;
    b.textContent = text;
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
  }
  function showTyping() {
    const body = $("#galerieConciergeBody");
    const t = document.createElement("div");
    t.className = "galerie-bubble galerie-bubble--bot galerie-bubble--typing";
    t.id = "galerieTyping";
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
  }
  function hideTyping() { document.getElementById("galerieTyping")?.remove(); }

  function renderSuggestions() {
    const wrap = $("#galerieConciergeSuggestions");
    wrap.innerHTML = "";
    CONCIERGE_SUGGESTIONS.forEach(s => {
      const b = document.createElement("button");
      b.className = "galerie-concierge__suggestion";
      b.textContent = s;
      b.addEventListener("click", () => { $("#galerieConciergeInput").value = s; send(); });
      wrap.appendChild(b);
    });
  }

  const ACTION_RX = /\[\[OPEN:([a-z-]+)\]\]/i;

  function parseAction(reply) {
    const m = reply.match(ACTION_RX);
    if (!m) return { text: reply.trim(), action: null };
    const cleaned = reply.replace(ACTION_RX, "").trim();
    return { text: cleaned, action: { type: "open", view: m[1] } };
  }

  function executeAction(action) {
    close();
    if (action.type === "open") {
      const link = document.querySelector(`[data-nav="${action.view}"]`);
      if (link && typeof link.click === "function") link.click();
      else location.hash = "#" + action.view;
    }
  }

  function renderAction(action) {
    const body = $("#galerieConciergeBody");
    const labels = { home: "Accueil", pc: "Réparation PC", mobile: "Réparation Mobile", custom: "PC sur mesure", contact: "Contact", legal: "Mentions légales" };
    const btn = document.createElement("button");
    btn.className = "galerie-concierge__action";
    btn.textContent = `Ouvrir : ${labels[action.view] || action.view}`;
    btn.addEventListener("click", () => {
      executeAction(action);
      btn.disabled = true;
      btn.style.opacity = ".55";
      btn.textContent = "✓ " + btn.textContent;
    });
    body.appendChild(btn);
    body.scrollTop = body.scrollHeight;
  }

  async function send() {
    const input = $("#galerieConciergeInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    $("#galerieConciergeSuggestions").innerHTML = "";
    addMsg("user", text);
    history.push({ role: "user", content: text });
    showTyping();
    try {
      const r = await fetch("/api/aurora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", messages: [{ role: "system", content: CONCIERGE_SYSTEM }, ...history], temperature: 0.6 })
      });
      const data = await r.json();
      hideTyping();
      if (!r.ok || !data.reply) {
        addMsg("bot", "⚠ " + (data.error || "Erreur de connexion. Réessayez dans un instant."));
        history.pop();
        return;
      }
      history.push({ role: "assistant", content: data.reply });
      const parsed = parseAction(data.reply);
      if (parsed.text) addMsg("bot", parsed.text);
      if (parsed.action) renderAction(parsed.action);
    } catch (e) {
      hideTyping();
      addMsg("bot", "⚠ Erreur réseau : " + e.message);
      history.pop();
    }
  }

  return { build };
})();

function clearLegacyTheme() {
  try {
    const v = localStorage.getItem("ae_theme_v1");
    if (v && !v.includes('"presetName":"galerie"')) localStorage.removeItem("ae_theme_v1");
  } catch {}
  const root = document.documentElement;
  const inlineVars = ["--bg", "--text", "--muted", "--muted2", "--stroke", "--panel", "--panel2", "--accent", "--accent2", "--accent3", "--accentWarm", "--ui-panel-top", "--ui-panel-bottom", "--ui-input-bg", "--ui-input-border", "--ui-input-focus", "--ui-btn-border", "--ui-btn-bg", "--ui-btn-hover-bg", "--ui-btn-ghost-bg", "--ui-btn-ghost-border", "--ui-btn-primary-from", "--ui-btn-primary-to", "--ui-btn-primary-text"];
  inlineVars.forEach(v => root.style.removeProperty(v));
}

function init() {
  clearLegacyTheme();
  buildTicker();
  injectNumerals();
  buildCursor();
  buildCookieBanner();
  Concierge.build();
  setTimeout(clearLegacyTheme, 1500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
