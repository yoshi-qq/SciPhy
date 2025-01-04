import * as TH from "three";
import { addDefaultLight, addPointLight } from "./utils/lighting";
import { createDefaultCamera } from "./utils/camera";
import { createRenderer } from "./utils/renderer";
import { initTemplate, tickTemplate } from "./utils/defaultTemplate";

// Initialize Scene
const scene = new TH.Scene();
const camera = createDefaultCamera();
addDefaultLight(scene);
addPointLight(scene);
const renderer = createRenderer();

// test
const objects = initTemplate(scene);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // ticks
  tickTemplate(objects);

  // Render the scene
  renderer.render(scene, camera);
}

// Start 
animate();
