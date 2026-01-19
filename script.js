(function(){
  emailjs.init("FNOmFW1q3gEntsR0J");
})();

const SERVICE_ID = "service_8r68jtk";
const TEMPLATE_ID = "template_sd7paiv";
const TO_EMAIL = "rabuteaujuandavid@gmail.com";

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

function toast(t){
  const el = $("#toast");
  el.textContent = t;
  el.classList.add("is-show");
  clearTimeout(toast._t);
  toast._t = setTimeout(()=> el.classList.remove("is-show"), 2600);
}

function setStatus(id, txt){
  const el = document.getElementById(id);
  if(el) el.textContent = txt || "";
}

const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

function closeMobileNav(){
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded","false");
}

navToggle.addEventListener("click", ()=>{
  const open = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

const views = $$(".view");
const links = $$(".nav__link");

function revealInView(){
  const active = $(".view.is-active");
  if(!active) return;
  $$(".reveal", active).forEach((el, i)=>{
    el.classList.remove("is-in");
    setTimeout(()=> el.classList.add("is-in"), 90 + i*70);
  });
}

function showView(key){
  views.forEach(v => v.classList.toggle("is-active", v.dataset.view === key));
  links.forEach(a => a.classList.toggle("is-active", a.dataset.nav === key));
  closeMobileNav();
  window.scrollTo({top: 0, behavior: "smooth"});
  revealInView();
}

links.forEach(a => a.addEventListener("click", (e)=>{
  e.preventDefault();
  showView(e.currentTarget.dataset.nav);
}));

$$("[data-nav]").forEach(el=>{
  el.addEventListener("click", (e)=>{
    const key = e.currentTarget.dataset.nav;
    if(!key) return;
    e.preventDefault();
    showView(key);
  });
});

revealInView();

async function sendEmail({subject, from_name, reply_to, message, statusElId}){
  try{
    setStatus(statusElId, "Envoi en cours…");
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, { subject, from_name, reply_to, message, to_email: TO_EMAIL });
    setStatus(statusElId, "Envoyé. Réponse dès que possible.");
    toast("Demande envoyée ✅");
    return true;
  }catch(err){
    console.error(err);
    setStatus(statusElId, "Erreur d’envoi. Réessaye.");
    toast("Erreur d’envoi ❌");
    return false;
  }
}

function bindClassicForm(formId, subject, statusElId){
  const form = document.getElementById(formId);
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const lines = [];
    fd.forEach((v,k)=> lines.push(`${k} : ${v}`));
    const ok = await sendEmail({
      subject,
      from_name: fd.get("from_name"),
      reply_to: fd.get("reply_to"),
      message: lines.join("\n"),
      statusElId
    });
    if(ok) form.reset();
  });
}

bindClassicForm("form-pc", "Demande devis — Réparation PC", "pcStatus");
bindClassicForm("form-mobile", "Demande devis — Réparation Mobile", "mobileStatus");

document.getElementById("form-contact").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const form = e.currentTarget;
  const fd = new FormData(form);
  const msg = `topic : ${fd.get("topic")}\nmessage : ${fd.get("message")}`;
  const ok = await sendEmail({
    subject: `Service client — ${fd.get("topic")}`,
    from_name: fd.get("from_name"),
    reply_to: fd.get("reply_to"),
    message: msg,
    statusElId: "contactStatus"
  });
  if(ok) form.reset();
});

const BASE_PRICE = 20;

const cpuEl = $("#cpu");
const moboEl = $("#mobo");
const ramEl = $("#ram");
const gpuEl = $("#gpu");
const storageEl = $("#storage");
const psuEl = $("#psu");
const caseEl = $("#case");
const customCablesEl = $("#customCables");
const watercoolingEl = $("#watercooling");
const cableMgmtEl = $("#cableMgmt");
const usageEl = $("#usage");

const priceEl = $("#price");
const alertsEl = $("#alerts");

function parseValue(raw){
  const p = raw.split("|");
  return { label: p[0], meta: p[1] || "", price: Number(p[2] || 0) };
}

function selected(el){
  return (el && el.value) ? parseValue(el.value) : null;
}

function euro(n){
  return new Intl.NumberFormat("fr-FR", {style:"currency", currency:"EUR"}).format(n);
}

function clearAlerts(){
  alertsEl.innerHTML = "";
}

function alertBox(type, text){
  const d = document.createElement("div");
  d.className = `alert ${type}`;
  d.textContent = text;
  alertsEl.appendChild(d);
}

function compute(){
  const cpu = selected(cpuEl);
  const mobo = selected(moboEl);
  const ram = selected(ramEl);
  const gpu = selected(gpuEl);
  const storage = selected(storageEl);
  const psu = selected(psuEl);
  const casev = selected(caseEl);

  if(!cpu || !mobo || !ram || !gpu || !storage || !psu || !casev || !usageEl.value){
    priceEl.textContent = "—";
    clearAlerts();
    alertBox("warn", "Choisis tous les composants pour obtenir une estimation fiable.");
    return { ready:false, total:0, warnings:["Choix incomplets"] };
  }

  const optCables = customCablesEl.checked ? 35 : 0;
  const optWater = watercoolingEl.checked ? 90 : 0;
  const optCable = cableMgmtEl.checked ? 25 : 0;

  const parts = cpu.price + mobo.price + ram.price + gpu.price + storage.price + psu.price + casev.price;
  const total = BASE_PRICE + parts + optCables + optWater + optCable;

  const warnings = [];
  clearAlerts();

  if(cpu.meta !== mobo.meta){
    warnings.push("Incompatibilité socket CPU / carte mère.");
    alertBox("bad", "Incompatibilité : le socket du processeur ne correspond pas à la carte mère.");
  }else{
    alertBox("good", "Compatibilité socket : OK");
  }

  const psuW = Number(psu.meta);
  const gpuW = Number(gpu.meta);
  const headroom = 250;
  const needed = gpuW + headroom;

  if(psuW < needed){
    warnings.push("Alimentation probablement insuffisante.");
    alertBox("bad", `Alimentation trop juste : conseillé ≥ ${needed}W (marge incluse).`);
  }else if(psuW < needed + 100){
    warnings.push("Alimentation OK mais marge faible.");
    alertBox("warn", "Alimentation : ça passe, mais une marge plus large améliore la stabilité.");
  }else{
    alertBox("good", "Alimentation : marge confortable");
  }

  const cpuTier = (cpu.label.includes("i5") || cpu.label.includes("Ryzen 5")) ? 1 : 2;
  const gpuTier = (gpu.label.includes("4060")) ? 1 : 2;
  if(gpuTier > cpuTier){
    warnings.push("Configuration potentiellement déséquilibrée (GPU au-dessus du CPU).");
    alertBox("warn", "Alerte cohérence : GPU plus haut de gamme que le CPU → possible bottleneck selon usage.");
  }

  const ramGB = Number(ram.meta);
  const usage = usageEl.value || "";
  if((usage.includes("Création") || usage.includes("4K")) && ramGB < 32){
    warnings.push("RAM probablement faible pour création / 4K.");
    alertBox("warn", "Pour création / 4K, 32 Go (ou plus) est souvent plus confortable.");
  }

  priceEl.textContent = euro(total);
  if(warnings.length === 0){
    alertBox("good", "Configuration cohérente : estimation prête à être envoyée.");
  }
  return { ready:true, total, warnings };
}

[cpuEl,moboEl,ramEl,gpuEl,storageEl,psuEl,caseEl,customCablesEl,watercoolingEl,cableMgmtEl,usageEl].forEach(el=>{
  if(el) el.addEventListener("change", compute);
});
compute();

$("#resetCustom").addEventListener("click", ()=>{
  $("#form-custom").reset();
  compute();
  toast("Simulation réinitialisée");
});

$("#form-custom").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const state = compute();
  if(!state.ready){
    toast("Complète la simulation avant d’envoyer");
    return;
  }

  const name = window.prompt("Ton nom (pour le devis) :");
  if(!name){ toast("Nom requis"); return; }
  const email = window.prompt("Ton email (pour recevoir la réponse) :");
  if(!email){ toast("Email requis"); return; }

  const cpu = selected(cpuEl);
  const mobo = selected(moboEl);
  const ram = selected(ramEl);
  const gpu = selected(gpuEl);
  const storage = selected(storageEl);
  const psu = selected(psuEl);
  const casev = selected(caseEl);

  const options = [];
  if(customCablesEl.checked) options.push("Câbles personnalisés");
  if(watercoolingEl.checked) options.push("Watercooling / AIO");
  if(cableMgmtEl.checked) options.push("Câble management premium");

  const message = [
    "type : devis_pc_sur_mesure",
    `usage : ${usageEl.value}`,
    `cpu : ${cpu.label}`,
    `carte_mere : ${mobo.label}`,
    `ram : ${ram.label}`,
    `gpu : ${gpu.label}`,
    `stockage : ${storage.label}`,
    `alimentation : ${psu.label}`,
    `boitier : ${casev.label}`,
    `options : ${options.length ? options.join(", ") : "aucune"}`,
    `prix_base : ${BASE_PRICE} EUR`,
    `prix_estime : ${euro(state.total)}`,
    `alertes : ${state.warnings.length ? state.warnings.join(" | ") : "aucune"}`
  ].join("\n");

  await sendEmail({
    subject: "Demande devis — PC sur mesure (simulation)",
    from_name: name,
    reply_to: email,
    message,
    statusElId: "customStatus"
  });
});

$("#year").textContent = String(new Date().getFullYear());

(function tiltCards(){
  const cards = $$(".tilt");
  const strength = 10;
  cards.forEach(card=>{
    card.addEventListener("mousemove", (e)=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-y * strength).toFixed(2);
      const ry = (x * strength).toFixed(2);
      card.style.transform = `translateY(-5px) scale(1.01) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", ()=>{
      card.style.transform = "";
    });
  });
})();
