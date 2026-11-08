import assert from 'node:assert/strict';
import { test } from 'node:test';
import { RELEASE_TIME, releasePose } from '../src/engine/release-motion.ts';

test('both characters lift together, hold, and release before lowering their hands', () => {
  const start = releasePose(0);
  const raised = releasePose(0.55);
  const release = releasePose(RELEASE_TIME);
  assert.ok(raised.lantern.y > start.lantern.y);
  assert.equal(raised.lantern.y, release.lantern.y);
  for (const progress of [0, 0.2, 0.55, RELEASE_TIME]) {
    const pose = releasePose(progress);
    assert.equal(pose.hands.y, pose.lantern.y);
    assert.equal(pose.hands.distance, 0.115);
  }
  const flying = releasePose(0.9);
  assert.ok(flying.lantern.y > flying.hands.y);
  assert.ok(flying.hands.distance > release.hands.distance);
  assert.ok(Math.abs(releasePose(1).lantern.y - 4) < 1e-9);
  const relaxed = releasePose(1).hands;
  assert.ok(relaxed.y < 1.05, 'hands finish beside the thighs rather than folded at chest height');
  assert.ok(relaxed.depth > 0.2, 'wrists stay outside the torso');
  assert.equal(relaxed.relax, 1);
  const beforeRelease = releasePose(RELEASE_TIME - 0.0001).hands;
  const afterRelease = releasePose(RELEASE_TIME + 0.0001).hands;
  assert.ok(Math.abs(beforeRelease.y - afterRelease.y) < 0.001, 'no snap at release');
});
