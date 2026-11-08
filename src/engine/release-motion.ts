export const RELEASE_TIME = 0.68;
const ease = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** One shared timeline keeps all four hands and the lantern in sync. */
export function releasePose(progress: number) {
  const lift = ease(progress / 0.55);
  const flight = ease((progress - RELEASE_TIME) / (1 - RELEASE_TIME));
  const lowerHands = ease((progress - RELEASE_TIME) / 0.32);
  return {
    lantern: { x: flight * 0.25, y: 1.16 + lift * 0.34 + flight * 2.5, z: -0.18 * flight },
    hands: {
      y: progress <= RELEASE_TIME ? 1.16 + lift * 0.34 : 1.5 - lowerHands * 0.53,
      distance: 0.115 + lowerHands * 0.245,
      depth: 0.13 + lowerHands * 0.1,
      relax: lowerHands,
    },
  };
}
