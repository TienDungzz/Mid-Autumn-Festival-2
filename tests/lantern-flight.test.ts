import assert from 'node:assert/strict';
import { test } from 'node:test';
import { advanceFlight } from '../src/engine/lantern-flight.ts';

test('wish lamps rise continuously and recycle beyond the viewport', () => {
  assert.ok(advanceFlight(0.2, 1, 0.1, false) > 0.2);
  assert.equal(advanceFlight(0.2, 1, 0.1, true), 0.2);
  assert.ok(advanceFlight(1.34, 1, 0.1, false) < 0);
  assert.equal(advanceFlight(0.2, 0, 0.1, false), 0.2);
  const readingHeight = advanceFlight(0.4, 5, 0.1, true);
  assert.ok(
    advanceFlight(readingHeight, 1, 0.1, false) > readingHeight,
    'closing a wish resumes flight from the paused height',
  );
});
