/** Wrap only above the viewport; a focused lamp pauses until focus is released. */
export function advanceFlight(height: number, delta: number, speed: number, paused: boolean) {
  if (paused) return height;
  const next = height + Math.max(0, delta) * speed;
  return next > 1.35 ? -0.35 + ((next - 1.35) % 1.7) : next;
}
