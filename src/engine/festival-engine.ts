import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createTown, makeLantern } from './town';
import { placeHand, orientPalm } from './arm-ik';
import { createBoats } from './boats';
import { advanceFlight } from './lantern-flight';
import { releasePose } from './release-motion';
import { createRiverHorizon } from './river-horizon';
import { createMoon } from './moon';

type Callbacks = {
  onReleased: () => void;
  onArrived: () => void;
  onSelect: (id: number) => void;
  onProject: (positions: { id: number; x: number; y: number; visible: boolean }[]) => void;
};
type Flyer = {
  root: THREE.Group;
  x: number;
  y: number;
  z: number;
  phase: number;
  speed: number;
  interactive: boolean;
};

export class FestivalEngine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(44, 1, 0.1, 150);
  private frame = 0;
  private previousTime = 0;
  private elapsed = 0;
  private phase: 'idle' | 'release' | 'transition' | 'sky' = 'idle';
  private phaseTime = 0;
  private mixers: THREE.AnimationMixer[] = [];
  private actions: THREE.AnimationAction[] = [];
  private hands: {
    bone: THREE.Bone;
    side: number;
    depthSide: number;
    fingerAxis: THREE.Vector3;
    palmAxis: THREE.Vector3;
  }[] = [];
  private restingArms: { bone: THREE.Bone; rotation: THREE.Quaternion }[] = [];
  private flyers: Flyer[] = [];
  private focusedLantern: number | null = null;
  private mainLantern = makeLantern(0.78);
  private light = new THREE.PointLight(0xffb763, 0.65, 4, 2);
  private town: ReturnType<typeof createTown>;
  private boats: ReturnType<typeof createBoats>;
  private moon: THREE.Sprite;
  private moonHalo: THREE.Sprite;
  private resizeObserver: ResizeObserver;
  private reduced = false;
  private disposed = false;
  private assets: THREE.Group[] = [];
  private pointer = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private target = new THREE.Vector3();
  private projected = new THREE.Vector3();
  private baseCamera = new THREE.Vector3();
  private skyCamera = new THREE.Vector3(0, 8, 24);
  private baseTarget = new THREE.Vector3(0, 2.2, -2);
  private skyTarget = new THREE.Vector3(0, 20, -15);
  private visibilityHandler = () => {
    this.previousTime = 0;
  };
  private pointerHandler = (event: PointerEvent) => {
    if (this.phase !== 'sky') return;
    const bounds = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      (-(event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const objects = this.flyers.filter((f) => f.interactive).map((f) => f.root);
    const hit = this.raycaster.intersectObjects(objects, true)[0];
    if (!hit) return;
    let object: THREE.Object3D | null = hit.object;
    while (object && object.userData.lanternId === undefined) object = object.parent;
    if (object) this.callbacks.onSelect(object.userData.lanternId);
  };

  constructor(
    private container: HTMLElement,
    private callbacks: Callbacks,
  ) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    this.renderer.setClearColor(0x101e2b);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.setAttribute(
      'aria-label',
      'Phố cổ bên sông với thuyền, đèn lễ hội và bầu trời sao',
    );
    this.renderer.domElement.setAttribute('role', 'img');
    this.container.append(this.renderer.domElement);
    this.scene.fog = new THREE.FogExp2(0x101e2b, 0.012);
    this.scene.add(new THREE.HemisphereLight(0x8fb4cf, 0x32251f, 1.15));
    const moonlight = new THREE.DirectionalLight(0xb4d3ef, 1.35);
    moonlight.position.set(-5, 12, 6);
    this.scene.add(moonlight);
    const warm = new THREE.DirectionalLight(0xffc087, 0.85);
    warm.position.set(4, 5, 10);
    this.scene.add(warm);
    this.town = createTown(this.scene);
    createRiverHorizon(this.town.town);
    this.boats = createBoats(this.town.town);
    this.scene.add(this.mainLantern);
    this.scene.add(this.light);
    this.moon = createMoon(this.scene);
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = haloCanvas.height = 128;
    const context = haloCanvas.getContext('2d')!;
    const gradient = context.createRadialGradient(64, 64, 12, 64, 64, 64);
    gradient.addColorStop(0, '#ffe5aa50');
    gradient.addColorStop(0.45, '#ffe5aa1a');
    gradient.addColorStop(1, '#ffe5aa00');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(haloCanvas),
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    );
    this.moonHalo = halo;
    halo.scale.set(13, 13, 1);
    this.scene.add(halo);
    const stars = [];
    for (let i = 0; i < 500; i++) {
      const value = seeded(i + 31);
      stars.push((seeded(i + 4) - 0.5) * 150, 8 + value * 65, -65 + seeded(i + 300) * 60);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
    this.scene.add(
      new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
          color: 0xe1d2aa,
          size: 0.055,
          transparent: true,
          opacity: 0.65,
        }),
      ),
    );
    for (let i = 0; i < 100; i++) {
      const root = makeLantern(i < 12 ? 2.3 : 0.35 + seeded(i + 80) * 0.6);
      const flyer = {
        root,
        x: (seeded(i + 1) - 0.5) * 46,
        y: 5 + seeded(i + 11) * 29,
        z: -8 - seeded(i + 54) * 42,
        phase: seeded(i + 22) * Math.PI * 2,
        speed: i < 12 ? 0.65 + seeded(i + 40) * 0.45 : 0.12 + seeded(i + 40) * 0.22,
        interactive: i < 12,
      };
      root.userData.lanternId = i;
      this.flyers.push(flyer);
      this.scene.add(root);
    }
    // Large wish lamps travel through the same world as the background lamps.
    this.flyers.slice(0, 12).forEach((f, i) => {
      f.x = (seeded(i + 270) - 0.5) * 26;
      f.y = 7 + i * 2.45;
      f.z = -6 - seeded(i + 94) * 15;
    });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    document.addEventListener('visibilitychange', this.visibilityHandler);
    this.renderer.domElement.addEventListener('pointerup', this.pointerHandler);
    this.resize();
    this.reset();
    this.tick(0);
  }

  async load(onProgress: (done: number) => void) {
    const loader = new GLTFLoader();
    const models = await Promise.all(
      ['male', 'female'].map(async (kind, index) => {
        const gltf = await loader.loadAsync(`/models/characters/festival-${kind}.glb`);
        if (this.disposed) {
          this.disposeObject(gltf.scene);
          return null;
        }
        const model = gltf.scene;
        model.position.set(index === 0 ? -0.4 : 0.4, this.town.bridgeHeight, 0);
        // Face each other across the shared lantern, both hands on its lower rim.
        model.rotation.y = index === 0 ? Math.PI / 2 : -Math.PI / 2;
        this.scene.add(model);
        this.assets.push(model);
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.frustumCulled = false;
            for (const material of Array.isArray(object.material)
              ? object.material
              : [object.material]) {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.envMapIntensity = 0.6;
                if (material.transparent) material.depthWrite = false;
              }
            }
          }
        });
        const mixer = new THREE.AnimationMixer(model);
        const clip =
          gltf.animations.find((a) => a.name.includes('Lantern_Release')) ?? gltf.animations[0];
        if (!clip) throw new Error('Thiếu chuyển động thả đèn.');
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
        this.actions.push(action);
        model.traverse((object) => {
          if (object instanceof THREE.Bone && ['hand_l', 'hand_r'].includes(object.name)) {
            const side = index === 0 ? -1 : 1;
            object.updateWorldMatrix(true, true);
            const suffix = object.name.endsWith('_l') ? 'l' : 'r';
            const localPoint = (name: string) => {
              const joint = model.getObjectByName(name + suffix);
              return joint
                ? object.worldToLocal(joint.getWorldPosition(new THREE.Vector3()))
                : new THREE.Vector3(0, 0.1, 0);
            };
            const fingerAxis = localPoint('middle_01_').normalize();
            const indexAxis = localPoint('index_01_');
            const pinkyAxis = localPoint('pinky_01_');
            const palmAxis = indexAxis
              .cross(pinkyAxis)
              .normalize()
              .multiplyScalar(suffix === 'l' ? -1 : 1);
            if (palmAxis.lengthSq() < 0.01) palmAxis.set(0, 0, 1);
            this.hands.push({
              bone: object,
              side,
              depthSide: suffix === 'l' ? side : -side,
              fingerAxis,
              palmAxis,
            });
          }
        });
        mixer.setTime(0);
        // Cache the arm basis so IK never accumulates rotations across frames.
        model.traverse((object) => {
          if (
            object instanceof THREE.Bone &&
            ['upperarm_l', 'upperarm_r', 'lowerarm_l', 'lowerarm_r', 'hand_l', 'hand_r'].includes(
              object.name,
            )
          ) {
            this.restingArms.push({ bone: object, rotation: object.quaternion.clone() });
          }
        });
        this.mixers.push(mixer);
        onProgress(this.mixers.length);
        return model;
      }),
    );
    return models;
  }

  setReduced(value: boolean) {
    this.reduced = value;
  }
  setFocusedLantern(id: number | null) {
    this.focusedLantern = id;
  }
  release() {
    if (this.phase !== 'idle') return;
    this.phase = 'release';
    this.phaseTime = 0;
  }
  reset() {
    this.phase = 'idle';
    this.phaseTime = 0;
    this.mainLantern.position.set(0, this.town.bridgeHeight + 1.16, 0);
    this.mainLantern.rotation.set(0, 0, 0);
    this.mainLantern.visible = true;
    this.focusedLantern = null;
    this.flyers.slice(0, 12).forEach((flyer, i) => {
      flyer.y = 7 + i * 2.45;
    });
    this.actions.forEach((action) => action.reset().play());
    this.mixers.forEach((mixer) => mixer.setTime(0));
    this.alignHands(0);
    this.camera.position.copy(this.baseCamera);
    this.target.copy(this.baseTarget);
    this.camera.lookAt(this.target);
  }

  private alignHands(progress: number) {
    this.restingArms.forEach(({ bone, rotation }) => bone.quaternion.copy(rotation));
    this.scene.updateMatrixWorld(true);
    const pose = releasePose(progress);
    for (const { bone, side, depthSide, fingerAxis, palmAxis } of this.hands) {
      const target = new THREE.Vector3(
        side * pose.hands.distance,
        this.town.bridgeHeight + pose.hands.y + 0.025,
        depthSide * pose.hands.depth,
      );
      const pole = new THREE.Vector3(side * 0.42, this.town.bridgeHeight + 0.92, depthSide * 0.38);
      placeHand(bone, target, 1, pole);
      const fingers = new THREE.Vector3(-side, 0.12, -depthSide * 0.12).lerp(
        new THREE.Vector3(0, -1, 0.04),
        pose.hands.relax,
      );
      const palm = new THREE.Vector3(0, 1, 0).lerp(
        new THREE.Vector3(0, 0, -depthSide),
        pose.hands.relax,
      );
      orientPalm(bone, fingerAxis, palmAxis, fingers, palm, 0.85);
    }
  }

  private resize() {
    const { width, height } = this.container.getBoundingClientRect();
    this.renderer.setSize(width, height);
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    const mobile = width < 650;
    this.baseCamera.set(mobile ? 2.5 : 3.4, mobile ? 6.3 : 5.4, mobile ? 17 : 13.5);
    this.skyCamera.set(0, 8, mobile ? 36 : 24);
    // Anchor within the final sky viewport instead of cropping a fixed world X on phones.
    const skyView = this.camera.clone();
    skyView.position.copy(this.skyCamera);
    skyView.lookAt(this.skyTarget);
    skyView.updateMatrixWorld();
    const direction = new THREE.Vector3(mobile ? -0.62 : -0.68, mobile ? 0.49 : 0.4, 0.8)
      .unproject(skyView)
      .sub(skyView.position)
      .normalize();
    this.moon.position.copy(skyView.position).addScaledVector(direction, 75);
    this.moon.scale.setScalar(mobile ? 5 : 5.2);
    this.moonHalo.position.copy(this.moon.position);
    if (this.phase === 'idle') this.reset();
  }

  private tick = (time: number) => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.tick);
    if (document.hidden) {
      this.previousTime = 0;
      return;
    }
    const dt = this.previousTime ? Math.min((time - this.previousTime) / 1000, 0.05) : 0;
    this.previousTime = time;
    this.elapsed += dt;
    this.phaseTime += dt;
    const y0 = this.town.bridgeHeight;
    if (this.phase === 'release') {
      const duration = this.reduced ? 1 : 6;
      const t = Math.min(1, this.phaseTime / duration);
      this.mixers.forEach((m) => m.setTime(t * 6));
      const pose = releasePose(t);
      this.mainLantern.position.set(pose.lantern.x, y0 + pose.lantern.y, pose.lantern.z);
      this.alignHands(t);
      if (t === 1) {
        this.phase = 'transition';
        this.phaseTime = 0;
        this.callbacks.onReleased();
      }
    } else if (this.phase === 'transition') {
      const t = Math.min(1, this.phaseTime / (this.reduced ? 0.25 : 5));
      this.camera.position.lerpVectors(this.baseCamera, this.skyCamera, smooth(t));
      this.target.lerpVectors(this.baseTarget, this.skyTarget, smooth(t));
      this.mainLantern.position.y = y0 + 4 + t * 8;
      this.mainLantern.position.x = 0.25 + t * 1.5;
      this.mainLantern.position.z = -0.18 - t * 7;

      if (t === 1) {
        this.phase = 'sky';
        this.phaseTime = 0;
        this.callbacks.onArrived();
      }
    }
    if (this.phase === 'idle') this.alignHands(0);
    else if (this.phase === 'transition' || this.phase === 'sky') this.alignHands(1);
    this.camera.lookAt(this.target);
    this.light.position.copy(this.mainLantern.position).add(new THREE.Vector3(0, 0.2, 0.3));
    this.camera.updateMatrixWorld();
    this.flyers.forEach((flyer, id) => {
      flyer.root.visible =
        !flyer.interactive || this.phase === 'transition' || this.phase === 'sky';
      const moving = !this.reduced && this.focusedLantern !== id;
      if (moving) flyer.phase += dt * 0.2;
      if (flyer.interactive) {
        flyer.y =
          5 +
          advanceFlight(
            (flyer.y - 5) / 34,
            dt,
            flyer.speed / 34,
            !moving || (this.phase !== 'sky' && this.phase !== 'transition'),
          ) *
            34;
      } else {
        if (moving) flyer.y += dt * flyer.speed;
        if (flyer.y > 42) flyer.y = 5;
      }
      flyer.root.position.set(flyer.x + Math.sin(flyer.phase) * 0.4, flyer.y, flyer.z);
      flyer.root.rotation.z = Math.sin(flyer.phase * 2) * 0.055;
    });
    this.boats.forEach((boat, index) => {
      const time = this.reduced ? 0 : this.elapsed;
      boat.root.position.set(
        index % 2 ? 2.15 : -2.15,
        -0.08 + (this.reduced ? 0 : Math.sin(time * 1.1 + index) * 0.018),
        boat.direction > 0
          ? -43 + ((time * 0.7 + boat.phase) % 62)
          : 19 - ((time * 0.55 + boat.phase) % 62),
      );
      boat.root.rotation.y = boat.direction > 0 ? 0 : Math.PI;
      boat.root.rotation.z = this.reduced ? 0 : Math.sin(time * 0.8 + index) * 0.012;
    });
    this.town.crowd.forEach((member) => {
      member.root.position.z =
        member.startZ +
        (this.reduced ? 0 : Math.sin(this.elapsed * 0.15 + member.phase) * 1.2 * member.direction);
      member.root.rotation.z = this.reduced ? 0 : Math.sin(this.elapsed * 2 + member.phase) * 0.012;
      member.limbs.forEach((limb, i) => {
        limb.rotation.x = this.reduced
          ? 0
          : Math.sin(this.elapsed * 3 + member.phase + (i % 2) * Math.PI) * 0.25;
      });
    });
    (this.town.water.material as THREE.ShaderMaterial).uniforms.time.value = this.reduced
      ? 0
      : this.elapsed;
    if (this.phase === 'sky') {
      const positions = this.flyers.slice(0, 12).map((f, id) => {
        this.projected
          .copy(f.root.position)
          .add(new THREE.Vector3(0, 0.2, 0))
          .project(this.camera);
        return {
          id,
          x: (this.projected.x + 1) * 50,
          y: (1 - this.projected.y) * 50,
          visible:
            this.projected.z < 1 &&
            Math.abs(this.projected.x) < 0.94 &&
            Math.abs(this.projected.y) < 0.75,
        };
      });
      this.callbacks.onProject(positions);
    }
    this.renderer.render(this.scene, this.camera);
  };

  private disposeObject(object: THREE.Object3D) {
    const geometry = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    object.traverse((item) => {
      if (!(
        item instanceof THREE.Mesh ||
        item instanceof THREE.Points ||
        item instanceof THREE.Line ||
        item instanceof THREE.Sprite
      ))
        return;
      if (!(item instanceof THREE.Sprite)) geometry.add(item.geometry);
      for (const material of Array.isArray(item.material) ? item.material : [item.material]) {
        materials.add(material);
        for (const value of Object.values(material))
          if (value instanceof THREE.Texture) textures.add(value);
      }
    });
    textures.forEach((t) => t.dispose());
    materials.forEach((m) => m.dispose());
    geometry.forEach((g) => g.dispose());
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.renderer.domElement.removeEventListener('pointerup', this.pointerHandler);
    this.mixers.forEach((m) => {
      m.stopAllAction();
      m.uncacheRoot(m.getRoot());
    });
    this.disposeObject(this.scene);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
function seeded(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
