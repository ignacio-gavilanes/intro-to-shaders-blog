import * as THREE from 'three';
import GUI from 'lil-gui';
import Stats from 'stats.js';
import getSceneSize from './lib/helpers/getSceneSize';
import rotationSpeeds from './lib/helpers/getRandomSpeed';
import { Text } from "troika-three-text";
import {
  DEVICE_PIXEL_RATIO,
  ROOM_SIZE,
  CAMERA,
  PARALLAX_STRENGTH,
  POINT_LIGHT,
  AMBIENT_LIGHT,
} from './lib/constants';

/*
** NOTE: Eventually I will need to wrap this entire init function in a promise.
** This way, I can create an async function in main.js that uses try/catch/finally
** to render the loading screen, an error screen, and the scene itself.
** in main js this would look like this:
** - Show loader
** - Declare function with:
**     - try: initScene
**     - catch: error screen
**     - finally: remove loader
*/
const stats = new Stats();

document.body.appendChild(stats.dom);

export function initScene() {
  // Get the CANVAS element from ../index.html
  const canvas = document.querySelector('#webgl');

  // Create the SCENE
  const scene = new THREE.Scene();

  // CAMERA
  const camera = new THREE.PerspectiveCamera(
    CAMERA.SETTINGS.FOV,
    CAMERA.SETTINGS.ASPECT,
    CAMERA.SETTINGS.NEAR,
    CAMERA.SETTINGS.FAR,
  );

  camera.position.copy(CAMERA.INITIAL_POSITION);
  camera.lookAt(CAMERA.LOOK_AT_TARGET);

  // RENDERER
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true, // Looks better but slightly less performant
  });

  const { width, height } = getSceneSize();

  renderer.setSize(width, height);
  renderer.setPixelRatio(DEVICE_PIXEL_RATIO);
  renderer.shadowMap.enabled = true;

  // LIGHTING
  const ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT.COLOR, AMBIENT_LIGHT.INTENSITY);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(POINT_LIGHT.COLOR, POINT_LIGHT.INTENSITY);
  pointLight.position.copy(POINT_LIGHT.POSITION);
  scene.add(pointLight);

  // ROOM as a box with inward-facing walls
  const roomGeometry = new THREE.BoxGeometry(ROOM_SIZE.WIDTH, ROOM_SIZE.HEIGHT, ROOM_SIZE.DEPTH);
  const roomMaterial = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
  });

  const room = new THREE.Mesh(roomGeometry, roomMaterial);
  scene.add(room);

  // BOX OBJECT: Placeholder for the model --------------------------------------------
  const boxSize = { x: 0.8, y: 0.8, z: 0.8 };
  const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(0, -0.5 + boxSize.y / 2, 2);
  scene.add(box);
  // -----------------------------------------------------------------------------------

  // RESIZE HANDLING
  window.addEventListener('resize', () => {
    const { width, height } = getSceneSize();

    // Update camera
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(width, height);
    renderer.setPixelRatio(DEVICE_PIXEL_RATIO);
  });

  // MOUSE TRACKING
  const mouse = new THREE.Vector2();

  window.addEventListener('mousemove', (event) => {
    const { width, height } = getSceneSize();

    mouse.x = event.clientX / width * 2 - 1;
    mouse.y = - (event.clientY / height) * 2 + 1;
  });


  // BACKGROUND TEXT
  /* 
  ** NOTE:
  ** The reason for the text is to have an heterogenous back wall so that refractions would look cool.
  ** A different approach could be just adding a texture like a brick/wood wall.
  */
  const myText = new Text();
  myText.text = '/PLACEHOLDER';
  myText.fontSize = 1;
  myText.rotation.y = Math.PI;
  myText.position.set(0, 0, (ROOM_SIZE.DEPTH / 2) - 1); // -1 to avoid z-fighting.
  myText.color = "#000000";
  myText.anchorX = 'center';
  myText.anchorY = 'middle';
  myText.sync(); // Sync layout before rendering
  scene.add(myText);

  // STATS panel
  stats.showPanel(0); // NOTE: 0 = fps, 1 = ms, 2 = memory

  // RENDERER LOOP
  renderer.setAnimationLoop(() => {
    stats.begin();

    // PARALLAX CAMERA MOVEMENT
    const targetX = mouse.x * PARALLAX_STRENGTH;
    const targetY = mouse.y * PARALLAX_STRENGTH;

    camera.position.x += (targetX - camera.position.x) * 0.1;
    camera.position.y += (targetY - camera.position.y) * 0.1;

    // Keep camera looking at the center
    camera.lookAt(CAMERA.LOOK_AT_TARGET);

    // BOX OBJECT RANDOM ROTATION
    const {x, y, z} = rotationSpeeds

    box.rotation.x += x;
    box.rotation.y += y;
    box.rotation.z += z;

    renderer.render(scene, camera);
    stats.end();
  });
}
