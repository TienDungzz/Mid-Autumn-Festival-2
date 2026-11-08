import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pickWish } from '../src/domain/wishes/pick-wish.ts';
import { transition } from '../src/app/story-state.ts';

test('random selection handles boundaries, empty data, and repeated results', () => {
  assert.equal(
    pickWish([], () => 0),
    null,
  );
  assert.equal(
    pickWish(['a'], () => 0.99),
    'a',
  );
  assert.equal(
    pickWish(['a', 'b', 'c'], () => 0),
    'a',
  );
  assert.equal(
    pickWish(['a', 'b', 'c'], () => 0.5),
    'b',
  );
  assert.equal(
    pickWish(['a', 'b', 'c'], () => 0.999999),
    'c',
  );
  assert.equal(
    pickWish(['a', 'b'], () => 0),
    pickWish(['a', 'b'], () => 0),
  );
  assert.throws(() => pickWish(['a'], () => 1), RangeError);
});

test('loading and animation gates reject duplicate or premature events', () => {
  assert.equal(transition('homeLoading', 'open'), 'homeLoading');
  assert.equal(transition('openingDoors', 'open'), 'openingDoors');
  assert.equal(transition('releasing', 'release'), 'releasing');
  assert.equal(transition('homeError', 'retry'), 'homeLoading');
  let state = transition('homeLoading', 'loaded');
  for (const event of ['open', 'opened', 'release', 'released', 'arrived', 'replay'] as const)
    state = transition(state, event);
  assert.equal(state, 'scene1Ready');
});
