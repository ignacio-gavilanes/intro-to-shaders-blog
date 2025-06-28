import * as THREE from 'three';

const createYRotationQuaternion = (velocityY) => {
  // Euler angles define rotation around X, Y, Z in a human-readable way
  const euler = new THREE.Euler(0, velocityY, 0, 'XYZ');

  // Convert Euler rotation into a quaternion (better for 3D stability & blending)
  const quaternion = new THREE.Quaternion().setFromEuler(euler);

  return quaternion;
}

export default createYRotationQuaternion;
