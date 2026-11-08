import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { placeHand, orientPalm } from '../src/engine/arm-ik.ts';

test('hand reaches a reachable world target under a rotated and translated parent', () => {
  const root = new THREE.Group();
  root.position.set(2, 1, -3);
  root.rotation.y = 0.4;
  const upper = new THREE.Bone();
  const lower = new THREE.Bone();
  const hand = new THREE.Bone();
  root.add(upper);
  upper.add(lower);
  lower.add(hand);
  lower.position.set(0.15, -0.2, 0);
  hand.position.set(0.1, -0.2, 0.03);
  root.updateMatrixWorld(true);
  const target = root.localToWorld(new THREE.Vector3(0.2, -0.2, 0.2));
  placeHand(hand, target, 1);
  assert.ok(hand.getWorldPosition(new THREE.Vector3()).distanceTo(target) < 0.00001);
  assert.ok(Math.abs(lower.position.length() - 0.25) < 0.00001);
});

test('explicit elbow pole stays below the shoulder and palm orientation preserves wrist location', () => {
  const root = new THREE.Group();
  const upper = new THREE.Bone();
  const lower = new THREE.Bone();
  const hand = new THREE.Bone();
  root.add(upper);
  upper.add(lower);
  lower.add(hand);
  lower.position.set(0, -0.25, 0);
  hand.position.set(0, -0.25, 0);
  const target = new THREE.Vector3(0.3, -0.08, 0.05);
  placeHand(hand, target, 1, new THREE.Vector3(0, -0.5, 0.2));
  assert.ok(lower.getWorldPosition(new THREE.Vector3()).y < 0);
  assert.ok(hand.getWorldPosition(new THREE.Vector3()).distanceTo(target) < 0.00001);
  orientPalm(
    hand,
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    1,
  );
  const rotation = hand.getWorldQuaternion(new THREE.Quaternion());
  assert.ok(
    new THREE.Vector3(0, 1, 0).applyQuaternion(rotation).distanceTo(new THREE.Vector3(1, 0, 0)) <
      0.00001,
  );
  assert.ok(hand.getWorldPosition(new THREE.Vector3()).distanceTo(target) < 0.00001);
});

test('unreachable targets stay finite and zero weight preserves the pose', () => {
  const upper = new THREE.Bone();
  const lower = new THREE.Bone();
  const hand = new THREE.Bone();
  upper.add(lower);
  lower.add(hand);
  lower.position.set(0, -0.25, 0);
  hand.position.set(0, -0.25, 0);
  const before = upper.quaternion.clone();
  placeHand(hand, new THREE.Vector3(20, 10, 5), 0);
  assert.ok(upper.quaternion.equals(before));
  placeHand(hand, new THREE.Vector3(20, 10, 5), 1);
  assert.ok(hand.getWorldPosition(new THREE.Vector3()).toArray().every(Number.isFinite));
});
