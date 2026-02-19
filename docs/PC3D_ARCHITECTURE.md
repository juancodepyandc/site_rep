# Architecture 3D configurateur (Atelier Electronique)

## 1) Architecture proposee

- **UI existante**: `/Users/rabuteaujuandavid/Desktop/page_web/index.html` (formulaire custom + actions deja en place).
- **Moteur 3D**: `/Users/rabuteaujuandavid/Desktop/page_web/pc3d-viewer.js` (Three.js + OrbitControls).
- **Contraintes dimensionnelles**: `/Users/rabuteaujuandavid/Desktop/page_web/assets/pc3d-constraints.json`.
- **Sync applicative**: `/Users/rabuteaujuandavid/Desktop/page_web/script.js` diffuse l'etat via `ae:config-state`.
- **Sorties devis**:
  - screenshot JPEG (base64 court) via `window.AE3D.captureSnapshot()`
  - JSON scene via `window.AE3D.exportSerializableState()`
  - injection dans le message EmailJS au submit deja existant.

Pipeline modeles:
- Composants connus: proxies dimensionnels en mm (boites parametriques).
- Evolution cible: GLB par composant + Draco + LOD, avec fallback proxy auto.

## 2) Algorithme de placement automatique

Pseudo-code:

```text
state <- compute() existant
if state.selection incomplet: afficher overlay 3D et stop

profileCase <- merge(defaultCase, caseSpecifique, donnees selection)
dims <- deriveDimensions(selection)

placer case (volume interne)
placer carte mere sur anchor tray
placer gpu sur anchor PCIe (longueur/epaisseur depuis dataset)
placer psu bas/arriere selon anchor
placer ram, storage sur zones plausibles

if cooling.type in [aio, custom]:
  mount <- top si supporte sinon front
  si mount absent -> conflit dur
  sinon placer radiateur + reserve ports tuyaux

executer checks:
  collisions paires critiques
  sortie de volume boitier
  limites maxGpu/maxRad

publier warnings + bloquer geometries invalides
```

## 3) Systeme de contraintes (dures)

- **Collisions**: `Box3.intersectsBox` sur paires critiques (GPU/radiateur, PSU/GPU, etc.).
- **Encombrement**:
  - `gpu.length <= case.maxGpu`
  - `radiator.size <= case.maxRad`
  - validation volume interne (component box dans case box).
- **Snapping**:
  - anchors fixes par type (`moboAnchor`, `gpuPcieAnchor`, `psuAnchor`, mounts radiateur).
- **Blocage action impossible**:
  - au lieu d'accepter une valeur absurde, rollback au dernier etat valide
  - message explicite dans UI 3D (`Action bloquee: ...`).

## 4) Tuyaux/cables (splines)

- Generation via `CatmullRomCurve3(start, c1, c2, end)`.
- Controle utilisateur via sliders X/Y/Z (courbure).
- Validation:
  - longueur max tuyau
  - rayon mini de courbure (circumradius sur triplets de points)
  - intersections avec volumes interdits et composants
- Si invalide:
  - restauration des derniers offsets valides
  - message d'erreur lisible.

## 5) Plan performance mobile

- Pixel ratio cappe (`<= 2`) + antialias desactive.
- Geometries simples (proxies) et materials legers.
- Draw calls limites (groupes reutilises, scene rebuild controlee).
- ResizeObserver + viewport borne.
- Capture screenshot en resolution reduite (480x270).
- Cible roadmap:
  - LOD par composant
  - Draco pour GLB
  - atlas textures / bake
  - fallback automatique low-end (boxes only).

## 6) Schema JSON minimal (extrait)

```json
{
  "case": { "id": "case-corsair-5000d", "maxGpuLength": 420, "maxRadiator": 360 },
  "motherboard": { "id": "mb-msi-b650-tom", "formFactor": "ATX", "socket": "AM5" },
  "gpu": { "id": "gpu-nv-5070ti", "length": 330, "height": 135, "thickness": 62 },
  "radiator": { "id": "cool-aio-360-arctic-rgb", "size": 360, "mount": "top", "thicknessTotal": 53 },
  "tubeSpline": {
    "start": [-40, 60, -20],
    "control1": [-10, 95, 10],
    "control2": [70, 85, 25],
    "end": [130, 100, 40],
    "minBendRadius": 30,
    "maxLength": 900
  }
}
```

## 7) Liaison temps reel sans nouveau bouton

- Le compute existant publie `window.dispatchEvent(new CustomEvent("ae:config-state", {detail: state}))`.
- Le viewer 3D ecoute cet event et reconstruit la scene automatiquement.
- `showView("custom")` force un `AE3D.resize()` + `AE3D.refreshFromLatest()` pour eviter les artefacts de canvas cache.
- Le submit existant du devis appelle:
  - `collect3DQuoteArtifacts()`
  - joint screenshot + JSON dans le message EmailJS.

