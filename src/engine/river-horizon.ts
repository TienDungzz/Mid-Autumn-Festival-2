import * as THREE from 'three';
import { box, mat, palette } from './town';

/** Low-detail silhouettes establish distance without detailed buildings or extra lights. */
export function createRiverHorizon(parent: THREE.Object3D) {
  for (let layer = 0; layer < 3; layer++) {
    const shape = new THREE.Shape();
    shape.moveTo(-85, -2);
    for (let i = 0; i <= 36; i++) {
      const x = -85 + (i * 170) / 36;
      const height = 4 + Math.sin(i * 0.65 + layer) * 2.3 + Math.sin(i * 1.87 + layer * 2) * 1.5;
      shape.lineTo(x, height + layer * 2);
    }
    shape.lineTo(85, -2);
    shape.closePath();
    const mountain = new THREE.Mesh(
      new THREE.ShapeGeometry(shape),
      new THREE.MeshBasicMaterial({
        color: [0x1d3443, 0x192c3d, 0x142638][layer],
        fog: false,
      }),
    );
    mountain.position.set(0, 0, -72 - layer * 9);
    parent.add(mountain);
  }
  for (const [x, z, tiers, scale] of [
    [-19, -42, 4, 1],
    [13, -49, 6, 1],
    [-30, -60, 3, 0.8],
  ]) {
    const tower = new THREE.Group();
    for (let level = 0; level < tiers; level++) {
      const width = 3.7 - level * 0.36;
      const y = level * 1.65;
      box(tower, 0, y + 0.7, 0, width, 1.4, width, 0x47352e);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(width * 0.97, 0.8, 4), mat(palette.roof));
      roof.rotation.y = Math.PI / 4;
      roof.position.y = y + 1.7;
      tower.add(roof);
      const strip = box(
        tower,
        0,
        y + 1.27,
        width / 2 + 0.02,
        width + 0.25,
        0.045,
        0.04,
        0xffbb67,
        true,
      );
      strip.material.toneMapped = false;
      // All repeated window panes of one tier share a single draw call.
      const windows = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.22, 0.58, 0.04),
        mat(0xffba63, true),
        12,
      );
      const transform = new THREE.Matrix4();
      for (let window = 0; window < 12; window++) {
        const side = Math.floor(window / 3);
        const offset = ((window % 3) - 1) * width * 0.25;
        const p =
          side % 2
            ? [side === 1 ? width / 2 + 0.03 : -width / 2 - 0.03, y + 0.74, offset]
            : [offset, y + 0.74, side === 0 ? width / 2 + 0.03 : -width / 2 - 0.03];
        transform.compose(
          new THREE.Vector3(...p),
          new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (side * Math.PI) / 2),
          new THREE.Vector3(1, 1, 1),
        );
        windows.setMatrixAt(window, transform);
      }
      tower.add(windows);
    }
    box(tower, 0, tiers * 1.65 + 0.4, 0, 0.07, 1.3, 0.07, palette.gold);
    tower.position.set(x, 0, z);
    tower.scale.setScalar(scale);
    parent.add(tower);
  }
  // A distant moon gate frames the vanishing point along the river.
  const gate = new THREE.Group();
  const arch = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.42, 8, 32, Math.PI), mat(0x776759));
  arch.position.y = 0.3;
  gate.add(arch);
  for (const side of [-1, 1]) {
    box(gate, side * 4, 2, 0, 1.4, 4, 1.3, 0x655147);
    box(gate, side * 4, 3.2, 0.68, 0.6, 1, 0.04, 0xffbd73, true);
  }
  box(gate, 0, 4.2, 0, 9.6, 0.35, 1.8, palette.wood);
  const gateRoof = new THREE.Mesh(new THREE.ConeGeometry(6.6, 1.35, 4), mat(palette.roof));
  gateRoof.scale.z = 0.34;
  gateRoof.rotation.y = Math.PI / 4;
  gateRoof.position.y = 4.9;
  gate.add(gateRoof);
  gate.position.z = -44;
  parent.add(gate);
}
