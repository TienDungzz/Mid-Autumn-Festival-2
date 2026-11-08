import * as THREE from 'three';

let glowTexture: THREE.CanvasTexture | undefined;
export function makeGlow(color = 0xffb857, size = 1, opacity = 0.35) {
  if (!glowTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.15, '#ffffffa0');
    gradient.addColorStop(0.45, '#ffffff28');
    gradient.addColorStop(1, '#ffffff00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    glowTexture = new THREE.CanvasTexture(canvas);
  }
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color,
      opacity,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  sprite.scale.set(size, size, 1);
  return sprite;
}
