import { pseudo } from "./classes/physicalQuantities";

const x = pseudo("5m").multiply(pseudo("1km"));
console.log(x.print());