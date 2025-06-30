import * as THREE from 'three';

const SCENE_SIZE = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight
};

export const ROOM_SIZE = {
  WIDTH: 14,
  HEIGHT: 10,
  DEPTH: 12,
};

export const CAMERA = {
  SETTINGS: {
    FOV: 50,
    ASPECT: SCENE_SIZE.WIDTH / SCENE_SIZE.HEIGHT,
    NEAR: 0.1,
    FAR: 100,
  },
  INITIAL_POSITION: new THREE.Vector3(0, 0, -10),
  LOOK_AT_TARGET: new THREE.Vector3(0, 0, 0),
};

export const AMBIENT_LIGHT = {
  INTENSITY: 1.4,
  COLOR: "#FFFFFF",
};

export const POINT_LIGHT = {
  INTENSITY: 100,
  POSITION: new THREE.Vector3(0, 0, -4),
  COLOR: "#FFFFFF",
};

export const PARALLAX_STRENGTH = 1;

export const DEVICE_PIXEL_RATIO = Math.min(window.devicePixelRatio, 2);

export const BASE_ROTATION_SPEED = 0.003; // radians per frame

export const MODEL_MANUAL_ROTATION_SETTINGS = {
  DAMPING: 0.95, // How quickly rotation slows down
  SENSITIVITY: 0.005, // How much mouse movement affects rotation
};

export const WALLS = ['left', 'right', 'ceiling', 'floor', 'back'];

export const BASE_MATERIAL_PROPERTIES_PER_WALL = {
  left: {
    metalness: 0.3,
    roughness: 1,
    aoMapIntensity: 0.5,
    displacementScale: 0.05,
    normalScale: new THREE.Vector2(0.65, 2.0),
  },
  right: {
    metalness: 0.3,
    roughness: 1,
    aoMapIntensity: 0.5,
    displacementScale: 0.05,
    normalScale: new THREE.Vector2(1.57, 1.0),
  },
  ceiling: {
    metalness: 0.3,
    roughness: 1,
    aoMapIntensity: 1,
    displacementScale: 0.05,
    normalScale: new THREE.Vector2(0.4, 1.5),
  },
  floor: {
    metalness: 0.3,
    roughness: 0.6,
    aoMapIntensity: 2.7,
    displacementScale: 0.05,
    normalScale: new THREE.Vector2(0.0, 0.7),
  },
  back: {
    metalness: 0.3,
    roughness: 1,
    aoMapIntensity: 0.5,
    displacementScale: 0.05,
    normalScale: new THREE.Vector2(2.0, 0.8),
  },
};
