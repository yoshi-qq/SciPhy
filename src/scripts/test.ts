import { Quantity, textToUnit, Scalar} from "./classes/physicalQuantities";

const quantity1 = new Quantity("A", 50);
const quantity2 = new Quantity("Ω", 5);
console.log(quantity1.multiply(quantity2).print());