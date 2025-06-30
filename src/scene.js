import * as THREE from 'three';
import Stats from 'stats.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import getSceneSize from './lib/helpers/getSceneSize';
import rotationSpeeds from './lib/helpers/getRandomSpeed';
import updateCursorType from './lib/helpers/updateCursorType';
import createYRotationQuaternion from './lib/helpers/createYRotationQuaternion';
import initGUI from './lib/helpers/initGUI';
import getConfiguredWallPlanes from './lib/helpers/getConfiguredWallPlanes';

import {
  DEVICE_PIXEL_RATIO,
  CAMERA,
  PARALLAX_STRENGTH,
  POINT_LIGHT,
  AMBIENT_LIGHT,
  MODEL_MANUAL_ROTATION_SETTINGS,
} from './lib/constants';

const stats = new Stats();

document.body.appendChild(stats.dom);

export function initScene() {
  return new Promise((resolve, reject) => { // Promise to track loading state via lodingManager
    // Loading manager to group all asset loading into a single lifecycle
    const loadingManager = new THREE.LoadingManager;

    // Get the CANVAS element from ../index.html
    const canvas = document.querySelector('#webgl');

    // Create the SCENE
    const scene = new THREE.Scene();

    // LOAD MODEL
    const gltfLoader = new GLTFLoader(loadingManager);
    let model; // save reference to rotate later

    gltfLoader.load(
      '/model/marble_bust.gltf',
      (gltf) => {
        model = gltf.scene.children[0];
        model.castShadow = true;
        model.receiveShadow = true;

        model.position.y = -1.25;
        model.position.z = 1.25;
        model.rotation.y = 3.25;

        model.scale.setScalar(6); // Shorthand for set(6, 6, 6)

        scene.add(model);
      },
      undefined,
      (err) => console.log('error', err),
    );

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
      // antialias: true, // Performance-sensitive: Looks better but slightly less performant
    });
    
    const { width, height } = getSceneSize();

    renderer.setSize(width, height);
    renderer.setPixelRatio(DEVICE_PIXEL_RATIO);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // Performance-sensitive: This is a better (not default) shadow algorithm.

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT.COLOR, AMBIENT_LIGHT.INTENSITY); 
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(POINT_LIGHT.COLOR, POINT_LIGHT.INTENSITY);
    pointLight.position.copy(POINT_LIGHT.POSITION);
    pointLight.castShadow = true
    pointLight.shadow.mapSize.width = 2048 // Performance-sensitive: Was 512 Originally. Change to 1024 if performance becomes an issue.
    pointLight.shadow.mapSize.height = 2048 // Performance-sensitive: Was 512 Originally. Change to 1024 if performance becomes an issue.
    pointLight.shadow.camera.near = 0.5
    pointLight.shadow.camera.far = 13
    pointLight.shadow.bias = -0.005;

    scene.add(pointLight, ambientLight);

    // Textures for 5 planes with inward-facing walls
    const {
      leftWall,
      rightWall,
      ceiling,
      floor,
      backWall,
      wallMaterials,
    } = getConfiguredWallPlanes(loadingManager)

    scene.add(leftWall, rightWall, ceiling, floor, backWall);

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
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const previousMousePosition = new THREE.Vector2();

    let isHoveringModel = false;
    let isDraggingModel = false;
    let velocityY = 0; // rotation velocity around Y axis

    window.addEventListener('mousemove', (event) => {
      const { width, height } = getSceneSize();

      mouse.x = event.clientX / width * 2 - 1;
      mouse.y = - (event.clientY / height) * 2 + 1;

      if (model) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(model, true);
        isHoveringModel = intersects.length > 0;
      }

      updateCursorType(isDraggingModel, isHoveringModel);
    });

    renderer.domElement.addEventListener('mousedown', (event) => {
      isDraggingModel = true;
      velocityY = 0; // Reset velocity on new drag start
      previousMousePosition.set(event.clientX, event.clientY); // Initial mouse position when I start grabbing the model
      updateCursorType(isDraggingModel, isHoveringModel);
    });

    renderer.domElement.addEventListener('mouseup', () => {
      isDraggingModel = false;
      updateCursorType(isDraggingModel, isHoveringModel);
    });

    renderer.domElement.addEventListener('mouseleave', () => {
      isDraggingModel = false;
      updateCursorType(isDraggingModel, isHoveringModel);
    });

    renderer.domElement.addEventListener('mousemove', (event) => {
      if (!isDraggingModel) return;

      // Horizontal distance moved so far
      const deltaX = event.clientX - previousMousePosition.x;

      // Velocity increases the larger deltaX becomes
      velocityY = deltaX * MODEL_MANUAL_ROTATION_SETTINGS.SENSITIVITY;

      // apply velocity to model rotation
      const quaternionDelta = createYRotationQuaternion(velocityY);
      model.quaternion.premultiply(quaternionDelta);

      previousMousePosition.set(event.clientX, event.clientY);
    });

    // STATS panel
    stats.showPanel(0); // NOTE: 0 = fps, 1 = ms, 2 = memory

    loadingManager.onLoad = () => {
      // Initialize lil-gui since all assets were loaded
      initGUI({
        camera,
        ambientLight,
        pointLight,
        wallMaterials,
        model,
      });

      resolve();
    };

    loadingManager.onError = (err) => reject(err);

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

      // MODEL RANDOM ROTATION
      const { x, y, z } = rotationSpeeds

      if (model) {
        // AUTOMATIC ROTATION
        model.rotation.x += x;
        model.rotation.y += y;
        model.rotation.z += z;

        // AFTER MANUAL ROTATION
        if (!isDraggingModel) {
          // apply velocity to model rotation
          const quaternionDelta = createYRotationQuaternion(velocityY);
          model.quaternion.premultiply(quaternionDelta);

          // Apply damping to slow velocity down gradually
          velocityY *= MODEL_MANUAL_ROTATION_SETTINGS.DAMPING;
        }
      }

      renderer.render(scene, camera);
      stats.end();
    });
  })
};
