import GUI from 'lil-gui';

const CAMERA_SETTINGS_OPTIONS = ['fov', 'near', 'far'];
const PLANE_COORDINATES = ['x', 'y', 'z'];

const initGUI = ({
  camera,
  ambientLight,
  pointLight,
  wallMaterials,
  model,
}) => {
  const gui = new GUI();

  const addColorPicker = (folder, obj, prop, onChange) => {
    folder.addColor(obj, prop).onChange(onChange);
  };

  // Camera controls
  const updateCamera = () => camera.updateProjectionMatrix();
  const cameraFolder = gui.addFolder('Camera');
  CAMERA_SETTINGS_OPTIONS.forEach(prop => {
    let range = { fov: [10, 120], near: [0.01, 10], far: [10, 200] }[prop];
    cameraFolder.add(camera, prop, range[0], range[1]).onChange(updateCamera);
  });
  cameraFolder.close();

  // Ambient light controls
  const ambientFolder = gui.addFolder('Ambient Light');
  addColorPicker(ambientFolder, ambientLight, 'color');
  ambientFolder.add(ambientLight, 'intensity', 0, 300);
  ambientFolder.close();

  // Point light controls
  const pointFolder = gui.addFolder('Point Light');
  addColorPicker(pointFolder, pointLight, 'color');
  pointFolder.add(pointLight, 'intensity', 0, 300);
  pointFolder.add(pointLight.shadow, 'bias', -0.05, 0.05, 0.0001).name('shadowBias');
  pointFolder.close();

  // Wall materials controls
  const wallsFolder = gui.addFolder('Wall Materials');
  Object.entries(wallMaterials).forEach(([name, mat]) => {
    const folder = wallsFolder.addFolder(name);
    folder.add(mat, 'metalness', 0, 1, 0.01);
    folder.add(mat, 'roughness', 0, 1, 0.01);
    folder.add(mat, 'aoMapIntensity', 0, 5, 0.01);
    folder.add(mat, 'displacementScale', -1.5, 1.5, 0.001);
    folder.add(mat.normalScale, 'x', -4, 4, 0.01).name('normalScale X');
    folder.add(mat.normalScale, 'y', -4, 4, 0.01).name('normalScale Y');
    folder.close();
  });
  wallsFolder.close();

  // Model controls
  const modelFolder = gui.addFolder('Model Controls');
  PLANE_COORDINATES.forEach(axis => {
    modelFolder.add(model.position, axis, -10, 10, 0.01).name(`Position ${axis.toUpperCase()}`);
  });
  PLANE_COORDINATES.forEach(axis => {
    modelFolder.add(model.rotation, axis, 0, Math.PI * 2, 0.01).name(`Rotation ${axis.toUpperCase()}`);
  });

  // Uniform scale control for model
  const scaleParams = {
    uniformScale: model.scale.x, // assume uniform scaling to start
  };

  modelFolder.add(scaleParams, 'uniformScale', 0.1, 10, 0.01)
    .name('Uniform Scale')
    .onChange(value => {
      model.scale.set(value, value, value);

      // Update the stored uniformScale param so the slider stays in sync
      scaleParams.uniformScale = value;
    });
  modelFolder.close();

  return gui;
};

export default initGUI;
