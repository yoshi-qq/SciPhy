import { Scene, BoxGeometry, MeshStandardMaterial, Mesh, SphereGeometry } from "three";
import { Quantity, sameUnit, pseudoUnit, pseudo, Scalar, Vector } from "../classes/physicalQuantities";
import { physicsObject, physicsBody } from "../classes/physicsObjects";
import { zoom, scaling, flip, ORANGE, GRAY, YELLOW, BLUE, BROWN, BEIGE, WHITEISH, LIGHT_BLUE, BLUEISH} from "../../constants/constants";
import { applyGravity } from "../formulas/gravitation";

const range = 0;

function createSphere(radius: number, color: number) {
  const geometry = new SphereGeometry(radius);
  const material = new MeshStandardMaterial({ color: color });
  const sphere = new Mesh(geometry, material);
  sphere.position.set((Math.random() - 0.5) * range, (Math.random() - 0.5) * range, (Math.random() - 0.5) * range);
  return sphere;
}

class Planet extends physicsBody{
  constructor(position: Quantity, mass: Quantity, radius: Quantity, color = 0xCCCCCC, momentum: Quantity = new Quantity(pseudoUnit("kg*m/s"), new Vector(0, [0, 0, 0]))) {
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
    if (!sameUnit(momentum.unit, pseudoUnit("kg*m/s"))){
      throw new Error(`momentum must be a length, not ${momentum.unit}`);
    } else if ( !(momentum.value instanceof Vector) ) {
      throw new Error(`momentum must be a Vector, not ${typeof momentum.value}`);
    }

    const mesh = createSphere(radius.value.value*zoom, color);
    const object = new physicsObject(position, new Quantity("", new Vector(0, [1, 1, 1])), momentum, new Quantity("kg/s", new Vector(10, [1, 1, 1])), mass);
    super(mesh, object);
  }
  updateRender() {
    this.mesh.position.x = (this.position.value as Vector).getDirectionalValue(0) * zoom * scaling;
    this.mesh.position.y = (this.position.value as Vector).getDirectionalValue(1) * zoom * scaling;
    this.mesh.position.z = (this.position.value as Vector).getDirectionalValue(2) * zoom * scaling;
  }
  add(scene: Scene) {
    scene.add(this.mesh);
  }
  remove(scene: Scene) {
    scene.remove(this.mesh);
  }
}

const planets: Planet[] = [];

export function initTemplate(scene: Scene) {
  const sun = new Planet(new Quantity(pseudoUnit("m"), new Vector(0, [0, 0, 1])), pseudo("1.9885e30kg"), pseudo("695700e3m"), ORANGE, new Quantity(pseudoUnit("kg*m/s"), new Vector(0, [1, 0, 0])));
  const mercury = new Planet(new Quantity(pseudoUnit("m"), new Vector(57.91e9, [0, 0, flip])), pseudo("3.3011e23kg"), pseudo("2439.7e3m"), GRAY, new Quantity(pseudoUnit("kg*m/s"), new Vector(1.563467e+28, [1, 0, 0])));
  const venus = new Planet(new Quantity(pseudoUnit("m"), new Vector(108.21e9, [0, 0, flip])), pseudo("4.8675e24kg"), pseudo("6051.8e3m"), YELLOW, new Quantity(pseudoUnit("kg*m/s"), new Vector(1.704599e+29, [1, 0, 0])));
  const earth = new Planet(new Quantity(pseudoUnit("m"), new Vector(1.496e11, [0, 0, flip])), pseudo("5.972168e24kg"), pseudo("6371e3m"), BLUE, new Quantity(pseudoUnit("kg*m/s"), new Vector(1.778581e+29, [1, 0, 0])));
  const mars = new Planet(new Quantity(pseudoUnit("m"), new Vector(2.27939366e8, [0, 0, flip])), pseudo("6.4171e23kg"), pseudo("3389.5e3m"), BROWN, new Quantity(pseudoUnit("kg*m/s"), new Vector(1.544596e+28, [1, 0, 0])));
  const jupiter = new Planet(new Quantity(pseudoUnit("m"), new Vector(778.479e9, [0, 0, flip])), pseudo("1.8982e27kg"), pseudo("69911e3m"), BEIGE, new Quantity(pseudoUnit("kg*m/s"), new Vector(2.480947e+31, [1, 0, 0])));
  const saturn = new Planet(new Quantity(pseudoUnit("m"), new Vector(1433.53e9, [0, 0, flip])), pseudo("5.6834e26kg"), pseudo("58232e3m"), WHITEISH, new Quantity(pseudoUnit("kg*m/s"), new Vector(5.507215e+30, [1, 0, 0])));
  const uranus = new Planet(new Quantity(pseudoUnit("m"), new Vector(2.870972e12, [0, 0, flip])), pseudo("8.6810e25kg"), pseudo("25362e3m"), LIGHT_BLUE, new Quantity(pseudoUnit("kg*m/s"), new Vector(5.911761e+29, [1, 0, 0])));
  const neptune = new Planet(new Quantity(pseudoUnit("m"), new Vector(4.5e12, [0, 0, flip])), pseudo("1.02409e26kg"), pseudo("24622e3m"), BLUEISH, new Quantity(pseudoUnit("kg*m/s"), new Vector(5.561026e+29, [1, 0, 0])));


  planets.push(sun);
  planets.push(mercury);
  planets.push(earth);
  planets.push(venus);
  planets.push(mars);
  planets.push(jupiter);
  planets.push(saturn);
  planets.push(uranus);
  planets.push(neptune);
  for (const planet of planets) {
    planet.add(scene);
  }
}

export function tickTemplate() {
  applyGravity(planets);
  for (const planet of planets) {
    planet.tick();
    planet.updateRender();
  }
}