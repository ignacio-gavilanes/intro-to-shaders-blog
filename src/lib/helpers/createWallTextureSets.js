import * as THREE from 'three';

const createWallTextureSets = (loadingManager) => {
  const textureLoader = new THREE.TextureLoader(loadingManager);

  const loadTexture = (path, isColorTexture = true) => {
    const texture = textureLoader.load(path);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.repeat.set(1, 1);
    texture.colorSpace = isColorTexture
      ? THREE.SRGBColorSpace
      : THREE.LinearSRGBColorSpace;

    return texture;
  };

  const loadWallTextures = (basePath, baseName) => ({
    map: loadTexture(`${basePath}/${baseName}_diff_4k.jpg`, true),
    aoMap: loadTexture(`${basePath}/${baseName}_ao_4k.jpg`, false),
    roughnessMap: loadTexture(`${basePath}/${baseName}_rough_4k.jpg`, false),
    normalMap: loadTexture(`${basePath}/${baseName}_nor_gl_4k.jpg`, false),
    displacementMap: loadTexture(`${basePath}/${baseName}_disp_4k.jpg`, false),
  });

  const wallTextureSets = {
    left: loadWallTextures('/textures/climbing_wall', 'climbing_wall'),
    right: loadWallTextures('/textures/climbing_wall_base', 'climbing_wall_base'),
    ceiling: loadWallTextures('/textures/climbing_wall_02', 'climbing_wall_02'),
    floor: loadWallTextures('/textures/climbing_wall_base', 'climbing_wall_base'),
    back: loadWallTextures('/textures/climbing_wall', 'climbing_wall'),
  };

  return wallTextureSets;
}

export default createWallTextureSets;
