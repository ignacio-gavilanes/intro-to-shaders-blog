import * as THREE from 'three';

export const SCENE_SIZE = {
  WIDTH: window.innerWidth,
  HEIGHT: window.innerHeight
};

export const ROOM_SIZE = {
  WIDTH: 12,
  HEIGHT: 8,
  DEPTH: 12,
};

export const CAMERA = {
  SETTINGS: {
    FOV: 40,
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
  MINIMUM_VELOCITY: 0.00001, // Threshold to stop rotation
}
