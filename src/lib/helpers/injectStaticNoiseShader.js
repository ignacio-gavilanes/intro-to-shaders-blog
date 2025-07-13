import * as THREE from 'three';
import staticNoise from '../../shaders/staticNoise.glsl?raw';

const injectStaticNoiseShader = (shader) => {
  // Add uniforms to shader
  shader.uniforms.uTime = { value: 0 };
  shader.uniforms.resolution = {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  };

  // Inject custom uniforms and helper function at the top of the fragment shader
  shader.fragmentShader = `
    uniform float uTime;
    uniform vec2 resolution;

    float randCustom(vec2 co) {
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    ${shader.fragmentShader}
  `;

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <dithering_fragment>',
    `
      ${staticNoise}
      #include <dithering_fragment>
    `
  );
};

export default injectStaticNoiseShader;
