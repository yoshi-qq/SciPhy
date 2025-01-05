import { PerspectiveCamera } from "three";
export function createDefaultCamera() {
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e5);
  camera.position.z = 1e4;
  return camera;
}