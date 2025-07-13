// import { initScene } from './scene';

// import handleLowBatteryWarning from './lib/helpers/handleLowBatteryWarning';

// import './style.scss';

// const loadingScreen = document.getElementById('loading-screen');

// async function start() {
//   try {
//     await initScene();
//   } catch (error) {
//     loadingScreen.textContent = 'Failed to load 3D model.';
//   } finally {
//     loadingScreen.style.display = 'none';
//   }
// }

// handleLowBatteryWarning();

// start();
// main.js
import { animate, stagger } from "motion";

import { initScene } from './scene.js';
import handleLowBatteryWarning from './lib/helpers/handleLowBatteryWarning';

const loadingScreen = document.getElementById('loading-screen');
const spinner = document.querySelector('.spinner');
const loadingText = document.querySelector('.loading-text');
const successContainer = document.querySelector('.success-container');
const readyItems = document.querySelectorAll('.ready-item');
const checkmarks = document.querySelectorAll('.checkmark');

const showLoading = async () => {
  // Show loading screen
  loadingScreen.style.display = 'flex';

  // Animate in: loading screen, spinner, and "Loading..." text
  await animate(loadingScreen,
    { opacity: [0, 1] },
    { duration: 0.3, easing: "ease-out" }
  ).finished;

  // Animate in spinner and loading text
  animate(spinner,
    { opacity: [0, 1], scale: [0.8, 1] },
    { duration: 0.4, easing: "ease-out" }
  );

  animate(loadingText,
    { opacity: [0, 1], y: [10, 0] },
    { duration: 0.4, delay: 0.1, easing: "ease-out" }
  );
};

const showSuccess = async () => {
  // Fade out loading elements
  await Promise.all([
    animate(spinner,
      { opacity: [1, 0], scale: [1, 0.8] },
      { duration: 0.3, easing: "ease-in" }
    ).finished,
    animate(loadingText,
      { opacity: [1, 0], y: [0, -10] },
      { duration: 0.3, easing: "ease-in" }
    ).finished
  ]);

  // Hide loading elements
  spinner.style.display = 'none';
  loadingText.style.display = 'none';

  // Show and animate success container
  successContainer.style.display = 'block';

  animate(successContainer,
    { opacity: [0, 1] },
    { duration: 0.3, easing: "ease-out" }
  );

  // Animate checkmarks appearing with stagger
  animate(checkmarks,
    {
      opacity: [0, 1],
      scale: [0.5, 1],
      rotate: [0, 360]
    },
    {
      duration: 0.4,
      delay: stagger(0.1),
      easing: "ease-out"
    }
  );

  // Animate "Ready" text appearing with stagger
  animate(readyItems,
    {
      opacity: [0, 1],
      x: [-20, 0]
    },
    {
      duration: 0.3,
      delay: stagger(0.1, { start: 0.2 }),
      easing: "ease-out"
    }
  );
};

const hideLoader = async () => {
  // Wait a moment to show the success state
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Fade out entire loading screen
  await animate(loadingScreen,
    { opacity: [1, 0] },
    { duration: 0.5, easing: "ease-in-out" }
  ).finished;

  // Hide completely
  loadingScreen.style.display = 'none';
};

async function start() {
  try {
    // Show loading animation
    await showLoading();

    await initScene();

    // Show success animation
    await showSuccess();

    // Hide loader and reveal scene
    await hideLoader();

  } catch (error) {
    console.log('Failed to load scene:', error);
    loadingScreen.textContent = 'Failed to load 3D model.';
  }
}

start();

handleLowBatteryWarning();
