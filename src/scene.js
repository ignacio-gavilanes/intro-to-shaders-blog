import * as THREE from 'three';
import Stats from 'stats.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import getSceneSize from './lib/helpers/getSceneSize';
import initGUI from './lib/helpers/initGUI';
import toggleShader from './lib/helpers/toggleShader';
import applyStaticNoiseShader from './lib/helpers/applyStaticNoiseShader.js';
import getConfiguredWallPlanes from './lib/helpers/getConfiguredWallPlanes';

import {
  DEVICE_PIXEL_RATIO,
  CAMERA,
  PARALLAX_STRENGTH,
  POINT_LIGHT,
  AMBIENT_LIGHT,
} from './lib/constants';

const stats = new Stats();
document.body.appendChild(stats.dom);

export function initScene() {
  return new Promise((resolve, reject) => {
    const loadingManager = new THREE.LoadingManager();
    const canvas = document.querySelector('#webgl');
    const scene = new THREE.Scene();
    const gltfLoader = new GLTFLoader(loadingManager);

    document.getElementById('toggle-shader-btn').addEventListener('click', () => {
      toggleShader(screenMesh);
    });

    let model;
    let screenMesh;
    let originalMaterial;

    gltfLoader.load(
      '/model/Television_01_4k.gltf',
      (gltf) => {
        model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        screenMesh = model.getObjectByName('Screen');

        if (screenMesh) {
          originalMaterial = screenMesh.material.clone();
          screenMesh.material = originalMaterial.clone();
          applyStaticNoiseShader(screenMesh.material);
        }

        model.position.y = -5;
        model.position.z = 1.25;
        model.rotation.y = 3.25;
        model.scale.setScalar(6);

        scene.add(model);
      },
      undefined,
      (err) => console.log('GLTF load error:', err),
    );

    const camera = new THREE.PerspectiveCamera(
      CAMERA.SETTINGS.FOV,
      CAMERA.SETTINGS.ASPECT,
      CAMERA.SETTINGS.NEAR,
      CAMERA.SETTINGS.FAR,
    );

    camera.position.copy(CAMERA.INITIAL_POSITION);
    camera.lookAt(CAMERA.LOOK_AT_TARGET);

    const renderer = new THREE.WebGLRenderer({ canvas });
    const { width, height } = getSceneSize();
    renderer.setSize(width, height);
    renderer.setPixelRatio(DEVICE_PIXEL_RATIO);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const ambientLight = new THREE.AmbientLight(
      AMBIENT_LIGHT.COLOR,
      AMBIENT_LIGHT.INTENSITY,
    );
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(
      POINT_LIGHT.COLOR,
      POINT_LIGHT.INTENSITY,
    );
    pointLight.position.copy(POINT_LIGHT.POSITION);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.set(2048, 2048);
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 13;
    pointLight.shadow.bias = -0.005;

    scene.add(pointLight);

    const {
      leftWall,
      rightWall,
      floor,
      backWall,
      wallMaterials,
    } = getConfiguredWallPlanes(loadingManager);

    scene.add(leftWall, rightWall, floor, backWall);

    window.addEventListener('resize', () => {
      const { width, height } = getSceneSize();

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(DEVICE_PIXEL_RATIO);

      if (screenMesh?.material?.userData?.resolution?.value) {
        screenMesh.material.userData.resolution.value.set(width, height);
      }
    });

    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
      const { width, height } = getSceneSize();
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;
    });

    stats.showPanel(0);

    loadingManager.onLoad = () => {
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

    renderer.setAnimationLoop(() => {
      stats.begin();

      const targetX = CAMERA.INITIAL_POSITION.x + (mouse.x * PARALLAX_STRENGTH);
      const targetY = CAMERA.INITIAL_POSITION.y + (mouse.y * PARALLAX_STRENGTH);

      camera.position.x += (targetX - camera.position.x) * 0.1;
      camera.position.y += (targetY - camera.position.y) * 0.1;
      camera.lookAt(CAMERA.LOOK_AT_TARGET);

      if (screenMesh?.material?.userData?.uTime) {
        screenMesh.material.userData.uTime.value = performance.now() * 0.001;
      }

      renderer.render(scene, camera);
      stats.end();
    });
  });
}
