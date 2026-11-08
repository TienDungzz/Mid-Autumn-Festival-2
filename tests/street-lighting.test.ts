import assert from 'node:assert/strict';
import { test } from 'node:test';
import { streetLighting } from '../src/engine/street-lighting.ts';

test('facades vary by style and river bank while entrance lamps leave the sign clear', () => {
  const profiles = Array.from({ length: 4 }, (_, i) => streetLighting(i, -1));
  assert.equal(new Set(profiles.map((profile) => profile.style)).size, 4);
  assert.notDeepEqual(streetLighting(0, -1), streetLighting(0, 1));
  assert.ok(profiles.some((profile) => profile.upperCount === 0));
  for (const profile of profiles) {
    assert.ok(profile.entrance.every((position) => Math.abs(position) === 1));
    assert.ok(profile.upperCount <= 3);
  }
});
