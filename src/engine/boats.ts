import * as THREE from 'three';
import { box, mat, hangingLantern, palette } from './town';
import { makeGlow } from './glow';

export function createBoats(parent: THREE.Object3D) {
  const boats: { root: THREE.Group; phase: number; direction: number }[] = [];
  for (let index = 0; index < 3; index++) {
    const boat = new THREE.Group();
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-0.5, -1.2);
    hullShape.quadraticCurveTo(-0.9, 0, -0.5, 1.2);
    hullShape.lineTo(0, 1.65);
    hullShape.lineTo(0.5, 1.2);
    hullShape.quadraticCurveTo(0.9, 0, 0.5, -1.2);
    hullShape.lineTo(0, -1.65);
    hullShape.closePath();
    const hull = new THREE.Mesh(
      new THREE.ExtrudeGeometry(hullShape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSize: 0.06,
        bevelThickness: 0.05,
        bevelSegments: 2,
      }),
      mat(0x503629),
    );
    hull.rotation.x = -Math.PI / 2;
    hull.position.y = 0.05;
    boat.add(hull);
    box(boat, 0, 0.29, 0, 0.88, 0.06, 2.2, 0x96724c);
    for (const x of [-0.47, 0.47]) {
      box(boat, x, 0.5, -0.85, 0.035, 0.5, 0.035, palette.gold);
      box(boat, x, 0.5, 0.85, 0.035, 0.5, 0.035, palette.gold);
    }
    const roofVertices: number[] = [];
    for (let segment = 0; segment < 16; segment++) {
      const a = (segment / 16) * Math.PI;
      const b = ((segment + 1) / 16) * Math.PI;
      const left = [0.5 * Math.cos(a), 0.68 + 0.25 * Math.sin(a)];
      const right = [0.5 * Math.cos(b), 0.68 + 0.25 * Math.sin(b)];
      roofVertices.push(
        left[0],
        left[1],
        -0.9,
        right[0],
        right[1],
        -0.9,
        left[0],
        left[1],
        0.9,
        right[0],
        right[1],
        -0.9,
        right[0],
        right[1],
        0.9,
        left[0],
        left[1],
        0.9,
      );
    }
    const roofGeometry = new THREE.BufferGeometry();
    roofGeometry.setAttribute('position', new THREE.Float32BufferAttribute(roofVertices, 3));
    roofGeometry.computeVertexNormals();
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: index % 2 ? 0x41675e : 0x853d32,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    boat.add(new THREE.Mesh(roofGeometry, roofMaterial));
    for (const z of [-1.05, 1.05]) hangingLantern(boat, 0, 0.65, z, 0.55);
    const reflection = makeGlow(0xffb35f, 2, 0.28);
    reflection.rotation.x = -Math.PI / 2;
    reflection.position.y = -0.02;
    boat.add(reflection);
    for (const x of [-0.28, 0.28]) box(boat, x, 0.44, 0, 0.3, 0.16, 0.8, palette.wood);
    // Broken wake stays on the water behind each boat.
    for (let i = 0; i < 5; i++) {
      const wake = new THREE.Mesh(
        new THREE.RingGeometry(0.3 + i * 0.18, 0.32 + i * 0.18, 24, 1, 0, Math.PI),
        new THREE.MeshBasicMaterial({
          color: 0x98b6ae,
          transparent: true,
          opacity: 0.1 - i * 0.015,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      wake.rotation.x = -Math.PI / 2;
      wake.scale.y = 0.45;
      wake.position.set(0, 0.005, -1.7 - i * 0.38);
      boat.add(wake);
    }
    parent.add(boat);
    boats.push({ root: boat, phase: index * 19, direction: index % 2 ? -1 : 1 });
  }
  return boats;
}
