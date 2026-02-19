import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MODELS_ROOT = path.join(ROOT, "assets", "models", "poly");
const MANIFEST_PATH = path.join(ROOT, "assets", "pc3d-models.json");
const ATTRIBUTION_PATH = path.join(ROOT, "docs", "PC3D_MODEL_ATTRIBUTION.md");

const MODEL_SPECS = [
  {
    component: "case",
    publicID: "4TZXM3lO5KK",
    slug: "computer-tower",
    brands: ["MSI", "Corsair", "NZXT", "Lian Li", "Fractal", "be quiet!", "Antec", "Montech", "Phanteks"],
    note: "Boitier tour principal"
  },
  {
    component: "case",
    publicID: "3mANYC9YrZf",
    slug: "dell-optiplex-micro",
    brands: ["Dell", "HP", "Lenovo", "Acer", "Asus"],
    note: "Alternative compacte"
  },
  {
    component: "motherboard",
    publicID: "fxKdRjNq20j",
    slug: "circuit-board",
    brands: ["MSI", "ASUS", "Gigabyte", "ASRock", "Biostar", "NZXT", "Colorful", "EVGA"],
    note: "Base carte mere"
  },
  {
    component: "motherboard",
    publicID: "qaVbbKkil7",
    slug: "collectible-board",
    brands: ["ASUS", "Gigabyte", "MSI", "ASRock"],
    note: "Variante carte mere"
  },
  {
    component: "gpu",
    publicID: "i45v5trpyR",
    slug: "graphics-card",
    brands: ["NVIDIA", "AMD", "Intel", "Asus", "MSI", "Gigabyte", "Sapphire", "XFX", "PowerColor", "Zotac", "PNY"],
    note: "Carte graphique principale"
  },
  {
    component: "gpu",
    publicID: "7IAF3hGUe6N",
    slug: "graphics-card-pcb",
    brands: ["NVIDIA", "AMD", "Intel"],
    note: "Variante PCB"
  },
  {
    component: "psu",
    publicID: "WFVjj4vnGg",
    slug: "power-box",
    brands: ["Corsair", "Seasonic", "be quiet!", "MSI", "ASUS", "Gigabyte", "Cooler Master", "Thermaltake", "NZXT", "FSP"],
    note: "Bloc alimentation"
  },
  {
    component: "ram",
    publicID: "obBMPOGYvy",
    slug: "ram-stick",
    brands: ["Corsair", "G.Skill", "Kingston", "Crucial", "TeamGroup", "ADATA", "Patriot", "Lexar", "Mushkin", "PNY", "KLEVV"],
    note: "Barrette RAM"
  },
  {
    component: "storage",
    publicID: "sax4h1Dx9z",
    slug: "ssd",
    brands: ["Samsung", "WD", "Crucial", "Kingston", "Corsair", "Seagate", "Lexar", "Sabrent", "ADATA", "TeamGroup"],
    note: "SSD"
  },
  {
    component: "cpu_block",
    publicID: "oF0cAyddAI",
    slug: "cpu-package",
    brands: ["Corsair", "NZXT", "Arctic", "Lian Li", "DeepCool", "Cooler Master", "ASUS", "MSI"],
    note: "Bloc CPU/AIO"
  },
  {
    component: "cpu_cooler_air",
    publicID: "2cGxqg3pVA3",
    slug: "air-cooler-fan",
    brands: ["Noctua", "be quiet!", "DeepCool", "Cooler Master", "Thermalright", "Arctic", "Scythe"],
    note: "Ventirad air"
  },
  {
    component: "cpu_cooler_stock",
    publicID: "dPExITRhhZ",
    slug: "stock-cooler-fan",
    brands: ["AMD", "Intel"],
    note: "Ventirad stock"
  },
  {
    component: "radiator",
    publicID: "4XJ-DH66eKY",
    slug: "radiator",
    brands: ["Corsair", "NZXT", "Arctic", "Lian Li", "EK", "Alphacool", "Cooler Master"],
    note: "Radiateur AIO"
  },
  {
    component: "case_fan",
    publicID: "dPExITRhhZ",
    slug: "case-fan",
    brands: ["Noctua", "Corsair", "Lian Li", "be quiet!", "Arctic", "NZXT", "Cooler Master", "Thermaltake"],
    note: "Ventilateur boitier"
  }
];

function uniqueArray(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function sanitizeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function extractServerState(html) {
  const marker = "window.__SERVER_APP_STATE__ =";
  const markerIdx = html.indexOf(marker);
  if (markerIdx < 0) throw new Error("poly-state-marker-missing");
  const start = html.indexOf("{", markerIdx);
  if (start < 0) throw new Error("poly-state-json-start-missing");

  let depth = 0;
  let end = -1;
  for (let i = start; i < html.length; i += 1) {
    const ch = html[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end < 0) throw new Error("poly-state-json-end-missing");
  return JSON.parse(html.slice(start, end + 1));
}

async function fetchPolyMetadata(publicID) {
  const url = `https://poly.pizza/m/${encodeURIComponent(publicID)}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`poly-page-http-${res.status}`);
  const html = await res.text();
  const state = extractServerState(html);
  const model = state?.initialData?.model;
  if (!model?.ResourceID) throw new Error("poly-resource-missing");
  const glbUrl = `https://static.poly.pizza/${model.ResourceID}.glb`;
  return {
    publicID,
    title: model.Title || publicID,
    creator: model.Creator?.Username || "unknown",
    license: model.Licence || "unknown",
    resourceID: model.ResourceID,
    tris: Number(model.Tris || 0),
    tags: Array.isArray(model.Tags) ? model.Tags : [],
    pageUrl: url,
    glbUrl
  };
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function downloadFile(url, filePath) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`download-http-${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return buffer.byteLength;
}

function makeEmptyRegistry() {
  return {
    byId: {},
    byBrand: {},
    default: []
  };
}

async function main() {
  const records = [];
  const manifest = {
    version: 2,
    updatedAt: new Date().toISOString(),
    note: "Modeles GLB reels (Poly Pizza) avec fallback procedural."
      + " Fichiers synchronises localement via scripts/sync-pc3d-models.mjs.",
    models: {
      case: makeEmptyRegistry(),
      motherboard: makeEmptyRegistry(),
      gpu: makeEmptyRegistry(),
      psu: makeEmptyRegistry(),
      ram: makeEmptyRegistry(),
      storage: makeEmptyRegistry(),
      cpu_block: makeEmptyRegistry(),
      cpu_cooler_air: makeEmptyRegistry(),
      cpu_cooler_stock: makeEmptyRegistry(),
      radiator: makeEmptyRegistry(),
      case_fan: makeEmptyRegistry()
    }
  };

  for (const spec of MODEL_SPECS) {
    const meta = await fetchPolyMetadata(spec.publicID);
    const folder = path.join(MODELS_ROOT, spec.component);
    await ensureDir(folder);

    const baseName = sanitizeSlug(spec.slug || meta.title || spec.publicID) || spec.publicID.toLowerCase();
    const fileName = `${baseName}-${spec.publicID}.glb`;
    const absPath = path.join(folder, fileName);
    const relPath = path.relative(ROOT, absPath).split(path.sep).join("/");

    const size = await downloadFile(meta.glbUrl, absPath);

    const candidate = {
      url: relPath,
      source: "poly.pizza",
      sourceModel: spec.publicID,
      autoRotate: true,
      scaleMode: "contain"
    };

    const registry = manifest.models[spec.component] || makeEmptyRegistry();
    registry.default.push(candidate);
    manifest.models[spec.component] = registry;

    for (const brand of uniqueArray(spec.brands || [])) {
      if (!Array.isArray(registry.byBrand[brand])) registry.byBrand[brand] = [];
      registry.byBrand[brand].push(candidate);
    }

    records.push({
      component: spec.component,
      note: spec.note || "",
      title: meta.title,
      publicID: spec.publicID,
      creator: meta.creator,
      license: meta.license,
      pageUrl: meta.pageUrl,
      tris: meta.tris,
      tags: meta.tags,
      file: relPath,
      bytes: size
    });

    console.log(`OK ${spec.component.padEnd(16)} ${meta.title} -> ${relPath}`);
  }

  for (const reg of Object.values(manifest.models)) {
    reg.default = uniqueArray(reg.default.map((x) => JSON.stringify(x))).map((x) => JSON.parse(x));
    for (const [brand, entries] of Object.entries(reg.byBrand)) {
      reg.byBrand[brand] = uniqueArray(entries.map((x) => JSON.stringify(x))).map((x) => JSON.parse(x));
    }
  }

  await ensureDir(path.dirname(MANIFEST_PATH));
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  await ensureDir(path.dirname(ATTRIBUTION_PATH));
  const lines = [];
  lines.push("# PC3D Model Attribution");
  lines.push("");
  lines.push("Modeles importes automatiquement le " + new Date().toLocaleString("fr-FR") + " depuis Poly Pizza.");
  lines.push("Licences et credits conserves ci-dessous.");
  lines.push("");
  lines.push("| Component | Modele | Auteur | Licence | Tris | Source |");
  lines.push("|---|---|---|---|---:|---|");
  records.forEach((row) => {
    lines.push(`| ${row.component} | ${row.title} | ${row.creator} | ${row.license} | ${row.tris} | [${row.publicID}](${row.pageUrl}) |`);
  });
  lines.push("");
  lines.push("## Fichiers locaux");
  lines.push("");
  records.forEach((row) => {
    lines.push(`- \`${row.file}\` (${Math.round(row.bytes / 1024)} KB) - ${row.note || row.title}`);
  });
  lines.push("");

  await fs.writeFile(ATTRIBUTION_PATH, `${lines.join("\n")}\n`, "utf8");

  console.log(`\nManifest ecrit: ${path.relative(ROOT, MANIFEST_PATH)}`);
  console.log(`Attribution ecrite: ${path.relative(ROOT, ATTRIBUTION_PATH)}`);
}

main().catch((err) => {
  console.error("sync-pc3d-models failed:", err?.message || err);
  process.exit(1);
});
