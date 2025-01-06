import { physicsBody, physicsObject } from "../classes/physicsObjects";
import { G } from "./physicsConstants";
import { Quantity, Scalar, Vector, pseudo, pseudoUnit } from "../classes/physicalQuantities";
import { getAllPairs } from "../utils/math";
function getGravityForce(body1: physicsObject, body2: physicsObject)  {
  const m_1 = body1.mass;
  const m_2 = body2.mass;
  const directionVector = body1.position.subtract(body2.position).getNormalizedQuantity();
  const r = directionVector.getLength();
  const magnitude = (m_1.multiply(m_2).multiply(G).divide(r.exponentiate(new Scalar(2))));
  const unitVector = directionVector.getUnitQuality().getUnitlessQuantity();
  console.log(`G: ${(G.value as Scalar).value}, m_1: ${(m_1.value as Scalar).value}, m_2: ${(m_2.value as Scalar).value}, r: ${(r.value as Scalar).value}, magnitude: ${(magnitude.value as Scalar).value}`);
  return unitVector.multiply(magnitude);
}

export function applyGravity(bodies: physicsBody[]) {
  for (const [body1, body2] of getAllPairs(bodies)) {
    const force = getGravityForce(body1, body2);
    body1.applyForce(force);
    body2.applyForce(force.multiply(new Quantity(pseudoUnit(""), -1)));
  }
}