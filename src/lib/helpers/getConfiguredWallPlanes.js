import * as THREE from 'three';

import createWallTextureSets from './createWallTextureSets';
import createWallPlane from './createWallPlane';

import {
  ROOM_SIZE,
  BASE_MATERIAL_PROPERTIES_PER_WALL,
  WALLS,
} from '../constants';

const getConfiguredWallPlanes = ({
  loadingManager,
}) => {
  // Load all textures once
  const wallTextureSets = createWallTextureSets(loadingManager);

  // Create materials for each wall
  const wallMaterials = {};

  WALLS.forEach((wall) => {
    const textures = wallTextureSets[wall];
    const props = BASE_MATERIAL_PROPERTIES_PER_WALL[wall];

    wallMaterials[wall] = new THREE.MeshStandardMaterial({
      map: textures.map,
      aoMap: textures.aoMap,
      aoMapIntensity: props.aoMapIntensity,
      roughnessMap: textures.roughnessMap,
      roughness: props.roughness,
      metalness: props.metalness,
      normalMap: textures.normalMap,
      normalScale: props.normalScale,
      displacementMap: textures.displacementMap,
      displacementScale: props.displacementScale,
    });
  });

  const halfWidth = ROOM_SIZE.WIDTH / 2;
  const halfHeight = ROOM_SIZE.HEIGHT / 2;
  const halfDepth = ROOM_SIZE.DEPTH / 2;

  // Create the wall meshes with proper position and rotation
  const leftWall = createWallPlane(ROOM_SIZE.DEPTH, ROOM_SIZE.HEIGHT, wallMaterials.left);
  leftWall.position.set(halfWidth, 0, 0);
  leftWall.rotation.y = -Math.PI / 2;

  const rightWall = createWallPlane(ROOM_SIZE.DEPTH, ROOM_SIZE.HEIGHT, wallMaterials.right);
  rightWall.position.set(-halfWidth, 0, 0);
  rightWall.rotation.y = Math.PI / 2;

  const ceiling = createWallPlane(ROOM_SIZE.WIDTH, ROOM_SIZE.DEPTH, wallMaterials.ceiling);
  ceiling.position.set(0, halfHeight, 0);
  ceiling.rotation.x = Math.PI / 2;

  const floor = createWallPlane(ROOM_SIZE.WIDTH, ROOM_SIZE.DEPTH, wallMaterials.floor);
  floor.position.set(0, -halfHeight, 0);
  floor.rotation.x = -Math.PI / 2;

  const backWall = createWallPlane(ROOM_SIZE.WIDTH, ROOM_SIZE.HEIGHT, wallMaterials.back);
  backWall.position.set(0, 0, halfDepth);
  backWall.rotation.y = Math.PI;

  return {
    leftWall,
    rightWall,
    ceiling,
    floor,
    backWall,
    wallMaterials,
  };
}

export default getConfiguredWallPlanes;
