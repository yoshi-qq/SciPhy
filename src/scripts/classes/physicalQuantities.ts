import { invertMap } from "../utils/utilFunctions";

// TODO: automatic unit conversion and one unique identifier -> Shorthand and Name only as printables and never identifiers

// FIXME: add german option to names again
const language = "DE";

// Enum of the SISymbols for SI-Units
enum SISymbol {
    T = "T", // time
    L = "L", // length
    M = "M", // mass
    I = "I", // electric current
    Θ = "Θ", // thermodynamic temperature
    N = "N", // amount of substance
    J = "J" // luminous intensity
}

enum Symbol {
  F = "F", // force
  f = "f", // frequency
  X = "X", // unknown
}

export const SI = SISymbol;
export const SY = Symbol;

const multiplicationSplitter = language === "DE" ? " mal " : " times ";
const divisionSplitter = language === "DE" ? " pro " : " per ";
const unitlessSingular = language === "DE" ? "" : "";
const unitlessPlural = language === "DE" ? "" : "";

export class Scalar {
  value: number;
  constructor(value: number) {
    this.value = value;
  }
  add(scalar2: Scalar): Scalar {
    return new Scalar(this.value + scalar2.value);
  }
  subtract(scalar2: Scalar): Scalar {
    return new Scalar(this.value - scalar2.value);
  }
  multiply(scalar2: Scalar): Scalar {
    return new Scalar(this.value * scalar2.value);
  }
  divide(scalar2: Scalar): Scalar {
    return new Scalar(this.value / scalar2.value);
  }
}

// Vector with magnitude and direction unit-vector
export class Vector {
  magnitude: number;
  direction: Array<number>;

  constructor(magnitude: number, direction: Array<number>) {
    this.magnitude = magnitude;
    this.direction = direction;
  }
  // Normalize the vector
  getNormalizedVector() {
    const normalizedVector = new Vector(this.magnitude, this.direction);
    let scaling = Math.sqrt(normalizedVector.direction.reduce((acc, curr) => acc + curr ** 2));
    if (normalizedVector.magnitude < 0) {
      scaling *= -1;
    } else if (scaling === 0) {
      return new Vector(0, this.direction);
    }
    normalizedVector.magnitude *= scaling;
    for (let i = 0; i < normalizedVector.direction.length; i++) {
      normalizedVector.direction[i] /= scaling;
    }
    return normalizedVector;
  }
  add(vector2: Vector) {
    const newDirection = vector2.direction.map((value, index) => vector2.magnitude * value + this.magnitude * this.direction[index]);
    return new Vector(1, newDirection).getNormalizedVector();
  }
  subtract(vector2: Vector) {
    const newDirection = vector2.direction.map((value, index) => vector2.magnitude * value - this.magnitude * this.direction[index]);
    return new Vector(1, newDirection).getNormalizedVector();
  }
  multiply(scalar: Scalar) {
    return new Vector(this.magnitude * scalar.value, this.direction);
  }
  divide(scalar: Scalar) {
    return new Vector(this.magnitude / scalar.value, this.direction);
  }
}

// Unit definition as a Map of QuantitySymbols and exponents
export class Unit {
  symbols: Map<SISymbol, number>;
  constructor(symbols: Map<SISymbol, number>) {
    this.symbols = symbols;
  }
  multiply(unit2: Unit) {
    const newUnit = new Unit(new Map(this.symbols));
    for (const [symbol, exponent] of unit2.symbols) {
      newUnit.symbols.set(symbol, (newUnit.symbols.get(symbol) ?? 0) + exponent);
    }
    return newUnit;
  }
  divide(unit2: Unit) {
    const newUnit = new Unit(new Map(this.symbols));
    for (const [symbol, exponent] of unit2.symbols) {
      newUnit.symbols.set(symbol, (newUnit.symbols.get(symbol) ?? 0) - exponent);
    }
    return newUnit;
  }
}

// Unit name in singular and plural form
class UnitIdentifier {
  unit: Unit;
  symbol: SISymbol | Symbol;
  shorthand: string;
  singular: string;
  plural: string;

  constructor(unit: Unit, symbol: SISymbol | Symbol, shorthand: string, singular: string, plural: string) {
    this.unit = unit;
    this.symbol = symbol;
    this.shorthand = shorthand;
    this.singular = singular;
    this.plural = plural;
  }
}

const unitIdentifiers = [
  new UnitIdentifier(new Unit(new Map([[SI.T, 1]])), SI.T, "s", language === "DE" ? "Sekunde" : "second", language === "DE" ? "Sekunden" : "seconds"), // s
  new UnitIdentifier(new Unit(new Map([[SI.L, 1]])), SI.L, "m", language === "DE" ? "Meter" : "meter", language === "DE" ? "Meter" : "meters"), // m
  new UnitIdentifier(new Unit(new Map([[SI.M, 1]])), SI.M, "kg", language === "DE" ? "Kilogramm" : "kilogram", language === "DE" ? "Kilogramm" : "kilograms"), // kg
  new UnitIdentifier(new Unit(new Map([[SI.I, 1]])), SI.I, "A", language === "DE" ? "Ampere" : "ampere", language === "DE" ? "Ampere" : "amperes"), // A
  new UnitIdentifier(new Unit(new Map([[SI.Θ, 1]])), SI.Θ, "K", language === "DE" ? "Kelvin" : "kelvin", language === "DE" ? "Kelvin" : "kelvins"), // K
  new UnitIdentifier(new Unit(new Map([[SI.N, 1]])), SI.N, "mol", language === "DE" ? "Mol" : "mole", language === "DE" ? "Mol" : "moles"), // mol
  new UnitIdentifier(new Unit(new Map([[SI.J, 1]])), SI.J, "cd", language === "DE" ? "Candela" : "candela", language === "DE" ? "Candela" : "candelas"), // cd
  new UnitIdentifier(new Unit(new Map([[SI.T, -1]])), SY.f, "Hz", language === "DE" ? "Hertz" : "hertz", language === "DE" ? "Hertz" : "hertz"), // Hz
  new UnitIdentifier(new Unit(new Map([[SI.M, 1], [SI.L, 1], [SI.T, -2]])), SY.F, "N", language === "DE" ? "Newton" : "newton", language === "DE" ? "Newton" : "newtons"), // N
];

function exponentiateUnitName(unitName: string, exponent: number): string {
  switch (exponent) {
  case 1:
    return unitName;
  case 2: 
    return language === "DE" ? `Quadrat${unitName.toLowerCase()}` : `${unitName} squared`;
  case 3: 
    return language === "DE" ? `Kubik${unitName.toLowerCase()}` : `${unitName} cubed`;
  default:
    return language === "DE" ? `${unitName} hoch ${exponent}` : `${unitName} to the power of ${exponent}`;
  }
}

function identifyCompositionUnit(unit: Unit): UnitIdentifier {
  let numerator = "";
  const singularNumeratorList = [];
  const pluralNumeratorList = [];
  let denominator = "";
  const singularDenominatorList = [];
  const pluralDenominatorList = [];

  for (const [symbol, exponent] of unit.symbols) {
    const symbolUnit = getUnitIdentifierBySymbol(symbol);
    const symbolUnitShorthand = symbolUnit.shorthand;
    if (exponent > 0) {
      singularNumeratorList.push(exponentiateUnitName(symbolUnit.singular, exponent));
      pluralNumeratorList.push(exponentiateUnitName(symbolUnit.plural, exponent));
      const exponentString = exponent === 1 ? "" : `^${exponent}`;
      numerator += `${symbolUnitShorthand}${exponentString}`;
    } else if (exponent < 0) {
      singularDenominatorList.push(exponentiateUnitName(symbolUnit.singular, -exponent));
      pluralDenominatorList.push(exponentiateUnitName(symbolUnit.plural, -exponent));
      const exponentString = -exponent === 1 ? "" : `^${-exponent}`;
      denominator += `${symbolUnitShorthand}${exponentString}`;
    }
  }
  const shorthand = `${numerator}/${denominator}`;
  let singular = singularNumeratorList.length !== 0 ? `${singularNumeratorList.join(multiplicationSplitter)}` : unitlessSingular;
  let plural = pluralNumeratorList.length !== 0 ? `${pluralNumeratorList.join(multiplicationSplitter)}` : unitlessPlural;

  if (singularDenominatorList.length !== 0) {
    singular += `${divisionSplitter}${singularDenominatorList.join(multiplicationSplitter)}`;
  }
  if (pluralDenominatorList.length !== 0) {
    plural += `${divisionSplitter}${singularDenominatorList.join(multiplicationSplitter)}`;
  }

  return new UnitIdentifier(unit, SY.X, shorthand, singular, plural);
}

function getUnitIdentifierByUnit(unit: Unit): UnitIdentifier {
  let result = unitIdentifiers.find((identifier) => sameUnit(identifier.unit, unit));
  if (!result) {
    result = identifyCompositionUnit(unit);
    // result = new UnitIdentifier(unit, SY.X, "x", "unknown", "unknowns");
  }
  return result;
}

function getUnitIdentifierBySymbol(symbol: SISymbol | Symbol): UnitIdentifier {
  const result = unitIdentifiers.find((identifier) => identifier.symbol === symbol);
  if (!result) {
    throw new Error(`No unit matching symbol ${symbol}`);
  }
  return result;
}

// Helper: Check if two units are equivalent
function sameUnit(unit1: Unit, unit2: Unit): boolean {
  const symbols1 = fixUnit(unit1).symbols;
  const symbols2 = fixUnit(unit2).symbols;

  if (symbols1.size !== symbols2.size) return false;

  for (const [key, value] of symbols1) {
    if (symbols2.get(key) !== value) return false;
  }
  return true;
}

// Helper: Remove zero exponent symbols from a unit
function fixUnit(unit: Unit): Unit {
  const symbols = new Map(
    Array.from(unit.symbols).filter(([_, exponent]) => exponent !== 0)
  );
  return new Unit(symbols);
}

export class Quantity {
  unit: Unit;
  value: Vector | Scalar;

  constructor(unit: Unit, value: Vector | Scalar) {
    this.unit = unit;
    this.value = value;
  }
  
  add(quantity2: Quantity) {
    if (!sameUnit(this.unit, quantity2.unit)) {
      throw new Error("Cannot add quantities of different types");
    }
    if (this.value instanceof Scalar && quantity2.value instanceof Scalar) {
      return new Quantity(this.unit, this.value.add(quantity2.value));
    } else if (this.value instanceof Vector && quantity2.value instanceof Vector) {
      return new Quantity(this.unit, this.value.add(quantity2.value));
    } else {
      throw new Error("Cannot add quantities with types Scalar and Vector");
    }
  }
  
  subtract(quantity2: Quantity) {
    if (!sameUnit(this.unit, quantity2.unit)) {
      throw new Error("Cannot subtract quantities of different types");
    }
    if (this.value instanceof Scalar && quantity2.value instanceof Scalar) {
      return new Quantity(this.unit, this.value.subtract(quantity2.value));
    } else if (this.value instanceof Vector && quantity2.value instanceof Vector) {
      return new Quantity(this.unit, this.value.subtract(quantity2.value));
    } else {
      throw new Error("Cannot subtract quantities with types Scalar and Vector");
    }
  }
  
  multiply(quantity2: Quantity) {
    if (!sameUnit(this.unit, quantity2.unit)) {
      throw new Error("Cannot multiply quantities of different types");
    }
    if (this.value instanceof Scalar && quantity2.value instanceof Scalar) {
      return new Quantity(this.unit.multiply(quantity2.unit), this.value.multiply(quantity2.value));
    } else if (this.value instanceof Vector && quantity2.value instanceof Vector) {
      throw new Error("Cannot multiply quantities with type Vector");
    } else {
      throw new Error("Cannot multiply quantities with types Scalar and Vector");
    }
  }
  
  divide(quantity2: Quantity) {
    if (!sameUnit(this.unit, quantity2.unit)) {
      throw new Error("Cannot divide quantities of different types");
    }
    if (this.value instanceof Scalar && quantity2.value instanceof Scalar) {
      return new Quantity(this.unit.divide(quantity2.unit), this.value.divide(quantity2.value));
    } else if (this.value instanceof Vector && quantity2.value instanceof Vector) {
      throw new Error("Cannot divide quantities with type Vector");
    } else {
      throw new Error("Cannot divide quantities with types Scalar and Vector");
    }
  }

  print(): string {
    // Get the scalar value (either the value itself for Scalar or magnitude for Vector)
    const magnitude = this.value instanceof Scalar ? this.value.value : this.value.magnitude;

    // Get the shorthand representation of the unit
    const unitName = getUnitIdentifierByUnit(this.unit);
    const unitString = Math.abs(magnitude) === 1 ? unitName?.singular : unitName?.plural;

    // Return the formatted string
    return `${magnitude} ${unitString} = ${magnitude} ${unitName.shorthand}`;
  }
}
