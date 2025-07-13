import applyStaticNoiseShader from './applyStaticNoiseShader.js';

let isCustomShaderActive = false;
let originalMaterial = null;

const toggleShader = (screenMesh) =>  {
  if (!screenMesh) return;

  if (!originalMaterial) {
    originalMaterial = screenMesh.material.clone();
  }

  screenMesh.material = originalMaterial.clone();

  if (!isCustomShaderActive) {
    applyStaticNoiseShader(screenMesh.material);
  }

  isCustomShaderActive = !isCustomShaderActive;
};

export default toggleShader;
