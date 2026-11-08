import * as THREE from 'three';

// A single textured sprite keeps the lunar markings legible without extra lights.
export function createMoon(scene: THREE.Scene) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.beginPath();
  ctx.arc(256, 256, 244, 0, Math.PI * 2);
  ctx.clip();
  const base = ctx.createRadialGradient(190, 180, 10, 256, 256, 260);
  base.addColorStop(0, '#fff2d3');
  base.addColorStop(0.7, '#ead9b4');
  base.addColorStop(1, '#b6aa91');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 512);
  for (const [x, y, rx, ry] of [
    [164, 155, 68, 49],
    [239, 137, 48, 62],
    [315, 190, 67, 54],
    [190, 260, 57, 74],
    [312, 291, 37, 47],
    [135, 330, 30, 42],
  ]) {
    const shade = ctx.createRadialGradient(x, y, 2, x, y, Math.max(rx, ry));
    shade.addColorStop(0, '#625f575c');
    shade.addColorStop(0.65, '#77736540');
    shade.addColorStop(1, '#77736500');
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 180; i++) {
    const x = 256 + Math.sin(i * 127.1) * 235;
    const y = 256 + Math.sin(i * 311.7) * 235;
    const r = 1.5 + (Math.sin(i * 74.7) + 1) * 3;
    ctx.strokeStyle = '#716c602b';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const moon = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      fog: false,
      toneMapped: false,
      depthWrite: false,
    }),
  );
  scene.add(moon);
  return moon;
}
