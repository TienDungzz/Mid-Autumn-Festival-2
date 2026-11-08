export function pickWish<T>(items: readonly T[], random = Math.random): T | null {
  if (items.length === 0) return null;
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('Random value must be in [0, 1).');
  }
  return items[Math.floor(value * items.length)];
}
