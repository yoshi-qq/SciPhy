import { AmbientLight, PointLight, Scene } from "three";
export function addDefaultLight(scene: Scene) {
  const ambientLight = new AmbientLight(0x404040, 3e1);
  scene.add(ambientLight);
}

export function addPointLight(scene: Scene) {
  const pointLight = new PointLight(0xffffff, 1e12, 1e5);
  pointLight.position.set(0, 0, 1e5);
  scene.add(pointLight);
}