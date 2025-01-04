import { Scene, BoxGeometry, MeshStandardMaterial, Mesh } from "three";

const range = 5;

function createCube() {
  const geometry = new BoxGeometry();
  const material = new MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  cube.position.set((Math.random() - 0.5) * range, (Math.random() - 0.5) * range, (Math.random() - 0.5) * range);
  return cube;
}

export function initTemplate(scene: Scene): Array<Mesh> {
  const cubes: Array<Mesh> = Array(0);
  for (let i = 0; i < 5; i++) {
    const cube = createCube();
    scene.add(cube);
    cubes.push(cube);
  }
  return cubes;
}

export function tickTemplate(objects: Array<Mesh>) {
  for (const object of objects) {
    object.rotation.x += 0.01;
    object.rotation.y += 0.01;
  }
}