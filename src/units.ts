import {
	NamedUnit, LinearConverter, OffsetConverter,
	_setCurrencyDimension,
} from "./core.js";
import {
	length as lengthDim, time as timeDim, mass as massDim,
	energy as energyDim, temperature as tempDim,
	area as areaDim, volume as volumeDim,
	force as forceDim, pressure as pressureDim, power as powerDim,
	speed as speedDim, acceleration as accelDim,
	electricCurrent as currentDim, charge as chargeDim,
	voltage as voltageDim, resistance as resistanceDim,
	capacitance as capacitanceDim, inductance as inductanceDim,
	conductance as conductanceDim, magneticFlux as magFluxDim,
	magneticField as magFieldDim, specificEnergy as specEnergyDim,
	frequency as freqDim, luminousIntensity as luminousIntDim,
	luminousFlux as luminousFluxDim, illuminance as illuminanceDim,
	amountOfSubstance as amountDim, data as dataDim,
	dimensionless as dimlessDim, currency as currDim,
} from "./dimensions.js";
import { createPrefixedUnits } from "./prefixes.js";

_setCurrencyDimension(currDim);

// =============================================================================
// Planck Units
// =============================================================================

export const planckLength = new NamedUnit("l_P", lengthDim, new LinearConverter(1.616255e-35));
export const planckTime = new NamedUnit("t_P", timeDim, new LinearConverter(5.391247e-44));
export const planckMass = new NamedUnit("m_P", massDim, new LinearConverter(2.176434e-8));
export const planckTemperature = new NamedUnit("T_P", tempDim, new LinearConverter(1.416785e32));

// =============================================================================
// Length
// =============================================================================

export const meter = createPrefixedUnits("meter", "m", lengthDim, 1.0);
export const kilometer = meter.kilometer;
export const millimeter = meter.millimeter;
export const inch = createPrefixedUnits("inch", "in", lengthDim, 0.0254);
export const foot = createPrefixedUnits("foot", "ft", lengthDim, 0.3048);
export const yard = createPrefixedUnits("yard", "yd", lengthDim, 0.9144);
export const mile = createPrefixedUnits("mile", "mi", lengthDim, 1609.344);
export const thou = createPrefixedUnits("thou", "mil", lengthDim, 0.0000254);
export const fathom = createPrefixedUnits("fathom", "ftm", lengthDim, 1.8288);
export const nauticalMile = createPrefixedUnits("nauticalMile", "NM", lengthDim, 1852.0);
export const astronomicalUnit = createPrefixedUnits("astronomicalUnit", "au", lengthDim, 149597870700.0);
export const lightYear = createPrefixedUnits("lightYear", "ly", lengthDim, 9460730472580800.0);
export const parsec = createPrefixedUnits("parsec", "pc", lengthDim, 3.0856775814913673e16);
export const angstrom = createPrefixedUnits("angstrom", "\u00C5", lengthDim, 1e-10);
export const hand = createPrefixedUnits("hand", "hand", lengthDim, 0.1016);
export const furlong = createPrefixedUnits("furlong", "fur", lengthDim, 201.168);
export const chain = createPrefixedUnits("chain", "ch", lengthDim, 20.1168);
export const link = createPrefixedUnits("link", "lk", lengthDim, 0.201168);
export const beardSecond = createPrefixedUnits("beardSecond", "beard_s", lengthDim, 5e-9);
export const poronkusema = createPrefixedUnits("poronkusema", "poronkusema", lengthDim, 7500.0);
export const cable = createPrefixedUnits("cable", "cable", lengthDim, 219.456);
export const league = createPrefixedUnits("league", "league", lengthDim, 4828.032);
export const point = createPrefixedUnits("point", "pt_len", lengthDim, 0.000352777778);
export const pica = createPrefixedUnits("pica", "pica", lengthDim, 0.00423333333);
export const caliber = createPrefixedUnits("caliber", "cal_len", lengthDim, 0.000254);
export const rod = createPrefixedUnits("rod", "rod", lengthDim, 5.0292);

// =============================================================================
// Time
// =============================================================================

export const second = createPrefixedUnits("second", "s", timeDim, 1.0);
export const minute = createPrefixedUnits("minute", "min", timeDim, 60.0);
export const hour = createPrefixedUnits("hour", "h", timeDim, 3600.0);
export const day = createPrefixedUnits("day", "d", timeDim, 86400.0);
export const week = createPrefixedUnits("week", "wk", timeDim, 604800.0);
export const year = createPrefixedUnits("year", "yr", timeDim, 31556952.0);
export const fortnight = createPrefixedUnits("fortnight", "fn", timeDim, 1209600.0);
export const century = createPrefixedUnits("century", "century", timeDim, 3155695200.0);
export const millennium = createPrefixedUnits("millennium", "millennium", timeDim, 31556952000.0);
export const shake = createPrefixedUnits("shake", "shake", timeDim, 1e-8);
export const svedberg = createPrefixedUnits("svedberg", "S_time", timeDim, 1e-13);
export const jiffy = createPrefixedUnits("jiffy", "jiffy", timeDim, 1.0 / 60.0);
export const physicsJiffy = createPrefixedUnits("physicsJiffy", "phys_jiffy", timeDim, 3.33564095198e-11);
export const siderealDay = createPrefixedUnits("siderealDay", "sday", timeDim, 86164.0905);
export const siderealYear = createPrefixedUnits("siderealYear", "syr", timeDim, 31558149.763);
export const month = createPrefixedUnits("month", "mo", timeDim, 2629743.0);
export const decade = createPrefixedUnits("decade", "dec", timeDim, 315569520.0);

// =============================================================================
// Mass
// =============================================================================

export const gram = createPrefixedUnits("gram", "g", massDim, 0.001);
export const kilogram = gram.kilogram;
export const grain = createPrefixedUnits("grain", "gr", massDim, 0.00006479891);
export const ounce = createPrefixedUnits("ounce", "oz", massDim, 0.028349523125);
export const pound = createPrefixedUnits("pound", "lb", massDim, 0.45359237);
export const stone = createPrefixedUnits("stone", "st", massDim, 6.35029318);
export const shortTon = createPrefixedUnits("shortTon", "ton", massDim, 907.18474);
export const longTon = createPrefixedUnits("longTon", "lton", massDim, 1016.0469088);
export const slug = createPrefixedUnits("slug", "slug", massDim, 14.5939029);
export const carat = createPrefixedUnits("carat", "ct", massDim, 0.0002);
export const dram = createPrefixedUnits("dram", "dr", massDim, 0.0017718451953125);
export const troyDram = createPrefixedUnits("troyDram", "dr_t", massDim, 0.0038879346);
export const troyOunce = createPrefixedUnits("troyOunce", "oz_t", massDim, 0.0311034768);
export const troyPound = createPrefixedUnits("troyPound", "lb_t", massDim, 0.3732417216);
export const pennyweight = createPrefixedUnits("pennyweight", "dwt", massDim, 0.00155517384);
export const hundredweight = createPrefixedUnits("hundredweight", "cwt", massDim, 45.359237);
export const longHundredweight = createPrefixedUnits("longHundredweight", "lcwt", massDim, 50.80234544);
export const dalton = createPrefixedUnits("dalton", "Da", massDim, 1.6605390666111e-27);
export const electronRestMass = createPrefixedUnits("electronRestMass", "m_e", massDim, 9.1093837015e-31);
export const protonRestMass = createPrefixedUnits("protonRestMass", "m_p", massDim, 1.67262192369e-27);
export const solarMass = createPrefixedUnits("solarMass", "M_S", massDim, 1.98847e30);

// =============================================================================
// Area
// =============================================================================

export const squareMeter = createPrefixedUnits("squareMeter", "m\u00B2", areaDim, 1.0);
export const acre = createPrefixedUnits("acre", "ac", areaDim, 4046.8564224);
export const hectare = createPrefixedUnits("hectare", "ha", areaDim, 10000.0);
export const barn = createPrefixedUnits("barn", "b_area", areaDim, 1e-28);
export const squareMile = createPrefixedUnits("squareMile", "mi\u00B2", areaDim, 2589988.110336);
export const squareYard = createPrefixedUnits("squareYard", "yd\u00B2", areaDim, 0.83612736);
export const squareFoot = createPrefixedUnits("squareFoot", "ft\u00B2", areaDim, 0.09290304);
export const squareInch = createPrefixedUnits("squareInch", "in\u00B2", areaDim, 0.00064516);

// =============================================================================
// Temperature
// =============================================================================

export const kelvin = createPrefixedUnits("kelvin", "K", tempDim, 1.0);
export const celsius = new NamedUnit("\u00B0C", tempDim, new OffsetConverter(1.0, 273.15), undefined, "celsius");
export const fahrenheit = new NamedUnit("\u00B0F", tempDim, new OffsetConverter(5.0 / 9.0, 255.3722222222), undefined, "fahrenheit");
export const rankine = new NamedUnit("R", tempDim, new LinearConverter(5.0 / 9.0), undefined, "rankine");

// =============================================================================
// Force
// =============================================================================

export const newton = createPrefixedUnits("newton", "N", forceDim, 1.0);
export const Newton = newton;
export const dyne = createPrefixedUnits("dyne", "dyn", forceDim, 1e-5);
export const poundal = createPrefixedUnits("poundal", "pdl", forceDim, 0.138254954376);
export const poundForce = createPrefixedUnits("poundForce", "lbf", forceDim, 4.4482216152605);
export const ounceForce = createPrefixedUnits("ounceForce", "ozf", forceDim, 0.27801385095378125);
export const kip = createPrefixedUnits("kip", "kip", forceDim, 4448.2216152605);
export const tonForce = createPrefixedUnits("tonForce", "tnf", forceDim, 8896.44323);
export const kilogramForce = createPrefixedUnits("kilogramForce", "kgf", forceDim, 9.80665);

// =============================================================================
// Pressure
// =============================================================================

export const pascal = createPrefixedUnits("pascal", "Pa", pressureDim, 1.0);
export const Pascal = pascal;
export const bar = createPrefixedUnits("bar", "bar", pressureDim, 1e5);
export const atmosphere = createPrefixedUnits("atmosphere", "atm", pressureDim, 101325.0);
export const torr = createPrefixedUnits("torr", "Torr", pressureDim, 133.322387415);
export const psi = createPrefixedUnits("psi", "psi", pressureDim, 6894.757293168361);
export const barye = createPrefixedUnits("barye", "Ba_pres", pressureDim, 0.1);
export const millimeterOfMercury = createPrefixedUnits("millimeterOfMercury", "mmHg", pressureDim, 133.322387415);
export const inchOfMercury = createPrefixedUnits("inchOfMercury", "inHg", pressureDim, 3386.389);

// =============================================================================
// Energy
// =============================================================================

export const joule = createPrefixedUnits("joule", "J", energyDim, 1.0);
export const Joule = joule;
export const erg = createPrefixedUnits("erg", "erg", energyDim, 1e-7);
export const calorie = createPrefixedUnits("calorie", "cal", energyDim, 4.184);
export const britishThermalUnit = createPrefixedUnits("britishThermalUnit", "BTU", energyDim, 1055.05585262);
export const electronVolt = createPrefixedUnits("electronVolt", "eV", energyDim, 1.602176634e-19);
export const footPound = createPrefixedUnits("footPound", "ft\u00B7lb", energyDim, 1.3558179483314004);
export const wattHour = createPrefixedUnits("wattHour", "Wh", energyDim, 3600.0);
export const therm = createPrefixedUnits("therm", "thm", energyDim, 105480400.0);
export const tonOfTNT = createPrefixedUnits("tonOfTNT", "tTNT", energyDim, 4.184e9);
export const hartree = createPrefixedUnits("hartree", "E_h", energyDim, 4.3597447222071e-18);
export const rydberg = createPrefixedUnits("rydberg", "Ry", energyDim, 2.1798723611035e-18);

// =============================================================================
// Power
// =============================================================================

export const watt = createPrefixedUnits("watt", "W", powerDim, 1.0);
export const Watt = watt;
export const horsepower = createPrefixedUnits("horsepower", "hp", powerDim, 745.69987158227022);

// =============================================================================
// Speed
// =============================================================================

export const meterPerSecond = createPrefixedUnits("meterPerSecond", "m/s", speedDim, 1.0);
export const kilometerPerHour = createPrefixedUnits("kilometerPerHour", "km/h", speedDim, 1.0 / 3.6);
export const milePerHour = createPrefixedUnits("milePerHour", "mph", speedDim, 0.44704);
export const knot = createPrefixedUnits("knot", "kt", speedDim, 1852.0 / 3600.0);
export const speedOfLightUnit = createPrefixedUnits("speedOfLight", "c", speedDim, 299792458.0);

// =============================================================================
// Acceleration
// =============================================================================

export const meterPerSecondSquared = createPrefixedUnits("meterPerSecondSquared", "m/s\u00B2", accelDim, 1.0);
export const gravity = createPrefixedUnits("gravity", "g_n", accelDim, 9.80665);

// =============================================================================
// Electricity
// =============================================================================

export const ampere = createPrefixedUnits("ampere", "A", currentDim, 1.0);
export const coulomb = createPrefixedUnits("coulomb", "C", chargeDim, 1.0);
export const volt = createPrefixedUnits("volt", "V", voltageDim, 1.0);
export const ohm = createPrefixedUnits("ohm", "\u03A9", resistanceDim, 1.0);
export const farad = createPrefixedUnits("farad", "F", capacitanceDim, 1.0);
export const henry = createPrefixedUnits("henry", "H", inductanceDim, 1.0);
export const siemens = createPrefixedUnits("siemens", "S", conductanceDim, 1.0);

// =============================================================================
// Frequency & Luminous Intensity
// =============================================================================

export const hertz = createPrefixedUnits("hertz", "Hz", freqDim, 1.0);
export const becquerel = createPrefixedUnits("becquerel", "Bq", freqDim, 1.0);
export const curie = createPrefixedUnits("curie", "Ci", freqDim, 3.7e10);
export const candela = createPrefixedUnits("candela", "cd", luminousIntDim, 1.0);

// =============================================================================
// Electromagnetism
// =============================================================================

export const weber = createPrefixedUnits("weber", "Wb", magFluxDim, 1.0);
export const maxwell = createPrefixedUnits("maxwell", "Mx", magFluxDim, 1e-8);
export const tesla = createPrefixedUnits("tesla", "T", magFieldDim, 1.0);
export const gauss = createPrefixedUnits("gauss", "G", magFieldDim, 1e-4);

// =============================================================================
// Photometry
// =============================================================================

export const lumen = createPrefixedUnits("lumen", "lm", luminousFluxDim, 1.0);
export const lux = createPrefixedUnits("lux", "lx", illuminanceDim, 1.0);
export const phot = createPrefixedUnits("phot", "ph", illuminanceDim, 10000.0);
export const footCandle = createPrefixedUnits("footCandle", "fc", illuminanceDim, 10.7639104);

// =============================================================================
// Radiation
// =============================================================================

export const gray = createPrefixedUnits("gray", "Gy", specEnergyDim, 1.0);
export const rad = createPrefixedUnits("rad", "rad_dose", specEnergyDim, 0.01);
export const sievert = createPrefixedUnits("sievert", "Sv", specEnergyDim, 1.0);
export const rem = createPrefixedUnits("rem", "rem_dose", specEnergyDim, 0.01);

// =============================================================================
// Amount of Substance
// =============================================================================

export const mole = createPrefixedUnits("mole", "mol", amountDim, 1.0);

// =============================================================================
// Dimensionless & Angles
// =============================================================================

export const percent = createPrefixedUnits("percent", "%", dimlessDim, 0.01);
export const partsPerMillion = createPrefixedUnits("partsPerMillion", "ppm", dimlessDim, 1e-6);
export const partsPerBillion = createPrefixedUnits("partsPerBillion", "ppb", dimlessDim, 1e-9);
export const micromort = createPrefixedUnits("micromort", "micromort", dimlessDim, 1e-6);
export const radian = createPrefixedUnits("radian", "rad", dimlessDim, 1.0);
export const degree = createPrefixedUnits("degree", "deg", dimlessDim, Math.PI / 180);
export const gradian = createPrefixedUnits("gradian", "grad", dimlessDim, Math.PI / 200);
export const arcminute = createPrefixedUnits("arcminute", "arcmin", dimlessDim, Math.PI / 10800);
export const arcsecond = createPrefixedUnits("arcsecond", "arcsec", dimlessDim, Math.PI / 648000);

// =============================================================================
// Data
// =============================================================================

export const bit = createPrefixedUnits("bit", "bit", dataDim, 1.0, { supportsBinaryPrefixes: true });
export const byte = createPrefixedUnits("byte", "byte", dataDim, 8.0, { supportsBinaryPrefixes: true });
