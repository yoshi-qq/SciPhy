import { Scene, BoxGeometry, MeshStandardMaterial, Mesh, SphereGeometry } from "three";
import { Quantity, sameUnit, pseudoUnit, Scalar, Vector } from "../classes/physicalQuantities";
import { physicsObject, physicsBody } from "../classes/physicsObjects";
import { zoom } from "../../constants/constants";

const range = 0;

function createSphere(radius: number) {
  const geometry = new SphereGeometry(radius);
  const material = new MeshStandardMaterial({ color: 0x00ff00 });
  const sphere = new Mesh(geometry, material);
  sphere.position.set((Math.random() - 0.5) * range, (Math.random() - 0.5) * range, (Math.random() - 0.5) * range);
  return sphere;
}

class Planet extends physicsBody{
  constructor(position: Quantity, mass: Quantity, radius: Quantity) {
    if (!sameUnit(position.unit, pseudoUnit("m"))){
      throw new Error(`position must be a length, not ${position.unit}`);
    } else if ( !(position.value instanceof Vector) ) {
      throw new Error(`position must be a Vector, not ${typeof position.value}`);
    }
    if (!sameUnit(mass.unit, pseudoUnit("kg"))){
      throw new Error(`mass must be a mass, not ${mass.unit}`);
    } else if ( !(mass.value instanceof Scalar) ) {
      throw new Error(`mass must be a scalar, not ${typeof mass.value}`);
    }
    if (!sameUnit(radius.unit, pseudoUnit("m"))){
      throw new Error(`radius must be a length, not ${radius.unit}`);
    } else if ( !(radius.value instanceof Scalar) ) {
      throw new Error(`radius must be a scalar, not ${typeof radius.value}`);
    }
    const mesh = createSphere(radius.value.value/zoom);
    const object = new physicsObject(position, new Quantity("", new Vector(0, [1, 1, 1])), new Quantity("m/s", new Vector(0, [1, 1, 1])), new Quantity("/s", new Vector(10, [1, 1, 1])), mass);
    super(mesh, object);
  }
  // TODO: add render function to add and remove from scene
}

export function initTemplate(scene: Scene): Array<Mesh> {
  const cubes: Array<Mesh> = Array(0);
  const sphere = createSphere(6000);
  scene.add(sphere);
  cubes.push(sphere);
  return cubes;
}

export function tickTemplate(objects: Array<Mesh>) {
  for (const object of objects) {
    object.rotation.x += 0.01;
    object.rotation.y += 0.01;
  }
}