import * as THREE from 'three';
import { makeGlow } from './glow';
import { streetLighting, type LanternStyle } from './street-lighting';

export const palette = {
  wood: 0x432d2b,
  darkWood: 0x261f24,
  stone: 0x827a71,
  roof: 0x182a35,
  gold: 0xb58b50,
  paper: 0xffcf82,
  red: 0x8f3932,
};
const materials = new Map<number, THREE.MeshStandardMaterial>();
export function mat(color: number, glow = false) {
  const key = glow ? color + 0x1000000 : color;
  if (!materials.has(key))
    materials.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.8,
        ...(glow ? { emissive: color, emissiveIntensity: 0.45 } : {}),
      }),
    );
  return materials.get(key)!;
}
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(1, 12, 8);
export function box(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  color: number,
  glow = false,
) {
  const mesh = new THREE.Mesh(boxGeometry, mat(color, glow));
  mesh.position.set(x, y, z);
  mesh.scale.set(w, h, d);
  mesh.castShadow = !glow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
export function orb(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  size: number,
  color: number,
  glow = false,
) {
  const mesh = new THREE.Mesh(sphereGeometry, mat(color, glow));
  mesh.position.set(x, y, z);
  mesh.scale.setScalar(size);
  parent.add(mesh);
  return mesh;
}
function beam(
  parent: THREE.Object3D,
  a: THREE.Vector3,
  b: THREE.Vector3,
  width: number,
  color: number,
) {
  const delta = b.clone().sub(a);
  const mesh = box(parent, 0, 0, 0, width, delta.length(), width, color);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return mesh;
}

export function makeLantern(scale = 1) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.15, 0.48, 24, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0xffce88,
      emissive: 0xff8c2e,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide,
      roughness: 0.85,
    }),
  );
  body.position.y = 0.25;
  group.add(body);
  box(group, 0, 0.49, 0, 0.34, 0.025, 0.34, palette.gold);
  box(group, 0, 0.015, 0, 0.23, 0.018, 0.23, palette.wood);
  for (const x of [-0.14, 0.14])
    for (const z of [-0.14, 0.14]) {
      beam(
        group,
        new THREE.Vector3(x * 0.75, 0, z * 0.75),
        new THREE.Vector3(x, 0.48, z),
        0.009,
        palette.gold,
      );
    }
  orb(group, 0, 0.06, 0, 0.045, 0xffbe5e, true);
  const glow = makeGlow(0xffac4c, 1.5, 0.38);
  glow.position.y = 0.26;
  group.add(glow);
  group.scale.setScalar(scale);
  return group;
}

const hexLanternGeometry = new THREE.CylinderGeometry(0.19, 0.19, 0.46, 6);

export function hangingLantern(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  scale = 1,
  style: LanternStyle = 'round',
  color = 0xd96a35,
) {
  const decoration = new THREE.Group();
  decoration.position.set(x, y, z);
  decoration.scale.setScalar(scale);
  parent.add(decoration);
  parent = decoration;
  if (style === 'box') {
    box(parent, 0, 0, 0, 0.32, 0.42, 0.28, color, true);
    for (const px of [-0.17, 0.17])
      for (const pz of [-0.15, 0.15]) {
        box(parent, px, 0, pz, 0.025, 0.46, 0.025, palette.darkWood);
      }
  } else if (style === 'hexagonal') {
    parent.add(new THREE.Mesh(hexLanternGeometry, mat(color, true)));
  } else {
    const lantern = orb(parent, 0, 0, 0, 0.22, color, true);
    lantern.scale.set(style === 'oval' ? 0.16 : 0.24, style === 'oval' ? 0.28 : 0.21, 0.21);
  }
  const halfHeight = style === 'oval' ? 0.28 : style === 'round' ? 0.21 : 0.23;
  const glow = makeGlow(color, style === 'box' ? 0.85 : 1.05, 0.24);
  parent.add(glow);
  box(parent, 0, halfHeight + 0.045, 0, 0.022, 0.09, 0.022, palette.gold);
  box(parent, 0, -halfHeight - 0.07, 0, 0.018, 0.14, 0.018, palette.gold);
  for (const sign of [-1, 1]) box(parent, 0, sign * halfHeight, 0, 0.21, 0.025, 0.21, palette.gold);
}

function roof(parent: THREE.Object3D, y: number, width: number, depth: number) {
  const shape = new THREE.Shape();
  const edge = width / 2 + 0.48;
  shape.moveTo(-edge, 0.36);
  shape.quadraticCurveTo(-edge + 0.28, -0.02, -width * 0.36, 0.15);
  shape.quadraticCurveTo(-width * 0.14, 0.42, 0, 1);
  shape.quadraticCurveTo(width * 0.14, 0.42, width * 0.36, 0.15);
  shape.quadraticCurveTo(edge - 0.28, -0.02, edge, 0.36);
  shape.lineTo(edge, 0.21);
  shape.quadraticCurveTo(width * 0.4, -0.15, 0, 0.83);
  shape.quadraticCurveTo(-width * 0.4, -0.15, -edge, 0.21);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: depth + 0.5,
    bevelEnabled: false,
    curveSegments: 8,
  });
  const mesh = new THREE.Mesh(geo, mat(palette.roof));
  mesh.position.set(0, y, -depth / 2 - 0.25);
  parent.add(mesh);
  // One buffer for all tile ridges, instead of a draw call per ridge.
  const tileLines: number[] = [];
  for (let z = -depth / 2 - 0.25; z <= depth / 2 + 0.25; z += 0.26) {
    let previous: THREE.Vector3 | null = null;
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24 - 0.5) * (width + 0.96);
      const u = Math.abs(x) / (width / 2 + 0.48);
      const h = 0.12 + 0.89 * Math.pow(1 - u, 1.9) + 0.23 * Math.pow(u, 12);
      const point = new THREE.Vector3(x, y + h, z);
      if (previous) tileLines.push(previous.x, previous.y, previous.z, point.x, point.y, point.z);
      previous = point;
    }
  }
  const tileGeometry = new THREE.BufferGeometry();
  tileGeometry.setAttribute('position', new THREE.Float32BufferAttribute(tileLines, 3));
  parent.add(
    new THREE.LineSegments(
      tileGeometry,
      new THREE.LineBasicMaterial({ color: 0x637078, transparent: true, opacity: 0.24 }),
    ),
  );
}

function building(parent: THREE.Object3D, x: number, z: number, index: number, side: number) {
  const house = new THREE.Group();
  const w = 2.65 + (index % 3) * 0.32;
  const depth = 2.8;
  const height = 2.75 + (index % 4) * 0.4 + (side > 0 ? 0.25 : 0);
  const lighting = streetLighting(index, side);
  box(
    house,
    0,
    height / 2,
    0,
    w,
    height,
    depth,
    [0x5b3f33, 0x665345, 0x4c4139, 0x644336][index % 4],
  );
  for (const level of [1.05, height - 0.6]) {
    for (const offset of [-0.7, 0.7]) {
      box(house, offset, level, depth / 2 + 0.01, 0.67, 0.78, 0.04, palette.paper, true);
      for (const dx of [-0.34, -0.17, 0, 0.17, 0.34])
        box(house, offset + dx, level, depth / 2 + 0.05, 0.035, 0.85, 0.04, palette.darkWood);
      for (const cross of [-0.25, 0.18])
        box(house, offset, level + cross, depth / 2 + 0.06, 0.72, 0.025, 0.04, palette.darkWood);
    }
  }
  for (const px of [-w / 2 + 0.09, w / 2 - 0.09])
    box(house, px, height / 2, depth / 2 + 0.06, 0.12, height, 0.13, palette.wood);
  box(house, 0, height * 0.52, depth / 2 + 0.09, w + 0.12, 0.13, 0.18, palette.wood);
  box(house, 0, 0.1, 0, w + 0.2, 0.2, depth + 0.2, palette.stone);
  roof(house, height, w, depth);
  roof(house, 1.85, w + 0.1, 0.55);
  // Small entrance lamps flank the outer posts, clear of the central sign and awning.
  for (const position of lighting.entrance) {
    const lx = position * (w / 2 - 0.12);
    box(house, lx, 1.76, 1.72, 0.04, 0.04, 0.46, palette.wood);
    hangingLantern(house, lx, 1.52, 1.94, 0.55, lighting.style, lighting.color);
  }
  box(house, 0, 1.47, 1.48, 0.8, 0.3, 0.07, palette.red);
  box(house, 0, 1.47, 1.53, 0.52, 0.035, 0.02, palette.gold);
  // Warm LED strips follow the eaves, with strings of paper lanterns upstairs.
  const ledMaterial = new THREE.MeshBasicMaterial({ color: 0xffcb83, toneMapped: false });
  const led = new THREE.Mesh(new THREE.BoxGeometry(w + 0.55, 0.022, 0.025), ledMaterial);
  led.position.set(0, height + 0.04, depth / 2 + 0.29);
  if (lighting.led) house.add(led);
  else {
    led.geometry.dispose();
    ledMaterial.dispose();
  }
  const upperString = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-w / 2, height - 0.04, 2.2),
    new THREE.Vector3(0, height - 0.18, 2.24),
    new THREE.Vector3(w / 2, height - 0.04, 2.2),
  ]);
  if (lighting.upperCount > 0)
    house.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(upperString.getPoints(20)),
        new THREE.LineBasicMaterial({ color: palette.gold }),
      ),
    );
  for (let lamp = 0; lamp < lighting.upperCount; lamp++) {
    const point = upperString.getPoint((lamp + 1) / (lighting.upperCount + 1));
    hangingLantern(
      house,
      point.x,
      point.y - 0.23,
      point.z,
      0.54,
      lamp % 2 ? 'round' : lighting.style,
      lighting.color,
    );
  }
  // Balconies, timber brackets and varied street-level shops.
  if (index % 3 !== 1) {
    box(house, 0, height - 1.12, 1.7, w + 0.12, 0.12, 0.6, palette.wood);
    box(house, 0, height - 0.72, 1.98, w, 0.07, 0.07, palette.gold);
    for (let rail = -w / 2; rail <= w / 2; rail += 0.22) {
      box(house, rail, height - 0.92, 1.98, 0.035, 0.4, 0.035, palette.wood);
    }
  }
  for (const corner of [-1, 1]) {
    const bracket = box(
      house,
      corner * (w / 2 - 0.12),
      height - 0.1,
      1.48,
      0.1,
      0.5,
      0.15,
      palette.gold,
    );
    bracket.rotation.z = corner * 0.55;
  }
  box(house, 0, 0.64, 1.44, 0.48, 1.05, 0.08, palette.darkWood);
  for (const px of [-0.16, 0.16]) box(house, px, 0.65, 1.5, 0.018, 0.95, 0.035, palette.gold);
  if (index % 2 === 0) {
    const awning = box(house, 0, 1.23, 2, w - 0.4, 0.09, 1.05, index % 4 ? 0x8b5742 : 0x476a60);
    awning.rotation.x = 0.12;
    box(house, 0, 0.48, 2.1, w - 0.7, 0.65, 0.55, palette.wood);
    for (const px of [-0.65, 0, 0.65]) {
      const basket = orb(house, px, 0.87, 2.12, 0.19, 0xb89058);
      basket.scale.y = 0.1;
      for (let fruit = 0; fruit < 3; fruit++)
        orb(house, px + (fruit - 1) * 0.09, 0.96, 2.12, 0.07, index % 4 ? 0xc66d32 : 0xcaa950);
    }
  }
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 256;
  signCanvas.height = 64;
  const ctx = signCanvas.getContext('2d')!;
  ctx.fillStyle = '#562a26';
  ctx.fillRect(0, 0, 256, 64);
  ctx.strokeStyle = '#a88750';
  ctx.strokeRect(4, 4, 248, 56);
  ctx.fillStyle = '#e4c48e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '24px "Times New Roman", serif';
  ctx.fillText(['Trà Quán', 'Nguyệt Lâu', 'Đèn Hoa', 'Tiệm Bánh'][index % 4], 128, 33);
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(0.95, 0.25),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas), toneMapped: false }),
  );
  sign.position.set(0, 1.47, 1.54);
  house.add(sign);
  house.position.set(x, 0.12, z);
  house.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
  parent.add(house);
}

export type CrowdMember = {
  root: THREE.Group;
  startZ: number;
  phase: number;
  direction: number;
  limbs: THREE.Group[];
};
export function createTown(scene: THREE.Scene) {
  const town = new THREE.Group();
  scene.add(town);
  const crowd: CrowdMember[] = [];
  for (const side of [-1, 1]) {
    box(town, side * 12.5, -0.08, -14, 14, 0.4, 62, 0x454b47);
    box(town, side * 5.5, 0.05, -14, 0.35, 0.65, 54, 0x77776b);
    const embankment = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.4, 0.145, 1.86),
      mat(0xffffff),
      96,
    );
    const stoneMatrix = new THREE.Matrix4();
    for (let course = 0; course < 3; course++) {
      for (let stone = 0; stone < 32; stone++) {
        const instance = course * 32 + stone;
        stoneMatrix.makeTranslation(
          side * 5.52,
          -0.13 + course * 0.16,
          15 - stone * 1.9 + (course % 2) * 0.5,
        );
        embankment.setMatrixAt(instance, stoneMatrix);
        embankment.setColorAt(instance, new THREE.Color(course % 2 ? 0x535854 : 0x5f6259));
      }
    }
    town.add(embankment);
    // Broad paved promenades and generous landings at both bridge ends.
    box(town, side * 7.35, 0.16, -13, 3.4, 0.12, 60, 0x686960);
    box(town, side * 8, 0.25, 0, 5, 0.16, 5.2, 0x8c8978);
    for (let row = 0; row < 26; row++) {
      const z = 14 - row * 2.2;
      box(town, side * 7.3, 0.228, z, 3.2, 0.012, 0.035, 0x898779);
      if (row % 3 === 0) {
        box(town, side * 8.8, 0.58, z, 0.6, 0.75, 0.6, 0x5b5142);
        const bush = orb(town, side * 8.8, 1.04, z, 0.5, 0x405b43);
        bush.scale.y = 0.35;
        box(town, side * 8.4, 0.52, z - 0.95, 0.48, 0.15, 1.15, palette.wood);
      }
    }
    for (let index = 0; index < 12; index++) {
      building(town, side * 10.6, 7 - index * 4.1, index, side);
      if (index < 9) building(town, side * 16.3, 5 - index * 5.1, index + 1, side);
      for (const shift of [0, 1.6]) {
        const z = 6 - index * 4.1 - shift;
        const person = new THREE.Group();
        const coat = [0x993f32, 0x2d7771, 0xbb995d, 0x626074, 0x49647a, 0xc18b77][
          (index + Math.round(shift * 3)) % 6
        ];
        const stature = 0.88 + ((index * 7 + shift) % 5) * 0.055;
        orb(person, 0, 1.04, 0, 0.105, 0xbf9471);
        const hair = orb(person, 0, 1.09, -0.015, 0.108, 0x282327);
        hair.scale.y = 0.08;
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.46, 10), mat(coat));
        body.position.y = 0.73;
        person.add(body);
        box(person, 0, 0.57, 0, 0.27, 0.045, 0.21, palette.gold);
        const limbs: THREE.Group[] = [];
        for (const px of [-1, 1]) {
          const leg = new THREE.Group();
          leg.position.set(px * 0.065, 0.52, 0);
          box(leg, 0, -0.2, 0, 0.075, 0.4, 0.085, palette.darkWood);
          box(leg, 0, -0.4, 0.025, 0.09, 0.06, 0.16, palette.darkWood);
          person.add(leg);
          limbs.push(leg);
          const arm = new THREE.Group();
          arm.position.set(px * 0.14, 0.91, 0);
          box(arm, px * 0.015, -0.16, 0, 0.065, 0.3, 0.08, coat);
          orb(arm, px * 0.015, -0.32, 0, 0.045, 0xbf9471);
          person.add(arm);
          limbs.push(arm);
        }
        person.scale.setScalar(stature);
        person.rotation.y = index % 2 ? 0.35 : Math.PI + 0.2;
        person.position.set(side * (6.35 + shift * 0.65), 0.3, z);
        town.add(person);
        crowd.push({
          root: person,
          startZ: z,
          phase: index + shift,
          direction: index % 2 ? 1 : -1,
          limbs,
        });
      }
      const lampZ = 6 - index * 4.1;
      if (index % 3 === (side > 0 ? 1 : 0) && Math.abs(lampZ) > 4.4) {
        box(town, side * 5.85, 1.4, lampZ, 0.08, 2.5, 0.08, palette.wood);
        box(town, side * 6.02, 2.63, lampZ, 0.42, 0.06, 0.06, palette.wood);
        hangingLantern(town, side * 6.18, 2.38, lampZ, 0.68, 'box', 0xf1c98b);
      }
    }
  }
  // A gently arched stone bridge, spanning the river along X.
  const arch = (x: number) => 0.45 + 0.9 * (1 - Math.pow(x / 5.6, 2));
  for (let i = 0; i < 40; i++) {
    const x = -5.6 + ((i + 0.5) * 11.2) / 40;
    box(town, x, arch(x), 0, 0.3, 0.28, 2.8, 0xa39580);
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i <= 20; i++) {
      const x = -5.6 + i * 0.56;
      box(town, x, arch(x) + 0.5, side * 1.36, 0.11, 0.8, 0.11, 0xb4a68f);
      if (i < 20) {
        const nx = x + 0.56;
        beam(
          town,
          new THREE.Vector3(x, arch(x) + 0.85, side * 1.36),
          new THREE.Vector3(nx, arch(nx) + 0.85, side * 1.36),
          0.1,
          0xb4a68f,
        );
      }
    }
  }
  for (const x of [-4.8, 4.8]) {
    for (const z of [-1.5, 1.5]) {
      box(town, x, 2.1, z, 0.12, 2.2, 0.12, palette.wood);
      hangingLantern(town, x, 2.9, z, 0.85, 'hexagonal', 0xd9863e);
    }
  }
  // River surface: animated specular-like horizontal ribbons.
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 95, 1, 1),
    new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader:
        'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: `
      varying vec2 vUv; uniform float time;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),
          mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
      }
      void main(){
        vec2 p=vec2(vUv.x*11.,vUv.y*95.);
        float n=noise(vec2(p.x*2.1,p.y*1.7-time*.16));
        float ripple=sin(p.y*15.+n*7.+time*.65)*.5+.5;
        float detail=noise(vec2(p.x*14.,p.y*7.-time*.3));
        float glint=smoothstep(.72,.98,ripple)*smoothstep(.40,.85,detail);
        float banks=pow(abs(vUv.x-.5)*2.,4.);
        float broken=noise(vec2(p.x*3.,p.y*.55-time*.07));
        float moon=exp(-pow((vUv.x-.44+(n-.5)*.08)*7.,2.));
        vec3 col=mix(vec3(.018,.065,.085),vec3(.035,.12,.13),n);
        col+=vec3(.65,.29,.075)*banks*glint*(.3+broken*.9);
        col+=vec3(.13,.18,.19)*moon*glint*.65;
        gl_FragColor=vec4(col,1.);
      }`,
    }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.05, -23);
  town.add(water);
  return { town, water, crowd, bridgeHeight: 1.48 };
}
