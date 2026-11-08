import * as THREE from 'three';

/** Correct the two arm bones after the baked clip, without changing the rest rig. */
export function placeHand(
  hand: THREE.Bone,
  target: THREE.Vector3,
  weight: number,
  elbowPole?: THREE.Vector3,
) {
  const lower = hand.parent;
  const upper = lower?.parent;
  if (!(lower instanceof THREE.Bone) || !(upper instanceof THREE.Bone) || weight <= 0) return;
  upper.updateWorldMatrix(true, true);
  const shoulder = upper.getWorldPosition(new THREE.Vector3());
  const elbow = lower.getWorldPosition(new THREE.Vector3());
  const wrist = hand.getWorldPosition(new THREE.Vector3());
  const destination = wrist.clone().lerp(target, weight);
  const lengthA = shoulder.distanceTo(elbow);
  const lengthB = elbow.distanceTo(wrist);
  const axis = destination.clone().sub(shoulder);
  const distance = THREE.MathUtils.clamp(
    axis.length(),
    Math.abs(lengthA - lengthB) + 0.001,
    lengthA + lengthB - 0.001,
  );
  axis.normalize();
  // An explicit pole keeps elbows down/out instead of inheriting old gift-giving poses.
  const pole = (elbowPole ?? elbow).clone().sub(shoulder);
  pole.addScaledVector(axis, -pole.dot(axis));
  if (pole.lengthSq() < 0.00001) pole.set(0, 0, 1).addScaledVector(axis, -axis.z);
  pole.normalize();
  const along = (lengthA ** 2 - lengthB ** 2 + distance ** 2) / (2 * distance);
  const bend = Math.sqrt(Math.max(0, lengthA ** 2 - along ** 2));
  const desiredElbow = shoulder.clone().addScaledVector(axis, along).addScaledVector(pole, bend);
  aimBone(upper, elbow.sub(shoulder), desiredElbow.clone().sub(shoulder));
  lower.updateWorldMatrix(true, true);
  const actualElbow = lower.getWorldPosition(new THREE.Vector3());
  const actualWrist = hand.getWorldPosition(new THREE.Vector3());
  const reachable = shoulder.clone().addScaledVector(axis, distance);
  aimBone(lower, actualWrist.sub(actualElbow), reachable.sub(actualElbow));
}

/** Orient the palm from its own bind-space finger/palm axes, avoiding wrist roll flips. */
export function orientPalm(
  hand: THREE.Bone,
  fingerAxis: THREE.Vector3,
  palmAxis: THREE.Vector3,
  direction: THREE.Vector3,
  up: THREE.Vector3,
  weight: number,
) {
  const sourceY = fingerAxis.clone().normalize();
  const sourceZ = palmAxis.clone().addScaledVector(sourceY, -palmAxis.dot(sourceY)).normalize();
  const sourceX = sourceY.clone().cross(sourceZ).normalize();
  const targetY = direction.clone().normalize();
  const targetZ = up.clone().addScaledVector(targetY, -up.dot(targetY)).normalize();
  const targetX = targetY.clone().cross(targetZ).normalize();
  const source = new THREE.Matrix4().makeBasis(sourceX, sourceY, sourceZ);
  const destination = new THREE.Matrix4().makeBasis(targetX, targetY, targetZ);
  const world = new THREE.Quaternion().setFromRotationMatrix(destination.multiply(source.invert()));
  const parent = hand.parent!.getWorldQuaternion(new THREE.Quaternion());
  hand.quaternion.slerp(parent.invert().multiply(world), weight);
  hand.updateWorldMatrix(false, true);
}

function aimBone(bone: THREE.Bone, from: THREE.Vector3, to: THREE.Vector3) {
  const correction = new THREE.Quaternion().setFromUnitVectors(from.normalize(), to.normalize());
  const world = bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(correction);
  const parent = bone.parent?.getWorldQuaternion(new THREE.Quaternion()) ?? new THREE.Quaternion();
  bone.quaternion.copy(parent.invert().multiply(world));
  bone.updateWorldMatrix(false, true);
}
