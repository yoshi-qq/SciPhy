import { AmbientLight, PointLight, Scene } from "three";
export function addDefaultLight(scene: Scene) {
  const ambientLight = new AmbientLight(0x404040);
  scene.add(ambientLight);
}

export function addPointLight(scene: Scene) {
  const pointLight = new PointLight(0xffffff, 250, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
}