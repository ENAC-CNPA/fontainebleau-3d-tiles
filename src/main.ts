import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TilesRenderer } from "3d-tiles-renderer";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function main() {
  const container = document.getElementById("container");
  if (!container) {
    console.error("No container element found!");
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 1;

  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls( camera, renderer.domElement );

  const tilesRenderer = new TilesRenderer(
    "https://cimsprojects.ca:9000/assets/epfl/tiled-photomesh/tileset.json"
  );

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://cimsprojects.ca:9000/assets/epfl/draco/gltf/"
  );

  const loader = new GLTFLoader(tilesRenderer.manager);
  loader.setDRACOLoader(dracoLoader);

  tilesRenderer.manager.addHandler(/\.gltf$/, loader);

  tilesRenderer.setCamera(camera);
  const resolutionVector = new THREE.Vector2(100, 100);
  tilesRenderer.setResolution(camera, resolutionVector);
  scene.add(tilesRenderer.group);

  tilesRenderer.group.rotateX((3 * Math.PI) / 2);
  tilesRenderer.group.translateX(64.6);
  tilesRenderer.group.translateY(-58);
  tilesRenderer.group.translateZ(-106);
  
  renderLoop();

  function renderLoop() {
    requestAnimationFrame(renderLoop);
    camera.updateMatrixWorld();
    tilesRenderer.update();
    controls.update();
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

main();