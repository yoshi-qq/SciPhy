import { WebGLRenderer } from "three";
export function createRenderer() {
  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer; 
}
