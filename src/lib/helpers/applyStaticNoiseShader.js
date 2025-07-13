import * as THREE from 'three';
import injectStaticNoiseShader from './injectStaticNoiseShader.js';

const applyStaticNoiseShader = (material) => {
  material.userData.uTime = { value: 0 };
  material.userData.resolution = {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  };

  material.onBeforeCompile = (shader) => {
    injectStaticNoiseShader(shader);
    shader.uniforms.uTime = material.userData.uTime;
    shader.uniforms.resolution = material.userData.resolution;
  };

  material.needsUpdate = true;
};

export default applyStaticNoiseShader;
