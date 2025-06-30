import * as THREE from 'three';

const createWallPlane = (width, height, material) => {
  const geometry = new THREE.PlaneGeometry(width, height, 50, 50); // Performance-sensitive: Can decrease subdivisions here
  geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));

  const mesh = new THREE.Mesh(geometry, material);

  mesh.receiveShadow = true;
  mesh.castShadow = true;

  return mesh;
}

export default createWallPlane;
