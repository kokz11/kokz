import './style.css';
import * as THREE from 'three';
import { sRGBEncoding } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as dat from 'dat.gui';
import { PMREMGenerator, Texture, UnsignedByteType } from 'three';

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Lights
const lightState = {
  ambientIntensity: 0,
  ambientColor: 0xffffff,
  directIntensity: 2,
  directColor: 0xffffff,
};

const hemisphereLight = new THREE.HemisphereLight();
const ambientLight = new THREE.AmbientLight(
  lightState.ambientColor,
  lightState.ambientIntensity,
);
const directionalLight = new THREE.DirectionalLight(
  lightState.directColor,
  lightState.directIntensity,
);

directionalLight.position.x = 2;

scene.add(hemisphereLight);
scene.add(ambientLight);
scene.add(directionalLight);

// GLTF
const modelLoader = new GLTFLoader();

modelLoader.load(
  './models/monitor.glb',
  (gltf) => {
    scene.add(gltf.scene);
    tick();
  },
  undefined,
  (error) => {
    console.error(error);
  },
);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.2,
  100,
);
camera.position.x = 0;
camera.position.y = 0.1;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = true;
renderer.outputEncoding = sRGBEncoding;

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
