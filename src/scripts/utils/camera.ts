import { PerspectiveCamera } from "three";
import { zoom, scaling } from "../../constants/constants";
export function createDefaultCamera() {
  const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1e13);
  camera.rotation.x = -Math.PI* 2/12;
  camera.position.z = zoom*scaling*4.5e12;
  camera.position.y = 1e12*zoom*scaling;
  return camera;
}