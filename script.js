(function initEmailJS(){
  emailjs.init("FNOmFW1q3gEntsR0J");
})();

const SERVICE_ID = "service_8r68jtk";
const TEMPLATE_ID = "template_sd7paiv";
const TO_EMAIL = "rabuteaujuandavid@gmail.com";

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function toast(text){
  const el = $("#toast");
  el.textContent = text;
  el.classList.add("is-show");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(()=> el.classList.remove("is-show"), 2500);
}

function setStatus(id, text){
  const el = document.getElementById(id);
  if(el) el.textContent = text || "";
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
    window.setTimeout(()=> el.classList.add("is-in"), 60 + i*55);
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

$$("[data-nav]").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    e.preventDefault();
    showView(e.currentTarget.dataset.nav);
  });
});

revealInView();

async function sendEmail({subject, from_name, reply_to, message, statusElId}){
  try{
    setStatus(statusElId, "Envoi en cours…");
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      subject,
      from_name,
      reply_to,
      message,
      to_email: TO_EMAIL
    });
    setStatus(statusElId, "Envoyé. Réponse dès que possible.");
    toast("Demande envoyée ✅");
    return true;
  }catch(err){
    console.error(err);
    setStatus(statusElId, "Erreur d’envoi. Vérifie ton email et réessaye.");
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

  const message =
    `topic : ${fd.get("topic")}\n` +
    `message : ${fd.get("message")}`;

  const ok = await sendEmail({
    subject: `Service client — ${fd.get("topic")}`,
    from_name: fd.get("from_name"),
    reply_to: fd.get("reply_to"),
    message,
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

function parseOptionValue(raw){
  const parts = raw.split("|");
  return { label: parts[0], meta: parts[1] || "", price: Number(parts[2] || 0) };
}
function getSelected(el){ return (el && el.value) ? parseOptionValue(el.value) : null; }
function formatEuro(n){ return new Intl.NumberFormat("fr-FR", {style:"currency", currency:"EUR"}).format(n); }
function clearAlerts(){ alertsEl.innerHTML = ""; }
function pushAlert(type, text){
  const div = document.createElement("div");
  div.className = `alert ${type}`;
  div.textContent = text;
  alertsEl.appendChild(div);
}

function computeTotal(){
  const cpu = getSelected(cpuEl);
  const mobo = getSelected(moboEl);
  const ram = getSelected(ramEl);
  const gpu = getSelected(gpuEl);
  const storage = getSelected(storageEl);
  const psu = getSelected(psuEl);
  const casev = getSelected(caseEl);

  if(!cpu || !mobo || !ram || !gpu || !storage || !psu || !casev || !usageEl.value){
    priceEl.textContent = "—";
    clearAlerts();
    pushAlert("warn", "Choisis tous les composants pour obtenir une estimation fiable.");
    return { ready:false, total:0, warnings:["Choix incomplets"] };
  }

  const optCables = customCablesEl.checked ? 35 : 0;
  const optWater = watercoolingEl.checked ? 90 : 0;
  const optCableMgmt = cableMgmtEl.checked ? 25 : 0;

  const partsTotal = cpu.price + mobo.price + ram.price + gpu.price + storage.price + psu.price + casev.price;
  const total = BASE_PRICE + partsTotal + optCables + optWater + optCableMgmt;

  const warnings = [];
  clearAlerts();

  if(cpu.meta !== mobo.meta){
    warnings.push("Incompatibilité socket CPU / carte mère.");
    pushAlert("bad", "Incompatibilité : le socket du processeur ne correspond pas à la carte mère.");
  }else{
    pushAlert("good", "Compatibilité socket : OK");
  }

  const psuW = Number(psu.meta);
  const gpuW = Number(gpu.meta);
  const headroom = 250;
  const needed = gpuW + headroom;

  if(psuW < needed){
    warnings.push("Alimentation probablement insuffisante.");
    pushAlert("bad", `Alimentation trop juste : conseillé ≥ ${needed}W (marge incluse).`);
  }else if(psuW < needed + 100){
    warnings.push("Alimentation OK mais marge faible.");
    pushAlert("warn", "Alimentation : ça passe, mais une marge plus large améliore la stabilité.");
  }else{
    pushAlert("good", "Alimentation : marge confortable");
  }

  const cpuTier = (cpu.label.includes("i5") || cpu.label.includes("Ryzen 5")) ? 1 : 2;
  const gpuTier = (gpu.label.includes("4060")) ? 1 : 2;
  if(gpuTier > cpuTier){
    warnings.push("Configuration potentiellement déséquilibrée (GPU au-dessus du CPU).");
    pushAlert("warn", "Alerte cohérence : GPU plus haut de gamme que le CPU → risque de bottleneck selon usage.");
  }

  const ramGB = Number(ram.meta);
  const usage = usageEl.value || "";
  if((usage.includes("Création") || usage.includes("4K")) && ramGB < 32){
    warnings.push("RAM probablement faible pour création / 4K.");
    pushAlert("warn", "Pour création / 4K, 32 Go (ou plus) est généralement plus confortable.");
  }

  priceEl.textContent = formatEuro(total);

  if(warnings.length === 0){
    pushAlert("good", "Configuration cohérente : estimation prête à être envoyée.");
  }
  return { ready:true, total, warnings };
}

[cpuEl,moboEl,ramEl,gpuEl,storageEl,psuEl,caseEl,customCablesEl,watercoolingEl,cableMgmtEl,usageEl].forEach(el=>{
  if(el) el.addEventListener("change", computeTotal);
});
computeTotal();

$("#resetCustom").addEventListener("click", ()=>{
  $("#form-custom").reset();
  computeTotal();
  toast("Simulation réinitialisée");
});

$("#form-custom").addEventListener("submit", async (e)=>{
  e.preventDefault();

  const state = computeTotal();
  if(!state.ready){
    toast("Complète la simulation avant d’envoyer");
    return;
  }

  const name = window.prompt("Ton nom (pour le devis) :");
  if(!name){ toast("Nom requis pour envoyer le devis"); return; }
  const email = window.prompt("Ton email (pour recevoir la réponse) :");
  if(!email){ toast("Email requis pour envoyer le devis"); return; }

  const cpu = getSelected(cpuEl);
  const mobo = getSelected(moboEl);
  const ram = getSelected(ramEl);
  const gpu = getSelected(gpuEl);
  const storage = getSelected(storageEl);
  const psu = getSelected(psuEl);
  const casev = getSelected(caseEl);

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
    `prix_estime : ${formatEuro(state.total)}`,
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
