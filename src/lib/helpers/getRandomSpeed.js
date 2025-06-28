import { BASE_ROTATION_SPEED } from '../constants.js';

// Random speed multiplier between -1 and 1 (allows both clockwise and counter-clockwise)
const randomSpeed = () => (Math.random() * 2 - 1) * BASE_ROTATION_SPEED;

// Assign random speeds for each axis
const rotationSpeeds = {
  x: randomSpeed(),
  y: randomSpeed(),
  z: randomSpeed(),
};

export default rotationSpeeds;
