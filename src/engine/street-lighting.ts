export type LanternStyle = 'round' | 'oval' | 'hexagonal' | 'box';
export function streetLighting(index: number, side: number) {
  const variant = (((index + (side > 0 ? 2 : 0)) % 4) + 4) % 4;
  const styles: LanternStyle[] = ['round', 'oval', 'hexagonal', 'box'];
  return {
    style: styles[variant],
    color: [0xc34e2f, 0xe8a451, 0xa83d2c, 0xe9c28a][variant],
    entrance: variant === 0 ? [-1, 1] : variant === 2 ? [1] : [-1],
    upperCount: variant === 0 ? 3 : variant === 1 ? 2 : 0,
    led: variant !== 2,
  };
}
