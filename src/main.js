import { initScene } from './scene';

import './style.scss';

const loadingScreen = document.getElementById('loading-screen');

async function start() {
  try {
    await initScene();
  } catch (error) {
    loadingScreen.textContent = 'Failed to load 3D model.';
  } finally {
    loadingScreen.style.display = 'none';
  }
}

start();
