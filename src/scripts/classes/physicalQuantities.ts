import { invertMap } from "../utils/utilFunctions";

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
  U = "U", // voltage
  p = "p", // pressure
  E = "E", // energy 
  W = "W", // work
  P = "P", // power
  q = "q", // electric charge
  C = "C", // electrical capacitance
  R = "R", // electrical resistance
  G = "G", // electrical conductance
  Φ_B = "Φ_B", // magnetic flux
  B = "B", // magnetic flux density
  L = "L", // electrical inductance
  X = "X", // unknown
  Φ_v = "Φ_v", // luminous flux
  E_v = "E_v", // illuminance
  A = "A", // activity
  D = "D", // absorbed dose
  H = "H", // equivalent dose
  z = "z", // catalytic activity
}

export const SI = SISymbol;
export const SY = Symbol;

const multiplicationSplitter = language === "DE" ? " mal " : " times ";
const divisionSplitter = language === "DE" ? " pro " : " per ";
const unitlessSingular = language === "DE" ? "" : "";
const unitlessPlural = language === "DE" ? "" : "";

// basic Scalar number
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
  // TODO: add scalar/dot product
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

// list of all symbols, units, and naming for each unit
const unitIdentifiers = [
  new UnitIdentifier(
    new Unit(new Map([[SISymbol.T, 1]])),
    SISymbol.T,
    "s",
    language === "DE" ? "Sekunde" : "second",
    language === "DE" ? "Sekunden" : "seconds"
  ), // s

  new UnitIdentifier(
    new Unit(new Map([[SISymbol.L, 1]])),
    SISymbol.L,
    "m",
    language === "DE" ? "Meter" : "meter",
    language === "DE" ? "Meter" : "meters"
  ), // m

  new UnitIdentifier(
    new Unit(new Map([[SISymbol.M, 1]])),
    SISymbol.M,
    "kg",
    language === "DE" ? "Kilogramm" : "kilogram",
    language === "DE" ? "Kilogramm" : "kilograms"
  ), // kg

  new UnitIdentifier(
    new Unit(new Map([[SISymbol.I, 1]])),
    SISymbol.I,
    "A",
    language === "DE" ? "Ampere" : "ampere",
    language === "DE" ? "Ampere" : "amperes"
  ), // A

  new UnitIdentifier(
    new Unit(new Map([[SISymbol.Θ, 1]])),
    SISymbol.Θ,
    "K",
    language === "DE" ? "Kelvin" : "kelvin",
    language === "DE" ? "Kelvin" : "kelvins"
  ), // K

  new UnitIdentifier(
    new Unit(new Map([[SISymbol.N, 1]])),
    SISymbol.N,
    "mol",
    language === "DE" ? "Mol" : "mole",
    language === "DE" ? "Mol" : "moles"
  ), // mol

  new UnitIdentifier(
    new Unit(new Map([[SISymbol.J, 1]])),
    SISymbol.J,
    "cd",
    language === "DE" ? "Candela" : "candela",
    language === "DE" ? "Candela" : "candelas"
  ), // cd

  // Derived SI units:

  // Frequency: Hz = s^-1
  new UnitIdentifier(
    new Unit(new Map([[SISymbol.T, -1]])),
    Symbol.f,
    "Hz",
    language === "DE" ? "Hertz" : "hertz",
    language === "DE" ? "Hertz" : "hertz"
  ), // Hz

  // Force: N = kg·m·s^-2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1], 
      [SISymbol.L, 1], 
      [SISymbol.T, -2]
    ])),
    Symbol.F,
    "N",
    language === "DE" ? "Newton" : "newton",
    language === "DE" ? "Newton" : "newtons"
  ), // N

  // Pressure: Pa = N/m^2 = kg·m^-1·s^-2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1],
      [SISymbol.L, -1],
      [SISymbol.T, -2]
    ])),
    Symbol.p, 
    "Pa",
    language === "DE" ? "Pascal" : "pascal",
    language === "DE" ? "Pascal" : "pascals"
  ), // Pa

  // Energy: J = N·m = kg·m^2·s^-2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1], 
      [SISymbol.L, 2], 
      [SISymbol.T, -2]
    ])),
    Symbol.E,
    "J",
    language === "DE" ? "Joule" : "joule",
    language === "DE" ? "Joule" : "joules"
  ), // J

  // Work: J = N·m = kg·m^2·s^-2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1],
      [SISymbol.L, 2],
      [SISymbol.T, -2]
    ])),
    Symbol.W,
    "J", 
    language === "DE" ? "Joule" : "joule",
    language === "DE" ? "Joule" : "joules"
  ), // J

  // Power: W = J/s = kg·m^2·s^-3
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1], 
      [SISymbol.L, 2], 
      [SISymbol.T, -3]
    ])),
    Symbol.P,
    "W",
    language === "DE" ? "Watt" : "watt",
    language === "DE" ? "Watt" : "watts"
  ), // W

  // Electric charge: C = A·s
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.I, 1],
      [SISymbol.T, 1]
    ])),
    Symbol.q,
    "C",
    language === "DE" ? "Coulomb" : "coulomb",
    language === "DE" ? "Coulomb" : "coulombs"
  ), // C

  // Voltage (electric potential): V = kg·m^2·s^-3·A^-1
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1], 
      [SISymbol.L, 2], 
      [SISymbol.T, -3], 
      [SISymbol.I, -1]
    ])),
    Symbol.U,
    "V",
    language === "DE" ? "Volt" : "volt",
    language === "DE" ? "Volt" : "volts"
  ), // V

  // Electrical capacitance: F = C/V = kg^-1·m^-2·s^4·A^2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, -1],
      [SISymbol.L, -2],
      [SISymbol.T, 4],
      [SISymbol.I, 2]
    ])),
    Symbol.C,
    "F",
    language === "DE" ? "Farad" : "farad",
    language === "DE" ? "Farad" : "farads"
  ), // F

  // Electrical resistance: Ω = V/A = kg·m^2·s^-3·A^-2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1],
      [SISymbol.L, 2],
      [SISymbol.T, -3],
      [SISymbol.I, -2]
    ])),
    Symbol.R,
    "Ω",
    language === "DE" ? "Ohm" : "ohm",
    language === "DE" ? "Ohm" : "ohms"
  ), // Ω

  // Electrical conductance: S = 1/Ω = kg^-1·m^-2·s^3·A^2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, -1],
      [SISymbol.L, -2],
      [SISymbol.T, 3],
      [SISymbol.I, 2]
    ])),
    Symbol.G,
    "S",
    language === "DE" ? "Siemens" : "siemens",
    language === "DE" ? "Siemens" : "siemens"
  ), // S

  // Magnetic flux: Wb = V·s = kg·m^2·s^-2·A^-1
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1],
      [SISymbol.L, 2],
      [SISymbol.T, -2],
      [SISymbol.I, -1]
    ])),
    Symbol.Φ_B,
    "Wb",
    language === "DE" ? "Weber" : "weber",
    language === "DE" ? "Weber" : "webers"
  ), // Wb

  // Magnetic flux density: T = Wb/m^2 = kg·s^-2·A^-1
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1],
      [SISymbol.T, -2],
      [SISymbol.I, -1]
    ])),
    Symbol.B,
    "T",
    language === "DE" ? "Tesla" : "tesla",
    language === "DE" ? "Tesla" : "teslas"
  ), // T

  // Electrical inductance: H = Wb/A = kg·m^2·s^-2·A^-2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.M, 1],
      [SISymbol.L, 2],
      [SISymbol.T, -2],
      [SISymbol.I, -2]
    ])),
    Symbol.L,
    "H",
    language === "DE" ? "Henry" : "henry",
    language === "DE" ? "Henry" : "henrys"
  ), // H

  // Luminous flux: lm = cd·sr
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.J, 1]  // luminous intensity
    ])),
    Symbol.Φ_v,
    "lm",
    language === "DE" ? "Lumen" : "lumen",
    language === "DE" ? "Lumen" : "lumens"
  ), // lm

  // Illuminance: lx = lm/m^2 => cd·m^-2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.J, 1],
      [SISymbol.L, -2]
    ])),
    Symbol.E_v,
    "lx",
    language === "DE" ? "Lux" : "lux",
    language === "DE" ? "Lux" : "lux"
  ), // lx

  // Radioactive activity: Bq = s^-1
  new UnitIdentifier(
    new Unit(new Map([[SISymbol.T, -1]])),
    Symbol.A,
    "Bq",
    language === "DE" ? "Becquerel" : "becquerel",
    language === "DE" ? "Becquerel" : "becquerels"
  ), // Bq

  // Absorbed dose: Gy = J/kg = m^2·s^-2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.L, 2],
      [SISymbol.T, -2]
    ])),
    Symbol.D,
    "Gy",
    language === "DE" ? "Gray" : "gray",
    language === "DE" ? "Gray" : "grays"
  ), // Gy

  // Equivalent dose: Sv = J/kg = m^2·s^-2
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.L, 2],
      [SISymbol.T, -2]
    ])),
    Symbol.H,
    "Sv",
    language === "DE" ? "Sievert" : "sievert",
    language === "DE" ? "Sievert" : "sieverts"
  ), // Sv

  // Catalytic activity: kat = mol·s^-1
  new UnitIdentifier(
    new Unit(new Map([
      [SISymbol.N, 1],
      [SISymbol.T, -1]
    ])),
    Symbol.z,
    "kat",
    language === "DE" ? "Katal" : "katal",
    language === "DE" ? "Katal" : "katals"
  ), // kat
];

// returns the named version of an exponentiated unit
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

// creates a UnitIdentifier on the fly for a composition unit
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

// returns the unitIdentifier object for a given Unit
function getUnitIdentifierByUnit(unit: Unit): UnitIdentifier {
  let result = unitIdentifiers.find((identifier) => sameUnit(identifier.unit, unit));
  if (!result) {
    result = identifyCompositionUnit(unit);
    // result = new UnitIdentifier(unit, SY.X, "x", "unknown", "unknowns");
  }
  return result;
}

// returns the unitIdentifier object for a given Symbol
function getUnitIdentifierBySymbol(symbol: SISymbol | Symbol): UnitIdentifier {
  const result = unitIdentifiers.find((identifier) => identifier.symbol === symbol);
  if (!result) {
    throw new Error(`No unit matching symbol ${symbol}`);
  }
  return result;
}

function getUnitIdentifierByShorthand(shorthand: string): UnitIdentifier {
  const result = unitIdentifiers.find((identifier) => identifier.shorthand === shorthand);
  if (!result) {
    throw new Error(`No unit matching shorthand ${shorthand}`);
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

export function textToUnit(text: string): Unit {
  // TODO: add support for modifiers
  // TODO: add support for composition units
  return getUnitIdentifierByShorthand(text).unit;
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

  constructor(unit: Unit | string, value: Vector | Scalar | number) {
    this.unit = typeof unit === "string" ? textToUnit(unit) : unit;
    this.value = typeof(value) === "number" ? new Scalar(value) : value;
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
    if (this.value instanceof Scalar && quantity2.value instanceof Scalar) {
      return new Quantity(this.unit.multiply(quantity2.unit), this.value.multiply(quantity2.value));
    } else if (this.value instanceof Vector && quantity2.value instanceof Vector) {
      throw new Error("Cannot multiply quantities with type Vector");
    } else {
      throw new Error("Cannot multiply quantities with types Scalar and Vector");
    }
  }
  
  divide(quantity2: Quantity) {
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
