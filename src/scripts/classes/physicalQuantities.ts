import { invertMap } from "../utils/utilFunctions";

// TODO: migrate everything to Scalars
// TODO: add Fahrenheit and Celsius conversion into pseudo

const language = "DE";

// Enum of the SISymbols for SI-Units
enum SISymbol {
    t = "t", // time
    l = "l", // length
    m = "m", // mass
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
const legalNumberChars = ["-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ",", "e"];


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
  getDirectionalValue(direction: number) {
    return this.magnitude * this.direction[direction];
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
  exponentiate(extraExponent: number) {
    const newUnit = new Unit(new Map(this.symbols));
    for (const [symbol, exponent] of this.symbols) {
      newUnit.symbols.set(symbol, exponent * extraExponent);
    }
    return newUnit;
  }
}

const dimensionlessUnit = new Unit(new Map([]));

// Unit name in singular and plural form
class UnitIdentifier {
  name: string;
  unit: Unit;
  symbol: SISymbol | Symbol;
  shorthand: string;
  singular: string;
  plural: string;

  constructor(name: string, unit: Unit, symbol: SISymbol | Symbol, shorthand: string, singular: string, plural: string) {
    this.name = name;
    this.unit = unit;
    this.symbol = symbol;
    this.shorthand = shorthand;
    this.singular = singular;
    this.plural = plural;
  }
}

class SIUnitIdentifier extends UnitIdentifier {
  symbol: SISymbol;

  constructor(name: string, unit: Unit, symbol: SISymbol, shorthand: string, singular: string, plural: string) {
    super(name, unit, symbol, shorthand, singular, plural);
    this.symbol = symbol;
  }
}

// list of all symbols, units, and naming for each unit
const SIUnitIdentifiers = [
  new SIUnitIdentifier(
    "time",
    new Unit(new Map([[SISymbol.t, 1]])),
    SISymbol.t,
    "s",
    language === "DE" ? "Sekunde" : "second",
    language === "DE" ? "Sekunden" : "seconds"
  ), // s

  new SIUnitIdentifier(
    "length",
    new Unit(new Map([[SISymbol.l, 1]])),
    SISymbol.l,
    "m",
    language === "DE" ? "Meter" : "meter",
    language === "DE" ? "Meter" : "meters"
  ), // m

  new SIUnitIdentifier(
    "mass",
    new Unit(new Map([[SISymbol.m, 1]])),
    SISymbol.m,
    "kg",
    language === "DE" ? "Kilogramm" : "kilogram",
    language === "DE" ? "Kilogramm" : "kilograms"
  ), // kg

  new SIUnitIdentifier(
    "current",
    new Unit(new Map([[SISymbol.I, 1]])),
    SISymbol.I,
    "A",
    language === "DE" ? "Ampere" : "ampere",
    language === "DE" ? "Ampere" : "amperes"
  ), // A

  new SIUnitIdentifier(
    "temperature",
    new Unit(new Map([[SISymbol.Θ, 1]])),
    SISymbol.Θ,
    "K",
    language === "DE" ? "Kelvin" : "kelvin",
    language === "DE" ? "Kelvin" : "kelvins"
  ), // K

  new SIUnitIdentifier(
    "substanceAmount",
    new Unit(new Map([[SISymbol.N, 1]])),
    SISymbol.N,
    "mol",
    language === "DE" ? "Mol" : "mole",
    language === "DE" ? "Mol" : "moles"
  ), // mol

  new SIUnitIdentifier(
    "luminousIntensity",
    new Unit(new Map([[SISymbol.J, 1]])),
    SISymbol.J,
    "cd",
    language === "DE" ? "Candela" : "candela",
    language === "DE" ? "Candela" : "candelas"
  ), // cd
];
const unitIdentifiers = [
  // Frequency: Hz = s^-1
  new UnitIdentifier(
    "frequency",
    new Unit(new Map([[SISymbol.t, -1]])),
    Symbol.f,
    "Hz",
    language === "DE" ? "Hertz" : "hertz",
    language === "DE" ? "Hertz" : "hertz"
  ), // Hz

  // Force: N = kg·m·s^-2
  new UnitIdentifier(
    "force",
    new Unit(new Map([
      [SISymbol.m, 1], 
      [SISymbol.l, 1], 
      [SISymbol.t, -2]
    ])),
    Symbol.F,
    "N",
    language === "DE" ? "Newton" : "newton",
    language === "DE" ? "Newton" : "newtons"
  ), // N

  // Pressure: Pa = N/m^2 = kg·m^-1·s^-2
  new UnitIdentifier(
    "pressure",
    new Unit(new Map([
      [SISymbol.m, 1],
      [SISymbol.l, -1],
      [SISymbol.t, -2]
    ])),
    Symbol.p, 
    "Pa",
    language === "DE" ? "Pascal" : "pascal",
    language === "DE" ? "Pascal" : "pascals"
  ), // Pa

  // Energy: J = N·m = kg·m^2·s^-2
  new UnitIdentifier(
    "energy",
    new Unit(new Map([
      [SISymbol.m, 1], 
      [SISymbol.l, 2], 
      [SISymbol.t, -2]
    ])),
    Symbol.E,
    "J",
    language === "DE" ? "Joule" : "joule",
    language === "DE" ? "Joule" : "joules"
  ), // J

  // Work: J = N·m = kg·m^2·s^-2
  new UnitIdentifier(
    "work",
    new Unit(new Map([
      [SISymbol.m, 1],
      [SISymbol.l, 2],
      [SISymbol.t, -2]
    ])),
    Symbol.W,
    "J", 
    language === "DE" ? "Joule" : "joule",
    language === "DE" ? "Joule" : "joules"
  ), // J

  // Power: W = J/s = kg·m^2·s^-3
  new UnitIdentifier(
    "power",
    new Unit(new Map([
      [SISymbol.m, 1], 
      [SISymbol.l, 2], 
      [SISymbol.t, -3]
    ])),
    Symbol.P,
    "W",
    language === "DE" ? "Watt" : "watt",
    language === "DE" ? "Watt" : "watts"
  ), // W

  // Electric charge: C = A·s
  new UnitIdentifier(
    "electricCharge",
    new Unit(new Map([
      [SISymbol.I, 1],
      [SISymbol.t, 1]
    ])),
    Symbol.q,
    "C",
    language === "DE" ? "Coulomb" : "coulomb",
    language === "DE" ? "Coulomb" : "coulombs"
  ), // C

  // Voltage (electric potential): V = kg·m^2·s^-3·A^-1
  new UnitIdentifier(
    "voltage",
    new Unit(new Map([
      [SISymbol.m, 1], 
      [SISymbol.l, 2], 
      [SISymbol.t, -3], 
      [SISymbol.I, -1]
    ])),
    Symbol.U,
    "V",
    language === "DE" ? "Volt" : "volt",
    language === "DE" ? "Volt" : "volts"
  ), // V

  // Electrical capacitance: F = C/V = kg^-1·m^-2·s^4·A^2
  new UnitIdentifier(
    "electricCapacitance",
    new Unit(new Map([
      [SISymbol.m, -1],
      [SISymbol.l, -2],
      [SISymbol.t, 4],
      [SISymbol.I, 2]
    ])),
    Symbol.C,
    "F",
    language === "DE" ? "Farad" : "farad",
    language === "DE" ? "Farad" : "farads"
  ), // F

  // Electrical resistance: Ω = V/A = kg·m^2·s^-3·A^-2
  new UnitIdentifier(
    "electricalResistance",
    new Unit(new Map([
      [SISymbol.m, 1],
      [SISymbol.l, 2],
      [SISymbol.t, -3],
      [SISymbol.I, -2]
    ])),
    Symbol.R,
    "Ω",
    language === "DE" ? "Ohm" : "ohm",
    language === "DE" ? "Ohm" : "ohms"
  ), // Ω

  // Electrical conductance: S = 1/Ω = kg^-1·m^-2·s^3·A^2
  new UnitIdentifier(
    "electricalConductance",
    new Unit(new Map([
      [SISymbol.m, -1],
      [SISymbol.l, -2],
      [SISymbol.t, 3],
      [SISymbol.I, 2]
    ])),
    Symbol.G,
    "S",
    language === "DE" ? "Siemens" : "siemens",
    language === "DE" ? "Siemens" : "siemens"
  ), // S

  // Magnetic flux: Wb = V·s = kg·m^2·s^-2·A^-1
  new UnitIdentifier(
    "magneticFlux",
    new Unit(new Map([
      [SISymbol.m, 1],
      [SISymbol.l, 2],
      [SISymbol.t, -2],
      [SISymbol.I, -1]
    ])),
    Symbol.Φ_B,
    "Wb",
    language === "DE" ? "Weber" : "weber",
    language === "DE" ? "Weber" : "webers"
  ), // Wb

  // Magnetic flux density: T = Wb/m^2 = kg·s^-2·A^-1
  new UnitIdentifier(
    "magneticFluxDensity",
    new Unit(new Map([
      [SISymbol.m, 1],
      [SISymbol.t, -2],
      [SISymbol.I, -1]
    ])),
    Symbol.B,
    "T",
    language === "DE" ? "Tesla" : "tesla",
    language === "DE" ? "Tesla" : "teslas"
  ), // T

  // Electrical inductance: H = Wb/A = kg·m^2·s^-2·A^-2
  new UnitIdentifier(
    "electricalInductance",
    new Unit(new Map([
      [SISymbol.m, 1],
      [SISymbol.l, 2],
      [SISymbol.t, -2],
      [SISymbol.I, -2]
    ])),
    Symbol.L,
    "H",
    language === "DE" ? "Henry" : "henry",
    language === "DE" ? "Henry" : "henrys"
  ), // H

  // Luminous flux: lm = cd·sr
  new UnitIdentifier(
    "luminousFlux",
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
    "illuminance",
    new Unit(new Map([
      [SISymbol.J, 1],
      [SISymbol.l, -2]
    ])),
    Symbol.E_v,
    "lx",
    language === "DE" ? "Lux" : "lux",
    language === "DE" ? "Lux" : "lux"
  ), // lx

  // Radioactive activity: Bq = s^-1
  new UnitIdentifier(
    "radioactiveActivity",
    new Unit(new Map([[SISymbol.t, -1]])),
    Symbol.A,
    "Bq",
    language === "DE" ? "Becquerel" : "becquerel",
    language === "DE" ? "Becquerel" : "becquerels"
  ), // Bq

  // Absorbed dose: Gy = J/kg = m^2·s^-2
  new UnitIdentifier(
    "absorbedDose",
    new Unit(new Map([
      [SISymbol.l, 2],
      [SISymbol.t, -2]
    ])),
    Symbol.D,
    "Gy",
    language === "DE" ? "Gray" : "gray",
    language === "DE" ? "Gray" : "grays"
  ), // Gy

  // Equivalent dose: Sv = J/kg = m^2·s^-2
  new UnitIdentifier(
    "equivalentDose",
    new Unit(new Map([
      [SISymbol.l, 2],
      [SISymbol.t, -2]
    ])),
    Symbol.H,
    "Sv",
    language === "DE" ? "Sievert" : "sievert",
    language === "DE" ? "Sievert" : "sieverts"
  ), // Sv

  // Catalytic activity: kat = mol·s^-1
  new UnitIdentifier(
    "catalyticActivity",
    new Unit(new Map([
      [SISymbol.N, 1],
      [SISymbol.t, -1]
    ])),
    Symbol.z,
    "kat",
    language === "DE" ? "Katal" : "katal",
    language === "DE" ? "Katal" : "katals"
  ), // kat
];

const modifiers = new Map([
  ["y", 1e-24],  // yocto
  ["z", 1e-21],  // zepto
  ["a", 1e-18],  // atto
  ["f", 1e-15],  // femto
  ["p", 1e-12],  // pico
  ["n", 1e-9],   // nano
  ["μ", 1e-6],   // micro
  ["m", 1e-3],   // milli
  ["c", 1e-2],   // centi
  ["d", 1e-1],   // deci
  ["", 1],
  ["da", 1e1],   // deka
  ["h", 1e2],    // hecto
  ["k", 1e3],    // kilo
  ["M", 1e6],    // mega
  ["G", 1e9],    // giga
  ["T", 1e12],   // tera
  ["P", 1e15],   // peta
  ["E", 1e18],   // exa
  ["Z", 1e21],   // zetta
  ["Y", 1e24]    // yotta
]);

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

  // TODO: add automatic naming instead of "composition"
  return new UnitIdentifier("composition", unit, SY.X, shorthand, singular, plural);
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
  const result = unitIdentifiers.concat(SIUnitIdentifiers).find((identifier) => identifier.symbol === symbol);
  if (!result) {
    throw new Error(`No unit matching symbol ${symbol}`);
  }
  return result;
}

function getSIUnitIdentifierByShorthand(shorthand: string): SIUnitIdentifier {
  const result = SIUnitIdentifiers.find((identifier) => identifier.shorthand === shorthand);
  if (!result) {
    throw new Error(`No unit matching shorthand ${shorthand}`);
  }
  return result;
}

function getUnitIdentifierByShorthand(shorthand: string): UnitIdentifier {
  const result = (unitIdentifiers.concat(SIUnitIdentifiers)).find((identifier) => identifier.shorthand === shorthand);
  if (!result) {
    throw new RangeError(`No unit matching shorthand ${shorthand}`);
  }
  return result;
}

// Helper: Remove zero exponent symbols from a unit
function fixUnit(unit: Unit): Unit {
  const symbols = new Map(
    Array.from(unit.symbols).filter(([_, exponent]) => exponent !== 0)
  );
  return new Unit(symbols);
}

// Helper: Check if two units are equivalent
export function sameUnit(unit1: Unit, unit2: Unit): boolean {
  const symbols1 = fixUnit(unit1).symbols;
  const symbols2 = fixUnit(unit2).symbols;

  if (symbols1.size !== symbols2.size) return false;
  for (const [key, value] of symbols1) {
    if (symbols2.get(key) !== value) return false;
  }
  return true;
}

function getModifierNumAndUnitFromString(input: string): [number, Unit] {
  let unitIdentifier = null;
  let lastIndex = null;
  for (let i = 1; i <= input.length; i++) {
    try {
      unitIdentifier = getUnitIdentifierByShorthand(input.slice(-i));
      lastIndex = -i;
    } catch(error) {
      if (error instanceof RangeError) {
        continue;
      } else {
        throw error;
      }
    }
  }
  if (!unitIdentifier || !lastIndex) {
    return [1, new Unit(new Map([]))];
  }
  const modifier = modifiers.get(input.slice(0, lastIndex));
  if (!modifier) {
    throw new Error(`Could not find modifier ${input.slice(0, lastIndex)} from input ${input}`);
  }
  return [modifier, unitIdentifier.unit];
}

function splitProductIntoFactors(product: string): string[] {
  return product.split("*");
}

// returns a list [unit, modifier, exponent] for a string being a modified unit
function getUnitAndFactorFromString(input: string): [Unit, number] {
  const result = input.split("^");
  const [ factor, unit ] = getModifierNumAndUnitFromString(result[0]);
  let exponent = null;
  switch (result.length) {
  case 1:
    exponent = 1;
    break;
  case 2:
    exponent = parseInt(result[1]);
    break;
  default:
    throw new Error(`Invalid input format: ${result.length-1} '^' found in ${input}`);
  }
  const finalUnit = unit.exponentiate(exponent);
  return [finalUnit, factor];
}

// ignores factor
// TODO: change that
export function pseudoUnit(input: string): Unit {
  const [factor, unit] = textToFactorAndUnit(input);
  return unit;
}

// converts a string form unit to the list [factor, unit]
function textToFactorAndUnit(text: string): [number, Unit] {
  // TODO: add support for modifiers
  // TODO: add support for composition units
  const splitText = text.split("/");
  if (splitText.length > 2) {
    throw new Error("Invalid input format: multiple '/' found");
  }
  const numerator = splitText[0].trim();
  const denominator = splitText.length === 2 ? splitText[1].trim() : null;
  const numeratorList = splitProductIntoFactors(numerator);
  const denominatorList = denominator ? splitProductIntoFactors(denominator): null;
  let finalFactor = 1;
  let unit = new Unit(dimensionlessUnit.symbols);
  // add numerator units
  for (const numeratorFactor of numeratorList) {
    const [nextUnit, factor] = getUnitAndFactorFromString(numeratorFactor);
    finalFactor *= factor;
    unit = unit.multiply(nextUnit);
  }
  // add denominator units
  if (denominatorList){
    for (const denominatorFactor of denominatorList) {
      const [nextUnit, factor] = getUnitAndFactorFromString(denominatorFactor);
      finalFactor /= factor;
      unit = unit.divide(nextUnit);
    }
  }

  return [finalFactor, unit];
}

// converts a combination of a scalar and a unit to a quantity
function textToQuantity(text: string): Quantity {
  let breakIndex = null;
  text = text.trim();
  for (let i = 0; i < text.length; i++) {
    if (!legalNumberChars.includes(text[i])) {
      breakIndex = i;
      break;
    }
  }
  if (breakIndex === null) {
    throw new Error(`Invalid input: could not find a number in the input ${text}`);
  }
  const num = Number(text.slice(0, breakIndex));
  if (isNaN(num)) {
    throw new Error(`Number not valid ${text.slice(0, breakIndex)} in ${text}`);
  }

  return new Quantity(text.slice(breakIndex).trim(), num);
}

export const pseudo = textToQuantity;

export class Quantity {
  unit: Unit;
  value: Vector | Scalar;

  constructor(unit: Unit | string, value: Vector | Scalar | number) {
    if (typeof unit === "string") {
      const [ factor, usedUnit ] = textToFactorAndUnit(unit);
      this.unit = usedUnit;
      this.value = typeof(value) === "number" ? new Scalar(factor*value) : value.multiply(new Scalar(factor));
    } else {
      this.unit = unit;
      this.value = typeof(value) === "number" ? new Scalar(value) : value;
    }
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
    } else if (this.value instanceof Vector && quantity2.value instanceof Scalar) {
      return new Quantity(this.unit.multiply(quantity2.unit), this.value.multiply(quantity2.value));
    } else if (this.value instanceof Vector && quantity2.value instanceof Vector) {
      throw new Error("Cannot multiply quantities with type Vector");
    } else {
      throw new Error(`Cannot multiply quantities with types ${typeof this.value} and ${typeof quantity2.value}`);
    }
  }
  
  divide(quantity2: Quantity) {
    if (this.value instanceof Scalar && quantity2.value instanceof Scalar) {
      return new Quantity(this.unit.divide(quantity2.unit), this.value.divide(quantity2.value));
    } else if (this.value instanceof Vector && quantity2.value instanceof Scalar) {
      return new Quantity(this.unit.divide(quantity2.unit), this.value.divide(quantity2.value));
    } else if (this.value instanceof Vector && quantity2.value instanceof Vector) {
      throw new Error("Cannot divide quantities with type Vector");
    } else {
      throw new Error(`Cannot divide quantities with types ${typeof this.value} and ${typeof quantity2.value}`);
    }
  }

  exponentiate(exponent: Scalar) {
    if (this.value instanceof Scalar) {
      return new Quantity(this.unit.exponentiate(exponent.value), this.value.value**exponent.value);
    } else if (this.value instanceof Vector) {
      throw new Error("Cannot exponentiate quantities with type and Vector");
    } else {
      throw new Error("Cannot exponentiate quantities with unknown type");
    }
  }

  getNormalizedQuantity() {
    if (this.value instanceof Scalar) {
      return this;
    } else if (this.value instanceof Vector) {
      return new Quantity(this.unit, this.value.getNormalizedVector());
    } else {
      throw new Error("Cannot normalize quantities with unknown type");
    }
  }

  getUnitQuality() {
    if (this.value instanceof Scalar) {
      return new Quantity(this.unit, Math.sign(this.value.value));
    } else if (this.value instanceof Vector) {
      return new Quantity(this.unit, new Vector(1, this.value.getNormalizedVector().direction));
    } else {
      throw new Error("Cannot get unit quality of quantities with unknown type");
    }
  }

  getUnitlessQuantity() {
    return new Quantity(new Unit(new Map([])), this.value);
  }

  getLength(): Quantity {
    if (this.value instanceof Scalar) {
      return this;
    } else {
      return new Quantity(this.unit, Math.sqrt(this.value.magnitude * this.value.direction.reduce((acc, curr) => acc + curr ** 2)));
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