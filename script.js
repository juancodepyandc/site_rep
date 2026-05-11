const BASE_PRICE = 20;
const QUOTE_STORAGE_KEY = "atelier_quotes_v2";
const PC_REPAIR_QUOTE_STORAGE_KEY = "atelier_pc_repair_quotes_v1";
const PC_REPAIR_LAST_QUOTE_CODE_KEY = "atelier_pc_repair_last_quote_code";
const MOBILE_QUOTE_STORAGE_KEY = "atelier_mobile_quotes_v1";
const MOBILE_LAST_QUOTE_CODE_KEY = "atelier_mobile_last_quote_code";

const CATALOG = {
  cpu: [
    { id: "cpu-amd-r5-5500", brand: "AMD", name: "Ryzen 5 5500", generation: 5000, socket: "AM4", tdp: 65, rank: 5.0, score: 6.8, price: 95 },
    { id: "cpu-amd-r5-5600", brand: "AMD", name: "Ryzen 5 5600", generation: 5000, socket: "AM4", tdp: 65, rank: 5.5, score: 7.2, price: 109 },
    { id: "cpu-amd-r5-5600x", brand: "AMD", name: "Ryzen 5 5600X", generation: 5000, socket: "AM4", tdp: 65, rank: 5.9, score: 7.6, price: 129 },
    { id: "cpu-amd-r7-5700x", brand: "AMD", name: "Ryzen 7 5700X", generation: 5000, socket: "AM4", tdp: 65, rank: 6.0, score: 7.6, price: 169 },
    { id: "cpu-amd-r7-5700x3d", brand: "AMD", name: "Ryzen 7 5700X3D", generation: 5000, socket: "AM4", tdp: 105, rank: 6.8, score: 8.3, price: 239 },
    { id: "cpu-amd-r7-5800x3d", brand: "AMD", name: "Ryzen 7 5800X3D", generation: 5000, socket: "AM4", tdp: 105, rank: 7.0, score: 8.5, price: 299 },
    { id: "cpu-amd-r9-5900x", brand: "AMD", name: "Ryzen 9 5900X", generation: 5000, socket: "AM4", tdp: 105, rank: 7.2, score: 8.4, price: 289 },
    { id: "cpu-amd-r9-5950x", brand: "AMD", name: "Ryzen 9 5950X", generation: 5000, socket: "AM4", tdp: 105, rank: 7.6, score: 8.7, price: 369 },
    { id: "cpu-amd-r5-7500f", brand: "AMD", name: "Ryzen 5 7500F", generation: 7000, socket: "AM5", tdp: 65, rank: 6.2, score: 8.0, price: 169 },
    { id: "cpu-amd-r5-7600", brand: "AMD", name: "Ryzen 5 7600", generation: 7000, socket: "AM5", tdp: 65, rank: 6.5, score: 8.3, price: 179.99 },
    { id: "cpu-amd-r5-7600x", brand: "AMD", name: "Ryzen 5 7600X", generation: 7000, socket: "AM5", tdp: 105, rank: 6.8, score: 8.5, price: 219 },
    { id: "cpu-amd-r7-7700", brand: "AMD", name: "Ryzen 7 7700", generation: 7000, socket: "AM5", tdp: 65, rank: 7.2, score: 8.8, price: 263.24 },
    { id: "cpu-amd-r7-7700x", brand: "AMD", name: "Ryzen 7 7700X", generation: 7000, socket: "AM5", tdp: 105, rank: 7.4, score: 8.9, price: 299 },
    { id: "cpu-amd-r7-7800x3d", brand: "AMD", name: "Ryzen 7 7800X3D", generation: 7000, socket: "AM5", tdp: 120, rank: 8.2, score: 9.4, price: 389 },
    { id: "cpu-amd-r9-7900", brand: "AMD", name: "Ryzen 9 7900", generation: 7000, socket: "AM5", tdp: 65, rank: 8.1, score: 9.0, price: 379 },
    { id: "cpu-amd-r9-7900x", brand: "AMD", name: "Ryzen 9 7900X", generation: 7000, socket: "AM5", tdp: 170, rank: 8.4, score: 9.1, price: 404.95 },
    { id: "cpu-amd-r9-7950x", brand: "AMD", name: "Ryzen 9 7950X", generation: 7000, socket: "AM5", tdp: 170, rank: 8.8, score: 9.2, price: 529 },
    { id: "cpu-amd-r9-7950x3d", brand: "AMD", name: "Ryzen 9 7950X3D", generation: 7000, socket: "AM5", tdp: 120, rank: 9.0, score: 9.4, price: 589 },
    { id: "cpu-amd-r5-9600x", brand: "AMD", name: "Ryzen 5 9600X", generation: 9000, socket: "AM5", tdp: 65, rank: 7.2, score: 8.7, price: 269 },
    { id: "cpu-amd-r7-9700x", brand: "AMD", name: "Ryzen 7 9700X", generation: 9000, socket: "AM5", tdp: 65, rank: 8.1, score: 9.1, price: 367.57 },
    { id: "cpu-amd-r7-9800x3d", brand: "AMD", name: "Ryzen 7 9800X3D", generation: 9000, socket: "AM5", tdp: 120, rank: 9.0, score: 9.8, price: 479.98 },
    { id: "cpu-amd-r9-9900x", brand: "AMD", name: "Ryzen 9 9900X", generation: 9000, socket: "AM5", tdp: 120, rank: 9.1, score: 9.6, price: 499 },
    { id: "cpu-amd-r9-9950x", brand: "AMD", name: "Ryzen 9 9950X", generation: 9000, socket: "AM5", tdp: 170, rank: 9.5, score: 9.9, price: 539.01 },
    { id: "cpu-intel-i5-12400f", brand: "Intel", name: "Core i5-12400F", generation: 12000, socket: "1700", tdp: 65, rank: 5.8, score: 7.4, price: 129 },
    { id: "cpu-intel-i5-12500", brand: "Intel", name: "Core i5-12500", generation: 12000, socket: "1700", tdp: 65, rank: 6.0, score: 7.7, price: 169 },
    { id: "cpu-intel-i5-12600k", brand: "Intel", name: "Core i5-12600K", generation: 12000, socket: "1700", tdp: 125, rank: 6.5, score: 8.2, price: 189 },
    { id: "cpu-intel-i7-12700k", brand: "Intel", name: "Core i7-12700K", generation: 12000, socket: "1700", tdp: 125, rank: 7.3, score: 8.7, price: 259 },
    { id: "cpu-intel-i9-12900k", brand: "Intel", name: "Core i9-12900K", generation: 12000, socket: "1700", tdp: 125, rank: 8.1, score: 9.0, price: 349 },
    { id: "cpu-intel-i5-13400f", brand: "Intel", name: "Core i5-13400F", generation: 13000, socket: "1700", tdp: 65, rank: 6.4, score: 8.1, price: 189 },
    { id: "cpu-intel-i5-13600k", brand: "Intel", name: "Core i5-13600K", generation: 13000, socket: "1700", tdp: 125, rank: 7.1, score: 8.8, price: 249 },
    { id: "cpu-intel-i7-13700k", brand: "Intel", name: "Core i7-13700K", generation: 13000, socket: "1700", tdp: 125, rank: 8.0, score: 9.2, price: 379 },
    { id: "cpu-intel-i9-13900k", brand: "Intel", name: "Core i9-13900K", generation: 13000, socket: "1700", tdp: 125, rank: 8.8, score: 9.4, price: 479 },
    { id: "cpu-intel-i5-14400f", brand: "Intel", name: "Core i5-14400F", generation: 14000, socket: "1700", tdp: 65, rank: 6.7, score: 8.4, price: 209 },
    { id: "cpu-intel-i5-14600k", brand: "Intel", name: "Core i5-14600K", generation: 14000, socket: "1700", tdp: 125, rank: 7.6, score: 9.0, price: 260.71 },
    { id: "cpu-intel-i7-14700kf", brand: "Intel", name: "Core i7-14700KF", generation: 14000, socket: "1700", tdp: 125, rank: 8.4, score: 9.3, price: 335.55 },
    { id: "cpu-intel-i9-14900k", brand: "Intel", name: "Core i9-14900K", generation: 14000, socket: "1700", tdp: 125, rank: 9.0, score: 9.5, price: 449 },
    { id: "cpu-intel-u5-245kf", brand: "Intel", name: "Core Ultra 5 245KF", generation: 20000, socket: "1851", tdp: 125, rank: 7.9, score: 9.1, price: 269 },
    { id: "cpu-intel-u5-245k", brand: "Intel", name: "Core Ultra 5 245K", generation: 20000, socket: "1851", tdp: 125, rank: 7.8, score: 9.0, price: 279 },
    { id: "cpu-intel-u7-265kf", brand: "Intel", name: "Core Ultra 7 265KF", generation: 20000, socket: "1851", tdp: 125, rank: 8.6, score: 9.4, price: 329 },
    { id: "cpu-intel-u7-265k", brand: "Intel", name: "Core Ultra 7 265K", generation: 20000, socket: "1851", tdp: 125, rank: 8.5, score: 9.3, price: 304.63 },
    { id: "cpu-intel-u9-285k", brand: "Intel", name: "Core Ultra 9 285K", generation: 20000, socket: "1851", tdp: 125, rank: 9.2, score: 9.6, price: 569 },
    { id: "cpu-amd-r7-7800x", brand: "AMD", name: "Ryzen 7 7800X", generation: 7000, socket: "AM5", tdp: 105, rank: 7.6, score: 9.0, price: 339 },
    { id: "cpu-amd-r9-7900x3d", brand: "AMD", name: "Ryzen 9 7900X3D", generation: 7000, socket: "AM5", tdp: 120, rank: 8.8, score: 9.3, price: 529 },
    { id: "cpu-amd-r5-7600f", brand: "AMD", name: "Ryzen 5 7600F", generation: 7000, socket: "AM5", tdp: 65, rank: 6.3, score: 8.2, price: 159 },
    { id: "cpu-intel-i7-14700k", brand: "Intel", name: "Core i7-14700K", generation: 14000, socket: "1700", tdp: 125, rank: 8.5, score: 9.4, price: 419 },
    { id: "cpu-intel-u5-225", brand: "Intel", name: "Core Ultra 5 225", generation: 20000, socket: "1851", tdp: 65, rank: 7.2, score: 8.8, price: 235 },
    { id: "cpu-amd-r5-3600", brand: "AMD", name: "Ryzen 5 3600", generation: 3000, socket: "AM4", tdp: 65, rank: 4.8, score: 6.6, price: 89 },
    { id: "cpu-amd-r7-3800x", brand: "AMD", name: "Ryzen 7 3800X", generation: 3000, socket: "AM4", tdp: 105, rank: 5.6, score: 7.3, price: 129 },
    { id: "cpu-intel-i3-12100f", brand: "Intel", name: "Core i3-12100F", generation: 12000, socket: "1700", tdp: 58, rank: 5.1, score: 7.0, price: 104 },
    { id: "cpu-intel-i5-13500", brand: "Intel", name: "Core i5-13500", generation: 13000, socket: "1700", tdp: 65, rank: 6.8, score: 8.5, price: 239 },
    { id: "cpu-intel-i9-14900ks", brand: "Intel", name: "Core i9-14900KS", generation: 14000, socket: "1700", tdp: 150, rank: 9.3, score: 9.7, price: 699 },
    { id: "cpu-amd-r9-9950x3d", brand: "AMD", name: "Ryzen 9 9950X3D", generation: 9000, socket: "AM5", tdp: 170, rank: 9.7, score: 10.0, price: 799 },
    { id: "cpu-amd-r7-8700g", brand: "AMD", name: "Ryzen 7 8700G", generation: 8000, socket: "AM5", tdp: 65, rank: 7.0, score: 8.4, price: 319 },
    { id: "cpu-amd-r5-8600g", brand: "AMD", name: "Ryzen 5 8600G", generation: 8000, socket: "AM5", tdp: 65, rank: 6.4, score: 8.0, price: 249 },
    { id: "cpu-intel-i7-13700", brand: "Intel", name: "Core i7-13700", generation: 13000, socket: "1700", tdp: 65, rank: 7.8, score: 9.0, price: 339 },
    { id: "cpu-intel-i5-14500", brand: "Intel", name: "Core i5-14500", generation: 14000, socket: "1700", tdp: 65, rank: 7.0, score: 8.5, price: 289 },
    { id: "cpu-intel-u9-265", brand: "Intel", name: "Core Ultra 9 265", generation: 20000, socket: "1851", tdp: 125, rank: 8.9, score: 9.5, price: 489 },
    { id: "cpu-amd-r5-5600g", brand: "AMD", name: "Ryzen 5 5600G", generation: 5000, socket: "AM4", tdp: 65, rank: 5.2, score: 6.9, price: 112 },
    { id: "cpu-amd-r7-5700g", brand: "AMD", name: "Ryzen 7 5700G", generation: 5000, socket: "AM4", tdp: 65, rank: 6.1, score: 7.6, price: 178 },
    { id: "cpu-amd-r5-8400f", brand: "AMD", name: "Ryzen 5 8400F", generation: 8000, socket: "AM5", tdp: 65, rank: 6.4, score: 8.1, price: 199 },
    { id: "cpu-amd-r5-7600x3d", brand: "AMD", name: "Ryzen 5 7600X3D", generation: 7000, socket: "AM5", tdp: 105, rank: 7.7, score: 9.2, price: 349 },
    { id: "cpu-intel-i3-14100f", brand: "Intel", name: "Core i3-14100F", generation: 14000, socket: "1700", tdp: 58, rank: 5.4, score: 7.4, price: 129 },
    { id: "cpu-intel-i7-12700", brand: "Intel", name: "Core i7-12700", generation: 12000, socket: "1700", tdp: 65, rank: 7.2, score: 8.6, price: 269 },
    { id: "cpu-amd-r5-8500g", brand: "AMD", name: "Ryzen 5 8500G", generation: 8000, socket: "AM5", tdp: 65, rank: 6.2, score: 7.9, price: 189 },
    { id: "cpu-amd-r9-7900x3d-lite", brand: "AMD", name: "Ryzen 9 7900X3D Pro", generation: 7000, socket: "AM5", tdp: 120, rank: 8.7, score: 9.3, price: 549 },
    { id: "cpu-intel-i5-12600", brand: "Intel", name: "Core i5-12600", generation: 12000, socket: "1700", tdp: 65, rank: 6.3, score: 8.1, price: 199 },
    { id: "cpu-intel-u7-255", brand: "Intel", name: "Core Ultra 7 255", generation: 20000, socket: "1851", tdp: 65, rank: 8.1, score: 9.1, price: 299 },
    { id: "cpu-amd-r5-5600gt", brand: "AMD", name: "Ryzen 5 5600GT", generation: 5000, socket: "AM4", tdp: 65, rank: 5.4, score: 7.1, price: 139 },
    { id: "cpu-amd-r7-5800xt", brand: "AMD", name: "Ryzen 7 5800XT", generation: 5000, socket: "AM4", tdp: 105, rank: 7.1, score: 8.5, price: 229 },
    { id: "cpu-amd-r7-7700f", brand: "AMD", name: "Ryzen 7 7700F", generation: 7000, socket: "AM5", tdp: 65, rank: 7.1, score: 8.7, price: 249 },
    { id: "cpu-amd-r7-9700f", brand: "AMD", name: "Ryzen 7 9700F", generation: 9000, socket: "AM5", tdp: 65, rank: 8.0, score: 9.0, price: 319 },
    { id: "cpu-amd-r9-9900x3d", brand: "AMD", name: "Ryzen 9 9900X3D", generation: 9000, socket: "AM5", tdp: 120, rank: 9.3, score: 9.8, price: 639 },
    { id: "cpu-intel-i5-14600kf", brand: "Intel", name: "Core i5-14600KF", generation: 14000, socket: "1700", tdp: 125, rank: 7.5, score: 8.9, price: 299 },
    { id: "cpu-intel-i7-14700f", brand: "Intel", name: "Core i7-14700F", generation: 14000, socket: "1700", tdp: 65, rank: 8.1, score: 9.1, price: 349 },
    { id: "cpu-intel-i9-14900kf", brand: "Intel", name: "Core i9-14900KF", generation: 14000, socket: "1700", tdp: 125, rank: 9.0, score: 9.5, price: 509 },
    { id: "cpu-intel-u5-235", brand: "Intel", name: "Core Ultra 5 235", generation: 20000, socket: "1851", tdp: 65, rank: 7.4, score: 8.8, price: 259 },
    { id: "cpu-amd-r7-5700", brand: "AMD", name: "Ryzen 7 5700", generation: 5000, socket: "AM4", tdp: 65, rank: 6.2, score: 7.8, price: 189 },
    { id: "cpu-amd-r9-3900x", brand: "AMD", name: "Ryzen 9 3900X", generation: 3000, socket: "AM4", tdp: 105, rank: 6.8, score: 8.0, price: 219 },
    { id: "cpu-intel-i5-12600kf", brand: "Intel", name: "Core i5-12600KF", generation: 12000, socket: "1700", tdp: 125, rank: 6.6, score: 8.3, price: 219 },
    { id: "cpu-intel-i7-13700kf", brand: "Intel", name: "Core i7-13700KF", generation: 13000, socket: "1700", tdp: 125, rank: 8.1, score: 9.2, price: 399 },
    { id: "cpu-intel-u7-265f", brand: "Intel", name: "Core Ultra 7 265F", generation: 20000, socket: "1851", tdp: 65, rank: 8.2, score: 9.2, price: 349 }
  ],
  mobo: [
    { id: "mb-asus-b550", brand: "ASUS", name: "TUF B550-PLUS", generation: 550, socket: "AM4", ramType: "DDR4", tier: 2, score: 8.1, price: 129 },
    { id: "mb-msi-b550", brand: "MSI", name: "B550 Tomahawk", generation: 550, socket: "AM4", ramType: "DDR4", tier: 2, score: 8.5, price: 159 },
    { id: "mb-giga-x570s", brand: "Gigabyte", name: "X570S Aorus Elite", generation: 570, socket: "AM4", ramType: "DDR4", tier: 3, score: 8.8, price: 219 },
    { id: "mb-msi-b650m", brand: "MSI", name: "B650M Gaming Plus WiFi", generation: 650, socket: "AM5", ramType: "DDR5", tier: 2, score: 8.2, price: 179 },
    { id: "mb-giga-b650", brand: "Gigabyte", name: "B650 Aorus Elite AX", generation: 650, socket: "AM5", ramType: "DDR5", tier: 2, score: 8.5, price: 209 },
    { id: "mb-asus-b650e", brand: "ASUS", name: "ROG Strix B650E-F", generation: 650, socket: "AM5", ramType: "DDR5", tier: 3, score: 8.9, price: 279 },
    { id: "mb-msi-x670e", brand: "MSI", name: "X670E Carbon WiFi", generation: 670, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.2, price: 399 },
    { id: "mb-asrock-x870", brand: "ASRock", name: "X870 Steel Legend", generation: 870, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.0, price: 349 },
    { id: "mb-giga-x870e", brand: "Gigabyte", name: "X870E Aorus Pro", generation: 870, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.3, price: 439 },
    { id: "mb-asus-b760-ddr4", brand: "ASUS", name: "Prime B760-PLUS D4", generation: 760, socket: "1700", ramType: "DDR4", tier: 2, score: 7.9, price: 139 },
    { id: "mb-msi-b760-ddr5", brand: "MSI", name: "B760 Tomahawk WiFi DDR5", generation: 760, socket: "1700", ramType: "DDR5", tier: 2, score: 8.6, price: 219 },
    { id: "mb-giga-z790", brand: "Gigabyte", name: "Z790 Aorus Elite X", generation: 790, socket: "1700", ramType: "DDR5", tier: 3, score: 9.0, price: 299 },
    { id: "mb-asus-z790", brand: "ASUS", name: "ROG Strix Z790-E", generation: 790, socket: "1700", ramType: "DDR5", tier: 4, score: 9.3, price: 429 },
    { id: "mb-msi-z890", brand: "MSI", name: "Z890 Gaming Plus WiFi", generation: 890, socket: "1851", ramType: "DDR5", tier: 3, score: 8.8, price: 289 },
    { id: "mb-asus-z890", brand: "ASUS", name: "ROG Strix Z890-F", generation: 890, socket: "1851", ramType: "DDR5", tier: 4, score: 9.4, price: 459 },
    { id: "mb-giga-z890e", brand: "Gigabyte", name: "Z890E Aorus Master", generation: 890, socket: "1851", ramType: "DDR5", tier: 4, score: 9.6, price: 549 },
    { id: "mb-asrock-z890", brand: "ASRock", name: "Z890 Pro RS", generation: 890, socket: "1851", ramType: "DDR5", tier: 3, score: 8.6, price: 249 },
    { id: "mb-msi-b860", brand: "MSI", name: "B860M Mortar WiFi", generation: 860, socket: "1851", ramType: "DDR5", tier: 2, score: 8.4, price: 219 },
    { id: "mb-asrock-b650m", brand: "ASRock", name: "B650M Pro RS", generation: 650, socket: "AM5", ramType: "DDR5", tier: 2, score: 8.0, price: 159 },
    { id: "mb-asus-x670e", brand: "ASUS", name: "ROG Crosshair X670E Hero", generation: 670, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.5, price: 589 },
    { id: "mb-giga-b760m", brand: "Gigabyte", name: "B760M DS3H DDR4", generation: 760, socket: "1700", ramType: "DDR4", tier: 1, score: 7.4, price: 119 },
    { id: "mb-msi-z790-godlike", brand: "MSI", name: "MEG Z790 GODLIKE", generation: 790, socket: "1700", ramType: "DDR5", tier: 4, score: 9.8, price: 999 },
    { id: "mb-asrock-z790", brand: "ASRock", name: "Z790 Steel Legend WiFi", generation: 790, socket: "1700", ramType: "DDR5", tier: 3, score: 8.8, price: 269 },
    { id: "mb-asrock-b550m", brand: "ASRock", name: "B550M Pro4", generation: 550, socket: "AM4", ramType: "DDR4", tier: 1, score: 7.3, price: 99 },
    { id: "mb-asus-x570", brand: "ASUS", name: "TUF X570-PLUS WiFi", generation: 570, socket: "AM4", ramType: "DDR4", tier: 3, score: 8.7, price: 239 },
    { id: "mb-giga-x670e", brand: "Gigabyte", name: "X670E Aorus Master", generation: 670, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.4, price: 499 },
    { id: "mb-asrock-b860", brand: "ASRock", name: "B860 Pro RS WiFi", generation: 860, socket: "1851", ramType: "DDR5", tier: 2, score: 8.3, price: 209 },
    { id: "mb-giga-z790-ddr4", brand: "Gigabyte", name: "Z790 UD AX DDR4", generation: 790, socket: "1700", ramType: "DDR4", tier: 3, score: 8.2, price: 249 },
    { id: "mb-biostar-b550", brand: "Biostar", name: "B550M Silver", generation: 550, socket: "AM4", ramType: "DDR4", tier: 1, score: 7.0, price: 89 },
    { id: "mb-msi-b650e", brand: "MSI", name: "MPG B650E Carbon WiFi", generation: 650, socket: "AM5", ramType: "DDR5", tier: 3, score: 9.0, price: 349 },
    { id: "mb-asus-x870e", brand: "ASUS", name: "ROG Crosshair X870E Hero", generation: 870, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.7, price: 699 },
    { id: "mb-giga-b860m", brand: "Gigabyte", name: "B860M Aorus Elite", generation: 860, socket: "1851", ramType: "DDR5", tier: 2, score: 8.5, price: 229 },
    { id: "mb-asus-z790-apex", brand: "ASUS", name: "ROG Maximus Z790 Apex", generation: 790, socket: "1700", ramType: "DDR5", tier: 4, score: 9.7, price: 749 },
    { id: "mb-asus-b650m-plus", brand: "ASUS", name: "TUF B650M-PLUS WiFi", generation: 650, socket: "AM5", ramType: "DDR5", tier: 2, score: 8.3, price: 199 },
    { id: "mb-msi-b650-tom", brand: "MSI", name: "MAG B650 Tomahawk WiFi", generation: 650, socket: "AM5", ramType: "DDR5", tier: 3, score: 8.8, price: 249 },
    { id: "mb-asrock-x870e-taichi", brand: "ASRock", name: "X870E Taichi", generation: 870, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.8, price: 769 },
    { id: "mb-asus-b860-a", brand: "ASUS", name: "ROG Strix B860-A Gaming WiFi", generation: 860, socket: "1851", ramType: "DDR5", tier: 3, score: 8.9, price: 289 },
    { id: "mb-msi-z890-ace", brand: "MSI", name: "MEG Z890 ACE", generation: 890, socket: "1851", ramType: "DDR5", tier: 4, score: 9.5, price: 629 },
    { id: "mb-giga-b650m-elite", brand: "Gigabyte", name: "B650M Aorus Elite AX", generation: 650, socket: "AM5", ramType: "DDR5", tier: 2, score: 8.4, price: 199 },
    { id: "mb-msi-x870e-tom", brand: "MSI", name: "MPG X870E Tomahawk WiFi", generation: 870, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.2, price: 429 },
    { id: "mb-asus-b760m-d4", brand: "ASUS", name: "TUF B760M-PLUS D4", generation: 760, socket: "1700", ramType: "DDR4", tier: 2, score: 8.0, price: 159 },
    { id: "mb-giga-z890-elite", brand: "Gigabyte", name: "Z890 Aorus Elite X", generation: 890, socket: "1851", ramType: "DDR5", tier: 3, score: 9.0, price: 339 },
    { id: "mb-giga-b550-aorus-v2", brand: "Gigabyte", name: "B550 Aorus Elite V2", generation: 550, socket: "AM4", ramType: "DDR4", tier: 2, score: 8.0, price: 149 },
    { id: "mb-msi-b550-provdh", brand: "MSI", name: "B550M PRO-VDH WiFi", generation: 550, socket: "AM4", ramType: "DDR4", tier: 1, score: 7.5, price: 119 },
    { id: "mb-asrock-b550-steel", brand: "ASRock", name: "B550 Steel Legend", generation: 550, socket: "AM4", ramType: "DDR4", tier: 2, score: 8.1, price: 149 },
    { id: "mb-asus-prime-x670p", brand: "ASUS", name: "Prime X670-P WiFi", generation: 670, socket: "AM5", ramType: "DDR5", tier: 3, score: 8.9, price: 299 },
    { id: "mb-msi-pro-b650s", brand: "MSI", name: "PRO B650-S WiFi", generation: 650, socket: "AM5", ramType: "DDR5", tier: 2, score: 8.2, price: 189 },
    { id: "mb-giga-b650e-elite", brand: "Gigabyte", name: "B650E Aorus Elite X AX", generation: 650, socket: "AM5", ramType: "DDR5", tier: 3, score: 8.9, price: 269 },
    { id: "mb-nzxt-n7-b650e", brand: "NZXT", name: "N7 B650E", generation: 650, socket: "AM5", ramType: "DDR5", tier: 3, score: 8.7, price: 299 },
    { id: "mb-msi-pro-z790p", brand: "MSI", name: "PRO Z790-P WiFi", generation: 790, socket: "1700", ramType: "DDR5", tier: 3, score: 8.8, price: 249 },
    { id: "mb-asus-proart-z790", brand: "ASUS", name: "ProArt Z790-CREATOR WiFi", generation: 790, socket: "1700", ramType: "DDR5", tier: 4, score: 9.4, price: 529 },
    { id: "mb-biostar-z790a", brand: "Biostar", name: "Z790A-Silver", generation: 790, socket: "1700", ramType: "DDR5", tier: 2, score: 8.1, price: 229 },
    { id: "mb-colorful-b760m", brand: "Colorful", name: "CVN B760M Frozen WiFi", generation: 760, socket: "1700", ramType: "DDR5", tier: 2, score: 8.0, price: 189 },
    { id: "mb-asus-prime-b550m-a", brand: "ASUS", name: "Prime B550M-A WiFi II", generation: 550, socket: "AM4", ramType: "DDR4", tier: 1, score: 7.6, price: 129 },
    { id: "mb-msi-pro-b760m-a-d4", brand: "MSI", name: "PRO B760M-A WiFi DDR4", generation: 760, socket: "1700", ramType: "DDR4", tier: 2, score: 8.1, price: 169 },
    { id: "mb-asrock-b760m-riptide", brand: "ASRock", name: "B760M PG Riptide", generation: 760, socket: "1700", ramType: "DDR5", tier: 2, score: 8.2, price: 189 },
    { id: "mb-giga-x870e-master", brand: "Gigabyte", name: "X870E Aorus Master", generation: 870, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.7, price: 629 }
  ],
  ram: [
    { id: "ram-corsair-16-ddr4", brand: "Corsair", name: "Vengeance 16 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 16, score: 7.0, price: 42 },
    { id: "ram-corsair-32-ddr4", brand: "Corsair", name: "Vengeance 32 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 32, score: 7.8, price: 79 },
    { id: "ram-gskill-64-ddr4", brand: "G.Skill", name: "Ripjaws 64 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 64, score: 8.2, price: 149 },
    { id: "ram-corsair-16-ddr5", brand: "Corsair", name: "Vengeance 16 Go DDR5-5600", generation: 5600, type: "DDR5", gb: 16, score: 7.5, price: 64 },
    { id: "ram-corsair-32-ddr5-6000", brand: "Corsair", name: "Vengeance 32 Go DDR5-6000 CL30", generation: 6000, type: "DDR5", gb: 32, score: 9.1, price: 116.44 },
    { id: "ram-gskill-32-ddr5", brand: "G.Skill", name: "Trident Z5 32 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 32, score: 9.2, price: 149 },
    { id: "ram-kingston-32-ddr5", brand: "Kingston", name: "Fury Beast 32 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 32, score: 8.8, price: 109 },
    { id: "ram-corsair-48-ddr5", brand: "Corsair", name: "Vengeance 48 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 48, score: 9.0, price: 169 },
    { id: "ram-kingston-64-ddr5", brand: "Kingston", name: "Fury Renegade 64 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 64, score: 9.4, price: 229 },
    { id: "ram-gskill-64-ddr5", brand: "G.Skill", name: "Trident Z5 64 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 64, score: 9.3, price: 219 },
    { id: "ram-corsair-96-ddr5", brand: "Corsair", name: "Vengeance 96 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 96, score: 9.6, price: 329 },
    { id: "ram-gskill-96-ddr5", brand: "G.Skill", name: "Trident Z5 96 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 96, score: 9.7, price: 399 },
    { id: "ram-team-32-ddr5", brand: "TeamGroup", name: "T-Force Delta RGB 32 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 32, score: 8.9, price: 119 },
    { id: "ram-team-64-ddr5", brand: "TeamGroup", name: "T-Force Delta RGB 64 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 64, score: 9.5, price: 279 },
    { id: "ram-kingston-16-ddr4", brand: "Kingston", name: "Fury Beast 16 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 16, score: 6.9, price: 39 },
    { id: "ram-crucial-32-ddr4", brand: "Crucial", name: "Pro 32 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 32, score: 7.4, price: 69 },
    { id: "ram-corsair-64-ddr4", brand: "Corsair", name: "Vengeance 64 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 64, score: 8.4, price: 159 },
    { id: "ram-kingston-48-ddr5", brand: "Kingston", name: "Fury Beast 48 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 48, score: 9.0, price: 179 },
    { id: "ram-gskill-48-ddr5", brand: "G.Skill", name: "Trident Z5 Neo 48 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 48, score: 9.3, price: 209 },
    { id: "ram-team-96-ddr5", brand: "TeamGroup", name: "T-Force Xtreem 96 Go DDR5-7200", generation: 7200, type: "DDR5", gb: 96, score: 9.8, price: 469 },
    { id: "ram-adata-32-ddr5", brand: "ADATA", name: "XPG Lancer 32 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 32, score: 8.8, price: 115 },
    { id: "ram-adata-64-ddr5", brand: "ADATA", name: "XPG Lancer 64 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 64, score: 9.4, price: 269 },
    { id: "ram-patriot-32-ddr4", brand: "Patriot", name: "Viper Steel 32 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 32, score: 7.6, price: 75 },
    { id: "ram-crucial-64-ddr5", brand: "Crucial", name: "Pro 64 Go DDR5-5600", generation: 5600, type: "DDR5", gb: 64, score: 8.9, price: 219 },
    { id: "ram-crucial-32-ddr5", brand: "Crucial", name: "Pro 32 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 32, score: 8.9, price: 119 },
    { id: "ram-team-32-ddr4", brand: "TeamGroup", name: "T-Create Expert 32 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 32, score: 7.8, price: 72 },
    { id: "ram-klevv-32-ddr5", brand: "KLEVV", name: "CRAS V RGB 32 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 32, score: 9.1, price: 139 },
    { id: "ram-patriot-64-ddr5", brand: "Patriot", name: "Viper Xtreme 64 Go DDR5-7000", generation: 7000, type: "DDR5", gb: 64, score: 9.6, price: 329 },
    { id: "ram-lexar-32-ddr5", brand: "Lexar", name: "Ares RGB 32 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 32, score: 9.0, price: 129 },
    { id: "ram-lexar-64-ddr5", brand: "Lexar", name: "Ares RGB 64 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 64, score: 9.4, price: 259 },
    { id: "ram-crucial-16-ddr4", brand: "Crucial", name: "Pro 16 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 16, score: 6.8, price: 38 },
    { id: "ram-corsair-dom-64-ddr5", brand: "Corsair", name: "Dominator Titanium 64 Go DDR5-6600", generation: 6600, type: "DDR5", gb: 64, score: 9.6, price: 359 },
    { id: "ram-gskill-32-ddr5-7200", brand: "G.Skill", name: "Trident Z5 32 Go DDR5-7200", generation: 7200, type: "DDR5", gb: 32, score: 9.5, price: 219 },
    { id: "ram-kingston-96-ddr5-6800", brand: "Kingston", name: "Fury Renegade 96 Go DDR5-6800", generation: 6800, type: "DDR5", gb: 96, score: 9.8, price: 489 },
    { id: "ram-team-64-ddr5-6000", brand: "TeamGroup", name: "T-Create Expert 64 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 64, score: 9.2, price: 249 },
    { id: "ram-patriot-32-ddr5-7600", brand: "Patriot", name: "Viper Xtreme 5 32 Go DDR5-7600", generation: 7600, type: "DDR5", gb: 32, score: 9.6, price: 239 },
    { id: "ram-mushkin-32-ddr5", brand: "Mushkin", name: "Redline Lumina 32 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 32, score: 9.1, price: 169 },
    { id: "ram-pny-32-ddr5", brand: "PNY", name: "XLR8 Mako 32 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 32, score: 8.9, price: 129 },
    { id: "ram-siliconpower-32-ddr4", brand: "Silicon Power", name: "XPOWER Zenith 32 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 32, score: 7.7, price: 74 },
    { id: "ram-adata-96-ddr5", brand: "ADATA", name: "XPG Lancer 96 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 96, score: 9.7, price: 439 },
    { id: "ram-crucial-96-ddr5", brand: "Crucial", name: "Pro 96 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 96, score: 9.6, price: 419 },
    { id: "ram-gskill-flarex5-32", brand: "G.Skill", name: "Flare X5 32 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 32, score: 9.0, price: 129 },
    { id: "ram-corsair-32-ddr5-5600", brand: "Corsair", name: "Vengeance 32 Go DDR5-5600", generation: 5600, type: "DDR5", gb: 32, score: 8.6, price: 109 },
    { id: "ram-kingston-64-ddr4-3600", brand: "Kingston", name: "Fury Beast 64 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 64, score: 8.3, price: 149 },
    { id: "ram-team-16-ddr4", brand: "TeamGroup", name: "T-Force Vulcan Z 16 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 16, score: 6.9, price: 42 }
  ],
  gpu: [
    { id: "gpu-nv-3050", brand: "NVIDIA", name: "GeForce RTX 3050 8 Go", generation: 3000, vram: 8, tdp: 130, length: 242, rank: 5.0, score: 6.9, price: 219 },
    { id: "gpu-nv-3060", brand: "NVIDIA", name: "GeForce RTX 3060 12 Go", generation: 3000, vram: 12, tdp: 170, length: 242, rank: 5.8, score: 7.5, price: 299 },
    { id: "gpu-nv-3070", brand: "NVIDIA", name: "GeForce RTX 3070 8 Go", generation: 3000, vram: 8, tdp: 220, length: 295, rank: 7.0, score: 8.3, price: 379 },
    { id: "gpu-nv-3080", brand: "NVIDIA", name: "GeForce RTX 3080 10 Go", generation: 3000, vram: 10, tdp: 320, length: 320, rank: 8.0, score: 8.9, price: 549 },
    { id: "gpu-nv-3090", brand: "NVIDIA", name: "GeForce RTX 3090 24 Go", generation: 3000, vram: 24, tdp: 350, length: 336, rank: 8.6, score: 9.2, price: 799 },
    { id: "gpu-nv-4060", brand: "NVIDIA", name: "GeForce RTX 4060 8 Go", generation: 4000, vram: 8, tdp: 115, length: 245, rank: 6.4, score: 8.1, price: 330 },
    { id: "gpu-nv-4060ti", brand: "NVIDIA", name: "GeForce RTX 4060 Ti 16 Go", generation: 4000, vram: 16, tdp: 165, length: 270, rank: 7.0, score: 8.5, price: 459 },
    { id: "gpu-nv-4070", brand: "NVIDIA", name: "GeForce RTX 4070 12 Go", generation: 4000, vram: 12, tdp: 200, length: 305, rank: 7.8, score: 9.0, price: 609 },
    { id: "gpu-nv-4070s", brand: "NVIDIA", name: "GeForce RTX 4070 SUPER 12 Go", generation: 4000, vram: 12, tdp: 220, length: 310, rank: 8.2, score: 9.2, price: 679 },
    { id: "gpu-nv-4070tis", brand: "NVIDIA", name: "GeForce RTX 4070 Ti SUPER 16 Go", generation: 4000, vram: 16, tdp: 285, length: 335, rank: 8.7, score: 9.4, price: 848 },
    { id: "gpu-nv-4080s", brand: "NVIDIA", name: "GeForce RTX 4080 SUPER 16 Go", generation: 4000, vram: 16, tdp: 320, length: 342, rank: 9.1, score: 9.6, price: 1199 },
    { id: "gpu-nv-4090", brand: "NVIDIA", name: "GeForce RTX 4090 24 Go", generation: 4000, vram: 24, tdp: 450, length: 357, rank: 9.6, score: 9.9, price: 1999 },
    { id: "gpu-nv-5060ti", brand: "NVIDIA", name: "GeForce RTX 5060 Ti 16 Go", generation: 5000, vram: 16, tdp: 180, length: 285, rank: 7.4, score: 8.9, price: 505.37 },
    { id: "gpu-nv-5070", brand: "NVIDIA", name: "GeForce RTX 5070 12 Go", generation: 5000, vram: 12, tdp: 250, length: 305, rank: 8.8, score: 9.4, price: 711.99 },
    { id: "gpu-nv-5070ti", brand: "NVIDIA", name: "GeForce RTX 5070 Ti 16 Go", generation: 5000, vram: 16, tdp: 300, length: 330, rank: 9.2, score: 9.6, price: 935 },
    { id: "gpu-nv-5080", brand: "NVIDIA", name: "GeForce RTX 5080 16 Go", generation: 5000, vram: 16, tdp: 360, length: 340, rank: 9.5, score: 9.8, price: 1539 },
    { id: "gpu-nv-5090", brand: "NVIDIA", name: "GeForce RTX 5090 32 Go", generation: 5000, vram: 32, tdp: 575, length: 357, rank: 10.0, score: 10.0, price: 3499 },
    { id: "gpu-amd-rx7600", brand: "AMD", name: "Radeon RX 7600 8 Go", generation: 7000, vram: 8, tdp: 165, length: 267, rank: 6.2, score: 7.9, price: 289 },
    { id: "gpu-amd-rx6800", brand: "AMD", name: "Radeon RX 6800 16 Go", generation: 6000, vram: 16, tdp: 250, length: 305, rank: 7.8, score: 8.7, price: 439 },
    { id: "gpu-amd-rx6950xt", brand: "AMD", name: "Radeon RX 6950 XT 16 Go", generation: 6000, vram: 16, tdp: 335, length: 330, rank: 8.5, score: 9.0, price: 649 },
    { id: "gpu-amd-rx7700xt", brand: "AMD", name: "Radeon RX 7700 XT 12 Go", generation: 7000, vram: 12, tdp: 245, length: 302, rank: 7.4, score: 8.8, price: 479 },
    { id: "gpu-amd-rx7800xt", brand: "AMD", name: "Radeon RX 7800 XT 16 Go", generation: 7000, vram: 16, tdp: 263, length: 322, rank: 8.0, score: 9.1, price: 599 },
    { id: "gpu-amd-rx7900gre", brand: "AMD", name: "Radeon RX 7900 GRE 16 Go", generation: 7000, vram: 16, tdp: 260, length: 320, rank: 8.4, score: 9.3, price: 649 },
    { id: "gpu-amd-rx7900xt", brand: "AMD", name: "Radeon RX 7900 XT 20 Go", generation: 7000, vram: 20, tdp: 315, length: 335, rank: 8.9, score: 9.5, price: 899 },
    { id: "gpu-amd-rx7900xtx", brand: "AMD", name: "Radeon RX 7900 XTX 24 Go", generation: 7000, vram: 24, tdp: 355, length: 340, rank: 9.3, score: 9.7, price: 1119 },
    { id: "gpu-amd-rx9060xt", brand: "AMD", name: "Radeon RX 9060 XT 16 Go", generation: 9000, vram: 16, tdp: 190, length: 290, rank: 7.8, score: 9.0, price: 379 },
    { id: "gpu-amd-rx9070", brand: "AMD", name: "Radeon RX 9070 16 Go", generation: 9000, vram: 16, tdp: 265, length: 315, rank: 8.7, score: 9.4, price: 679 },
    { id: "gpu-amd-rx9070xt", brand: "AMD", name: "Radeon RX 9070 XT 16 Go", generation: 9000, vram: 16, tdp: 304, length: 330, rank: 9.1, score: 9.6, price: 769 },
    { id: "gpu-intel-b580", brand: "Intel", name: "Arc B580 12 Go", generation: 500, vram: 12, tdp: 190, length: 285, rank: 6.6, score: 8.3, price: 289 },
    { id: "gpu-intel-a770", brand: "Intel", name: "Arc A770 16 Go", generation: 700, vram: 16, tdp: 225, length: 280, rank: 6.9, score: 8.4, price: 329 },
    { id: "gpu-nv-4050", brand: "NVIDIA", name: "GeForce RTX 4050 8 Go", generation: 4000, vram: 8, tdp: 100, length: 232, rank: 5.9, score: 7.8, price: 269 },
    { id: "gpu-nv-5060", brand: "NVIDIA", name: "GeForce RTX 5060 8 Go", generation: 5000, vram: 8, tdp: 150, length: 260, rank: 6.8, score: 8.6, price: 389 },
    { id: "gpu-amd-rx7700", brand: "AMD", name: "Radeon RX 7700 12 Go", generation: 7000, vram: 12, tdp: 230, length: 300, rank: 7.1, score: 8.6, price: 449 },
    { id: "gpu-amd-rx7600xt", brand: "AMD", name: "Radeon RX 7600 XT 16 Go", generation: 7000, vram: 16, tdp: 190, length: 278, rank: 6.9, score: 8.3, price: 369 },
    { id: "gpu-amd-rx7800", brand: "AMD", name: "Radeon RX 7800 16 Go", generation: 7000, vram: 16, tdp: 245, length: 315, rank: 7.7, score: 9.0, price: 549 },
    { id: "gpu-intel-b770", brand: "Intel", name: "Arc B770 16 Go", generation: 700, vram: 16, tdp: 240, length: 295, rank: 7.2, score: 8.8, price: 399 },
    { id: "gpu-nv-4060ti-8", brand: "NVIDIA", name: "GeForce RTX 4060 Ti 8 Go", generation: 4000, vram: 8, tdp: 160, length: 265, rank: 6.8, score: 8.3, price: 419 },
    { id: "gpu-nv-4070ti", brand: "NVIDIA", name: "GeForce RTX 4070 Ti 12 Go", generation: 4000, vram: 12, tdp: 285, length: 330, rank: 8.5, score: 9.3, price: 769 },
    { id: "gpu-amd-rx6750xt", brand: "AMD", name: "Radeon RX 6750 XT 12 Go", generation: 6000, vram: 12, tdp: 250, length: 320, rank: 7.0, score: 8.3, price: 379 },
    { id: "gpu-amd-rx6650xt", brand: "AMD", name: "Radeon RX 6650 XT 8 Go", generation: 6000, vram: 8, tdp: 180, length: 280, rank: 6.1, score: 7.7, price: 259 },
    { id: "gpu-intel-a750", brand: "Intel", name: "Arc A750 8 Go", generation: 700, vram: 8, tdp: 225, length: 267, rank: 6.2, score: 7.9, price: 249 },
    { id: "gpu-nv-3050-6", brand: "NVIDIA", name: "GeForce RTX 3050 6 Go", generation: 3000, vram: 6, tdp: 90, length: 210, rank: 4.8, score: 6.4, price: 199 },
    { id: "gpu-nv-3080ti", brand: "NVIDIA", name: "GeForce RTX 3080 Ti 12 Go", generation: 3000, vram: 12, tdp: 350, length: 335, rank: 8.4, score: 9.1, price: 799 },
    { id: "gpu-nv-5060-16", brand: "NVIDIA", name: "GeForce RTX 5060 16 Go", generation: 5000, vram: 16, tdp: 180, length: 285, rank: 7.2, score: 8.8, price: 499 },
    { id: "gpu-amd-rx7900", brand: "AMD", name: "Radeon RX 7900 16 Go", generation: 7000, vram: 16, tdp: 285, length: 325, rank: 8.3, score: 9.2, price: 689 },
    { id: "gpu-intel-b750", brand: "Intel", name: "Arc B750 12 Go", generation: 700, vram: 12, tdp: 210, length: 285, rank: 6.8, score: 8.4, price: 339 },
    { id: "gpu-amd-rx7600-dual", brand: "AMD", name: "Radeon RX 7600 8 Go", generation: 7000, vram: 8, tdp: 165, length: 255, rank: 6.3, score: 8.0, price: 279 },
    { id: "gpu-amd-rx7900gre-dual", brand: "AMD", name: "Radeon RX 7900 GRE 16 Go", generation: 7000, vram: 16, tdp: 260, length: 320, rank: 8.1, score: 9.1, price: 599 },
    { id: "gpu-nv-5080-slim", brand: "NVIDIA", name: "GeForce RTX 5080 16 Go", generation: 5000, vram: 16, tdp: 360, length: 345, rank: 9.3, score: 9.8, price: 1399 },
    { id: "gpu-nv-5050", brand: "NVIDIA", name: "GeForce RTX 5050 8 Go", generation: 5000, vram: 8, tdp: 135, length: 245, rank: 6.1, score: 8.0, price: 299 },
    { id: "gpu-intel-b570", brand: "Intel", name: "Arc B570 10 Go", generation: 500, vram: 10, tdp: 175, length: 270, rank: 6.2, score: 8.0, price: 259 },
    { id: "gpu-nv-5090d", brand: "NVIDIA", name: "GeForce RTX 5090D 24 Go", generation: 5000, vram: 24, tdp: 520, length: 350, rank: 9.8, score: 9.9, price: 2899 },
    { id: "gpu-amd-rx7800gre", brand: "AMD", name: "Radeon RX 7800 GRE 16 Go", generation: 7000, vram: 16, tdp: 250, length: 312, rank: 7.9, score: 9.0, price: 569 },
    { id: "gpu-intel-a780", brand: "Intel", name: "Arc A780 16 Go", generation: 700, vram: 16, tdp: 245, length: 295, rank: 7.3, score: 8.9, price: 429 },
    { id: "gpu-nv-4070e", brand: "NVIDIA", name: "GeForce RTX 4070 EVO 12 Go", generation: 4000, vram: 12, tdp: 215, length: 300, rank: 8.0, score: 9.1, price: 629 },
    { id: "gpu-nv-3060ti", brand: "NVIDIA", name: "GeForce RTX 3060 Ti 8 Go", generation: 3000, vram: 8, tdp: 200, length: 285, rank: 6.6, score: 8.0, price: 349 },
    { id: "gpu-nv-3070ti", brand: "NVIDIA", name: "GeForce RTX 3070 Ti 8 Go", generation: 3000, vram: 8, tdp: 290, length: 320, rank: 7.4, score: 8.6, price: 479 },
    { id: "gpu-nv-4080", brand: "NVIDIA", name: "GeForce RTX 4080 16 Go", generation: 4000, vram: 16, tdp: 320, length: 340, rank: 8.9, score: 9.5, price: 1099 },
    { id: "gpu-nv-5070s", brand: "NVIDIA", name: "GeForce RTX 5070 SUPER 16 Go", generation: 5000, vram: 16, tdp: 280, length: 320, rank: 9.0, score: 9.5, price: 869 },
    { id: "gpu-nv-5080s", brand: "NVIDIA", name: "GeForce RTX 5080 SUPER 24 Go", generation: 5000, vram: 24, tdp: 400, length: 350, rank: 9.7, score: 9.9, price: 1799 },
    { id: "gpu-amd-rx6600", brand: "AMD", name: "Radeon RX 6600 8 Go", generation: 6000, vram: 8, tdp: 132, length: 250, rank: 5.7, score: 7.3, price: 229 },
    { id: "gpu-amd-rx6700xt", brand: "AMD", name: "Radeon RX 6700 XT 12 Go", generation: 6000, vram: 12, tdp: 230, length: 296, rank: 6.9, score: 8.2, price: 339 },
    { id: "gpu-amd-rx6800xt", brand: "AMD", name: "Radeon RX 6800 XT 16 Go", generation: 6000, vram: 16, tdp: 300, length: 320, rank: 8.2, score: 8.9, price: 529 },
    { id: "gpu-amd-rx7900xtx-oc", brand: "AMD", name: "Radeon RX 7900 XTX OC 24 Go", generation: 7000, vram: 24, tdp: 370, length: 345, rank: 9.4, score: 9.7, price: 1199 },
    { id: "gpu-intel-a580", brand: "Intel", name: "Arc A580 8 Go", generation: 700, vram: 8, tdp: 185, length: 265, rank: 5.9, score: 7.6, price: 219 },
    { id: "gpu-intel-b760", brand: "Intel", name: "Arc B760 16 Go", generation: 700, vram: 16, tdp: 235, length: 292, rank: 7.1, score: 8.7, price: 419 },
    { id: "gpu-intel-a380", brand: "Intel", name: "Arc A380 6 Go", generation: 300, vram: 6, tdp: 75, length: 221, rank: 4.9, score: 6.3, price: 169 },
    { id: "gpu-nv-2060", brand: "NVIDIA", name: "GeForce RTX 2060 6 Go", generation: 2000, vram: 6, tdp: 160, length: 229, rank: 5.2, score: 6.9, price: 239 },
    { id: "gpu-amd-rx6750gre", brand: "AMD", name: "Radeon RX 6750 GRE 10 Go", generation: 6000, vram: 10, tdp: 230, length: 300, rank: 6.8, score: 8.1, price: 329 },
    { id: "gpu-amd-rx7700gre", brand: "AMD", name: "Radeon RX 7700 GRE 12 Go", generation: 7000, vram: 12, tdp: 240, length: 305, rank: 7.3, score: 8.7, price: 469 },
    { id: "gpu-nv-5060s", brand: "NVIDIA", name: "GeForce RTX 5060 SUPER 12 Go", generation: 5000, vram: 12, tdp: 175, length: 275, rank: 7.0, score: 8.7, price: 469 }
  ],
  storage: [
    { id: "sto-king-500", brand: "Kingston", name: "NV2 NVMe 500 Go", generation: 4, tb: 0.5, score: 7.0, price: 39 },
    { id: "sto-king-1", brand: "Kingston", name: "NV2 NVMe 1 To", generation: 4, tb: 1, score: 7.5, price: 62 },
    { id: "sto-crucial-p3-1", brand: "Crucial", name: "P3 Plus NVMe 1 To", generation: 4, tb: 1, score: 8.0, price: 69 },
    { id: "sto-wd-sn770-1", brand: "WD", name: "Black SN770 1 To", generation: 4, tb: 1, score: 8.4, price: 79 },
    { id: "sto-sam-990evo-1", brand: "Samsung", name: "990 EVO 1 To", generation: 4, tb: 1, score: 8.6, price: 89 },
    { id: "sto-crucial-p3-2", brand: "Crucial", name: "P3 Plus NVMe 2 To", generation: 4, tb: 2, score: 8.2, price: 119 },
    { id: "sto-wd-sn850x-2", brand: "WD", name: "Black SN850X 2 To", generation: 4, tb: 2, score: 9.2, price: 149.90 },
    { id: "sto-sam-990pro-2", brand: "Samsung", name: "990 PRO 2 To", generation: 4, tb: 2, score: 9.4, price: 169.90 },
    { id: "sto-sam-990pro-4", brand: "Samsung", name: "990 PRO 4 To", generation: 4, tb: 4, score: 9.5, price: 309 },
    { id: "sto-crucial-t700-2", brand: "Crucial", name: "T700 PCIe 5.0 2 To", generation: 5, tb: 2, score: 9.6, price: 299 },
    { id: "sto-seagate-8", brand: "Seagate", name: "HDD Barracuda 8 To", generation: 7200, tb: 8, score: 6.0, price: 159 },
    { id: "sto-mix-2plus4", brand: "Atelier", name: "NVMe 2 To + HDD 4 To", generation: 4, tb: 6, score: 8.7, price: 239 },
    { id: "sto-mix-4plus8", brand: "Atelier", name: "NVMe 4 To + HDD 8 To", generation: 4, tb: 12, score: 9.0, price: 429 },
    { id: "sto-kioxia-2", brand: "Kioxia", name: "Exceria Pro NVMe 2 To", generation: 4, tb: 2, score: 8.8, price: 139 },
    { id: "sto-sam-990pro-1", brand: "Samsung", name: "990 PRO 1 To", generation: 4, tb: 1, score: 9.1, price: 109 },
    { id: "sto-lexar-gen5-2", brand: "Lexar", name: "NM1090 PCIe 5.0 2 To", generation: 5, tb: 2, score: 9.5, price: 259 },
    { id: "sto-mix-1plus2", brand: "Atelier", name: "NVMe 1 To + SSD SATA 2 To", generation: 4, tb: 3, score: 8.3, price: 189 },
    { id: "sto-seagate-2", brand: "Seagate", name: "FireCuda 530 2 To", generation: 4, tb: 2, score: 9.3, price: 189 },
    { id: "sto-wd-sn850x-4", brand: "WD", name: "Black SN850X 4 To", generation: 4, tb: 4, score: 9.5, price: 319 },
    { id: "sto-sabrent-rocket5-2", brand: "Sabrent", name: "Rocket 5 PCIe 5.0 2 To", generation: 5, tb: 2, score: 9.7, price: 349 },
    { id: "sto-sata-ssd-4", brand: "Crucial", name: "MX500 SATA 4 To", generation: 560, tb: 4, score: 7.2, price: 229 },
    { id: "sto-solidigm-p44-2", brand: "Solidigm", name: "P44 Pro 2 To", generation: 4, tb: 2, score: 9.0, price: 159 },
    { id: "sto-adata-s70-2", brand: "ADATA", name: "XPG Gammix S70 Blade 2 To", generation: 4, tb: 2, score: 8.9, price: 149 },
    { id: "sto-king-kc3000-2", brand: "Kingston", name: "KC3000 2 To", generation: 4, tb: 2, score: 9.1, price: 159 },
    { id: "sto-samsung-9100pro-2", brand: "Samsung", name: "9100 PRO PCIe 5.0 2 To", generation: 5, tb: 2, score: 9.8, price: 389 },
    { id: "sto-wd-sn580-1", brand: "WD", name: "Blue SN580 1 To", generation: 4, tb: 1, score: 8.1, price: 69 },
    { id: "sto-sam-980pro-1", brand: "Samsung", name: "980 PRO 1 To", generation: 4, tb: 1, score: 8.8, price: 99 },
    { id: "sto-crucial-t500-2", brand: "Crucial", name: "T500 NVMe 2 To", generation: 4, tb: 2, score: 9.1, price: 169 },
    { id: "sto-seagate-540-2", brand: "Seagate", name: "FireCuda 540 PCIe 5.0 2 To", generation: 5, tb: 2, score: 9.7, price: 329 },
    { id: "sto-wd-sn770-2", brand: "WD", name: "Black SN770 2 To", generation: 4, tb: 2, score: 8.7, price: 129 },
    { id: "sto-corsair-mp700-2", brand: "Corsair", name: "MP700 Elite PCIe 5.0 2 To", generation: 5, tb: 2, score: 9.6, price: 299 },
    { id: "sto-sabrent-rocket4-4", brand: "Sabrent", name: "Rocket 4 Plus 4 To", generation: 4, tb: 4, score: 9.2, price: 319 },
    { id: "sto-lexar-nm790-4", brand: "Lexar", name: "NM790 4 To", generation: 4, tb: 4, score: 9.1, price: 269 },
    { id: "sto-wd-sn850x-1", brand: "WD", name: "Black SN850X 1 To", generation: 4, tb: 1, score: 9.0, price: 99 },
    { id: "sto-crucial-t500-1", brand: "Crucial", name: "T500 NVMe 1 To", generation: 4, tb: 1, score: 8.9, price: 99 },
    { id: "sto-king-kc3000-1", brand: "Kingston", name: "KC3000 1 To", generation: 4, tb: 1, score: 8.8, price: 95 },
    { id: "sto-solidigm-p41-2", brand: "Solidigm", name: "P41 Plus 2 To", generation: 4, tb: 2, score: 8.5, price: 129 },
    { id: "sto-sabrent-q4-4", brand: "Sabrent", name: "Rocket Q4 NVMe 4 To", generation: 4, tb: 4, score: 8.8, price: 279 },
    { id: "sto-seagate-12", brand: "Seagate", name: "IronWolf 12 To", generation: 7200, tb: 12, score: 6.4, price: 269 },
    { id: "sto-toshiba-n300-8", brand: "Toshiba", name: "N300 8 To", generation: 7200, tb: 8, score: 6.1, price: 179 },
    { id: "sto-samsung-870-4", brand: "Samsung", name: "870 EVO SATA 4 To", generation: 560, tb: 4, score: 7.6, price: 249 },
    { id: "sto-corsair-mp700-4", brand: "Corsair", name: "MP700 Elite PCIe 5.0 4 To", generation: 5, tb: 4, score: 9.8, price: 519 },
    { id: "sto-atelier-2plus8", brand: "Atelier", name: "NVMe 2 To + HDD 8 To", generation: 4, tb: 10, score: 8.8, price: 319 },
    { id: "sto-king-nv2-2", brand: "Kingston", name: "NV2 NVMe 2 To", generation: 4, tb: 2, score: 8.1, price: 109 },
    { id: "sto-sam-990evo-2", brand: "Samsung", name: "990 EVO 2 To", generation: 4, tb: 2, score: 8.9, price: 139 },
    { id: "sto-crucial-p3-4", brand: "Crucial", name: "P3 Plus NVMe 4 To", generation: 4, tb: 4, score: 8.6, price: 239 },
    { id: "sto-wd-sn580-2", brand: "WD", name: "Blue SN580 2 To", generation: 4, tb: 2, score: 8.4, price: 119 }
  ],
  psu: [
    { id: "psu-cx550", brand: "Corsair", name: "CX550 Bronze", generation: 550, watts: 550, score: 6.9, price: 69 },
    { id: "psu-cx650", brand: "Corsair", name: "CX650 Bronze", generation: 650, watts: 650, score: 7.2, price: 79 },
    { id: "psu-rm650e", brand: "Corsair", name: "RM650e Gold", generation: 650, watts: 650, score: 8.4, price: 109 },
    { id: "psu-rm750e", brand: "Corsair", name: "RM750e Gold", generation: 750, watts: 750, score: 8.6, price: 125 },
    { id: "psu-rm850e", brand: "Corsair", name: "RM850e Gold", generation: 850, watts: 850, score: 8.9, price: 149.99 },
    { id: "psu-rm1000e", brand: "Corsair", name: "RM1000e Gold", generation: 1000, watts: 1000, score: 9.1, price: 189 },
    { id: "psu-seasonic-850", brand: "Seasonic", name: "Focus GX-850", generation: 850, watts: 850, score: 9.1, price: 169 },
    { id: "psu-bequiet-1000", brand: "be quiet!", name: "Straight Power 12 1000W", generation: 1000, watts: 1000, score: 9.3, price: 239 },
    { id: "psu-msi-1200", brand: "MSI", name: "MEG Ai1300P 1200W", generation: 1200, watts: 1200, score: 9.4, price: 319 },
    { id: "psu-corsair-1500", brand: "Corsair", name: "HX1500i Platinum", generation: 1500, watts: 1500, score: 9.7, price: 429 },
    { id: "psu-msi-850", brand: "MSI", name: "MAG A850GL", generation: 850, watts: 850, score: 8.8, price: 139 },
    { id: "psu-bequiet-850", brand: "be quiet!", name: "Pure Power 12 M 850W", generation: 850, watts: 850, score: 8.9, price: 149 },
    { id: "psu-thermaltake-1200", brand: "Thermaltake", name: "Toughpower GF3 1200W", generation: 1200, watts: 1200, score: 9.2, price: 279 },
    { id: "psu-seasonic-1300", brand: "Seasonic", name: "Vertex GX-1300", generation: 1300, watts: 1300, score: 9.5, price: 349 },
    { id: "psu-corsair-750x", brand: "Corsair", name: "RM750x Shift", generation: 750, watts: 750, score: 8.8, price: 159 },
    { id: "psu-asus-1000", brand: "ASUS", name: "ROG Strix Aura 1000W", generation: 1000, watts: 1000, score: 9.2, price: 269 },
    { id: "psu-fsp-850", brand: "FSP", name: "Hydro G Pro 850W", generation: 850, watts: 850, score: 8.8, price: 139 },
    { id: "psu-coolermaster-1250", brand: "Cooler Master", name: "MWE Gold V2 1250W", generation: 1250, watts: 1250, score: 9.1, price: 259 },
    { id: "psu-evga-850", brand: "EVGA", name: "SuperNOVA 850 G7", generation: 850, watts: 850, score: 9.0, price: 169 },
    { id: "psu-evga-1000", brand: "EVGA", name: "SuperNOVA 1000 G7", generation: 1000, watts: 1000, score: 9.2, price: 219 },
    { id: "psu-silverstone-1200", brand: "SilverStone", name: "HELA 1200R Platinum", generation: 1200, watts: 1200, score: 9.3, price: 309 },
    { id: "psu-asrock-850", brand: "ASRock", name: "Steel Legend 850W", generation: 850, watts: 850, score: 8.7, price: 139 },
    { id: "psu-bequiet-750", brand: "be quiet!", name: "Pure Power 12 M 750W", generation: 750, watts: 750, score: 8.7, price: 129 },
    { id: "psu-seasonic-750", brand: "Seasonic", name: "Focus GX-750", generation: 750, watts: 750, score: 8.8, price: 139 },
    { id: "psu-msi-1000", brand: "MSI", name: "MAG A1000GL PCIE5", generation: 1000, watts: 1000, score: 9.1, price: 199 },
    { id: "psu-corsair-1200e", brand: "Corsair", name: "RM1200e Gold", generation: 1200, watts: 1200, score: 9.2, price: 259 },
    { id: "psu-deepcool-850", brand: "DeepCool", name: "PX850G 850W", generation: 850, watts: 850, score: 8.9, price: 149 },
    { id: "psu-nzxt-1200", brand: "NZXT", name: "C1200 Gold", generation: 1200, watts: 1200, score: 9.3, price: 289 },
    { id: "psu-corsair-sf850", brand: "Corsair", name: "SF850L Gold", generation: 850, watts: 850, score: 9.0, price: 179 },
    { id: "psu-seasonic-1000", brand: "Seasonic", name: "Focus GX-1000", generation: 1000, watts: 1000, score: 9.2, price: 209 },
    { id: "psu-corsair-rm1000x-shift", brand: "Corsair", name: "RM1000x Shift", generation: 1000, watts: 1000, score: 9.3, price: 239 },
    { id: "psu-lianli-edge-1300", brand: "Lian Li", name: "EDGE 1300W Platinum", generation: 1300, watts: 1300, score: 9.6, price: 369 },
    { id: "psu-montech-titan-1000", brand: "Montech", name: "Titan Gold 1000W", generation: 1000, watts: 1000, score: 9.0, price: 189 },
    { id: "psu-xpg-core-850", brand: "XPG", name: "Core Reactor II 850W", generation: 850, watts: 850, score: 9.0, price: 159 },
    { id: "psu-enermax-1050", brand: "Enermax", name: "Revolution D.F. 12 1050W", generation: 1050, watts: 1050, score: 9.1, price: 229 },
    { id: "psu-superflower-1000", brand: "Super Flower", name: "Leadex VII XG 1000W", generation: 1000, watts: 1000, score: 9.4, price: 249 },
    { id: "psu-coolermaster-v850-sfx", brand: "Cooler Master", name: "V850 SFX Gold", generation: 850, watts: 850, score: 8.8, price: 189 },
    { id: "psu-bequiet-1200-dark", brand: "be quiet!", name: "Dark Power 13 1200W", generation: 1200, watts: 1200, score: 9.5, price: 349 },
    { id: "psu-thermaltake-gf-a3-1050", brand: "Thermaltake", name: "Toughpower GF A3 1050W", generation: 1050, watts: 1050, score: 9.1, price: 219 },
    { id: "psu-corsair-rm650x-shift", brand: "Corsair", name: "RM650x Shift", generation: 650, watts: 650, score: 8.6, price: 139 },
    { id: "psu-msi-a750gl", brand: "MSI", name: "MAG A750GL PCIE5", generation: 750, watts: 750, score: 8.8, price: 129 },
    { id: "psu-seasonic-px1200", brand: "Seasonic", name: "Vertex PX-1200", generation: 1200, watts: 1200, score: 9.6, price: 379 },
    { id: "psu-xpg-core-1000", brand: "XPG", name: "Core Reactor II 1000W", generation: 1000, watts: 1000, score: 9.2, price: 209 }
  ],
  case: [
    { id: "case-msi-100r", brand: "MSI", name: "MAG Forge 100R", generation: 100, maxGpu: 330, maxRad: 240, score: 7.4, price: 79 },
    { id: "case-nzxt-h5", brand: "NZXT", name: "H5 Flow", generation: 5, maxGpu: 365, maxRad: 280, score: 8.3, price: 109 },
    { id: "case-fractal-pop", brand: "Fractal", name: "Pop Air", generation: 1, maxGpu: 405, maxRad: 280, score: 8.5, price: 99 },
    { id: "case-corsair-4000d", brand: "Corsair", name: "4000D Airflow", generation: 4000, maxGpu: 360, maxRad: 360, score: 8.8, price: 104 },
    { id: "case-lianli-216", brand: "Lian Li", name: "Lancool 216", generation: 216, maxGpu: 392, maxRad: 360, score: 9.0, price: 119 },
    { id: "case-phanteks-g500a", brand: "Phanteks", name: "G500A", generation: 500, maxGpu: 435, maxRad: 420, score: 9.2, price: 159 },
    { id: "case-fractal-north", brand: "Fractal", name: "North XL", generation: 2, maxGpu: 413, maxRad: 420, score: 9.3, price: 189 },
    { id: "case-lianli-o11", brand: "Lian Li", name: "O11 Dynamic EVO", generation: 11, maxGpu: 426, maxRad: 360, score: 9.1, price: 179 },
    { id: "case-hyte-y70", brand: "HYTE", name: "Y70 Touch", generation: 70, maxGpu: 422, maxRad: 360, score: 9.0, price: 369 },
    { id: "case-bequiet-802", brand: "be quiet!", name: "Silent Base 802", generation: 802, maxGpu: 432, maxRad: 420, score: 9.2, price: 199 },
    { id: "case-thermaltake-cte", brand: "Thermaltake", name: "Ceres 500 TG", generation: 500, maxGpu: 420, maxRad: 420, score: 8.9, price: 149 },
    { id: "case-lianli-o11xl", brand: "Lian Li", name: "O11 Dynamic XL", generation: 11, maxGpu: 446, maxRad: 420, score: 9.4, price: 229 },
    { id: "case-nzxt-h9", brand: "NZXT", name: "H9 Flow", generation: 9, maxGpu: 435, maxRad: 360, score: 9.1, price: 179 },
    { id: "case-montech-king95", brand: "Montech", name: "King 95 Pro", generation: 95, maxGpu: 420, maxRad: 360, score: 8.7, price: 149 },
    { id: "case-corsair-6500x", brand: "Corsair", name: "6500X", generation: 6500, maxGpu: 400, maxRad: 360, score: 8.9, price: 199 },
    { id: "case-phanteks-nv5", brand: "Phanteks", name: "NV5", generation: 5, maxGpu: 440, maxRad: 360, score: 9.0, price: 169 },
    { id: "case-coolermaster-h500", brand: "Cooler Master", name: "H500 ARGB", generation: 500, maxGpu: 410, maxRad: 360, score: 8.5, price: 139 },
    { id: "case-deepcool-ch780", brand: "DeepCool", name: "CH780", generation: 780, maxGpu: 480, maxRad: 420, score: 9.3, price: 199 },
    { id: "case-antec-c8", brand: "Antec", name: "C8 Constellation", generation: 8, maxGpu: 440, maxRad: 360, score: 8.8, price: 149 },
    { id: "case-asus-gt502", brand: "ASUS", name: "TUF GT502", generation: 502, maxGpu: 400, maxRad: 360, score: 8.8, price: 169 },
    { id: "case-silverstone-alta", brand: "SilverStone", name: "ALTA F2", generation: 2, maxGpu: 430, maxRad: 420, score: 9.1, price: 229 },
    { id: "case-fractal-torrent", brand: "Fractal", name: "Torrent", generation: 1, maxGpu: 461, maxRad: 420, score: 9.5, price: 229 },
    { id: "case-msi-pano", brand: "MSI", name: "MEG Prospect 700R", generation: 700, maxGpu: 400, maxRad: 360, score: 8.9, price: 299 },
    { id: "case-corsair-5000d", brand: "Corsair", name: "5000D Airflow", generation: 5000, maxGpu: 420, maxRad: 360, score: 9.0, price: 169 },
    { id: "case-nzxt-h7", brand: "NZXT", name: "H7 Flow", generation: 7, maxGpu: 400, maxRad: 360, score: 8.9, price: 139 },
    { id: "case-fractal-meshify2", brand: "Fractal", name: "Meshify 2", generation: 2, maxGpu: 467, maxRad: 420, score: 9.4, price: 179 },
    { id: "case-lianli-207", brand: "Lian Li", name: "Lancool 207", generation: 207, maxGpu: 410, maxRad: 360, score: 8.8, price: 109 },
    { id: "case-corsair-7000d", brand: "Corsair", name: "7000D Airflow", generation: 7000, maxGpu: 450, maxRad: 420, score: 9.4, price: 259 },
    { id: "case-phanteks-evolv", brand: "Phanteks", name: "Evolv X2", generation: 2, maxGpu: 445, maxRad: 420, score: 9.2, price: 239 },
    { id: "case-thermaltake-tower", brand: "Thermaltake", name: "The Tower 600", generation: 600, maxGpu: 400, maxRad: 420, score: 9.0, price: 199 },
    { id: "case-nzxt-h6", brand: "NZXT", name: "H6 Flow", generation: 6, maxGpu: 365, maxRad: 360, score: 8.8, price: 119 },
    { id: "case-lianli-o11-vision", brand: "Lian Li", name: "O11 Vision", generation: 11, maxGpu: 455, maxRad: 360, score: 9.2, price: 159 },
    { id: "case-fractal-north-atx", brand: "Fractal", name: "North", generation: 1, maxGpu: 355, maxRad: 360, score: 8.9, price: 139 },
    { id: "case-coolermaster-nr200pmax", brand: "Cooler Master", name: "NR200P MAX", generation: 200, maxGpu: 336, maxRad: 280, score: 8.6, price: 349 },
    { id: "case-jonsbo-d41", brand: "Jonsbo", name: "D41 Mesh", generation: 41, maxGpu: 400, maxRad: 360, score: 8.7, price: 109 },
    { id: "case-phanteks-nv7", brand: "Phanteks", name: "NV7", generation: 7, maxGpu: 450, maxRad: 420, score: 9.4, price: 249 },
    { id: "case-antec-performance1ft", brand: "Antec", name: "Performance 1 FT", generation: 1, maxGpu: 400, maxRad: 420, score: 9.1, price: 239 },
    { id: "case-deepcool-ch560", brand: "DeepCool", name: "CH560 Digital", generation: 560, maxGpu: 380, maxRad: 360, score: 8.6, price: 119 },
    { id: "case-bequiet-lightbase900", brand: "be quiet!", name: "Light Base 900 FX", generation: 900, maxGpu: 495, maxRad: 420, score: 9.5, price: 279 },
    { id: "case-asus-proart-pa602", brand: "ASUS", name: "ProArt PA602", generation: 602, maxGpu: 440, maxRad: 420, score: 9.3, price: 249 },
    { id: "case-montech-sky-two", brand: "Montech", name: "Sky Two GX", generation: 2, maxGpu: 400, maxRad: 360, score: 8.8, price: 109 },
    { id: "case-lianli-lancool3", brand: "Lian Li", name: "Lancool III", generation: 3, maxGpu: 435, maxRad: 420, score: 9.3, price: 159 },
    { id: "case-fractal-define7", brand: "Fractal", name: "Define 7", generation: 7, maxGpu: 491, maxRad: 420, score: 9.1, price: 199 },
    { id: "case-corsair-3000d", brand: "Corsair", name: "3000D Airflow", generation: 3000, maxGpu: 360, maxRad: 360, score: 8.4, price: 89 },
    { id: "case-phanteks-xtpro", brand: "Phanteks", name: "XT Pro Ultra", generation: 1, maxGpu: 415, maxRad: 360, score: 8.7, price: 99 }
  ],
  watercooling: [
    { id: "cool-none", brand: "Aucun", name: "Refroidissement inclus de base", type: "none", radiator: 0, score: 5.0, price: 0, isNone: true },
    { id: "cool-air-mid", brand: "Thermalright", name: "Aircooling double tour", type: "air", radiator: 0, score: 8.3, price: 49 },
    { id: "cool-air-prem", brand: "Noctua", name: "NH-D15 chromax.black", type: "air", radiator: 0, score: 9.2, price: 109 },
    { id: "cool-aio-240", brand: "Corsair", name: "AIO 240 mm RGB", type: "aio", radiator: 240, score: 8.7, price: 119 },
    { id: "cool-aio-280", brand: "Arctic", name: "Liquid Freezer III 280", type: "aio", radiator: 280, score: 9.1, price: 129 },
    { id: "cool-aio-360", brand: "Arctic", name: "Liquid Freezer III 360", type: "aio", radiator: 360, score: 9.4, price: 139 },
    { id: "cool-aio-420", brand: "NZXT", name: "Kraken 420 Elite", type: "aio", radiator: 420, score: 9.5, price: 269 },
    { id: "cool-aio-360-corsair", brand: "Corsair", name: "iCUE Link H150i 360", type: "aio", radiator: 360, score: 9.4, price: 239 },
    { id: "cool-aio-360-lianli", brand: "Lian Li", name: "Galahad II Trinity 360", type: "aio", radiator: 360, score: 9.3, price: 179 },
    { id: "cool-aio-240-nzxt", brand: "NZXT", name: "Kraken 240 RGB", type: "aio", radiator: 240, score: 8.8, price: 169 },
    { id: "cool-air-dual-ak620", brand: "DeepCool", name: "AK620 Zero Dark", type: "air", radiator: 0, score: 8.8, price: 79 },
    { id: "cool-aio-360-deepcool", brand: "DeepCool", name: "LT720 360", type: "aio", radiator: 360, score: 9.3, price: 169 },
    { id: "cool-aio-280-corsair", brand: "Corsair", name: "H115i RGB Elite 280", type: "aio", radiator: 280, score: 9.0, price: 169 },
    { id: "cool-aio-420-arctic", brand: "Arctic", name: "Liquid Freezer III 420", type: "aio", radiator: 420, score: 9.6, price: 189 },
    { id: "cool-aio-360-msi", brand: "MSI", name: "MAG CoreLiquid E360", type: "aio", radiator: 360, score: 9.1, price: 149 },
    { id: "cool-aio-360-coolermaster", brand: "Cooler Master", name: "MasterLiquid 360 Atmos", type: "aio", radiator: 360, score: 9.0, price: 179 },
    { id: "cool-air-fuma3", brand: "Scythe", name: "Fuma 3", type: "air", radiator: 0, score: 8.6, price: 69 },
    { id: "cool-air-assassin4", brand: "DeepCool", name: "Assassin IV", type: "air", radiator: 0, score: 9.1, price: 99 },
    { id: "cool-custom", brand: "Custom", name: "Boucle 100% custom (sur devis)", type: "custom", radiator: 360, score: 9.8, price: 0, estimateOnly: true },
    { id: "cool-aio-360-ek", brand: "EK", name: "Nucleus AIO CR360 Lux", type: "aio", radiator: 360, score: 9.3, price: 189 },
    { id: "cool-aio-360-bequiet", brand: "be quiet!", name: "Light Loop 360", type: "aio", radiator: 360, score: 9.2, price: 179 },
    { id: "cool-air-peerless", brand: "Thermalright", name: "Peerless Assassin 120 SE", type: "air", radiator: 0, score: 8.7, price: 45 },
    { id: "cool-aio-360-asus", brand: "ASUS", name: "ROG Ryujin III 360", type: "aio", radiator: 360, score: 9.4, price: 299 },
    { id: "cool-aio-280-lianli", brand: "Lian Li", name: "HydroShift 280", type: "aio", radiator: 280, score: 9.1, price: 179 },
    { id: "cool-air-noctua-u12a", brand: "Noctua", name: "NH-U12A chromax.black", type: "air", radiator: 0, score: 8.9, price: 129 },
    { id: "cool-air-noctua-d15-g2", brand: "Noctua", name: "NH-D15 G2", type: "air", radiator: 0, score: 9.5, price: 149 },
    { id: "cool-air-frost-spirit", brand: "Thermalright", name: "Frost Spirit 140", type: "air", radiator: 0, score: 8.8, price: 59 },
    { id: "cool-air-idcooling-a620", brand: "ID-Cooling", name: "A620 Pro SE", type: "air", radiator: 0, score: 8.4, price: 49 },
    { id: "cool-aio-240-ek", brand: "EK", name: "Nucleus AIO CR240 Dark", type: "aio", radiator: 240, score: 8.9, price: 149 },
    { id: "cool-aio-280-bequiet", brand: "be quiet!", name: "Pure Loop 2 280", type: "aio", radiator: 280, score: 9.0, price: 149 },
    { id: "cool-aio-360-lianli-lcd", brand: "Lian Li", name: "Galahad II LCD 360", type: "aio", radiator: 360, score: 9.5, price: 249 },
    { id: "cool-aio-420-corsair", brand: "Corsair", name: "iCUE H170i Elite LCD XT", type: "aio", radiator: 420, score: 9.6, price: 299 },
    { id: "cool-aio-360-thermaltake", brand: "Thermaltake", name: "TH360 V2 Ultra", type: "aio", radiator: 360, score: 9.1, price: 169 },
    { id: "cool-aio-240-arctic", brand: "Arctic", name: "Liquid Freezer III 240", type: "aio", radiator: 240, score: 8.8, price: 109 },
    { id: "cool-aio-360-alphacool", brand: "Alphacool", name: "Eisbaer Aurora 360", type: "aio", radiator: 360, score: 9.2, price: 199 },
    { id: "cool-air-arctic-freezer36", brand: "Arctic", name: "Freezer 36", type: "air", radiator: 0, score: 8.2, price: 39 },
    { id: "cool-air-noctua-l12s", brand: "Noctua", name: "NH-L12Sx77", type: "air", radiator: 0, score: 8.5, price: 79 },
    { id: "cool-aio-240-corsair-h100i", brand: "Corsair", name: "iCUE H100i Elite", type: "aio", radiator: 240, score: 8.9, price: 149 },
    { id: "cool-aio-360-msi-s360", brand: "MSI", name: "MEG CoreLiquid S360", type: "aio", radiator: 360, score: 9.3, price: 229 }
  ],
  customCables: [
    { id: "cab-none", brand: "Aucun", category: "Aucun", name: "Aucun câble custom", score: 5.0, price: 0, isNone: true },

    { id: "cab-mobo-ext", brand: "CableMod", category: "Carte mère (24-pin)", name: "Extension 24-pin ATX", score: 8.1, price: 35 },
    { id: "cab-mobo-pro", brand: "CableMod", category: "Carte mère (24-pin)", name: "Kit 24-pin Pro ModMesh", score: 9.0, price: 69 },
    { id: "cab-mobo-full", brand: "Atelier", category: "Carte mère (24-pin)", name: "24-pin full custom longueur exacte", score: 9.5, price: 95 },
    { id: "cab-mobo-lianli", brand: "Lian Li", category: "Carte mère (24-pin)", name: "Strimer Plus V2 24-pin RGB", score: 9.1, price: 64 },
    { id: "cab-mobo-asiahorse", brand: "AsiaHorse", category: "Carte mère (24-pin)", name: "24-pin sleeved premium", score: 8.4, price: 42 },
    { id: "cab-mobo-corsair-link", brand: "Corsair", category: "Carte mère (24-pin)", name: "iCUE braided 24-pin premium", score: 8.7, price: 59 },
    { id: "cab-mobo-phanteks", brand: "Phanteks", category: "Carte mère (24-pin)", name: "24-pin extension premium", score: 8.3, price: 39 },

    { id: "cab-gpu-1x8", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU custom 1x8-pin", score: 8.0, price: 29, requiredPcie8: 1 },
    { id: "cab-gpu-2x8", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU custom 2x8-pin", score: 8.7, price: 49, requiredPcie8: 2 },
    { id: "cab-gpu-3x8", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU custom 3x8-pin", score: 9.0, price: 69, requiredPcie8: 3 },
    { id: "cab-gpu-12vhpwr", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU custom 12VHPWR / 12V-2x6", score: 9.3, price: 89, requires12vhpwr: true },
    { id: "cab-gpu-full", brand: "Atelier", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU full custom (couleur + longueur)", score: 9.7, price: 129, dynamic: true },
    { id: "cab-gpu-lianli-12", brand: "Lian Li", category: "Carte graphique (PCIe/12VHPWR)", name: "Strimer Plus V2 12VHPWR", score: 9.2, price: 79, requires12vhpwr: true },
    { id: "cab-gpu-lianli-3x8", brand: "Lian Li", category: "Carte graphique (PCIe/12VHPWR)", name: "Strimer Plus V2 Triple 8-pin", score: 9.0, price: 75, requiredPcie8: 3 },
    { id: "cab-gpu-asiahorse-2x8", brand: "AsiaHorse", category: "Carte graphique (PCIe/12VHPWR)", name: "Dual 8-pin sleeved", score: 8.2, price: 39, requiredPcie8: 2 },
    { id: "cab-gpu-corsair-12v2x6", brand: "Corsair", category: "Carte graphique (PCIe/12VHPWR)", name: "Premium 12V-2x6 braided", score: 9.4, price: 95, requires12vhpwr: true },
    { id: "cab-gpu-phanteks-2x8", brand: "Phanteks", category: "Carte graphique (PCIe/12VHPWR)", name: "Dual PCIe 8-pin extension", score: 8.1, price: 35, requiredPcie8: 2 },
    { id: "cab-gpu-phanteks-1x8", brand: "Phanteks", category: "Carte graphique (PCIe/12VHPWR)", name: "Single PCIe 8-pin extension", score: 7.9, price: 22, requiredPcie8: 1 },

    { id: "cab-cpu-1eps", brand: "CableMod", category: "CPU (EPS 8-pin)", name: "CPU custom 1x8-pin EPS", score: 8.2, price: 25, requiredEps8: 1 },
    { id: "cab-cpu-2eps", brand: "CableMod", category: "CPU (EPS 8-pin)", name: "CPU custom 2x8-pin EPS", score: 9.0, price: 45, requiredEps8: 2 },
    { id: "cab-cpu-full", brand: "Atelier", category: "CPU (EPS 8-pin)", name: "CPU full custom gainé", score: 9.4, price: 59, dynamic: true },
    { id: "cab-cpu-lianli", brand: "Lian Li", category: "CPU (EPS 8-pin)", name: "Strimer Plus EPS 8-pin", score: 8.7, price: 52, requiredEps8: 1 },
    { id: "cab-cpu-asiahorse-2eps", brand: "AsiaHorse", category: "CPU (EPS 8-pin)", name: "Dual EPS 8-pin custom", score: 8.8, price: 44, requiredEps8: 2 },
    { id: "cab-cpu-corsair-1eps", brand: "Corsair", category: "CPU (EPS 8-pin)", name: "EPS 8-pin premium braided", score: 8.6, price: 31, requiredEps8: 1 },
    { id: "cab-cpu-corsair-2eps", brand: "Corsair", category: "CPU (EPS 8-pin)", name: "Double EPS 8-pin premium", score: 9.0, price: 56, requiredEps8: 2 },

    { id: "cab-oth-sata", brand: "Atelier", category: "Autres (SATA/ARGB/FAN)", name: "Pack SATA gainé", score: 7.6, price: 19 },
    { id: "cab-oth-argb", brand: "Atelier", category: "Autres (SATA/ARGB/FAN)", name: "Pack ARGB/FAN propre", score: 8.3, price: 29 },
    { id: "cab-oth-show", brand: "Atelier", category: "Autres (SATA/ARGB/FAN)", name: "Pack routing avancé", score: 9.2, price: 49 },
    { id: "cab-oth-corsair", brand: "Corsair", category: "Autres (SATA/ARGB/FAN)", name: "Kit iCUE LINK routing RGB", score: 8.8, price: 59 },
    { id: "cab-oth-lianli", brand: "Lian Li", category: "Autres (SATA/ARGB/FAN)", name: "UNI FAN + hub routing propre", score: 9.0, price: 69 },
    { id: "cab-oth-phanteks", brand: "Phanteks", category: "Autres (SATA/ARGB/FAN)", name: "Pack ARGB D-RGB premium", score: 8.4, price: 36 },
    { id: "cab-oth-modmesh", brand: "CableMod", category: "Autres (SATA/ARGB/FAN)", name: "Extensions SATA + ARGB ModMesh", score: 8.9, price: 47 },
    { id: "cab-gpu-thermaltake-12", brand: "Thermaltake", category: "Carte graphique (PCIe/12VHPWR)", name: "12VHPWR premium extension", score: 9.1, price: 85, requires12vhpwr: true },
    { id: "cab-cpu-thermaltake-2eps", brand: "Thermaltake", category: "CPU (EPS 8-pin)", name: "Dual EPS 8-pin extension", score: 8.7, price: 42, requiredEps8: 2 },
    { id: "cab-mobo-thermaltake", brand: "Thermaltake", category: "Carte mère (24-pin)", name: "24-pin RGB premium", score: 8.8, price: 58 },
    { id: "cab-oth-nzxt", brand: "NZXT", category: "Autres (SATA/ARGB/FAN)", name: "Pack routing RGB/HUB", score: 8.6, price: 44 },
    { id: "cab-gpu-bequiet-12", brand: "be quiet!", category: "Carte graphique (PCIe/12VHPWR)", name: "12VHPWR gainé premium", score: 9.0, price: 79, requires12vhpwr: true },
    { id: "cab-cpu-phanteks-2eps", brand: "Phanteks", category: "CPU (EPS 8-pin)", name: "Double EPS 8-pin premium", score: 8.6, price: 41, requiredEps8: 2 },
    { id: "cab-mobo-coolermaster", brand: "Cooler Master", category: "Carte mère (24-pin)", name: "24-pin custom sleeved", score: 8.5, price: 46 },
    { id: "cab-mobo-seasonic", brand: "Seasonic", category: "Carte mère (24-pin)", name: "24-pin premium gainé", score: 8.8, price: 54 },
    { id: "cab-mobo-ezdiy", brand: "EZDIY-FAB", category: "Carte mère (24-pin)", name: "24-pin ARGB extension", score: 8.1, price: 33 },
    { id: "cab-mobo-montech", brand: "Montech", category: "Carte mère (24-pin)", name: "24-pin sleeved black/white", score: 8.0, price: 29 },
    { id: "cab-gpu-moddiy-12v2x6", brand: "MODDIY", category: "Carte graphique (PCIe/12VHPWR)", name: "12V-2x6 silicone ultra-flex", score: 9.5, price: 99, requires12vhpwr: true },
    { id: "cab-gpu-silverstone-2x8", brand: "SilverStone", category: "Carte graphique (PCIe/12VHPWR)", name: "Dual PCIe 8-pin premium", score: 8.4, price: 41, requiredPcie8: 2 },
    { id: "cab-gpu-antec-3x8", brand: "Antec", category: "Carte graphique (PCIe/12VHPWR)", name: "Triple PCIe 8-pin extension", score: 8.8, price: 55, requiredPcie8: 3 },
    { id: "cab-cpu-seasonic-2eps", brand: "Seasonic", category: "CPU (EPS 8-pin)", name: "Double EPS 8-pin gainé", score: 8.9, price: 48, requiredEps8: 2 },
    { id: "cab-cpu-ezdiy-1eps", brand: "EZDIY-FAB", category: "CPU (EPS 8-pin)", name: "EPS 8-pin ARGB extension", score: 8.0, price: 24, requiredEps8: 1 },
    { id: "cab-cpu-bequiet-2eps", brand: "be quiet!", category: "CPU (EPS 8-pin)", name: "Dual EPS premium black", score: 8.7, price: 43, requiredEps8: 2 },
    { id: "cab-oth-thermaltake", brand: "Thermaltake", category: "Autres (SATA/ARGB/FAN)", name: "Pack hub + gaines ARGB", score: 8.7, price: 46 },
    { id: "cab-oth-ezdiy", brand: "EZDIY-FAB", category: "Autres (SATA/ARGB/FAN)", name: "Kit extension ARGB/FAN", score: 8.2, price: 28 },
    { id: "cab-oth-moddiy", brand: "MODDIY", category: "Autres (SATA/ARGB/FAN)", name: "Pack SATA + splitters premium", score: 8.8, price: 39 },
    { id: "cab-mobo-lianli-v3", brand: "Lian Li", category: "Carte mère (24-pin)", name: "Strimer V3 24-pin RGB", score: 9.3, price: 79 },
    { id: "cab-gpu-corsair-3x8", brand: "Corsair", category: "Carte graphique (PCIe/12VHPWR)", name: "Triple PCIe 8-pin premium", score: 8.9, price: 62, requiredPcie8: 3 },
    { id: "cab-gpu-ezdiy-12", brand: "EZDIY-FAB", category: "Carte graphique (PCIe/12VHPWR)", name: "12VHPWR ARGB extension", score: 8.6, price: 55, requires12vhpwr: true },
    { id: "cab-cpu-lianli-2eps", brand: "Lian Li", category: "CPU (EPS 8-pin)", name: "Double EPS RGB extension", score: 8.8, price: 57, requiredEps8: 2 },
    { id: "cab-oth-antec", brand: "Antec", category: "Autres (SATA/ARGB/FAN)", name: "Pack rallonges fan + ARGB", score: 8.1, price: 27 },
    { id: "cab-oth-montech", brand: "Montech", category: "Autres (SATA/ARGB/FAN)", name: "Kit RGB sync + hub", score: 8.4, price: 34 }
  ],
  cableMgmt: [
    { id: "mgmt-none", brand: "Aucun", name: "Basique atelier", score: 5.0, price: 0, isNone: true },
    { id: "mgmt-premium", brand: "Atelier", name: "Premium", score: 8.8, price: 39 },
    { id: "mgmt-rgb-sync", brand: "Atelier", name: "Synchronisation RGB via app", score: 9.1, price: 59 }
  ],
  delivery: [
    { id: "proc-economy", brand: "Atelier", name: "Traitement économique", mode: "economy", prepWindow: "5-8 jours ouvrés", score: 7.0, baseFee: 8, speedFactor: 0.72, insuranceFactor: 0.8 },
    { id: "proc-normal", brand: "Atelier", name: "Traitement normal", mode: "normal", prepWindow: "3-5 jours ouvrés", score: 8.4, baseFee: 18, speedFactor: 1.0, insuranceFactor: 1.0 },
    { id: "proc-priority", brand: "Atelier", name: "Traitement prioritaire", mode: "priority", prepWindow: "2-3 jours ouvrés", score: 9.2, baseFee: 36, speedFactor: 1.35, insuranceFactor: 1.2 }
  ]
};

const CATALOG_EXPANSION = {
  cpu: [
    { id: "cpu-amd-r5-4500", brand: "AMD", name: "Ryzen 5 4500", generation: 4000, socket: "AM4", tdp: 65, rank: 4.9, score: 6.6, price: 89 },
    { id: "cpu-amd-r7-5700x3d-pro", brand: "AMD", name: "Ryzen 7 5700X3D Pro", generation: 5000, socket: "AM4", tdp: 105, rank: 6.9, score: 8.4, price: 259 },
    { id: "cpu-amd-r5-7700", brand: "AMD", name: "Ryzen 5 7700", generation: 7000, socket: "AM5", tdp: 65, rank: 7.0, score: 8.6, price: 249 },
    { id: "cpu-amd-r9-7900f", brand: "AMD", name: "Ryzen 9 7900F", generation: 7000, socket: "AM5", tdp: 65, rank: 8.0, score: 8.9, price: 359 },
    { id: "cpu-amd-r9-9700x3d", brand: "AMD", name: "Ryzen 9 9700X3D", generation: 9000, socket: "AM5", tdp: 120, rank: 9.1, score: 9.7, price: 599 },
    { id: "cpu-intel-i5-14400", brand: "Intel", name: "Core i5-14400", generation: 14000, socket: "1700", tdp: 65, rank: 6.8, score: 8.4, price: 239 },
    { id: "cpu-intel-i7-13700f", brand: "Intel", name: "Core i7-13700F", generation: 13000, socket: "1700", tdp: 65, rank: 7.9, score: 9.0, price: 349 },
    { id: "cpu-intel-i9-13900kf", brand: "Intel", name: "Core i9-13900KF", generation: 13000, socket: "1700", tdp: 125, rank: 8.7, score: 9.4, price: 499 },
    { id: "cpu-intel-u5-245", brand: "Intel", name: "Core Ultra 5 245", generation: 20000, socket: "1851", tdp: 65, rank: 7.7, score: 9.0, price: 289 },
    { id: "cpu-amd-r5-4600g", brand: "AMD", name: "Ryzen 5 4600G", generation: 4000, socket: "AM4", tdp: 65, rank: 4.8, score: 6.5, price: 99 },
    { id: "cpu-amd-r7-8700f", brand: "AMD", name: "Ryzen 7 8700F", generation: 8000, socket: "AM5", tdp: 65, rank: 7.2, score: 8.8, price: 279 },
    { id: "cpu-amd-r9-9950x3d-pro", brand: "AMD", name: "Ryzen 9 9950X3D Pro", generation: 9000, socket: "AM5", tdp: 170, rank: 9.8, score: 10.0, price: 859 },
    { id: "cpu-intel-i5-14500t", brand: "Intel", name: "Core i5-14500T", generation: 14000, socket: "1700", tdp: 35, rank: 6.2, score: 8.0, price: 259 },
    { id: "cpu-intel-i7-14700t", brand: "Intel", name: "Core i7-14700T", generation: 14000, socket: "1700", tdp: 35, rank: 7.7, score: 8.8, price: 379 },
    { id: "cpu-intel-u9-285", brand: "Intel", name: "Core Ultra 9 285", generation: 20000, socket: "1851", tdp: 65, rank: 9.0, score: 9.6, price: 579 }
  ],
  mobo: [
    { id: "mb-msi-pro-b550m-pgen3", brand: "MSI", name: "PRO B550M-P GEN3", generation: 550, socket: "AM4", ramType: "DDR4", tier: 1, score: 7.2, price: 99 },
    { id: "mb-asus-rog-b550f", brand: "ASUS", name: "ROG Strix B550-F Gaming", generation: 550, socket: "AM4", ramType: "DDR4", tier: 3, score: 8.8, price: 199 },
    { id: "mb-giga-b650m-k", brand: "Gigabyte", name: "B650M K", generation: 650, socket: "AM5", ramType: "DDR5", tier: 1, score: 7.8, price: 159 },
    { id: "mb-asrock-b650-pg-lightning", brand: "ASRock", name: "B650 PG Lightning", generation: 650, socket: "AM5", ramType: "DDR5", tier: 2, score: 8.2, price: 199 },
    { id: "mb-msi-x670e-ace", brand: "MSI", name: "MEG X670E ACE", generation: 670, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.6, price: 679 },
    { id: "mb-asus-prime-z790m-plus", brand: "ASUS", name: "Prime Z790M-PLUS", generation: 790, socket: "1700", ramType: "DDR5", tier: 2, score: 8.5, price: 249 },
    { id: "mb-giga-b760-gaming-x", brand: "Gigabyte", name: "B760 Gaming X AX", generation: 760, socket: "1700", ramType: "DDR5", tier: 2, score: 8.3, price: 219 },
    { id: "mb-asrock-z890-taichi-lite", brand: "ASRock", name: "Z890 Taichi Lite", generation: 890, socket: "1851", ramType: "DDR5", tier: 4, score: 9.4, price: 519 },
    { id: "mb-asus-b650e-e", brand: "ASUS", name: "ROG Strix B650E-E Gaming WiFi", generation: 650, socket: "AM5", ramType: "DDR5", tier: 3, score: 8.9, price: 319 },
    { id: "mb-msi-x870e-carbon", brand: "MSI", name: "MPG X870E Carbon WiFi", generation: 870, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.3, price: 469 },
    { id: "mb-giga-z790m-elite", brand: "Gigabyte", name: "Z790M Aorus Elite AX", generation: 790, socket: "1700", ramType: "DDR5", tier: 3, score: 8.7, price: 299 },
    { id: "mb-msi-b860-tom", brand: "MSI", name: "MAG B860 Tomahawk WiFi", generation: 860, socket: "1851", ramType: "DDR5", tier: 3, score: 8.8, price: 289 },
    { id: "mb-asus-z890-extreme", brand: "ASUS", name: "ROG Maximus Z890 Extreme", generation: 890, socket: "1851", ramType: "DDR5", tier: 4, score: 9.8, price: 1199 }
  ],
  ram: [
    { id: "ram-corsair-32-ddr4-3200", brand: "Corsair", name: "Vengeance LPX 32 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 32, score: 7.4, price: 74 },
    { id: "ram-gskill-16-ddr4-3600", brand: "G.Skill", name: "Ripjaws V 16 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 16, score: 7.0, price: 44 },
    { id: "ram-kingston-32-ddr5-5600", brand: "Kingston", name: "Fury Beast 32 Go DDR5-5600", generation: 5600, type: "DDR5", gb: 32, score: 8.6, price: 109 },
    { id: "ram-gskill-64-ddr5-6800", brand: "G.Skill", name: "Trident Z5 64 Go DDR5-6800", generation: 6800, type: "DDR5", gb: 64, score: 9.6, price: 329 },
    { id: "ram-corsair-96-ddr5-6400", brand: "Corsair", name: "Dominator 96 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 96, score: 9.7, price: 479 },
    { id: "ram-team-48-ddr5-6400", brand: "TeamGroup", name: "T-Force Delta RGB 48 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 48, score: 9.2, price: 209 },
    { id: "ram-adata-32-ddr4-3600", brand: "ADATA", name: "XPG Spectrix D50 32 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 32, score: 7.7, price: 79 },
    { id: "ram-pny-64-ddr5-6000", brand: "PNY", name: "XLR8 Mako 64 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 64, score: 9.1, price: 259 },
    { id: "ram-corsair-128-ddr5-6000", brand: "Corsair", name: "Vengeance 128 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 128, score: 9.9, price: 669 },
    { id: "ram-kingston-128-ddr5-6400", brand: "Kingston", name: "Fury Renegade 128 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 128, score: 10.0, price: 749 },
    { id: "ram-gskill-48-ddr5-8000", brand: "G.Skill", name: "Trident Z5 48 Go DDR5-8000", generation: 8000, type: "DDR5", gb: 48, score: 9.8, price: 389 },
    { id: "ram-team-96-ddr5-7600", brand: "TeamGroup", name: "T-Force Delta 96 Go DDR5-7600", generation: 7600, type: "DDR5", gb: 96, score: 9.9, price: 549 },
    { id: "ram-crucial-64-ddr4-3600", brand: "Crucial", name: "Ballistix 64 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 64, score: 8.2, price: 159 }
  ],
  gpu: [
    { id: "gpu-nv-1660s", brand: "NVIDIA", name: "GeForce GTX 1660 SUPER 6 Go", generation: 1000, vram: 6, tdp: 125, length: 229, rank: 4.7, score: 6.1, price: 219 },
    { id: "gpu-nv-2060s", brand: "NVIDIA", name: "GeForce RTX 2060 SUPER 8 Go", generation: 2000, vram: 8, tdp: 175, length: 267, rank: 5.4, score: 7.0, price: 279 },
    { id: "gpu-nv-3070ti-slim", brand: "NVIDIA", name: "GeForce RTX 3070 Ti Slim 8 Go", generation: 3000, vram: 8, tdp: 290, length: 305, rank: 7.3, score: 8.5, price: 499 },
    { id: "gpu-nv-4080s-slim", brand: "NVIDIA", name: "GeForce RTX 4080 SUPER Slim 16 Go", generation: 4000, vram: 16, tdp: 320, length: 332, rank: 9.1, score: 9.6, price: 1249 },
    { id: "gpu-nv-5070ti-slim", brand: "NVIDIA", name: "GeForce RTX 5070 Ti Slim 16 Go", generation: 5000, vram: 16, tdp: 300, length: 322, rank: 9.1, score: 9.6, price: 979 },
    { id: "gpu-amd-rx6700", brand: "AMD", name: "Radeon RX 6700 10 Go", generation: 6000, vram: 10, tdp: 175, length: 267, rank: 6.4, score: 7.9, price: 309 },
    { id: "gpu-amd-rx6800-nonxt", brand: "AMD", name: "Radeon RX 6800 16 Go OC", generation: 6000, vram: 16, tdp: 250, length: 315, rank: 7.9, score: 8.8, price: 469 },
    { id: "gpu-amd-rx7600-low", brand: "AMD", name: "Radeon RX 7600 Low Profile 8 Go", generation: 7000, vram: 8, tdp: 165, length: 210, rank: 6.1, score: 7.8, price: 299 },
    { id: "gpu-amd-rx7800xt-slim", brand: "AMD", name: "Radeon RX 7800 XT Slim 16 Go", generation: 7000, vram: 16, tdp: 263, length: 305, rank: 8.1, score: 9.1, price: 639 },
    { id: "gpu-amd-rx7900xt-slim", brand: "AMD", name: "Radeon RX 7900 XT Slim 20 Go", generation: 7000, vram: 20, tdp: 315, length: 320, rank: 8.9, score: 9.5, price: 949 },
    { id: "gpu-amd-rx9080", brand: "AMD", name: "Radeon RX 9080 20 Go", generation: 9000, vram: 20, tdp: 330, length: 338, rank: 9.2, score: 9.7, price: 1199 },
    { id: "gpu-intel-a770-limited", brand: "Intel", name: "Arc A770 Limited 16 Go", generation: 700, vram: 16, tdp: 225, length: 280, rank: 7.0, score: 8.4, price: 359 },
    { id: "gpu-nv-4060-lp", brand: "NVIDIA", name: "GeForce RTX 4060 Low Profile 8 Go", generation: 4000, vram: 8, tdp: 115, length: 182, rank: 6.1, score: 7.9, price: 359 },
    { id: "gpu-nv-5090-liquid", brand: "NVIDIA", name: "GeForce RTX 5090 Liquid 32 Go", generation: 5000, vram: 32, tdp: 600, length: 290, rank: 10.0, score: 10.0, price: 3799 },
    { id: "gpu-amd-rx7600xt-compact", brand: "AMD", name: "Radeon RX 7600 XT Compact 16 Go", generation: 7000, vram: 16, tdp: 190, length: 230, rank: 6.9, score: 8.3, price: 379 },
    { id: "gpu-amd-rx9070x3d", brand: "AMD", name: "Radeon RX 9070 X3D 16 Go", generation: 9000, vram: 16, tdp: 315, length: 335, rank: 9.2, score: 9.7, price: 899 },
    { id: "gpu-intel-b880", brand: "Intel", name: "Arc B880 20 Go", generation: 800, vram: 20, tdp: 285, length: 308, rank: 8.2, score: 9.1, price: 679 },
    { id: "gpu-nv-4080-water", brand: "NVIDIA", name: "GeForce RTX 4080 SUPER Hydro 16 Go", generation: 4000, vram: 16, tdp: 320, length: 240, rank: 9.2, score: 9.7, price: 1399 }
  ],
  storage: [
    { id: "sto-crucial-p3-500", brand: "Crucial", name: "P3 Plus NVMe 500 Go", generation: 4, tb: 0.5, score: 7.6, price: 49 },
    { id: "sto-wd-sn770-500", brand: "WD", name: "Black SN770 500 Go", generation: 4, tb: 0.5, score: 8.0, price: 59 },
    { id: "sto-sam-990evo-4", brand: "Samsung", name: "990 EVO 4 To", generation: 4, tb: 4, score: 9.2, price: 299 },
    { id: "sto-lexar-nm790-2", brand: "Lexar", name: "NM790 2 To", generation: 4, tb: 2, score: 8.9, price: 149 },
    { id: "sto-kioxia-1", brand: "Kioxia", name: "Exceria Pro NVMe 1 To", generation: 4, tb: 1, score: 8.4, price: 89 },
    { id: "sto-seagate-4", brand: "Seagate", name: "BarraCuda 4 To", generation: 5400, tb: 4, score: 5.6, price: 109 },
    { id: "sto-toshiba-n300-12", brand: "Toshiba", name: "N300 12 To", generation: 7200, tb: 12, score: 6.4, price: 289 },
    { id: "sto-mix-2plus12", brand: "Atelier", name: "NVMe 2 To + HDD 12 To", generation: 4, tb: 14, score: 9.0, price: 419 },
    { id: "sto-sam-9100pro-4", brand: "Samsung", name: "9100 PRO PCIe 5.0 4 To", generation: 5, tb: 4, score: 9.9, price: 629 },
    { id: "sto-wd-sn850x-8", brand: "WD", name: "Black SN850X 8 To", generation: 4, tb: 8, score: 9.4, price: 889 },
    { id: "sto-seagate-ironwolf-16", brand: "Seagate", name: "IronWolf Pro 16 To", generation: 7200, tb: 16, score: 6.8, price: 459 },
    { id: "sto-crucial-t705-2", brand: "Crucial", name: "T705 PCIe 5.0 2 To", generation: 5, tb: 2, score: 9.8, price: 349 }
  ],
  psu: [
    { id: "psu-corsair-rm650", brand: "Corsair", name: "RM650 Gold", generation: 650, watts: 650, score: 8.5, price: 119 },
    { id: "psu-corsair-rm850x-shift", brand: "Corsair", name: "RM850x Shift", generation: 850, watts: 850, score: 9.1, price: 189 },
    { id: "psu-seasonic-gx650", brand: "Seasonic", name: "Focus GX-650", generation: 650, watts: 650, score: 8.6, price: 119 },
    { id: "psu-msi-a650gl", brand: "MSI", name: "MAG A650GL PCIE5", generation: 650, watts: 650, score: 8.3, price: 109 },
    { id: "psu-bequiet-1000-dark", brand: "be quiet!", name: "Dark Power 13 1000W", generation: 1000, watts: 1000, score: 9.4, price: 299 },
    { id: "psu-superflower-850", brand: "Super Flower", name: "Leadex VII XG 850W", generation: 850, watts: 850, score: 9.1, price: 189 },
    { id: "psu-silverstone-850", brand: "SilverStone", name: "HELA 850R Platinum", generation: 850, watts: 850, score: 9.0, price: 179 },
    { id: "psu-thermaltake-850-gfa3", brand: "Thermaltake", name: "Toughpower GF A3 850W", generation: 850, watts: 850, score: 8.9, price: 159 },
    { id: "psu-corsair-rm1000e", brand: "Corsair", name: "RM1000e Gold", generation: 1000, watts: 1000, score: 9.1, price: 209 },
    { id: "psu-seasonic-prime-1300", brand: "Seasonic", name: "Prime TX-1300", generation: 1300, watts: 1300, score: 9.8, price: 469 },
    { id: "psu-bequiet-straight-850", brand: "be quiet!", name: "Straight Power 12 850W", generation: 850, watts: 850, score: 9.2, price: 199 },
    { id: "psu-lianli-edge-1000", brand: "Lian Li", name: "EDGE 1000W Platinum", generation: 1000, watts: 1000, score: 9.5, price: 309 }
  ],
  case: [
    { id: "case-corsair-3500x", brand: "Corsair", name: "3500X ARGB", generation: 3500, maxGpu: 410, maxRad: 360, score: 8.8, price: 129 },
    { id: "case-corsair-2500d", brand: "Corsair", name: "2500D Airflow", generation: 2500, maxGpu: 360, maxRad: 360, score: 8.5, price: 119 },
    { id: "case-fractal-pop-xl", brand: "Fractal", name: "Pop XL Air", generation: 2, maxGpu: 455, maxRad: 360, score: 8.9, price: 129 },
    { id: "case-fractal-focus2", brand: "Fractal", name: "Focus 2 RGB", generation: 2, maxGpu: 405, maxRad: 360, score: 8.4, price: 99 },
    { id: "case-nzxt-h5-elite", brand: "NZXT", name: "H5 Elite", generation: 5, maxGpu: 365, maxRad: 280, score: 8.4, price: 139 },
    { id: "case-lianli-o11d-mini", brand: "Lian Li", name: "O11 Dynamic Mini", generation: 11, maxGpu: 395, maxRad: 360, score: 8.8, price: 139 },
    { id: "case-lianli-lancool-205m", brand: "Lian Li", name: "Lancool 205M Mesh", generation: 205, maxGpu: 350, maxRad: 280, score: 8.1, price: 89 },
    { id: "case-phanteks-xt-view", brand: "Phanteks", name: "XT View", generation: 1, maxGpu: 415, maxRad: 360, score: 8.8, price: 119 },
    { id: "case-bequiet-shadow-800", brand: "be quiet!", name: "Shadow Base 800 DX", generation: 800, maxGpu: 430, maxRad: 420, score: 9.0, price: 169 },
    { id: "case-montech-air903", brand: "Montech", name: "Air 903 MAX", generation: 903, maxGpu: 400, maxRad: 360, score: 8.7, price: 99 },
    { id: "case-corsair-7000x", brand: "Corsair", name: "iCUE 7000X RGB", generation: 7000, maxGpu: 450, maxRad: 420, score: 9.2, price: 329 },
    { id: "case-hyte-y70", brand: "HYTE", name: "Y70 Touch Infinite", generation: 70, maxGpu: 422, maxRad: 360, score: 9.1, price: 429 },
    { id: "case-jonsbo-d31", brand: "Jonsbo", name: "D31 Mesh Screen", generation: 31, maxGpu: 400, maxRad: 360, score: 8.5, price: 119 },
    { id: "case-coolermaster-haf700", brand: "Cooler Master", name: "HAF 700 EVO", generation: 700, maxGpu: 490, maxRad: 420, score: 9.6, price: 499 },
    { id: "case-antec-c8", brand: "Antec", name: "C8 ARGB", generation: 8, maxGpu: 440, maxRad: 360, score: 8.9, price: 149 }
  ],
  watercooling: [
    { id: "cool-air-phantom-spirit", brand: "Thermalright", name: "Phantom Spirit 120", type: "air", radiator: 0, score: 8.9, price: 59 },
    { id: "cool-air-dark-rock-pro5", brand: "be quiet!", name: "Dark Rock Pro 5", type: "air", radiator: 0, score: 9.2, price: 109 },
    { id: "cool-aio-240-deepcool-le", brand: "DeepCool", name: "LE520 240", type: "aio", radiator: 240, score: 8.6, price: 109 },
    { id: "cool-aio-360-arctic-rgb", brand: "Arctic", name: "Liquid Freezer III 360 A-RGB", type: "aio", radiator: 360, score: 9.4, price: 169 },
    { id: "cool-aio-280-msi-mag", brand: "MSI", name: "MAG CoreLiquid M280", type: "aio", radiator: 280, score: 8.9, price: 139 },
    { id: "cool-aio-360-asus-lc", brand: "ASUS", name: "TUF LC II 360 ARGB", type: "aio", radiator: 360, score: 9.1, price: 189 },
    { id: "cool-aio-420-thermaltake", brand: "Thermaltake", name: "TH420 V2 Ultra", type: "aio", radiator: 420, score: 9.5, price: 239 },
    { id: "cool-aio-360-lianli-ga2", brand: "Lian Li", name: "Galahad II Trinity 360", type: "aio", radiator: 360, score: 9.3, price: 199 },
    { id: "cool-aio-280-nzxt-kraken", brand: "NZXT", name: "Kraken Elite 280", type: "aio", radiator: 280, score: 9.2, price: 259 },
    { id: "cool-air-thermalright-frost", brand: "Thermalright", name: "Frost Commander 140", type: "air", radiator: 0, score: 8.9, price: 69 },
    { id: "cool-aio-360-deepcool-mystique", brand: "DeepCool", name: "Mystique 360", type: "aio", radiator: 360, score: 9.4, price: 219 }
  ],
  customCables: [
    { id: "cab-mobo-cablemod-pro-90", brand: "CableMod", category: "Carte mère (24-pin)", name: "24-pin Pro coudé 90°", score: 9.2, price: 74 },
    { id: "cab-mobo-corsair-prem-black", brand: "Corsair", category: "Carte mère (24-pin)", name: "24-pin premium black edition", score: 8.7, price: 57 },
    { id: "cab-mobo-moddiy-ultraflex", brand: "MODDIY", category: "Carte mère (24-pin)", name: "24-pin ultra-flex silicone", score: 9.0, price: 61 },
    { id: "cab-gpu-1x8-ezdiy", brand: "EZDIY-FAB", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU custom 1x8-pin ARGB", score: 8.1, price: 26, requiredPcie8: 1 },
    { id: "cab-gpu-2x8-silverstone", brand: "SilverStone", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU custom 2x8-pin tressé", score: 8.5, price: 43, requiredPcie8: 2 },
    { id: "cab-gpu-3x8-coolermaster", brand: "Cooler Master", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU custom 3x8-pin premium", score: 8.9, price: 58, requiredPcie8: 3 },
    { id: "cab-gpu-12vhpwr-corsair-elite", brand: "Corsair", category: "Carte graphique (PCIe/12VHPWR)", name: "12V-2x6 Elite braided", score: 9.5, price: 109, requires12vhpwr: true },
    { id: "cab-gpu-12vhpwr-lianli-v3", brand: "Lian Li", category: "Carte graphique (PCIe/12VHPWR)", name: "Strimer V3 12VHPWR", score: 9.4, price: 96, requires12vhpwr: true },
    { id: "cab-cpu-1eps-modmesh", brand: "CableMod", category: "CPU (EPS 8-pin)", name: "CPU custom 1x8-pin ModMesh", score: 8.5, price: 33, requiredEps8: 1 },
    { id: "cab-cpu-2eps-silverstone", brand: "SilverStone", category: "CPU (EPS 8-pin)", name: "CPU custom 2x8-pin premium", score: 8.9, price: 49, requiredEps8: 2 },
    { id: "cab-cpu-2eps-moddiy", brand: "MODDIY", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS silicone ultra-flex", score: 9.1, price: 54, requiredEps8: 2 },
    { id: "cab-oth-fan-hub-lianli", brand: "Lian Li", category: "Autres (SATA/ARGB/FAN)", name: "Pack routing UNI FAN hub + extensions", score: 9.2, price: 76 },
    { id: "cab-oth-corsair-link-pro", brand: "Corsair", category: "Autres (SATA/ARGB/FAN)", name: "iCUE LINK Pro routing set", score: 9.1, price: 74 },
    { id: "cab-oth-phanteks-neon", brand: "Phanteks", category: "Autres (SATA/ARGB/FAN)", name: "Pack D-RGB Neon + extensions", score: 8.6, price: 41 },
    { id: "cab-oth-thermalright-rgb", brand: "Thermalright", category: "Autres (SATA/ARGB/FAN)", name: "Kit ARGB/FAN tidy wiring", score: 8.0, price: 24 },
    { id: "cab-mobo-cablemod-pro-180", brand: "CableMod", category: "Carte mère (24-pin)", name: "24-pin Pro coudé 180°", score: 9.3, price: 82 },
    { id: "cab-mobo-corsair-rgb-v2", brand: "Corsair", category: "Carte mère (24-pin)", name: "24-pin RGB braided V2", score: 8.9, price: 68 },
    { id: "cab-mobo-ezdiy-white", brand: "EZDIY-FAB", category: "Carte mère (24-pin)", name: "24-pin white premium", score: 8.2, price: 37 },
    { id: "cab-mobo-asiahorse-rgb-v3", brand: "AsiaHorse", category: "Carte mère (24-pin)", name: "24-pin RGB v3", score: 8.6, price: 49 },
    { id: "cab-mobo-phanteks-drgb", brand: "Phanteks", category: "Carte mère (24-pin)", name: "24-pin D-RGB extension", score: 8.5, price: 46 },
    { id: "cab-gpu-1x8-cablemod-pro", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 1x8-pin Pro", score: 8.4, price: 34, requiredPcie8: 1 },
    { id: "cab-gpu-2x8-lianli-v3", brand: "Lian Li", category: "Carte graphique (PCIe/12VHPWR)", name: "Strimer V3 double 8-pin", score: 9.2, price: 83, requiredPcie8: 2 },
    { id: "cab-gpu-2x8-corsair-prem", brand: "Corsair", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 2x8-pin premium", score: 8.8, price: 52, requiredPcie8: 2 },
    { id: "cab-gpu-3x8-cablemod-pro", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 3x8-pin Pro", score: 9.1, price: 73, requiredPcie8: 3 },
    { id: "cab-gpu-3x8-phanteks", brand: "Phanteks", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 3x8-pin D-RGB", score: 8.7, price: 59, requiredPcie8: 3 },
    { id: "cab-gpu-12vhpwr-cablemod-pro", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "12V-2x6 Pro ModMesh", score: 9.6, price: 119, requires12vhpwr: true },
    { id: "cab-gpu-12vhpwr-thermaltake-v2", brand: "Thermaltake", category: "Carte graphique (PCIe/12VHPWR)", name: "12VHPWR premium V2", score: 9.2, price: 93, requires12vhpwr: true },
    { id: "cab-gpu-12vhpwr-bequiet-pro", brand: "be quiet!", category: "Carte graphique (PCIe/12VHPWR)", name: "12VHPWR black pro", score: 9.1, price: 89, requires12vhpwr: true },
    { id: "cab-cpu-1eps-lianli-rgb", brand: "Lian Li", category: "CPU (EPS 8-pin)", name: "CPU 1xEPS RGB premium", score: 8.7, price: 47, requiredEps8: 1 },
    { id: "cab-cpu-1eps-corsair-prem", brand: "Corsair", category: "CPU (EPS 8-pin)", name: "CPU 1xEPS premium", score: 8.6, price: 35, requiredEps8: 1 },
    { id: "cab-cpu-2eps-cablemod-pro", brand: "CableMod", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS Pro ModMesh", score: 9.2, price: 63, requiredEps8: 2 },
    { id: "cab-cpu-2eps-asiahorse", brand: "AsiaHorse", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS ARGB", score: 8.5, price: 46, requiredEps8: 2 },
    { id: "cab-cpu-2eps-coolermaster", brand: "Cooler Master", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS braided", score: 8.6, price: 45, requiredEps8: 2 },
    { id: "cab-oth-sata-prem", brand: "CableMod", category: "Autres (SATA/ARGB/FAN)", name: "SATA premium sleeved set", score: 8.5, price: 33 },
    { id: "cab-oth-argb-pro", brand: "Phanteks", category: "Autres (SATA/ARGB/FAN)", name: "D-RGB pro routing pack", score: 8.8, price: 44 },
    { id: "cab-oth-fan-corsair", brand: "Corsair", category: "Autres (SATA/ARGB/FAN)", name: "Fan hub + extensions premium", score: 8.9, price: 52 },
    { id: "cab-oth-fan-lianli-v2", brand: "Lian Li", category: "Autres (SATA/ARGB/FAN)", name: "UNI FAN routing set V2", score: 9.2, price: 79 },
    { id: "cab-mobo-lianli-strimer-v3", brand: "Lian Li", category: "Carte mère (24-pin)", name: "Strimer V3 24-pin", score: 9.4, price: 109 },
    { id: "cab-mobo-nzxt-sleeved-24", brand: "NZXT", category: "Carte mère (24-pin)", name: "24-pin sleeved premium", score: 8.4, price: 44 },
    { id: "cab-mobo-fractal-flex", brand: "Fractal", category: "Carte mère (24-pin)", name: "24-pin Flex B-20", score: 8.2, price: 39 },
    { id: "cab-gpu-4x8-cablemod-pro", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 4x8-pin Pro", score: 9.2, price: 89, requiredPcie8: 4 },
    { id: "cab-gpu-12vhpwr-lianli-v3-plus", brand: "Lian Li", category: "Carte graphique (PCIe/12VHPWR)", name: "Strimer V3 Plus 12VHPWR", score: 9.6, price: 119, requires12vhpwr: true },
    { id: "cab-gpu-12vhpwr-msi-meg", brand: "MSI", category: "Carte graphique (PCIe/12VHPWR)", name: "12VHPWR MEG braided", score: 9.0, price: 84, requires12vhpwr: true },
    { id: "cab-cpu-3eps-cablemod", brand: "CableMod", category: "CPU (EPS 8-pin)", name: "CPU 3xEPS ModMesh", score: 9.3, price: 77, requiredEps8: 3 },
    { id: "cab-cpu-2eps-bequiet", brand: "be quiet!", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS premium black", score: 8.8, price: 48, requiredEps8: 2 },
    { id: "cab-cpu-1eps-nzxt", brand: "NZXT", category: "CPU (EPS 8-pin)", name: "CPU 1xEPS sleeved", score: 8.1, price: 28, requiredEps8: 1 },
    { id: "cab-oth-argb-lianli-v3", brand: "Lian Li", category: "Autres (SATA/ARGB/FAN)", name: "Pack ARGB V3 + hub", score: 9.1, price: 69 },
    { id: "cab-oth-fan-phanteks-d30", brand: "Phanteks", category: "Autres (SATA/ARGB/FAN)", name: "D30 routing & splitters", score: 8.7, price: 41 }
  ]
};

const CATALOG_EXPANSION_PLUS = {
  cpu: [
    { id: "cpu-amd-r5-5600x3d", brand: "AMD", name: "Ryzen 5 5600X3D", generation: 5000, socket: "AM4", tdp: 105, rank: 6.6, score: 8.1, price: 229 },
    { id: "cpu-amd-r7-5800x", brand: "AMD", name: "Ryzen 7 5800X", generation: 5000, socket: "AM4", tdp: 105, rank: 6.8, score: 8.2, price: 229 },
    { id: "cpu-amd-r9-7900x3d-retail", brand: "AMD", name: "Ryzen 9 7900X3D", generation: 7000, socket: "AM5", tdp: 120, rank: 8.9, score: 9.4, price: 559 },
    { id: "cpu-amd-r5-9600", brand: "AMD", name: "Ryzen 5 9600", generation: 9000, socket: "AM5", tdp: 65, rank: 7.0, score: 8.6, price: 249 },
    { id: "cpu-intel-i5-13400", brand: "Intel", name: "Core i5-13400", generation: 13000, socket: "1700", tdp: 65, rank: 6.5, score: 8.1, price: 219 },
    { id: "cpu-intel-u5-235f", brand: "Intel", name: "Core Ultra 5 235F", generation: 20000, socket: "1851", tdp: 65, rank: 7.3, score: 8.9, price: 269 },
    { id: "cpu-intel-u7-275k", brand: "Intel", name: "Core Ultra 7 275K", generation: 20000, socket: "1851", tdp: 125, rank: 8.8, score: 9.5, price: 419 },
    { id: "cpu-intel-u9-285kf", brand: "Intel", name: "Core Ultra 9 285KF", generation: 20000, socket: "1851", tdp: 125, rank: 9.3, score: 9.7, price: 609 }
  ],
  mobo: [
    { id: "mb-msi-b550m-mortar", brand: "MSI", name: "MAG B550M Mortar", generation: 550, socket: "AM4", ramType: "DDR4", tier: 2, score: 8.1, price: 149 },
    { id: "mb-asrock-b550-taichi", brand: "ASRock", name: "B550 Taichi", generation: 550, socket: "AM4", ramType: "DDR4", tier: 3, score: 8.8, price: 249 },
    { id: "mb-giga-x870-aero", brand: "Gigabyte", name: "X870 AERO G", generation: 870, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.3, price: 499 },
    { id: "mb-asus-b650e-i", brand: "ASUS", name: "ROG Strix B650E-I Gaming WiFi", generation: 650, socket: "AM5", ramType: "DDR5", tier: 3, score: 8.9, price: 359 },
    { id: "mb-msi-z790-carbon-max", brand: "MSI", name: "MPG Z790 Carbon MAX WiFi", generation: 790, socket: "1700", ramType: "DDR5", tier: 4, score: 9.2, price: 449 },
    { id: "mb-giga-z790-aero-g", brand: "Gigabyte", name: "Z790 AERO G", generation: 790, socket: "1700", ramType: "DDR5", tier: 4, score: 9.1, price: 429 },
    { id: "mb-asus-z890-hero", brand: "ASUS", name: "ROG Maximus Z890 Hero", generation: 890, socket: "1851", ramType: "DDR5", tier: 4, score: 9.7, price: 829 },
    { id: "mb-msi-z890-tom", brand: "MSI", name: "MAG Z890 Tomahawk WiFi", generation: 890, socket: "1851", ramType: "DDR5", tier: 3, score: 9.0, price: 379 }
  ],
  ram: [
    { id: "ram-corsair-64-ddr5-6000", brand: "Corsair", name: "Vengeance 64 Go DDR5-6000 CL30", generation: 6000, type: "DDR5", gb: 64, score: 9.4, price: 229 },
    { id: "ram-gskill-64-ddr5-6400-neo", brand: "G.Skill", name: "Trident Z5 Neo 64 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 64, score: 9.5, price: 289 },
    { id: "ram-kingston-32-ddr4-3600", brand: "Kingston", name: "Fury Beast 32 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 32, score: 7.8, price: 79 },
    { id: "ram-crucial-48-ddr5-5600", brand: "Crucial", name: "Pro 48 Go DDR5-5600", generation: 5600, type: "DDR5", gb: 48, score: 8.8, price: 169 },
    { id: "ram-team-32-ddr5-7200", brand: "TeamGroup", name: "T-Force Delta 32 Go DDR5-7200", generation: 7200, type: "DDR5", gb: 32, score: 9.4, price: 229 },
    { id: "ram-corsair-128-ddr5-5600", brand: "Corsair", name: "Vengeance 128 Go DDR5-5600", generation: 5600, type: "DDR5", gb: 128, score: 9.8, price: 689 },
    { id: "ram-adata-64-ddr4-3600", brand: "ADATA", name: "XPG Spectrix 64 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 64, score: 8.2, price: 159 },
    { id: "ram-kingston-32-ddr5-6400", brand: "Kingston", name: "Fury Renegade 32 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 32, score: 9.2, price: 159 }
  ],
  gpu: [
    { id: "gpu-nv-4060s", brand: "NVIDIA", name: "GeForce RTX 4060 SUPER 8 Go", generation: 4000, vram: 8, tdp: 135, length: 255, rank: 6.9, score: 8.4, price: 419 },
    { id: "gpu-nv-4070s-oc", brand: "NVIDIA", name: "GeForce RTX 4070 SUPER OC 12 Go", generation: 4000, vram: 12, tdp: 220, length: 312, rank: 8.3, score: 9.2, price: 739 },
    { id: "gpu-nv-4080s-oc", brand: "NVIDIA", name: "GeForce RTX 4080 SUPER OC 16 Go", generation: 4000, vram: 16, tdp: 330, length: 340, rank: 9.2, score: 9.7, price: 1349 },
    { id: "gpu-nv-5070ti-oc", brand: "NVIDIA", name: "GeForce RTX 5070 Ti OC 16 Go", generation: 5000, vram: 16, tdp: 310, length: 334, rank: 9.3, score: 9.7, price: 999 },
    { id: "gpu-nv-5080-oc", brand: "NVIDIA", name: "GeForce RTX 5080 OC 16 Go", generation: 5000, vram: 16, tdp: 360, length: 345, rank: 9.6, score: 9.9, price: 1649 },
    { id: "gpu-amd-rx7600-xt-oc", brand: "AMD", name: "Radeon RX 7600 XT OC 16 Go", generation: 7000, vram: 16, tdp: 195, length: 285, rank: 7.0, score: 8.4, price: 399 },
    { id: "gpu-amd-rx7900xt-oc", brand: "AMD", name: "Radeon RX 7900 XT OC 20 Go", generation: 7000, vram: 20, tdp: 320, length: 338, rank: 9.0, score: 9.5, price: 969 },
    { id: "gpu-amd-rx9070xt-oc", brand: "AMD", name: "Radeon RX 9070 XT OC 16 Go", generation: 9000, vram: 16, tdp: 320, length: 334, rank: 9.2, score: 9.7, price: 829 },
    { id: "gpu-intel-b770-oc", brand: "Intel", name: "Arc B770 OC 16 Go", generation: 700, vram: 16, tdp: 245, length: 295, rank: 7.4, score: 8.9, price: 449 }
  ],
  storage: [
    { id: "sto-sam-990evo-plus-1", brand: "Samsung", name: "990 EVO Plus 1 To", generation: 4, tb: 1, score: 8.8, price: 99 },
    { id: "sto-sam-990evo-plus-2", brand: "Samsung", name: "990 EVO Plus 2 To", generation: 4, tb: 2, score: 9.0, price: 159 },
    { id: "sto-crucial-t705-4", brand: "Crucial", name: "T705 PCIe 5.0 4 To", generation: 5, tb: 4, score: 9.9, price: 619 },
    { id: "sto-lexar-nm1090-4", brand: "Lexar", name: "NM1090 PCIe 5.0 4 To", generation: 5, tb: 4, score: 9.8, price: 569 },
    { id: "sto-seagate-firecuda-4", brand: "Seagate", name: "FireCuda 530 4 To", generation: 4, tb: 4, score: 9.4, price: 349 },
    { id: "sto-wd-sn770-4", brand: "WD", name: "Black SN770 4 To", generation: 4, tb: 4, score: 8.9, price: 259 },
    { id: "sto-kioxia-exceria-4", brand: "Kioxia", name: "Exceria Pro 4 To", generation: 4, tb: 4, score: 8.8, price: 269 },
    { id: "sto-atelier-4plus8", brand: "Atelier", name: "NVMe 4 To + HDD 8 To Pro", generation: 4, tb: 12, score: 9.2, price: 469 }
  ],
  psu: [
    { id: "psu-corsair-rm850x", brand: "Corsair", name: "RM850x Gold", generation: 850, watts: 850, score: 9.0, price: 179 },
    { id: "psu-corsair-rm1200x-shift", brand: "Corsair", name: "RM1200x Shift", generation: 1200, watts: 1200, score: 9.4, price: 319 },
    { id: "psu-msi-a850g", brand: "MSI", name: "MAG A850G PCIE5", generation: 850, watts: 850, score: 8.9, price: 169 },
    { id: "psu-gigabyte-ud1000gm", brand: "Gigabyte", name: "UD1000GM PG5", generation: 1000, watts: 1000, score: 8.9, price: 199 },
    { id: "psu-seasonic-vertex-1000", brand: "Seasonic", name: "Vertex GX-1000", generation: 1000, watts: 1000, score: 9.3, price: 239 },
    { id: "psu-bequiet-pure-1000", brand: "be quiet!", name: "Pure Power 12 M 1000W", generation: 1000, watts: 1000, score: 9.1, price: 209 },
    { id: "psu-asus-thor-1200", brand: "ASUS", name: "ROG Thor 1200P2", generation: 1200, watts: 1200, score: 9.7, price: 449 },
    { id: "psu-coolermaster-gx850", brand: "Cooler Master", name: "GX III Gold 850W", generation: 850, watts: 850, score: 8.8, price: 159 }
  ],
  case: [
    { id: "case-lianli-o11d-evo-rgb", brand: "Lian Li", name: "O11D EVO RGB", generation: 11, maxGpu: 455, maxRad: 420, score: 9.4, price: 219 },
    { id: "case-nzxt-h9-elite", brand: "NZXT", name: "H9 Elite", generation: 9, maxGpu: 435, maxRad: 360, score: 9.2, price: 259 },
    { id: "case-corsair-5000x", brand: "Corsair", name: "iCUE 5000X RGB", generation: 5000, maxGpu: 400, maxRad: 360, score: 8.9, price: 199 },
    { id: "case-fractal-north-xl-charcoal", brand: "Fractal", name: "North XL Charcoal", generation: 2, maxGpu: 413, maxRad: 420, score: 9.3, price: 219 },
    { id: "case-phanteks-g500a-drgb", brand: "Phanteks", name: "G500A DRGB", generation: 500, maxGpu: 435, maxRad: 420, score: 9.3, price: 189 },
    { id: "case-bequiet-shadow-base-800fx", brand: "be quiet!", name: "Shadow Base 800 FX", generation: 800, maxGpu: 430, maxRad: 420, score: 9.1, price: 189 },
    { id: "case-montech-king95-ultra", brand: "Montech", name: "King 95 Ultra", generation: 95, maxGpu: 420, maxRad: 420, score: 9.0, price: 179 },
    { id: "case-msi-pano-m100r", brand: "MSI", name: "MAG PANO M100R", generation: 100, maxGpu: 390, maxRad: 360, score: 8.7, price: 139 },
    { id: "case-hyte-y60", brand: "HYTE", name: "Y60", generation: 60, maxGpu: 375, maxRad: 360, score: 8.8, price: 209 },
    { id: "case-thermaltake-view-380", brand: "Thermaltake", name: "View 380 TG", generation: 380, maxGpu: 410, maxRad: 360, score: 8.7, price: 149 }
  ],
  watercooling: [
    { id: "cool-aio-240-lianli-ga2", brand: "Lian Li", name: "Galahad II 240", type: "aio", radiator: 240, score: 8.9, price: 149 },
    { id: "cool-aio-360-nzxt-kraken-elite", brand: "NZXT", name: "Kraken Elite 360", type: "aio", radiator: 360, score: 9.5, price: 299 },
    { id: "cool-aio-360-corsair-link-lcd", brand: "Corsair", name: "iCUE Link H150i LCD", type: "aio", radiator: 360, score: 9.5, price: 309 },
    { id: "cool-aio-420-arctic-pro", brand: "Arctic", name: "Liquid Freezer III 420 Pro", type: "aio", radiator: 420, score: 9.7, price: 239 },
    { id: "cool-air-noctua-u14s", brand: "Noctua", name: "NH-U14S", type: "air", radiator: 0, score: 8.8, price: 99 },
    { id: "cool-air-bequiet-drp5", brand: "be quiet!", name: "Dark Rock Pro 5", type: "air", radiator: 0, score: 9.2, price: 109 },
    { id: "cool-air-thermalright-ps120se", brand: "Thermalright", name: "Phantom Spirit 120 SE", type: "air", radiator: 0, score: 8.9, price: 59 },
    { id: "cool-aio-280-asus-tuf", brand: "ASUS", name: "TUF LC II 280 ARGB", type: "aio", radiator: 280, score: 9.0, price: 179 }
  ],
  customCables: [
    { id: "cab-mobo-cablemod-cseries", brand: "CableMod", category: "Carte mère (24-pin)", name: "C-Series PRO 24-pin", score: 9.2, price: 74 },
    { id: "cab-mobo-lianli-strimer-v3-white", brand: "Lian Li", category: "Carte mère (24-pin)", name: "Strimer V3 24-pin White", score: 9.4, price: 109 },
    { id: "cab-gpu-cablemod-2x8-pro", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 2x8 Pro ModMesh", score: 9.0, price: 63, requiredPcie8: 2 },
    { id: "cab-gpu-cablemod-3x8-pro-v2", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 3x8 Pro ModMesh V2", score: 9.2, price: 79, requiredPcie8: 3 },
    { id: "cab-gpu-lianli-12vhpwr-v3-white", brand: "Lian Li", category: "Carte graphique (PCIe/12VHPWR)", name: "Strimer V3 12VHPWR White", score: 9.5, price: 119, requires12vhpwr: true },
    { id: "cab-gpu-corsair-12vhpwr-prem", brand: "Corsair", category: "Carte graphique (PCIe/12VHPWR)", name: "12V-2x6 Premium Sleeved", score: 9.3, price: 99, requires12vhpwr: true },
    { id: "cab-cpu-cablemod-2eps-pro-v2", brand: "CableMod", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS Pro V2", score: 9.2, price: 66, requiredEps8: 2 },
    { id: "cab-cpu-corsair-2eps-elite", brand: "Corsair", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS Elite", score: 8.9, price: 52, requiredEps8: 2 },
    { id: "cab-cpu-lianli-eps-rgb-v3", brand: "Lian Li", category: "CPU (EPS 8-pin)", name: "EPS RGB V3", score: 8.8, price: 58, requiredEps8: 1 },
    { id: "cab-oth-lianli-unifan-v3", brand: "Lian Li", category: "Autres (SATA/ARGB/FAN)", name: "UNI FAN routing V3", score: 9.2, price: 82 },
    { id: "cab-oth-corsair-link-routing-max", brand: "Corsair", category: "Autres (SATA/ARGB/FAN)", name: "iCUE LINK Routing Max", score: 9.1, price: 76 },
    { id: "cab-oth-phanteks-d30-plus", brand: "Phanteks", category: "Autres (SATA/ARGB/FAN)", name: "D30 Routing Plus", score: 8.8, price: 49 }
  ]
};

const CATALOG_EXPANSION_MAX = {
  cpu: [
    { id: "cpu-amd-r9-5900xt", brand: "AMD", name: "Ryzen 9 5900XT", generation: 5000, socket: "AM4", tdp: 105, rank: 7.4, score: 8.7, price: 339 },
    { id: "cpu-amd-r7-7700x3d", brand: "AMD", name: "Ryzen 7 7700X3D", generation: 7000, socket: "AM5", tdp: 120, rank: 8.6, score: 9.3, price: 479 },
    { id: "cpu-amd-r5-9500x", brand: "AMD", name: "Ryzen 5 9500X", generation: 9000, socket: "AM5", tdp: 65, rank: 6.9, score: 8.5, price: 229 },
    { id: "cpu-intel-i7-14700kf-special", brand: "Intel", name: "Core i7-14700KF", generation: 14000, socket: "1700", tdp: 125, rank: 8.4, score: 9.3, price: 389 },
    { id: "cpu-intel-u5-245f", brand: "Intel", name: "Core Ultra 5 245F", generation: 20000, socket: "1851", tdp: 65, rank: 7.5, score: 9.0, price: 279 }
  ],
  mobo: [
    { id: "mb-asus-b550m-plus", brand: "ASUS", name: "TUF B550M-PLUS", generation: 550, socket: "AM4", ramType: "DDR4", tier: 2, score: 7.9, price: 139 },
    { id: "mb-msi-x670e-ace", brand: "MSI", name: "MEG X670E ACE", generation: 670, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.6, price: 699 },
    { id: "mb-giga-b650e-master", brand: "Gigabyte", name: "B650E Aorus Master", generation: 650, socket: "AM5", ramType: "DDR5", tier: 4, score: 9.2, price: 389 },
    { id: "mb-asrock-z890-taichi", brand: "ASRock", name: "Z890 Taichi", generation: 890, socket: "1851", ramType: "DDR5", tier: 4, score: 9.4, price: 549 }
  ],
  ram: [
    { id: "ram-gskill-32-ddr5-6000-cl30", brand: "G.Skill", name: "Trident Z5 32 Go DDR5-6000 CL30", generation: 6000, type: "DDR5", gb: 32, score: 9.3, price: 149 },
    { id: "ram-corsair-32-ddr5-6400-cl32", brand: "Corsair", name: "Vengeance RGB 32 Go DDR5-6400 CL32", generation: 6400, type: "DDR5", gb: 32, score: 9.3, price: 179 },
    { id: "ram-team-64-ddr5-6000", brand: "TeamGroup", name: "T-Force Delta 64 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 64, score: 9.2, price: 249 },
    { id: "ram-crucial-64-ddr4-3600", brand: "Crucial", name: "Pro 64 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 64, score: 8.1, price: 149 }
  ],
  gpu: [
    { id: "gpu-nv-4060ti-16", brand: "NVIDIA", name: "GeForce RTX 4060 Ti 16 Go", generation: 4000, vram: 16, tdp: 165, length: 285, rank: 7.4, score: 8.7, price: 529 },
    { id: "gpu-nv-5070", brand: "NVIDIA", name: "GeForce RTX 5070 12 Go", generation: 5000, vram: 12, tdp: 250, length: 310, rank: 8.8, score: 9.4, price: 739 },
    { id: "gpu-amd-rx7700xt", brand: "AMD", name: "Radeon RX 7700 XT 12 Go", generation: 7000, vram: 12, tdp: 245, length: 300, rank: 7.9, score: 8.9, price: 499 },
    { id: "gpu-amd-rx7900gre", brand: "AMD", name: "Radeon RX 7900 GRE 16 Go", generation: 7000, vram: 16, tdp: 260, length: 320, rank: 8.7, score: 9.2, price: 619 }
  ],
  storage: [
    { id: "sto-wd-sn850x-4", brand: "WD", name: "Black SN850X 4 To", generation: 4, tb: 4, score: 9.5, price: 349 },
    { id: "sto-sam-990pro-4", brand: "Samsung", name: "990 PRO 4 To", generation: 4, tb: 4, score: 9.6, price: 389 },
    { id: "sto-sabrent-rocket5-2", brand: "Sabrent", name: "Rocket 5 PCIe 5.0 2 To", generation: 5, tb: 2, score: 9.7, price: 339 }
  ],
  psu: [
    { id: "psu-corsair-rm1000x-shift", brand: "Corsair", name: "RM1000x Shift", generation: 1000, watts: 1000, score: 9.2, price: 239 },
    { id: "psu-seasonic-focus-850", brand: "Seasonic", name: "Focus GX-850", generation: 850, watts: 850, score: 8.9, price: 169 },
    { id: "psu-fsp-hydro-1000", brand: "FSP", name: "Hydro PTM Pro 1000W", generation: 1000, watts: 1000, score: 9.1, price: 219 }
  ],
  case: [
    { id: "case-corsair-5000d-airflow", brand: "Corsair", name: "5000D Airflow", generation: 5000, maxGpu: 400, maxRad: 360, score: 9.1, price: 189 },
    { id: "case-lianli-lancool-216", brand: "Lian Li", name: "LANCOOL 216", generation: 216, maxGpu: 392, maxRad: 360, score: 8.9, price: 109 },
    { id: "case-phanteks-nv5", brand: "Phanteks", name: "NV5", generation: 5, maxGpu: 440, maxRad: 420, score: 9.2, price: 199 },
    { id: "case-hyte-y70", brand: "HYTE", name: "Y70 Touch", generation: 70, maxGpu: 422, maxRad: 360, score: 9.1, price: 349 }
  ],
  watercooling: [
    { id: "cool-aio-360-arctic-lf3", brand: "Arctic", name: "Liquid Freezer III 360", type: "aio", radiator: 360, score: 9.4, price: 149 },
    { id: "cool-aio-360-deepcool-ls720", brand: "DeepCool", name: "LS720", type: "aio", radiator: 360, score: 9.1, price: 139 },
    { id: "cool-air-noctua-d15-g2", brand: "Noctua", name: "NH-D15 G2", type: "air", radiator: 0, score: 9.5, price: 149 },
    { id: "cool-air-deepcool-assassin4", brand: "DeepCool", name: "Assassin IV", type: "air", radiator: 0, score: 9.1, price: 99 }
  ],
  customCables: [
    { id: "cab-mobo-lianli-strimer-v3-black", brand: "Lian Li", category: "Carte mère (24-pin)", name: "Strimer V3 24-pin Black", score: 9.4, price: 109 },
    { id: "cab-mobo-corsair-24-rgb-pro", brand: "Corsair", category: "Carte mère (24-pin)", name: "24-pin RGB Pro", score: 8.8, price: 69 },
    { id: "cab-gpu-lianli-12vhpwr-v3-black", brand: "Lian Li", category: "Carte graphique (PCIe/12VHPWR)", name: "Strimer V3 12VHPWR Black", score: 9.5, price: 119, requires12vhpwr: true },
    { id: "cab-gpu-cablemod-4x8-ultra", brand: "CableMod", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 4x8 Ultra ModMesh", score: 9.3, price: 94, requiredPcie8: 4 },
    { id: "cab-cpu-cablemod-2eps-stealth", brand: "CableMod", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS Stealth", score: 9.0, price: 59, requiredEps8: 2 },
    { id: "cab-oth-lianli-control-hub", brand: "Lian Li", category: "Autres (SATA/ARGB/FAN)", name: "Hub controle RGB/FAN premium", score: 9.0, price: 59 }
  ]
};

const CATALOG_EXPANSION_INFINITY = {
  cpu: [
    { id: "cpu-amd-r7-5700x-eco", brand: "AMD", name: "Ryzen 7 5700X (Eco)", generation: 5000, socket: "AM4", tdp: 65, rank: 6.1, score: 7.8, price: 189 },
    { id: "cpu-amd-r9-7900", brand: "AMD", name: "Ryzen 9 7900", generation: 7000, socket: "AM5", tdp: 65, rank: 8.1, score: 9.0, price: 389 },
    { id: "cpu-intel-i5-14500f", brand: "Intel", name: "Core i5-14500F", generation: 14000, socket: "1700", tdp: 65, rank: 6.9, score: 8.6, price: 249 },
    { id: "cpu-intel-i9-13900kf", brand: "Intel", name: "Core i9-13900KF", generation: 13000, socket: "1700", tdp: 125, rank: 8.7, score: 9.4, price: 499 }
  ],
  mobo: [
    { id: "mb-msi-pro-b550m-pgen3", brand: "MSI", name: "PRO B550M-P GEN3", generation: 550, socket: "AM4", ramType: "DDR4", tier: 1, score: 7.0, price: 99 },
    { id: "mb-asus-prime-b760m-a-d4", brand: "ASUS", name: "Prime B760M-A D4", generation: 760, socket: "1700", ramType: "DDR4", tier: 2, score: 7.9, price: 149 },
    { id: "mb-giga-b650m-ds3h", brand: "Gigabyte", name: "B650M DS3H", generation: 650, socket: "AM5", ramType: "DDR5", tier: 1, score: 7.7, price: 159 },
    { id: "mb-msi-z790-tomahawk-max", brand: "MSI", name: "MAG Z790 Tomahawk MAX WiFi", generation: 790, socket: "1700", ramType: "DDR5", tier: 3, score: 9.0, price: 339 }
  ],
  ram: [
    { id: "ram-corsair-16-ddr4-3200", brand: "Corsair", name: "Vengeance 16 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 16, score: 7.0, price: 49 },
    { id: "ram-kingston-16-ddr4-3200", brand: "Kingston", name: "Fury Beast 16 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 16, score: 7.1, price: 45 },
    { id: "ram-crucial-32-ddr5-5600", brand: "Crucial", name: "Pro 32 Go DDR5-5600", generation: 5600, type: "DDR5", gb: 32, score: 8.7, price: 119 },
    { id: "ram-gskill-32-ddr5-7200", brand: "G.Skill", name: "Trident Z5 32 Go DDR5-7200", generation: 7200, type: "DDR5", gb: 32, score: 9.5, price: 239 }
  ],
  gpu: [
    { id: "gpu-nv-3060-12", brand: "NVIDIA", name: "GeForce RTX 3060 12 Go", generation: 3000, vram: 12, tdp: 170, length: 250, rank: 6.5, score: 7.9, price: 319 },
    { id: "gpu-nv-3060ti", brand: "NVIDIA", name: "GeForce RTX 3060 Ti 8 Go", generation: 3000, vram: 8, tdp: 200, length: 270, rank: 6.9, score: 8.3, price: 369 },
    { id: "gpu-amd-rx7600", brand: "AMD", name: "Radeon RX 7600 8 Go", generation: 7000, vram: 8, tdp: 165, length: 265, rank: 6.6, score: 8.0, price: 309 },
    { id: "gpu-intel-a770-16", brand: "Intel", name: "Arc A770 16 Go", generation: 700, vram: 16, tdp: 225, length: 280, rank: 7.1, score: 8.4, price: 359 }
  ],
  storage: [
    { id: "sto-king-nv2-2", brand: "Kingston", name: "NV2 2 To", generation: 4, tb: 2, score: 8.2, price: 109 },
    { id: "sto-crucial-p3plus-2", brand: "Crucial", name: "P3 Plus 2 To", generation: 4, tb: 2, score: 8.3, price: 109 },
    { id: "sto-wd-sn850x-2", brand: "WD", name: "Black SN850X 2 To", generation: 4, tb: 2, score: 9.4, price: 199 },
    { id: "sto-sam-980pro-2", brand: "Samsung", name: "980 PRO 2 To", generation: 4, tb: 2, score: 9.2, price: 179 }
  ],
  psu: [
    { id: "psu-corsair-cx650", brand: "Corsair", name: "CX650 Bronze", generation: 650, watts: 650, score: 7.8, price: 89 },
    { id: "psu-bequiet-pure-850", brand: "be quiet!", name: "Pure Power 12 M 850W", generation: 850, watts: 850, score: 8.9, price: 149 },
    { id: "psu-msi-a750gl", brand: "MSI", name: "MAG A750GL PCIE5", generation: 750, watts: 750, score: 8.5, price: 129 },
    { id: "psu-seasonic-focus-1000", brand: "Seasonic", name: "Focus GX-1000", generation: 1000, watts: 1000, score: 9.2, price: 219 }
  ],
  case: [
    { id: "case-msi-mag-forge-100r", brand: "MSI", name: "MAG Forge 100R", generation: 100, maxGpu: 330, maxRad: 240, score: 7.4, price: 89 },
    { id: "case-corsair-3000d-airflow", brand: "Corsair", name: "3000D Airflow", generation: 3000, maxGpu: 360, maxRad: 360, score: 8.3, price: 99 },
    { id: "case-fractal-pop-air", brand: "Fractal", name: "Pop Air", generation: 1, maxGpu: 405, maxRad: 280, score: 8.5, price: 109 },
    { id: "case-montech-air-903-max", brand: "Montech", name: "Air 903 MAX", generation: 903, maxGpu: 400, maxRad: 360, score: 8.8, price: 99 }
  ],
  watercooling: [
    { id: "cool-air-thermalright-peerless", brand: "Thermalright", name: "Peerless Assassin 120", type: "air", radiator: 0, score: 8.8, price: 49 },
    { id: "cool-aio-240-deepcool-lt520", brand: "DeepCool", name: "LT520", type: "aio", radiator: 240, score: 8.9, price: 109 },
    { id: "cool-aio-360-coolermaster-ml360", brand: "Cooler Master", name: "MasterLiquid ML360", type: "aio", radiator: 360, score: 9.0, price: 139 }
  ],
  customCables: [
    { id: "cab-mobo-asiahorse-24", brand: "AsiaHorse", category: "Carte mère (24-pin)", name: "24-pin extension premium", score: 8.3, price: 29 },
    { id: "cab-gpu-2x8-asiahorse", brand: "AsiaHorse", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 2x8 extension", score: 8.2, price: 27, requiredPcie8: 2 },
    { id: "cab-gpu-12vhpwr-thermaltake-v3", brand: "Thermaltake", category: "Carte graphique (PCIe/12VHPWR)", name: "12VHPWR premium V3", score: 9.0, price: 79, requires12vhpwr: true },
    { id: "cab-cpu-1eps-cablemod", brand: "CableMod", category: "CPU (EPS 8-pin)", name: "CPU 1xEPS ModMesh", score: 8.8, price: 39, requiredEps8: 1 },
    { id: "cab-oth-corsair-rgb-hub-pro", brand: "Corsair", category: "Autres (SATA/ARGB/FAN)", name: "Hub RGB/FAN Pro", score: 8.9, price: 49 }
  ]
};

const CATALOG_EXPANSION_HYPER = {
  cpu: [
    { id: "cpu-amd-r3-4100", brand: "AMD", name: "Ryzen 3 4100", generation: 4000, socket: "AM4", tdp: 65, rank: 4.5, score: 6.2, price: 79 },
    { id: "cpu-amd-r5-4500", brand: "AMD", name: "Ryzen 5 4500", generation: 4000, socket: "AM4", tdp: 65, rank: 5.0, score: 6.8, price: 95 },
    { id: "cpu-amd-r7-5700x-pro", brand: "AMD", name: "Ryzen 7 5700X", generation: 5000, socket: "AM4", tdp: 65, rank: 6.1, score: 7.8, price: 179 },
    { id: "cpu-amd-r9-7900x-pro", brand: "AMD", name: "Ryzen 9 7900X", generation: 7000, socket: "AM5", tdp: 170, rank: 8.4, score: 9.1, price: 399 },
    { id: "cpu-intel-i5-12400", brand: "Intel", name: "Core i5-12400", generation: 12000, socket: "1700", tdp: 65, rank: 5.9, score: 7.5, price: 169 },
    { id: "cpu-intel-i5-13600kf", brand: "Intel", name: "Core i5-13600KF", generation: 13000, socket: "1700", tdp: 125, rank: 7.2, score: 8.8, price: 279 },
    { id: "cpu-intel-i7-12700kf", brand: "Intel", name: "Core i7-12700KF", generation: 12000, socket: "1700", tdp: 125, rank: 7.4, score: 8.8, price: 299 },
    { id: "cpu-intel-i9-12900kf", brand: "Intel", name: "Core i9-12900KF", generation: 12000, socket: "1700", tdp: 125, rank: 8.2, score: 9.1, price: 389 }
  ],
  mobo: [
    { id: "mb-giga-h610m-s2h", brand: "Gigabyte", name: "H610M S2H", generation: 610, socket: "1700", ramType: "DDR4", tier: 1, score: 6.9, price: 89 },
    { id: "mb-msi-b660m-a-ddr4", brand: "MSI", name: "PRO B660M-A DDR4", generation: 660, socket: "1700", ramType: "DDR4", tier: 2, score: 7.7, price: 129 },
    { id: "mb-asus-z690-p-d4", brand: "ASUS", name: "Prime Z690-P D4", generation: 690, socket: "1700", ramType: "DDR4", tier: 3, score: 8.4, price: 229 },
    { id: "mb-asrock-b660m-pro-rs", brand: "ASRock", name: "B660M Pro RS", generation: 660, socket: "1700", ramType: "DDR4", tier: 2, score: 7.6, price: 119 },
    { id: "mb-msi-b760m-gaming-plus-wifi", brand: "MSI", name: "B760M Gaming Plus WiFi", generation: 760, socket: "1700", ramType: "DDR5", tier: 2, score: 8.3, price: 199 },
    { id: "mb-giga-z690-aorus-elite", brand: "Gigabyte", name: "Z690 Aorus Elite", generation: 690, socket: "1700", ramType: "DDR5", tier: 3, score: 8.8, price: 269 },
    { id: "mb-asus-a620m-k", brand: "ASUS", name: "Prime A620M-K", generation: 620, socket: "AM5", ramType: "DDR5", tier: 1, score: 7.2, price: 119 },
    { id: "mb-msi-pro-a620m-e", brand: "MSI", name: "PRO A620M-E", generation: 620, socket: "AM5", ramType: "DDR5", tier: 1, score: 7.1, price: 109 },
    { id: "mb-giga-b650m-k", brand: "Gigabyte", name: "B650M K", generation: 650, socket: "AM5", ramType: "DDR5", tier: 1, score: 7.7, price: 149 },
    { id: "mb-asrock-a620m-hdv", brand: "ASRock", name: "A620M-HDV/M.2", generation: 620, socket: "AM5", ramType: "DDR5", tier: 1, score: 7.0, price: 99 },
    { id: "mb-msi-b450m-pro-vdh", brand: "MSI", name: "B450M PRO-VDH MAX", generation: 450, socket: "AM4", ramType: "DDR4", tier: 1, score: 6.8, price: 89 },
    { id: "mb-asus-b450-plus-ii", brand: "ASUS", name: "TUF B450-PLUS II", generation: 450, socket: "AM4", ramType: "DDR4", tier: 1, score: 7.1, price: 109 },
    { id: "mb-giga-a520m-ds3h", brand: "Gigabyte", name: "A520M DS3H", generation: 520, socket: "AM4", ramType: "DDR4", tier: 1, score: 6.9, price: 79 },
    { id: "mb-asrock-b550m-pro4-2", brand: "ASRock", name: "B550M Pro4", generation: 550, socket: "AM4", ramType: "DDR4", tier: 2, score: 7.7, price: 109 },
    { id: "mb-msi-pro-z890-s", brand: "MSI", name: "PRO Z890-S WiFi", generation: 890, socket: "1851", ramType: "DDR5", tier: 3, score: 8.8, price: 329 }
  ],
  ram: [
    { id: "ram-pny-16-ddr4-3200", brand: "PNY", name: "XLR8 16 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 16, score: 6.9, price: 45 },
    { id: "ram-team-16-ddr4-3200", brand: "TeamGroup", name: "T-Create 16 Go DDR4-3200", generation: 3200, type: "DDR4", gb: 16, score: 6.9, price: 43 },
    { id: "ram-adata-32-ddr4-3600", brand: "ADATA", name: "XPG D35 32 Go DDR4-3600", generation: 3600, type: "DDR4", gb: 32, score: 7.8, price: 79 },
    { id: "ram-lexar-32-ddr5-5600", brand: "Lexar", name: "Ares 32 Go DDR5-5600", generation: 5600, type: "DDR5", gb: 32, score: 8.5, price: 109 },
    { id: "ram-patriot-32-ddr5-6000", brand: "Patriot", name: "Viper Venom 32 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 32, score: 9.0, price: 139 },
    { id: "ram-kingbank-32-ddr5-6400", brand: "KingBank", name: "32 Go DDR5-6400", generation: 6400, type: "DDR5", gb: 32, score: 8.8, price: 129 },
    { id: "ram-crucial-16-ddr5-5600", brand: "Crucial", name: "Pro 16 Go DDR5-5600", generation: 5600, type: "DDR5", gb: 16, score: 8.1, price: 69 },
    { id: "ram-gskill-64-ddr5-6000", brand: "G.Skill", name: "Flare X5 64 Go DDR5-6000", generation: 6000, type: "DDR5", gb: 64, score: 9.3, price: 229 }
  ],
  gpu: [
    { id: "gpu-nv-3050-8", brand: "NVIDIA", name: "GeForce RTX 3050 8 Go", generation: 3000, vram: 8, tdp: 130, length: 240, rank: 5.9, score: 7.4, price: 249 },
    { id: "gpu-nv-3070-8", brand: "NVIDIA", name: "GeForce RTX 3070 8 Go", generation: 3000, vram: 8, tdp: 220, length: 295, rank: 7.8, score: 8.9, price: 529 },
    { id: "gpu-nv-3080-10", brand: "NVIDIA", name: "GeForce RTX 3080 10 Go", generation: 3000, vram: 10, tdp: 320, length: 320, rank: 8.6, score: 9.3, price: 739 },
    { id: "gpu-nv-4070-12", brand: "NVIDIA", name: "GeForce RTX 4070 12 Go", generation: 4000, vram: 12, tdp: 200, length: 300, rank: 8.1, score: 9.0, price: 629 },
    { id: "gpu-nv-4070ti-super-16", brand: "NVIDIA", name: "GeForce RTX 4070 Ti SUPER 16 Go", generation: 4000, vram: 16, tdp: 285, length: 325, rank: 8.9, score: 9.5, price: 939 },
    { id: "gpu-amd-rx6600-8", brand: "AMD", name: "Radeon RX 6600 8 Go", generation: 6000, vram: 8, tdp: 132, length: 250, rank: 6.0, score: 7.5, price: 239 },
    { id: "gpu-amd-rx6650xt-8", brand: "AMD", name: "Radeon RX 6650 XT 8 Go", generation: 6000, vram: 8, tdp: 180, length: 285, rank: 6.7, score: 8.1, price: 289 },
    { id: "gpu-amd-rx6700xt-12", brand: "AMD", name: "Radeon RX 6700 XT 12 Go", generation: 6000, vram: 12, tdp: 230, length: 305, rank: 7.4, score: 8.7, price: 399 },
    { id: "gpu-amd-rx6750xt-12", brand: "AMD", name: "Radeon RX 6750 XT 12 Go", generation: 6000, vram: 12, tdp: 250, length: 310, rank: 7.6, score: 8.8, price: 439 },
    { id: "gpu-amd-rx6800-16", brand: "AMD", name: "Radeon RX 6800 16 Go", generation: 6000, vram: 16, tdp: 250, length: 320, rank: 8.0, score: 9.1, price: 549 },
    { id: "gpu-amd-rx6900xt-16", brand: "AMD", name: "Radeon RX 6900 XT 16 Go", generation: 6000, vram: 16, tdp: 300, length: 330, rank: 8.5, score: 9.3, price: 699 },
    { id: "gpu-intel-a750-8", brand: "Intel", name: "Arc A750 8 Go", generation: 700, vram: 8, tdp: 225, length: 280, rank: 6.8, score: 8.1, price: 279 }
  ],
  storage: [
    { id: "sto-wd-sn580-1", brand: "WD", name: "Blue SN580 1 To", generation: 4, tb: 1, score: 8.4, price: 79 },
    { id: "sto-wd-sn580-2", brand: "WD", name: "Blue SN580 2 To", generation: 4, tb: 2, score: 8.6, price: 129 },
    { id: "sto-lexar-nm790-1", brand: "Lexar", name: "NM790 1 To", generation: 4, tb: 1, score: 8.9, price: 89 },
    { id: "sto-lexar-nm790-2", brand: "Lexar", name: "NM790 2 To", generation: 4, tb: 2, score: 9.1, price: 139 },
    { id: "sto-siliconpower-xs70-2", brand: "Silicon Power", name: "XS70 2 To", generation: 4, tb: 2, score: 8.9, price: 149 },
    { id: "sto-pny-cs3140-2", brand: "PNY", name: "XLR8 CS3140 2 To", generation: 4, tb: 2, score: 9.2, price: 169 },
    { id: "sto-crucial-p3-1", brand: "Crucial", name: "P3 1 To", generation: 3, tb: 1, score: 7.7, price: 69 },
    { id: "sto-crucial-p3-2", brand: "Crucial", name: "P3 2 To", generation: 3, tb: 2, score: 7.9, price: 109 }
  ],
  psu: [
    { id: "psu-thermaltake-gf-a3-750", brand: "Thermaltake", name: "Toughpower GF A3 750W", generation: 750, watts: 750, score: 8.6, price: 119 },
    { id: "psu-thermaltake-gf-a3-850", brand: "Thermaltake", name: "Toughpower GF A3 850W", generation: 850, watts: 850, score: 8.8, price: 139 },
    { id: "psu-xpg-core-reactor-850", brand: "XPG", name: "Core Reactor 850W", generation: 850, watts: 850, score: 9.0, price: 149 },
    { id: "psu-xpg-core-reactor-1000", brand: "XPG", name: "Core Reactor 1000W", generation: 1000, watts: 1000, score: 9.1, price: 189 },
    { id: "psu-silverstone-da850r", brand: "SilverStone", name: "DA850R Gold", generation: 850, watts: 850, score: 8.7, price: 129 },
    { id: "psu-silverstone-da1000r", brand: "SilverStone", name: "DA1000R Gold", generation: 1000, watts: 1000, score: 8.9, price: 169 },
    { id: "psu-fsp-hydro-g-pro-850", brand: "FSP", name: "Hydro G PRO 850W", generation: 850, watts: 850, score: 8.8, price: 139 },
    { id: "psu-enermax-revolution-850", brand: "Enermax", name: "Revolution D.F. 850W", generation: 850, watts: 850, score: 8.7, price: 129 }
  ],
  case: [
    { id: "case-coolermaster-td500-v2", brand: "Cooler Master", name: "MasterBox TD500 Mesh V2", generation: 500, maxGpu: 410, maxRad: 360, score: 8.8, price: 119 },
    { id: "case-coolermaster-h500", brand: "Cooler Master", name: "MasterCase H500", generation: 500, maxGpu: 410, maxRad: 360, score: 8.8, price: 129 },
    { id: "case-antec-c8", brand: "Antec", name: "C8", generation: 8, maxGpu: 430, maxRad: 360, score: 8.9, price: 109 },
    { id: "case-antec-nx410", brand: "Antec", name: "NX410", generation: 410, maxGpu: 335, maxRad: 360, score: 7.7, price: 79 },
    { id: "case-deepcool-ch560", brand: "DeepCool", name: "CH560", generation: 560, maxGpu: 380, maxRad: 360, score: 8.7, price: 109 },
    { id: "case-deepcool-ck560", brand: "DeepCool", name: "CK560", generation: 560, maxGpu: 380, maxRad: 360, score: 8.6, price: 99 },
    { id: "case-sharkoon-rebel-c70g", brand: "Sharkoon", name: "REBEL C70G", generation: 70, maxGpu: 400, maxRad: 360, score: 8.3, price: 99 },
    { id: "case-kolink-observatory-hf", brand: "Kolink", name: "Observatory HF Mesh", generation: 1, maxGpu: 360, maxRad: 360, score: 8.0, price: 89 },
    { id: "case-silverstone-fara-r1-pro", brand: "SilverStone", name: "FARA R1 PRO", generation: 1, maxGpu: 322, maxRad: 240, score: 7.6, price: 69 },
    { id: "case-thermaltake-ceres-300", brand: "Thermaltake", name: "Ceres 300 TG ARGB", generation: 300, maxGpu: 370, maxRad: 360, score: 8.5, price: 109 }
  ],
  watercooling: [
    { id: "cool-air-idcooling-se-226", brand: "ID-Cooling", name: "SE-226-XT", type: "air", radiator: 0, score: 8.3, price: 49 },
    { id: "cool-air-scythe-fuma-3", brand: "Scythe", name: "Fuma 3", type: "air", radiator: 0, score: 8.9, price: 69 },
    { id: "cool-air-deepcool-ak400", brand: "DeepCool", name: "AK400", type: "air", radiator: 0, score: 8.1, price: 39 },
    { id: "cool-air-deepcool-ak620", brand: "DeepCool", name: "AK620", type: "air", radiator: 0, score: 9.0, price: 69 },
    { id: "cool-aio-240-msi-mag-coreliquid", brand: "MSI", name: "MAG CoreLiquid 240R V2", type: "aio", radiator: 240, score: 8.8, price: 109 },
    { id: "cool-aio-360-msi-mag-coreliquid", brand: "MSI", name: "MAG CoreLiquid 360R V2", type: "aio", radiator: 360, score: 9.0, price: 139 },
    { id: "cool-aio-240-nzxt-kraken", brand: "NZXT", name: "Kraken 240", type: "aio", radiator: 240, score: 9.1, price: 159 },
    { id: "cool-aio-360-nzxt-kraken", brand: "NZXT", name: "Kraken 360", type: "aio", radiator: 360, score: 9.3, price: 219 },
    { id: "cool-aio-240-enermax-liqmax", brand: "Enermax", name: "LIQMAX III 240", type: "aio", radiator: 240, score: 8.4, price: 99 },
    { id: "cool-aio-360-idcooling-zoomflow", brand: "ID-Cooling", name: "Zoomflow 360 XT", type: "aio", radiator: 360, score: 8.6, price: 119 }
  ],
  customCables: [
    { id: "cab-mobo-ezdiyfab-24", brand: "EZDIY-FAB", category: "Carte mère (24-pin)", name: "24-pin extension", score: 8.0, price: 23 },
    { id: "cab-mobo-moddiy-24", brand: "MODDIY", category: "Carte mère (24-pin)", name: "24-pin premium sleeved", score: 8.6, price: 45 },
    { id: "cab-mobo-phanteks-24", brand: "Phanteks", category: "Carte mère (24-pin)", name: "24-pin extension set", score: 8.2, price: 29 },
    { id: "cab-gpu-ezdiyfab-2x8", brand: "EZDIY-FAB", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 2x8 extension", score: 7.9, price: 21, requiredPcie8: 2 },
    { id: "cab-gpu-ezdiyfab-3x8", brand: "EZDIY-FAB", category: "Carte graphique (PCIe/12VHPWR)", name: "GPU 3x8 extension", score: 8.0, price: 29, requiredPcie8: 3 },
    { id: "cab-gpu-moddiy-12vhpwr", brand: "MODDIY", category: "Carte graphique (PCIe/12VHPWR)", name: "12VHPWR ultra-flex", score: 9.0, price: 69, requires12vhpwr: true },
    { id: "cab-gpu-antec-12vhpwr", brand: "Antec", category: "Carte graphique (PCIe/12VHPWR)", name: "12VHPWR sleeved", score: 8.5, price: 54, requires12vhpwr: true },
    { id: "cab-cpu-ezdiyfab-1eps", brand: "EZDIY-FAB", category: "CPU (EPS 8-pin)", name: "CPU 1xEPS extension", score: 7.8, price: 17, requiredEps8: 1 },
    { id: "cab-cpu-ezdiyfab-2eps", brand: "EZDIY-FAB", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS extension", score: 7.9, price: 25, requiredEps8: 2 },
    { id: "cab-cpu-moddiy-2eps", brand: "MODDIY", category: "CPU (EPS 8-pin)", name: "CPU 2xEPS premium", score: 8.8, price: 43, requiredEps8: 2 },
    { id: "cab-oth-thermaltake-argb-hub", brand: "Thermaltake", category: "Autres (SATA/ARGB/FAN)", name: "ARGB hub + routing", score: 8.4, price: 35 },
    { id: "cab-oth-antec-fan-hub", brand: "Antec", category: "Autres (SATA/ARGB/FAN)", name: "Fan hub routing set", score: 8.1, price: 29 }
  ]
};

function mergeCatalogExpansion(...expansions) {
  expansions.forEach((expansion) => {
    if (!expansion || typeof expansion !== "object") return;
    Object.entries(expansion).forEach(([key, list]) => {
      if (!Array.isArray(CATALOG[key]) || !Array.isArray(list)) return;
      const known = new Set(CATALOG[key].map((item) => item.id));
      list.forEach((item) => {
        if (!item?.id || known.has(item.id)) return;
        CATALOG[key].push(item);
        known.add(item.id);
      });
    });
  });
}

mergeCatalogExpansion(
  CATALOG_EXPANSION,
  CATALOG_EXPANSION_PLUS,
  CATALOG_EXPANSION_MAX,
  CATALOG_EXPANSION_INFINITY,
  CATALOG_EXPANSION_HYPER
);

window.AE_CATALOG = CATALOG;
window.AE_mergeCatalogExtras = function (extras) {
  if (!extras || typeof extras !== "object") return 0;
  let added = 0;
  Object.entries(extras).forEach(([key, list]) => {
    if (!Array.isArray(CATALOG[key]) || !Array.isArray(list)) return;
    const known = new Set(CATALOG[key].map((item) => item.id));
    list.forEach((item) => {
      if (!item?.id || known.has(item.id)) return;
      CATALOG[key].push(item);
      known.add(item.id);
      added += 1;
    });
  });
  if (added > 0) {
    try {
      if (typeof renderAllCategories === "function") renderAllCategories();
      if (typeof compute === "function") compute();
    } catch {}
  }
  return added;
};
window.AE_recomputeFromCatalog = function () {
  try {
    if (typeof renderAllCategories === "function") renderAllCategories();
    if (typeof compute === "function") compute();
  } catch {}
};

const MARKET_PRICE_PROFILE = {
  cpu: { multiplier: 1.03, shipping: 5, min: 109, deliveryPct: 0.008 },
  mobo: { multiplier: 1.03, shipping: 7, min: 119, deliveryPct: 0.01 },
  ram: { multiplier: 1.02, shipping: 3, min: 39, deliveryPct: 0.006 },
  gpu: { multiplier: 1.02, shipping: 11, min: 219, deliveryPct: 0.012 },
  storage: { multiplier: 1.02, shipping: 4, min: 49, deliveryPct: 0.007 },
  psu: { multiplier: 1.03, shipping: 8, min: 89, deliveryPct: 0.01 },
  case: { multiplier: 1.02, shipping: 24, min: 89, deliveryPct: 0.013 },
  watercooling: { multiplier: 1.03, shipping: 7, min: 49, deliveryPct: 0.01 },
  customCables: { multiplier: 1.02, shipping: 4, min: 19, deliveryPct: 0.008 }
};

const MARKET_PRICE_OVERRIDES = {
  "cpu-amd-r7-3800x": 164,
  "cpu-amd-r5-5600": 124,
  "cpu-amd-r7-7800x3d": 419,
  "cpu-intel-i5-14600k": 289,
  "gpu-nv-2060": 259,
  "gpu-nv-4060": 329,
  "gpu-nv-4070s": 699,
  "gpu-amd-rx7800xt": 609,
  "gpu-amd-rx9070xt": 799,
  "gpu-nv-4060s": 449,
  "gpu-nv-5070": 779,
  "gpu-amd-rx7700xt": 519,
  "gpu-amd-rx7900gre": 639,
  "sto-king-1": 69,
  "sto-wd-sn770-1": 89,
  "sto-sam-990pro-2": 199,
  "sto-sam-990pro-4": 409,
  "psu-cx550": 79,
  "psu-rm850e": 149,
  "psu-corsair-rm1000x-shift": 259,
  "case-msi-100r": 89,
  "case-corsair-4000d": 104,
  "case-corsair-5000d-airflow": 199
};

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function harmonizedFloor(key, item) {
  if (!item || item.isNone || item.estimateOnly) return 0;
  if (key === "cpu") {
    const genBonus = item.generation >= 20000 ? 55 : item.generation >= 9000 ? 42 : item.generation >= 7000 ? 32 : item.generation >= 14000 ? 28 : 0;
    return 55 + ((Number(item.rank || 0) * 18)) + genBonus;
  }
  if (key === "mobo") {
    const ddrBonus = item.ramType === "DDR5" ? 26 : 0;
    return 72 + (Number(item.tier || 1) * 34) + ddrBonus;
  }
  if (key === "ram") {
    const ddrBonus = item.type === "DDR5" ? 22 : 0;
    const speedBonus = Number(item.generation || 0) >= 6400 ? 12 : Number(item.generation || 0) >= 5600 ? 6 : 0;
    return 12 + (Number(item.gb || 0) * 2.2) + ddrBonus + speedBonus;
  }
  if (key === "gpu") {
    return 68 + (Number(item.rank || 0) * 56) + (Number(item.vram || 0) * 6.2);
  }
  if (key === "storage") {
    const genBonus = Number(item.generation || 0) >= 5 ? 68 : Number(item.generation || 0) >= 4 ? 18 : 0;
    return 22 + (Number(item.tb || 0) * 20) + genBonus;
  }
  if (key === "psu") {
    const qualityBonus = Number(item.score || 0) >= 9.4 ? 24 : Number(item.score || 0) >= 9.0 ? 14 : 0;
    return 32 + (Number(item.watts || 0) * 0.11) + qualityBonus;
  }
  if (key === "case") {
    const radBonus = Number(item.maxRad || 0) >= 420 ? 34 : Number(item.maxRad || 0) >= 360 ? 16 : 0;
    return 42 + (Number(item.maxGpu || 0) * 0.18) + radBonus;
  }
  if (key === "watercooling") {
    if (item.type === "air") return 34 + (Number(item.score || 0) * 2.8);
    if (item.type === "aio") return 46 + (Number(item.radiator || 240) * 0.35);
    return 0;
  }
  if (key === "customCables") {
    return 14 + (Number(item.score || 0) * 2.4);
  }
  return 0;
}

function applyMarketDeliveredPricing() {
  Object.entries(MARKET_PRICE_PROFILE).forEach(([key, profile]) => {
    const list = CATALOG[key];
    if (!Array.isArray(list)) return;

    list.forEach((item) => {
      if (!item || item.isNone || item.estimateOnly) return;
      const base = Number(item.price || 0);
      if (!Number.isFinite(base) || base <= 0) return;

      if (Object.prototype.hasOwnProperty.call(MARKET_PRICE_OVERRIDES, item.id)) {
        item.price = roundMoney(MARKET_PRICE_OVERRIDES[item.id]);
        return;
      }

      const variableShipping =
        (base >= 1200 ? 19 : base >= 700 ? 14 : base >= 350 ? 9 : base >= 140 ? 6 : 4)
        + (key === "case" ? 12 : 0);
      const insurance = base * Number(profile.deliveryPct || 0);
      let adjusted = (base * profile.multiplier) + Number(profile.shipping || 0) + variableShipping + insurance;
      adjusted = Math.max(adjusted, harmonizedFloor(key, item));
      if (profile.min) adjusted = Math.max(adjusted, profile.min);
      item.price = roundMoney(adjusted);
    });
  });
}

applyMarketDeliveredPricing();

const CATEGORY_CONFIG = {
  cpu: { selectId: "cpu", filterId: "cpuFilter", required: true },
  mobo: { selectId: "mobo", filterId: "moboFilter", required: true },
  ram: { selectId: "ram", filterId: "ramFilter", required: true },
  gpu: { selectId: "gpu", filterId: "gpuFilter", required: true },
  storage: { selectId: "storage", filterId: "storageFilter", required: true },
  psu: { selectId: "psu", filterId: "psuFilter", required: true },
  case: { selectId: "case", filterId: "caseFilter", required: true },
  watercooling: { selectId: "watercoolingOption", filterId: "watercoolingFilter", required: false },
  customCables: { selectId: "customCablesOption", filterId: "customCablesFilter", required: false },
  cableMgmt: { selectId: "cableMgmtOption", filterId: "cableMgmtFilter", required: false },
  delivery: { selectId: "deliveryOption", filterId: "deliveryFilter", required: true }
};

const USAGE_PROFILE = {
  "Jeu compétitif (1080p)": { minCpu: 5.8, minGpu: 6.2, minRam: 16, minVram: 8, minStorage: 1, ratioLow: 0.84, ratioHigh: 1.32 },
  "Jeu AAA (1440p / ultrawide)": { minCpu: 7.2, minGpu: 8.0, minRam: 32, minVram: 12, minStorage: 2, ratioLow: 0.85, ratioHigh: 1.25 },
  "Jeu (4K)": { minCpu: 8.0, minGpu: 9.0, minRam: 32, minVram: 16, minStorage: 2, ratioLow: 0.82, ratioHigh: 1.2 },
  "Création (montage / 3D / IA)": { minCpu: 8.7, minGpu: 8.5, minRam: 64, minVram: 16, minStorage: 2, ratioLow: 0.95, ratioHigh: 1.35 },
  "Streaming + multitâche": { minCpu: 8.0, minGpu: 7.5, minRam: 32, minVram: 12, minStorage: 2, ratioLow: 0.95, ratioHigh: 1.35 },
  "Bureautique / étude": { minCpu: 5.0, minGpu: 4.6, minRam: 16, minVram: 0, minStorage: 1, ratioLow: 0.7, ratioHigh: 1.6 }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
let LATEST_CUSTOM_STATE = null;

function emitCustomState(state) {
  LATEST_CUSTOM_STATE = state || null;
  window.dispatchEvent(new CustomEvent("ae:config-state", { detail: LATEST_CUSTOM_STATE }));
}

window.getAELatestConfigState = () => LATEST_CUSTOM_STATE;

function euro(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function toast(text) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = text;
  el.classList.add("is-show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => el.classList.remove("is-show"), 2800);
}

function themedConfirm(message, {
  title = "Confirmation",
  confirmText = "Continuer",
  cancelText = "Annuler"
} = {}) {
  return new Promise((resolve) => {
    const root = document.createElement("div");
    root.className = "confirm-modal";
    root.innerHTML = `
      <div class="confirm-modal__backdrop"></div>
      <div class="confirm-modal__card" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="confirm-modal__title">${title}</div>
        <div class="confirm-modal__text">${message}</div>
        <div class="confirm-modal__actions">
          <button type="button" class="btn btn--ghost confirm-modal__btn" data-action="cancel">${cancelText}</button>
          <button type="button" class="btn btn--primary confirm-modal__btn" data-action="confirm">${confirmText}</button>
        </div>
      </div>
    `;

    let settled = false;
    const close = (result) => {
      if (settled) return;
      settled = true;
      document.body.classList.remove("is-modal-open");
      document.removeEventListener("keydown", onKeyDown);
      root.remove();
      resolve(Boolean(result));
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };

    root.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.classList.contains("confirm-modal__backdrop")) close(false);
      const action = target.dataset.action;
      if (action === "confirm") close(true);
      if (action === "cancel") close(false);
    });

    document.body.classList.add("is-modal-open");
    document.addEventListener("keydown", onKeyDown);
    document.body.appendChild(root);

    const primaryBtn = root.querySelector('[data-action="confirm"]');
    if (primaryBtn instanceof HTMLElement) primaryBtn.focus();
  });
}

function themedPrompt(message, {
  title = "Saisie",
  confirmText = "Valider",
  cancelText = "Annuler",
  placeholder = "",
  value = "",
  inputType = "text"
} = {}) {
  return new Promise((resolve) => {
    const root = document.createElement("div");
    root.className = "confirm-modal";
    root.innerHTML = `
      <div class="confirm-modal__backdrop"></div>
      <div class="confirm-modal__card" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="confirm-modal__title">${title}</div>
        <div class="confirm-modal__text">${message}</div>
        <div class="confirm-modal__field">
          <input class="confirm-modal__input" type="${inputType}" value="${String(value).replace(/"/g, "&quot;")}" placeholder="${String(placeholder).replace(/"/g, "&quot;")}" />
        </div>
        <div class="confirm-modal__actions">
          <button type="button" class="btn btn--ghost confirm-modal__btn" data-action="cancel">${cancelText}</button>
          <button type="button" class="btn btn--primary confirm-modal__btn" data-action="confirm">${confirmText}</button>
        </div>
      </div>
    `;

    const inputEl = root.querySelector(".confirm-modal__input");
    let settled = false;
    const close = (result) => {
      if (settled) return;
      settled = true;
      document.body.classList.remove("is-modal-open");
      document.removeEventListener("keydown", onKeyDown);
      root.remove();
      if (!result) {
        resolve("");
        return;
      }
      resolve(String(inputEl?.value || "").trim());
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };

    root.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.classList.contains("confirm-modal__backdrop")) close(false);
      const action = target.dataset.action;
      if (action === "confirm") close(true);
      if (action === "cancel") close(false);
    });

    document.body.classList.add("is-modal-open");
    document.addEventListener("keydown", onKeyDown);
    document.body.appendChild(root);

    if (inputEl instanceof HTMLElement) {
      inputEl.focus();
      inputEl.select?.();
    }
  });
}

function setStatus(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

const THEME_STORAGE_KEY = "ae_theme_v1";
const THEME_PRESETS = {
  galerie: {
    bg: "#f5f2eb", panel: "#0a09071a", text: "#0a0907",
    accent: "#1a3a5c", accent2: "#a8553a", accent3: "#9c8359", accentWarm: "#c46f54",
    btnPrimary: "#1a3a5c", btnSecondary: "#a8553a"
  },
  atelier: {
    bg: "#05070c", panel: "#1a2635", text: "#f3f7ff",
    accent: "#3cd7ff", accent2: "#35f3b4", accent3: "#63a3ff", accentWarm: "#ffba66",
    btnPrimary: "#3cd7ff", btnSecondary: "#35f3b4"
  },
  acier: {
    bg: "#0a0f16", panel: "#222f40", text: "#ecf3ff",
    accent: "#7aa2ff", accent2: "#74e6ff", accent3: "#9d8bff", accentWarm: "#ffd198",
    btnPrimary: "#7aa2ff", btnSecondary: "#74e6ff"
  },
  sunset: {
    bg: "#130b12", panel: "#3a1f2b", text: "#fff0ea",
    accent: "#ff8a5c", accent2: "#ff5da8", accent3: "#ffb36e", accentWarm: "#ffd27c",
    btnPrimary: "#ff8a5c", btnSecondary: "#ff5da8"
  },
  emerald: {
    bg: "#06110d", panel: "#1a352b", text: "#e9fff6",
    accent: "#44f3c7", accent2: "#5bc1ff", accent3: "#7cf0ff", accentWarm: "#ffd181",
    btnPrimary: "#44f3c7", btnSecondary: "#5bc1ff"
  }
};

function normalizeHexColor(value, fallback = "#3cd7ff") {
  const hex = String(value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(hex)) return hex.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    const clean = hex.slice(1).toLowerCase();
    return `#${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`;
  }
  return fallback;
}

function hexToRgb(hex) {
  const clean = normalizeHexColor(hex).slice(1);
  const n = Number.parseInt(clean, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255
  };
}

function rgbToHex(r, g, b) {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  const to2 = (n) => clamp(n).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

function rgba(hex, alpha) {
  const rgb = hexToRgb(hex);
  const a = Math.max(0, Math.min(1, Number(alpha || 0)));
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
}

function isColorLight(hex) {
  const { r, g, b } = hexToRgb(hex);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness >= 155;
}

function mixHex(a, b, ratio = 0.5) {
  const t = Math.max(0, Math.min(1, Number(ratio || 0)));
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex(
    ca.r + ((cb.r - ca.r) * t),
    ca.g + ((cb.g - ca.g) * t),
    ca.b + ((cb.b - ca.b) * t)
  );
}

function markThemePreset(name = "") {
  document.querySelectorAll("[data-theme-preset]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.themePreset === name);
  });
}

function applyThemePalette(palette, { persist = true, presetName = "" } = {}) {
  if (!palette || typeof palette !== "object") return;
  const resolved = {
    bg: normalizeHexColor(palette.bg, THEME_PRESETS.atelier.bg),
    panel: normalizeHexColor(palette.panel, THEME_PRESETS.atelier.panel),
    text: normalizeHexColor(palette.text, THEME_PRESETS.atelier.text),
    accent: normalizeHexColor(palette.accent, THEME_PRESETS.atelier.accent),
    accent2: normalizeHexColor(palette.accent2, THEME_PRESETS.atelier.accent2),
    accent3: normalizeHexColor(
      palette.accent3,
      mixHex(normalizeHexColor(palette.accent, THEME_PRESETS.atelier.accent), "#8eb5ff", 0.35)
    ),
    accentWarm: normalizeHexColor(
      palette.accentWarm,
      mixHex(normalizeHexColor(palette.accent2, THEME_PRESETS.atelier.accent2), "#ffba66", 0.5)
    ),
    btnPrimary: normalizeHexColor(palette.btnPrimary, normalizeHexColor(palette.accent, THEME_PRESETS.atelier.accent)),
    btnSecondary: normalizeHexColor(palette.btnSecondary, normalizeHexColor(palette.accent2, THEME_PRESETS.atelier.accent2))
  };

  const root = document.documentElement;
  root.style.setProperty("--bg", resolved.bg);
  root.style.setProperty("--text", rgba(resolved.text, 0.92));
  root.style.setProperty("--muted", rgba(resolved.text, 0.68));
  root.style.setProperty("--muted2", rgba(resolved.text, 0.52));
  root.style.setProperty("--stroke", rgba(resolved.text, 0.14));
  root.style.setProperty("--panel", rgba(resolved.panel, 0.12));
  root.style.setProperty("--panel2", rgba(resolved.panel, 0.18));
  root.style.setProperty("--accent", resolved.accent);
  root.style.setProperty("--accent2", resolved.accent2);
  root.style.setProperty("--accent3", resolved.accent3);
  root.style.setProperty("--accentWarm", resolved.accentWarm);
  root.style.setProperty("--ui-panel-top", rgba(resolved.panel, 0.46));
  root.style.setProperty("--ui-panel-bottom", rgba(resolved.panel, 0.24));
  root.style.setProperty("--ui-input-bg", rgba(resolved.panel, 0.22));
  root.style.setProperty("--ui-input-border", rgba(resolved.text, 0.18));
  root.style.setProperty("--ui-input-focus", rgba(resolved.btnPrimary, 0.78));
  root.style.setProperty("--ui-btn-border", rgba(resolved.text, 0.22));
  root.style.setProperty("--ui-btn-bg", rgba(resolved.panel, 0.22));
  root.style.setProperty("--ui-btn-hover-bg", rgba(resolved.panel, 0.35));
  root.style.setProperty("--ui-btn-ghost-bg", rgba(resolved.panel, 0.16));
  root.style.setProperty("--ui-btn-ghost-border", rgba(resolved.text, 0.22));
  root.style.setProperty("--ui-btn-primary-from", resolved.btnPrimary);
  root.style.setProperty("--ui-btn-primary-to", resolved.btnSecondary);
  root.style.setProperty("--ui-btn-primary-text", isColorLight(mixHex(resolved.btnPrimary, resolved.btnSecondary, 0.5)) ? "#081019" : "#f7fbff");

  const accentInput = document.getElementById("themeAccentInput");
  const accent2Input = document.getElementById("themeAccent2Input");
  const bgInput = document.getElementById("themeBgInput");
  const panelInput = document.getElementById("themePanelInput");
  const textInput = document.getElementById("themeTextInput");
  const btnPrimaryInput = document.getElementById("themeBtnPrimaryInput");
  const btnSecondaryInput = document.getElementById("themeBtnSecondaryInput");
  if (accentInput) accentInput.value = resolved.accent;
  if (accent2Input) accent2Input.value = resolved.accent2;
  if (bgInput) bgInput.value = resolved.bg;
  if (panelInput) panelInput.value = resolved.panel;
  if (textInput) textInput.value = resolved.text;
  if (btnPrimaryInput) btnPrimaryInput.value = resolved.btnPrimary;
  if (btnSecondaryInput) btnSecondaryInput.value = resolved.btnSecondary;

  markThemePreset(presetName);
  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ ...resolved, presetName: presetName || "custom" }));
  }
}

function initThemeCustomizer() {
  const root = document.getElementById("themeLab");
  const toggle = document.getElementById("themeLabToggle");
  const closeBtn = document.getElementById("themeLabClose");
  const panel = document.getElementById("themeLabPanel");
  const accentInput = document.getElementById("themeAccentInput");
  const accent2Input = document.getElementById("themeAccent2Input");
  const bgInput = document.getElementById("themeBgInput");
  const panelInput = document.getElementById("themePanelInput");
  const textInput = document.getElementById("themeTextInput");
  const btnPrimaryInput = document.getElementById("themeBtnPrimaryInput");
  const btnSecondaryInput = document.getElementById("themeBtnSecondaryInput");
  const resetBtn = document.getElementById("themeLabReset");
  if (!root || !toggle || !panel) return;

  const open = () => {
    root.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
  };
  const close = () => {
    root.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  };

  toggle.addEventListener("click", () => {
    if (root.classList.contains("is-open")) close();
    else open();
  });
  closeBtn?.addEventListener("click", close);

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (!root.contains(target)) close();
  });

  document.querySelectorAll("[data-theme-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const presetName = btn.dataset.themePreset || "atelier";
      const preset = THEME_PRESETS[presetName] || THEME_PRESETS.atelier;
      applyThemePalette(preset, { persist: true, presetName });
    });
  });

  const applyCustomFromInputs = () => {
    const accent = normalizeHexColor(accentInput?.value || THEME_PRESETS.atelier.accent, THEME_PRESETS.atelier.accent);
    const accent2 = normalizeHexColor(accent2Input?.value || THEME_PRESETS.atelier.accent2, THEME_PRESETS.atelier.accent2);
    const bg = normalizeHexColor(bgInput?.value || THEME_PRESETS.atelier.bg, THEME_PRESETS.atelier.bg);
    const panelColor = normalizeHexColor(panelInput?.value || THEME_PRESETS.atelier.panel, THEME_PRESETS.atelier.panel);
    const textColor = normalizeHexColor(textInput?.value || THEME_PRESETS.atelier.text, THEME_PRESETS.atelier.text);
    const btnPrimary = normalizeHexColor(btnPrimaryInput?.value || accent, accent);
    const btnSecondary = normalizeHexColor(btnSecondaryInput?.value || accent2, accent2);
    applyThemePalette({
      bg,
      panel: panelColor,
      text: textColor,
      accent,
      accent2,
      accent3: mixHex(accent, "#9ec1ff", 0.34),
      accentWarm: mixHex(accent2, "#ffbc70", 0.52),
      btnPrimary,
      btnSecondary
    }, { persist: true, presetName: "custom" });
  };

  accentInput?.addEventListener("input", applyCustomFromInputs);
  accent2Input?.addEventListener("input", applyCustomFromInputs);
  bgInput?.addEventListener("input", applyCustomFromInputs);
  panelInput?.addEventListener("input", applyCustomFromInputs);
  textInput?.addEventListener("input", applyCustomFromInputs);
  btnPrimaryInput?.addEventListener("input", applyCustomFromInputs);
  btnSecondaryInput?.addEventListener("input", applyCustomFromInputs);

  resetBtn?.addEventListener("click", () => {
    applyThemePalette(THEME_PRESETS.galerie, { persist: true, presetName: "galerie" });
  });

  let stored = null;
  try {
    stored = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || "null");
  } catch {
    stored = null;
  }
  if (stored && typeof stored === "object" && stored.presetName === "galerie") {
    applyThemePalette(stored, { persist: false, presetName: "galerie" });
  } else if (stored && typeof stored === "object" && stored.presetName === "custom") {
    applyThemePalette(stored, { persist: false, presetName: "custom" });
  } else {
    applyThemePalette(THEME_PRESETS.galerie, { persist: true, presetName: "galerie" });
  }
}

function sortByBrandGenerationScore(items) {
  const categoryOrder = {
    "Aucun": 0,
    "Carte mère (24-pin)": 1,
    "Carte graphique (PCIe/12VHPWR)": 2,
    "CPU (EPS 8-pin)": 3,
    "Autres (SATA/ARGB/FAN)": 4
  };

  return [...items].sort((a, b) => {
    if (a.category || b.category) {
      const ca = categoryOrder[a.category] ?? 99;
      const cb = categoryOrder[b.category] ?? 99;
      if (ca !== cb) return ca - cb;
    }

    const brandCmp = String(a.brand).localeCompare(String(b.brand));
    if (brandCmp !== 0) return brandCmp;
    const genA = Number(a.generation || 0);
    const genB = Number(b.generation || 0);
    if (genA !== genB) return genB - genA;
    if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
    return (a.price || 0) - (b.price || 0);
  });
}

function optionLabel(key, item) {
  if (key === "cpu") return `${item.brand} ${item.name} | Génération ${item.generation} | ${euro(item.price)}`;
  if (key === "mobo") return `${item.brand} ${item.name} | Socket ${item.socket} | ${item.ramType} | ${euro(item.price)}`;
  if (key === "ram") return `${item.brand} ${item.name} | ${item.type} ${item.gb} Go | ${euro(item.price)}`;
  if (key === "gpu") return `${item.brand} ${item.name} | VRAM ${item.vram} Go | ${euro(item.price)}`;
  if (key === "storage") return `${item.brand} ${item.name} | ${item.tb} To | ${euro(item.price)}`;
  if (key === "psu") return `${item.brand} ${item.name} | ${item.watts}W | ${euro(item.price)}`;
  if (key === "case") return `${item.brand} ${item.name} | GPU max ${item.maxGpu}mm | Rad max ${item.maxRad}mm | ${euro(item.price)}`;
  if (key === "watercooling") return `${item.brand} ${item.name} | ${item.estimateOnly ? "Sur devis" : euro(item.price)}`;
  if (key === "customCables") return `${item.brand} ${item.name} | ${euro(item.price)}`;
  if (key === "cableMgmt") return `${item.brand} ${item.name} | ${euro(item.price)}`;
  if (key === "delivery") return `${item.name} | ${item.prepWindow || "délai variable"} | base ${euro(item.baseFee || 0)}`;
  return `${item.brand} ${item.name} | ${euro(item.price || 0)}`;
}

function comboOptionTexts(key, item) {
  if (key === "cpu") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: `Génération ${item.generation} a: Socket ${item.socket} a: ${euro(item.price)}`
    };
  }
  if (key === "mobo") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: `Socket ${item.socket} a: ${item.ramType} a: ${euro(item.price)}`
    };
  }
  if (key === "ram") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: `${item.type} ${item.gb} Go a: ${item.generation} MT/s a: ${euro(item.price)}`
    };
  }
  if (key === "gpu") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: `${item.vram} Go VRAM a: ${item.tdp}W a: ${euro(item.price)}`
    };
  }
  if (key === "storage") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: `${item.tb} To a: PCIe Gen ${item.generation} a: ${euro(item.price)}`
    };
  }
  if (key === "psu") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: `${item.watts}W a: Score ${item.score || "-"} a: ${euro(item.price)}`
    };
  }
  if (key === "case") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: `GPU max ${item.maxGpu}mm a: Radiateur max ${item.maxRad}mm a: ${euro(item.price)}`
    };
  }
  if (key === "watercooling") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: item.estimateOnly ? "Sur devis" : `${item.type.toUpperCase()} a: ${item.radiator ? `${item.radiator}mm` : "Air"} a: ${euro(item.price)}`
    };
  }
  if (key === "customCables") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: `${item.category} a: ${euro(item.price)}`
    };
  }
  if (key === "cableMgmt") {
    return {
      title: `${item.brand} ${item.name}`,
      meta: `${euro(item.price)}`
    };
  }
  if (key === "delivery") {
    return {
      title: `${item.name}`,
      meta: `${item.prepWindow || "délai variable"} a: Base ${euro(item.baseFee || 0)}`
    };
  }
  return {
    title: `${item.brand} ${item.name}`,
    meta: `${euro(item.price || 0)}`
  };
}

function badgeToneClass(badge) {
  if (badge === OPTION_BADGE.best) return "combo-badge--best";
  if (badge === OPTION_BADGE.good) return "combo-badge--good";
  if (badge === OPTION_BADGE.low) return "combo-badge--low";
  if (badge === OPTION_BADGE.no) return "combo-badge--no";
  if (badge === OPTION_BADGE.none) return "combo-badge--none";
  return "";
}

function shortLabel(key, item) {
  if (!item) return "";
  if (key === "delivery") return item.name;
  if (key === "customCables") return `${item.category} a: ${item.brand} ${item.name}`;
  return `${item.brand} ${item.name}`;
}

function searchableText(item) {
  return [
    item.brand,
    item.category,
    item.name,
    item.socket,
    item.ramType,
    item.type,
    item.generation,
    item.vram,
    item.gb,
    item.watts,
    item.requiredPcie8,
    item.requiredEps8,
    item.mode,
    item.prepWindow,
    item.requires12vhpwr ? "12vhpwr" : ""
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalizeText(text).split(/\s+/).filter(Boolean);
}

function tokenScore(a, b) {
  const aa = new Set(tokenize(a));
  const bb = new Set(tokenize(b));
  if (!aa.size || !bb.size) return 0;
  const inter = [...aa].filter((t) => bb.has(t)).length;
  const union = new Set([...aa, ...bb]).size;
  return inter / union;
}

function inferSocketFromText(text) {
  const t = normalizeText(text);
  if (t.includes("am5")) return "AM5";
  if (t.includes("am4")) return "AM4";
  if (t.includes("1851") || t.includes("ultra")) return "1851";
  if (t.includes("1700") || t.includes("12") || t.includes("13") || t.includes("14")) return "1700";
  return "AM5";
}

function inferUnknownComponent(key, query) {
  const q = normalizeText(query);

  if (key === "cpu") {
    const isIntel = q.includes("intel") || q.includes("core");
    const isAmd = q.includes("amd") || q.includes("ryzen");
    const tier = /i9|r9|ryzen 9|core i9/.test(q) ? 9 : /i7|r7|ryzen 7|core i7/.test(q) ? 8 : /i5|r5|ryzen 5|core i5/.test(q) ? 7 : 6;
    const socket = isIntel ? inferSocketFromText(q) : (q.includes("9000") || q.includes("7000") ? "AM5" : "AM4");
    const tdp = q.includes("k") || q.includes("x") ? 125 : 65;
    const price = tier >= 9 ? 620 : tier >= 8 ? 430 : tier >= 7 ? 260 : 160;
    return {
      id: `unknown-cpu-${Date.now()}`,
      brand: isIntel ? "Intel" : isAmd ? "AMD" : "Référence externe",
      name: query,
      generation: Number((q.match(/(\d{4,5})/) || [])[1]) || 0,
      socket,
      tdp,
      rank: tier,
      score: tier,
      price: q.includes("x3d") ? price + 120 : price,
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "mobo") {
    const socket = inferSocketFromText(q);
    const ddr5 = q.includes("ddr5") || socket === "AM5" || socket === "1851";
    const tier = q.includes("x") || q.includes("z") ? 3 : 2;
    const generation = q.includes("x870") ? 870 : q.includes("x670") ? 670 : q.includes("b650") ? 650 : q.includes("z890") ? 890 : q.includes("z790") ? 790 : q.includes("b760") ? 760 : 0;
    const price = tier >= 3 ? 330 : 185;
    return {
      id: `unknown-mobo-${Date.now()}`,
      brand: "Référence externe",
      name: query,
      generation,
      socket,
      ramType: ddr5 ? "DDR5" : "DDR4",
      tier,
      score: 8.0,
      price,
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "ram") {
    const gb = Number((q.match(/(\d+)\s*(go|gb)/) || [])[1]) || (q.includes("96") ? 96 : q.includes("64") ? 64 : q.includes("48") ? 48 : q.includes("32") ? 32 : 16);
    const ddr = q.includes("ddr4") ? "DDR4" : "DDR5";
    const speed = Number((q.match(/(3[0-9]{3}|4[0-9]{3}|5[0-9]{3}|6[0-9]{3}|7[0-9]{3})/) || [])[1]) || (ddr === "DDR5" ? 6000 : 3200);
    const price = Math.round((ddr === "DDR5" ? 3.2 : 2.2) * gb);
    return {
      id: `unknown-ram-${Date.now()}`,
      brand: "Référence externe",
      name: query,
      generation: speed,
      type: ddr,
      gb,
      score: ddr === "DDR5" ? 8.9 : 7.5,
      price,
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "gpu") {
    const vram = Number((q.match(/(\d+)\s*(go|gb)/) || [])[1]) || (q.includes("24") ? 24 : q.includes("16") ? 16 : q.includes("12") ? 12 : 8);
    const isNvidia = q.includes("rtx") || q.includes("nvidia") || q.includes("geforce");
    const isAmd = q.includes("rx") || q.includes("radeon");
    const tdp = vram >= 24 ? 380 : vram >= 16 ? 300 : vram >= 12 ? 240 : 180;
    const rank = vram >= 24 ? 9.2 : vram >= 16 ? 8.4 : vram >= 12 ? 7.6 : 6.6;
    const generation = Number((q.match(/(3\d{3}|4\d{3}|5\d{3}|6\d{3}|7\d{3}|9\d{3})/) || [])[1]) || 0;
    const price = Math.round((rank * 110) + (vram * 9));
    return {
      id: `unknown-gpu-${Date.now()}`,
      brand: isNvidia ? "NVIDIA" : isAmd ? "AMD" : "Référence externe",
      name: query,
      generation,
      vram,
      tdp,
      length: 320,
      rank,
      score: rank,
      price,
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "storage") {
    const tb = Number((q.match(/(\d+(?:[.,]\d+)?)\s*(tb|to)/) || [])[1]?.replace(",", ".")) || 1;
    const gen = q.includes("gen5") || q.includes("pcie 5") || q.includes("5.0") ? 5 : 4;
    const price = Math.round((gen === 5 ? 130 : 78) * tb);
    return {
      id: `unknown-storage-${Date.now()}`,
      brand: "Référence externe",
      name: query,
      generation: gen,
      tb,
      score: gen === 5 ? 9.3 : 8.5,
      price,
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "psu") {
    const watts = Number((q.match(/(\d{3,4})\s*w/) || [])[1]) || Number((q.match(/(\d{3,4})/) || [])[1]) || 750;
    const price = Math.round(watts * 0.19);
    return {
      id: `unknown-psu-${Date.now()}`,
      brand: "Référence externe",
      name: query,
      generation: watts,
      watts,
      score: watts >= 1000 ? 9.3 : watts >= 850 ? 8.9 : 8.0,
      price,
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "case") {
    const maxGpu = Number((q.match(/(\d{3})\s*mm/) || [])[1]) || 390;
    const maxRad = q.includes("420") ? 420 : q.includes("280") ? 280 : q.includes("240") ? 240 : 360;
    const price = maxRad >= 420 ? 219 : maxRad >= 360 ? 169 : 129;
    return {
      id: `unknown-case-${Date.now()}`,
      brand: "Référence externe",
      name: query,
      generation: 0,
      maxGpu,
      maxRad,
      score: 8.6,
      price,
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "watercooling") {
    const type = q.includes("custom") ? "custom" : q.includes("air") ? "air" : "aio";
    const radiator = q.includes("420") ? 420 : q.includes("280") ? 280 : q.includes("240") ? 240 : 360;
    const price = type === "custom" ? 0 : type === "air" ? 79 : (radiator >= 360 ? 179 : radiator >= 280 ? 149 : 119);
    return {
      id: `unknown-cooling-${Date.now()}`,
      brand: "Référence externe",
      name: query,
      type,
      radiator: type === "air" ? 0 : radiator,
      score: type === "air" ? 8.4 : 9.0,
      price,
      estimateOnly: type === "custom",
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "customCables") {
    const gpu = q.includes("gpu") || q.includes("pcie") || q.includes("12vhpwr");
    const cpu = q.includes("cpu") || q.includes("eps");
    const mobo = q.includes("24") || q.includes("atx");
    const category = gpu
      ? "Carte graphique (PCIe/12VHPWR)"
      : cpu
        ? "CPU (EPS 8-pin)"
        : mobo
          ? "Carte mère (24-pin)"
          : "Autres (SATA/ARGB/FAN)";
    return {
      id: `unknown-cable-${Date.now()}`,
      brand: "Référence externe",
      category,
      name: query,
      score: 8.0,
      price: q.includes("12vhpwr") ? 89 : q.includes("24") ? 59 : 45,
      requiredPcie8: q.includes("3x8") ? 3 : q.includes("2x8") ? 2 : q.includes("1x8") ? 1 : undefined,
      requiredEps8: q.includes("2eps") || q.includes("2xeps") ? 2 : q.includes("eps") ? 1 : undefined,
      requires12vhpwr: q.includes("12vhpwr") || q.includes("12v2x6"),
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "cableMgmt") {
    return {
      id: `unknown-mgmt-${Date.now()}`,
      brand: "Référence externe",
      name: query,
      score: 8.3,
      price: 39,
      isUnknown: true,
      externalState: "resolved"
    };
  }

  if (key === "delivery") {
    const mode = q.includes("prioritaire") || q.includes("express") ? "priority" : q.includes("eco") || q.includes("econom") ? "economy" : "normal";
    return {
      id: `unknown-delivery-${Date.now()}`,
      brand: "Atelier",
      name: query,
      mode,
      prepWindow: mode === "priority" ? "2-3 jours ouvrés" : mode === "economy" ? "5-8 jours ouvrés" : "3-5 jours ouvrés",
      score: mode === "priority" ? 9.0 : mode === "economy" ? 7.0 : 8.2,
      baseFee: mode === "priority" ? 36 : mode === "economy" ? 8 : 18,
      speedFactor: mode === "priority" ? 1.35 : mode === "economy" ? 0.72 : 1.0,
      insuranceFactor: mode === "priority" ? 1.2 : mode === "economy" ? 0.8 : 1.0,
      price: 0,
      isUnknown: true,
      externalState: "resolved"
    };
  }

  return null;
}

function buildUnknownPending(key, query) {
  const inferred = inferUnknownComponent(key, query);
  if (!inferred) return null;
  return { ...inferred, price: 0, externalState: "pending" };
}

function findBestCatalogMatch(key, query) {
  const list = CATALOG[key] || [];
  const q = normalizeText(query);
  const ranked = list
    .map((item) => {
      const text = normalizeText(`${item.brand || ""} ${item.name || ""} ${item.category || ""} ${item.socket || ""} ${item.ramType || ""}`);
      const includesBoost = text.includes(q) || q.includes(text) ? 0.35 : 0;
      const score = tokenScore(q, text) + includesBoost;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);
  if (!ranked.length) return null;
  return ranked[0].score >= 0.72 ? ranked[0].item : null;
}

function resolveUnknownComponent(key, query) {
  const matched = findBestCatalogMatch(key, query);
  if (matched) return { ...matched, isUnknown: true, externalState: "resolved", sourceHint: "catalog-match" };
  const inferred = inferUnknownComponent(key, query);
  if (!inferred) return null;
  return { ...inferred, isUnknown: true, externalState: "resolved", sourceHint: "local-ai" };
}

function buildResearchContext() {
  const pick = (item, fields) => {
    if (!item) return null;
    const out = {};
    fields.forEach((f) => {
      if (item[f] !== undefined) out[f] = item[f];
    });
    return out;
  };

  return {
    usage: document.getElementById("usage")?.value || "",
    cpu: pick(selectedByKey("cpu"), ["brand", "name", "socket", "rank", "tdp"]),
    mobo: pick(selectedByKey("mobo"), ["brand", "name", "socket", "ramType", "tier"]),
    ram: pick(selectedByKey("ram"), ["brand", "name", "type", "gb", "generation"]),
    gpu: pick(selectedByKey("gpu"), ["brand", "name", "vram", "tdp", "length", "rank"]),
    storage: pick(selectedByKey("storage"), ["brand", "name", "tb", "generation"]),
    psu: pick(selectedByKey("psu"), ["brand", "name", "watts"]),
    case: pick(selectedByKey("case"), ["brand", "name", "maxGpu", "maxRad"]),
    cooling: pick(selectedByKey("watercooling"), ["brand", "name", "type", "radiator"])
  };
}

async function resolveUnknownComponentOnline(key, query) {
  const isStaticLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname) && window.location.port === "4173";
  if (isStaticLocal) return null;

  try {
    const res = await fetch("/api/component-research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, query, context: buildResearchContext() })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.ok || !data?.parsed) return null;
    const base = inferUnknownComponent(key, query);
    if (!base) return null;
    return {
      ...base,
      ...data.parsed,
      id: `unknown-${key}-${Date.now()}`,
      name: query,
      isUnknown: true,
      externalState: "resolved",
      sourceHint: data.source || "online-research"
    };
  } catch {
    return null;
  }
}

const OPTIONAL_NONE_KEYS = new Set(["watercooling", "customCables", "cableMgmt"]);
const OPTION_BADGE = {
  best: "[BEST]",
  good: "[OK]",
  low: "[LOW]",
  none: "[OPT]",
  no: "[NO]"
};
const BADGE_EXCLUDED_KEYS = new Set(["watercooling", "customCables", "cableMgmt", "delivery"]);
const NO_EXTERNAL_REFERENCE_KEYS = new Set(["cableMgmt", "delivery"]);
const COMBO_MENU_BY_KEY = {};
const UNKNOWN_COMPONENTS = {};
let unknownResearchTimer = null;
let unknownResearchInFlight = false;
const USAGE_MIN_CACHE = {};

function selectedByKey(key) {
  const selectId = CATEGORY_CONFIG[key]?.selectId;
  const selectEl = selectId ? document.getElementById(selectId) : null;
  if (selectEl?.value) {
    return (CATALOG[key] || []).find((item) => item.id === selectEl.value) || null;
  }
  if (NO_EXTERNAL_REFERENCE_KEYS.has(key)) return null;
  const unknown = UNKNOWN_COMPONENTS[key];
  if (!unknown?.confirmed || !unknown.query) return null;
  if (unknown.resolved) return unknown.resolved;
  return buildUnknownPending(key, unknown.query);
}

function inferGpuPowerNeeds(gpu) {
  if (!gpu) return { pcie8: 0, need12vhpwr: false };
  const n = `${gpu.brand} ${gpu.name}`.toLowerCase();

  const likely12vhpwr =
    n.includes("4090") ||
    n.includes("4080") ||
    n.includes("4070 ti") ||
    n.includes("5070") ||
    n.includes("5080") ||
    n.includes("5090");

  if (likely12vhpwr) return { pcie8: 0, need12vhpwr: true };
  if (gpu.tdp <= 200) return { pcie8: 1, need12vhpwr: false };
  if (gpu.tdp <= 320) return { pcie8: 2, need12vhpwr: false };
  return { pcie8: 3, need12vhpwr: false };
}

function inferPsuConnectors(psu) {
  if (!psu) return { pcie8: 0, eps8: 0, has12vhpwr: false };

  let pcie8 = 2;
  if (psu.watts > 650) pcie8 = 3;
  if (psu.watts > 750) pcie8 = 4;
  if (psu.watts > 1000) pcie8 = 5;
  if (psu.watts > 1200) pcie8 = 6;

  const eps8 = psu.watts >= 850 ? 2 : 1;
  const has12vhpwr = psu.watts >= 850;
  return { pcie8, eps8, has12vhpwr };
}

function requiredCpuEps(cpu) {
  if (!cpu) return 1;
  return cpu.rank >= 8.6 ? 2 : 1;
}

function getCableContext() {
  const cpu = selectedByKey("cpu");
  const gpu = selectedByKey("gpu");
  const psu = selectedByKey("psu");
  return {
    cpu,
    gpu,
    psu,
    gpuNeeds: inferGpuPowerNeeds(gpu),
    psuPins: inferPsuConnectors(psu),
    cpuEpsNeed: requiredCpuEps(cpu)
  };
}

function cpuMoboGenerationCompatible(cpu, mobo) {
  if (!cpu || !mobo) return true;
  if (cpu.socket !== mobo.socket) return false;

  if (cpu.socket === "AM4") return [450, 520, 550, 570].includes(mobo.generation);
  if (cpu.socket === "AM5") return [620, 650, 670, 870].includes(mobo.generation);
  if (cpu.socket === "1700") return [610, 660, 670, 690, 760, 790].includes(mobo.generation);
  if (cpu.socket === "1851") return [810, 860, 890].includes(mobo.generation);
  return true;
}

function radiatorGpuPenalty(cooling) {
  if (!cooling) return 0;
  if (cooling.type !== "aio" && cooling.type !== "custom") return 0;
  const rad = Number(cooling.radiator || 0);
  if (rad >= 420) return 40;
  if (rad >= 360) return 35;
  if (rad >= 280) return 28;
  if (rad >= 240) return 24;
  return 20;
}

function effectiveCaseGpuLimit(casev, cooling) {
  if (!casev) return 0;
  const base = Number(casev.maxGpu || 0);
  const penalty = radiatorGpuPenalty(cooling);
  return Math.max(0, base - penalty);
}

function optionAvailability(key, item, ctx = getCableContext()) {
  if (!item) return { available: false, reason: "Option introuvable" };
  if (item.isNone) return { available: true, reason: "" };

  if (key === "customCables") {
    if (isPendingExternal(ctx.gpu) || isPendingExternal(ctx.cpu) || isPendingExternal(ctx.psu)) {
      return { available: true, reason: "Analyse connectique en attente" };
    }
    if (item.category?.startsWith("Carte graphique")) {
      if (!ctx.gpu || !ctx.psu) return { available: true, reason: "" };

      if (ctx.gpuNeeds.need12vhpwr) {
        if (!ctx.psuPins.has12vhpwr) return { available: false, reason: "Alimentation sans 12VHPWR/12V-2x6" };
        if (item.requiredPcie8) return { available: false, reason: "GPU en 12VHPWR, pas en 8-pin" };
        if (item.requires12vhpwr || item.dynamic) return { available: true, reason: "" };
        return { available: false, reason: "Connectique GPU incompatible" };
      }

      if (item.requires12vhpwr) return { available: false, reason: "GPU en PCIe 8-pin, pas en 12VHPWR" };
      if (item.requiredPcie8 && item.requiredPcie8 !== ctx.gpuNeeds.pcie8) {
        return { available: false, reason: `GPU nécessite ${ctx.gpuNeeds.pcie8} x 8-pin` };
      }
      if (ctx.psuPins.pcie8 < ctx.gpuNeeds.pcie8) {
        return { available: false, reason: "Nombre de connecteurs PCIe alim insuffisant" };
      }
      return { available: true, reason: "" };
    }

    if (item.category?.startsWith("CPU")) {
      if (!ctx.cpu || !ctx.psu) return { available: true, reason: "" };
      if (ctx.psuPins.eps8 < ctx.cpuEpsNeed) return { available: false, reason: "EPS alim insuffisant pour le CPU" };
      if (item.requiredEps8 && item.requiredEps8 !== ctx.cpuEpsNeed) {
        return { available: false, reason: `CPU conseillé en ${ctx.cpuEpsNeed} x EPS 8-pin` };
      }
      return { available: true, reason: "" };
    }

    return { available: true, reason: "" };
  }

  return { available: true, reason: "" };
}

function consumptionEstimate(cpu, gpu, cooling) {
  if (!cpu || !gpu) return 0;
  const coolType = cooling?.type || "none";
  const coolExtra = coolType === "custom" ? 45 : coolType === "aio" ? 25 : 10;
  return cpu.tdp + gpu.tdp + 120 + coolExtra;
}

function deliveryComponentRate(key) {
  const table = {
    cpu: 0.006,
    mobo: 0.008,
    ram: 0.004,
    gpu: 0.015,
    storage: 0.0045,
    psu: 0.011,
    case: 0.016,
    cooling: 0.008,
    customCable: 0.0035,
    cableMgmt: 0.002
  };
  return table[key] || 0;
}

function processingComplexityFactor(selection) {
  const cpuRank = selection.cpu?.rank || 6;
  const gpuRank = selection.gpu?.rank || 6;
  const coolingFactor = selection.cooling?.type === "custom" ? 0.45 : selection.cooling?.type === "aio" ? 0.15 : 0.06;
  const cableFactor = selection.customCable && !selection.customCable.isNone ? 0.1 : 0;
  const mgmtFactor = selection.cableMgmt && !selection.cableMgmt.isNone ? 0.06 : 0;
  return 1 + ((cpuRank + gpuRank) / 40) + coolingFactor + cableFactor + mgmtFactor;
}

function computeProcessingFee(selection, delivery) {
  if (!delivery) return 0;
  const keys = ["cpu", "mobo", "ram", "gpu", "storage", "psu", "case", "cooling", "customCable", "cableMgmt"];
  const variable = keys.reduce((sum, key) => {
    const item = selection[key];
    const price = Number(item?.price || 0);
    return sum + (price * deliveryComponentRate(key));
  }, 0);

  const complexity = processingComplexityFactor(selection);
  const speedFactor = Number(delivery.speedFactor || 1);
  const insuranceFactor = Number(delivery.insuranceFactor || 1);
  const raw = (Number(delivery.baseFee || 0) + variable) * complexity * speedFactor * insuranceFactor;

  const minimum = delivery.mode === "priority" ? 55 : delivery.mode === "economy" ? 12 : 24;
  return Math.max(minimum, Math.round(raw * 100) / 100);
}

function parseBudgetValue(id) {
  const raw = Number(document.getElementById(id)?.value || 0);
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  return Math.round(raw);
}

function cheapest(list, predicate) {
  return sortByBrandGenerationScore(list)
    .filter(predicate)
    .sort((a, b) => a.price - b.price)[0] || null;
}

function normalDeliveryOption() {
  return CATALOG.delivery.find((item) => item.mode === "normal") || CATALOG.delivery[0] || null;
}

function economyDeliveryOption() {
  return CATALOG.delivery.find((item) => item.mode === "economy") || CATALOG.delivery[0] || null;
}

function minimumBoardTierForCpu(cpu) {
  const rank = Number(cpu?.rank || 0);
  if (rank >= 9.1) return 4;
  if (rank >= 8.0) return 3;
  if (rank >= 6.8) return 2;
  return 1;
}

function cpuGpuRatio(cpu, gpu) {
  const cpuRank = Number(cpu?.rank || 0);
  const gpuRank = Number(gpu?.rank || 0);
  if (!cpuRank || !gpuRank) return 1;
  return cpuRank / Math.max(0.01, gpuRank);
}

function usageBalanceDelta(cpu, gpu, usageProfile) {
  if (!usageProfile) return 0;
  const ratio = cpuGpuRatio(cpu, gpu);
  if (ratio < usageProfile.ratioLow) return usageProfile.ratioLow - ratio;
  if (ratio > usageProfile.ratioHigh) return ratio - usageProfile.ratioHigh;
  return 0;
}

function isUsageBalanced(cpu, gpu, usageProfile, slack = 0.18) {
  if (!usageProfile) return true;
  const ratio = cpuGpuRatio(cpu, gpu);
  const minRatio = Math.max(0.01, usageProfile.ratioLow - slack);
  const maxRatio = usageProfile.ratioHigh + slack;
  return ratio >= minRatio && ratio <= maxRatio;
}

function computeUsageMinimumOffer(usageValue) {
  if (USAGE_MIN_CACHE[usageValue]) return USAGE_MIN_CACHE[usageValue];
  const usageProfile = USAGE_PROFILE[usageValue];
  if (!usageProfile) return null;

  const storage = cheapest(CATALOG.storage, (item) => item.tb >= usageProfile.minStorage);
  const customCable = CATALOG.customCables.find((item) => item.isNone) || { price: 0, isNone: true };
  const cableMgmt = CATALOG.cableMgmt.find((item) => item.isNone) || CATALOG.cableMgmt[0];
  const delivery = economyDeliveryOption();

  if (!storage || !delivery || !cableMgmt) return null;

  const cpuCandidates = sortByBrandGenerationScore(CATALOG.cpu)
    .filter((item) => item.rank >= usageProfile.minCpu)
    .sort((a, b) => a.price - b.price)
    .slice(0, 28);

  const gpuCandidates = sortByBrandGenerationScore(CATALOG.gpu)
    .filter((item) => item.rank >= usageProfile.minGpu && (usageProfile.minVram === 0 || item.vram >= usageProfile.minVram))
    .sort((a, b) => a.price - b.price)
    .slice(0, 28);

  let best = null;

  cpuCandidates.forEach((cpu) => {
    const minTier = minimumBoardTierForCpu(cpu);
    const moboCandidates = sortByBrandGenerationScore(CATALOG.mobo)
      .filter((mobo) => mobo.socket === cpu.socket && cpuMoboGenerationCompatible(cpu, mobo) && Number(mobo.tier || 1) >= minTier)
      .sort((a, b) => a.price - b.price)
      .slice(0, 12);

    moboCandidates.forEach((mobo) => {
      const ram = cheapest(CATALOG.ram, (item) => item.type === mobo.ramType && item.gb >= usageProfile.minRam);
      if (!ram) return;

      gpuCandidates.forEach((gpu) => {
        if (!isUsageBalanced(cpu, gpu, usageProfile, 0.22)) return;
        const casev = cheapest(CATALOG.case, (item) => item.maxGpu >= gpu.length);
        if (!casev) return;

        const cooling = cheapest(
          CATALOG.watercooling,
          (item) => !item.estimateOnly
            && ((item.type === "air" || item.type === "none") || item.radiator <= casev.maxRad)
            && (cpu.tdp < 120 || Number(item.score || 0) >= 8.6)
        );
        if (!cooling) return;

        const recommendedPsu = Math.ceil((consumptionEstimate(cpu, gpu, cooling) * 1.35) / 50) * 50;
        const psu = cheapest(CATALOG.psu, (item) => item.watts >= recommendedPsu);
        if (!psu) return;

        const partsTotal = cpu.price + mobo.price + ram.price + gpu.price + storage.price + psu.price + casev.price;
        const processingFee = computeProcessingFee({
          cpu,
          mobo,
          ram,
          gpu,
          storage,
          psu,
          case: casev,
          cooling,
          customCable,
          cableMgmt
        }, delivery);
        const total = BASE_PRICE + partsTotal + cooling.price + cableMgmt.price + processingFee;
        const qualityScore =
          (cpu.rank * 2.2) +
          (gpu.rank * 2.6) +
          (ram.score || 0) +
          (mobo.score || 0) +
          (psu.score || 0) +
          (casev.score || 0) +
          (cooling.score || 0);
        const balancePenalty = usageBalanceDelta(cpu, gpu, usageProfile) * 14;
        const finalScore = qualityScore - balancePenalty;

        if (!best
          || (total < best.total - 15)
          || (Math.abs(total - best.total) <= 15 && finalScore > best.score)) {
          best = {
            total: Math.round(total * 100) / 100,
            delivery,
            score: finalScore,
            parts: { cpu, mobo, ram, gpu, storage, psu, case: casev, cooling, cableMgmt }
          };
        }
      });
    });
  });

  USAGE_MIN_CACHE[usageValue] = best;
  return best;
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || !item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function candidateMix(list, perfKey, limit = 12) {
  if (!list.length) return [];
  const half = Math.max(1, Math.ceil(limit / 2));
  const byPrice = [...list].sort((a, b) => a.price - b.price).slice(0, half);
  const byPerf = [...list]
    .sort((a, b) => ((b[perfKey] || b.score || 0) - (a[perfKey] || a.score || 0)) || (a.price - b.price))
    .slice(0, half);
  return uniqueById([...byPrice, ...byPerf]).slice(0, limit);
}

function presetTotal(parts, delivery, customCable, cableMgmt) {
  if (!parts || !delivery) return 0;
  const coolingPrice = parts.cooling?.estimateOnly ? 0 : Number(parts.cooling?.price || 0);
  const processingFee = computeProcessingFee({
    cpu: parts.cpu,
    mobo: parts.mobo,
    ram: parts.ram,
    gpu: parts.gpu,
    storage: parts.storage,
    psu: parts.psu,
    case: parts.case,
    cooling: parts.cooling,
    customCable,
    cableMgmt
  }, delivery);
  return BASE_PRICE
    + Number(parts.cpu?.price || 0)
    + Number(parts.mobo?.price || 0)
    + Number(parts.ram?.price || 0)
    + Number(parts.gpu?.price || 0)
    + Number(parts.storage?.price || 0)
    + Number(parts.psu?.price || 0)
    + Number(parts.case?.price || 0)
    + coolingPrice
    + Number(customCable?.price || 0)
    + Number(cableMgmt?.price || 0)
    + processingFee;
}

function computeUsageBalancedOffer(usageValue) {
  const usageProfile = USAGE_PROFILE[usageValue];
  const minOffer = computeUsageMinimumOffer(usageValue);
  if (!usageProfile || !minOffer) return null;

  const inputBudgetMin = parseBudgetValue("budgetMin");
  const inputBudgetMax = parseBudgetValue("budgetMax");
  const usageMinimum = Math.max(BUDGET_DEFAULT_MIN, roundBudgetStep(Math.ceil(minOffer.total)));
  const floor = Math.max(usageMinimum, inputBudgetMin || 0);
  let cap = inputBudgetMax || Math.max(floor + 900, usageMinimum + 1000);
  if (cap < floor) cap = floor;
  const softCap = Math.max(cap, roundBudgetStep(cap * 1.18));

  let target = inputBudgetMin && inputBudgetMax
    ? roundBudgetStep((inputBudgetMin + inputBudgetMax) / 2)
    : inputBudgetMax
      ? roundBudgetStep(Math.max(floor, inputBudgetMax * 0.78))
      : inputBudgetMin
        ? roundBudgetStep(inputBudgetMin + 500)
        : roundBudgetStep(usageMinimum + 700);
  target = Math.max(floor, Math.min(target, cap));

  const customCable = CATALOG.customCables.find((item) => item.isNone) || { id: "cab-none-fallback", price: 0, isNone: true };
  const cableMgmt = CATALOG.cableMgmt.find((item) => item.isNone) || CATALOG.cableMgmt[0];
  const deliveryCandidates = uniqueById([
    CATALOG.delivery.find((item) => item.mode === "normal") || CATALOG.delivery.find((item) => item.mode === "economy")
  ]).filter(Boolean);
  if (!cableMgmt || !deliveryCandidates.length) return null;

  const cpuCandidates = candidateMix(
    sortByBrandGenerationScore(CATALOG.cpu).filter((item) => item.rank >= usageProfile.minCpu),
    "rank",
    14
  );
  const gpuCandidates = candidateMix(
    sortByBrandGenerationScore(CATALOG.gpu).filter((item) => item.rank >= usageProfile.minGpu && (usageProfile.minVram === 0 || item.vram >= usageProfile.minVram)),
    "rank",
    16
  );
  const storageCandidates = candidateMix(
    sortByBrandGenerationScore(CATALOG.storage).filter((item) => item.tb >= usageProfile.minStorage),
    "score",
    4
  );
  if (!cpuCandidates.length || !gpuCandidates.length || !storageCandidates.length) return null;

  let best = null;
  let bestOverCap = null;
  const minBalancedTotal = floor + 120;

  cpuCandidates.forEach((cpu) => {
    const moboCandidates = candidateMix(
      sortByBrandGenerationScore(CATALOG.mobo).filter((mobo) =>
        mobo.socket === cpu.socket
        && cpuMoboGenerationCompatible(cpu, mobo)
        && Number(mobo.tier || 1) >= minimumBoardTierForCpu(cpu)
      ),
      "tier",
      4
    );

    moboCandidates.forEach((mobo) => {
      const ramCandidates = candidateMix(
        sortByBrandGenerationScore(CATALOG.ram).filter((ram) => ram.type === mobo.ramType && ram.gb >= usageProfile.minRam),
        "score",
        3
      );
      if (!ramCandidates.length) return;

      gpuCandidates.forEach((gpu) => {
        if (!isUsageBalanced(cpu, gpu, usageProfile, 0.12)) return;
        const caseCandidates = candidateMix(
          sortByBrandGenerationScore(CATALOG.case).filter((casev) => casev.maxGpu >= gpu.length),
          "score",
          3
        );
        if (!caseCandidates.length) return;

        caseCandidates.forEach((casev) => {
          const coolingCandidates = candidateMix(
            sortByBrandGenerationScore(CATALOG.watercooling).filter((cooling) => !cooling.estimateOnly && ((cooling.type === "air" || cooling.type === "none") || cooling.radiator <= casev.maxRad)),
            "score",
            3
          );
          if (!coolingCandidates.length) return;

          ramCandidates.forEach((ram) => {
            storageCandidates.forEach((storage) => {
              coolingCandidates.forEach((cooling) => {
                const recommendedPsu = Math.ceil((consumptionEstimate(cpu, gpu, cooling) * 1.35) / 50) * 50;
                const psuCandidates = candidateMix(
                  sortByBrandGenerationScore(CATALOG.psu).filter((psu) => psu.watts >= recommendedPsu),
                  "score",
                  3
                );
                if (!psuCandidates.length) return;

                psuCandidates.forEach((psu) => {
                  deliveryCandidates.forEach((delivery) => {
                    const parts = { cpu, mobo, ram, gpu, storage, psu, case: casev, cooling };
                    const total = Math.round(presetTotal(parts, delivery, customCable, cableMgmt) * 100) / 100;
                    if (total < floor || total > softCap) return;

                    const quality =
                      (cpu.rank * 3.0) +
                      (gpu.rank * 3.4) +
                      (ram.score || 0) +
                      (storage.score || 0) +
                      (mobo.score || 0) +
                      (casev.score || 0) +
                      (cooling.score || 0) +
                      (psu.score || 0) +
                      (delivery.mode === "normal" ? 0.3 : 0);
                    const distance = Math.abs(total - target) / Math.max(1, target);
                    const balancePenalty = usageBalanceDelta(cpu, gpu, usageProfile) * 12;
                    const underPenalty = total < minBalancedTotal ? 0.35 : 0;
                    const score = quality - (distance * 8.2) - underPenalty - balancePenalty;

                    if (total <= cap) {
                      if (!best || score > best.score || (Math.abs(total - target) < Math.abs(best.total - target) && score >= best.score - 0.25)) {
                        best = { score, total, delivery, parts };
                      }
                    } else if (!bestOverCap || score > bestOverCap.score || total < bestOverCap.total) {
                      bestOverCap = { score, total, delivery, parts };
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  return best || bestOverCap || null;
}

function optionBadge(key, item, availability) {
  if (BADGE_EXCLUDED_KEYS.has(key)) return "";
  if (!availability.available) return OPTION_BADGE.no;
  if (item?.isNone) return OPTION_BADGE.none;

  const usageValue = document.getElementById("usage")?.value || "";
  const usageProfile = USAGE_PROFILE[usageValue] || null;
  const selectedCpu = selectedByKey("cpu");
  const selectedGpu = selectedByKey("gpu");
  const selectedMobo = selectedByKey("mobo");
  const selectedRam = selectedByKey("ram");
  const selectedCase = selectedByKey("case");
  const selectedCooling = selectedByKey("watercooling") || CATALOG.watercooling[0];

  if (key === "cpu" && usageProfile) {
    if (item.rank >= usageProfile.minCpu + 1.2) return OPTION_BADGE.best;
    if (item.rank >= usageProfile.minCpu) return OPTION_BADGE.good;
    return OPTION_BADGE.low;
  }

  if (key === "gpu" && usageProfile) {
    const goodRank = item.rank >= usageProfile.minGpu;
    const goodVram = usageProfile.minVram === 0 || item.vram >= usageProfile.minVram;
    if (goodRank && goodVram && item.rank >= usageProfile.minGpu + 1.2) return OPTION_BADGE.best;
    if (goodRank && goodVram) return OPTION_BADGE.good;
    return OPTION_BADGE.low;
  }

  if (key === "ram" && usageProfile) {
    if (item.gb >= usageProfile.minRam * 2) return OPTION_BADGE.best;
    if (item.gb >= usageProfile.minRam) return OPTION_BADGE.good;
    return OPTION_BADGE.low;
  }

  if (key === "storage" && usageProfile) {
    if (item.tb >= usageProfile.minStorage * 2) return OPTION_BADGE.best;
    if (item.tb >= usageProfile.minStorage) return OPTION_BADGE.good;
    return OPTION_BADGE.low;
  }

  if (key === "psu" && selectedCpu && selectedGpu) {
    const recommended = Math.ceil((consumptionEstimate(selectedCpu, selectedGpu, selectedCooling) * 1.35) / 50) * 50;
    if (item.watts >= recommended && item.watts <= recommended + 220) return OPTION_BADGE.best;
    if (item.watts >= recommended) return OPTION_BADGE.good;
    return OPTION_BADGE.low;
  }

  if (key === "mobo" && selectedCpu) {
    if (item.socket !== selectedCpu.socket) return OPTION_BADGE.low;
    if (selectedRam && item.ramType !== selectedRam.type) return OPTION_BADGE.low;
    return item.tier >= 4 ? OPTION_BADGE.best : OPTION_BADGE.good;
  }

  if (key === "case" && selectedGpu) {
    const margin = item.maxGpu - selectedGpu.length;
    if (margin >= 50) return OPTION_BADGE.best;
    if (margin >= 15) return OPTION_BADGE.good;
    return OPTION_BADGE.low;
  }

  if (key === "watercooling" && selectedCase) {
    if ((item.type === "aio" || item.type === "custom") && item.radiator > selectedCase.maxRad) return OPTION_BADGE.low;
    if (selectedCpu && selectedCpu.tdp >= 120 && item.type === "air" && item.score < 9) return OPTION_BADGE.low;
    return item.score >= 9.3 ? OPTION_BADGE.best : OPTION_BADGE.good;
  }

  if (key === "customCables") {
    if (item.dynamic || item.score >= 9.3) return OPTION_BADGE.best;
    if (item.score >= 8.2) return OPTION_BADGE.good;
    return OPTION_BADGE.low;
  }

  if (key === "cableMgmt") {
    if (item.score >= 9.1) return OPTION_BADGE.best;
    if (item.score >= 7.5) return OPTION_BADGE.good;
    return OPTION_BADGE.low;
  }

  return OPTION_BADGE.good;
}

function availabilityForCategory(key, item, cableCtx) {
  const base = optionAvailability(key, item, cableCtx);
  if (!base.available) return base;
  if (item?.isNone) return base;

  const selectedCpu = selectedByKey("cpu");
  const selectedMobo = selectedByKey("mobo");
  const selectedRam = selectedByKey("ram");
  const selectedGpu = selectedByKey("gpu");
  const selectedCase = selectedByKey("case");
  const selectedCooling = selectedByKey("watercooling") || CATALOG.watercooling[0];

  if (key === "cpu" && isPendingExternal(selectedMobo)) return { available: true, reason: "" };
  if (key === "cpu" && selectedMobo && item.socket !== selectedMobo.socket) {
    return { available: false, reason: `Socket ${selectedMobo.socket} requis` };
  }
  if (key === "cpu" && selectedMobo && !cpuMoboGenerationCompatible(item, selectedMobo)) {
    return { available: false, reason: "Chipset carte mère non adapté à cette génération CPU" };
  }
  if (key === "mobo") {
    if (isPendingExternal(selectedCpu) || isPendingExternal(selectedRam)) return { available: true, reason: "" };
    if (selectedCpu && item.socket !== selectedCpu.socket) {
      return { available: false, reason: `Socket CPU ${selectedCpu.socket} requis` };
    }
    if (selectedCpu && !cpuMoboGenerationCompatible(selectedCpu, item)) {
      return { available: false, reason: "Chipset non adapté au CPU sélectionné" };
    }
    if (selectedRam && item.ramType !== selectedRam.type) {
      return { available: false, reason: `${selectedRam.type} requis` };
    }
  }
  if (key === "ram" && isPendingExternal(selectedMobo)) return { available: true, reason: "" };
  if (key === "ram" && selectedMobo && item.type !== selectedMobo.ramType) {
    return { available: false, reason: `${selectedMobo.ramType} requis` };
  }
  if (key === "ram" && selectedMobo && selectedMobo.ramType === "DDR4" && Number(item.generation || 0) > 4000) {
    return { available: false, reason: "DDR4 > 4000 MT/s peu stable sur cette plateforme" };
  }
  if (key === "ram" && selectedMobo && selectedMobo.ramType === "DDR5" && Number(item.generation || 0) >= 7600 && Number(selectedMobo.tier || 1) < 3) {
    return { available: false, reason: "DDR5 tres haute frequence: carte mere tier 3+ conseillee" };
  }
  if (key === "gpu" && isPendingExternal(selectedCase)) return { available: true, reason: "" };
  if (key === "gpu" && selectedCase && item.length > effectiveCaseGpuLimit(selectedCase, selectedCooling)) {
    const limit = effectiveCaseGpuLimit(selectedCase, selectedCooling);
    return { available: false, reason: `Boitier max ${limit} mm avec refroidissement actuel` };
  }
  if (key === "case" && isPendingExternal(selectedGpu)) return { available: true, reason: "" };
  if (key === "case" && selectedGpu && effectiveCaseGpuLimit(item, selectedCooling) < selectedGpu.length) {
    return { available: false, reason: `GPU ${selectedGpu.length} mm non supporte avec ce refroidissement` };
  }
  if (key === "case" && selectedCooling && (selectedCooling.type === "aio" || selectedCooling.type === "custom") && item.maxRad < Number(selectedCooling.radiator || 0)) {
    return { available: false, reason: `Radiateur ${selectedCooling.radiator} mm non supporte` };
  }
  if (key === "watercooling" && isPendingExternal(selectedCase)) return { available: true, reason: "" };
  if (key === "watercooling" && selectedCase && (item.type === "aio" || item.type === "custom") && item.radiator > selectedCase.maxRad) {
    return { available: false, reason: `Radiateur max ${selectedCase.maxRad} mm` };
  }
  if (key === "watercooling" && selectedCase && selectedGpu && (item.type === "aio" || item.type === "custom")) {
    const limit = effectiveCaseGpuLimit(selectedCase, item);
    if (selectedGpu.length > limit) {
      return { available: false, reason: `GPU ${selectedGpu.length} mm > clearance ${limit} mm avec ce radiateur` };
    }
  }
  if (key === "watercooling" && selectedCpu && item.type === "none" && selectedCpu.tdp >= 105) {
    return { available: false, reason: "CPU energivore: refroidissement dedie requis" };
  }
  if (key === "watercooling" && selectedCpu && item.type === "air" && selectedCpu.tdp >= 170 && Number(item.score || 0) < 9.1) {
    return { available: false, reason: "CPU tres energivore: aircooling premium/AIO requis" };
  }
  if (key === "psu" && (isPendingExternal(selectedCpu) || isPendingExternal(selectedGpu))) return { available: true, reason: "" };
  if (key === "psu" && selectedCpu && selectedGpu) {
    const recommended = Math.ceil((consumptionEstimate(selectedCpu, selectedGpu, selectedCooling) * 1.35) / 50) * 50;
    if (item.watts < Math.max(550, recommended - 120)) {
      return { available: false, reason: `Puissance mini ${Math.max(550, recommended - 120)}W` };
    }
    if (selectedGpu.tdp >= 350 && item.watts < 900) {
      return { available: false, reason: "GPU haut de gamme: alim 900W+ recommandee" };
    }
  }

  return { available: true, reason: "" };
}

function groupLabelFor(key, item) {
  if (key === "cpu") return `${item.brand} a: Génération ${item.generation}`;
  if (key === "gpu") return `${item.brand} a: Série ${item.generation}`;
  if (key === "mobo") return `${item.brand} a: Socket ${item.socket}`;
  if (key === "ram") return `${item.brand} a: ${item.type}`;
  if (key === "psu") return `${item.brand} a: ${item.watts}W`;
  if (key === "storage") return `${item.brand} a: ${item.tb} To`;
  if (key === "case") return `${item.brand}`;
  if (key === "customCables") return `${item.category} a: ${item.brand}`;
  return item.brand || "Autres";
}

function requiredCategoryKeys() {
  return Object.entries(CATEGORY_CONFIG)
    .filter(([, cfg]) => cfg.required)
    .map(([key]) => key);
}

function isPendingExternal(item) {
  return Boolean(item && item.externalState === "pending");
}

function isCategoryReady(key) {
  return Boolean(getSelected(key));
}

function clearUnknownComponent(key, keepInput = false) {
  if (!UNKNOWN_COMPONENTS[key]) return;
  delete UNKNOWN_COMPONENTS[key];
  if (!keepInput) {
    const filterId = CATEGORY_CONFIG[key]?.filterId;
    const filterEl = filterId ? document.getElementById(filterId) : null;
    if (filterEl) filterEl.value = "";
  }
}

function confirmUnknownComponent(key, query, note = "") {
  if (NO_EXTERNAL_REFERENCE_KEYS.has(key)) {
    toast("Cette section accepte uniquement les options de la liste.");
    return;
  }
  const q = (query || "").trim();
  if (!q) return;
  const cleanNote = String(note || "").trim().slice(0, 600);
  UNKNOWN_COMPONENTS[key] = {
    key,
    query: q,
    note: cleanNote,
    confirmed: true,
    resolved: null,
    confirmedAt: Date.now()
  };
  const selectEl = document.getElementById(CATEGORY_CONFIG[key].selectId);
  if (selectEl) selectEl.value = "";
  updateFilterInputFromSelection(key);
  closeAllComboMenus("");
  refreshDependentPersonalizationOptions();
  compute();
  scheduleUnknownResearch();
}

function pendingUnknownKeys() {
  return Object.entries(UNKNOWN_COMPONENTS)
    .filter(([, value]) => value?.confirmed && value?.query && !value.resolved)
    .map(([key]) => key);
}

async function resolvePendingUnknowns() {
  const keys = pendingUnknownKeys();
  if (!keys.length) return false;
  let changed = false;
  for (const key of keys) {
    const entry = UNKNOWN_COMPONENTS[key];
    let resolved = await resolveUnknownComponentOnline(key, entry.query);
    if (!resolved) resolved = resolveUnknownComponent(key, entry.query);
    if (!resolved) continue;
    entry.resolved = resolved;
    entry.resolvedAt = Date.now();
    changed = true;
  }
  return changed;
}

function scheduleUnknownResearch() {
  clearTimeout(unknownResearchTimer);
  unknownResearchTimer = setTimeout(async () => {
    if (unknownResearchInFlight) return;
    const usageValue = document.getElementById("usage")?.value || "";
    if (!usageValue) return;
    const ready = requiredCategoryKeys().every((key) => isCategoryReady(key));
    if (!ready) return;
    unknownResearchInFlight = true;
    let changed = false;
    try {
      changed = await resolvePendingUnknowns();
    } finally {
      unknownResearchInFlight = false;
    }
    if (!changed) return;
    refreshDependentPersonalizationOptions();
    Object.keys(CATEGORY_CONFIG).forEach((key) => updateFilterInputFromSelection(key));
    compute();
    toast("Référence externe analysée via internet et intégrée.");
  }, 260);
}

function closeAllComboMenus(exceptKey = "") {
  let isOpen = false;
  Object.entries(COMBO_MENU_BY_KEY).forEach(([key, menuEl]) => {
    if (!menuEl) return;
    const shouldOpen = key === exceptKey;
    menuEl.classList.toggle("is-open", shouldOpen);
    const hostField = menuEl.closest(".component-field");
    if (hostField) hostField.classList.toggle("is-menu-open", shouldOpen);
    if (shouldOpen) isOpen = true;
  });
  document.body.classList.toggle("is-combo-open", isOpen);
}

function updateFilterInputFromSelection(key) {
  const config = CATEGORY_CONFIG[key];
  if (!config?.filterId) return;
  const filterEl = document.getElementById(config.filterId);
  const selectEl = document.getElementById(config.selectId);
  if (!filterEl || !selectEl) return;
  const unknown = NO_EXTERNAL_REFERENCE_KEYS.has(key) ? null : UNKNOWN_COMPONENTS[key];
  if (unknown?.confirmed && unknown.query) {
    filterEl.value = unknown.query;
    filterEl.classList.add("is-external");
    return;
  }
  filterEl.classList.remove("is-external");
  const selected = (CATALOG[key] || []).find((item) => item.id === selectEl.value);
  if (selected) {
    filterEl.value = shortLabel(key, selected);
    return;
  }
  filterEl.value = "";
}

function selectOptionFromCombo(key, optionId) {
  const config = CATEGORY_CONFIG[key];
  const selectEl = document.getElementById(config.selectId);
  if (!selectEl) return;
  clearUnknownComponent(key, true);
  selectEl.value = optionId || "";
  updateFilterInputFromSelection(key);
  closeAllComboMenus("");
  selectEl.dispatchEvent(new Event("change", { bubbles: true }));
}

function appendOtherChoice(menuEl, key, typed, unknown, filterEl) {
  if (NO_EXTERNAL_REFERENCE_KEYS.has(key)) return;
  const footer = document.createElement("div");
  footer.className = "combo-footer";

  const otherBtn = document.createElement("button");
  otherBtn.type = "button";
  otherBtn.className = "combo-other-btn";
  otherBtn.textContent = unknown?.confirmed
    ? "Modifier la référence externe"
    : "Autre référence (hors liste)";

  otherBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (unknown?.confirmed) {
      clearUnknownComponent(key, true);
      if (filterEl) {
        filterEl.value = "";
        filterEl.focus();
      }
      renderCategory(key);
      closeAllComboMenus(key);
      return;
    }

    if (!typed) {
      toast("Saisis d'abord la référence dans le champ.");
      filterEl?.focus();
      closeAllComboMenus(key);
      return;
    }
    confirmUnknownComponent(key, typed);
  });

  footer.appendChild(otherBtn);
  menuEl.appendChild(footer);
}

function renderComboMenu(key, items) {
  const config = CATEGORY_CONFIG[key];
  if (!config?.filterId) return;
  const menuEl = COMBO_MENU_BY_KEY[key];
  const selectEl = document.getElementById(config.selectId);
  if (!menuEl || !selectEl) return;

  menuEl.innerHTML = "";
  const filterEl = config.filterId ? document.getElementById(config.filterId) : null;
  const typed = (filterEl?.value || "").trim();

  const unknown = NO_EXTERNAL_REFERENCE_KEYS.has(key) ? null : UNKNOWN_COMPONENTS[key];
  if (unknown?.confirmed && unknown.query) {
    const status = document.createElement("div");
    status.className = "combo-external";
    status.textContent = unknown.resolved
      ? `Référence externe intégrée: ${unknown.query}`
      : `Référence externe en attente d'analyse: ${unknown.query}`;
    menuEl.appendChild(status);
  }

		  if (!items.length) {
		    if (typed && !unknown?.confirmed && !NO_EXTERNAL_REFERENCE_KEYS.has(key)) {
	      const ask = document.createElement("div");
	      ask.className = "combo-empty";
      ask.textContent = `Référence inconnue "${typed}". Êtes-vous sûr qu'elle existe ?`;
	      menuEl.appendChild(ask);

      const mailInfo = document.createElement("div");
      mailInfo.className = "combo-mail-info";
      mailInfo.textContent = "Si tu confirmes, l'atelier reçoit ta référence dans ton devis et te répond par mail avec la confirmation de compatibilité et le prix retenu.";
      menuEl.appendChild(mailInfo);

      const noteWrap = document.createElement("label");
      noteWrap.className = "combo-unknown-note";
      noteWrap.innerHTML = '<span class="combo-unknown-note__label">Note pour l\'atelier — facultatif</span>';
      const noteInput = document.createElement("textarea");
      noteInput.className = "combo-unknown-note__input";
      noteInput.rows = 2;
      noteInput.placeholder = "Ex : je veux une comparaison · trouvez-moi moins cher · alternative dispo ?";
      noteInput.addEventListener("mousedown", e => e.stopPropagation());
      noteInput.addEventListener("click", e => e.stopPropagation());
      noteWrap.appendChild(noteInput);
      menuEl.appendChild(noteWrap);

      const actions = document.createElement("div");
      actions.className = "combo-unknown-actions";

      const yesBtn = document.createElement("button");
      yesBtn.type = "button";
      yesBtn.className = "combo-unknown-btn";
      yesBtn.textContent = "Oui, je confirme";
      yesBtn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        confirmUnknownComponent(key, typed, noteInput.value);
      });

      const noBtn = document.createElement("button");
      noBtn.type = "button";
      noBtn.className = "combo-unknown-btn combo-unknown-btn--ghost";
      noBtn.textContent = "Non";
      noBtn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        clearUnknownComponent(key, true);
        renderCategory(key);
      });

	      actions.appendChild(yesBtn);
	      actions.appendChild(noBtn);
	      menuEl.appendChild(actions);
	        appendOtherChoice(menuEl, key, typed, unknown, filterEl);
		    } else if (typed && unknown?.confirmed) {
	      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "combo-unknown-btn combo-unknown-btn--ghost combo-unknown-btn--wide";
      remove.textContent = "Retirer la référence externe";
	      remove.addEventListener("mousedown", (e) => {
	        e.preventDefault();
	        clearUnknownComponent(key);
	        renderCategory(key);
	      });
	      menuEl.appendChild(remove);
	        appendOtherChoice(menuEl, key, typed, unknown, filterEl);
		    } else {
		      const empty = document.createElement("div");
		      empty.className = "combo-empty";
		      empty.textContent = "Aucun résultat";
		      menuEl.appendChild(empty);
	        appendOtherChoice(menuEl, key, typed, unknown, filterEl);
		    }
		    return;
		  }

  if (typed && !unknown?.confirmed) {
    const normalizedTyped = normalizeText(typed);
    const exact = items.some((item) => normalizeText(`${item.brand || ""} ${item.name || ""}`).includes(normalizedTyped));
    if (!exact) {
      const suggest = document.createElement("div");
      suggest.className = "combo-empty";
      suggest.textContent = `Référence exacte introuvable: "${typed}"`;
      menuEl.appendChild(suggest);
    }
  }

  let currentGroup = "";
  const ctx = getCableContext();
  items.forEach((item) => {
    const group = groupLabelFor(key, item);
    if (group !== currentGroup) {
      currentGroup = group;
      const groupEl = document.createElement("div");
      groupEl.className = "combo-group";
      groupEl.textContent = group;
      menuEl.appendChild(groupEl);
    }

    const availability = availabilityForCategory(key, item, ctx);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "combo-option";
    if (!availability.available) row.classList.add("is-disabled");
    if (selectEl.value === item.id) row.classList.add("is-selected");

    const badge = optionBadge(key, item, availability);
    const tone = badgeToneClass(badge);
    const text = comboOptionTexts(key, item);

    const top = document.createElement("div");
    top.className = "combo-option__top";

    if (badge) {
      const badgeEl = document.createElement("span");
      badgeEl.className = `combo-badge ${tone}`.trim();
      badgeEl.textContent = badge;
      top.appendChild(badgeEl);
    }

    const titleEl = document.createElement("span");
    titleEl.className = "combo-option__title";
    titleEl.textContent = text.title;
    top.appendChild(titleEl);
    row.appendChild(top);

    if (text.meta) {
      const metaEl = document.createElement("div");
      metaEl.className = "combo-option__meta";
      metaEl.textContent = text.meta;
      row.appendChild(metaEl);
    }

    if (!availability.available) {
      const reasonEl = document.createElement("div");
      reasonEl.className = "combo-option__reason";
      reasonEl.textContent = `Indisponible: ${availability.reason}`;
      row.appendChild(reasonEl);
    }

    if (availability.available) {
      row.addEventListener("mousedown", (e) => {
        e.preventDefault();
        selectOptionFromCombo(key, item.id);
      });
    } else {
      row.disabled = true;
	    }
	    menuEl.appendChild(row);
	  });

  appendOtherChoice(menuEl, key, typed, unknown, filterEl);
}

function setOptionalDefaults() {
  OPTIONAL_NONE_KEYS.forEach((key) => {
    const config = CATEGORY_CONFIG[key];
    const selectEl = config ? document.getElementById(config.selectId) : null;
    if (!selectEl) return;
    if (!selectEl.value) return;
    const exists = (CATALOG[key] || []).some((item) => item.id === selectEl.value);
    if (!exists) selectEl.value = "";
  });
}

function ensureComboInputs() {
  Object.entries(CATEGORY_CONFIG).forEach(([key, config]) => {
    if (!config.filterId) return;
    const filterEl = document.getElementById(config.filterId);
    const selectEl = document.getElementById(config.selectId);
    if (!filterEl || !selectEl) return;

    filterEl.classList.add("combo-input");
    filterEl.setAttribute("autocomplete", "off");
    filterEl.dataset.comboKey = key;
    selectEl.classList.add("combo-hidden");

    let menuEl = document.getElementById(`${config.selectId}Menu`);
    if (!menuEl) {
      menuEl = document.createElement("div");
      menuEl.id = `${config.selectId}Menu`;
      menuEl.className = "combo-menu";
      filterEl.insertAdjacentElement("afterend", menuEl);
    }
    COMBO_MENU_BY_KEY[key] = menuEl;
  });

  if (!ensureComboInputs._bound) {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.closest(".field-tools")) closeAllComboMenus("");
    });
    ensureComboInputs._bound = true;
  }
}

function renderCategory(key) {
  const config = CATEGORY_CONFIG[key];
  const selectEl = document.getElementById(config.selectId);
  if (!selectEl) return;

  let selectedValue = selectEl.value;
  const fullList = sortByBrandGenerationScore(CATALOG[key] || []);
  let items = sortByBrandGenerationScore(CATALOG[key] || []);

  if (config.filterId) {
    const filterText = (document.getElementById(config.filterId)?.value || "").trim().toLowerCase();
    if (filterText) {
      items = items.filter((item) => searchableText(item).includes(filterText));
    }
  }

  const selectedItem = fullList.find((item) => item.id === selectedValue);
  if (selectedItem && !items.some((item) => item.id === selectedItem.id)) {
    items = [selectedItem, ...items];
  }

  if (OPTIONAL_NONE_KEYS.has(key)) {
    const noneItems = items.filter((item) => item.isNone);
    const otherItems = items.filter((item) => !item.isNone);
    items = [...noneItems, ...otherItems];
  }

  selectEl.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = config.required ? "Choisir…" : "Choisir (optionnel)…";
  placeholder.selected = true;
  selectEl.appendChild(placeholder);

  const groups = new Map();
  const ctx = getCableContext();
  items.forEach((item) => {
    const groupKey = groupLabelFor(key, item);
    if (!groups.has(groupKey)) {
      groups.set(groupKey, document.createElement("optgroup"));
      groups.get(groupKey).label = groupKey;
      selectEl.appendChild(groups.get(groupKey));
    }

    const option = document.createElement("option");
    option.value = item.id;
    const availability = availabilityForCategory(key, item, ctx);
    const isCurrentSelection = selectedValue && item.id === selectedValue;
    const badge = optionBadge(key, item, availability);
    option.textContent = `${badge ? `${badge} ` : ""}${optionLabel(key, item)}${availability.available ? "" : ` — Indisponible (${availability.reason})`}`;
    option.disabled = !availability.available && !isCurrentSelection;
    groups.get(groupKey).appendChild(option);
  });

  if (selectedValue) {
    const picked = fullList.find((item) => item.id === selectedValue);
    if (picked) selectEl.value = selectedValue;
  }

  if (config.filterId) {
    renderComboMenu(key, items);
    const filterEl = document.getElementById(config.filterId);
    if (filterEl && document.activeElement !== filterEl) {
      updateFilterInputFromSelection(key);
    }
  }
}

function renderAllCategories() {
  Object.keys(CATEGORY_CONFIG).forEach((key) => renderCategory(key));
}

function refreshDependentPersonalizationOptions() {
  renderAllCategories();
}

let filtersBound = false;
function bindCatalogFiltersOnce() {
  if (filtersBound) return;
  Object.entries(CATEGORY_CONFIG).forEach(([key, config]) => {
    const filterEl = config.filterId ? document.getElementById(config.filterId) : null;

    if (filterEl) {
	      filterEl.addEventListener("input", () => {
	        const unknown = NO_EXTERNAL_REFERENCE_KEYS.has(key) ? null : UNKNOWN_COMPONENTS[key];
	        const typed = (filterEl.value || "").trim().toLowerCase();
	        if (unknown?.confirmed && unknown.query.toLowerCase() !== typed) {
	          clearUnknownComponent(key, true);
	        }
        renderCategory(key);
        closeAllComboMenus(key);
      });

	      filterEl.addEventListener("focus", () => {
	        const selected = getSelected(key);
	        const unknown = NO_EXTERNAL_REFERENCE_KEYS.has(key) ? null : UNKNOWN_COMPONENTS[key];
	        if (unknown?.confirmed) {
	          filterEl.value = unknown.query;
          renderCategory(key);
          closeAllComboMenus(key);
          return;
        }
        if (selected && !filterEl.value) filterEl.value = shortLabel(key, selected);
        renderCategory(key);
        closeAllComboMenus(key);
      });

      filterEl.addEventListener("blur", () => {
        window.setTimeout(() => {
          const menuEl = COMBO_MENU_BY_KEY[key];
          if (menuEl?.classList.contains("is-open")) return;
          updateFilterInputFromSelection(key);
        }, 80);
      });

      filterEl.addEventListener("click", () => {
        closeAllComboMenus(key);
      });

	      filterEl.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeAllComboMenus("");
          return;
        }
	        if (e.key === "Enter") {
          e.preventDefault();
          const typed = (filterEl.value || "").trim();
          if (!typed) return;
          const options = (CATALOG[key] || [])
            .filter((item) => searchableText(item).includes(typed.toLowerCase()))
            .filter((item) => availabilityForCategory(key, item, getCableContext()).available);
	          if (options.length) {
	            selectOptionFromCombo(key, options[0].id);
	          } else {
            if (NO_EXTERNAL_REFERENCE_KEYS.has(key)) {
              toast("Aucune option hors liste pour cette section.");
            } else {
              confirmUnknownComponent(key, typed);
            }
	          }
	        }
	      });
    }
  });
  filtersBound = true;
}

function getSelected(key) {
  const selectId = CATEGORY_CONFIG[key]?.selectId;
  const selectEl = selectId ? document.getElementById(selectId) : null;
  if (selectEl?.value) {
    return (CATALOG[key] || []).find((item) => item.id === selectEl.value) || null;
  }
  if (NO_EXTERNAL_REFERENCE_KEYS.has(key)) return null;
  const unknown = UNKNOWN_COMPONENTS[key];
  if (!unknown?.confirmed || !unknown.query) return null;
  if (unknown.resolved) return unknown.resolved;
  return buildUnknownPending(key, unknown.query);
}

function nextBetter(list, currentRank, filterFn = () => true) {
  return sortByBrandGenerationScore(list)
    .filter((item) => item.rank && item.rank > currentRank && filterFn(item))
    .sort((a, b) => (a.rank - b.rank) || (a.price - b.price))[0] || null;
}

function bestBudget(list, maxRank, filterFn = () => true) {
  return sortByBrandGenerationScore(list)
    .filter((item) => item.rank && item.rank <= maxRank && filterFn(item))
    .sort((a, b) => (b.rank - a.rank) || (a.price - b.price))[0] || null;
}

function clearAlerts() {
  const alertsEl = document.getElementById("alerts");
  if (alertsEl) alertsEl.innerHTML = "";
}

function alertBox(type, text) {
  const alertsEl = document.getElementById("alerts");
  if (!alertsEl) return;
  const el = document.createElement("div");
  el.className = `alert ${type}`;
  el.textContent = text;
  alertsEl.appendChild(el);
}

function renderSuggestions(items) {
  const suggestionsEl = document.getElementById("suggestions");
  if (!suggestionsEl) return;
  suggestionsEl.innerHTML = "";
  items.forEach((text) => {
    const el = document.createElement("div");
    el.className = "suggestion";
    el.textContent = text;
    suggestionsEl.appendChild(el);
  });
}

function renderBreakdown(rows) {
  const breakdownEl = document.getElementById("breakdown");
  if (!breakdownEl) return;
  breakdownEl.innerHTML = "";
  rows.forEach((row, idx) => {
    const line = document.createElement("div");
    line.className = "breakdown__row";
    if (idx === rows.length - 1) {
      const left = document.createElement("strong");
      left.textContent = String(row.name || "");
      const right = document.createElement("strong");
      right.textContent = String(row.value || "");
      line.appendChild(left);
      line.appendChild(right);
    } else {
      const left = document.createElement("span");
      left.className = "breakdown__name";
      left.textContent = String(row.name || "");
      const right = document.createElement("span");
      right.className = "breakdown__value";
      right.textContent = String(row.value || "");
      line.appendChild(left);
      line.appendChild(right);
    }
    breakdownEl.appendChild(line);
  });
}

function compute() {
  const cpu = getSelected("cpu");
  const mobo = getSelected("mobo");
  const ram = getSelected("ram");
  const gpu = getSelected("gpu");
  const storage = getSelected("storage");
  const psu = getSelected("psu");
  const casev = getSelected("case");
  const cooling = getSelected("watercooling") || CATALOG.watercooling[0];
  const customCable = getSelected("customCables") || CATALOG.customCables.find((x) => x.isNone);
  const cableMgmt = getSelected("cableMgmt") || CATALOG.cableMgmt[0];
  const delivery = getSelected("delivery");
  const usageValue = document.getElementById("usage")?.value || "";
  const budgetMin = parseBudgetValue("budgetMin");
  const budgetMax = parseBudgetValue("budgetMax");
  const usageMinimumOffer = usageValue ? computeUsageMinimumOffer(usageValue) : null;
  const usageMinimum = Number(usageMinimumOffer?.total || 0);

  const priceEl = document.getElementById("price");
  const suggestions = [];
  const warnings = [];
  const blocking = [];
  clearAlerts();
  renderSuggestions([]);

  const cableCtx = getCableContext();

  const requiredReady = Boolean(
    usageValue &&
    requiredCategoryKeys().every((key) => Boolean(getSelected(key)))
  );
  if (!requiredReady) {
    if (priceEl) priceEl.textContent = "—";
    renderBreakdown([{ name: "Estimation", value: "Complète la configuration" }]);
    if (isNoviceMode) {
      const missingCore = CORE_CATEGORY_KEYS.filter((key) => !getSelected(key));
      if (missingCore.length) {
        alertBox("warn", "Mode non connaisseur actif: decris ton besoin puis clique sur \"Generer une configuration automatiquement\".");
      } else {
        alertBox("warn", "Finalise l'usage et le traitement atelier pour obtenir une estimation fiable.");
      }
    } else {
      alertBox("warn", "Renseigne tous les composants, l'usage et le niveau de traitement atelier pour obtenir un résultat fiable.");
    }
    const notReadyState = {
      ready: false,
      canCheckout: false,
      total: 0,
      warnings,
      suggestions,
      bottleneck: null,
      customCoolingPending: false,
      budget: { min: budgetMin, max: budgetMax, usageMinimum }
    };
    emitCustomState(notReadyState);
    return notReadyState;
  }

  if (budgetMin && budgetMax && budgetMin > budgetMax) {
    blocking.push("Budget mini supérieur au budget maxi.");
    alertBox("bad", "Budget invalide: le budget mini dépasse le budget maxi.");
  }

  const pendingUnknown = [cpu, mobo, ram, gpu, storage, psu, casev, cooling, customCable, cableMgmt, delivery]
    .filter(Boolean)
    .some((item) => isPendingExternal(item));

  if (pendingUnknown) {
    alertBox("warn", "Composant externe en attente d'analyse: calcul provisoire en cours.");
  }

  if (!isPendingExternal(cpu) && !isPendingExternal(mobo) && cpu.socket !== mobo.socket) {
    blocking.push("Socket CPU / carte mère incompatible.");
    alertBox("bad", `Incompatibilité socket: ${cpu.socket} vs ${mobo.socket}.`);

    const altBoard = sortByBrandGenerationScore(CATALOG.mobo)
      .filter((item) => item.socket === cpu.socket && item.ramType === ram.type)
      .sort((a, b) => (a.price - b.price))[0];
    if (altBoard) suggestions.push(`Suggestion compatible: ${altBoard.brand} ${altBoard.name} (${euro(altBoard.price)}).`);
  } else if (!isPendingExternal(cpu) && !isPendingExternal(mobo)) {
    alertBox("good", "Socket CPU / carte mère: OK.");
  }

  if (!isPendingExternal(cpu) && !isPendingExternal(mobo) && cpu.socket === mobo.socket && !cpuMoboGenerationCompatible(cpu, mobo)) {
    blocking.push("Chipset carte mère non adapté à cette génération de CPU.");
    alertBox("bad", "Chipset carte mère non recommandé pour ce CPU.");
    const altBoardGen = sortByBrandGenerationScore(CATALOG.mobo)
      .filter((item) => item.socket === cpu.socket && item.ramType === ram.type && cpuMoboGenerationCompatible(cpu, item))
      .sort((a, b) => a.price - b.price)[0];
    if (altBoardGen) suggestions.push(`Carte mère de génération compatible: ${altBoardGen.brand} ${altBoardGen.name}.`);
  }

  if (!isPendingExternal(mobo) && !isPendingExternal(ram) && mobo.ramType !== ram.type) {
    blocking.push("Type de RAM non supporté par la carte mère.");
    alertBox("bad", `${ram.type} sélectionnée, mais la carte mère exige ${mobo.ramType}.`);

    const altRam = sortByBrandGenerationScore(CATALOG.ram)
      .filter((item) => item.type === mobo.ramType)
      .sort((a, b) => Math.abs(a.gb - ram.gb) || (a.price - b.price))[0];
    if (altRam) suggestions.push(`RAM compatible recommandée: ${altRam.brand} ${altRam.name} (${euro(altRam.price)}).`);
  } else if (!isPendingExternal(mobo) && !isPendingExternal(ram)) {
    alertBox("good", "Compatibilité RAM / carte mère: OK.");
  }

  const gpuLimitWithCooling = effectiveCaseGpuLimit(casev, cooling);

  if (!isPendingExternal(gpu) && !isPendingExternal(casev) && gpu.length > gpuLimitWithCooling) {
    blocking.push("Carte graphique trop longue pour le boîtier.");
    alertBox("bad", `GPU ${gpu.length} mm > clearance boitier ${gpuLimitWithCooling} mm (avec refroidissement).`);

    const altCase = sortByBrandGenerationScore(CATALOG.case)
      .filter((item) => effectiveCaseGpuLimit(item, cooling) >= gpu.length)
      .sort((a, b) => a.price - b.price)[0];
    if (altCase) suggestions.push(`Boîtier compatible proposé: ${altCase.brand} ${altCase.name} (${euro(altCase.price)}).`);
  } else if (!isPendingExternal(gpu) && !isPendingExternal(casev)) {
    alertBox("good", "Longueur GPU / boîtier: OK.");
  }

  if (!isPendingExternal(cooling) && (cooling.type === "aio" || cooling.type === "custom")) {
    if (cooling.radiator > casev.maxRad) {
      blocking.push("Radiateur du refroidissement incompatible avec le boîtier.");
      alertBox("bad", `Radiateur ${cooling.radiator} mm > support boîtier ${casev.maxRad} mm.`);

      const altCooling = sortByBrandGenerationScore(CATALOG.watercooling)
        .filter((item) => !item.estimateOnly && item.radiator <= casev.maxRad)
        .sort((a, b) => b.score - a.score)[0];
      if (altCooling) suggestions.push(`Refroidissement compatible conseillé: ${altCooling.brand} ${altCooling.name} (${euro(altCooling.price)}).`);
    } else {
      alertBox("good", "Compatibilité refroidissement / boîtier: OK.");
    }

    if (!isPendingExternal(gpu) && gpu.length > gpuLimitWithCooling) {
      blocking.push("Collision probable GPU / radiateur selon dimensions.");
      alertBox("bad", `GPU ${gpu.length} mm ne passe pas avec radiateur ${cooling.radiator} mm (clearance ${gpuLimitWithCooling} mm).`);
    }
  }

  if (!isPendingExternal(gpu) && !isPendingExternal(casev)) {
    const margin = Number(gpuLimitWithCooling || 0) - Number(gpu.length || 0);
    if (margin >= 0 && margin < 12) {
      warnings.push("Marge GPU/boitier tres serree.");
      alertBox("warn", `Marge GPU/boitier faible (${margin} mm). Le montage peut devenir critique.`);
    }
  }

  if (!isPendingExternal(cpu) && !isPendingExternal(cooling)) {
    if (cooling.type === "none" && cpu.tdp >= 105) {
      blocking.push("CPU energivore sans refroidissement dedie.");
      alertBox("bad", "Un refroidissement dedie (air premium ou AIO) est requis pour ce CPU.");
    } else if (cooling.type === "none" && cpu.tdp >= 80) {
      warnings.push("Refroidissement de base limite pour ce CPU.");
      alertBox("warn", "Le refroidissement inclus de base risque d'etre limite avec ce CPU.");
    }
  }

  if (!isPendingExternal(gpu) && !isPendingExternal(casev) && gpu.tdp >= 350 && casev.maxRad < 360) {
    warnings.push("Boitier potentiellement limite pour la dissipation d'un GPU tres energivore.");
    alertBox("warn", "GPU tres energivore: boitier avec airflow/radiateur 360+ recommande.");
  }

  if (!isPendingExternal(storage) && !isPendingExternal(mobo) && Number(storage.generation || 0) >= 5 && Number(mobo.tier || 1) <= 1) {
    warnings.push("SSD Gen5 sur carte mere entree de gamme.");
    alertBox("warn", "SSD PCIe Gen5: une carte mere tier 2+ est conseillee pour des performances stables.");
  }

  if (!isPendingExternal(ram) && !isPendingExternal(mobo) && mobo.ramType === "DDR5" && ram.generation >= 7600 && Number(mobo.tier || 1) < 3) {
    warnings.push("DDR5 tres rapide sur carte mere tier bas.");
    alertBox("warn", "DDR5 7600+ sur carte mere tier 1/2: stabilite XMP/EXPO incertaine.");
  }

  if (!isPendingExternal(gpu) && !isPendingExternal(mobo) && gpu.rank >= 9.1 && Number(mobo.tier || 1) < 3) {
    warnings.push("Carte mere un peu legere pour un GPU tres haut de gamme.");
    alertBox("warn", "Pour un GPU tres haut de gamme, une carte mere tier 3+ est recommandee.");
  }

  const customCableCheck = optionAvailability("customCables", customCable, cableCtx);
  if (!customCableCheck.available) {
    warnings.push("Option câble custom indisponible avec cette configuration.");
    alertBox("warn", `Câble custom indisponible: ${customCableCheck.reason}.`);
  }

  if (delivery.mode === "priority" && cooling.type === "custom") {
    warnings.push("Traitement prioritaire + boucle custom: délai ajusté selon validation atelier.");
    alertBox("warn", "Le watercooling 100% custom nécessite validation manuelle, même en traitement prioritaire.");
  }

  if (!isPendingExternal(gpu) && !isPendingExternal(psu) && cableCtx.gpuNeeds.need12vhpwr && !cableCtx.psuPins.has12vhpwr) {
    blocking.push("GPU 12VHPWR/12V-2x6 sans alimentation compatible.");
    alertBox("bad", "La carte graphique nécessite un connecteur 12VHPWR/12V-2x6 compatible.");
  }

  if (!isPendingExternal(gpu) && !isPendingExternal(psu) && cableCtx.gpuNeeds.need12vhpwr) {
    const hardMin = gpu.tdp >= 500 ? 1200 : gpu.tdp >= 420 ? 1000 : 850;
    if (psu.watts < hardMin) {
      blocking.push("Alimentation trop faible pour GPU haut de gamme en 12VHPWR.");
      alertBox("bad", `Pour cette carte graphique, une alimentation ${hardMin}W minimum est requise.`);
    }
  }

  if (!isPendingExternal(gpu) && !isPendingExternal(psu) && !cableCtx.gpuNeeds.need12vhpwr && cableCtx.psuPins.pcie8 < cableCtx.gpuNeeds.pcie8) {
    blocking.push("Nombre de connecteurs PCIe insuffisant pour la carte graphique.");
    alertBox("bad", `La carte graphique demande ${cableCtx.gpuNeeds.pcie8} x 8-pin PCIe.`);
  }

  if (!isPendingExternal(cpu) && !isPendingExternal(psu) && cableCtx.psuPins.eps8 < cableCtx.cpuEpsNeed) {
    blocking.push("Connectique EPS CPU insuffisante côté alimentation.");
    alertBox("bad", `Le CPU conseillé demande ${cableCtx.cpuEpsNeed} x EPS 8-pin.`);
  }

  if (!isPendingExternal(cpu) && !isPendingExternal(mobo) && cpu.rank >= 8.8 && mobo.tier < 3) {
    warnings.push("Carte mère un peu légère pour un CPU haut de gamme.");
    alertBox("warn", "VRM carte mère limite pour ce niveau de CPU. Une carte tier 3/4 est recommandée.");
    const betterBoard = sortByBrandGenerationScore(CATALOG.mobo)
      .filter((item) => item.socket === cpu.socket && item.ramType === ram.type && item.tier >= 3)
      .sort((a, b) => a.price - b.price)[0];
    if (betterBoard) suggestions.push(`Carte mère plus adaptée: ${betterBoard.brand} ${betterBoard.name} (${euro(betterBoard.price)}).`);
  }

  const consumption = cpu.tdp + gpu.tdp + 120 + (cooling.type === "custom" ? 45 : cooling.type === "aio" ? 25 : 10);
  const recommendedPsu = Math.ceil((consumption * 1.35) / 50) * 50;

  if (!isPendingExternal(psu) && psu.watts < recommendedPsu) {
    blocking.push("Alimentation insuffisante pour une marge stable.");
    alertBox("bad", `Alimentation trop faible: ${psu.watts}W, recommandé ${recommendedPsu}W minimum.`);

    const altPsu = sortByBrandGenerationScore(CATALOG.psu)
      .filter((item) => item.watts >= recommendedPsu)
      .sort((a, b) => a.price - b.price)[0];
    if (altPsu) suggestions.push(`Alimentation recommandée: ${altPsu.brand} ${altPsu.name} (${euro(altPsu.price)}).`);
  } else if (!isPendingExternal(psu) && psu.watts < recommendedPsu + 120) {
    warnings.push("Marge PSU correcte mais serrée.");
    alertBox("warn", `Marge PSU faible: vise ${recommendedPsu + 100}W pour plus de confort.`);
  } else if (!isPendingExternal(psu)) {
    alertBox("good", "Marge alimentation: confortable.");
  }

  const usageProfile = USAGE_PROFILE[usageValue] || USAGE_PROFILE["Jeu AAA (1440p / ultrawide)"];

  if (!isPendingExternal(ram) && ram.gb < usageProfile.minRam) {
    warnings.push("RAM inférieure au besoin de l'usage sélectionné.");
    alertBox("warn", `Pour "${usageValue}", ${usageProfile.minRam} Go de RAM sont recommandés.`);

    const betterRam = sortByBrandGenerationScore(CATALOG.ram)
      .filter((item) => item.type === mobo.ramType && item.gb >= usageProfile.minRam)
      .sort((a, b) => a.price - b.price)[0];
    if (betterRam) suggestions.push(`RAM suggérée pour ton usage: ${betterRam.brand} ${betterRam.name}.`);
  }

  if (!isPendingExternal(mobo) && !isPendingExternal(ram) && mobo.ramType === "DDR5" && ram.generation < 5600) {
    warnings.push("Fréquence RAM un peu basse pour une plateforme DDR5.");
    alertBox("warn", "RAM DDR5 < 5600 MT/s: un kit 6000/6400 est conseillé pour de meilleures perfs.");
  }

  if (!isPendingExternal(storage) && storage.tb < usageProfile.minStorage) {
    warnings.push("Capacité stockage un peu courte pour l'usage.");
    alertBox("warn", `Stockage conseillé pour cet usage: au moins ${usageProfile.minStorage} To.`);

    const betterStorage = sortByBrandGenerationScore(CATALOG.storage)
      .filter((item) => item.tb >= usageProfile.minStorage)
      .sort((a, b) => a.price - b.price)[0];
    if (betterStorage) suggestions.push(`Stockage conseillé: ${betterStorage.brand} ${betterStorage.name}.`);
  }

  if (!isPendingExternal(storage) && usageValue === "Création (montage / 3D / IA)" && storage.score < 8.5) {
    warnings.push("Stockage correct mais un SSD plus rapide est conseillé pour la création.");
    const proStorage = sortByBrandGenerationScore(CATALOG.storage)
      .filter((item) => item.score >= 8.8 && item.tb >= Math.max(2, usageProfile.minStorage))
      .sort((a, b) => a.price - b.price)[0];
    if (proStorage) suggestions.push(`Stockage conseillé pour création: ${proStorage.brand} ${proStorage.name}.`);
  }

  if (!isPendingExternal(gpu) && usageProfile.minVram > 0 && gpu.vram < usageProfile.minVram) {
    warnings.push("VRAM limite pour l'usage demandé.");
    alertBox("warn", `VRAM recommandée pour cet usage: ${usageProfile.minVram} Go minimum.`);

    const betterGpuForVram = sortByBrandGenerationScore(CATALOG.gpu)
      .filter((item) => item.vram >= usageProfile.minVram && item.rank >= gpu.rank)
      .sort((a, b) => a.price - b.price)[0];
    if (betterGpuForVram) suggestions.push(`GPU recommandé pour la VRAM: ${betterGpuForVram.brand} ${betterGpuForVram.name}.`);
  }

  const ratio = cpu.rank / gpu.rank;
  let bottleneck = { type: "balanced", percent: 0, message: "Équilibre CPU/GPU cohérent." };

  if (isPendingExternal(cpu) || isPendingExternal(gpu)) {
    bottleneck = { type: "pending", percent: 0, message: "Goulot d'étranglement en attente d'analyse de la référence externe." };
    warnings.push(bottleneck.message);
    alertBox("warn", bottleneck.message);
  } else if (ratio < usageProfile.ratioLow) {
    const percent = Math.max(6, Math.min(35, Math.round(((usageProfile.ratioLow - ratio) / usageProfile.ratioLow) * 100)));
    bottleneck = { type: "cpu", percent, message: `Goulot d'étranglement CPU estimé à  ~${percent}% sur cet usage.` };
    warnings.push(bottleneck.message);
    alertBox("warn", bottleneck.message);

    const betterCpu = nextBetter(CATALOG.cpu, cpu.rank, (item) => item.socket === cpu.socket);
    const lowerGpu = bestBudget(CATALOG.gpu, cpu.rank + 0.5);
    if (betterCpu) suggestions.push(`Option plus performante: ${betterCpu.brand} ${betterCpu.name} (${euro(betterCpu.price)}).`);
    if (lowerGpu) suggestions.push(`Option plus équilibrée (moins chère): ${lowerGpu.brand} ${lowerGpu.name} (${euro(lowerGpu.price)}).`);
  } else if (ratio > usageProfile.ratioHigh) {
    const percent = Math.max(5, Math.min(30, Math.round(((ratio - usageProfile.ratioHigh) / usageProfile.ratioHigh) * 100)));
    bottleneck = { type: "gpu", percent, message: `Limitation GPU estimée à ~${percent}% pour cet usage.` };
    warnings.push(bottleneck.message);
    alertBox("warn", bottleneck.message);

    const betterGpu = nextBetter(CATALOG.gpu, gpu.rank);
    const lowerCpu = bestBudget(CATALOG.cpu, gpu.rank + 0.3, (item) => item.socket === cpu.socket);
    if (betterGpu) suggestions.push(`Option plus performante: ${betterGpu.brand} ${betterGpu.name} (${euro(betterGpu.price)}).`);
    if (lowerCpu) suggestions.push(`Option plus économique: ${lowerCpu.brand} ${lowerCpu.name} (${euro(lowerCpu.price)}).`);
  } else {
    alertBox("good", "Goulot d'étranglement estimé faible: équilibre global validé.");
  }

  if (!isPendingExternal(cpu) && cpu.rank < usageProfile.minCpu) {
    warnings.push("CPU un peu faible pour l'usage sélectionné.");
    const betterCpuForUsage = sortByBrandGenerationScore(CATALOG.cpu)
      .filter((item) => item.socket === cpu.socket && item.rank >= usageProfile.minCpu)
      .sort((a, b) => a.price - b.price)[0];
    if (betterCpuForUsage) suggestions.push(`CPU recommandé pour cet usage: ${betterCpuForUsage.brand} ${betterCpuForUsage.name}.`);
  }

  if (!isPendingExternal(gpu) && gpu.rank < usageProfile.minGpu) {
    warnings.push("GPU un peu faible pour l'usage sélectionné.");
    const betterGpuForUsage = sortByBrandGenerationScore(CATALOG.gpu)
      .filter((item) => item.rank >= usageProfile.minGpu)
      .sort((a, b) => a.price - b.price)[0];
    if (betterGpuForUsage) suggestions.push(`GPU recommandé pour cet usage: ${betterGpuForUsage.brand} ${betterGpuForUsage.name}.`);
  }

  if (!isPendingExternal(cpu) && !isPendingExternal(cooling) && cpu.tdp >= 125 && cooling.type === "air" && cooling.score < 9) {
    warnings.push("Refroidissement limité pour ce CPU.");
    alertBox("warn", "CPU énergivore: un AIO 280/360 est recommandé pour meilleure stabilité thermique.");
  }

  if (!isPendingExternal(casev) && !isPendingExternal(gpu) && consumption >= 550 && casev.score < 8.8) {
    warnings.push("Boîtier un peu juste en airflow pour ce niveau de charge.");
    alertBox("warn", "Charge thermique élevée: privilégie un boîtier airflow premium.");
    const airflowCase = sortByBrandGenerationScore(CATALOG.case)
      .filter((item) => item.maxGpu >= gpu.length && item.maxRad >= Math.max(360, cooling.radiator || 0) && item.score >= 9)
      .sort((a, b) => a.price - b.price)[0];
    if (airflowCase) suggestions.push(`Boîtier airflow conseillé: ${airflowCase.brand} ${airflowCase.name}.`);
  }

  const coolingPrice = cooling.estimateOnly ? 0 : cooling.price;
  const customCablePrice = customCableCheck.available ? customCable.price : 0;
  const parts = cpu.price + mobo.price + ram.price + gpu.price + storage.price + psu.price + casev.price;
  const processingFee = computeProcessingFee({
    cpu, mobo, ram, gpu, storage, psu, case: casev, cooling, customCable, cableMgmt
  }, delivery);
  const services = coolingPrice + customCablePrice + cableMgmt.price + processingFee;
  const total = BASE_PRICE + parts + services;

  if (usageMinimum > 0) {
    if (total < usageMinimum) {
      warnings.push("Total sous le minimum recommandé pour l'usage.");
      alertBox("warn", `Cette sélection reste sous le minimum conseillé (${euro(usageMinimum)}).`);
    }
    if (budgetMax && budgetMax < usageMinimum) {
      blocking.push("Budget maxi inférieur au minimum requis pour l'usage.");
      alertBox("bad", `Pour "${usageValue}", le budget maximum doit être au moins ${euro(usageMinimum)}.`);
    }
    if (budgetMin && budgetMin < usageMinimum) {
      warnings.push("Budget mini inférieur au minimum recommandé pour l'usage.");
      alertBox("warn", `Budget mini conseillé pour cet usage: ${euro(usageMinimum)}.`);
    }
  }

  if (budgetMax && total > budgetMax) {
    const over = Math.round((total - budgetMax) * 100) / 100;
    warnings.push("Total au-dessus du budget maximum défini.");
    alertBox("warn", `Total au-dessus de ton budget max de ${euro(over)}.`);

    const cheaperGpu = sortByBrandGenerationScore(CATALOG.gpu)
      .filter((item) => item.id !== gpu.id && item.price < gpu.price && item.rank >= usageProfile.minGpu && (usageProfile.minVram === 0 || item.vram >= usageProfile.minVram))
      .sort((a, b) => a.price - b.price)[0];
    const cheaperCpu = sortByBrandGenerationScore(CATALOG.cpu)
      .filter((item) => item.id !== cpu.id && item.price < cpu.price && item.socket === cpu.socket && item.rank >= usageProfile.minCpu)
      .sort((a, b) => a.price - b.price)[0];
    const cheaperStorage = sortByBrandGenerationScore(CATALOG.storage)
      .filter((item) => item.id !== storage.id && item.price < storage.price && item.tb >= usageProfile.minStorage)
      .sort((a, b) => a.price - b.price)[0];

    if (cheaperGpu) suggestions.push(`Pour réduire le total: ${cheaperGpu.brand} ${cheaperGpu.name} (${euro(cheaperGpu.price)}).`);
    if (cheaperCpu) suggestions.push(`Alternative CPU budget: ${cheaperCpu.brand} ${cheaperCpu.name} (${euro(cheaperCpu.price)}).`);
    if (cheaperStorage) suggestions.push(`Alternative stockage budget: ${cheaperStorage.brand} ${cheaperStorage.name} (${euro(cheaperStorage.price)}).`);
  }

  if (budgetMin && total < budgetMin) {
    warnings.push("Total inférieur au budget minimum saisi.");
    alertBox("warn", "Total actuel inférieur à ton budget mini défini.");
  }

  if (cooling.estimateOnly) {
    warnings.push("Watercooling 100% custom: non inclus dans le total (sur devis). ");
    alertBox("warn", "Watercooling 100% custom sélectionné: tarif final à confirmer sur devis technique.");
    suggestions.push("Pour un total chiffré immédiat, choisis un AIO (240/280/360/420). Le custom loop reste sur devis.");
  }

  const rows = [
    { name: "Base atelier", value: euro(BASE_PRICE) },
    { name: `${cpu.brand} ${cpu.name}`, value: euro(cpu.price) },
    { name: `${mobo.brand} ${mobo.name}`, value: euro(mobo.price) },
    { name: `${ram.brand} ${ram.name}`, value: euro(ram.price) },
    { name: `${gpu.brand} ${gpu.name}`, value: euro(gpu.price) },
    { name: `${storage.brand} ${storage.name}`, value: euro(storage.price) },
    { name: `${psu.brand} ${psu.name}`, value: euro(psu.price) },
    { name: `${casev.brand} ${casev.name}`, value: euro(casev.price) },
    { name: `${cooling.brand} ${cooling.name}`, value: cooling.estimateOnly ? "Sur devis" : euro(cooling.price) },
    { name: `${customCable.category || customCable.brand} — ${customCable.name}`, value: customCableCheck.available ? euro(customCablePrice) : "Indisponible" },
    { name: `${cableMgmt.brand} ${cableMgmt.name}`, value: euro(cableMgmt.price) },
    { name: `${delivery.name} (${delivery.prepWindow})`, value: euro(processingFee) }
  ];

  if (budgetMin || budgetMax) {
    rows.push({
      name: "Budget cible",
      value: `${budgetMin ? `min ${euro(budgetMin)}` : "min non défini"} / ${budgetMax ? `max ${euro(budgetMax)}` : "max non défini"}`
    });
  }
  if (usageMinimum > 0) {
    rows.push({ name: `Minimum recommandé (${usageValue})`, value: euro(usageMinimum) });
  }
  rows.push({ name: "Total estimé", value: euro(total) });

  renderBreakdown(rows);
  renderSuggestions([...new Set(suggestions)]);
  if (priceEl) priceEl.textContent = euro(total);

  if (!warnings.length && !blocking.length) {
    alertBox("good", "Configuration cohérente: prête pour devis ou achat.");
  }

  scheduleUnknownResearch();

  const finalState = {
    ready: true,
    canCheckout: blocking.length === 0,
    total,
    warnings,
    suggestions: [...new Set(suggestions)],
    blocking,
    bottleneck,
    customCoolingPending: Boolean(cooling.estimateOnly),
    budget: { min: budgetMin, max: budgetMax, usageMinimum },
    selection: {
      cpu, mobo, ram, gpu, storage, psu, case: casev, cooling,
      customCable, cableMgmt, delivery,
      usage: usageValue,
      noviceMode: isNoviceMode,
      noviceBrief: (noviceBriefEl?.value || "").trim(),
      budgetMin,
      budgetMax,
      usageMinimum
    }
  };
  emitCustomState(finalState);
  return finalState;
}

const navToggle = $("#navToggle");
const navLinks = $("#navLinks");
const views = $$(".view");
const links = $$(".nav__link");

function closeMobileNav() {
  if (!navLinks || !navToggle) return;
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function revealInView() {
  const active = $(".view.is-active");
  if (!active) return;
  $$(".reveal", active).forEach((el, i) => {
    el.classList.remove("is-in");
    setTimeout(() => el.classList.add("is-in"), 90 + i * 70);
  });
}

function showView(key) {
  if (key === "admin" && !isAdmin) {
    key = "custom";
  }
  document.body.classList.toggle("is-preview3d", key === "preview");
  views.forEach((v) => v.classList.toggle("is-active", v.dataset.view === key));
  links.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === key));
  closeMobileNav();
  window.scrollTo({ top: 0, behavior: "smooth" });
  revealInView();
  if (key === "custom" || key === "preview") {
    window.setTimeout(() => {
      window.AE3D?.resize?.();
      window.AE3D?.refreshFromLatest?.();
    }, 120);
  }
  if (key === "admin" && isAdmin) {
    void refreshAdminQuotes({ silent: true });
  }
}

links.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    showView(e.currentTarget.dataset.nav);
  });
});

$$("[data-nav]").forEach((el) => {
  el.addEventListener("click", (e) => {
    const key = e.currentTarget.dataset.nav;
    if (!key) return;
    e.preventDefault();
    showView(key);
  });
});

revealInView();

async function sendEmail({ subject, from_name, reply_to, message, statusElId }) {
  try {
    setStatus(statusElId, "Envoi en cours…");
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        from_name,
        reply_to,
        message
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      throw new Error(String(data?.error || "EMAIL_SEND_FAILED"));
    }
    setStatus(statusElId, "Envoyé. Réponse dès que possible.");
    toast("Demande envoyée.");
    return true;
  } catch (err) {
    console.error(err);
    setStatus(statusElId, "Erreur d'envoi. Réessaie.");
    toast("Erreur d'envoi.");
    return false;
  }
}

function bindClassicForm(formId, subject, statusElId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const lines = [];
    fd.forEach((v, k) => lines.push(`${k} : ${v}`));

    const ok = await sendEmail({
      subject,
      from_name: fd.get("from_name"),
      reply_to: fd.get("reply_to"),
      message: lines.join("\n"),
      statusElId
    });

    if (ok) form.reset();
  });
}

const formContact = document.getElementById("form-contact");
if (formContact) {
  formContact.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(formContact);
    const quoteCode = (fd.get("quote_code") || "").toString().trim().toUpperCase();
    const msg = [
      `topic : ${fd.get("topic")}`,
      `code_devis : ${quoteCode || "non fourni"}`,
      `message : ${fd.get("message")}`
    ].join("\n");

    const ok = await sendEmail({
      subject: `Service client — ${fd.get("topic")}${quoteCode ? ` (${quoteCode})` : ""}`,
      from_name: fd.get("from_name"),
      reply_to: fd.get("reply_to"),
      message: msg,
      statusElId: "contactStatus"
    });

    if (ok) formContact.reset();
  });
}

const formPc = document.getElementById("form-pc");
const pcFromNameEl = document.getElementById("pcFromName");
const pcReplyToEl = document.getElementById("pcReplyTo");
const pcIssueEl = document.getElementById("pcIssue");
const pcUrgencyEl = document.getElementById("pcUrgency");
const pcModelEl = document.getElementById("pcModel");
const pcDescriptionEl = document.getElementById("pcDescription");
const pcQuoteCodeHintEl = document.getElementById("pcQuoteCodeHint");
const pcQuoteLookupEl = document.getElementById("pcQuoteLookup");
const pcLoadQuoteBtn = document.getElementById("pcLoadQuoteCode");

const formMobile = document.getElementById("form-mobile");
const mobileFromNameEl = document.getElementById("mobileFromName");
const mobileReplyToEl = document.getElementById("mobileReplyTo");
const mobileDeviceTypeEl = document.getElementById("mobileDeviceType");
const mobileIssueEl = document.getElementById("mobileIssue");
const mobileModelEl = document.getElementById("mobileModel");
const mobileDescriptionEl = document.getElementById("mobileDescription");
const mobileStatusEl = document.getElementById("mobileStatus");
const mobileQuoteCodeHintEl = document.getElementById("mobileQuoteCodeHint");
const mobileCameraToolsEl = document.getElementById("mobileCameraTools");
const mobileCameraPanelEl = document.getElementById("mobileCameraPanel");
const mobileCameraVideoEl = document.getElementById("mobileCameraVideo");
const mobileCameraPanelMetaEl = document.getElementById("mobileCameraPanelMeta");
const mobileCameraHintEl = document.getElementById("mobileCameraHint");
const mobileCameraTestBtn = document.getElementById("mobileCameraTestBtn");
const mobileQuoteLookupEl = document.getElementById("mobileQuoteLookup");
const mobileLoadQuoteBtn = document.getElementById("mobileLoadQuoteCode");

const formCustom = document.getElementById("form-custom");
const quoteNameEl = document.getElementById("quoteName");
const quoteEmailEl = document.getElementById("quoteEmail");
const quoteDetailsEl = document.getElementById("quoteDetails");
const budgetMinEl = document.getElementById("budgetMin");
const budgetMaxEl = document.getElementById("budgetMax");
const budgetMinRangeEl = document.getElementById("budgetMinRange");
const budgetMaxRangeEl = document.getElementById("budgetMaxRange");
const budgetUsageHintEl = document.getElementById("budgetUsageHint");
const budgetFieldEl = document.getElementById("budgetField");
const quoteCodeValueEl = document.getElementById("quoteCodeValue");
const quoteCodeMetaEl = document.getElementById("quoteCodeMeta");
const quoteLookupEl = document.getElementById("quoteLookup");
const contactQuoteCodeEl = document.getElementById("contactQuoteCode");
const noviceModeToggleEl = document.getElementById("noviceModeToggle");
const noviceBriefBlockEl = document.getElementById("noviceBriefBlock");
const noviceBriefEl = document.getElementById("noviceBrief");
const noviceAutoBuildBtn = document.getElementById("noviceAutoBuild");

const quoteModifyRow = document.getElementById("quoteModifyRow");
const quoteClientRow = document.getElementById("quoteClientRow");
const quoteAdminRow = document.getElementById("quoteAdminRow");
const adminNavLinkEl = document.getElementById("adminNavLink");
const adminQuotesViewEl = document.getElementById("view-admin");
const adminQuotesListEl = document.getElementById("adminQuotesList");
const adminQuotesMetaEl = document.getElementById("adminQuotesMeta");
const adminQuotesStatusEl = document.getElementById("adminQuotesStatus");
const adminRefreshQuotesBtn = document.getElementById("adminRefreshQuotes");
const openAdminQuotesViewBtn = document.getElementById("openAdminQuotesView");
const buyNowSandboxBtn = document.getElementById("buyNowSandbox");

const requestModifyBtn = document.getElementById("requestModifyQuote");
const confirmModifyBtn = document.getElementById("confirmModifyQuote");
const sendTestReceiptBtn = document.getElementById("sendTestReceipt");
const clientGetModifyBtn = document.getElementById("clientGetModifyCode");

let isAdmin = false;
let adminSessionKey = "";
let lastAdminAuthError = "";
let adminQuotesLoading = false;

const BUDGET_DEFAULT_MIN = 400;
const BUDGET_DEFAULT_MAX = 3000;
const BUDGET_STEP = 50;
const BUDGET_CAP = 12000;

let currentQuoteCode = "";
let currentQuoteSignature = "";
let isApplyingPreset = false;
let minimalPresetLocked = false;
let minimalPresetSnapshot = {};
let optimizedPresetLocked = false;
let optimizedPresetSnapshot = {};
let isNoviceMode = false;
const CORE_CATEGORY_KEYS = ["cpu", "mobo", "ram", "gpu", "storage", "psu", "case"];
let currentMobileQuoteCode = "";
let currentPcRepairQuoteCode = "";
let mobileCameraRuns = [];
let mobileActiveStream = null;
let mobileCameraTestBusy = false;
let mobileQuoteContextReady = false;
let mobileApplyingLoadedRecord = false;
let mobileQuoteBaseSignature = "";
const CAMERA_PHASE_SECONDS = 6;
const CAMERA_RECORD_SECONDS = 3;
const CAMERA_RECORD_VIDEO_BITS_PER_SECOND = 140000;
const CAMERA_RECORD_MAX_DATA_URL_LENGTH = 220000;

function updateModifyActionVisibility() {
  const hasCode = Boolean(currentQuoteCode);
  if (quoteModifyRow) quoteModifyRow.style.display = (isAdmin && hasCode) ? "flex" : "none";
  if (quoteClientRow) quoteClientRow.style.display = (!isAdmin && hasCode) ? "flex" : "none";
  if (quoteAdminRow) quoteAdminRow.style.display = isAdmin ? "flex" : "none";

  if (requestModifyBtn) {
    requestModifyBtn.hidden = !(isAdmin && hasCode);
    requestModifyBtn.disabled = !(isAdmin && hasCode);
  }
  if (confirmModifyBtn) {
    confirmModifyBtn.hidden = !(isAdmin && hasCode);
    confirmModifyBtn.disabled = !(isAdmin && hasCode);
  }
  if (sendTestReceiptBtn) {
    sendTestReceiptBtn.hidden = !isAdmin;
    sendTestReceiptBtn.disabled = !isAdmin;
  }
  if (clientGetModifyBtn) {
    clientGetModifyBtn.hidden = !!isAdmin || !hasCode;
    clientGetModifyBtn.disabled = !!isAdmin || !hasCode;
  }
  if (openAdminQuotesViewBtn) {
    openAdminQuotesViewBtn.hidden = !isAdmin;
    openAdminQuotesViewBtn.disabled = !isAdmin;
  }
}

function applyAdminUI() {
  updateModifyActionVisibility();
  if (adminNavLinkEl) adminNavLinkEl.hidden = !isAdmin;
  if (buyNowSandboxBtn) {
    buyNowSandboxBtn.hidden = !isAdmin;
    if (!isAdmin) buyNowSandboxBtn.disabled = true;
  }
  if (!isAdmin && adminQuotesViewEl?.classList.contains("is-active")) {
    showView("custom");
  }
  if (isAdmin) void refreshAdminQuotes({ silent: true });
  window.AE_isAdmin = isAdmin;
  window.AE_adminSessionKey = isAdmin ? adminSessionKey : "";
  try { window.dispatchEvent(new CustomEvent("ae-admin-state", { detail: { isAdmin } })); } catch {}
}

applyAdminUI();

function setQuoteCodeUI(code, meta) {
  if (quoteCodeValueEl) quoteCodeValueEl.textContent = code || "Non généré";
  if (quoteCodeMetaEl) quoteCodeMetaEl.textContent = meta || "Génère un code devis pour retrouver ta simulation.";
  updateModifyActionVisibility();
}

function readPcRepairQuoteStore() {
  try {
    return JSON.parse(localStorage.getItem(PC_REPAIR_QUOTE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writePcRepairQuoteStore(store) {
  localStorage.setItem(PC_REPAIR_QUOTE_STORAGE_KEY, JSON.stringify(store || {}));
}

function readMobileQuoteStore() {
  try {
    return JSON.parse(localStorage.getItem(MOBILE_QUOTE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeMobileQuoteStore(store) {
  localStorage.setItem(MOBILE_QUOTE_STORAGE_KEY, JSON.stringify(store || {}));
}

function normalizeFreeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function mobileIssueNeedsCamera(issueLabel = "") {
  const t = normalizeFreeText(issueLabel);
  if (!t) return false;
  return t.includes("camera") || t.includes("audio");
}

function setMobileCameraHint(text = "") {
  if (mobileCameraHintEl) mobileCameraHintEl.textContent = text;
}

function setMobileQuoteCodeHint(text = "") {
  if (mobileQuoteCodeHintEl) mobileQuoteCodeHintEl.textContent = text;
}

function setPcQuoteCodeHint(text = "") {
  if (pcQuoteCodeHintEl) pcQuoteCodeHintEl.textContent = text;
}

function mobilePayloadSignature(payload = readMobileFormPayload()) {
  return JSON.stringify({
    fromName: String(payload?.fromName || "").trim().toLowerCase(),
    replyTo: String(payload?.replyTo || "").trim().toLowerCase(),
    deviceType: String(payload?.deviceType || "").trim().toLowerCase(),
    issue: String(payload?.issue || "").trim().toLowerCase(),
    model: String(payload?.model || "").trim().toLowerCase(),
    description: String(payload?.description || "").trim().toLowerCase()
  });
}

function setMobileQuoteContextReady(ready, signatureValue = "") {
  mobileQuoteContextReady = Boolean(ready);
  if (mobileQuoteContextReady) {
    mobileQuoteBaseSignature = String(signatureValue || mobilePayloadSignature()).trim();
  } else {
    mobileQuoteBaseSignature = "";
  }
  updateMobileCameraAvailabilityUI();
}

function resetMobileQuoteContextAfterManualEdit() {
  if (mobileApplyingLoadedRecord) return;
  if (!mobileQuoteContextReady) return;
  currentMobileQuoteCode = "";
  mobileQuoteContextReady = false;
  mobileCameraRuns = [];
  stopMobileCameraStream();
  setMobileQuoteCodeHint("Devis mobile modifié. Renvoie ou recharge un devis pour relancer le diagnostic caméra.");
  setMobileCameraHint("");
  updateMobileCameraAvailabilityUI();
}

function readPcRepairFormPayload() {
  return {
    fromName: String(pcFromNameEl?.value || "").trim(),
    replyTo: String(pcReplyToEl?.value || "").trim().toLowerCase(),
    issue: String(pcIssueEl?.value || "").trim(),
    urgency: String(pcUrgencyEl?.value || "").trim(),
    model: String(pcModelEl?.value || "").trim(),
    description: String(pcDescriptionEl?.value || "").trim()
  };
}

function pcRepairIssueCategory(issueLabel = "") {
  const normalized = normalizeFreeText(issueLabel);
  if (!normalized) return "other";
  if (normalized.includes("surchauffe")) return "thermal";
  if (normalized.includes("demarrage") || normalized.includes("ecran noir")) return "boot-display";
  if (normalized.includes("stockage") || normalized.includes("donnees")) return "storage-data";
  if (normalized.includes("virus") || normalized.includes("systeme")) return "software";
  if (normalized.includes("port") || normalized.includes("connectique")) return "io";
  return "other";
}

function createPcRepairQuoteRecord({ code, payload }) {
  const issueLabel = String(payload?.issue || "").trim();
  const urgency = String(payload?.urgency || "").trim();
  return {
    code,
    createdAt: new Date().toISOString(),
    requester: {
      name: String(payload?.fromName || "").trim(),
      email: String(payload?.replyTo || "").trim().toLowerCase(),
      details: String(payload?.description || "").trim(),
      noviceMode: false,
      noviceBrief: "",
      budgetMin: 0,
      budgetMax: 0
    },
    signature: JSON.stringify(payload || {}),
    selects: {},
    external: {},
    usage: `Réparation PC - ${issueLabel || "N/A"}`,
    serviceType: "pc-repair",
    issueCategory: pcRepairIssueCategory(issueLabel),
    config: {
      total: 0,
      parts: {
        issue: issueLabel,
        urgency: urgency || "Standard",
        model: String(payload?.model || "").trim()
      }
    }
  };
}

async function persistPcRepairQuoteRecord(record) {
  if (!record?.code) return;
  const store = readPcRepairQuoteStore();
  store[record.code] = record;
  writePcRepairQuoteStore(store);
  localStorage.setItem(PC_REPAIR_LAST_QUOTE_CODE_KEY, record.code);
  await saveQuoteToDatabase(record);
}

function stopMobileCameraStream() {
  if (!mobileActiveStream) return;
  try {
    mobileActiveStream.getTracks().forEach((track) => track.stop());
  } catch {}
  mobileActiveStream = null;
  if (mobileCameraVideoEl) mobileCameraVideoEl.srcObject = null;
}

function updateMobileCameraAvailabilityUI() {
  const issueLabel = mobileIssueEl?.value || "";
  const signatureMatches = mobileQuoteContextReady
    && Boolean(mobileQuoteBaseSignature)
    && mobilePayloadSignature() === mobileQuoteBaseSignature;
  const eligible = mobileIssueNeedsCamera(issueLabel)
    && Boolean(currentMobileQuoteCode)
    && mobileQuoteContextReady
    && signatureMatches;
  if (mobileCameraToolsEl) mobileCameraToolsEl.hidden = !eligible;
  if (!eligible) {
    if (mobileCameraPanelEl) mobileCameraPanelEl.hidden = true;
    setMobileCameraHint("");
    stopMobileCameraStream();
  }
}

function parseBrowserInfo(ua = "") {
  const checks = [
    [/Edg\/([\d.]+)/, "Edge"],
    [/OPR\/([\d.]+)/, "Opera"],
    [/Chrome\/([\d.]+)/, "Chrome"],
    [/Version\/([\d.]+).*Safari/, "Safari"],
    [/Firefox\/([\d.]+)/, "Firefox"]
  ];
  for (const [re, name] of checks) {
    const m = ua.match(re);
    if (m) return { name, version: m[1] || "unknown" };
  }
  return { name: "Unknown", version: "unknown" };
}

function parseOsInfo(ua = "") {
  const ios = ua.match(/OS (\d+[_\d]*) like Mac OS X/);
  if (ios) return { name: "iOS", version: String(ios[1] || "").replace(/_/g, ".") || "unknown" };
  const android = ua.match(/Android ([\d.]+)/);
  if (android) return { name: "Android", version: android[1] || "unknown" };
  const windows = ua.match(/Windows NT ([\d.]+)/);
  if (windows) return { name: "Windows", version: windows[1] || "unknown" };
  const mac = ua.match(/Mac OS X ([\d_]+)/);
  if (mac) return { name: "macOS", version: String(mac[1] || "").replace(/_/g, ".") || "unknown" };
  return { name: "Unknown", version: "unknown" };
}

function collectClientEnvironmentSnapshot() {
  const ua = navigator.userAgent || "";
  const browser = parseBrowserInfo(ua);
  const os = parseOsInfo(ua);
  const platform = navigator.platform || "unknown";
  const maxTouchPoints = Number(navigator.maxTouchPoints || 0);
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  return {
    platform,
    browser,
    os,
    isIOS,
    isAndroid,
    language: navigator.language || "unknown",
    userAgent: ua
  };
}

function createCameraRun() {
  return {
    runId: `cam-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    startedAt: new Date().toISOString(),
    endedAt: "",
    status: "running",
    summary: {},
    entries: []
  };
}

function pushCameraLog(run, event, detail = {}, level = "info") {
  if (!run || !Array.isArray(run.entries)) return;
  run.entries.push({
    ts: new Date().toISOString(),
    level,
    event,
    detail
  });
}

function simplifyMediaError(err) {
  if (!err) return { name: "UnknownError", message: "Unknown error" };
  return {
    name: String(err.name || "UnknownError"),
    message: String(err.message || ""),
    constraint: String(err.constraint || ""),
    stack: String(err.stack || "").slice(0, 800)
  };
}

function summarizeTrack(track) {
  if (!track) return {};
  const settings = typeof track.getSettings === "function" ? track.getSettings() : {};
  const constraints = typeof track.getConstraints === "function" ? track.getConstraints() : {};
  const capabilities = typeof track.getCapabilities === "function" ? track.getCapabilities() : {};
  const capsSummary = {
    width: capabilities?.width || null,
    height: capabilities?.height || null,
    frameRate: capabilities?.frameRate || null,
    facingMode: capabilities?.facingMode || null
  };
  return {
    label: String(track.label || ""),
    id: String(track.id || ""),
    muted: Boolean(track.muted),
    enabled: Boolean(track.enabled),
    readyState: String(track.readyState || ""),
    settings,
    constraints,
    capabilities: capsSummary
  };
}

function normalizeFacingMode(value) {
  const normalized = normalizeFreeText(value || "");
  if (!normalized) return "";
  if (normalized.includes("environment") || normalized.includes("rear") || normalized.includes("back") || normalized.includes("arriere")) {
    return "environment";
  }
  if (normalized.includes("user") || normalized.includes("front") || normalized.includes("avant") || normalized.includes("face")) {
    return "user";
  }
  return normalized;
}

function inferPhaseVerification(phase = "front", trackInfo = {}, candidateLabel = "", deviceHints = {}) {
  const expectedFacing = phase === "rear" ? "environment" : "user";
  const oppositeFacing = phase === "rear" ? "user" : "environment";
  const expectedDeviceId = String(phase === "rear" ? deviceHints?.rearId : deviceHints?.frontId || "").trim();
  const oppositeDeviceId = String(phase === "rear" ? deviceHints?.frontId : deviceHints?.rearId || "").trim();
  const settingsFacingRaw = String(trackInfo?.settings?.facingMode || trackInfo?.constraints?.facingMode || "").trim();
  const settingsFacing = normalizeFacingMode(settingsFacingRaw);
  const trackDeviceId = String(trackInfo?.settings?.deviceId || "").trim();
  const labelNormalized = normalizeFreeText(trackInfo?.label || "");
  const positiveSignals = [];
  const negativeSignals = [];

  if (settingsFacing) {
    if (settingsFacing === expectedFacing) positiveSignals.push(`settings.facingMode=${settingsFacing}`);
    if (settingsFacing === oppositeFacing) negativeSignals.push(`settings.facingMode=${settingsFacing}`);
  }

  const frontKeywords = ["front", "avant", "facetime", "selfie", "user", "face"];
  const rearKeywords = ["rear", "back", "arriere", "environment", "ultra wide", "wide", "telephoto"];
  const expectedKeywords = expectedFacing === "user" ? frontKeywords : rearKeywords;
  const oppositeKeywords = expectedFacing === "user" ? rearKeywords : frontKeywords;
  if (labelNormalized) {
    if (expectedKeywords.some((token) => labelNormalized.includes(token))) {
      positiveSignals.push(`label≈${expectedFacing}`);
    }
    if (oppositeKeywords.some((token) => labelNormalized.includes(token))) {
      negativeSignals.push(`label≈${oppositeFacing}`);
    }
  }

  if (trackDeviceId && expectedDeviceId && trackDeviceId === expectedDeviceId) {
    positiveSignals.push("deviceId attendu");
  }
  if (trackDeviceId && oppositeDeviceId && trackDeviceId === oppositeDeviceId) {
    negativeSignals.push("deviceId opposé");
  }
  if (!trackDeviceId) {
    const candidate = normalizeFreeText(candidateLabel);
    if (candidate.includes(expectedFacing === "user" ? "front" : "rear")) {
      positiveSignals.push(`candidate=${candidateLabel}`);
    }
  }

  let verdict = "unknown";
  if (negativeSignals.length > positiveSignals.length) verdict = "mismatch";
  else if (positiveSignals.length >= 2 && !negativeSignals.length) verdict = "confirmed";
  else if (positiveSignals.length >= 1 && !negativeSignals.length) verdict = "likely";
  else if (!positiveSignals.length && negativeSignals.length) verdict = "mismatch";

  const limitations = [];
  if (!settingsFacing) limitations.push("settings.facingMode non exposé par le navigateur.");
  if (!labelNormalized) limitations.push("label caméra non exposé (souvent masqué sans permission complète).");
  if (!trackDeviceId) limitations.push("deviceId caméra non exploitable pour vérifier le basculement.");

  return {
    phase,
    expectedFacing,
    candidateLabel: String(candidateLabel || "").trim(),
    settingsFacing,
    trackDeviceId,
    expectedDeviceId,
    oppositeDeviceId,
    verdict,
    positiveSignals,
    negativeSignals,
    limitations
  };
}

function pickRecorderMimeType() {
  if (!window.MediaRecorder || typeof window.MediaRecorder.isTypeSupported !== "function") return "";
  const preferred = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4"
  ];
  return preferred.find((mime) => window.MediaRecorder.isTypeSupported(mime)) || "";
}

function videoExtensionFromMime(mime = "") {
  const m = String(mime || "").toLowerCase();
  if (m.includes("mp4")) return "mp4";
  if (m.includes("ogg")) return "ogv";
  return "webm";
}

function readBlobAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("FILE_READER_ERROR"));
      reader.readAsDataURL(blob);
    } catch (err) {
      reject(err);
    }
  });
}

function parseDataUrlToBlob(dataUrl = "") {
  const source = String(dataUrl || "").trim();
  const match = source.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  try {
    const mimeType = match[1] || "application/octet-stream";
    const binary = atob(match[2] || "");
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mimeType });
  } catch {
    return null;
  }
}

function ensureRunMediaBucket(run) {
  if (!run || typeof run !== "object") return { clips: [] };
  if (!run.media || typeof run.media !== "object") run.media = { clips: [] };
  if (!Array.isArray(run.media.clips)) run.media.clips = [];
  return run.media;
}

async function recordCameraPhaseClip({ stream, phase, run, seconds = CAMERA_RECORD_SECONDS, verification = null }) {
  const targetMs = Math.max(1200, Math.round(Number(seconds || CAMERA_RECORD_SECONDS) * 1000));
  const phaseLabel = phase === "rear" ? "camera_arriere" : "camera_avant";
  if (!window.MediaRecorder || typeof window.MediaRecorder !== "function") {
    pushCameraLog(run, "recording_unsupported", { phase, reason: "MediaRecorder indisponible" }, "warn");
    return { ok: false, clip: null, reason: "MEDIA_RECORDER_UNSUPPORTED" };
  }
  const mimeType = pickRecorderMimeType();
  let recorder = null;
  try {
    const options = mimeType
      ? { mimeType, videoBitsPerSecond: CAMERA_RECORD_VIDEO_BITS_PER_SECOND }
      : { videoBitsPerSecond: CAMERA_RECORD_VIDEO_BITS_PER_SECOND };
    recorder = new MediaRecorder(stream, options);
  } catch (err) {
    pushCameraLog(run, "recording_recorder_create_error", { phase, error: simplifyMediaError(err) }, "warn");
    return { ok: false, clip: null, reason: "RECORDER_CREATE_FAILED" };
  }

  return await new Promise((resolve) => {
    const chunks = [];
    let settled = false;
    const startedAt = Date.now();
    const finalize = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    recorder.addEventListener("dataavailable", (event) => {
      if (event?.data && event.data.size > 0) chunks.push(event.data);
    });

    recorder.addEventListener("error", (event) => {
      const err = event?.error || event;
      pushCameraLog(run, "recording_error", { phase, error: simplifyMediaError(err) }, "warn");
      finalize({ ok: false, clip: null, reason: "RECORDER_RUNTIME_ERROR" });
    });

    recorder.addEventListener("stop", async () => {
      const endedAt = Date.now();
      const durationMs = Math.max(0, endedAt - startedAt);
      const blob = new Blob(chunks, { type: recorder.mimeType || mimeType || "video/webm" });
      if (!blob.size) {
        pushCameraLog(run, "recording_empty", { phase, durationMs }, "warn");
        finalize({ ok: false, clip: null, reason: "EMPTY_RECORDING" });
        return;
      }
      try {
        const dataUrl = await readBlobAsDataUrl(blob);
        if (!dataUrl || dataUrl.length > CAMERA_RECORD_MAX_DATA_URL_LENGTH) {
          pushCameraLog(run, "recording_discarded_too_large", {
            phase,
            byteLength: blob.size,
            dataUrlLength: dataUrl ? dataUrl.length : 0,
            maxAllowed: CAMERA_RECORD_MAX_DATA_URL_LENGTH
          }, "warn");
          finalize({
            ok: false,
            clip: {
              phase,
              phaseLabel,
              mimeType: blob.type || recorder.mimeType || mimeType || "video/webm",
              extension: videoExtensionFromMime(blob.type || recorder.mimeType || mimeType),
              byteLength: Number(blob.size || 0),
              durationMs,
              capturedAt: new Date(endedAt).toISOString(),
              dataUrl: "",
              dropped: true,
              droppedReason: "DATA_TOO_LARGE",
              verification: verification && typeof verification === "object"
                ? { verdict: verification.verdict || "unknown", positiveSignals: verification.positiveSignals || [], negativeSignals: verification.negativeSignals || [] }
                : undefined
            },
            reason: "DATA_TOO_LARGE"
          });
          return;
        }

        const clip = {
          phase,
          phaseLabel,
          mimeType: blob.type || recorder.mimeType || mimeType || "video/webm",
          extension: videoExtensionFromMime(blob.type || recorder.mimeType || mimeType),
          byteLength: Number(blob.size || 0),
          durationMs,
          capturedAt: new Date(endedAt).toISOString(),
          dataUrl,
          dropped: false,
          droppedReason: "",
          verification: verification && typeof verification === "object"
            ? { verdict: verification.verdict || "unknown", positiveSignals: verification.positiveSignals || [], negativeSignals: verification.negativeSignals || [] }
            : undefined
        };
        pushCameraLog(run, "recording_saved", {
          phase,
          mimeType: clip.mimeType,
          extension: clip.extension,
          byteLength: clip.byteLength,
          durationMs: clip.durationMs
        }, "info");
        finalize({ ok: true, clip, reason: "" });
      } catch (err) {
        pushCameraLog(run, "recording_encode_error", { phase, error: simplifyMediaError(err) }, "warn");
        finalize({ ok: false, clip: null, reason: "DATAURL_ENCODE_FAILED" });
      }
    });

    try {
      pushCameraLog(run, "recording_start", {
        phase,
        requestedSeconds: Number(seconds || CAMERA_RECORD_SECONDS),
        mimeType: mimeType || recorder.mimeType || "auto",
        bitRate: CAMERA_RECORD_VIDEO_BITS_PER_SECOND
      }, "info");
      recorder.start(250);
    } catch (err) {
      pushCameraLog(run, "recording_start_error", { phase, error: simplifyMediaError(err) }, "warn");
      finalize({ ok: false, clip: null, reason: "RECORDER_START_FAILED" });
      return;
    }

    window.setTimeout(() => {
      try {
        if (recorder.state !== "inactive") recorder.stop();
      } catch (err) {
        pushCameraLog(run, "recording_stop_error", { phase, error: simplifyMediaError(err) }, "warn");
        finalize({ ok: false, clip: null, reason: "RECORDER_STOP_FAILED" });
      }
    }, targetMs);
  });
}

function cameraPhaseStatusFromResult(result) {
  if (!result?.ok) return "error";
  const verdict = String(result?.verification?.verdict || "").trim();
  if (verdict === "mismatch") return "mismatch";
  if (verdict === "confirmed" || verdict === "likely") return "ok";
  return "unverified";
}

function cameraPhaseStatusToText(status = "", errorText = "") {
  const cleanError = String(errorText || "").trim();
  if (status === "ok") return "OK confirmé";
  if (status === "unverified") return "OK non vérifiable";
  if (status === "mismatch") return "Mismatch (pas la caméra attendue)";
  if (status === "error") return `KO (${cleanError || "échec getUserMedia"})`;
  return status || "N/A";
}

function compactCameraClipForStorage(clip = {}) {
  if (!clip || typeof clip !== "object") return null;
  const dataUrl = String(clip.dataUrl || "").trim();
  const safeDataUrl = dataUrl && dataUrl.length <= CAMERA_RECORD_MAX_DATA_URL_LENGTH ? dataUrl : "";
  return {
    phase: String(clip.phase || "").trim(),
    phaseLabel: String(clip.phaseLabel || "").trim(),
    mimeType: String(clip.mimeType || "").trim(),
    extension: String(clip.extension || "").trim(),
    byteLength: Number(clip.byteLength || 0),
    durationMs: Number(clip.durationMs || 0),
    capturedAt: String(clip.capturedAt || "").trim(),
    dataUrl: safeDataUrl,
    dropped: Boolean(clip.dropped) || !safeDataUrl,
    droppedReason: safeDataUrl ? String(clip.droppedReason || "").trim() : String(clip.droppedReason || "DATA_TOO_LARGE").trim(),
    verification: clip.verification && typeof clip.verification === "object"
      ? {
          verdict: String(clip.verification.verdict || "").trim(),
          positiveSignals: Array.isArray(clip.verification.positiveSignals) ? clip.verification.positiveSignals.slice(0, 6).map((v) => String(v || "").trim()) : [],
          negativeSignals: Array.isArray(clip.verification.negativeSignals) ? clip.verification.negativeSignals.slice(0, 6).map((v) => String(v || "").trim()) : []
        }
      : undefined
  };
}

function compactCameraRunsForStorage(runs = []) {
  const list = Array.isArray(runs) ? runs.slice(-8) : [];
  return list.map((run) => {
    const compact = {
      runId: String(run?.runId || "").trim(),
      startedAt: String(run?.startedAt || "").trim(),
      endedAt: String(run?.endedAt || "").trim(),
      status: String(run?.status || "").trim(),
      summary: run?.summary && typeof run.summary === "object" ? JSON.parse(JSON.stringify(run.summary)) : {},
      entries: Array.isArray(run?.entries) ? run.entries.slice(-320).map((entry) => ({
        ts: String(entry?.ts || "").trim(),
        level: String(entry?.level || "info").trim(),
        event: String(entry?.event || "").trim(),
        detail: entry?.detail && typeof entry.detail === "object"
          ? JSON.parse(JSON.stringify(entry.detail))
          : String(entry?.detail || "").trim()
      })) : []
    };
    if (run?.media && typeof run.media === "object") {
      const clips = Array.isArray(run.media.clips)
        ? run.media.clips.map((clip) => compactCameraClipForStorage(clip)).filter(Boolean).slice(-2)
        : [];
      compact.media = { clips };
      compact.summary.recordingCount = clips.length;
    }
    return compact;
  });
}

function waitMs(ms = 0) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, Math.max(0, Number(ms || 0)));
  });
}

function normalizeMediaErrorName(errorLike = {}) {
  return String(errorLike?.name || "").trim() || "UnknownError";
}

function diagnosticHintsFromError(errorLike = {}, env = {}) {
  const hints = [];
  const name = normalizeMediaErrorName(errorLike);
  const message = String(errorLike?.message || "").trim();
  const isIOS = Boolean(env?.isIOS);
  const isAndroid = Boolean(env?.isAndroid);
  const browserName = String(env?.browser?.name || "").trim().toLowerCase();

  if (name === "NotAllowedError" || /permission|autorisation|denied/i.test(message)) {
    hints.push("Permission caméra refusée: vérifier les autorisations du navigateur et de l'OS.");
    if (isIOS) hints.push("iOS: Réglages > Safari > Caméra ou Réglages > [navigateur] > Caméra.");
    if (isAndroid) hints.push("Android: Paramètres > Applications > [navigateur] > Autorisations > Caméra.");
  }
  if (name === "NotFoundError" || /not found|aucune camera/i.test(message)) {
    hints.push("Aucune caméra détectée: appareil sans module caméra, caméra désactivée, ou accès bloqué par politique MDM.");
  }
  if (name === "NotReadableError" || /hardware|in use|already/i.test(message)) {
    hints.push("Caméra occupée par une autre application (FaceTime, WhatsApp, Meet, etc.) ou indisponible matériellement.");
  }
  if (name === "OverconstrainedError" || /constraint|facingmode/i.test(message)) {
    hints.push("Contraintes caméra non satisfaites (facingMode/résolution). Le navigateur ne fournit pas ce mode sur cet appareil.");
  }
  if (name === "SecurityError") {
    hints.push("Contexte non sécurisé: test caméra nécessite HTTPS (ou localhost en dev).");
  }
  if (name === "AbortError") {
    hints.push("Flux interrompu pendant l'initialisation: réseau/processus navigateur instable ou changement d'état de l'application.");
  }
  if (browserName === "safari" && (isIOS || /iphone|ipad|ios/i.test(String(env?.os?.name || "")))) {
    hints.push("Safari iOS limite certaines informations caméra et peut masquer labels/capabilities malgré permission accordée.");
  }
  return [...new Set(hints)];
}

function pickCameraDeviceIds(devices = []) {
  const normalized = Array.isArray(devices) ? devices : [];
  const front = normalized.find((device) => {
    const label = normalizeFreeText(device?.label || "");
    return label.includes("front") || label.includes("avant") || label.includes("facetime") || label.includes("user");
  });
  const rear = normalized.find((device) => {
    const label = normalizeFreeText(device?.label || "");
    return label.includes("back") || label.includes("rear") || label.includes("arriere") || label.includes("environment");
  });
  const fallbackFront = normalized[0] || null;
  const fallbackRear = normalized[1] || normalized[0] || null;
  return {
    frontId: String(front?.deviceId || fallbackFront?.deviceId || "").trim(),
    rearId: String(rear?.deviceId || fallbackRear?.deviceId || "").trim()
  };
}

function cameraPhaseCandidates(phase = "front", deviceHints = {}) {
  const frontId = String(deviceHints?.frontId || "").trim();
  const rearId = String(deviceHints?.rearId || "").trim();
  const qualityHints = {
    width: { ideal: 640, max: 1280 },
    height: { ideal: 360, max: 720 },
    frameRate: { ideal: 12, max: 24 }
  };
  if (phase === "rear") {
    return [
      { label: "phase_rear_exact_environment", constraints: { video: { facingMode: { exact: "environment" }, ...qualityHints }, audio: false } },
      { label: "phase_rear_ideal_environment", constraints: { video: { facingMode: { ideal: "environment" }, ...qualityHints }, audio: false } },
      ...(rearId ? [{ label: "phase_rear_device_id", constraints: { video: { deviceId: { exact: rearId }, ...qualityHints }, audio: false } }] : []),
      { label: "phase_rear_fallback_true", constraints: { video: qualityHints, audio: false } }
    ];
  }
  return [
    { label: "phase_front_exact_user", constraints: { video: { facingMode: { exact: "user" }, ...qualityHints }, audio: false } },
    { label: "phase_front_ideal_user", constraints: { video: { facingMode: { ideal: "user" }, ...qualityHints }, audio: false } },
    ...(frontId ? [{ label: "phase_front_device_id", constraints: { video: { deviceId: { exact: frontId }, ...qualityHints }, audio: false } }] : []),
    { label: "phase_front_fallback_true", constraints: { video: qualityHints, audio: false } }
  ];
}

async function openCameraPhaseStream(phase, run, env, deviceHints = {}) {
  const candidates = cameraPhaseCandidates(phase, deviceHints);
  const errors = [];
  for (const candidate of candidates) {
    pushCameraLog(run, "phase_get_user_media_request", { phase, label: candidate.label, constraints: candidate.constraints }, "info");
    try {
      const stream = await navigator.mediaDevices.getUserMedia(candidate.constraints);
      const track = stream.getVideoTracks()[0] || null;
      const trackInfo = summarizeTrack(track);
      const verification = inferPhaseVerification(phase, trackInfo, candidate.label, deviceHints);
      pushCameraLog(run, "phase_get_user_media_success", { phase, label: candidate.label, trackInfo, verification }, "info");
      return { ok: true, stream, label: candidate.label, trackInfo, verification, attempts: candidates.length, errors };
    } catch (err) {
      const errorInfo = simplifyMediaError(err);
      const hints = diagnosticHintsFromError(errorInfo, env);
      errors.push({ label: candidate.label, error: errorInfo, hints });
      pushCameraLog(run, "phase_get_user_media_error", { phase, label: candidate.label, error: errorInfo, hints }, "error");
    }
  }
  return { ok: false, stream: null, label: "", trackInfo: {}, verification: null, attempts: candidates.length, errors };
}

async function showPhasePreview({ phaseLabel, seconds, run }) {
  const totalSeconds = Math.max(2, Number(seconds || 6));
  for (let remaining = totalSeconds; remaining >= 1; remaining -= 1) {
    if (mobileCameraPanelMetaEl) {
      mobileCameraPanelMetaEl.textContent = `${phaseLabel} en cours • ${remaining}s restantes`;
    }
    pushCameraLog(run, "phase_countdown_tick", { phaseLabel, remaining }, "info");
    await waitMs(1000);
  }
}

function mobileCameraLogsPayloadFromRuns(runs, code = "") {
  return {
    generatedAt: new Date().toISOString(),
    quoteCode: code || "",
    runCount: Array.isArray(runs) ? runs.length : 0,
    runs: Array.isArray(runs) ? runs : []
  };
}

let cameraLogsViewer = null;

function ensureCameraLogsViewer() {
  if (cameraLogsViewer) return cameraLogsViewer;
  const root = document.createElement("div");
  root.className = "camera-logs-viewer";
  root.hidden = true;

  const backdrop = document.createElement("div");
  backdrop.className = "camera-logs-viewer__backdrop";

  const dialog = document.createElement("div");
  dialog.className = "camera-logs-viewer__dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");

  const head = document.createElement("div");
  head.className = "camera-logs-viewer__head";
  const titleEl = document.createElement("div");
  titleEl.className = "camera-logs-viewer__title";
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn btn--ghost btn--tiny";
  closeBtn.textContent = "Fermer";

  const pre = document.createElement("pre");
  pre.className = "camera-logs-viewer__pre";

  head.append(titleEl, closeBtn);
  dialog.append(head, pre);
  root.append(backdrop, dialog);
  document.body.appendChild(root);

  const close = () => {
    root.hidden = true;
    document.body.classList.remove("is-modal-open");
  };
  backdrop.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
  root.addEventListener("click", (event) => {
    if (event.target === root) close();
  });

  cameraLogsViewer = { root, titleEl, pre, close };
  return cameraLogsViewer;
}

function openCameraLogsWindow(payload, title = "Logs test camera") {
  const viewer = ensureCameraLogsViewer();
  const report = buildCameraLogsMarkdown(payload || {});
  viewer.titleEl.textContent = String(title || "Logs test camera");
  viewer.pre.textContent = `${report}\n\n-----\nJSON brut\n-----\n${JSON.stringify(payload || {}, null, 2)}`;
  viewer.root.hidden = false;
  document.body.classList.add("is-modal-open");
  return true;
}

function cameraLogDetailToSentence(detail) {
  if (!detail || typeof detail !== "object") return String(detail || "");
  const label = String(detail?.label || "").trim();
  const errorName = String(detail?.error?.name || detail?.name || "").trim();
  const errorMessage = String(detail?.error?.message || detail?.message || "").trim();
  const state = String(detail?.state || "").trim();
  const count = Number(detail?.count || 0);
  const verdict = String(detail?.verification?.verdict || detail?.verdict || "").trim();
  const switchCheck = String(detail?.switchCheck || "").trim();
  const phase = String(detail?.phase || "").trim();
  const recordingPhase = String(detail?.phaseLabel || "").trim();
  if (recordingPhase && Number.isFinite(Number(detail?.byteLength || 0)) && Number(detail?.byteLength || 0) > 0) {
    const verdictLabel = verdict ? `, ${verdict}` : "";
    return `${recordingPhase}: ${Number(detail?.byteLength || 0)} octets${verdictLabel}`;
  }
  if (phase && verdict) return `${phase}: ${verdict}`;
  if (switchCheck) return `switch_check=${switchCheck}`;
  if (label && errorName) return `${label}: ${errorName}${errorMessage ? ` - ${errorMessage}` : ""}`;
  if (label && state) return `${label}: état ${state}`;
  if (label && Number.isFinite(count) && count > 0) return `${label}: ${count} périphérique(s) détecté(s)`;
  if (errorName) return `${errorName}${errorMessage ? ` - ${errorMessage}` : ""}`;
  if (state) return `état permission ${state}`;
  try {
    return JSON.stringify(detail);
  } catch {
    return "[détail non sérialisable]";
  }
}

function cameraRunClips(run) {
  return Array.isArray(run?.media?.clips) ? run.media.clips : [];
}

function inferPhaseStatusFromEntries(entries = [], phase = "front") {
  const list = Array.isArray(entries) ? entries : [];
  const success = list.some((entry) => String(entry?.event || "") === "phase_get_user_media_success" && String(entry?.detail?.phase || "") === phase);
  if (success) return { status: "ok", error: "" };
  const errorEntry = list.find((entry) => String(entry?.event || "") === "phase_get_user_media_error" && String(entry?.detail?.phase || "") === phase);
  const error = String(errorEntry?.detail?.error?.name || errorEntry?.detail?.error?.message || "").trim();
  return { status: "error", error };
}

function buildCameraLogsMarkdown(payload) {
  const runs = Array.isArray(payload?.runs) ? payload.runs : [];
  const quoteCode = String(payload?.quoteCode || "").trim();
  const generatedAt = String(payload?.generatedAt || new Date().toISOString());
  const lines = [
    "# Rapport diagnostic caméra",
    "",
    `- Devis: ${quoteCode || "N/A"}`,
    `- Généré le: ${generatedAt}`,
    `- Sessions: ${runs.length}`,
    ""
  ];

  runs.forEach((run, index) => {
    const entries = Array.isArray(run?.entries) ? run.entries : [];
    const summaryHints = Array.isArray(run?.summary?.diagnosticHints) ? run.summary.diagnosticHints : [];
    const frontFallback = inferPhaseStatusFromEntries(entries, "front");
    const rearFallback = inferPhaseStatusFromEntries(entries, "rear");
    const frontStatus = String(run?.summary?.frontCameraStatus || frontFallback.status || "").trim();
    const rearStatus = String(run?.summary?.rearCameraStatus || rearFallback.status || "").trim();
    const frontError = String(run?.summary?.frontCameraError || frontFallback.error || "").trim();
    const rearError = String(run?.summary?.rearCameraError || rearFallback.error || "").trim();
    const frontState = cameraPhaseStatusToText(frontStatus, frontError);
    const rearState = cameraPhaseStatusToText(rearStatus, rearError);
    const switchCheck = String(run?.summary?.cameraSwitchCheck || "").trim() || "N/A";
    const clips = cameraRunClips(run);

    lines.push(`## Session ${index + 1} — ${String(run?.runId || "run").trim() || "run"}`);
    lines.push(`- Statut: ${String(run?.status || "unknown")}`);
    lines.push(`- Début: ${String(run?.startedAt || "N/A")}`);
    lines.push(`- Fin: ${String(run?.endedAt || "N/A")}`);
    lines.push(`- Caméra avant (user): ${frontState}`);
    lines.push(`- Caméra arrière (environment): ${rearState}`);
    lines.push(`- Vérif basculement avant/arrière: ${switchCheck}`);
    lines.push(`- Captures vidéo: ${clips.length}`);
    lines.push(`- Nombre de logs techniques: ${entries.length}`);
    if (clips.length) {
      clips.forEach((clip) => {
        const phaseLabel = String(clip?.phaseLabel || clip?.phase || "camera").trim();
        const mimeType = String(clip?.mimeType || "video/unknown").trim();
        const durationMs = Number(clip?.durationMs || 0);
        const byteLength = Number(clip?.byteLength || 0);
        const verdict = String(clip?.verification?.verdict || "unknown").trim();
        const state = clip?.dataUrl ? "téléchargeable" : "non conservée";
        lines.push(`- Capture ${phaseLabel}: ${state} (${mimeType}, ${durationMs} ms, ${byteLength} octets, vérif=${verdict})`);
      });
    }
    lines.push("");
    lines.push("### Pistes de diagnostic");
    if (summaryHints.length) {
      summaryHints.forEach((hint) => lines.push(`- ${String(hint || "").trim()}`));
    } else if (frontStatus !== "ok" || rearStatus !== "ok") {
      lines.push("- Vérifier les permissions navigateur/OS puis retester.");
      lines.push("- Fermer les applications susceptibles d'utiliser déjà la caméra.");
      lines.push("- Recharger la page en HTTPS et refaire un test complet.");
    } else {
      lines.push("- Aucun problème détecté durant ce diagnostic.");
    }
    lines.push("");
    lines.push("### Journal détaillé");
    if (!entries.length) {
      lines.push("- Aucun événement enregistré.");
    } else {
      entries.forEach((entry) => {
        const ts = String(entry?.ts || "").trim();
        const level = String(entry?.level || "info").toUpperCase();
        const event = String(entry?.event || "event").trim();
        const detailText = cameraLogDetailToSentence(entry?.detail);
        lines.push(`- [${ts || "N/A"}] ${level} — ${event}: ${detailText || "aucun détail"}`);
      });
    }
    lines.push("");
  });

  if (!runs.length) {
    lines.push("Aucune session disponible.");
  }

  return lines.join("\n");
}

function triggerFileDownload(content, type, fileName) {
  const blob = new Blob([content], { type });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

function sanitizeFileToken(value = "") {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "run";
}

function downloadCameraRecordings(payload, baseName = "camera-logs") {
  const runs = Array.isArray(payload?.runs) ? payload.runs : [];
  let clipCount = 0;
  let availableCount = 0;
  runs.forEach((run, runIndex) => {
    const runId = sanitizeFileToken(run?.runId || `session-${runIndex + 1}`);
    const clips = cameraRunClips(run);
    clips.forEach((clip, clipIndex) => {
      clipCount += 1;
      const dataUrl = String(clip?.dataUrl || "").trim();
      if (!dataUrl) return;
      const blob = parseDataUrlToBlob(dataUrl);
      if (!blob || !blob.size) return;
      const phase = sanitizeFileToken(clip?.phase || clip?.phaseLabel || `phase-${clipIndex + 1}`);
      const ext = sanitizeFileToken(clip?.extension || videoExtensionFromMime(clip?.mimeType || "")) || "webm";
      const fileName = `${sanitizeFileToken(baseName)}-${runId}-${phase}.${ext}`;
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
      availableCount += 1;
    });
  });
  return { clipCount, availableCount };
}

function downloadCameraLogs(payload, fileName = "") {
  const jsonName = fileName || `camera-logs-${Date.now()}.json`;
  const markdownName = jsonName.replace(/\.json$/i, ".md");
  const baseName = jsonName.replace(/\.json$/i, "");
  const json = JSON.stringify(payload || {}, null, 2);
  const markdown = buildCameraLogsMarkdown(payload || {});
  triggerFileDownload(json, "application/json;charset=utf-8", jsonName);
  triggerFileDownload(markdown, "text/markdown;charset=utf-8", markdownName);
  const recordingStats = downloadCameraRecordings(payload || {}, baseName);
  return {
    jsonName,
    markdownName,
    ...recordingStats
  };
}

function readMobileFormPayload() {
  return {
    fromName: String(mobileFromNameEl?.value || "").trim(),
    replyTo: String(mobileReplyToEl?.value || "").trim().toLowerCase(),
    deviceType: String(mobileDeviceTypeEl?.value || "").trim(),
    issue: String(mobileIssueEl?.value || "").trim(),
    model: String(mobileModelEl?.value || "").trim(),
    description: String(mobileDescriptionEl?.value || "").trim()
  };
}

function createMobileQuoteRecord({ code, payload }) {
  const issueLabel = String(payload?.issue || "").trim();
  return {
    code,
    createdAt: new Date().toISOString(),
    requester: {
      name: String(payload?.fromName || "").trim(),
      email: String(payload?.replyTo || "").trim().toLowerCase(),
      details: String(payload?.description || "").trim(),
      noviceMode: false,
      noviceBrief: "",
      budgetMin: 0,
      budgetMax: 0
    },
    signature: JSON.stringify(payload || {}),
    selects: {},
    external: {},
    usage: `Reparation mobile - ${issueLabel || "N/A"}`,
    serviceType: "mobile-repair",
    issueCategory: mobileIssueNeedsCamera(issueLabel) ? "camera-audio" : "other",
    mobileRequest: {
      deviceType: String(payload?.deviceType || "").trim(),
      issue: issueLabel,
      model: String(payload?.model || "").trim(),
      description: String(payload?.description || "").trim()
    },
    cameraDiagnostics: {
      updatedAt: new Date().toISOString(),
      runs: compactCameraRunsForStorage(mobileCameraRuns)
    },
    config: {
      total: 0,
      parts: {
        device: String(payload?.deviceType || "").trim(),
        issue: issueLabel,
        model: String(payload?.model || "").trim()
      }
    }
  };
}

async function persistMobileQuoteRecord(record) {
  if (!record?.code) return false;
  const store = readMobileQuoteStore();
  store[record.code] = record;
  writeMobileQuoteStore(store);
  localStorage.setItem(MOBILE_LAST_QUOTE_CODE_KEY, record.code);
  const saved = await saveQuoteToDatabase(record);
  return saved;
}

async function runMobileCameraDiagnostic() {
  if (mobileCameraTestBusy) return;
  if (!currentMobileQuoteCode) {
    setMobileCameraHint("Envoie d'abord le devis pour activer le test camera.");
    return;
  }
  if (!mobileIssueNeedsCamera(mobileIssueEl?.value || "")) {
    setMobileCameraHint("Le test camera n'est disponible que pour la categorie camera/audio.");
    return;
  }
  const hasMediaDevices = Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && navigator.mediaDevices.enumerateDevices);
  if (!hasMediaDevices) {
    setMobileCameraHint("Navigateur incompatible: mediaDevices indisponible.");
    return;
  }

  mobileCameraTestBusy = true;
  if (mobileCameraTestBtn) mobileCameraTestBtn.disabled = true;
  setMobileCameraHint("Test camera en cours...");
  if (mobileCameraPanelEl) mobileCameraPanelEl.hidden = false;
  if (mobileCameraPanelMetaEl) mobileCameraPanelMetaEl.textContent = "Initialisation du diagnostic...";
  stopMobileCameraStream();

  const run = createCameraRun();
  try {
    const env = collectClientEnvironmentSnapshot();
    pushCameraLog(run, "environment_snapshot", env, "info");
    run.summary.supportsMediaDevices = true;
    run.summary.supportsPermissionsApi = Boolean(navigator.permissions?.query);
    run.summary.supportsMediaRecorder = Boolean(window.MediaRecorder);
    run.summary.previewSequence = "front_then_rear";
    run.summary.phaseSeconds = CAMERA_PHASE_SECONDS;
    run.summary.recordingSeconds = Math.min(CAMERA_RECORD_SECONDS, CAMERA_PHASE_SECONDS);
    run.summary.recordingMimeType = pickRecorderMimeType() || "unavailable";
    ensureRunMediaBucket(run);

    if (navigator.permissions?.query) {
      try {
        const camPerm = await navigator.permissions.query({ name: "camera" });
        run.summary.cameraPermissionState = String(camPerm?.state || "unknown");
        pushCameraLog(run, "permission_query_before", { state: camPerm?.state || "unknown" }, "info");
      } catch (err) {
        pushCameraLog(run, "permission_query_error", simplifyMediaError(err), "warn");
        run.summary.cameraPermissionState = "unknown";
      }
    } else {
      run.summary.cameraPermissionState = "unsupported";
      pushCameraLog(run, "permission_api_unsupported", { note: "navigator.permissions.query non supporte pour camera" }, "warn");
    }

    let afterVideo = [];
    try {
      const beforeDevices = await navigator.mediaDevices.enumerateDevices();
      const beforeVideo = beforeDevices.filter((d) => d.kind === "videoinput");
      pushCameraLog(run, "enumerate_before_permission", {
        videoInputs: beforeVideo.map((d) => ({
          deviceId: d.deviceId || "",
          groupId: d.groupId || "",
          label: d.label || ""
        })),
        count: beforeVideo.length
      }, "info");
    } catch (err) {
      pushCameraLog(run, "enumerate_before_permission_error", simplifyMediaError(err), "warn");
    }

    try {
      const afterDevices = await navigator.mediaDevices.enumerateDevices();
      afterVideo = afterDevices.filter((d) => d.kind === "videoinput");
      run.summary.detectedVideoInputs = afterVideo.length;
      pushCameraLog(run, "enumerate_after_permission", {
        videoInputs: afterVideo.map((d) => ({
          deviceId: d.deviceId || "",
          groupId: d.groupId || "",
          label: d.label || ""
        })),
        count: afterVideo.length,
        labelsAccessible: afterVideo.some((d) => String(d.label || "").trim().length > 0)
      }, "info");
    } catch (err) {
      pushCameraLog(run, "enumerate_after_permission_error", simplifyMediaError(err), "warn");
    }

    const deviceHints = pickCameraDeviceIds(afterVideo);
    pushCameraLog(run, "phase_device_hints", deviceHints, "info");
    const phaseResults = { front: null, rear: null };
    let successfulStreams = 0;
    let testedStreams = 0;

    const frontResult = await openCameraPhaseStream("front", run, env, deviceHints);
    phaseResults.front = frontResult;
    testedStreams += Number(frontResult?.attempts || 0);
    if (frontResult.ok && frontResult.stream) {
      successfulStreams += 1;
      mobileActiveStream = frontResult.stream;
      if (mobileCameraVideoEl) {
        mobileCameraVideoEl.srcObject = mobileActiveStream;
        await mobileCameraVideoEl.play().catch(() => {});
      }
      if (mobileCameraPanelEl) mobileCameraPanelEl.hidden = false;
      const recordFrontPromise = recordCameraPhaseClip({
        stream: mobileActiveStream,
        phase: "front",
        run,
        seconds: Math.min(CAMERA_RECORD_SECONDS, CAMERA_PHASE_SECONDS),
        verification: frontResult?.verification
      });
      await showPhasePreview({ phaseLabel: "Caméra avant", seconds: CAMERA_PHASE_SECONDS, run });
      const frontClipResult = await recordFrontPromise;
      if (frontClipResult?.clip) ensureRunMediaBucket(run).clips.push(frontClipResult.clip);
      stopMobileCameraStream();
    }

    const rearResult = await openCameraPhaseStream("rear", run, env, deviceHints);
    phaseResults.rear = rearResult;
    testedStreams += Number(rearResult?.attempts || 0);
    if (rearResult.ok && rearResult.stream) {
      successfulStreams += 1;
      mobileActiveStream = rearResult.stream;
      if (mobileCameraVideoEl) {
        mobileCameraVideoEl.srcObject = mobileActiveStream;
        await mobileCameraVideoEl.play().catch(() => {});
      }
      if (mobileCameraPanelEl) mobileCameraPanelEl.hidden = false;
      const recordRearPromise = recordCameraPhaseClip({
        stream: mobileActiveStream,
        phase: "rear",
        run,
        seconds: Math.min(CAMERA_RECORD_SECONDS, CAMERA_PHASE_SECONDS),
        verification: rearResult?.verification
      });
      await showPhasePreview({ phaseLabel: "Caméra arrière", seconds: CAMERA_PHASE_SECONDS, run });
      const rearClipResult = await recordRearPromise;
      if (rearClipResult?.clip) ensureRunMediaBucket(run).clips.push(rearClipResult.clip);
      stopMobileCameraStream();
    }

    const frontState = cameraPhaseStatusFromResult(phaseResults.front);
    const rearState = cameraPhaseStatusFromResult(phaseResults.rear);
    run.summary.frontCameraStatus = frontState;
    run.summary.rearCameraStatus = rearState;
    run.summary.frontCameraVerification = String(phaseResults.front?.verification?.verdict || "none");
    run.summary.rearCameraVerification = String(phaseResults.rear?.verification?.verdict || "none");
    run.summary.frontCameraError = phaseResults.front?.ok
      ? ""
      : String(phaseResults.front?.errors?.[0]?.error?.name || phaseResults.front?.errors?.[0]?.error?.message || "UNKNOWN");
    run.summary.rearCameraError = phaseResults.rear?.ok
      ? ""
      : String(phaseResults.rear?.errors?.[0]?.error?.name || phaseResults.rear?.errors?.[0]?.error?.message || "UNKNOWN");
    run.summary.frontAttemptCount = Number(phaseResults.front?.attempts || 0);
    run.summary.rearAttemptCount = Number(phaseResults.rear?.attempts || 0);
    run.summary.testedStreams = testedStreams;
    run.summary.successfulTests = successfulStreams;
    run.summary.recordingCount = ensureRunMediaBucket(run).clips.length;

    const frontDeviceId = String(phaseResults.front?.trackInfo?.settings?.deviceId || "").trim();
    const rearDeviceId = String(phaseResults.rear?.trackInfo?.settings?.deviceId || "").trim();
    const frontFacing = normalizeFacingMode(phaseResults.front?.trackInfo?.settings?.facingMode || "");
    const rearFacing = normalizeFacingMode(phaseResults.rear?.trackInfo?.settings?.facingMode || "");
    let switchCheck = "not_tested";
    if (phaseResults.front?.ok && phaseResults.rear?.ok) {
      if (frontDeviceId && rearDeviceId) {
        switchCheck = frontDeviceId !== rearDeviceId ? "device_changed" : "same_device_id";
      } else if (frontFacing && rearFacing) {
        switchCheck = frontFacing !== rearFacing ? "facing_changed" : "same_facing_mode";
      } else {
        switchCheck = "not_verifiable";
      }
    }
    run.summary.cameraSwitchCheck = switchCheck;
    pushCameraLog(run, "camera_switch_check", {
      switchCheck,
      frontDeviceId: frontDeviceId || "hidden",
      rearDeviceId: rearDeviceId || "hidden",
      frontFacing: frontFacing || "hidden",
      rearFacing: rearFacing || "hidden"
    }, switchCheck === "device_changed" || switchCheck === "facing_changed" ? "info" : "warn");

    const hints = [];
    (phaseResults.front?.errors || []).forEach((entry) => {
      (entry?.hints || []).forEach((hint) => hints.push(hint));
    });
    (phaseResults.rear?.errors || []).forEach((entry) => {
      (entry?.hints || []).forEach((hint) => hints.push(hint));
    });
    if (frontState === "unverified" || rearState === "unverified") {
      hints.push("Basculement caméra non vérifiable: le navigateur masque facingMode/deviceId/label.");
    }
    if (frontState === "mismatch") hints.push("Flux avant reçu mais indices incompatibles avec la caméra frontale.");
    if (rearState === "mismatch") hints.push("Flux arrière reçu mais indices incompatibles avec la caméra arrière.");
    if (!run.summary.supportsMediaRecorder) {
      hints.push("MediaRecorder non supporté: impossible de conserver les clips vidéo sur ce navigateur.");
    }
    if (switchCheck === "same_device_id" && Number(run.summary.detectedVideoInputs || 0) >= 2) {
      hints.push("Même deviceId entre les deux phases: basculement possiblement ignoré par le navigateur.");
    }
    if (switchCheck === "not_verifiable") {
      hints.push("Impossible de prouver le basculement avant/arrière sur cet appareil (limite navigateur/OS).");
    }
    if (!hints.length && (frontState !== "ok" || rearState !== "ok")) {
      hints.push("Le navigateur a refusé ou limité l'accès caméra sans détail pleinement exploitable.");
      hints.push("Vérifier les permissions OS + navigateur puis retester après fermeture des apps caméra.");
    }
    run.summary.diagnosticHints = [...new Set(hints)];
    pushCameraLog(run, "dual_camera_summary", {
      front: {
        status: frontState,
        selected: phaseResults.front?.label || "",
        verification: phaseResults.front?.verification || null,
        error: phaseResults.front?.errors?.[0]?.error || null
      },
      rear: {
        status: rearState,
        selected: phaseResults.rear?.label || "",
        verification: phaseResults.rear?.verification || null,
        error: phaseResults.rear?.errors?.[0]?.error || null
      },
      switchCheck,
      recordings: ensureRunMediaBucket(run).clips.map((clip) => ({
        phase: clip.phase,
        byteLength: clip.byteLength,
        durationMs: clip.durationMs,
        dropped: Boolean(clip.dropped)
      })),
      hints: run.summary.diagnosticHints
    }, (frontState === "ok" && rearState === "ok") ? "info" : "warn");

    const hasAnySuccess = frontState !== "error" || rearState !== "error";
    const allConfirmed = frontState === "ok" && rearState === "ok";
    if (!hasAnySuccess) run.status = "failure";
    else if (allConfirmed) run.status = "success";
    else run.status = "partial_failure";
    run.endedAt = new Date().toISOString();
    stopMobileCameraStream();
    if (mobileCameraPanelMetaEl) mobileCameraPanelMetaEl.textContent = "Diagnostic terminé.";

    mobileCameraRuns = [...mobileCameraRuns, run].slice(-8);
    const payload = readMobileFormPayload();
    const record = createMobileQuoteRecord({ code: currentMobileQuoteCode, payload });
    const saved = await persistMobileQuoteRecord(record);
    if (!saved) {
      pushCameraLog(run, "quote_save_warning", { code: currentMobileQuoteCode, reason: "SAVE_FAILED_AFTER_RETRIES" }, "warn");
      setMobileCameraHint("Diagnostic terminé localement, mais sauvegarde serveur instable. Refais un test si besoin.");
    }

    const frontStatusText = `avant: ${cameraPhaseStatusToText(frontState, run.summary.frontCameraError)}`;
    const rearStatusText = `arrière: ${cameraPhaseStatusToText(rearState, run.summary.rearCameraError)}`;
    if (saved && run.status === "success") {
      setMobileCameraHint(`Diagnostic caméra terminé. ${frontStatusText} • ${rearStatusText}.`);
    } else if (saved && run.status === "partial_failure") {
      setMobileCameraHint(`Diagnostic partiel. ${frontStatusText} • ${rearStatusText}. Voir les logs côté admin.`);
    } else if (saved) {
      const hintLead = Array.isArray(run.summary.diagnosticHints) && run.summary.diagnosticHints.length
        ? ` ${run.summary.diagnosticHints[0]}`
        : "";
      setMobileCameraHint(`Diagnostic en échec. ${frontStatusText} • ${rearStatusText}.${hintLead}`);
    }
  } catch (err) {
    pushCameraLog(run, "diagnostic_runtime_error", simplifyMediaError(err), "error");
    run.status = "failure";
    run.endedAt = new Date().toISOString();
    mobileCameraRuns = [...mobileCameraRuns, run].slice(-8);
    const payload = readMobileFormPayload();
    const record = createMobileQuoteRecord({ code: currentMobileQuoteCode, payload });
    const saved = await persistMobileQuoteRecord(record);
    setMobileCameraHint(saved
      ? "Diagnostic interrompu par une erreur inattendue. Voir les logs côté admin."
      : "Diagnostic interrompu et sauvegarde serveur instable. Relance un test.");
  } finally {
    stopMobileCameraStream();
    updateMobileCameraAvailabilityUI();
    mobileCameraTestBusy = false;
    if (mobileCameraTestBtn) mobileCameraTestBtn.disabled = false;
  }
}

function applyMobileQuoteRecord(record, sourceLabel = "") {
  if (!record) return false;
  const code = String(record.code || "").trim().toUpperCase();
  if (!code) return false;
  const req = record.mobileRequest && typeof record.mobileRequest === "object" ? record.mobileRequest : {};
  mobileApplyingLoadedRecord = true;
  currentMobileQuoteCode = code;
  if (mobileFromNameEl) mobileFromNameEl.value = String(record.requester?.name || "").trim();
  if (mobileReplyToEl) mobileReplyToEl.value = String(record.requester?.email || "").trim().toLowerCase();
  if (mobileDeviceTypeEl) mobileDeviceTypeEl.value = String(req.deviceType || "").trim();
  if (mobileIssueEl) mobileIssueEl.value = String(req.issue || "").trim();
  if (mobileModelEl) mobileModelEl.value = String(req.model || "").trim();
  if (mobileDescriptionEl) mobileDescriptionEl.value = String(req.description || record.requester?.details || "").trim();
  mobileCameraRuns = Array.isArray(record?.cameraDiagnostics?.runs) ? record.cameraDiagnostics.runs : [];
  mobileApplyingLoadedRecord = false;
  const suffix = sourceLabel ? ` (${sourceLabel})` : "";
  setMobileQuoteCodeHint(`Devis mobile chargé: ${code}${suffix}`);
  setMobileQuoteContextReady(true, mobilePayloadSignature({
    fromName: record.requester?.name || "",
    replyTo: record.requester?.email || "",
    deviceType: req.deviceType || "",
    issue: req.issue || "",
    model: req.model || "",
    description: req.description || record.requester?.details || ""
  }));
  return true;
}

async function loadMobileQuoteByCode(code, { silent = false } = {}) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return false;
  const store = readMobileQuoteStore();
  let record = store[normalized] || null;
  if (!record) {
    record = await fetchQuoteFromDatabase(normalized);
    if (record) {
      store[normalized] = record;
      writeMobileQuoteStore(store);
    }
  }
  const service = String(record?.serviceType || "").trim();
  const looksMobile = Boolean(record?.mobileRequest && typeof record.mobileRequest === "object");
  if (!record || (service !== "mobile-repair" && !looksMobile)) return false;
  localStorage.setItem(MOBILE_LAST_QUOTE_CODE_KEY, normalized);
  const applied = applyMobileQuoteRecord(record, "rechargé");
  if (applied && !silent) toast(`Devis mobile ${normalized} rechargé.`);
  return applied;
}

async function restoreLastMobileQuoteSession() {
  if (!formMobile) return;
  const lastCode = String(localStorage.getItem(MOBILE_LAST_QUOTE_CODE_KEY) || "").trim().toUpperCase();
  if (!lastCode) return;
  await loadMobileQuoteByCode(lastCode, { silent: true });
}

function applyPcRepairQuoteRecord(record, sourceLabel = "") {
  if (!record) return false;
  const code = String(record.code || "").trim().toUpperCase();
  if (!code) return false;
  const parts = record?.config?.parts && typeof record.config.parts === "object" ? record.config.parts : {};
  currentPcRepairQuoteCode = code;
  if (pcFromNameEl) pcFromNameEl.value = String(record.requester?.name || "").trim();
  if (pcReplyToEl) pcReplyToEl.value = String(record.requester?.email || "").trim().toLowerCase();
  if (pcIssueEl) pcIssueEl.value = String(parts.issue || "").trim();
  if (pcUrgencyEl) pcUrgencyEl.value = String(parts.urgency || "").trim();
  if (pcModelEl) pcModelEl.value = String(parts.model || "").trim();
  if (pcDescriptionEl) pcDescriptionEl.value = String(record.requester?.details || "").trim();
  const suffix = sourceLabel ? ` (${sourceLabel})` : "";
  setPcQuoteCodeHint(`Devis réparation PC chargé: ${code}${suffix}`);
  return true;
}

async function loadPcRepairQuoteByCode(code, { silent = false } = {}) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return false;
  const store = readPcRepairQuoteStore();
  let record = store[normalized] || null;
  if (!record) {
    record = await fetchQuoteFromDatabase(normalized);
    if (record) {
      store[normalized] = record;
      writePcRepairQuoteStore(store);
    }
  }
  const service = String(record?.serviceType || "").trim();
  if (!record || service !== "pc-repair") return false;
  localStorage.setItem(PC_REPAIR_LAST_QUOTE_CODE_KEY, normalized);
  const applied = applyPcRepairQuoteRecord(record, "rechargé");
  if (applied && !silent) toast(`Devis réparation PC ${normalized} rechargé.`);
  return applied;
}

async function restoreLastPcRepairQuoteSession() {
  if (!formPc) return;
  const lastCode = String(localStorage.getItem(PC_REPAIR_LAST_QUOTE_CODE_KEY) || "").trim().toUpperCase();
  if (!lastCode) return;
  await loadPcRepairQuoteByCode(lastCode, { silent: true });
}

function cameraRunsFromRecord(record) {
  return Array.isArray(record?.cameraDiagnostics?.runs) ? record.cameraDiagnostics.runs : [];
}

async function openOrDownloadCameraLogsForQuote(code, shouldDownload = false, runId = "") {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return false;
  const record = await getQuoteRecordByCode(normalized, { fresh: true });
  const allRuns = cameraRunsFromRecord(record);
  const targetRunId = String(runId || "").trim();
  const runs = targetRunId
    ? allRuns.filter((run) => String(run?.runId || "").trim() === targetRunId)
    : allRuns;
  if (!runs.length) {
    toast(targetRunId ? "Ce log caméra n'existe plus." : "Aucun log caméra sur ce devis.");
    return false;
  }
  const payload = mobileCameraLogsPayloadFromRuns(runs, normalized);
  if (shouldDownload) {
    const suffix = targetRunId ? `-${targetRunId}` : "";
    const dl = downloadCameraLogs(payload, `camera-logs-${normalized}${suffix}.json`);
    const clipInfo = Number(dl?.availableCount || 0) > 0
      ? ` + ${Number(dl?.availableCount || 0)} vidéo(s)`
      : "";
    toast(`Logs caméra téléchargés (JSON + MD${clipInfo}).`);
    return true;
  }
  const titleSuffix = targetRunId ? ` • ${targetRunId}` : "";
  const opened = openCameraLogsWindow(payload, `Logs camera ${normalized}${titleSuffix}`);
  if (!opened) toast("Popup bloquée: autorise les popups pour voir les logs.");
  return opened;
}

function bindPcRepairFormFlow() {
  if (!formPc) return;

  if (pcLoadQuoteBtn) {
    pcLoadQuoteBtn.addEventListener("click", async () => {
      const raw = String(pcQuoteLookupEl?.value || "").trim();
      if (!raw) {
        toast("Entre un code devis PC.");
        return;
      }
      const consumed = await tryHandleAdminLookupCommand(raw, pcQuoteLookupEl);
      if (consumed) return;
      const ok = await loadPcRepairQuoteByCode(raw, { silent: true });
      if (!ok) {
        toast("Code devis réparation PC introuvable.");
        return;
      }
      if (pcQuoteLookupEl) pcQuoteLookupEl.value = "";
      toast("Devis réparation PC chargé.");
    });
  }

  formPc.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = readPcRepairFormPayload();
    if (!payload.fromName || !payload.replyTo || !payload.issue || !payload.urgency || !payload.model || !payload.description) {
      setStatus("pcStatus", "Complète tous les champs du devis réparation PC.");
      return;
    }

    const code = currentPcRepairQuoteCode || createQuoteCode();
    currentPcRepairQuoteCode = code;
    const quoteRecord = createPcRepairQuoteRecord({ code, payload });
    await persistPcRepairQuoteRecord(quoteRecord);

    const message = [
      "type : devis_reparation_pc",
      `code_devis : ${code}`,
      `nom : ${payload.fromName}`,
      `email : ${payload.replyTo}`,
      `probleme : ${payload.issue}`,
      `urgence : ${payload.urgency}`,
      `modele : ${payload.model}`,
      `description : ${payload.description}`
    ].join("\n");

    const ok = await sendEmail({
      subject: `Demande devis — Réparation PC (${code})`,
      from_name: payload.fromName,
      reply_to: payload.replyTo,
      message,
      statusElId: "pcStatus"
    });

    if (!ok) return;
    setPcQuoteCodeHint(`Code devis réparation PC: ${code}. Conserve-le pour le suivi.`);
  });
}

function bindMobileFormFlow() {
  if (!formMobile) return;

  [mobileFromNameEl, mobileReplyToEl, mobileModelEl, mobileDescriptionEl].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      resetMobileQuoteContextAfterManualEdit();
    });
  });
  [mobileDeviceTypeEl, mobileIssueEl].forEach((el) => {
    if (!el) return;
    el.addEventListener("change", () => {
      resetMobileQuoteContextAfterManualEdit();
      if (el === mobileIssueEl) updateMobileCameraAvailabilityUI();
    });
  });

  if (mobileCameraTestBtn) {
    mobileCameraTestBtn.addEventListener("click", async () => {
      await runMobileCameraDiagnostic();
    });
  }
  if (mobileLoadQuoteBtn) {
    mobileLoadQuoteBtn.addEventListener("click", async () => {
      const raw = String(mobileQuoteLookupEl?.value || "").trim();
      if (!raw) {
        toast("Entre un code devis mobile.");
        return;
      }
      const consumed = await tryHandleAdminLookupCommand(raw, mobileQuoteLookupEl);
      if (consumed) return;
      const ok = await loadMobileQuoteByCode(raw, { silent: true });
      if (!ok) {
        toast("Code devis mobile introuvable.");
        return;
      }
      if (mobileQuoteLookupEl) mobileQuoteLookupEl.value = "";
      toast("Devis mobile chargé.");
    });
  }

  formMobile.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = readMobileFormPayload();
    if (!payload.fromName || !payload.replyTo || !payload.deviceType || !payload.issue || !payload.model || !payload.description) {
      setStatus("mobileStatus", "Complète tous les champs du devis mobile.");
      return;
    }

    const code = (mobileQuoteContextReady && currentMobileQuoteCode) ? currentMobileQuoteCode : createQuoteCode();
    currentMobileQuoteCode = code;
    const quoteRecord = createMobileQuoteRecord({ code, payload });
    const saved = await persistMobileQuoteRecord(quoteRecord);
    if (!saved) {
      setStatus("mobileStatus", "Erreur sauvegarde devis. Réessaie dans quelques secondes.");
      return;
    }

    const logSummary = mobileCameraRuns.length
      ? `logs_camera: ${mobileCameraRuns.length} session(s) (derniere: ${mobileCameraRuns[mobileCameraRuns.length - 1]?.status || "n/a"})`
      : "logs_camera: aucun test lance";

    const message = [
      "type : devis_reparation_mobile",
      `code_devis : ${code}`,
      `nom : ${payload.fromName}`,
      `email : ${payload.replyTo}`,
      `appareil : ${payload.deviceType}`,
      `probleme : ${payload.issue}`,
      `modele : ${payload.model}`,
      `description : ${payload.description}`,
      logSummary
    ].join("\n");

    const ok = await sendEmail({
      subject: `Demande devis — Réparation Mobile (${code})`,
      from_name: payload.fromName,
      reply_to: payload.replyTo,
      message,
      statusElId: "mobileStatus"
    });

    if (!ok) return;

    setMobileQuoteCodeHint(`Code devis mobile: ${code}. Conserve-le pour le suivi.`);
    setMobileQuoteContextReady(true, mobilePayloadSignature(payload));
    if (mobileIssueNeedsCamera(payload.issue)) {
      setMobileCameraHint("Devis envoyé. Tu peux lancer le test caméra pour le diagnostic.");
    } else {
      setMobileCameraHint("");
    }
    updateMobileCameraAvailabilityUI();
  });

  updateMobileCameraAvailabilityUI();
}

function roundBudgetStep(value) {
  return Math.round(Number(value || 0) / BUDGET_STEP) * BUDGET_STEP;
}

function currentUsageMinimumBudget() {
  const usageValue = document.getElementById("usage")?.value || "";
  if (!usageValue) return 0;
  const offer = computeUsageMinimumOffer(usageValue);
  if (!offer?.total) return 0;
  return Math.max(BUDGET_DEFAULT_MIN, roundBudgetStep(Math.ceil(offer.total)));
}

function updateBudgetHint(usageValue, usageMinimum) {
  if (!budgetUsageHintEl) return;
  if (!usageValue || !usageMinimum) {
    budgetUsageHintEl.textContent = "Sélectionne ton usage pour calculer le minimum recommandé.";
    return;
  }
  budgetUsageHintEl.textContent = `Minimum recommandé (${usageValue}) : ${euro(usageMinimum)}.`;
}

function updateBudgetSliderFill(minValue, maxValue, minBound, maxBound) {
  const sliderWrap = budgetMinRangeEl?.parentElement;
  if (!sliderWrap) return;
  const span = Math.max(1, maxBound - minBound);
  const minPct = Math.max(0, Math.min(100, ((minValue - minBound) / span) * 100));
  const maxPct = Math.max(0, Math.min(100, ((maxValue - minBound) / span) * 100));
  sliderWrap.style.setProperty("--minp", `${minPct}%`);
  sliderWrap.style.setProperty("--maxp", `${maxPct}%`);
}

function normalizeBudgetControls(changed = "") {
  const usageValue = document.getElementById("usage")?.value || "";
  const usageMinimum = currentUsageMinimumBudget();
  const minBound = usageMinimum || BUDGET_DEFAULT_MIN;
  const maxBound = Math.max(BUDGET_CAP, minBound + 1000);

  if (budgetMinEl) budgetMinEl.min = String(minBound);
  if (budgetMaxEl) budgetMaxEl.min = String(minBound);
  if (budgetMinRangeEl) {
    budgetMinRangeEl.min = String(minBound);
    budgetMinRangeEl.max = String(maxBound);
  }
  if (budgetMaxRangeEl) {
    budgetMaxRangeEl.min = String(minBound);
    budgetMaxRangeEl.max = String(maxBound);
  }

  const rawMin = Number(budgetMinEl?.value || budgetMinRangeEl?.value || minBound);
  const rawMax = Number(budgetMaxEl?.value || budgetMaxRangeEl?.value || Math.max(minBound + 800, BUDGET_DEFAULT_MAX));

  let minValue = Math.max(minBound, roundBudgetStep(rawMin || minBound));
  let maxValue = Math.max(minBound, roundBudgetStep(rawMax || Math.max(minBound + 800, BUDGET_DEFAULT_MAX)));

  if (changed === "min" && maxValue < minValue) maxValue = minValue;
  else if (changed === "max" && minValue > maxValue) minValue = maxValue;
  else if (maxValue < minValue) maxValue = minValue;

  minValue = Math.min(minValue, maxBound);
  maxValue = Math.min(Math.max(maxValue, minValue), maxBound);

  if (budgetMinEl) budgetMinEl.value = String(minValue);
  if (budgetMaxEl) budgetMaxEl.value = String(maxValue);
  if (budgetMinRangeEl) budgetMinRangeEl.value = String(minValue);
  if (budgetMaxRangeEl) budgetMaxRangeEl.value = String(maxValue);

  updateBudgetHint(usageValue, usageMinimum);
  updateBudgetSliderFill(minValue, maxValue, minBound, maxBound);
}

function inferUsageFromNoviceBrief(brief) {
  const t = normalizeText(brief);
  if (!t) return "";
  if (/\b(120|144|165|240|360)\s*fps\b/.test(t) && /(fortnite|valorant|cs2|warzone|apex|esport|competitif|jouer|gaming|jeu)/.test(t)) {
    return "Jeu compétitif (1080p)";
  }
  if (/4k|uhd|ray tracing|max settings|ultra/.test(t)) return "Jeu (4K)";
  if (/ultrawide|1440|aaa|solo|story|open world/.test(t)) return "Jeu AAA (1440p / ultrawide)";
  if (/1080|esport|competitif|cs2|valorant|fortnite|rocket league/.test(t)) return "Jeu compétitif (1080p)";
  if (/(jouer|gaming|jeu)/.test(t)) return "Jeu compétitif (1080p)";
  if (/blender|3d|montage|video|premiere|davinci|after effects|ia|machine learning|stable diffusion/.test(t)) {
    return "Création (montage / 3D / IA)";
  }
  if (/stream|obs|discord|multitache|multi tache/.test(t)) return "Streaming + multitâche";
  if (/etude|bureautique|office|web|cours|mail/.test(t)) return "Bureautique / étude";
  return "";
}

function inferBuildModeFromNoviceBrief(brief) {
  const t = normalizeText(brief);
  if (!t) return "equilibre";
  if (/minimum|pas cher|budget|economique|entry|fps|fortnite|valorant|cs2/.test(t)) return "minimum";
  if (/milieu|equilibre|polyvalent|rapport qualite prix/.test(t)) return "equilibre";
  if (/ultra|maximum|haut de gamme|no compromise|sans limite/.test(t)) return "equilibre";
  return "equilibre";
}

function inferBudgetFromNoviceBrief(brief) {
  const t = normalizeText(brief);
  if (!t) return 0;
  const matches = [...t.matchAll(/(?:budget|max|maximum|environ|a|de)?\s*(\d{3,5})\s*(?:e|euros?)?/g)];
  const values = matches
    .map((m) => Number(m[1] || 0))
    .filter((v) => Number.isFinite(v) && v >= 300 && v <= BUDGET_CAP);
  if (!values.length) return 0;
  return Math.max(...values);
}

function applyBudgetFromGuide(targetBudget) {
  const budget = Math.max(BUDGET_DEFAULT_MIN, Math.min(BUDGET_CAP, roundBudgetStep(targetBudget)));
  const minGuess = Math.max(BUDGET_DEFAULT_MIN, roundBudgetStep(budget * 0.72));
  if (budgetMinEl) budgetMinEl.value = String(minGuess);
  if (budgetMaxEl) budgetMaxEl.value = String(budget);
  normalizeBudgetControls("max");
}

function setNoviceMode(enabled, { silent = false } = {}) {
  isNoviceMode = Boolean(enabled);
  formCustom?.classList.toggle("is-novice-mode", isNoviceMode);
  CORE_CATEGORY_KEYS.forEach((key) => {
    const cfg = CATEGORY_CONFIG[key];
    const selectEl = cfg ? document.getElementById(cfg.selectId) : null;
    if (selectEl) selectEl.required = !isNoviceMode;
  });
  if (noviceBriefBlockEl) noviceBriefBlockEl.style.display = isNoviceMode ? "block" : "none";
  if (noviceModeToggleEl) {
    noviceModeToggleEl.classList.toggle("is-active", isNoviceMode);
    noviceModeToggleEl.textContent = isNoviceMode
      ? "Mode guidé activé - revenir au mode composants"
      : "Aucune idée / pas de budget précis";
  }
  if (isNoviceMode) closeAllComboMenus("");
  if (!silent) compute();
}

function applyNoviceHintsAfterPreset(brief) {
  const text = normalizeText(brief);
  if (!text) return;

  if (/rgb|led|arc en ciel|couleur/.test(text)) {
    const rgbMgmt = (CATALOG.cableMgmt || []).find((item) => item.id === "mgmt-rgb-sync");
    const selectEl = document.getElementById(CATEGORY_CONFIG.cableMgmt.selectId);
    if (rgbMgmt && selectEl) selectEl.value = rgbMgmt.id;
  }

  if (/silence|silencieux|quiet/.test(text)) {
    const cpu = getSelected("cpu");
    const casev = getSelected("case");
    const cooling = sortByBrandGenerationScore(CATALOG.watercooling)
      .filter((item) => !item.estimateOnly && item.type === "air" && Number(item.score || 0) >= 9.0)
      .sort((a, b) => a.price - b.price)[0];
    if (cooling && (!cpu || cpu.tdp <= 170) && (!casev || cooling.radiator <= casev.maxRad)) {
      const selectEl = document.getElementById(CATEGORY_CONFIG.watercooling.selectId);
      if (selectEl) selectEl.value = cooling.id;
    }
  }

  if (/rapid|vite|deadline|urgent/.test(text)) {
    const deliverySelect = document.getElementById(CATEGORY_CONFIG.delivery.selectId);
    const normal = CATALOG.delivery.find((item) => item.mode === "normal");
    if (deliverySelect && normal) deliverySelect.value = normal.id;
  }

  refreshDependentPersonalizationOptions();
  Object.keys(CATEGORY_CONFIG).forEach((key) => updateFilterInputFromSelection(key));
}

function readCurrentSelectValues() {
  return Object.fromEntries(
    Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => [key, document.getElementById(cfg.selectId)?.value || ""])
  );
}

function clearPresetGuards() {
  minimalPresetLocked = false;
  minimalPresetSnapshot = {};
  optimizedPresetLocked = false;
  optimizedPresetSnapshot = {};
}

function applyPresetToForm(offer, modeLabel) {
  if (!offer?.parts || !offer?.delivery) return false;

  isApplyingPreset = true;
  try {
    Object.keys(UNKNOWN_COMPONENTS).forEach((key) => delete UNKNOWN_COMPONENTS[key]);
    Object.entries(CATEGORY_CONFIG).forEach(([, cfg]) => {
      const filterEl = cfg.filterId ? document.getElementById(cfg.filterId) : null;
      if (filterEl) filterEl.value = "";
      const selectEl = document.getElementById(cfg.selectId);
      if (selectEl) selectEl.value = "";
    });
    renderAllCategories();

    const selectValues = {
      cpu: offer.parts.cpu?.id || "",
      mobo: offer.parts.mobo?.id || "",
      ram: offer.parts.ram?.id || "",
      gpu: offer.parts.gpu?.id || "",
      storage: offer.parts.storage?.id || "",
      psu: offer.parts.psu?.id || "",
      case: offer.parts.case?.id || "",
      watercooling: offer.parts.cooling?.id || "",
      customCables: (CATALOG.customCables.find((item) => item.isNone) || {}).id || "",
      cableMgmt: (CATALOG.cableMgmt.find((item) => item.isNone) || CATALOG.cableMgmt[0] || {}).id || "",
      delivery: offer.delivery?.id || ""
    };

    Object.entries(selectValues).forEach(([key, value]) => {
      const cfg = CATEGORY_CONFIG[key];
      const selectEl = cfg ? document.getElementById(cfg.selectId) : null;
      if (!selectEl || !value) return;
      renderCategory(key);
      selectEl.value = value;
    });

    Object.keys(CATEGORY_CONFIG).forEach((key) => updateFilterInputFromSelection(key));
  } finally {
    isApplyingPreset = false;
  }

  if (modeLabel === "minimum") {
    minimalPresetLocked = true;
    minimalPresetSnapshot = readCurrentSelectValues();
    optimizedPresetLocked = false;
    optimizedPresetSnapshot = {};
  } else if (modeLabel === "équilibrée" || modeLabel === "optimisée") {
    optimizedPresetLocked = true;
    optimizedPresetSnapshot = readCurrentSelectValues();
    minimalPresetLocked = false;
    minimalPresetSnapshot = {};
  } else {
    clearPresetGuards();
  }

  const state = compute();
  const totalText = state?.total ? ` (${euro(state.total)})` : "";
  toast(`Configuration ${modeLabel} appliquée${totalText}`);
  return true;
}

function readQuoteStore() {
  try {
    return JSON.parse(localStorage.getItem(QUOTE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeQuoteStore(store) {
  localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(store));
}

function cloneJson(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return null;
  }
}

function cameraDiagnosticsSize(value) {
  try {
    return JSON.stringify(value || {}).length;
  } catch {
    return 0;
  }
}

function trimCameraDiagnosticsForTransport(cameraDiagnostics, { aggressive = false } = {}) {
  if (!cameraDiagnostics || typeof cameraDiagnostics !== "object") return cameraDiagnostics;
  const sourceRuns = Array.isArray(cameraDiagnostics.runs) ? cameraDiagnostics.runs : [];
  const maxRuns = aggressive ? 3 : 6;
  const maxEntries = aggressive ? 90 : 220;
  const trimmedRuns = sourceRuns.slice(-maxRuns).map((run, idx, arr) => {
    const safeRun = cloneJson(run) || {};
    const entries = Array.isArray(safeRun.entries) ? safeRun.entries.slice(-maxEntries) : [];
    if (!entries.length) {
      entries.push({
        ts: new Date().toISOString(),
        level: "warn",
        event: "diagnostic_entry_missing",
        detail: { note: "Historique réduit pour fiabilité de sauvegarde." }
      });
    }
    safeRun.entries = entries;
    const clips = Array.isArray(safeRun?.media?.clips) ? safeRun.media.clips.slice(-2) : [];
    const isLatestRun = idx === arr.length - 1;
    safeRun.media = {
      clips: clips.map((clip) => {
        const safeClip = cloneJson(clip) || {};
        if (aggressive || !isLatestRun) {
          safeClip.dataUrl = "";
          safeClip.dropped = true;
          safeClip.droppedReason = safeClip.droppedReason || "TRIMMED_FOR_SAVE_RELIABILITY";
        }
        return safeClip;
      })
    };
    if (!safeRun.summary || typeof safeRun.summary !== "object") safeRun.summary = {};
    safeRun.summary.recordingCount = safeRun.media.clips.length;
    return safeRun;
  });

  const out = {
    ...(cloneJson(cameraDiagnostics) || {}),
    updatedAt: new Date().toISOString(),
    runs: trimmedRuns
  };

  const targetSize = aggressive ? 120000 : 220000;
  let guard = 0;
  while (cameraDiagnosticsSize(out) > targetSize && guard < 40) {
    guard += 1;
    let changed = false;

    for (const run of out.runs) {
      const clips = Array.isArray(run?.media?.clips) ? run.media.clips : [];
      const withData = clips.find((clip) => String(clip?.dataUrl || "").trim());
      if (withData) {
        withData.dataUrl = "";
        withData.dropped = true;
        withData.droppedReason = withData.droppedReason || "TRIMMED_FOR_SAVE_RELIABILITY";
        changed = true;
        break;
      }
    }

    if (!changed) {
      for (const run of out.runs) {
        if (Array.isArray(run?.entries) && run.entries.length > 80) {
          run.entries = run.entries.slice(-80);
          changed = true;
        }
      }
    }

    if (!changed && out.runs.length > 1) {
      out.runs.shift();
      changed = true;
    }

    if (!changed) break;
  }

  return out;
}

function buildRecordForSaveVariant(record, { aggressive = false } = {}) {
  const clone = cloneJson(record);
  if (!clone || typeof clone !== "object") return null;
  if (clone.cameraDiagnostics && typeof clone.cameraDiagnostics === "object") {
    clone.cameraDiagnostics = trimCameraDiagnosticsForTransport(clone.cameraDiagnostics, { aggressive });
  }
  return clone;
}

async function saveQuoteToDatabase(record) {
  const candidates = [];
  const addCandidate = (candidate) => {
    if (!candidate || typeof candidate !== "object") return;
    const signatureValue = (() => {
      try {
        return JSON.stringify(candidate);
      } catch {
        return "";
      }
    })();
    if (!signatureValue) return;
    if (candidates.some((item) => item.signatureValue === signatureValue)) return;
    candidates.push({ candidate, signatureValue });
  };

  addCandidate(record);
  if (record?.cameraDiagnostics && typeof record.cameraDiagnostics === "object") {
    addCandidate(buildRecordForSaveVariant(record, { aggressive: false }));
    addCandidate(buildRecordForSaveVariant(record, { aggressive: true }));
  }

  for (const item of candidates) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const res = await fetch("/api/save-quote", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
          body: JSON.stringify({ record: item.candidate }),
          keepalive: true,
          cache: "no-store"
        });
        if (res.ok) return true;
        const data = await res.json().catch(() => ({}));
        const errCode = String(data?.error || "");
        const tooLarge = res.status === 413 || errCode === "RECORD_TOO_LARGE";
        if (tooLarge) break;
      } catch {
        // Retry once per candidate on transient network failure.
      }
      await waitMs(180 * (attempt + 1));
    }
  }

  return false;
}

async function fetchQuoteFromDatabase(code, { fresh = false } = {}) {
  const clean = String(code || "").trim().toUpperCase();
  if (!clean) return null;

  try {
    const params = new URLSearchParams({ code: clean });
    if (fresh) params.set("_ts", Date.now().toString(36));
    const res = await fetch(`/api/load-quote?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data && data.ok && data.record) return data.record;

    return null;
  } catch {
    return null;
  }
}

async function collect3DQuoteArtifacts() {
  const fallback = {
    imageDataUrl: "",
    sceneJson: ""
  };
  try {
    if (!window.AE3D) return fallback;
    const imageDataUrl = typeof window.AE3D.captureSnapshot === "function"
      ? await window.AE3D.captureSnapshot({ width: 320, height: 180, quality: 0.52 })
      : "";
    const sceneState = typeof window.AE3D.exportSerializableState === "function"
      ? window.AE3D.exportSerializableState()
      : null;
    return {
      imageDataUrl: imageDataUrl || "",
      sceneJson: sceneState ? JSON.stringify(sceneState) : ""
    };
  } catch {
    return fallback;
  }
}

function createQuoteCode() {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `DV-${stamp}${rand}`;
}

function signature() {
  const payload = {};
  Object.keys(CATEGORY_CONFIG).forEach((key) => {
    const selectId = CATEGORY_CONFIG[key].selectId;
    payload[key] = document.getElementById(selectId)?.value || "";
  });
  payload.external = Object.fromEntries(
    Object.entries(UNKNOWN_COMPONENTS).map(([key, value]) => [key, value?.query || ""])
  );
  payload.usage = document.getElementById("usage")?.value || "";
  payload.budgetMin = parseBudgetValue("budgetMin");
  payload.budgetMax = parseBudgetValue("budgetMax");
  payload.noviceMode = isNoviceMode;
  payload.noviceBrief = (noviceBriefEl?.value || "").trim();
  payload.details = quoteDetailsEl?.value?.trim() || "";
  return JSON.stringify(payload);
}

function collectConfig(state) {
  return {
    usage: state.selection.usage,
    novice: {
      enabled: Boolean(state.selection.noviceMode),
      brief: state.selection.noviceBrief || ""
    },
    budget: {
      min: state.selection.budgetMin || 0,
      max: state.selection.budgetMax || 0,
      usageMinimum: state.selection.usageMinimum || 0
    },
    total: state.total,
    warnings: state.warnings,
    bottleneck: state.bottleneck,
    customCoolingPending: state.customCoolingPending,
    parts: {
      cpu: `${state.selection.cpu.brand} ${state.selection.cpu.name}`,
      mobo: `${state.selection.mobo.brand} ${state.selection.mobo.name}`,
      ram: `${state.selection.ram.brand} ${state.selection.ram.name}`,
      gpu: `${state.selection.gpu.brand} ${state.selection.gpu.name}`,
      storage: `${state.selection.storage.brand} ${state.selection.storage.name}`,
      psu: `${state.selection.psu.brand} ${state.selection.psu.name}`,
      case: `${state.selection.case.brand} ${state.selection.case.name}`,
      cooling: `${state.selection.cooling.brand} ${state.selection.cooling.name}`,
      customCable: `${state.selection.customCable.category || state.selection.customCable.brand} ${state.selection.customCable.name}`,
      cableMgmt: `${state.selection.cableMgmt.brand} ${state.selection.cableMgmt.name}`,
      delivery: state.selection.delivery.name
    }
  };
}

function buildQuoteRecord(state, code, {
  createdAt = new Date().toISOString(),
  signatureValue = signature(),
  previewState = (typeof window.AE3D?.exportSerializableState === "function"
    ? window.AE3D.exportSerializableState()
    : null)
} = {}) {
  return {
    code,
    createdAt,
    requester: {
      name: quoteNameEl?.value?.trim() || "",
      email: quoteEmailEl?.value?.trim() || "",
      details: quoteDetailsEl?.value?.trim() || "",
      noviceMode: Boolean(isNoviceMode),
      noviceBrief: (noviceBriefEl?.value || "").trim(),
      budgetMin: parseBudgetValue("budgetMin"),
      budgetMax: parseBudgetValue("budgetMax")
    },
    signature: signatureValue,
    selects: Object.fromEntries(
      Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => [key, document.getElementById(cfg.selectId)?.value || ""])
    ),
    external: Object.fromEntries(
      Object.entries(UNKNOWN_COMPONENTS)
        .filter(([key, value]) => !NO_EXTERNAL_REFERENCE_KEYS.has(key) && value?.confirmed && value?.query)
        .map(([key, value]) => [key, {
          query: value.query,
          note: value.note || "",
          resolved: value.resolved || null,
          needsCompatConfirm: !value.adminConfirmedAt
        }])
    ),
    usage: document.getElementById("usage")?.value || "",
    serviceType: "pc-custom",
    issueCategory: "custom-build",
    config: collectConfig(state),
    preview3d: previewState
  };
}

async function getQuoteRecordByCode(code, { fresh = false } = {}) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return null;
  const store = readQuoteStore();
  if (!fresh && store[normalized]) return store[normalized];
  const remote = await fetchQuoteFromDatabase(normalized, { fresh: true });
  if (!remote && store[normalized]) return store[normalized];
  if (!remote) return null;
  store[normalized] = remote;
  writeQuoteStore(store);
  return remote;
}

function optionNameById(key, id) {
  if (!id) return "Aucun";
  const item = (CATALOG[key] || []).find((entry) => entry.id === id);
  if (!item) return id;
  return optionLabel(key, item);
}

function budgetLabel(value) {
  const n = Number(value || 0);
  if (!n) return "Non défini";
  return euro(n);
}

function normalizedTextValue(value) {
  return String(value || "").trim();
}

function buildModificationBatch(baseRecord, targetRecord) {
  if (!baseRecord || !targetRecord) return [];
  const labels = {
    cpu: "Processeur",
    mobo: "Carte mère",
    ram: "RAM",
    gpu: "Carte graphique",
    storage: "Stockage",
    psu: "Alimentation",
    case: "Boîtier",
    watercooling: "Refroidissement",
    customCables: "Câbles personnalisés",
    cableMgmt: "Câble management",
    delivery: "Traitement atelier"
  };

  const changes = [];
  Object.keys(CATEGORY_CONFIG).forEach((key) => {
    const fromId = baseRecord?.selects?.[key] || "";
    const toId = targetRecord?.selects?.[key] || "";
    if (fromId === toId) return;
    changes.push({
      field: key,
      label: labels[key] || key,
      from: optionNameById(key, fromId),
      to: optionNameById(key, toId)
    });
  });

  const usageFrom = normalizedTextValue(baseRecord?.usage);
  const usageTo = normalizedTextValue(targetRecord?.usage);
  if (usageFrom !== usageTo) {
    changes.push({ field: "usage", label: "Usage", from: usageFrom || "Aucun", to: usageTo || "Aucun" });
  }

  const budgetMinFrom = Number(baseRecord?.requester?.budgetMin || 0);
  const budgetMinTo = Number(targetRecord?.requester?.budgetMin || 0);
  if (budgetMinFrom !== budgetMinTo) {
    changes.push({
      field: "budgetMin",
      label: "Budget minimum",
      from: budgetLabel(budgetMinFrom),
      to: budgetLabel(budgetMinTo)
    });
  }

  const budgetMaxFrom = Number(baseRecord?.requester?.budgetMax || 0);
  const budgetMaxTo = Number(targetRecord?.requester?.budgetMax || 0);
  if (budgetMaxFrom !== budgetMaxTo) {
    changes.push({
      field: "budgetMax",
      label: "Budget maximum",
      from: budgetLabel(budgetMaxFrom),
      to: budgetLabel(budgetMaxTo)
    });
  }

  const detailsFrom = normalizedTextValue(baseRecord?.requester?.details);
  const detailsTo = normalizedTextValue(targetRecord?.requester?.details);
  if (detailsFrom !== detailsTo) {
    changes.push({
      field: "details",
      label: "Brief technique",
      from: detailsFrom || "Vide",
      to: detailsTo || "Vide"
    });
  }

  const noviceModeFrom = Boolean(baseRecord?.requester?.noviceMode);
  const noviceModeTo = Boolean(targetRecord?.requester?.noviceMode);
  if (noviceModeFrom !== noviceModeTo) {
    changes.push({
      field: "noviceMode",
      label: "Mode guide",
      from: noviceModeFrom ? "Active" : "Inactif",
      to: noviceModeTo ? "Active" : "Inactif"
    });
  }

  const noviceBriefFrom = normalizedTextValue(baseRecord?.requester?.noviceBrief);
  const noviceBriefTo = normalizedTextValue(targetRecord?.requester?.noviceBrief);
  if (noviceBriefFrom !== noviceBriefTo) {
    changes.push({
      field: "noviceBrief",
      label: "Brief mode guide",
      from: noviceBriefFrom || "Vide",
      to: noviceBriefTo || "Vide"
    });
  }

  return changes;
}

function modificationBatchText(changes) {
  if (!Array.isArray(changes) || !changes.length) return "Aucune modification";
  return changes.map((item) => `${item.label}: ${item.from} -> ${item.to}`).join(" | ");
}

function saveQuote(state, forcedCode = "") {
  const store = readQuoteStore();
  const newSignature = signature();
  let code = forcedCode || currentQuoteCode;
  const preserveForcedCode = Boolean(forcedCode);

  if (!code || (!preserveForcedCode && currentQuoteSignature !== newSignature)) {
    code = createQuoteCode();
  }

  const previousRecord = store[code] || null;
  const record = buildQuoteRecord(state, code, {
    createdAt: previousRecord?.createdAt || new Date().toISOString(),
    signatureValue: newSignature
  });

  store[code] = record;
  writeQuoteStore(store);
  void saveQuoteToDatabase(record);

  currentQuoteCode = code;
  currentQuoteSignature = newSignature;
  if (contactQuoteCodeEl) contactQuoteCodeEl.value = code;
  setQuoteCodeUI(code, "Code actif. Utilise-le pour le suivi de devis.");
  return code;
}

function loadQuote(code) {
  const store = readQuoteStore();
  const quote = store[code];
  if (!quote) return false;
  const serviceType = String(quote?.serviceType || "").trim().toLowerCase();
  if (serviceType && serviceType !== "pc-custom") return false;
  if (quote?.mobileRequest && typeof quote.mobileRequest === "object") return false;

  Object.keys(UNKNOWN_COMPONENTS).forEach((key) => delete UNKNOWN_COMPONENTS[key]);

  Object.entries(CATEGORY_CONFIG).forEach(([key, cfg]) => {
    const selectEl = document.getElementById(cfg.selectId);
    if (!selectEl) return;
    const value = quote.selects?.[key] || "";
    if (value) {
      renderCategory(key);
      selectEl.value = value;
    }
  });

  Object.entries(quote.external || {}).forEach(([key, value]) => {
    if (NO_EXTERNAL_REFERENCE_KEYS.has(key)) return;
    const query = (value?.query || "").trim();
    if (!query || !CATEGORY_CONFIG[key]) return;
    UNKNOWN_COMPONENTS[key] = {
      key,
      query,
      confirmed: true,
      resolved: null,
      confirmedAt: Date.now()
    };
  });

  setOptionalDefaults();
  refreshDependentPersonalizationOptions();
  Object.keys(CATEGORY_CONFIG).forEach((key) => updateFilterInputFromSelection(key));

  const usageEl = document.getElementById("usage");
  if (usageEl && quote.usage) usageEl.value = quote.usage;
  if (quoteNameEl && quote.requester?.name) quoteNameEl.value = quote.requester.name;
  if (quoteEmailEl && quote.requester?.email) quoteEmailEl.value = quote.requester.email;
  if (quoteDetailsEl && quote.requester?.details) quoteDetailsEl.value = quote.requester.details;
  if (noviceBriefEl) noviceBriefEl.value = String(quote.requester?.noviceBrief || "").trim();
  setNoviceMode(Boolean(quote.requester?.noviceMode), { silent: true });
  if (budgetMinEl) budgetMinEl.value = quote.requester?.budgetMin ? String(quote.requester.budgetMin) : "";
  if (budgetMaxEl) budgetMaxEl.value = quote.requester?.budgetMax ? String(quote.requester.budgetMax) : "";
  normalizeBudgetControls("usage");

  currentQuoteCode = code;
  currentQuoteSignature = quote.signature || signature();
  if (contactQuoteCodeEl) contactQuoteCodeEl.value = code;
  setQuoteCodeUI(code, `Devis chargé (${new Date(quote.createdAt).toLocaleDateString("fr-FR")}).`);
  compute();
  return true;
}
async function loadQuoteAny(code) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return false;
  if (loadQuote(normalized)) return true;
  const remote = await fetchQuoteFromDatabase(normalized);
  if (!remote) return false;
  const store = readQuoteStore();
  store[normalized] = remote;
  writeQuoteStore(store);
  return loadQuote(normalized);
}

function activeQuoteCode() {
  return String(currentQuoteCode || "").trim().toUpperCase();
}

async function buildModifyContext(code) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return null;
  const baseRecord = await getQuoteRecordByCode(normalized);
  if (!baseRecord) return null;
  const state = compute();
  if (!state.ready) return { baseRecord, state, targetRecord: null, changes: [] };
  const targetRecord = buildQuoteRecord(state, normalized, {
    createdAt: baseRecord?.createdAt || new Date().toISOString()
  });
  const changes = buildModificationBatch(baseRecord, targetRecord);
  return { baseRecord, state, targetRecord, changes };
}

async function apiRequestModify(payload) {
  const res = await fetch("/api/request-modify-quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "REQUEST_FAILED");
  return data;
}

async function apiConfirmModify(payload) {
  const res = await fetch("/api/confirm-modify-quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "CONFIRM_FAILED");
  return data;
}

async function apiReadModifyPending(code, adminKey = "") {
  const params = new URLSearchParams({ code: String(code || "").trim().toUpperCase() });
  if (adminKey) params.set("admin_key", adminKey);
  const res = await fetch(`/api/get-modify-otp?${params.toString()}`, { method: "GET" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "PENDING_FAILED");
  return data;
}

async function apiValidateAdminKey(adminKey) {
  const key = String(adminKey || "").trim();
  if (!key) return false;
  lastAdminAuthError = "";
  try {
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_key: key })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      lastAdminAuthError = String(data?.error || "");
      return false;
    }
    return Boolean(res.ok && data?.ok === true);
  } catch {
    lastAdminAuthError = "NETWORK_OR_SERVER_ERROR";
    return false;
  }
}

async function apiSendTestReceipt(payload) {
  const body = payload && typeof payload === "object"
    ? { ...payload, action: "test-receipt" }
    : { action: "test-receipt" };
  const res = await fetch("/api/admin-tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "TEST_RECEIPT_FAILED");
  return data;
}

function openTestReceiptPreview(preview, invoiceNumber = "") {
  const html = String(preview?.html || "").trim();
  if (!html) return false;
  const subject = String(preview?.subject || "Facture test").trim();
  const wrapped = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${subject}</title><style>body{margin:0;background:#eaf0f8;color:#1b2b41;font-family:Manrope,Arial,sans-serif}.wrap{max-width:940px;margin:0 auto;padding:22px}.card{background:#fff;color:#152030;border:1px solid #d6e0ec;border-radius:14px;padding:20px;box-shadow:0 16px 34px rgba(14,32,56,.12)}.meta{color:#455f80;font-size:12px;font-weight:700;margin:0 0 12px 0}</style></head><body><div class="wrap"><p class="meta">Previsualisation facture test ${invoiceNumber ? `• ${invoiceNumber}` : ""}</p><div class="card">${html}</div></div></body></html>`;
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return false;
  w.document.open();
  w.document.write(wrapped);
  w.document.close();
  return true;
}

async function runTestReceiptFlow({ code, suggestedEmail = "" } = {}) {
  if (!isAdmin || !adminSessionKey) {
    toast("Mode admin requis.");
    return;
  }
  const normalizedCode = String(code || "").trim().toUpperCase();
  const targetEmail = String(suggestedEmail || "").trim().toLowerCase();
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail);

  try {
    if (!hasValidEmail) {
      toast("Email client introuvable pour l'envoi test.");
      setStatus("customStatus", "Envoi test bloque: charge un devis avec un email client valide.");
      return;
    }

    const sendPayload = {
      admin_key: adminSessionKey,
      send_email: true,
      to_email: targetEmail
    };
    if (normalizedCode) sendPayload.code = normalizedCode;
    else sendPayload.mode = "random";

    const sentData = await apiSendTestReceipt(sendPayload);
    const invoiceNumber = String(sentData?.invoiceNumber || "").trim();
    const wasRandom = Boolean(sentData?.generatedRandom || !normalizedCode);
    const opened = openTestReceiptPreview(sentData?.preview || {}, invoiceNumber);

    if (sentData?.emailSent) {
      setStatus("customStatus", `Facture test envoyée à ${targetEmail}${sentData?.invoiceNumber ? ` (${sentData.invoiceNumber})` : ""}.`);
      if (opened) {
        toast(wasRandom ? "Facture test aleatoire envoyee + apercu ouvert." : "Facture test envoyee + apercu ouvert.");
      } else {
        toast(wasRandom ? "Facture test aleatoire envoyee." : "Facture test envoyee.");
      }
      return;
    }

    const sendError = String(sentData?.sendError || "");
    if (sendError.includes("domain is not verified") && sendError.includes("SMTP_NOT_CONFIGURED")) {
      toast("Configure Gmail SMTP gratuit pour l'envoi.");
      setStatus("customStatus", "Aperçu facture OK. Resend bloque (domaine non vérifié). Active GMAIL_USER + GMAIL_APP_PASSWORD sur Vercel.");
      return;
    }
    if (sendError.includes("domain is not verified")) {
      toast("Resend: domaine expéditeur non vérifié.");
      setStatus("customStatus", "Aperçu facture OK. Envoi bloqué: domaine expéditeur Resend non vérifié (RESEND_FROM_EMAIL).");
      return;
    }
    if (sendError.includes("RESEND_NOT_CONFIGURED")) {
      toast("Resend non configuré côté serveur.");
      setStatus("customStatus", "Aperçu facture OK. Envoi bloqué: RESEND_API_KEY / RESEND_FROM_EMAIL manquants.");
      return;
    }
    if (sendError.includes("EMAILJS_SEND_FAILED") || sendError.includes("non-browser applications")) {
      toast("Fallback EmailJS indisponible sur ce plan.");
      setStatus("customStatus", "Aperçu facture OK. Envoi bloqué: EmailJS API serveur indisponible.");
      return;
    }
    if (sendError.toLowerCase().includes("too many requests")) {
      toast("Limite d'envoi atteinte, réessaie dans quelques secondes.");
      setStatus("customStatus", "Aperçu facture OK. Envoi temporairement limité (rate limit fournisseur email).");
      return;
    }
    toast("Envoi test échoué côté serveur.");
    setStatus("customStatus", `Envoi test non effectué: ${sendError || "erreur inconnue"}`);
  } catch (err) {
    console.error(err);
    const msg = String(err?.message || "");
    if (msg === "ADMIN_KEY_INVALID" || msg === "ADMIN_NOT_CONFIGURED") {
      isAdmin = false;
      adminSessionKey = "";
      applyAdminUI();
      toast(msg === "ADMIN_NOT_CONFIGURED" ? "Admin non configuré côté serveur." : "Session admin invalide.");
      return;
    }
    if (msg === "NOT_FOUND") {
      toast("Devis introuvable en base.");
      return;
    }
    if (msg === "INVALID_TARGET_EMAIL") {
      toast("Email invalide.");
      return;
    }
    toast("Erreur lors du test facture.");
  }
}

function formatDateTimeFr(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("fr-FR");
}

function clearNode(node) {
  if (!node) return;
  while (node.firstChild) node.removeChild(node.firstChild);
}

function setAdminQuotesStatus(text, tone = "") {
  if (!adminQuotesStatusEl) return;
  adminQuotesStatusEl.textContent = text || "";
  adminQuotesStatusEl.style.color = tone === "bad"
    ? "rgba(255,180,180,.95)"
    : tone === "good"
      ? "rgba(186,255,218,.96)"
      : "var(--text)";
}

async function apiFetchAdminQuotes(adminKey) {
  const params = new URLSearchParams({
    action: "list",
    admin_key: String(adminKey || "").trim(),
    _ts: Date.now().toString(36)
  });
  const res = await fetch(`/api/admin-tools?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "ADMIN_QUOTES_FETCH_FAILED");
  return data;
}

async function apiSetAdminQuoteStatus(code, status) {
  const res = await fetch("/api/admin-tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "set-status",
      code: String(code || "").trim().toUpperCase(),
      status,
      admin_key: adminSessionKey
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "ADMIN_QUOTE_STATUS_FAILED");
  return data;
}

async function apiDeleteAdminQuote(code) {
  const res = await fetch("/api/admin-tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "delete",
      code: String(code || "").trim().toUpperCase(),
      admin_key: adminSessionKey
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "ADMIN_QUOTE_DELETE_FAILED");
  return data;
}

async function apiDeleteCameraLogRun(code, runId = "", clearAll = false) {
  const res = await fetch("/api/admin-tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "delete-camera-log-run",
      code: String(code || "").trim().toUpperCase(),
      run_id: String(runId || "").trim(),
      clear_all: Boolean(clearAll),
      admin_key: adminSessionKey
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "ADMIN_CAMERA_LOG_DELETE_FAILED");
  return data;
}

async function tryHandleAdminLookupCommand(rawInput, sourceInputEl = null) {
  const raw = String(rawInput || "").trim();
  if (!raw.toLowerCase().startsWith("admin:")) return false;

  const command = raw.slice("admin:".length).trim();
  const turnOff = /\s+--off$/i.test(command);
  const keyRaw = command.replace(/\s+--off$/i, "").trim();
  const key = keyRaw
    .replace(/^admin\s*:/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  if (!key) {
    toast("Saisis la clé admin après admin:");
    return true;
  }

  const valid = await apiValidateAdminKey(key);
  if (valid) {
    if (turnOff) {
      isAdmin = false;
      adminSessionKey = "";
      applyAdminUI();
      if (sourceInputEl) sourceInputEl.value = "";
      toast("Mode admin désactivé");
      return true;
    }
    isAdmin = true;
    adminSessionKey = key;
    if (sourceInputEl) sourceInputEl.value = "";
    applyAdminUI();
    toast("Mode admin activé");
    return true;
  }

  isAdmin = false;
  adminSessionKey = "";
  applyAdminUI();
  if (lastAdminAuthError === "ADMIN_NOT_CONFIGURED") {
    toast("Clé admin non configurée côté serveur (env ADMIN_MODIFY_KEY).");
  } else if (lastAdminAuthError === "TOO_MANY_REQUESTS" || lastAdminAuthError === "AUTH_LOCKED_TEMPORARY") {
    toast("Trop de tentatives admin, réessaie plus tard.");
  } else if (lastAdminAuthError === "NETWORK_OR_SERVER_ERROR") {
    toast("Impossible de joindre l'auth admin serveur.");
  } else {
    toast("Clé admin incorrecte");
  }
  return true;
}

function adminPriorityClass(level) {
  if (level >= 3) return "admin-quote__badge admin-quote__badge--high";
  if (level >= 2) return "admin-quote__badge admin-quote__badge--normal";
  return "admin-quote__badge admin-quote__badge--low";
}

function normalizeAdminServiceType(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "mobile-repair") return "mobile-repair";
  if (normalized === "pc-repair") return "pc-repair";
  return "pc-custom";
}

function adminServiceLabel(serviceType = "") {
  const normalized = normalizeAdminServiceType(serviceType);
  if (normalized === "mobile-repair") return "Réparation mobile";
  if (normalized === "pc-repair") return "Réparation PC";
  return "Création PC";
}

function renderAdminCameraRunsPanel(quote) {
  const runs = Array.isArray(quote?.cameraRuns) ? quote.cameraRuns : [];
  const holder = document.createElement("details");
  holder.className = "admin-camera-runs";
  holder.hidden = !runs.length;

  const summary = document.createElement("summary");
  summary.className = "admin-camera-runs__summary";
  summary.textContent = `Sessions caméra (${runs.length})`;
  holder.appendChild(summary);

  const list = document.createElement("div");
  list.className = "admin-camera-runs__list";
  if (!runs.length) {
    const empty = document.createElement("div");
    empty.className = "admin-camera-runs__empty";
    empty.textContent = "Aucun log caméra.";
    list.appendChild(empty);
  } else {
    runs.forEach((run) => {
      const runId = String(run?.runId || "").trim();
      const row = document.createElement("div");
      row.className = "admin-camera-run";

      const meta = document.createElement("div");
      meta.className = "admin-camera-run__meta";
      const endedAt = formatDateTimeFr(run?.endedAt || run?.startedAt || "");
      const status = String(run?.status || "unknown");
      const count = Number(run?.entryCount || 0);
      const clips = Number(run?.recordingCount || 0);
      meta.textContent = `${runId || "run"} • ${status} • ${count} logs • ${clips} vidéo(s) • ${endedAt || "date inconnue"}`;

      const actions = document.createElement("div");
      actions.className = "admin-camera-run__actions";

      const viewBtn = document.createElement("button");
      viewBtn.type = "button";
      viewBtn.className = "btn btn--ghost btn--tiny";
      viewBtn.dataset.adminAction = "view-camera-log-run";
      viewBtn.dataset.code = String(quote.code || "");
      viewBtn.dataset.runId = runId;
      viewBtn.textContent = "Voir";

      const downloadBtn = document.createElement("button");
      downloadBtn.type = "button";
      downloadBtn.className = "btn btn--ghost btn--tiny";
      downloadBtn.dataset.adminAction = "download-camera-log-run";
      downloadBtn.dataset.code = String(quote.code || "");
      downloadBtn.dataset.runId = runId;
      downloadBtn.textContent = "Télécharger";

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn--ghost btn--tiny";
      deleteBtn.dataset.adminAction = "delete-camera-log-run";
      deleteBtn.dataset.code = String(quote.code || "");
      deleteBtn.dataset.runId = runId;
      deleteBtn.textContent = "Supprimer";

      actions.append(viewBtn, downloadBtn, deleteBtn);
      row.append(meta, actions);
      list.appendChild(row);
    });

    if (runs.length > 1) {
      const clearAllBtn = document.createElement("button");
      clearAllBtn.type = "button";
      clearAllBtn.className = "btn btn--ghost btn--tiny";
      clearAllBtn.dataset.adminAction = "delete-camera-runs-all";
      clearAllBtn.dataset.code = String(quote.code || "");
      clearAllBtn.textContent = "Supprimer tous les logs caméra";
      list.appendChild(clearAllBtn);
    }
  }

  holder.appendChild(list);
  return holder;
}

function buildAdminQuoteCard(quote) {
  const details = document.createElement("details");
  details.className = "admin-quote";

  const summary = document.createElement("summary");
  summary.className = "admin-quote__summary";

  const chevron = document.createElement("span");
  chevron.className = "admin-quote__chevron";
  chevron.textContent = "›";

  const head = document.createElement("div");
  head.className = "admin-quote__head";

  const code = document.createElement("span");
  code.className = "admin-quote__code";
  code.textContent = `Devis ${quote.code || "—"}`;

  const badge = document.createElement("span");
  badge.className = adminPriorityClass(Number(quote.priorityLevel || 1));
  badge.textContent = String(quote.priorityLabel || "normale");

  const statusBadge = document.createElement("span");
  statusBadge.className = "admin-quote__badge admin-quote__badge--normal";
  statusBadge.textContent = quote.status === "settled" ? "réglé" : "ouvert";

  const date = document.createElement("span");
  date.className = "admin-quote__date";
  date.textContent = formatDateTimeFr(quote.createdAt);

  head.append(code, badge, statusBadge);
  summary.append(chevron, head, date);

  const body = document.createElement("div");
  body.className = "admin-quote__body";

  const grid = document.createElement("div");
  grid.className = "admin-quote__grid";
  const cards = [
    { label: "Client", value: `${quote.requesterName || "—"}${quote.requesterEmail ? ` (${quote.requesterEmail})` : ""}` },
    { label: "Service", value: adminServiceLabel(quote.serviceType) },
    { label: "Catégorie", value: quote.issueCategory || "—" },
    { label: "Usage", value: quote.usage || "—" },
    { label: "Total estimé", value: quote.totalLabel || "—" },
    { label: "Traitement", value: quote.deliveryName || "—" },
    { label: "Créé le", value: formatDateTimeFr(quote.createdAt) },
    { label: "MAJ", value: formatDateTimeFr(quote.updatedAt || quote.createdAt) },
    { label: "OTP modification", value: quote.pendingModification ? `En attente (exp. ${formatDateTimeFr(quote.pendingExpiresAt)})` : "Aucun" },
    { label: "Priorité", value: quote.priorityReason || "—" },
    { label: "Logs caméra", value: quote.hasCameraLogs ? `${quote.cameraRunCount || 0} session(s), ${quote.cameraLogCount || 0} logs` : "Aucun" }
  ];
  cards.forEach((entry) => {
    const cell = document.createElement("div");
    cell.className = "admin-quote__cell";
    const lbl = document.createElement("span");
    lbl.className = "admin-quote__label";
    lbl.textContent = entry.label;
    const val = document.createElement("div");
    val.className = "admin-quote__value";
    val.textContent = entry.value;
    cell.append(lbl, val);
    grid.appendChild(cell);
  });

  const partsLabel = document.createElement("span");
  partsLabel.className = "admin-quote__label";
  partsLabel.textContent = "Configuration";
  const partsList = document.createElement("ul");
  partsList.className = "admin-quote__list";
  const parts = Array.isArray(quote.partsSummary) ? quote.partsSummary : [];
  if (!parts.length) {
    const li = document.createElement("li");
    li.textContent = "Composants non disponibles.";
    partsList.appendChild(li);
  } else {
    parts.forEach((part) => {
      const li = document.createElement("li");
      li.textContent = part;
      partsList.appendChild(li);
    });
  }

  const actions = document.createElement("div");
  actions.className = "admin-quote__actions";

  const settleBtn = document.createElement("button");
  settleBtn.type = "button";
  settleBtn.className = "btn btn--ghost btn--tiny";
  settleBtn.dataset.adminAction = "toggle-status";
  settleBtn.dataset.code = String(quote.code || "");
  settleBtn.dataset.status = quote.status === "settled" ? "open" : "settled";
  settleBtn.textContent = quote.status === "settled" ? "Marquer ouvert" : "Réglé";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn--ghost btn--tiny";
  deleteBtn.dataset.adminAction = "delete";
  deleteBtn.dataset.code = String(quote.code || "");
  deleteBtn.textContent = "Supprimer";

  const testReceiptBtn = document.createElement("button");
  testReceiptBtn.type = "button";
  testReceiptBtn.className = "btn btn--ghost btn--tiny";
  testReceiptBtn.dataset.adminAction = "test-receipt";
  testReceiptBtn.dataset.code = String(quote.code || "");
  testReceiptBtn.dataset.email = String(quote.requesterEmail || "");
  testReceiptBtn.textContent = "Facture test";

  const viewCameraLogsBtn = document.createElement("button");
  viewCameraLogsBtn.type = "button";
  viewCameraLogsBtn.className = "btn btn--ghost btn--tiny";
  viewCameraLogsBtn.dataset.adminAction = "view-camera-logs";
  viewCameraLogsBtn.dataset.code = String(quote.code || "");
  viewCameraLogsBtn.textContent = "Voir logs";
  viewCameraLogsBtn.hidden = !quote.hasCameraLogs;

  const downloadCameraLogsBtn = document.createElement("button");
  downloadCameraLogsBtn.type = "button";
  downloadCameraLogsBtn.className = "btn btn--ghost btn--tiny";
  downloadCameraLogsBtn.dataset.adminAction = "download-camera-logs";
  downloadCameraLogsBtn.dataset.code = String(quote.code || "");
  downloadCameraLogsBtn.textContent = "Télécharger logs";
  downloadCameraLogsBtn.hidden = !quote.hasCameraLogs;

  actions.append(settleBtn, testReceiptBtn, viewCameraLogsBtn, downloadCameraLogsBtn, deleteBtn);
  body.append(grid, partsLabel, partsList);
  if (quote.hasCameraLogs) body.appendChild(renderAdminCameraRunsPanel(quote));
  body.appendChild(actions);
  details.append(summary, body);
  return details;
}

function renderAdminQuotesList(quotes) {
  if (!adminQuotesListEl) return;
  clearNode(adminQuotesListEl);

  if (!Array.isArray(quotes) || !quotes.length) {
    const empty = document.createElement("div");
    empty.className = "admin-quote__value";
    empty.textContent = "Aucun devis enregistré.";
    adminQuotesListEl.appendChild(empty);
    return;
  }

  const groups = [
    { key: "pc-custom", label: "Création PC sur mesure" },
    { key: "pc-repair", label: "Réparation PC" },
    { key: "mobile-repair", label: "Réparation mobile" }
  ];
  const grouped = new Map(groups.map((group) => [group.key, []]));
  quotes.forEach((quote) => {
    const key = normalizeAdminServiceType(quote?.serviceType);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(quote);
  });

  groups.forEach((group) => {
    const entries = grouped.get(group.key) || [];
    if (!entries.length) return;

    const section = document.createElement("section");
    section.className = "admin-quotes__group";

    const head = document.createElement("div");
    head.className = "admin-quotes__group-head";
    const title = document.createElement("h3");
    title.className = "admin-quotes__group-title";
    title.textContent = group.label;
    const count = document.createElement("span");
    count.className = "admin-quotes__group-count";
    count.textContent = `${entries.length} devis`;
    head.append(title, count);

    const list = document.createElement("div");
    list.className = "admin-quotes__group-list";
    entries.forEach((quote) => {
      list.appendChild(buildAdminQuoteCard(quote));
    });

    section.append(head, list);
    adminQuotesListEl.appendChild(section);
  });
}

async function refreshAdminQuotes({ silent = false } = {}) {
  if (!isAdmin || !adminSessionKey) {
    if (adminQuotesMetaEl) adminQuotesMetaEl.textContent = "Mode admin requis.";
    if (adminQuotesListEl) clearNode(adminQuotesListEl);
    return;
  }
  if (adminQuotesLoading) return;

  adminQuotesLoading = true;
  if (!silent) setAdminQuotesStatus("Chargement des devis...");
  try {
    const data = await apiFetchAdminQuotes(adminSessionKey);
    const quotes = Array.isArray(data?.quotes) ? data.quotes : [];
    window.AE_adminQuotes = quotes;
    try { window.dispatchEvent(new CustomEvent("ae-admin-quotes", { detail: { quotes } })); } catch {}
    renderAdminQuotesList(quotes);
    const openCount = Number(data?.stats?.open || 0);
    const settledCount = Number(data?.stats?.settled || 0);
    const pendingCount = Number(data?.stats?.pendingModification || 0);
    const customCount = quotes.filter((q) => normalizeAdminServiceType(q?.serviceType) === "pc-custom").length;
    const pcRepairCount = quotes.filter((q) => normalizeAdminServiceType(q?.serviceType) === "pc-repair").length;
    const mobileCount = quotes.filter((q) => normalizeAdminServiceType(q?.serviceType) === "mobile-repair").length;
    if (adminQuotesMetaEl) {
      adminQuotesMetaEl.textContent = `${quotes.length} devis • Création PC ${customCount} • Réparation PC ${pcRepairCount} • Mobile ${mobileCount} • ouverts ${openCount} • réglés ${settledCount} • OTP en attente ${pendingCount}`;
    }
    setAdminQuotesStatus(`Liste mise à jour (${quotes.length} devis).`, "good");
  } catch (err) {
    console.error(err);
    const msg = String(err?.message || "");
    if (adminQuotesMetaEl) adminQuotesMetaEl.textContent = "Chargement impossible.";
    if (msg === "ADMIN_NOT_CONFIGURED") {
      setAdminQuotesStatus("ADMIN_MODIFY_KEY absent côté serveur.", "bad");
    } else if (msg === "ADMIN_KEY_INVALID") {
      isAdmin = false;
      adminSessionKey = "";
      applyAdminUI();
      setAdminQuotesStatus("Session admin invalide. Réactive le mode admin.", "bad");
    } else {
      setAdminQuotesStatus("Erreur de lecture des devis.", "bad");
    }
  } finally {
    adminQuotesLoading = false;
  }
}

function bindCustomBuilder() {
  if (!formCustom) return;

  ensureComboInputs();
  ["watercooling", "customCables", "cableMgmt", "delivery"].forEach((key) => {
    const selectEl = document.getElementById(CATEGORY_CONFIG[key].selectId);
    if (selectEl) selectEl.value = "";
  });
  renderAllCategories();
  setOptionalDefaults();
  renderAllCategories();
  Object.keys(CATEGORY_CONFIG).forEach((key) => updateFilterInputFromSelection(key));
  bindCatalogFiltersOnce();
  refreshDependentPersonalizationOptions();
  normalizeBudgetControls("usage");
  setNoviceMode(false, { silent: true });

  [
    "cpu", "mobo", "ram", "gpu", "storage", "psu", "case",
    "watercooling", "customCables", "cableMgmt", "delivery"
  ].forEach((key) => {
    const selectEl = document.getElementById(CATEGORY_CONFIG[key].selectId);
    if (!selectEl) return;
    selectEl.addEventListener("change", async () => {
      const guardActive = !isApplyingPreset && (minimalPresetLocked || optimizedPresetLocked);
      const snapshot = minimalPresetLocked ? minimalPresetSnapshot : optimizedPresetLocked ? optimizedPresetSnapshot : {};
      const previous = snapshot[key] || "";
      const now = selectEl.value || "";

      // Budget warning only after user applied a preset AND only if a budget cap exists.
      const budgetCap = parseBudgetValue("budgetMax");
      if (guardActive && previous && now && now !== previous && budgetCap) {
        const stateAfter = compute();
        const totalAfter = Number(stateAfter?.total || 0);
        if (totalAfter > budgetCap) {
          const accepted = await themedConfirm(
            `Ce changement ferait dépasser ton budget (total: ${euro(totalAfter)} > budget: ${euro(budgetCap)}). Continuer ?`,
            {
              title: "Dépassement de budget",
              confirmText: "OK, je continue",
              cancelText: "Annuler"
            }
          );
          if (!accepted) {
            isApplyingPreset = true;
            try {
              selectEl.value = previous;
              updateFilterInputFromSelection(key);
              refreshDependentPersonalizationOptions();
              compute();
            } finally {
              isApplyingPreset = false;
            }
            return;
          }
        }
      }

      if (selectEl.value) clearUnknownComponent(key, true);
      updateFilterInputFromSelection(key);
      refreshDependentPersonalizationOptions();
      const state = compute();

      // Keep snapshots in sync when preset mode is active.
      if (!isApplyingPreset && (minimalPresetLocked || optimizedPresetLocked)) {
        if (minimalPresetLocked) minimalPresetSnapshot[key] = now;
        if (optimizedPresetLocked) optimizedPresetSnapshot[key] = now;
      }

      return state;
    });
  });

  const usageEl = document.getElementById("usage");
  if (usageEl) {
    usageEl.addEventListener("change", () => {
      if (minimalPresetLocked || optimizedPresetLocked) clearPresetGuards();
      refreshDependentPersonalizationOptions();
      normalizeBudgetControls("usage");
      compute();
    });
  }

  if (noviceModeToggleEl) {
    noviceModeToggleEl.addEventListener("click", () => {
      setNoviceMode(!isNoviceMode);
      toast(isNoviceMode ? "Mode non connaisseur active" : "Mode composants classique active");
    });
  }

  if (noviceBriefEl) {
    noviceBriefEl.addEventListener("input", () => {
      if (!isNoviceMode) return;
      compute();
    });
  }

  if (noviceAutoBuildBtn) {
    noviceAutoBuildBtn.addEventListener("click", () => {
      const brief = String(noviceBriefEl?.value || "").trim();
      if (!brief) {
        toast("Ajoute d'abord un brief de besoin.");
        noviceBriefEl?.focus();
        return;
      }

      const usageSelect = document.getElementById("usage");
      let usageValue = usageSelect?.value || "";
      const inferredUsage = inferUsageFromNoviceBrief(brief);
      if (inferredUsage && usageSelect) {
        usageSelect.value = inferredUsage;
        usageValue = inferredUsage;
      }
      if (!usageValue) {
        toast("Mode guide strict: indique clairement l'objectif (jeu 1080p, AAA 1440p, creation, etc.).");
        return;
      }

      const budgetFromBrief = inferBudgetFromNoviceBrief(brief);
      const existingBudgetMax = parseBudgetValue("budgetMax");
      const guideBudget = budgetFromBrief || existingBudgetMax;
      if (!guideBudget) {
        toast("Mode guide strict: ajoute un budget (ex: 800 euros).");
        return;
      }
      applyBudgetFromGuide(guideBudget);

      const mode = inferBuildModeFromNoviceBrief(brief);
      const forceMinimum = guideBudget <= 1400;
      normalizeBudgetControls("usage");
      const offer = (mode === "minimum" || forceMinimum)
        ? computeUsageMinimumOffer(usageValue)
        : computeUsageBalancedOffer(usageValue) || computeUsageMinimumOffer(usageValue);
      if (!offer) {
        toast("Impossible de generer une configuration automatiquement pour ce brief.");
        return;
      }

      const chosenMode = (mode === "minimum" || forceMinimum) ? "minimum" : "équilibrée";
      applyPresetToForm(offer, chosenMode);
      applyNoviceHintsAfterPreset(brief);

      if (guideBudget && offer.total > guideBudget) {
        toast(`Budget de ${euro(guideBudget)} trop bas: proposition minimale la plus proche appliquee (${euro(offer.total)}).`);
      }

      const baseDetails = String(quoteDetailsEl?.value || "").trim();
      const note = `Brief mode guide: ${brief}`;
      if (quoteDetailsEl) {
        quoteDetailsEl.value = baseDetails
          ? (baseDetails.includes(note) ? baseDetails : `${baseDetails}\n${note}`)
          : note;
      }
      compute();
      toast(`Configuration guidee ${chosenMode} appliquee.`);
    });
  }

  if (budgetMinEl) {
    budgetMinEl.addEventListener("input", () => {
      normalizeBudgetControls("min");
      compute();
    });
  }
  if (budgetMaxEl) {
    budgetMaxEl.addEventListener("input", () => {
      normalizeBudgetControls("max");
      compute();
    });
  }
  if (budgetMinRangeEl) {
    budgetMinRangeEl.addEventListener("input", () => {
      if (budgetMinEl) budgetMinEl.value = budgetMinRangeEl.value;
      normalizeBudgetControls("min");
      compute();
    });
  }
  if (budgetMaxRangeEl) {
    budgetMaxRangeEl.addEventListener("input", () => {
      if (budgetMaxEl) budgetMaxEl.value = budgetMaxRangeEl.value;
      normalizeBudgetControls("max");
      compute();
    });
  }

  const presetMinBtn = document.getElementById("presetMinConfig");
  if (presetMinBtn) {
    presetMinBtn.addEventListener("click", () => {
      const usageValue = document.getElementById("usage")?.value || "";
      if (!usageValue) {
        updateBudgetHint("", 0);
        toast("Sélectionne d'abord ton usage.");
        return;
      }

      normalizeBudgetControls("usage");
      const offer = computeUsageMinimumOffer(usageValue);
      if (!offer) {
        toast("Impossible de calculer une configuration minimum pour cet usage.");
        return;
      }
      if (parseBudgetValue("budgetMax") && parseBudgetValue("budgetMax") < offer.total) {
        toast(`Budget max trop bas : minimum usage estimé à ${euro(offer.total)}.`);
      }
      applyPresetToForm(offer, "minimum");
    });
  }

  const presetBalancedBtn = document.getElementById("presetBalancedConfig");
  if (presetBalancedBtn) {
    presetBalancedBtn.addEventListener("click", () => {
      const usageValue = document.getElementById("usage")?.value || "";
      if (!usageValue) {
        updateBudgetHint("", 0);
        toast("Sélectionne d'abord ton usage.");
        return;
      }

      normalizeBudgetControls("usage");
      const offer = computeUsageBalancedOffer(usageValue);
      if (!offer) {
        toast("Aucune configuration équilibrée trouvée avec le budget actuel.");
        return;
      }
      const budgetCap = parseBudgetValue("budgetMax");
      if (budgetCap && offer.total > budgetCap) {
        toast(`Budget max trop bas : config équilibrée viable à partir de ${euro(offer.total)}.`);
      }
      applyPresetToForm(offer, "équilibrée");
    });
  }

  const resetBtn = document.getElementById("resetCustom");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      formCustom.reset();
      Object.keys(UNKNOWN_COMPONENTS).forEach((key) => delete UNKNOWN_COMPONENTS[key]);
      currentQuoteCode = "";
      currentQuoteSignature = "";
      setQuoteCodeUI("", "Simulation réinitialisée.");
      if (contactQuoteCodeEl) contactQuoteCodeEl.value = "";
      closeAllComboMenus("");
      renderAllCategories();
      setOptionalDefaults();
      refreshDependentPersonalizationOptions();
      Object.keys(CATEGORY_CONFIG).forEach((key) => updateFilterInputFromSelection(key));
      clearPresetGuards();
      if (noviceBriefEl) noviceBriefEl.value = "";
      setNoviceMode(false, { silent: true });
      normalizeBudgetControls("usage");
      compute();
      toast("Simulation réinitialisée");
    });
  }

  const openPreviewBtn = document.getElementById("openPreview3d");
  if (openPreviewBtn) {
    openPreviewBtn.addEventListener("click", () => {
      const state = compute();
      if (!state.ready) {
        toast("Complète toute la configuration avant l'aperçu 3D.");
        setStatus("customStatus", "Aperçu 3D indisponible : complète d'abord tous les composants obligatoires.");
        return;
      }
      showView("preview");
      window.AE3D?.refreshFromLatest?.();
    });
  }

  const generateCodeBtn = document.getElementById("generateQuoteCode");
  if (generateCodeBtn) {
    generateCodeBtn.addEventListener("click", () => {
      const state = compute();
      if (!state.ready) {
        toast("Complète la simulation avant de générer le code devis");
        return;
      }
      const code = saveQuote(state);
      toast(`Code devis généré: ${code}`);
    });
  }

  const copyCodeBtn = document.getElementById("copyQuoteCode");
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", async () => {
      if (!currentQuoteCode) {
        toast("Génère d'abord un code devis");
        return;
      }
      try {
        await navigator.clipboard.writeText(currentQuoteCode);
        toast("Code devis copié");
      } catch {
        toast("Copie auto indisponible, copie manuelle nécessaire");
      }
    });
  }

  const loadCodeBtn = document.getElementById("loadQuoteCode");
  if (loadCodeBtn) {
    loadCodeBtn.addEventListener("click", async () => {
      const raw = String(quoteLookupEl?.value || "").trim();
      const consumed = await tryHandleAdminLookupCommand(raw, quoteLookupEl);
      if (consumed) return;
      const code = (quoteLookupEl?.value || "").trim().toUpperCase();
      if (!code) {
        toast("Entre un code devis");
        return;
      }
      const ok = await loadQuoteAny(code);
      if (!ok) {
        toast("Code devis introuvable");
        setStatus("customStatus", "Aucun devis ne correspond à ce code (local + base de données).");
        return;
      }
      setStatus("customStatus", `Devis ${code} rechargé.`);
      toast("Devis chargé.");
    });
  }

  if (adminRefreshQuotesBtn) {
    adminRefreshQuotesBtn.addEventListener("click", () => {
      if (!isAdmin || !adminSessionKey) {
        toast("Active d'abord le mode admin.");
        return;
      }
      void refreshAdminQuotes();
    });
  }

  if (openAdminQuotesViewBtn) {
    openAdminQuotesViewBtn.addEventListener("click", () => {
      if (!isAdmin) {
        toast("Active le mode admin.");
        return;
      }
      showView("admin");
    });
  }

  if (adminQuotesListEl) {
    adminQuotesListEl.addEventListener("click", async (event) => {
      const button = event.target instanceof HTMLElement ? event.target.closest("button[data-admin-action]") : null;
      if (!button) return;
      if (!isAdmin || !adminSessionKey) {
        toast("Mode admin requis.");
        return;
      }

      const action = button.dataset.adminAction || "";
      const code = String(button.dataset.code || "").trim().toUpperCase();
      if (!code) return;

      if (action === "toggle-status") {
        const targetStatus = String(button.dataset.status || "settled");
        const ok = await themedConfirm(
          targetStatus === "settled"
            ? `Marquer ${code} comme réglé ?`
            : `Remettre ${code} en statut ouvert ?`,
          {
            title: "Mise à jour devis",
            confirmText: "Valider",
            cancelText: "Annuler"
          }
        );
        if (!ok) return;
        try {
          await apiSetAdminQuoteStatus(code, targetStatus);
          setAdminQuotesStatus(`Statut ${code} mis à jour.`, "good");
          await refreshAdminQuotes({ silent: true });
        } catch (err) {
          console.error(err);
          setAdminQuotesStatus(`Échec de mise à jour pour ${code}.`, "bad");
        }
        return;
      }

      if (action === "delete") {
        const ok = await themedConfirm(
          `Supprimer définitivement ${code} (devis + demande OTP associée) ?`,
          {
            title: "Suppression devis",
            confirmText: "Supprimer",
            cancelText: "Annuler"
          }
        );
        if (!ok) return;
        try {
          await apiDeleteAdminQuote(code);
          setAdminQuotesStatus(`Devis ${code} supprimé.`, "good");
          await refreshAdminQuotes({ silent: true });
        } catch (err) {
          console.error(err);
          setAdminQuotesStatus(`Impossible de supprimer ${code}.`, "bad");
        }
      }

      if (action === "view-camera-logs") {
        await openOrDownloadCameraLogsForQuote(code, false);
        return;
      }

      if (action === "download-camera-logs") {
        await openOrDownloadCameraLogsForQuote(code, true);
        return;
      }

      if (action === "view-camera-log-run") {
        const runId = String(button.dataset.runId || "").trim();
        await openOrDownloadCameraLogsForQuote(code, false, runId);
        return;
      }

      if (action === "download-camera-log-run") {
        const runId = String(button.dataset.runId || "").trim();
        await openOrDownloadCameraLogsForQuote(code, true, runId);
        return;
      }

      if (action === "delete-camera-log-run") {
        const runId = String(button.dataset.runId || "").trim();
        if (!runId) {
          toast("runId manquant.");
          return;
        }
        const ok = await themedConfirm(
          `Supprimer ce log caméra (${runId}) pour ${code} ?`,
          {
            title: "Suppression log caméra",
            confirmText: "Supprimer",
            cancelText: "Annuler"
          }
        );
        if (!ok) return;
        try {
          await apiDeleteCameraLogRun(code, runId, false);
          setAdminQuotesStatus(`Log caméra ${runId} supprimé pour ${code}.`, "good");
          await refreshAdminQuotes({ silent: true });
        } catch (err) {
          console.error(err);
          setAdminQuotesStatus(`Impossible de supprimer le log ${runId}.`, "bad");
        }
        return;
      }

      if (action === "delete-camera-runs-all") {
        const ok = await themedConfirm(
          `Supprimer tous les logs caméra du devis ${code} ?`,
          {
            title: "Suppression logs caméra",
            confirmText: "Supprimer tout",
            cancelText: "Annuler"
          }
        );
        if (!ok) return;
        try {
          await apiDeleteCameraLogRun(code, "", true);
          setAdminQuotesStatus(`Tous les logs caméra ont été supprimés pour ${code}.`, "good");
          await refreshAdminQuotes({ silent: true });
        } catch (err) {
          console.error(err);
          setAdminQuotesStatus(`Impossible de supprimer les logs caméra de ${code}.`, "bad");
        }
        return;
      }

      if (action === "test-receipt") {
        const suggestedEmail = String(button.dataset.email || "").trim().toLowerCase();
        await runTestReceiptFlow({ code, suggestedEmail });
      }

    });
  }

  if (sendTestReceiptBtn) {
    sendTestReceiptBtn.addEventListener("click", async () => {
      const code = activeQuoteCode();

      const loaded = await getQuoteRecordByCode(code);
      const suggestedEmail = String(
        quoteEmailEl?.value ||
        loaded?.requester?.email ||
        ""
      ).trim().toLowerCase();
      await runTestReceiptFlow({ code, suggestedEmail });
    });
  }

  if (clientGetModifyBtn) {
    clientGetModifyBtn.addEventListener("click", async () => {
      const code = activeQuoteCode();
      if (!code) {
        toast("Charge d'abord un devis pour demander un code modification.");
        return;
      }

      const context = await buildModifyContext(code);
      if (!context?.baseRecord) {
        toast("Code devis introuvable.");
        return;
      }
      if (!context.state?.ready || !context.targetRecord) {
        toast("Configuration incomplète : impossible de générer le lot de modifications.");
        return;
      }
      if (!context.changes.length) {
        toast("Aucune modification détectée par rapport au devis actuel.");
        setStatus("customStatus", "Modifie un ou plusieurs champs puis redemande un code OTP.");
        return;
      }

      const requesterEmail = String(quoteEmailEl?.value || context.baseRecord?.requester?.email || "").trim().toLowerCase();
      if (!requesterEmail) {
        toast("Email client requis pour demander un code OTP.");
        return;
      }

      const requesterName = String(quoteNameEl?.value || context.baseRecord?.requester?.name || "").trim();

      try {
        const data = await apiRequestModify({
          code,
          email: requesterEmail,
          requester: { name: requesterName, email: requesterEmail },
          changes: context.changes,
          requestedRecord: context.targetRecord
        });
        const otp = String(data?.otp || "").trim();
        const expiresAt = data?.expiresAt || "";
        const expiresText = expiresAt ? new Date(expiresAt).toLocaleString("fr-FR") : "dans 24h";
        const summary = modificationBatchText(context.changes);
        const transferText = `Code devis: ${code}\nCode OTP: ${otp}\nExpire le: ${expiresText}\nModifications: ${summary}`;
        try {
          await navigator.clipboard.writeText(transferText);
        } catch {}

        setStatus("customStatus", `Code OTP ${otp} généré. Expiration le ${expiresText}. Détails copiés, envoie-les à l'atelier.`);
        toast(`Code OTP généré: ${otp}`);
      } catch (err) {
        console.error(err);
        const msg = String(err?.message || "");
        if (msg === "EMAIL_MISMATCH") {
          toast("L'email saisi ne correspond pas au devis.");
          setStatus("customStatus", "L'email doit être le même que celui utilisé lors du devis.");
          return;
        }
        toast("Erreur lors de la demande de modification.");
      }
    });
  }

  if (requestModifyBtn) {
    requestModifyBtn.addEventListener("click", async () => {
      if (!isAdmin) {
        toast("Action réservée au mode admin.");
        return;
      }

      const code = activeQuoteCode();
      if (!code) {
        toast("Charge d'abord un devis.");
        return;
      }

      try {
        if (!adminSessionKey) {
          toast("Mode admin non authentifie.");
          return;
        }
        const pending = await apiReadModifyPending(code, adminSessionKey);
        const expiresText = pending?.expiresAt ? new Date(pending.expiresAt).toLocaleString("fr-FR") : "dans 24h";
        const changeText = Array.isArray(pending?.changes) && pending.changes.length
          ? modificationBatchText(pending.changes)
          : "Aucun détail";
        setStatus("customStatus", `Demande en attente: OTP ${pending.otp || "******"} (exp. ${expiresText}) — ${changeText}`);
        toast("Demande de modification déjà en attente.");
        return;
      } catch (err) {
        if (String(err?.message || "") !== "NO_PENDING_MODIFICATION") {
          console.error(err);
          toast("Impossible de lire la demande en attente.");
          return;
        }
      }

      const context = await buildModifyContext(code);
      if (!context?.baseRecord || !context.state?.ready || !context.targetRecord) {
        toast("Charge un devis valide avant de créer une demande.");
        return;
      }
      if (!context.changes.length) {
        toast("Aucune modification détectée à envoyer.");
        return;
      }

      try {
        const data = await apiRequestModify({
          code,
          adminSecret: adminSessionKey,
          forceRegenerate: true,
          requester: {
            name: String(quoteNameEl?.value || context.baseRecord?.requester?.name || "").trim(),
            email: String(quoteEmailEl?.value || context.baseRecord?.requester?.email || "").trim().toLowerCase()
          },
          changes: context.changes,
          requestedRecord: context.targetRecord
        });
        const expiresText = data?.expiresAt ? new Date(data.expiresAt).toLocaleString("fr-FR") : "dans 24h";
        setStatus("customStatus", `OTP admin ${data.otp} généré (exp. ${expiresText}).`);
        toast(`OTP admin généré: ${data.otp}`);
      } catch (err) {
        console.error(err);
        const msg = String(err?.message || "");
        if (msg === "ADMIN_KEY_INVALID" || msg === "ADMIN_NOT_CONFIGURED") {
          isAdmin = false;
          adminSessionKey = "";
          applyAdminUI();
          toast(msg === "ADMIN_NOT_CONFIGURED" ? "Admin non configure sur le serveur." : "Session admin invalide.");
          return;
        }
        toast("Erreur lors de la génération OTP admin.");
      }
    });
  }

  if (confirmModifyBtn) {
    confirmModifyBtn.addEventListener("click", async () => {
      if (!isAdmin) {
        toast("Action réservée au mode admin.");
        return;
      }
      if (!adminSessionKey) {
        toast("Mode admin non authentifie.");
        return;
      }

      const code = activeQuoteCode();
      if (!code) {
        toast("Charge d'abord un devis.");
        return;
      }

      const otp = await themedPrompt("Entre le code OTP client (valable 24h).", {
        title: "Confirmer modification",
        confirmText: "Valider OTP",
        cancelText: "Annuler",
        placeholder: "Ex: 123456",
        inputType: "tel"
      });
      if (!otp) return;

      const context = await buildModifyContext(code);
      if (!context?.baseRecord) {
        toast("Code devis introuvable.");
        return;
      }

      const note = await themedPrompt("Note admin (optionnelle) pour l'historique de la modification :", {
        title: "Note atelier",
        confirmText: "Continuer",
        cancelText: "Sans note",
        placeholder: "Ex: validé après appel client",
        value: ""
      });

      try {
        const payload = {
          code,
          otp,
          adminSecret: adminSessionKey,
          adminNote: note || "",
          recordUpdated: context?.targetRecord || undefined
        };
        await apiConfirmModify(payload);

        const remote = await fetchQuoteFromDatabase(code);
        if (remote) {
          const store = readQuoteStore();
          store[code] = remote;
          writeQuoteStore(store);
        }
        await loadQuoteAny(code);
        setStatus("customStatus", `Modification validée pour ${code}.`);
        toast("Modification confirmée.");
      } catch (err) {
        console.error(err);
        const msg = String(err?.message || "");
        if (msg === "ADMIN_KEY_INVALID" || msg === "ADMIN_NOT_CONFIGURED") {
          isAdmin = false;
          adminSessionKey = "";
          applyAdminUI();
          toast(msg === "ADMIN_NOT_CONFIGURED" ? "Admin non configure sur le serveur." : "Session admin invalide.");
          return;
        }
        if (msg === "OTP_INVALID") {
          toast("OTP invalide.");
          return;
        }
        if (msg === "OTP_EXPIRED_OR_MISSING") {
          toast("OTP expiré ou absent.");
          return;
        }
        toast("Erreur lors de la confirmation.");
      }
    });
  }

  formCustom.addEventListener("submit", async (e) => {
    e.preventDefault();
    const state = compute();

    if (!state.ready) {
      toast("Complète la configuration avant l'envoi");
      return;
    }

    const fromName = quoteNameEl?.value?.trim();
    const replyTo = quoteEmailEl?.value?.trim();
    if (!fromName || !replyTo) {
      toast("Nom et email requis");
      setStatus("customStatus", "Renseigne nom et email pour envoyer le devis.");
      return;
    }

    const code = saveQuote(state);
    const preview3D = await collect3DQuoteArtifacts();

    const message = [
      "type : devis_pc_sur_mesure",
      `code_devis : ${code}`,
      `nom : ${fromName}`,
      `email : ${replyTo}`,
      `usage : ${state.selection.usage}`,
      `mode_guide : ${state.selection.noviceMode ? "active" : "inactif"}`,
      `brief_mode_guide : ${(state.selection.noviceBrief || "").trim() || "non renseigne"}`,
      `budget_min : ${state.selection.budgetMin ? euro(state.selection.budgetMin) : "non renseigne"}`,
      `budget_max : ${state.selection.budgetMax ? euro(state.selection.budgetMax) : "non renseigne"}`,
      `minimum_usage_recommande : ${state.selection.usageMinimum ? euro(state.selection.usageMinimum) : "non calcule"}`,
      `cpu : ${state.selection.cpu.brand} ${state.selection.cpu.name}`,
      `carte_mere : ${state.selection.mobo.brand} ${state.selection.mobo.name}`,
      `ram : ${state.selection.ram.brand} ${state.selection.ram.name}`,
      `gpu : ${state.selection.gpu.brand} ${state.selection.gpu.name}`,
      `stockage : ${state.selection.storage.brand} ${state.selection.storage.name}`,
      `alimentation : ${state.selection.psu.brand} ${state.selection.psu.name}`,
      `boitier : ${state.selection.case.brand} ${state.selection.case.name}`,
      `watercooling : ${state.selection.cooling.brand} ${state.selection.cooling.name}`,
      `cable_custom : ${(state.selection.customCable.category || state.selection.customCable.brand)} ${state.selection.customCable.name}`,
      `cable_management : ${state.selection.cableMgmt.brand} ${state.selection.cableMgmt.name}`,
      `brief_technique : ${(quoteDetailsEl?.value || "").trim() || "non renseigne"}`,
      `traitement_atelier : ${state.selection.delivery.name} (${state.selection.delivery.prepWindow || "delai variable"})`,
      `goulot_etranglement : ${state.bottleneck?.message || "non calcule"}`,
      `prix_estime : ${euro(state.total)}${state.customCoolingPending ? " (+ custom loop sur devis)" : ""}`,
      `apercu_3d_json : ${preview3D.sceneJson || "indisponible"}`,
      `apercu_3d_image_data_url : ${preview3D.imageDataUrl || "indisponible"}`,
      `alertes : ${state.warnings.length ? state.warnings.join(" | ") : "aucune"}`,
      `suggestions : ${state.suggestions.length ? state.suggestions.join(" | ") : "aucune"}`
    ].join("\n");

    const ok = await sendEmail({
      subject: `Demande devis — PC sur mesure (${code})`,
      from_name: fromName,
      reply_to: replyTo,
      message,
      statusElId: "customStatus"
    });

    if (ok) {
      setStatus("customStatus", `Devis envoyé. Code: ${code}`);
      toast(`Devis envoyé (${code})`);
    }
  });

  const buyNowBtn = document.getElementById("buyNow");

  const setCheckoutButtonsIdle = () => {
    if (buyNowBtn) {
      buyNowBtn.disabled = false;
      buyNowBtn.textContent = "Acheter maintenant";
    }
    if (buyNowSandboxBtn) {
      buyNowSandboxBtn.hidden = !isAdmin;
      buyNowSandboxBtn.disabled = !isAdmin;
      buyNowSandboxBtn.textContent = "Simuler paiement (sandbox)";
    }
  };

  const setCheckoutButtonsBusy = (mode = "live") => {
    if (buyNowBtn) buyNowBtn.disabled = true;
    if (buyNowSandboxBtn) buyNowSandboxBtn.disabled = true;
    if (mode === "sandbox") {
      if (buyNowSandboxBtn) buyNowSandboxBtn.textContent = "Redirection vers PayPal Sandbox…";
    } else {
      if (buyNowBtn) buyNowBtn.textContent = "Redirection vers PayPal…";
    }
  };

  async function launchPayPalCheckout(mode = "live") {
    if (mode === "sandbox" && !isAdmin) {
      toast("Simulation sandbox réservée au mode admin.");
      return;
    }
    const state = compute();
    if (!state.ready) {
      toast("Complète la configuration avant d'acheter");
      return;
    }

    if (!state.canCheckout) {
      toast("Corrige d'abord les incompatibilités bloquantes");
      setStatus("customStatus", "Achat bloqué: incompatibilités détectées.");
      return;
    }

    if (state.customCoolingPending) {
      toast("Boucle custom sur devis: achat direct indisponible pour cette option");
      setStatus("customStatus", "Passe par le devis pour valider un watercooling 100% custom.");
      return;
    }

    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      toast("Mode local: paiement PayPal indisponible sans backend Vercel");
      setStatus("customStatus", "En local, utilise " + "Envoyer mon devis" + " (EmailJS fonctionne). Paiement actif en prod.");
      return;
    }

    const code = saveQuote(state);
    const summary = {
      cpu: `${state.selection.cpu.brand} ${state.selection.cpu.name}`,
      gpu: `${state.selection.gpu.brand} ${state.selection.gpu.name}`,
      ram: `${state.selection.ram.brand} ${state.selection.ram.name}`,
      quoteCode: code
    };

    try {
      setCheckoutButtonsBusy(mode);

      const res = await fetch("/api/paypal-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: state.total, currency: "EUR", summary, paypalMode: mode })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.approveUrl) {
        const errorCode = String(data?.error || "");
        if (errorCode === "PAYPAL_SANDBOX_DISABLED") {
          toast("Sandbox PayPal désactivée côté serveur.");
          setStatus("customStatus", "Simulation indisponible: active PAYPAL_SANDBOX_ENABLED=1.");
        } else if (errorCode === "PAYPAL_SANDBOX_MISSING_CREDENTIALS") {
          toast("Clés PayPal sandbox manquantes.");
          setStatus("customStatus", "Simulation indisponible: ajoute PAYPAL_SANDBOX_CLIENT_ID et PAYPAL_SANDBOX_CLIENT_SECRET.");
        } else if (errorCode === "PAYPAL_LIVE_MISSING_CREDENTIALS") {
          toast("Clés PayPal live manquantes.");
          setStatus("customStatus", "Achat indisponible: vérifie PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET.");
        } else {
          toast("Erreur PayPal");
          setStatus("customStatus", `Paiement refusé côté API: ${errorCode || "PAYPAL_ORDER_CREATE_FAILED"}.`);
        }
        console.error(data);
        setCheckoutButtonsIdle();
        return;
      }

      window.location.href = data.approveUrl;
    } catch (err) {
      console.error(err);
      toast("Erreur réseau");
      setCheckoutButtonsIdle();
    }
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => launchPayPalCheckout("live"));
  }
  if (buyNowSandboxBtn) {
    buyNowSandboxBtn.addEventListener("click", () => launchPayPalCheckout("sandbox"));
  }

  setQuoteCodeUI("", "Génère un code pour retrouver ta simulation plus tard.");
  compute();
}

initThemeCustomizer();
bindCustomBuilder();
bindPcRepairFormFlow();
bindMobileFormFlow();
window.addEventListener("pagehide", () => {
  stopMobileCameraStream();
});
window.addEventListener("beforeunload", () => {
  stopMobileCameraStream();
});

(function tiltCards() {
  const cards = $$(".tilt");
  const strength = 10;
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-y * strength).toFixed(2);
      const ry = (x * strength).toFixed(2);
      card.style.transform = `translateY(-5px) scale(1.01) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
