import { Mesh } from "three";
import { Quantity, pseudo, pseudoUnit, Vector, sameUnit } from "./physicalQuantities";
import { tickTime } from "../../constants/constants";

export class physicsObject {
  position: Quantity;
  rotation: Quantity;
  momentum: Quantity;
  angularMomentum: Quantity;
  mass: Quantity;
  temperature: Quantity;
  charge: Quantity;

  constructor(position: Quantity = new Quantity("m", new Vector(10, [1, 1, 1])), rotation: Quantity = new Quantity("", new Vector(10, [1, 1, 1])), momentum: Quantity = new Quantity("kg*m/s", new Vector(10, [1, 1, 1])), angularMomentum: Quantity = new Quantity("kg/s", new Vector(10, [1, 1, 1])), mass: Quantity, temperature: Quantity  = new Quantity("K", 273.15+25), charge: Quantity = new Quantity("C", 0)) {
    this.position = position;
    this.rotation = rotation;
    this.momentum = momentum;
    this.angularMomentum = angularMomentum;
    this.mass = mass;
    this.temperature = temperature;
    this.charge = charge;
  }

  tick() {
    this.applyMomentum();
  }

  setMomentum(momentum: Quantity) {
    this.momentum = momentum;
  }

  applyMomentum() {
    this.position = this.position.add(this.momentum.multiply(pseudo(`${tickTime}s`)).divide(this.mass));
    this.rotation = this.rotation.add(this.angularMomentum.multiply(pseudo(`${tickTime}s`)).divide(this.mass));
  }

  applyForce(force: Quantity) {
    if (sameUnit(force.unit, pseudoUnit("N"))) {
      this.momentum = this.momentum.add(force.multiply(pseudo(`${tickTime}s`)));
    }
    else {
      throw new Error(`Force must be a force, not ${force.unit}`);
    }
  }
}

export class physicsBody extends physicsObject {
  mesh: Mesh;

  constructor(mesh: Mesh, object: physicsObject) {
    super(object.position, object.rotation, object.momentum, object.angularMomentum, object.mass, object.temperature, object.charge);
    this.mesh = mesh;
  }
}