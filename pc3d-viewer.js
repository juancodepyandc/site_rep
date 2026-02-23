import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const MM_TO_UNIT = 0.01;
const mm = (value) => Number(value || 0) * MM_TO_UNIT;

const canvasEl = document.getElementById("pc3dCanvas");
const overlayEl = document.getElementById("pc3dOverlay");
const warningsEl = document.getElementById("pc3dWarnings");
const listEl = document.getElementById("pc3dConfigList");
const drawerEl = document.getElementById("pc3dDrawer");
const layoutEl = document.getElementById("pc3dLayout");
const drawerToggleEl = document.getElementById("pc3dDrawerToggle");
const drawerToggleLabelEl = document.getElementById("pc3dDrawerToggleLabel");
const sideToggleEl = document.getElementById("pc3dSideToggle");
const lightToggleEl = document.getElementById("pc3dLightToggle");
const casePanelToggleEl = document.getElementById("pc3dCasePanelToggle");
const curveStatusEl = document.getElementById("pc3dCurveStatus");
const tubeCtrlXEl = document.getElementById("tubeCtrlX");
const tubeCtrlYEl = document.getElementById("tubeCtrlY");
const tubeCtrlZEl = document.getElementById("tubeCtrlZ");
const tubeBlockEl = document.getElementById("pc3dTubeBlock");
const DRACO_PATH = "./node_modules/three/examples/jsm/libs/draco/";
const KTX2_PATH = "./node_modules/three/examples/jsm/libs/basis/";
const MODELS_MANIFEST = "assets/pc3d-models.json";

let constraintsData = null;

function disposeHierarchy(node) {
  if (!node) return;
  node.traverse((child) => {
    if (child.geometry) child.geometry.dispose?.();
    if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose?.());
    else child.material?.dispose?.();
  });
}

async function loadConstraints() {
  try {
    const res = await fetch("assets/pc3d-constraints.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    constraintsData = await res.json();
  } catch {
    constraintsData = {
      defaults: {
        case: {
          inner: { length: 450, width: 220, height: 470 },
          moboAnchor: { x: -170, y: 12, z: -70 },
          gpuPcieAnchor: { x: -20, y: -15, z: 8 },
          psuAnchor: { x: 150, y: -180, z: 40 },
          radiatorMounts: { top: [240, 280, 360], front: [240, 280, 360], rear: [120] },
          forbiddenVolumes: []
        },
        motherboard: {
          ATX: { length: 305, width: 244, thickness: 24 },
          mATX: { length: 244, width: 244, thickness: 24 },
          ITX: { length: 170, width: 170, thickness: 24 }
        },
        gpu: { height: 130, thickness: 58 },
        psu: { width: 150, height: 86, lengthMin: 140, lengthMax: 220 },
        radiator: { height: 140, thicknessCore: 28, fanThickness: 25 },
        tube: { radius: 6, minBendRadius: 30, maxLength: 900 }
      },
      cases: {}
    };
  }
}

class PC3DViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.latestState = null;
    this.placements = {};
    this.conflicts = [];
    this.lastValidTubeOffsets = { x: 0, y: 20, z: 0 };
    this.lightMode = "clear";
    this.casePanelOpen = false;
    this.casePanelLerp = 0;
    this.caseDoor = null;
    this.caseDoorGlass = null;
    this.caseDoorSolid = null;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
    this.camera.position.set(4.6, 3.2, 5.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(640, 420, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    this.modelManifest = { models: {} };
    this.modelCache = new Map();
    this.renderVersion = 0;

    this.loaderManager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader(this.loaderManager);
    this.objLoader = new OBJLoader(this.loaderManager);
    this.fbxLoader = new FBXLoader(this.loaderManager);
    this.dracoLoader = new DRACOLoader(this.loaderManager);
    this.dracoLoader.setDecoderPath(DRACO_PATH);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.ktx2Loader = new KTX2Loader(this.loaderManager);
    this.ktx2Loader.setTranscoderPath(KTX2_PATH);
    this.ktx2Loader.detectSupport(this.renderer);
    this.gltfLoader.setKTX2Loader(this.ktx2Loader);
    this.loadModelManifest();

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
    pmrem.dispose();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 16;
    this.controls.enablePan = true;
    this.controls.panSpeed = 1.1;
    this.controls.zoomSpeed = 1.05;
    this.controls.keys = {
      LEFT: "KeyA",
      UP: "KeyW",
      RIGHT: "KeyD",
      BOTTOM: "KeyS"
    };
    canvasEl.setAttribute("tabindex", "0");
    canvasEl.addEventListener("pointerdown", () => canvasEl.focus(), { passive: true });
    this.controls.listenToKeyEvents(canvasEl);
    this.controls.target.set(0, 0.4, 0);

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.componentGroup = new THREE.Group();
    this.tubeGroup = new THREE.Group();
    this.cableGroup = new THREE.Group();
    this.root.add(this.componentGroup);
    this.root.add(this.tubeGroup);
    this.root.add(this.cableGroup);

    this.hemiLight = new THREE.HemisphereLight(0xd3efff, 0x161e2a, 1.2);
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.05);
    this.keyLight.position.set(5, 7, 4);
    this.fillLight = new THREE.DirectionalLight(0x8fd8ff, 0.45);
    this.fillLight.position.set(-4, 2.5, -5);
    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.42);
    this.rimLight.position.set(-5, 4.5, 5);
    this.ambientLight = new THREE.AmbientLight(0x9cb8d8, 0.22);
    this.scene.add(this.hemiLight, this.keyLight, this.fillLight, this.rimLight, this.ambientLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 18),
      new THREE.MeshStandardMaterial({ color: 0x1d2b3e, transparent: true, opacity: 0.18, roughness: 0.9, metalness: 0.06 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.35;
    this.scene.add(floor);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas.parentElement || this.canvas);
    this.resize();

    this.bindUI();
    this.applyLightingMode(this.lightMode);
    this.startRenderLoop();
  }

  async loadModelManifest() {
    try {
      const res = await fetch(MODELS_MANIFEST, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.modelManifest = data && typeof data === "object" ? data : { models: {} };
    } catch {
      this.modelManifest = { models: {} };
    }
  }

  bindUI() {
    if (drawerToggleEl && drawerEl) {
      const initialCollapsed = drawerEl.classList.contains("is-collapsed");
      drawerToggleEl.setAttribute("aria-expanded", initialCollapsed ? "false" : "true");
      if (drawerToggleLabelEl) {
        drawerToggleLabelEl.textContent = initialCollapsed ? "Afficher panneau" : "Masquer panneau";
      }
      drawerToggleEl.addEventListener("click", () => {
        const collapsed = drawerEl.classList.toggle("is-collapsed");
        drawerToggleEl.setAttribute("aria-expanded", collapsed ? "false" : "true");
        if (drawerToggleLabelEl) {
          drawerToggleLabelEl.textContent = collapsed ? "Afficher panneau" : "Masquer panneau";
        }
      });
    }

    if (sideToggleEl && layoutEl) {
      const initialLeft = layoutEl.classList.contains("is-left");
      sideToggleEl.textContent = initialLeft ? "Panneau droite" : "Panneau gauche";
      sideToggleEl.addEventListener("click", () => {
        const left = layoutEl.classList.toggle("is-left");
        sideToggleEl.textContent = left ? "Panneau droite" : "Panneau gauche";
      });
    }

    if (lightToggleEl) {
      lightToggleEl.textContent = this.lightMode === "clear" ? "Éclairage sombre" : "Éclairage clair";
      lightToggleEl.addEventListener("click", () => {
        this.lightMode = this.lightMode === "clear" ? "dark" : "clear";
        this.applyLightingMode(this.lightMode);
        lightToggleEl.textContent = this.lightMode === "clear" ? "Éclairage sombre" : "Éclairage clair";
      });
    }

    if (casePanelToggleEl) {
      this.updateCasePanelToggleLabel();
      casePanelToggleEl.addEventListener("click", () => {
        this.casePanelOpen = !this.casePanelOpen;
        this.updateCasePanelToggleLabel();
      });
    }

    const sliderHandler = () => {
      if (!this.latestState?.selection) return;
      this.tryBuildTubes(this.latestState.selection);
    };

    [tubeCtrlXEl, tubeCtrlYEl, tubeCtrlZEl].forEach((el) => {
      if (!el) return;
      el.addEventListener("input", sliderHandler);
    });
  }

  applyLightingMode(mode = "clear") {
    if (!this.hemiLight || !this.keyLight || !this.fillLight || !this.rimLight || !this.ambientLight) return;
    const dark = mode === "dark";
    this.hemiLight.intensity = dark ? 0.95 : 1.52;
    this.keyLight.intensity = dark ? 0.86 : 1.56;
    this.fillLight.intensity = dark ? 0.35 : 0.88;
    this.rimLight.intensity = dark ? 0.22 : 0.68;
    this.ambientLight.intensity = dark ? 0.16 : 0.42;
    this.renderer.toneMappingExposure = dark ? 1.0 : 1.24;
  }

  updateCasePanelToggleLabel() {
    if (!casePanelToggleEl) return;
    casePanelToggleEl.textContent = this.casePanelOpen ? "Panneau boîtier: ouvert" : "Panneau boîtier: fermé";
  }

  captureCaseDoorRefs() {
    this.caseDoor = null;
    this.caseDoorGlass = null;
    this.caseDoorSolid = null;

    const caseMesh = this.placements.case?.mesh;
    if (!caseMesh) return;

    caseMesh.traverse((child) => {
      if (child.userData?.aeCaseDoor) this.caseDoor = child;
      if (child.userData?.aeDoorGlass) this.caseDoorGlass = child;
      if (child.userData?.aeDoorSolid) this.caseDoorSolid = child;
    });

    this.casePanelLerp = this.casePanelOpen ? 1 : 0;
    this.applyCasePanelPose(true);
  }

  applyCasePanelPose(force = false) {
    if (!this.caseDoor?.userData) return;
    const target = this.casePanelOpen ? 1 : 0;
    const speed = force ? 1 : 0.16;
    this.casePanelLerp += (target - this.casePanelLerp) * speed;
    if (Math.abs(target - this.casePanelLerp) < 0.001) this.casePanelLerp = target;

    const closedPos = this.caseDoor.userData.closedPos;
    const openPos = this.caseDoor.userData.openPos;
    if (closedPos && openPos) {
      this.caseDoor.position.copy(closedPos.clone().lerp(openPos, this.casePanelLerp));
    }

    const closedRotY = Number(this.caseDoor.userData.closedRotY || 0);
    const openRotY = Number(this.caseDoor.userData.openRotY || 0);
    this.caseDoor.rotation.y = THREE.MathUtils.lerp(closedRotY, openRotY, this.casePanelLerp);

    if (this.caseDoorGlass?.material) {
      const mat = this.caseDoorGlass.material;
      mat.transparent = true;
      mat.opacity = THREE.MathUtils.lerp(0.2, 0.1, this.casePanelLerp);
      mat.needsUpdate = true;
    }
    if (this.caseDoorSolid?.material) {
      const mat = this.caseDoorSolid.material;
      mat.transparent = true;
      mat.opacity = THREE.MathUtils.lerp(0.86, 0, this.casePanelLerp);
      this.caseDoorSolid.visible = mat.opacity > 0.01;
      mat.needsUpdate = true;
    }
  }

  resize() {
    const host = this.canvas.parentElement || this.canvas;
    const width = Math.max(320, Math.floor(host.clientWidth || 640));
    const height = Math.max(260, Math.floor(host.clientHeight || 420));
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  startRenderLoop() {
    const tick = () => {
      this.controls.update();
      this.applyCasePanelPose();
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(tick);
    };
    tick();
  }

  inferMoboFormFactor(mobo) {
    const name = `${mobo?.brand || ""} ${mobo?.name || ""}`.toLowerCase();
    if (name.includes("itx")) return "ITX";
    if (name.includes("matx") || name.includes("m-") || name.includes("m ")) return "mATX";
    return "ATX";
  }

  buildCaseProfile(selection) {
    const defaults = constraintsData.defaults.case;
    const caseId = selection?.case?.id || "";
    const caseProfile = constraintsData.cases?.[caseId] || {};

    const maxGpu = Number(selection?.case?.maxGpu || 340);
    const maxRad = Number(selection?.case?.maxRad || 280);
    const guessedWidth = maxRad >= 360 ? 246 : maxRad >= 280 ? 236 : 228;
    const guessedHeight = maxRad >= 360 ? 500 : maxRad >= 280 ? 470 : 445;
    const inner = {
      length: Math.max(Number(caseProfile.inner?.length || defaults.inner.length), maxGpu + 110),
      width: Math.max(Number(caseProfile.inner?.width || defaults.inner.width), guessedWidth),
      height: Math.max(Number(caseProfile.inner?.height || defaults.inner.height), guessedHeight)
    };

    return {
      inner,
      moboAnchor: { ...(defaults.moboAnchor || {}), ...(caseProfile.moboAnchor || {}) },
      gpuPcieAnchor: { ...(defaults.gpuPcieAnchor || {}), ...(caseProfile.gpuPcieAnchor || {}) },
      psuAnchor: { ...(defaults.psuAnchor || {}), ...(caseProfile.psuAnchor || {}) },
      radiatorMounts: { ...(defaults.radiatorMounts || {}), ...(caseProfile.radiatorMounts || {}) },
      forbiddenVolumes: [...(defaults.forbiddenVolumes || []), ...(caseProfile.forbiddenVolumes || [])]
    };
  }

  deriveDimensions(selection, profile) {
    const moboDefaults = constraintsData.defaults.motherboard;
    const gpuDefaults = constraintsData.defaults.gpu;
    const psuDefaults = constraintsData.defaults.psu;
    const radDefaults = constraintsData.defaults.radiator;

    const ff = this.inferMoboFormFactor(selection.mobo);
    const mobo = moboDefaults[ff] || moboDefaults.ATX;

    const gpuLength = Number(selection.gpu?.length || 260);
    const gpuHeight = Number(selection.gpu?.height || gpuDefaults.height || 130);
    const gpuThick = Number(selection.gpu?.thickness || Math.round(42 + (Number(selection.gpu?.score || 7) - 6) * 6));

    const psuLengthRaw = Math.round(Number(psuDefaults.lengthMin || 140) + Math.max(0, Number(selection.psu?.watts || 650) - 550) * 0.12);
    const psuLength = Math.min(Number(psuDefaults.lengthMax || 220), Math.max(Number(psuDefaults.lengthMin || 140), psuLengthRaw));

    const radSize = Number(selection.cooling?.radiator || 0);
    const radThickness = Number(radDefaults.thicknessCore || 28) + Number(radDefaults.fanThickness || 25);

    return {
      mobo,
      gpu: { length: gpuLength, height: gpuHeight, thickness: Math.max(35, Math.min(80, gpuThick)) },
      psu: { length: psuLength, width: Number(psuDefaults.width || 150), height: Number(psuDefaults.height || 86) },
      radiator: { size: radSize, width: Number(radDefaults.height || 140), thickness: radThickness },
      caseInner: profile.inner
    };
  }

  clearScene() {
    [this.componentGroup, this.tubeGroup, this.cableGroup].forEach((group) => {
      while (group.children.length) {
        const child = group.children[0];
        group.remove(child);
        disposeHierarchy(child);
      }
    });
    this.placements = {};
    this.conflicts = [];
    this.caseDoor = null;
    this.caseDoorGlass = null;
    this.caseDoorSolid = null;
  }

  registerPlacement(id, sizeMm, centerMm, mesh = null) {
    const center = new THREE.Vector3(mm(centerMm.x), mm(centerMm.y), mm(centerMm.z));
    const half = new THREE.Vector3(mm(sizeMm.x / 2), mm(sizeMm.y / 2), mm(sizeMm.z / 2));
    const box = new THREE.Box3(center.clone().sub(half), center.clone().add(half));

    if (mesh) {
      mesh.position.copy(center);
      this.componentGroup.add(mesh);
    }

    this.placements[id] = { mesh, box, sizeMm, centerMm };
    return this.placements[id];
  }

  roundedMesh(sizeMm, radiusMm, material) {
    const sx = Math.max(mm(sizeMm.x), 0.01);
    const sy = Math.max(mm(sizeMm.y), 0.01);
    const sz = Math.max(mm(sizeMm.z), 0.01);
    const radius = Math.min(mm(radiusMm), sx * 0.35, sy * 0.35, sz * 0.35);
    return new THREE.Mesh(new RoundedBoxGeometry(sx, sy, sz, 3, Math.max(radius, 0.001)), material);
  }

  getBrandAccent(brand = "") {
    const v = String(brand || "").toLowerCase();
    if (v.includes("msi")) return 0xff4c4c;
    if (v.includes("asus")) return 0x73b7ff;
    if (v.includes("gigabyte") || v.includes("aorus")) return 0xff9a52;
    if (v.includes("nvidia")) return 0x95f26b;
    if (v.includes("amd") || v.includes("radeon")) return 0xff6d5e;
    if (v.includes("corsair")) return 0xd8e3f2;
    return 0x62bfff;
  }

  makeBrandPlate(text, widthMm = 64, heightMm = 12, fgColor = "#dce8f8", bgColor = "#151d29") {
    const label = String(text || "").trim();
    if (!label) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.26)";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
    ctx.fillStyle = fgColor;
    ctx.font = "700 66px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label.slice(0, 18), canvas.width / 2, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.42, metalness: 0.16 });
    return new THREE.Mesh(new THREE.PlaneGeometry(mm(widthMm), mm(heightMm)), mat);
  }

  inferCaseStyle(selection) {
    const id = String(selection?.case?.id || "").toLowerCase();
    const name = String(selection?.case?.name || "").toLowerCase();
    const ref = `${id} ${name}`;
    if (ref.includes("case-msi-100r") || (ref.includes("mag") && ref.includes("forge"))) return "msi-forge-100r";
    if (ref.includes("o11")
      || ref.includes("y70")
      || ref.includes("nv5")
      || ref.includes("nv7")
      || ref.includes("h9")
      || ref.includes("vision")
      || ref.includes("aquarium")
      || ref.includes("dual chamber")) return "aquarium";
    if (ref.includes("tower") || ref.includes("alta")) return "tower";
    if (ref.includes("north")) return "wood";
    if (ref.includes("silent") || ref.includes("define")) return "solid";
    return "mesh";
  }

  buildCaseVisual(innerMm, selection) {
    const caseStyle = this.inferCaseStyle(selection);
    const caseBrand = selection?.case?.brand || "";
    const group = new THREE.Group();
    const shell = this.roundedMesh(
      { x: innerMm.length + 14, y: innerMm.height + 14, z: innerMm.width + 14 },
      10,
      new THREE.MeshStandardMaterial({ color: 0x171f2b, transparent: true, opacity: 0.36, roughness: 0.54, metalness: 0.28 })
    );
    group.add(shell);

    const sideDoor = new THREE.Group();
    sideDoor.userData.aeCaseDoor = true;
    sideDoor.userData.closedPos = new THREE.Vector3(0, mm(8), mm((innerMm.width / 2) + 6));
    sideDoor.userData.openPos = new THREE.Vector3(0, mm(8), mm((innerMm.width / 2) + 96));
    sideDoor.userData.closedRotY = 0;
    sideDoor.userData.openRotY = THREE.MathUtils.degToRad(caseStyle === "aquarium" ? -10 : -56);

    const sideFrame = this.roundedMesh(
      { x: innerMm.length - 20, y: innerMm.height - 34, z: 6 },
      4,
      new THREE.MeshStandardMaterial({ color: 0x2a3443, roughness: 0.5, metalness: 0.32 })
    );
    sideDoor.add(sideFrame);

    const sideGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(mm(innerMm.length - 34), mm(innerMm.height - 50)),
      new THREE.MeshPhysicalMaterial({
        color: 0xb9ddff,
        transparent: true,
        opacity: caseStyle === "aquarium" ? 0.18 : 0.2,
        roughness: 0.06,
        transmission: 0.72
      })
    );
    sideGlass.position.z = mm(3.2);
    sideGlass.userData.aeDoorGlass = true;
    sideDoor.add(sideGlass);

    if (caseStyle !== "aquarium") {
      const sideTint = new THREE.Mesh(
        new THREE.PlaneGeometry(mm(innerMm.length - 34), mm(innerMm.height - 50)),
        new THREE.MeshStandardMaterial({ color: 0x111720, transparent: true, opacity: 0.86, roughness: 0.56, metalness: 0.1 })
      );
      sideTint.position.z = mm(2.9);
      sideTint.userData.aeDoorSolid = true;
      sideDoor.add(sideTint);
    }
    sideDoor.position.copy(sideDoor.userData.closedPos);
    group.add(sideDoor);

    if (caseStyle === "aquarium") {
      const sideGlass = new THREE.Mesh(
        new THREE.PlaneGeometry(mm(innerMm.width - 24), mm(innerMm.height - 34)),
        new THREE.MeshPhysicalMaterial({ color: 0xb4dcff, transparent: true, opacity: 0.12, roughness: 0.05, transmission: 0.82 })
      );
      sideGlass.rotation.y = Math.PI / 2;
      sideGlass.position.set(mm(-innerMm.length / 2 - 6), mm(8), mm(0));
      group.add(sideGlass);
    }

    const edgeLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(mm(innerMm.length + 14), mm(innerMm.height + 14), mm(innerMm.width + 14))),
      new THREE.LineBasicMaterial({ color: 0x5fcbff, transparent: true, opacity: 0.24 })
    );
    group.add(edgeLines);

    const frontPanelMat = caseStyle === "wood"
      ? new THREE.MeshStandardMaterial({ color: 0x91653b, roughness: 0.74, metalness: 0.06 })
      : caseStyle === "solid"
        ? new THREE.MeshStandardMaterial({ color: 0x202832, roughness: 0.55, metalness: 0.22 })
        : new THREE.MeshStandardMaterial({ color: 0x2e3948, roughness: 0.68, metalness: 0.2 });

    const frontPanel = this.roundedMesh(
      { x: 8, y: innerMm.height - 26, z: innerMm.width - 16 },
      4,
      frontPanelMat
    );
    frontPanel.position.set(mm(-innerMm.length / 2 + 5), mm(2), 0);
    group.add(frontPanel);

    if (caseStyle === "mesh") {
      for (let i = -6; i <= 6; i += 1) {
        const slit = new THREE.Mesh(
          new THREE.BoxGeometry(mm(1), mm(innerMm.height - 48), mm(2)),
          new THREE.MeshStandardMaterial({ color: 0x55677e, roughness: 0.4, metalness: 0.34 })
        );
        slit.position.set(mm(-innerMm.length / 2 + 9), mm(2), mm(i * 12));
        group.add(slit);
      }
    }

    if (caseStyle === "msi-forge-100r") {
      const slashMat = new THREE.MeshStandardMaterial({ color: 0x6f849d, roughness: 0.38, metalness: 0.34 });
      for (let i = -5; i <= 5; i += 1) {
        const slash = new THREE.Mesh(new THREE.BoxGeometry(mm(1.2), mm(innerMm.height - 62), mm(2.4)), slashMat);
        slash.rotation.y = 0.4;
        slash.position.set(mm(-innerMm.length / 2 + 9), mm(0), mm(i * 11));
        group.add(slash);
      }
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(mm(4), mm(innerMm.height - 38), mm(6)),
        new THREE.MeshStandardMaterial({ color: 0xff4c4c, roughness: 0.26, metalness: 0.22, emissive: 0x331010 })
      );
      strip.position.set(mm(-innerMm.length / 2 + 10), 0, mm(innerMm.width * 0.22));
      group.add(strip);

      const fanMat = new THREE.MeshStandardMaterial({ color: 0x111820, roughness: 0.58, metalness: 0.24 });
      const rgbMat = new THREE.MeshStandardMaterial({ color: 0x66ccff, roughness: 0.22, metalness: 0.16, emissive: 0x142c3c });
      const frontFanYs = [innerMm.height * 0.14, -innerMm.height * 0.16];
      frontFanYs.forEach((yVal) => {
        const fan = new THREE.Mesh(new THREE.CylinderGeometry(mm(53), mm(53), mm(8), 30), fanMat);
        fan.rotation.z = Math.PI / 2;
        fan.position.set(mm(-innerMm.length / 2 + 12), mm(yVal), 0);
        group.add(fan);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(mm(55), mm(1.8), 14, 46), rgbMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(mm(-innerMm.length / 2 + 12.5), mm(yVal), 0);
        group.add(ring);
      });
    }

    const caseLabel = this.makeBrandPlate(caseBrand, 62, 12, "#f4fbff", "#182130");
    if (caseLabel) {
      caseLabel.rotation.y = Math.PI / 2;
      caseLabel.position.set(mm(-innerMm.length / 2 + 12), mm((innerMm.height / 2) - 42), 0);
      group.add(caseLabel);
    }

    if (caseStyle === "tower") {
      const towerAccent = new THREE.Mesh(
        new THREE.BoxGeometry(mm(innerMm.length - 36), mm(8), mm(10)),
        new THREE.MeshStandardMaterial({ color: 0x67c8ff, roughness: 0.3, metalness: 0.22, emissive: 0x102e46 })
      );
      towerAccent.position.set(0, mm((innerMm.height / 2) - 14), mm((-innerMm.width / 2) + 8));
      group.add(towerAccent);
    }

    const motherboardTray = new THREE.Mesh(
      new THREE.BoxGeometry(mm(innerMm.length - 80), mm(innerMm.height - 86), mm(3.5)),
      new THREE.MeshStandardMaterial({ color: 0x1a222d, roughness: 0.65, metalness: 0.2 })
    );
    motherboardTray.position.set(mm(18), 0, mm((innerMm.width / 2) - 18));
    group.add(motherboardTray);

    const psuShroud = this.roundedMesh(
      { x: innerMm.length * 0.58, y: 92, z: innerMm.width - 26 },
      6,
      new THREE.MeshStandardMaterial({ color: 0x141b25, roughness: 0.72, metalness: 0.2 })
    );
    psuShroud.position.set(mm((innerMm.length * 0.17)), mm((-innerMm.height / 2) + 46), 0);
    group.add(psuShroud);

    const feetOffsets = [
      [-innerMm.length / 2 + 38, -innerMm.height / 2 - 10, -innerMm.width / 2 + 36],
      [innerMm.length / 2 - 38, -innerMm.height / 2 - 10, -innerMm.width / 2 + 36],
      [-innerMm.length / 2 + 38, -innerMm.height / 2 - 10, innerMm.width / 2 - 36],
      [innerMm.length / 2 - 38, -innerMm.height / 2 - 10, innerMm.width / 2 - 36]
    ];
    feetOffsets.forEach(([x, y, z]) => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(mm(10), mm(12), mm(18), 18),
        new THREE.MeshStandardMaterial({ color: 0x0f141d, roughness: 0.74, metalness: 0.2 })
      );
      foot.position.set(mm(x), mm(y), mm(z));
      group.add(foot);
    });

    return group;
  }

  buildMotherboardVisual(sizeMm, mobo = null) {
    const group = new THREE.Group();
    const boardThickness = Math.min(6, Math.max(4, Number(sizeMm.z || 6)));
    const accent = this.getBrandAccent(mobo?.brand || "");
    const board = this.roundedMesh(
      { x: sizeMm.x, y: sizeMm.y, z: boardThickness },
      2,
      new THREE.MeshStandardMaterial({ color: 0x193928, roughness: 0.82, metalness: 0.06 })
    );
    group.add(board);

    const socket = new THREE.Mesh(
      new THREE.BoxGeometry(mm(48), mm(48), mm(8)),
      new THREE.MeshStandardMaterial({ color: 0x8fa5bf, roughness: 0.5, metalness: 0.35 })
    );
    socket.position.set(mm(-sizeMm.x * 0.16), mm(sizeMm.y * 0.08), mm((boardThickness / 2) + 4));
    group.add(socket);

    for (let i = 0; i < 4; i += 1) {
      const slot = new THREE.Mesh(
        new THREE.BoxGeometry(mm(6), mm(120), mm(7)),
        new THREE.MeshStandardMaterial({ color: 0x1c232d, roughness: 0.72, metalness: 0.2 })
      );
      slot.position.set(mm(sizeMm.x * 0.26 + (i * 9)), mm(sizeMm.y * 0.13), mm((boardThickness / 2) + 3.5));
      group.add(slot);
    }

    const vrm = new THREE.Mesh(
      new THREE.BoxGeometry(mm(96), mm(22), mm(15)),
      new THREE.MeshStandardMaterial({ color: 0x5f738d, roughness: 0.45, metalness: 0.34 })
    );
    vrm.position.set(mm(-sizeMm.x * 0.22), mm(sizeMm.y * 0.32), mm((boardThickness / 2) + 7.5));
    group.add(vrm);

    const ioShroud = new THREE.Mesh(
      new THREE.BoxGeometry(mm(20), mm(78), mm(28)),
      new THREE.MeshStandardMaterial({ color: 0x2b3440, roughness: 0.6, metalness: 0.3 })
    );
    ioShroud.position.set(mm(-sizeMm.x / 2 + 10), mm(sizeMm.y * 0.18), mm((boardThickness / 2) + 14));
    group.add(ioShroud);

    const rgbTrace = new THREE.Mesh(
      new THREE.BoxGeometry(mm(sizeMm.x * 0.48), mm(4), mm(1.8)),
      new THREE.MeshStandardMaterial({ color: accent, roughness: 0.28, metalness: 0.16, emissive: accent & 0x303030 })
    );
    rgbTrace.position.set(mm(0), mm(-sizeMm.y * 0.42), mm((boardThickness / 2) + 1.4));
    group.add(rgbTrace);

    const boardLabel = this.makeBrandPlate(mobo?.brand || "", 56, 10, "#eaf4ff", "#1a2430");
    if (boardLabel) {
      boardLabel.position.set(mm(sizeMm.x * 0.08), mm(-sizeMm.y * 0.32), mm((boardThickness / 2) + 2.1));
      group.add(boardLabel);
    }

    return group;
  }

  buildGpuVisual(sizeMm, gpu = null) {
    const group = new THREE.Group();
    const accent = this.getBrandAccent(gpu?.brand || "");
    const body = this.roundedMesh(
      { x: sizeMm.x, y: sizeMm.y, z: sizeMm.z },
      6,
      new THREE.MeshStandardMaterial({ color: 0x202734, roughness: 0.48, metalness: 0.32 })
    );
    group.add(body);

    const fanCount = sizeMm.x >= 320 ? 3 : 2;
    const fanSpacing = sizeMm.x / (fanCount + 1);
    for (let i = 1; i <= fanCount; i += 1) {
      const fan = new THREE.Mesh(
        new THREE.CylinderGeometry(mm(24), mm(24), mm(6), 26),
        new THREE.MeshStandardMaterial({ color: 0x0b1016, roughness: 0.65, metalness: 0.2 })
      );
      fan.rotation.x = Math.PI / 2;
      fan.position.set(mm(-sizeMm.x / 2 + (fanSpacing * i)), mm(0), mm(sizeMm.z / 2 + 2));
      group.add(fan);
    }

    const topAccent = new THREE.Mesh(
      new THREE.BoxGeometry(mm(sizeMm.x - 20), mm(8), mm(5)),
      new THREE.MeshStandardMaterial({ color: accent, roughness: 0.35, metalness: 0.26, emissive: accent & 0x202020 })
    );
    topAccent.position.set(mm(0), mm(sizeMm.y / 2 - 5), mm(-sizeMm.z / 2 + 3));
    group.add(topAccent);

    const sidePlate = new THREE.Mesh(
      new THREE.BoxGeometry(mm(sizeMm.x - 18), mm(sizeMm.y * 0.35), mm(2.2)),
      new THREE.MeshStandardMaterial({ color: 0x2a3442, roughness: 0.52, metalness: 0.28 })
    );
    sidePlate.position.set(0, 0, mm(-sizeMm.z / 2 - 1.4));
    group.add(sidePlate);

    const gpuLabel = this.makeBrandPlate(`${gpu?.brand || ""} ${gpu?.name || ""}`.trim(), Math.min(140, sizeMm.x - 24), 12, "#eef6ff", "#111a25");
    if (gpuLabel) {
      gpuLabel.position.set(0, 0, mm(-sizeMm.z / 2 - 2.8));
      group.add(gpuLabel);
    }

    return group;
  }

  buildPsuVisual(sizeMm) {
    const group = new THREE.Group();
    const shell = this.roundedMesh(
      { x: sizeMm.x, y: sizeMm.y, z: sizeMm.z },
      4,
      new THREE.MeshStandardMaterial({ color: 0x151c25, roughness: 0.72, metalness: 0.2 })
    );
    group.add(shell);

    const fan = new THREE.Mesh(
      new THREE.CylinderGeometry(mm(30), mm(30), mm(3), 24),
      new THREE.MeshStandardMaterial({ color: 0x0a0d12, roughness: 0.62, metalness: 0.22 })
    );
    fan.rotation.x = Math.PI / 2;
    fan.position.set(mm(0), mm(0), mm(sizeMm.z / 2 + 1));
    group.add(fan);

    for (let i = -2; i <= 2; i += 1) {
      const grill = new THREE.Mesh(
        new THREE.BoxGeometry(mm(sizeMm.x - 20), mm(1), mm(1)),
        new THREE.MeshStandardMaterial({ color: 0x364554, roughness: 0.4, metalness: 0.4 })
      );
      grill.position.set(mm(0), mm(i * 8), mm(sizeMm.z / 2 + 2));
      group.add(grill);
    }

    return group;
  }

  buildRamVisual() {
    const group = new THREE.Group();
    const stick = this.roundedMesh(
      { x: 7, y: 132, z: 38 },
      2,
      new THREE.MeshStandardMaterial({ color: 0x2a3340, roughness: 0.55, metalness: 0.24 })
    );
    group.add(stick);
    const diffuser = new THREE.Mesh(
      new THREE.BoxGeometry(mm(7), mm(8), mm(38)),
      new THREE.MeshStandardMaterial({ color: 0x6ce1ff, roughness: 0.24, metalness: 0.08, emissive: 0x18323f })
    );
    diffuser.position.y = mm(68);
    group.add(diffuser);
    return group;
  }

  buildStorageVisual() {
    const group = new THREE.Group();
    const pcb = this.roundedMesh(
      { x: 80, y: 22, z: 4 },
      1.5,
      new THREE.MeshStandardMaterial({ color: 0x0f4732, roughness: 0.65, metalness: 0.12 })
    );
    group.add(pcb);
    const chips = new THREE.Mesh(
      new THREE.BoxGeometry(mm(32), mm(8), mm(3)),
      new THREE.MeshStandardMaterial({ color: 0x3a4654, roughness: 0.5, metalness: 0.2 })
    );
    chips.position.set(mm(6), 0, mm(3));
    group.add(chips);
    return group;
  }

  buildCpuBlockVisual() {
    const group = new THREE.Group();
    const base = this.roundedMesh(
      { x: 55, y: 18, z: 55 },
      4,
      new THREE.MeshStandardMaterial({ color: 0x304357, roughness: 0.42, metalness: 0.34 })
    );
    group.add(base);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(mm(20), mm(20), mm(12), 24),
      new THREE.MeshStandardMaterial({ color: 0x9dd2ff, roughness: 0.22, metalness: 0.16, emissive: 0x102635 })
    );
    cap.position.y = mm(14);
    group.add(cap);
    return group;
  }

  buildAirCoolerVisual() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(mm(58), mm(16), mm(58)),
      new THREE.MeshStandardMaterial({ color: 0x2f3c4b, roughness: 0.5, metalness: 0.3 })
    );
    base.position.y = mm(-31);
    group.add(base);

    const tower = this.roundedMesh(
      { x: 62, y: 72, z: 38 },
      3,
      new THREE.MeshStandardMaterial({ color: 0xb6c6d8, roughness: 0.3, metalness: 0.45 })
    );
    tower.position.y = mm(2);
    group.add(tower);

    for (let i = 0; i < 7; i += 1) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(mm(62), mm(1.4), mm(38)),
        new THREE.MeshStandardMaterial({ color: 0xd2deea, roughness: 0.25, metalness: 0.42 })
      );
      fin.position.y = mm(-28 + (i * 10));
      group.add(fin);
    }

    const fan = new THREE.Mesh(
      new THREE.CylinderGeometry(mm(18), mm(18), mm(18), 24),
      new THREE.MeshStandardMaterial({ color: 0x1a212c, roughness: 0.62, metalness: 0.2 })
    );
    fan.rotation.z = Math.PI / 2;
    fan.position.set(mm(0), mm(0), mm(29));
    group.add(fan);

    const fan2 = fan.clone();
    fan2.position.set(mm(0), mm(0), mm(-29));
    group.add(fan2);

    for (let i = -2; i <= 2; i += 1) {
      const pipe = new THREE.Mesh(
        new THREE.TorusGeometry(mm(14 + Math.abs(i) * 1.2), mm(1.1), 8, 24, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0xb9c8d8, roughness: 0.22, metalness: 0.48 })
      );
      pipe.rotation.x = Math.PI;
      pipe.position.set(mm(i * 6), mm(30), 0);
      group.add(pipe);
    }
    return group;
  }

  buildStockCoolerVisual() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(mm(28), mm(30), mm(20), 28),
      new THREE.MeshStandardMaterial({ color: 0x4a5665, roughness: 0.52, metalness: 0.34 })
    );
    group.add(base);

    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(mm(32), mm(32), mm(12), 30),
      new THREE.MeshStandardMaterial({ color: 0x1f2836, roughness: 0.44, metalness: 0.28 })
    );
    top.position.y = mm(14);
    group.add(top);

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(mm(8), mm(8), mm(10), 18),
      new THREE.MeshStandardMaterial({ color: 0x0f141d, roughness: 0.62, metalness: 0.18 })
    );
    hub.position.y = mm(18);
    group.add(hub);

    for (let i = 0; i < 9; i += 1) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(mm(4), mm(18), mm(1.2)),
        new THREE.MeshStandardMaterial({ color: 0x7e8ea2, roughness: 0.28, metalness: 0.16 })
      );
      blade.position.set(mm(0), mm(18), 0);
      blade.rotation.y = (Math.PI * 2 * i) / 9;
      blade.rotation.x = -0.35;
      group.add(blade);
    }
    return group;
  }

  buildRadiatorVisual(sizeMm, mount = "top") {
    const group = new THREE.Group();
    const core = this.roundedMesh(
      { x: sizeMm.x, y: sizeMm.y, z: sizeMm.z },
      3,
      new THREE.MeshStandardMaterial({ color: 0x1b1f2a, roughness: 0.58, metalness: 0.3 })
    );
    group.add(core);

    const spanMm = Math.max(sizeMm.x, sizeMm.z);
    const fanCount = spanMm >= 360 ? 3 : 2;
    const fanDiameter = Math.max(40, Math.min(sizeMm.y, sizeMm.z) - 12);
    const span = spanMm / fanCount;
    for (let i = 0; i < fanCount; i += 1) {
      const fan = new THREE.Mesh(
        new THREE.CylinderGeometry(mm(fanDiameter / 2), mm(fanDiameter / 2), mm(8), 24),
        new THREE.MeshStandardMaterial({ color: 0x0e131b, roughness: 0.65, metalness: 0.2 })
      );
      if (mount === "top") {
        fan.rotation.x = Math.PI / 2;
        fan.position.set(mm((-sizeMm.x / 2) + (span * i) + (span / 2)), 0, mm(sizeMm.z / 2 + 4));
      } else {
        fan.rotation.z = Math.PI / 2;
        fan.position.set(mm(sizeMm.x / 2 + 4), 0, mm((-sizeMm.z / 2) + (span * i) + (span / 2)));
      }
      group.add(fan);
    }
    return group;
  }

  buildChassisFanVisual(diameterMm = 120, thicknessMm = 26, axis = "x") {
    const group = new THREE.Group();
    const outerFrame = new THREE.Mesh(
      new THREE.CylinderGeometry(mm(diameterMm / 2), mm(diameterMm / 2), mm(thicknessMm), 42),
      new THREE.MeshStandardMaterial({ color: 0x1a2432, roughness: 0.56, metalness: 0.28 })
    );
    outerFrame.rotation.x = Math.PI / 2;
    group.add(outerFrame);

    const innerRing = new THREE.Mesh(
      new THREE.CylinderGeometry(mm((diameterMm / 2) - 8), mm((diameterMm / 2) - 8), mm(thicknessMm + 0.8), 42),
      new THREE.MeshStandardMaterial({ color: 0x0f1621, roughness: 0.6, metalness: 0.18 })
    );
    innerRing.rotation.x = Math.PI / 2;
    group.add(innerRing);

    const faceGap = new THREE.Mesh(
      new THREE.CylinderGeometry(mm((diameterMm / 2) - 18), mm((diameterMm / 2) - 18), mm(thicknessMm + 1.4), 38),
      new THREE.MeshStandardMaterial({ color: 0x0a0f16, roughness: 0.72, metalness: 0.06 })
    );
    faceGap.rotation.x = Math.PI / 2;
    group.add(faceGap);

    const frame = new THREE.Mesh(
      new THREE.CylinderGeometry(mm((diameterMm / 2) - 10), mm((diameterMm / 2) - 10), mm(2), 38),
      new THREE.MeshStandardMaterial({ color: 0x29384b, roughness: 0.4, metalness: 0.24 })
    );
    frame.position.z = mm((thicknessMm / 2) - 1.2);
    frame.rotation.x = Math.PI / 2;
    group.add(frame);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(mm(Math.max(14, (diameterMm / 2) - 12)), mm(2.2), 18, 54),
      new THREE.MeshStandardMaterial({ color: 0x53baf9, roughness: 0.2, metalness: 0.3, emissive: 0x102235 })
    );
    ring.position.z = mm((thicknessMm / 2) - 0.4);
    group.add(ring);

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(mm(14), mm(14), mm(Math.max(9, thicknessMm - 10)), 30),
      new THREE.MeshStandardMaterial({ color: 0x0c131c, roughness: 0.62, metalness: 0.2 })
    );
    hub.rotation.x = Math.PI / 2;
    group.add(hub);

    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x9ed9ff, roughness: 0.24, metalness: 0.1, transparent: true, opacity: 0.84 });
    for (let i = 0; i < 7; i += 1) {
      const blade = new THREE.Mesh(new THREE.CapsuleGeometry(mm(2.6), mm((diameterMm / 2) - 28), 6, 10), bladeMaterial);
      blade.position.y = mm((diameterMm / 4) - 10);
      blade.rotation.z = (Math.PI * 2 * i) / 7;
      blade.rotation.x = 0.28;
      group.add(blade);
    }

    const screwOffsets = [
      [-diameterMm / 2 + 9, -diameterMm / 2 + 9],
      [diameterMm / 2 - 9, -diameterMm / 2 + 9],
      [-diameterMm / 2 + 9, diameterMm / 2 - 9],
      [diameterMm / 2 - 9, diameterMm / 2 - 9]
    ];
    screwOffsets.forEach(([x, y]) => {
      const screw = new THREE.Mesh(
        new THREE.CylinderGeometry(mm(1.8), mm(1.8), mm(2), 10),
        new THREE.MeshStandardMaterial({ color: 0x9ba9bd, roughness: 0.28, metalness: 0.42 })
      );
      screw.position.set(mm(x), mm(y), mm((thicknessMm / 2) - 1.8));
      group.add(screw);
    });

    if (axis === "x") group.rotation.y = Math.PI / 2;
    if (axis === "y") group.rotation.x = Math.PI / 2;
    return group;
  }

  registerChassisFans(inner, mount, radSize = 0) {
    const rearY = Math.min(80, Math.max(20, inner.height * 0.1));
    this.registerPlacement(
      "caseFanRear",
      { x: 26, y: 120, z: 120 },
      { x: (inner.length / 2) - 14, y: rearY, z: 0 },
      this.buildChassisFanVisual(120, 26, "x")
    );

    if (mount !== "front") {
      const frontCount = inner.height >= 460 ? 3 : 2;
      const span = Math.min(280, inner.height - 130);
      for (let i = 0; i < frontCount; i += 1) {
        const y = (-span / 2) + (i * (span / Math.max(1, frontCount - 1)));
        this.registerPlacement(
          `caseFanFront${i + 1}`,
          { x: 26, y: 120, z: 120 },
          { x: (-inner.length / 2) + 14, y, z: 0 },
          this.buildChassisFanVisual(120, 26, "x")
        );
      }
    }

    if (mount !== "top") {
      const topCount = inner.length >= 520 ? 3 : 2;
      const topDiameter = inner.width >= 235 ? 140 : 120;
      const span = Math.min(300, inner.length - 180);
      for (let i = 0; i < topCount; i += 1) {
        const x = (-span / 2) + (i * (span / Math.max(1, topCount - 1)));
        this.registerPlacement(
          `caseFanTop${i + 1}`,
          { x: topDiameter, y: 26, z: topDiameter },
          { x, y: (inner.height / 2) - 14, z: -12 },
          this.buildChassisFanVisual(topDiameter, 26, "y")
        );
      }
    }

    if (mount === "front" && radSize >= 360) {
      this.registerPlacement(
        "caseFanBottom",
        { x: 26, y: 120, z: 120 },
        { x: (-inner.length / 2) + 14, y: (-inner.height / 2) + 85, z: 0 },
        this.buildChassisFanVisual(120, 26, "x")
      );
    }
  }

  chooseRadiatorMount(profile, dims) {
    const size = dims.radiator.size;
    if (!size) return null;

    const topSupports = profile.radiatorMounts?.top || [];
    const frontSupports = profile.radiatorMounts?.front || [];
    if (topSupports.includes(size)) return "top";
    if (frontSupports.includes(size)) return "front";
    return null;
  }

  buildPlacement(selection) {
    const token = ++this.renderVersion;
    this.clearScene();
    const profile = this.buildCaseProfile(selection);
    const dims = this.deriveDimensions(selection, profile);
    const mount = this.chooseRadiatorMount(profile, dims);

    const inner = dims.caseInner;
    this.registerPlacement("case", { x: inner.length, y: inner.height, z: inner.width }, { x: 0, y: 0, z: 0 }, this.buildCaseVisual(inner, selection));
    this.captureCaseDoorRefs();

    const moboPos = {
      x: (inner.length / 2) - (dims.mobo.width / 2) - 34,
      y: (-inner.height / 2) + (dims.mobo.length / 2) + 30,
      z: (inner.width / 2) - (dims.mobo.thickness / 2) - 12
    };
    this.registerPlacement(
      "mobo",
      { x: dims.mobo.width, y: dims.mobo.length, z: dims.mobo.thickness },
      moboPos,
      this.buildMotherboardVisual({ x: dims.mobo.width, y: dims.mobo.length, z: dims.mobo.thickness }, selection.mobo)
    );

    const gpuPos = {
      x: moboPos.x - 20,
      y: moboPos.y - 42,
      z: moboPos.z - (dims.mobo.thickness / 2) - (dims.gpu.thickness / 2) - 8
    };
    this.registerPlacement(
      "gpu",
      { x: dims.gpu.length, y: dims.gpu.height, z: dims.gpu.thickness },
      gpuPos,
      this.buildGpuVisual({ x: dims.gpu.length, y: dims.gpu.height, z: dims.gpu.thickness }, selection.gpu)
    );

    const psuPos = {
      x: (inner.length / 2) - (dims.psu.length / 2) - 22,
      y: (-inner.height / 2) + (dims.psu.height / 2) + 18,
      z: (-inner.width / 2) + (dims.psu.width / 2) + 14
    };
    this.registerPlacement("psu", { x: dims.psu.length, y: dims.psu.height, z: dims.psu.width }, psuPos, this.buildPsuVisual({ x: dims.psu.length, y: dims.psu.height, z: dims.psu.width }));

    const coolingType = selection.cooling?.type || "none";
    const isLiquid = coolingType === "aio" || coolingType === "custom";
    const isAirTower = coolingType === "air";
    const cpuBlockPos = {
      x: moboPos.x - (dims.mobo.width * 0.17),
      y: moboPos.y + (dims.mobo.length * 0.1),
      z: moboPos.z - (dims.mobo.thickness / 2) - (isLiquid ? 19 : isAirTower ? 28 : 22)
    };
    const cpuCoolerSize = isLiquid ? { x: 55, y: 35, z: 55 } : isAirTower ? { x: 62, y: 88, z: 62 } : { x: 70, y: 56, z: 70 };
    this.registerPlacement(
      "cpuBlock",
      cpuCoolerSize,
      cpuBlockPos,
      isLiquid ? this.buildCpuBlockVisual() : isAirTower ? this.buildAirCoolerVisual() : this.buildStockCoolerVisual()
    );

    const ramBase = {
      x: moboPos.x + (dims.mobo.width * 0.2),
      y: moboPos.y + 18,
      z: moboPos.z - (dims.mobo.thickness / 2) - 8
    };
    const ramCount = Number(selection.ram?.gb || 16) >= 96 ? 4 : Number(selection.ram?.gb || 16) >= 32 ? 2 : 2;
    for (let i = 0; i < ramCount; i += 1) {
      this.registerPlacement(
        `ram${i + 1}`,
        { x: 7, y: 132, z: 38 },
        { x: ramBase.x + (i * 9), y: ramBase.y + 84, z: ramBase.z },
        this.buildRamVisual()
      );
    }

    this.registerPlacement(
      "storage",
      { x: 80, y: 22, z: 4 },
      { x: moboPos.x + 14, y: moboPos.y - (dims.mobo.length * 0.2), z: moboPos.z - (dims.mobo.thickness / 2) - 2.5 },
      this.buildStorageVisual()
    );

    if ((selection.cooling?.type === "aio" || selection.cooling?.type === "custom") && dims.radiator.size > 0) {
      if (!mount) {
        this.conflicts.push(`Radiateur ${dims.radiator.size} mm non supporté par ce boîtier.`);
      } else if (mount === "top") {
        this.registerPlacement(
          "radiator",
          { x: dims.radiator.size, y: dims.radiator.thickness, z: dims.radiator.width },
          { x: -10, y: (inner.height / 2) - (dims.radiator.thickness / 2) - 6, z: -10 },
          this.buildRadiatorVisual({ x: dims.radiator.size, y: dims.radiator.thickness, z: dims.radiator.width }, "top")
        );
      } else {
        this.registerPlacement(
          "radiator",
          { x: dims.radiator.thickness, y: dims.radiator.width, z: dims.radiator.size },
          { x: -(inner.length / 2) + (dims.radiator.thickness / 2) + 8, y: 40, z: -10 },
          this.buildRadiatorVisual({ x: dims.radiator.thickness, y: dims.radiator.width, z: dims.radiator.size }, "front")
        );
      }
      this.placements.radiatorMount = mount;
    }

    this.registerChassisFans(inner, mount, dims.radiator.size);
    this.checkPhysicalConstraints(selection, profile, dims);
    this.tryBuildTubes(selection);
    this.buildPowerCables(selection);
    this.refreshInspector(selection);
    this.decorateWithModels(selection, token).catch(() => {});
  }

  componentOutOfCase(componentBox, caseInnerMm) {
    const limit = new THREE.Box3(
      new THREE.Vector3(mm(-caseInnerMm.length / 2), mm(-caseInnerMm.height / 2), mm(-caseInnerMm.width / 2)),
      new THREE.Vector3(mm(caseInnerMm.length / 2), mm(caseInnerMm.height / 2), mm(caseInnerMm.width / 2))
    );
    limit.expandByScalar(mm(12));
    return !limit.containsBox(componentBox);
  }

  intersectsWithTolerance(a, b, shrinkMm = 10) {
    const aBox = a.clone().expandByScalar(mm(-Math.abs(shrinkMm)));
    const bBox = b.clone().expandByScalar(mm(-Math.abs(shrinkMm)));
    return aBox.intersectsBox(bBox);
  }

  checkPhysicalConstraints(selection, profile, dims) {
    const tests = [
      ["gpu", "radiator", "Collision GPU / radiateur"],
      ["gpu", "ram1", "Clearance GPU / RAM insuffisante"],
      ["psu", "mobo", "Collision PSU / carte mère"]
    ];

    tests.forEach(([a, b, label]) => {
      if (!this.placements[a] || !this.placements[b]) return;
      if (this.intersectsWithTolerance(this.placements[a].box, this.placements[b].box, 12)) {
        this.conflicts.push(label);
      }
    });

    ["mobo", "gpu", "psu", "radiator"].forEach((key) => {
      if (!this.placements[key]) return;
      if (this.componentOutOfCase(this.placements[key].box, profile.inner)) {
        this.conflicts.push(`${key.toUpperCase()} hors volume boîtier.`);
      }
    });

    if (Number(selection.gpu?.length || 0) > Number(selection.case?.maxGpu || 0)) {
      this.conflicts.push("Longueur GPU > capacité boîtier.");
    }

    if ((selection.cooling?.type === "aio" || selection.cooling?.type === "custom")
      && Number(selection.cooling?.radiator || 0) > Number(selection.case?.maxRad || 0)) {
      this.conflicts.push("Radiateur sélectionné trop grand pour ce boîtier.");
    }

    this.renderWarnings();
  }

  computeCurvePoints(selection) {
    const cpu = this.placements.cpuBlock?.mesh?.position;
    const rad = this.placements.radiator?.mesh?.position;
    if (!cpu || !rad) return null;

    const offsets = {
      x: Number(tubeCtrlXEl?.value || this.lastValidTubeOffsets.x),
      y: Number(tubeCtrlYEl?.value || this.lastValidTubeOffsets.y),
      z: Number(tubeCtrlZEl?.value || this.lastValidTubeOffsets.z)
    };

    const o = {
      x: offsets.x,
      y: offsets.y,
      z: offsets.z
    };

    const start = new THREE.Vector3(cpu.x, cpu.y + mm(18), cpu.z + mm(8));
    const end = new THREE.Vector3(rad.x, rad.y + mm(5), rad.z + mm(10));
    const c1 = new THREE.Vector3(
      start.x + mm(30 + o.x * 0.8),
      start.y + mm(45 + o.y * 0.9),
      start.z + mm(o.z * 0.8)
    );
    const c2 = new THREE.Vector3(
      end.x - mm(38 + o.x * 0.5),
      end.y + mm(40 + o.y * 0.6),
      end.z - mm(o.z * 0.45)
    );

    return { start, c1, c2, end, offsets };
  }

  minCurveRadius(points) {
    let minR = Number.POSITIVE_INFINITY;
    for (let i = 1; i < points.length - 1; i += 1) {
      const p1 = points[i - 1];
      const p2 = points[i];
      const p3 = points[i + 1];
      const a = p1.distanceTo(p2);
      const b = p2.distanceTo(p3);
      const c = p1.distanceTo(p3);
      const s = (a + b + c) / 2;
      const areaSq = Math.max(0, s * (s - a) * (s - b) * (s - c));
      if (areaSq <= 1e-8) continue;
      const area = Math.sqrt(areaSq);
      const radius = (a * b * c) / (4 * area);
      if (Number.isFinite(radius)) minR = Math.min(minR, radius);
    }
    return Number.isFinite(minR) ? minR : 999;
  }

  curveIntersectsForbidden(curve, profile) {
    const forbidden = (profile.forbiddenVolumes || []).map((vol) => {
      const min = new THREE.Vector3(mm(vol.min[0]), mm(vol.min[1]), mm(vol.min[2]));
      const max = new THREE.Vector3(mm(vol.max[0]), mm(vol.max[1]), mm(vol.max[2]));
      return new THREE.Box3(min, max);
    });

    const blockers = ["gpu", "psu", "mobo"].map((k) => this.placements[k]?.box).filter(Boolean);

    const sampleCount = 46;
    for (let i = 0; i <= sampleCount; i += 1) {
      const p = curve.getPoint(i / sampleCount);
      if (forbidden.some((box) => box.containsPoint(p))) return "Trajet tuyau dans une zone interdite.";
      if (blockers.some((box) => box.containsPoint(p))) return "Trajet tuyau en collision avec un composant.";
    }
    return "";
  }

  clearTubeGeometry() {
    while (this.tubeGroup.children.length) {
      const child = this.tubeGroup.children[0];
      this.tubeGroup.remove(child);
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose?.());
      else child.material?.dispose?.();
    }
  }

  clearCableGeometry() {
    while (this.cableGroup.children.length) {
      const child = this.cableGroup.children[0];
      this.cableGroup.remove(child);
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose?.());
      else child.material?.dispose?.();
    }
  }

  addCableRoute(points, options = {}) {
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.45);
    const cableRadius = mm(Number(options.radiusMm || 4));
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 52, cableRadius, 10, false),
      new THREE.MeshStandardMaterial({
        color: Number(options.color || 0x171d28),
        roughness: 0.66,
        metalness: 0.16
      })
    );
    this.cableGroup.add(tube);

    if (options.sleeve) {
      const sleeve = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 52, cableRadius * 0.52, 8, false),
        new THREE.MeshStandardMaterial({ color: Number(options.sleeveColor || 0x566781), roughness: 0.3, metalness: 0.12 })
      );
      this.cableGroup.add(sleeve);
    }
  }

  getCableBlockers(excluded = []) {
    const excludeSet = new Set(excluded);
    return Object.entries(this.placements)
      .filter(([key, value]) => value?.box && !excludeSet.has(key) && key !== "case")
      .map(([, value]) => value.box.clone().expandByScalar(mm(5)));
  }

  cableRouteCollides(points, blockedBoxes, options = {}) {
    if (!Array.isArray(points) || points.length < 2 || !blockedBoxes.length) return false;
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.45);
    const sampleCount = 68;
    const trimStart = Math.max(0, Math.min(0.45, Number(options.trimStart || 0)));
    const trimEnd = Math.max(0, Math.min(0.45, Number(options.trimEnd || 0)));
    const from = trimStart;
    const to = 1 - trimEnd;
    for (let i = 0; i <= sampleCount; i += 1) {
      const t = from + ((to - from) * (i / sampleCount));
      const p = curve.getPoint(t);
      if (blockedBoxes.some((box) => box.containsPoint(p))) return true;
    }
    return false;
  }

  pickCableRoute(candidates, blockedBoxes, options = {}) {
    for (const candidate of candidates) {
      if (!this.cableRouteCollides(candidate, blockedBoxes, options)) {
        return candidate;
      }
    }
    return candidates[0] || null;
  }

  buildPowerCables(selection) {
    this.clearCableGeometry();
    if (!this.placements.psu || !this.placements.mobo || !this.placements.gpu) return;

    const psu = this.placements.psu.centerMm;
    const mobo = this.placements.mobo.centerMm;
    const gpu = this.placements.gpu.centerMm;
    const psuSize = this.placements.psu.sizeMm;
    const moboSize = this.placements.mobo.sizeMm;
    const gpuSize = this.placements.gpu.sizeMm;

    const premiumRouting = selection.cableMgmt?.name?.toLowerCase?.().includes("app") || selection.cableMgmt?.name?.toLowerCase?.().includes("premium");
    const sleeve = Boolean(selection.customCable?.id);
    const sleeveColor = sleeve ? 0x78a6ff : 0x566781;
    const caseSize = this.placements.case?.sizeMm || { x: 440, y: 450, z: 220 };
    const backChamberZ = -caseSize.z / 2 + 12;
    const upperBackY = (caseSize.y / 2) - 26;

    const mobo24Start = new THREE.Vector3(mm(psu.x - (psuSize.x * 0.35)), mm(psu.y + 34), mm(psu.z + (psuSize.z * 0.35)));
    const mobo24End = new THREE.Vector3(mm(mobo.x + (moboSize.x * 0.38)), mm(mobo.y - (moboSize.y * 0.16)), mm(mobo.z - (moboSize.z / 2) - 3));
    const mobo24Candidates = [
      [
        mobo24Start,
        new THREE.Vector3(mm(psu.x - (psuSize.x * 0.44)), mm(psu.y + 64), mm(backChamberZ)),
        new THREE.Vector3(mm(mobo.x + (moboSize.x * 0.52)), mm(mobo.y - 44), mm(backChamberZ)),
        new THREE.Vector3(mm(mobo.x + (moboSize.x * 0.47)), mm(mobo.y - 30), mm(mobo24End.z)),
        mobo24End
      ],
      [
        mobo24Start,
        new THREE.Vector3(mm(psu.x - (psuSize.x * 0.42)), mm(psu.y + 78), mm(backChamberZ + 8)),
        new THREE.Vector3(mm(mobo.x + (moboSize.x * 0.5)), mm(mobo.y - 62), mm(backChamberZ + 8)),
        new THREE.Vector3(mm(mobo.x + (moboSize.x * 0.42)), mm(mobo.y - 24), mm(mobo24End.z)),
        mobo24End
      ]
    ];
    const mobo24Route = this.pickCableRoute(mobo24Candidates, this.getCableBlockers(["psu"]), { trimStart: 0.08, trimEnd: 0.14 });
    if (mobo24Route) this.addCableRoute(mobo24Route, { radiusMm: 5.2, sleeve, sleeveColor, color: 0x1b2230 });

    const cpu8Start = new THREE.Vector3(mm(psu.x - (psuSize.x * 0.28)), mm(psu.y + 34), mm(psu.z + (psuSize.z * 0.18)));
    const cpu8End = new THREE.Vector3(mm(mobo.x - (moboSize.x * 0.43)), mm(mobo.y + (moboSize.y * 0.48)), mm(mobo.z - (moboSize.z / 2) - 3));
    const cpu8Candidates = [
      [
        cpu8Start,
        new THREE.Vector3(mm(psu.x - (psuSize.x * 0.36)), mm(psu.y + 118), mm(backChamberZ)),
        new THREE.Vector3(mm(mobo.x - (moboSize.x * 0.12)), mm(upperBackY), mm(backChamberZ)),
        new THREE.Vector3(mm(mobo.x - (moboSize.x * 0.36)), mm(mobo.y + (moboSize.y * 0.5)), mm(cpu8End.z)),
        cpu8End
      ],
      [
        cpu8Start,
        new THREE.Vector3(mm(psu.x - (psuSize.x * 0.4)), mm(psu.y + 140), mm(backChamberZ + 8)),
        new THREE.Vector3(mm(mobo.x - (moboSize.x * 0.06)), mm(upperBackY - 22), mm(backChamberZ + 8)),
        new THREE.Vector3(mm(mobo.x - (moboSize.x * 0.35)), mm(mobo.y + (moboSize.y * 0.48)), mm(cpu8End.z)),
        cpu8End
      ]
    ];
    const cpu8Route = this.pickCableRoute(cpu8Candidates, this.getCableBlockers(["psu", "cpuBlock"]), { trimStart: 0.08, trimEnd: 0.14 });
    if (cpu8Route) this.addCableRoute(cpu8Route, { radiusMm: 3.6, sleeve, sleeveColor, color: 0x202736 });

    const gpuStart = new THREE.Vector3(mm(psu.x - (psuSize.x * 0.2)), mm(psu.y + 24), mm(psu.z + (psuSize.z * 0.24)));
    const gpuEnd = new THREE.Vector3(mm(gpu.x + (gpuSize.x * 0.36)), mm(gpu.y + 16), mm(gpu.z + (gpuSize.z / 2) + 2));
    const gpuCandidates = [
      [
        gpuStart,
        new THREE.Vector3(mm(psu.x - (psuSize.x * 0.52)), mm(psu.y + 84), mm(backChamberZ)),
        new THREE.Vector3(mm(gpu.x + 38), mm(gpu.y + 78), mm(backChamberZ)),
        new THREE.Vector3(mm(gpu.x + 34), mm(gpu.y + 54), mm(gpuEnd.z)),
        gpuEnd
      ],
      [
        gpuStart,
        new THREE.Vector3(mm(psu.x - (psuSize.x * 0.56)), mm(psu.y + 118), mm(backChamberZ + 6)),
        new THREE.Vector3(mm(gpu.x + 20), mm(gpu.y + 98), mm(backChamberZ + 6)),
        new THREE.Vector3(mm(gpu.x + 34), mm(gpu.y + 62), mm(gpuEnd.z)),
        gpuEnd
      ]
    ];
    const gpuRoute = this.pickCableRoute(gpuCandidates, this.getCableBlockers(["psu", "gpu"]), { trimStart: 0.08, trimEnd: 0.12 });
    if (gpuRoute) this.addCableRoute(gpuRoute, { radiusMm: 4.2, sleeve, sleeveColor, color: 0x1a202a });
  }

  tryBuildTubes(selection) {
    this.clearTubeGeometry();

    const tubeDefaults = constraintsData.defaults.tube;
    const isLiquid = selection.cooling?.type === "aio" || selection.cooling?.type === "custom";
    if (!isLiquid || !this.placements.radiator || !this.placements.cpuBlock) {
      if (curveStatusEl) curveStatusEl.textContent = "Aucun tuyau actif (choisis un AIO ou watercooling custom).";
      return;
    }

    const profile = this.buildCaseProfile(selection);
    const curveData = this.computeCurvePoints(selection);
    if (!curveData) return;

    const curve = new THREE.CatmullRomCurve3([curveData.start, curveData.c1, curveData.c2, curveData.end], false, "catmullrom", 0.45);

    const length = curve.getLength() / MM_TO_UNIT;
    const sampled = curve.getPoints(42);
    const minRadius = this.minCurveRadius(sampled) / MM_TO_UNIT;
    const forbiddenReason = this.curveIntersectsForbidden(curve, profile);

    const maxLen = Number(tubeDefaults.maxLength || 900);
    const minBend = Number(tubeDefaults.minBendRadius || 30);

    let rejectReason = "";
    if (length > maxLen) rejectReason = `Tuyau trop long (${Math.round(length)} mm > ${maxLen} mm).`;
    else if (minRadius < minBend) rejectReason = `Rayon de courbure insuffisant (${Math.round(minRadius)} mm < ${minBend} mm).`;
    else if (forbiddenReason) rejectReason = forbiddenReason;

    if (rejectReason) {
      if (tubeCtrlXEl) tubeCtrlXEl.value = String(this.lastValidTubeOffsets.x);
      if (tubeCtrlYEl) tubeCtrlYEl.value = String(this.lastValidTubeOffsets.y);
      if (tubeCtrlZEl) tubeCtrlZEl.value = String(this.lastValidTubeOffsets.z);
      if (curveStatusEl) curveStatusEl.textContent = `Action bloquée: ${rejectReason}`;
      return;
    }

    this.lastValidTubeOffsets = { ...curveData.offsets };

    const tubeRadius = mm(Number(tubeDefaults.radius || 6));
    const tubeGeometry = new THREE.TubeGeometry(curve, 66, tubeRadius, 14, false);
    const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0x4de4ff, roughness: 0.32, metalness: 0.25 });
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    this.tubeGroup.add(tubeMesh);

    const tubeHighlight = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 66, tubeRadius * 0.45, 10, false),
      new THREE.MeshStandardMaterial({ color: 0xbaf7ff, roughness: 0.21, metalness: 0.05 })
    );
    this.tubeGroup.add(tubeHighlight);

    this.placements.tube = {
      curve,
      lengthMm: Math.round(length),
      minBendMm: Math.round(minRadius),
      controlPointsMm: {
        start: [Math.round(curveData.start.x / MM_TO_UNIT), Math.round(curveData.start.y / MM_TO_UNIT), Math.round(curveData.start.z / MM_TO_UNIT)],
        c1: [Math.round(curveData.c1.x / MM_TO_UNIT), Math.round(curveData.c1.y / MM_TO_UNIT), Math.round(curveData.c1.z / MM_TO_UNIT)],
        c2: [Math.round(curveData.c2.x / MM_TO_UNIT), Math.round(curveData.c2.y / MM_TO_UNIT), Math.round(curveData.c2.z / MM_TO_UNIT)],
        end: [Math.round(curveData.end.x / MM_TO_UNIT), Math.round(curveData.end.y / MM_TO_UNIT), Math.round(curveData.end.z / MM_TO_UNIT)]
      },
      offsets: { ...curveData.offsets }
    };

    if (curveStatusEl) curveStatusEl.textContent = `OK: ${Math.round(length)} mm, rayon mini ${Math.round(minRadius)} mm.`;
  }

  renderWarnings() {
    if (!warningsEl) return;
    warningsEl.innerHTML = "";

    if (!this.conflicts.length) {
      warningsEl.innerHTML = '<div class="is-ok">Compatibilité physique valide sur la simulation actuelle.</div>';
      return;
    }

    this.conflicts.forEach((text) => {
      const row = document.createElement("div");
      row.className = "is-bad";
      row.textContent = `• ${text}`;
      warningsEl.appendChild(row);
    });
  }

  refreshInspector(selection) {
    if (!listEl) return;
    const rows = [
      ["Usage", selection.usage || "non défini"],
      ["CPU", `${selection.cpu?.brand || "-"} ${selection.cpu?.name || "-"}`],
      ["Carte mère", `${selection.mobo?.brand || "-"} ${selection.mobo?.name || "-"}`],
      ["RAM", `${selection.ram?.brand || "-"} ${selection.ram?.name || "-"}`],
      ["GPU", `${selection.gpu?.brand || "-"} ${selection.gpu?.name || "-"}`],
      ["Stockage", `${selection.storage?.brand || "-"} ${selection.storage?.name || "-"}`],
      ["Alimentation", `${selection.psu?.brand || "-"} ${selection.psu?.name || "-"}`],
      ["Boîtier", `${selection.case?.brand || "-"} ${selection.case?.name || "-"}`],
      ["Refroidissement", `${selection.cooling?.brand || "-"} ${selection.cooling?.name || "-"}`],
      ["Câbles", `${selection.customCable?.brand || "-"} ${selection.customCable?.name || "-"}`],
      ["Cable management", `${selection.cableMgmt?.brand || "-"} ${selection.cableMgmt?.name || "-"}`],
      ["Traitement", `${selection.delivery?.brand || "-"} ${selection.delivery?.name || "-"}`]
    ];

    listEl.innerHTML = "";
    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "pc3d-item";
      row.textContent = `${label}: ${value}`;
      listEl.appendChild(row);
    });
  }

  normalizeModelCandidate(entry) {
    if (!entry) return null;
    if (typeof entry === "string") return { url: entry };
    if (typeof entry === "object" && entry.url) return entry;
    return null;
  }

  getModelCandidates(componentType, selected) {
    const registry = this.modelManifest?.models?.[componentType];
    if (!registry || typeof registry !== "object") return [];
    const out = [];
    if (selected?.id && Array.isArray(registry.byId?.[selected.id])) {
      out.push(...registry.byId[selected.id]);
    }
    if (selected?.brand && registry.byBrand && typeof registry.byBrand === "object") {
      const brandNeedle = String(selected.brand).toLowerCase();
      const direct = Array.isArray(registry.byBrand[selected.brand]) ? registry.byBrand[selected.brand] : null;
      if (direct) {
        out.push(...direct);
      } else {
        const brandKey = Object.keys(registry.byBrand).find((key) => String(key).toLowerCase() === brandNeedle);
        if (brandKey && Array.isArray(registry.byBrand[brandKey])) {
          out.push(...registry.byBrand[brandKey]);
        }
      }
    }
    if (Array.isArray(registry.default)) out.push(...registry.default);
    return out.map((entry) => this.normalizeModelCandidate(entry)).filter(Boolean);
  }

  cloneModelTemplate(template) {
    const clone = template.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      if (child.geometry) child.geometry = child.geometry.clone();
      if (Array.isArray(child.material)) {
        child.material = child.material.map((mat) => mat?.clone?.() || mat);
      } else if (child.material) {
        child.material = child.material.clone();
      }
    });
    return clone;
  }

  async loadModelObject(url) {
    if (!url) throw new Error("model-url-empty");
    if (!this.modelCache.has(url)) {
      const ext = (url.split("?")[0].split(".").pop() || "").toLowerCase();
      let loadPromise;
      if (ext === "fbx") {
        loadPromise = this.fbxLoader.loadAsync(url).then((obj) => obj || null);
      } else if (ext === "obj") {
        loadPromise = this.objLoader.loadAsync(url).then((obj) => obj || null);
      } else {
        loadPromise = this.gltfLoader.loadAsync(url).then((gltf) => gltf?.scene || gltf?.scenes?.[0] || null);
      }
      this.modelCache.set(url, loadPromise);
    }
    const template = await this.modelCache.get(url);
    if (!template) throw new Error("model-empty-scene");
    return this.cloneModelTemplate(template);
  }

  getOrthogonalRotations() {
    if (Array.isArray(this._orthogonalRotations) && this._orthogonalRotations.length) {
      return this._orthogonalRotations;
    }
    const out = [];
    const vals = [0, 90, 180, 270];
    for (const x of vals) {
      for (const y of vals) {
        for (const z of vals) {
          out.push([x, y, z]);
        }
      }
    }
    this._orthogonalRotations = out;
    return this._orthogonalRotations;
  }

  evaluateRotationScore(size, target) {
    const sx = Number(size.x || 0);
    const sy = Number(size.y || 0);
    const sz = Number(size.z || 0);
    if (sx <= 1e-6 || sy <= 1e-6 || sz <= 1e-6) return -1e9;

    const fit = Math.min(target.x / sx, target.y / sy, target.z / sz);
    if (!Number.isFinite(fit) || fit <= 0) return -1e9;

    const vx = sx * fit;
    const vy = sy * fit;
    const vz = sz * fit;
    const fill = (vx * vy * vz) / Math.max(1e-8, target.x * target.y * target.z);

    const rx = sx / sy;
    const ry = sy / sz;
    const rz = sx / sz;
    const tx = target.x / target.y;
    const ty = target.y / target.z;
    const tz = target.x / target.z;
    const ratioPenalty = Math.abs(Math.log((rx + 1e-8) / (tx + 1e-8)))
      + Math.abs(Math.log((ry + 1e-8) / (ty + 1e-8)))
      + Math.abs(Math.log((rz + 1e-8) / (tz + 1e-8)));

    return fill - (ratioPenalty * 0.04);
  }

  resolveRotationDeg(model, target, candidate = {}) {
    if (Array.isArray(candidate.rotationDeg)) return candidate.rotationDeg;

    const shouldAutoRotate = candidate.autoRotate !== false;
    const candidates = Array.isArray(candidate.rotationCandidatesDeg) && candidate.rotationCandidatesDeg.length
      ? candidate.rotationCandidatesDeg
      : shouldAutoRotate
        ? this.getOrthogonalRotations()
        : [[0, 0, 0]];

    let bestRot = [0, 0, 0];
    let bestScore = -1e9;
    const basePos = model.position.clone();

    for (const rot of candidates) {
      model.rotation.set(
        THREE.MathUtils.degToRad(Number(rot[0] || 0)),
        THREE.MathUtils.degToRad(Number(rot[1] || 0)),
        THREE.MathUtils.degToRad(Number(rot[2] || 0))
      );
      model.position.copy(basePos);
      model.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const score = this.evaluateRotationScore(size, target);
      if (score > bestScore) {
        bestScore = score;
        bestRot = [Number(rot[0] || 0), Number(rot[1] || 0), Number(rot[2] || 0)];
      }
    }

    model.rotation.set(0, 0, 0);
    model.position.copy(basePos);
    model.updateMatrixWorld(true);
    return bestRot;
  }

  fitModelToPlacement(model, placement, candidate = {}) {
    const target = new THREE.Vector3(mm(placement.sizeMm.x), mm(placement.sizeMm.y), mm(placement.sizeMm.z));
    const rotationDeg = this.resolveRotationDeg(model, target, candidate);
    model.rotation.set(
      THREE.MathUtils.degToRad(Number(rotationDeg[0] || 0)),
      THREE.MathUtils.degToRad(Number(rotationDeg[1] || 0)),
      THREE.MathUtils.degToRad(Number(rotationDeg[2] || 0))
    );
    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    if (size.x <= 0 || size.y <= 0 || size.z <= 0) return false;

    if ((candidate.scaleMode || "contain") === "stretch") {
      model.scale.set(target.x / size.x, target.y / size.y, target.z / size.z);
    } else {
      const scalar = Math.min(target.x / size.x, target.y / size.y, target.z / size.z);
      model.scale.multiplyScalar(scalar);
    }

    model.updateMatrixWorld(true);
    box.setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const offsetMm = candidate.offsetMm || [0, 0, 0];
    model.position.add(new THREE.Vector3(mm(offsetMm[0] || 0), mm(offsetMm[1] || 0), mm(offsetMm[2] || 0)));
    model.updateMatrixWorld(true);
    return true;
  }

  modelFitsPlacementVolume(model, placement, marginMm = 26) {
    if (!model || !placement?.box) return false;
    model.updateMatrixWorld(true);
    const modelBox = new THREE.Box3().setFromObject(model);
    const allowed = placement.box.clone().expandByScalar(mm(marginMm));
    return allowed.containsBox(modelBox);
  }

  modelFitsCaseVolume(model, marginMm = 18) {
    if (!model || !this.placements.case?.box) return true;
    model.updateMatrixWorld(true);
    const modelBox = new THREE.Box3().setFromObject(model);
    const allowed = this.placements.case.box.clone().expandByScalar(mm(marginMm));
    return allowed.containsBox(modelBox);
  }

  swapPlacementMesh(placementId, nextMesh) {
    const placement = this.placements[placementId];
    if (!placement || !nextMesh) return false;

    const oldMesh = placement.mesh;
    const oldPos = oldMesh?.position?.clone() || new THREE.Vector3();
    const oldRot = oldMesh?.rotation?.clone() || new THREE.Euler();

    if (oldMesh) {
      this.componentGroup.remove(oldMesh);
      disposeHierarchy(oldMesh);
    }

    nextMesh.position.copy(oldPos);
    nextMesh.rotation.copy(oldRot);
    this.componentGroup.add(nextMesh);
    placement.mesh = nextMesh;
    return true;
  }

  async decoratePlacementWithModel({ placementId, componentType, selected }, token) {
    if (token !== this.renderVersion || !selected) return;
    const placement = this.placements[placementId];
    if (!placement) return;

    const candidates = this.getModelCandidates(componentType, selected);
    if (!candidates.length) return;

    for (const candidate of candidates) {
      try {
        const model = await this.loadModelObject(candidate.url);
        if (token !== this.renderVersion) {
          disposeHierarchy(model);
          return;
        }
        const fitted = this.fitModelToPlacement(model, placement, candidate);
        if (!fitted) {
          disposeHierarchy(model);
          continue;
        }

        const currentPos = placement.mesh?.position?.clone() || new THREE.Vector3(mm(placement.centerMm.x), mm(placement.centerMm.y), mm(placement.centerMm.z));
        const currentRot = placement.mesh?.rotation?.clone() || new THREE.Euler();
        model.position.copy(currentPos);
        model.rotation.copy(currentRot);
        model.updateMatrixWorld(true);

        const placementMarginMm = Number(candidate.placementMarginMm ?? (placementId.startsWith("caseFan") ? 46 : 28));
        const caseMarginMm = Number(candidate.caseMarginMm ?? (placementId.startsWith("caseFan") ? 26 : 18));
        if (!this.modelFitsPlacementVolume(model, placement, placementMarginMm)) {
          disposeHierarchy(model);
          continue;
        }
        if (placementId !== "case" && !this.modelFitsCaseVolume(model, caseMarginMm)) {
          disposeHierarchy(model);
          continue;
        }

        this.swapPlacementMesh(placementId, model);
        if (placementId === "case") this.captureCaseDoorRefs();
        return;
      } catch {
        // fallback to procedural geometry if the model source is unavailable
      }
    }
  }

  async decorateWithModels(selection, token) {
    if (token !== this.renderVersion || !selection) return;
    const coolingType = selection.cooling?.type || "none";
    const cpuPlacementType = (coolingType === "aio" || coolingType === "custom")
      ? "cpu_block"
      : coolingType === "air"
        ? "cpu_cooler_air"
        : "cpu_cooler_stock";
    const cpuPlacementSelection = cpuPlacementType === "cpu_cooler_stock"
      ? (selection.cpu || selection.cooling)
      : selection.cooling;
    const jobs = [
      { placementId: "mobo", componentType: "motherboard", selected: selection.mobo },
      { placementId: "gpu", componentType: "gpu", selected: selection.gpu },
      { placementId: "psu", componentType: "psu", selected: selection.psu },
      { placementId: "storage", componentType: "storage", selected: selection.storage },
      { placementId: "cpuBlock", componentType: cpuPlacementType, selected: cpuPlacementSelection },
      { placementId: "radiator", componentType: "radiator", selected: selection.cooling }
    ];

    Object.keys(this.placements)
      .filter((key) => key.startsWith("caseFan"))
      .forEach((fanPlacementId) => jobs.push({ placementId: fanPlacementId, componentType: "case_fan", selected: selection.case || selection.cooling }));

    Object.keys(this.placements)
      .filter((key) => key.startsWith("ram"))
      .forEach((ramPlacementId) => jobs.push({ placementId: ramPlacementId, componentType: "ram", selected: selection.ram }));

    await Promise.all(jobs.map((job) => this.decoratePlacementWithModel(job, token)));
  }

  updateFromState(state) {
    this.latestState = state || null;
    if (!this.latestState?.selection) {
      if (tubeBlockEl) tubeBlockEl.style.display = "";
      if (overlayEl) {
        overlayEl.classList.remove("is-hidden");
        overlayEl.textContent = "Complète la configuration puis clique sur Aperçu.";
      }
      return;
    }

    const isLiquid = this.latestState.selection.cooling?.type === "aio" || this.latestState.selection.cooling?.type === "custom";
    if (tubeBlockEl) tubeBlockEl.style.display = isLiquid ? "" : "none";

    this.buildPlacement(this.latestState.selection);

    if (overlayEl) {
      overlayEl.classList.add("is-hidden");
    }
  }

  exportSerializableState() {
    if (!this.latestState?.selection) return null;
    return {
      generatedAt: new Date().toISOString(),
      selection: {
        cpu: this.latestState.selection.cpu?.id || "",
        mobo: this.latestState.selection.mobo?.id || "",
        ram: this.latestState.selection.ram?.id || "",
        gpu: this.latestState.selection.gpu?.id || "",
        storage: this.latestState.selection.storage?.id || "",
        psu: this.latestState.selection.psu?.id || "",
        case: this.latestState.selection.case?.id || "",
        cooling: this.latestState.selection.cooling?.id || "",
        customCable: this.latestState.selection.customCable?.id || "",
        cableMgmt: this.latestState.selection.cableMgmt?.id || "",
        delivery: this.latestState.selection.delivery?.id || "",
        usage: this.latestState.selection.usage || ""
      },
      collisions: [...this.conflicts],
      tube: this.placements.tube
        ? {
            lengthMm: this.placements.tube.lengthMm,
            minBendMm: this.placements.tube.minBendMm,
            controlPointsMm: this.placements.tube.controlPointsMm,
            offsets: this.placements.tube.offsets
          }
        : null
    };
  }

  async captureSnapshot(options = {}) {
    const width = Number(options.width || 480);
    const height = Number(options.height || 270);
    const quality = Number(options.quality || 0.68);

    this.renderer.render(this.scene, this.camera);

    const srcCanvas = this.renderer.domElement;
    const temp = document.createElement("canvas");
    temp.width = width;
    temp.height = height;
    const ctx = temp.getContext("2d");
    if (!ctx) return "";

    ctx.drawImage(srcCanvas, 0, 0, width, height);
    return temp.toDataURL("image/jpeg", quality);
  }
}

async function boot3D() {
  if (!canvasEl) return;
  if (!(window.WebGLRenderingContext || window.WebGL2RenderingContext)) {
    if (overlayEl) overlayEl.textContent = "WebGL indisponible sur cet appareil.";
    return;
  }

  await loadConstraints();
  const viewer = new PC3DViewer(canvasEl);

  window.AE3D = {
    captureSnapshot: (opts) => viewer.captureSnapshot(opts),
    exportSerializableState: () => viewer.exportSerializableState(),
    refreshFromLatest: () => {
      const latest = window.getAELatestConfigState?.();
      if (latest) viewer.updateFromState(latest);
    },
    resize: () => viewer.resize()
  };

  const latest = window.getAELatestConfigState?.();
  if (latest) viewer.updateFromState(latest);

  window.addEventListener("ae:config-state", (event) => {
    viewer.updateFromState(event.detail || null);
  });
}

boot3D().catch((err) => {
  console.error("PC3D init error", err);
  if (overlayEl) overlayEl.textContent = `Erreur de chargement 3D: ${err?.message || "inconnue"}.`;
});
