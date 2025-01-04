import { Quantity, Unit, Scalar, SI } from "./classes/physicalQuantities";

const quantity = new Quantity(new Unit(new Map([[SI.L, 3], [SI.M, -1], [SI.T, -2]])), new Scalar(6));
console.log(quantity.print());