import { pseudo } from "./classes/physicalQuantities";

const quantity1 = pseudo("1A");
const quantity2 = pseudo("60kΩ");
console.log(quantity1.multiply(quantity2).print());