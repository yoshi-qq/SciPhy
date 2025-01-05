import { Mesh } from "three";
import { Quantity, pseudo, Vector } from "./physicalQuantities";

export class physicsObject {
  position: Quantity;
  rotation: Quantity;
  momentum: Quantity;
  angularMomentum: Quantity;
  mass: Quantity;
  temperature: Quantity;
  charge: Quantity;

  constructor(position: Quantity = new Quantity("m", new Vector(10, [1, 1, 1])), rotation: Quantity = new Quantity("", new Vector(10, [1, 1, 1])), momentum: Quantity = new Quantity("m/s", new Vector(10, [1, 1, 1])), angularMomentum: Quantity = new Quantity("/s", new Vector(10, [1, 1, 1])), mass: Quantity, temperature: Quantity  = new Quantity("K", 273.15+25), charge: Quantity = new Quantity("C", 0)) {
    this.position = position;
    this.rotation = rotation;
    this.momentum = momentum;
    this.angularMomentum = angularMomentum;
    this.mass = mass;
    this.temperature = temperature;
    this.charge = charge;
  }
}

export class physicsBody extends physicsObject {
  mesh: Mesh;

  constructor(mesh: Mesh, object: physicsObject) {
    super(object.position, object.rotation, object.momentum, object.angularMomentum, object.mass, object.temperature, object.charge);
    this.mesh = mesh;
  }
}