export interface Dimension<K extends string = string> {
	readonly key: K;
}

export interface Unit<D extends Dimension = Dimension> {
	readonly symbol: string;
	readonly dimension: D;
	toBase(value: number): number;
	fromBase(value: number): number;
}

export const createDimension = <K extends string>(key: K): Dimension<K> => ({ key });

const assertCompatibility = (a: Unit, b: Unit) => {
	if (a.dimension.key !== b.dimension.key) {
		throw new Error(
			`Incompatible dimensions: ${a.dimension.key} vs. ${b.dimension.key}`
		);
	}
};

export class Quantity<U extends Unit = Unit> {
	constructor(
		public readonly value: number,
		public readonly unit: U
	) {}

	to<T extends Unit>(target: T): Quantity<T> {
		assertCompatibility(this.unit, target);
		const base = this.unit.toBase(this.value);
		return new Quantity(target.fromBase(base), target);
	}

	valueIn<T extends Unit>(target: T): number {
		return this.to(target).value;
	}

	add(other: Quantity<Unit<U["dimension"]>>): Quantity<U> {
		assertCompatibility(this.unit, other.unit);
		const otherInThis = other.valueIn(this.unit);
		return new Quantity(this.value + otherInThis, this.unit);
	}

	subtract(other: Quantity<Unit<U["dimension"]>>): Quantity<U> {
		assertCompatibility(this.unit, other.unit);
		const otherInThis = other.valueIn(this.unit);
		return new Quantity(this.value - otherInThis, this.unit);
	}

	multiply(scalar: number): Quantity<U> {
		return new Quantity(this.value * scalar, this.unit);
	}

	divide(scalar: number): Quantity<U> {
		return new Quantity(this.value / scalar, this.unit);
	}

	equals(other: Quantity): boolean {
		if (this.unit.dimension.key !== other.unit.dimension.key) {
			return false;
		}
		return this.value === other.valueIn(this.unit);
	}

	compare(other: Quantity<Unit<U["dimension"]>>): number {
		assertCompatibility(this.unit, other.unit);
		const otherInThis = other.valueIn(this.unit);
		if (this.value < otherInThis) return -1;
		if (this.value > otherInThis) return 1;
		return 0;
	}

	lessThan(other: Quantity<Unit<U["dimension"]>>): boolean {
		return this.compare(other) < 0;
	}

	greaterThan(other: Quantity<Unit<U["dimension"]>>): boolean {
		return this.compare(other) > 0;
	}

	toString(): string {
		return `${this.value} ${this.unit.symbol}`;
	}
}

export class LinearUnit<D extends Dimension = Dimension> implements Unit<D> {
	constructor(
		public readonly symbol: string,
		public readonly dimension: D,
		public readonly factorToBase: number
	) {}

	toBase(v: number) { return v * this.factorToBase; }
	fromBase(v: number) { return v / this.factorToBase; }

	multiply<U2 extends Unit>(other: U2): LinearUnit {
		const newSymbol = `${this.symbol}*${other.symbol}`;
		const newDimension = createDimension(`(${this.dimension.key}*${other.dimension.key})`);
		const otherFactor = other.toBase(1);
		return new LinearUnit(newSymbol, newDimension, this.factorToBase * otherFactor);
	}

	divide<U2 extends Unit>(other: U2): LinearUnit {
		const newSymbol = `${this.symbol}/${other.symbol}`;
		const newDimension = createDimension(`(${this.dimension.key}/${other.dimension.key})`);
		const otherFactor = other.toBase(1);
		return new LinearUnit(newSymbol, newDimension, this.factorToBase / otherFactor);
	}

	pow(n: number): LinearUnit {
		const newSymbol = `${this.symbol}^${n}`;
		const newDimension = createDimension(`(${this.dimension.key}^${n})`);
		return new LinearUnit(newSymbol, newDimension, Math.pow(this.factorToBase, n));
	}

	sqrt(): LinearUnit {
		const newSymbol = `sqrt(${this.symbol})`;
		const newDimension = createDimension(`sqrt(${this.dimension.key})`);
		return new LinearUnit(newSymbol, newDimension, Math.sqrt(this.factorToBase));
	}
}

type SIPrefixes<Frac extends boolean> = Frac extends true
	? "quetta" | "ronna" | "yotta" | "zetta" | "exa" | "peta" | "tera" | "giga" | "mega" | "kilo" | "hecto" | "deca" | "deci" | "centi" | "milli" | "micro" | "nano" | "pico" | "femto" | "atto" | "zepto" | "yocto" | "ronto" | "quecto"
	: "quetta" | "ronna" | "yotta" | "zetta" | "exa" | "peta" | "tera" | "giga" | "mega" | "kilo" | "hecto" | "deca";

type BinaryPrefixName = "yobi" | "zebi" | "exbi" | "pebi" | "tebi" | "gibi" | "mebi" | "kibi";

const si_prefixes = [
	{ name: "quetta", symbol: "Q", value: 1e30 },
	{ name: "ronna", symbol: "R", value: 1e27 },
	{ name: "yotta", symbol: "Y", value: 1e24 },
	{ name: "zetta", symbol: "Z", value: 1e21 },
	{ name: "exa", symbol: "E", value: 1e18 },
	{ name: "peta", symbol: "P", value: 1e15 },
	{ name: "tera", symbol: "T", value: 1e12 },
	{ name: "giga", symbol: "G", value: 1e9 },
	{ name: "mega", symbol: "M", value: 1e6 },
	{ name: "kilo", symbol: "k", value: 1e3 },
	{ name: "hecto", symbol: "h", value: 1e2 },
	{ name: "deca", symbol: "da", value: 1e1 },
	{ name: "deci", symbol: "d", value: 1e-1 },
	{ name: "centi", symbol: "c", value: 1e-2 },
	{ name: "milli", symbol: "m", value: 1e-3 },
	{ name: "micro", symbol: "u", value: 1e-6 },
	{ name: "nano", symbol: "n", value: 1e-9 },
	{ name: "pico", symbol: "p", value: 1e-12 },
	{ name: "femto", symbol: "f", value: 1e-15 },
	{ name: "atto", symbol: "a", value: 1e-18 },
	{ name: "zepto", symbol: "z", value: 1e-21 },
	{ name: "yocto", symbol: "y", value: 1e-24 },
	{ name: "ronto", symbol: "r", value: 1e-27 },
	{ name: "quecto", symbol: "q", value: 1e-30 }
] as const;

const binary_prefixes = [
	{ name: "yobi", symbol: "Yi", value: Math.pow(2, 80) },
	{ name: "zebi", symbol: "Zi", value: Math.pow(2, 70) },
	{ name: "exbi", symbol: "Ei", value: Math.pow(2, 60) },
	{ name: "pebi", symbol: "Pi", value: Math.pow(2, 50) },
	{ name: "tebi", symbol: "Ti", value: Math.pow(2, 40) },
	{ name: "gibi", symbol: "Gi", value: Math.pow(2, 30) },
	{ name: "mebi", symbol: "Mi", value: Math.pow(2, 20) },
	{ name: "kibi", symbol: "Ki", value: Math.pow(2, 10) }
] as const;

export function createPrefixedUnits<
	N extends string,
	D extends Dimension,
	Frac extends boolean = true,
	Bin extends boolean = false
>(
	name: N,
	symbol: string,
	dimension: D,
	baseCoeff: number = 1.0,
	options?: {
		supportsFractionalPrefixes?: Frac;
		supportsBinaryPrefixes?: Bin;
	}
): LinearUnit<D> &
   { [K in `${SIPrefixes<Frac>}${N}`]: LinearUnit<D> } &
   (Bin extends true ? { [K in `${BinaryPrefixName}${N}`]: LinearUnit<D> } : unknown) {
	const supportsFractionalPrefixes = options?.supportsFractionalPrefixes !== false;
	const supportsBinaryPrefixes = options?.supportsBinaryPrefixes === true;

	const baseUnit = new LinearUnit(symbol, dimension, baseCoeff);

	// SI Prefixes
	for (const p of si_prefixes) {
		const isFractional = p.value < 1;
		if (!isFractional || supportsFractionalPrefixes) {
			const finalCoeff = baseCoeff * p.value;
			const key = `${p.name}${name}`;
			(baseUnit as any)[key] = new LinearUnit(`${p.symbol}${symbol}`, dimension, finalCoeff);
		}
	}

	// Binary Prefixes
	if (supportsBinaryPrefixes) {
		for (const p of binary_prefixes) {
			const finalCoeff = baseCoeff * p.value;
			const key = `${p.name}${name}`;
			(baseUnit as any)[key] = new LinearUnit(`${p.symbol}${symbol}`, dimension, finalCoeff);
		}
	}

	return baseUnit as any;
}

export const SpeedOfLight = createDimension("SpeedOfLight"); // c
export const Action = createDimension("Action");             // ℏ (Planck constant)
export const Gravitation = createDimension("Gravitation");   // G (Newton's constant)
export const Boltzmann = createDimension("Boltzmann");       // kB
export const Data = createDimension("Data");
export const Dimensionless = createDimension("Dimensionless");

export const c = new LinearUnit("c", SpeedOfLight, 1);
export const hbar = new LinearUnit("ℏ", Action, 1);
export const G = new LinearUnit("G", Gravitation, 1);
export const kB = new LinearUnit("kB", Boltzmann, 1);
export const dimensionless = new LinearUnit("1", Dimensionless, 1);

export const length = hbar.multiply(G).divide(c.pow(3)).sqrt();
export const time = hbar.multiply(G).divide(c.pow(5)).sqrt();
export const mass = hbar.multiply(c).divide(G).sqrt();
export const energy = hbar.multiply(c.pow(5)).divide(G).sqrt();
export const frequency = dimensionless.divide(time);
export const speed = length.divide(time);
export const momentum = mass.multiply(speed);
export const force = momentum.divide(time);
export const pressure = force.divide(length.multiply(length));
export const voltage = energy.divide(momentum);
export const current = energy.divide(speed);
export const resistance = voltage.divide(current);
export const capacitance = current.divide(voltage);
export const inductance = energy.divide(current.multiply(current));
export const magneticField = force.divide(speed.multiply(current));
export const magneticFlux = magneticField.multiply(length.multiply(length));
export const power = energy.divide(time);

// Helper / Derived dimensions
export const area = length.multiply(length);
export const volume = length.multiply(length).multiply(length);
export const acceleration = speed.divide(time);
export const charge = current.multiply(time);
export const conductance = dimensionless.divide(resistance);
export const specificEnergy = energy.divide(mass);

// New base dimensions
export const AmountOfSubstance = createDimension("AmountOfSubstance");
export const LuminousIntensity = createDimension("LuminousIntensity");
export const LuminousFlux = createDimension("LuminousFlux");
export const Illuminance = createDimension("Illuminance");

// --- Unit Definitions ---

// Length
export const meter = createPrefixedUnits("meter", "m", length.dimension, 1.0, { supportsFractionalPrefixes: true });
export const kilometer = meter.kilometer;
export const millimeter = meter.millimeter;

export const inch = createPrefixedUnits("inch", "in", length.dimension, 0.0254, { supportsFractionalPrefixes: true });
export const foot = createPrefixedUnits("foot", "ft", length.dimension, 0.3048, { supportsFractionalPrefixes: true });
export const yard = createPrefixedUnits("yard", "yd", length.dimension, 0.9144, { supportsFractionalPrefixes: true });
export const mile = createPrefixedUnits("mile", "mi", length.dimension, 1609.344, { supportsFractionalPrefixes: true });
export const thou = createPrefixedUnits("thou", "mil", length.dimension, 0.0000254, { supportsFractionalPrefixes: true });
export const fathom = createPrefixedUnits("fathom", "ftm", length.dimension, 1.8288, { supportsFractionalPrefixes: true });
export const nauticalMile = createPrefixedUnits("nauticalMile", "NM", length.dimension, 1852.0, { supportsFractionalPrefixes: true });
export const astronomicalUnit = createPrefixedUnits("astronomicalUnit", "au", length.dimension, 149597870700.0, { supportsFractionalPrefixes: true });
export const lightYear = createPrefixedUnits("lightYear", "ly", length.dimension, 9460730472580800.0, { supportsFractionalPrefixes: true });
export const parsec = createPrefixedUnits("parsec", "pc", length.dimension, 3.0856775814913673e16, { supportsFractionalPrefixes: true });
export const angstrom = createPrefixedUnits("angstrom", "Å", length.dimension, 1e-10, { supportsFractionalPrefixes: true });
export const hand = createPrefixedUnits("hand", "hand", length.dimension, 0.1016, { supportsFractionalPrefixes: true });
export const furlong = createPrefixedUnits("furlong", "fur", length.dimension, 201.168, { supportsFractionalPrefixes: true });
export const chain = createPrefixedUnits("chain", "ch", length.dimension, 20.1168, { supportsFractionalPrefixes: true });
export const link = createPrefixedUnits("link", "lk", length.dimension, 0.201168, { supportsFractionalPrefixes: true });
export const beardSecond = createPrefixedUnits("beardSecond", "beard_s", length.dimension, 5e-9, { supportsFractionalPrefixes: true });
export const poronkusema = createPrefixedUnits("poronkusema", "poronkusema", length.dimension, 7500.0, { supportsFractionalPrefixes: true });
export const cable = createPrefixedUnits("cable", "cable", length.dimension, 219.456, { supportsFractionalPrefixes: true });
export const league = createPrefixedUnits("league", "league", length.dimension, 4828.032, { supportsFractionalPrefixes: true });
export const point = createPrefixedUnits("point", "pt_len", length.dimension, 0.000352777778, { supportsFractionalPrefixes: true });
export const pica = createPrefixedUnits("pica", "pica", length.dimension, 0.00423333333, { supportsFractionalPrefixes: true });
export const caliber = createPrefixedUnits("caliber", "cal_len", length.dimension, 0.000254, { supportsFractionalPrefixes: true });
export const rod = createPrefixedUnits("rod", "rod", length.dimension, 5.0292, { supportsFractionalPrefixes: true });

// Time
export const second = createPrefixedUnits("second", "s", time.dimension, 1.0, { supportsFractionalPrefixes: true });
export const minute = createPrefixedUnits("minute", "min", time.dimension, 60.0, { supportsFractionalPrefixes: true });
export const hour = createPrefixedUnits("hour", "h", time.dimension, 3600.0, { supportsFractionalPrefixes: true });
export const day = createPrefixedUnits("day", "d", time.dimension, 86400.0, { supportsFractionalPrefixes: true });
export const week = createPrefixedUnits("week", "wk", time.dimension, 604800.0, { supportsFractionalPrefixes: true });
export const year = createPrefixedUnits("year", "yr", time.dimension, 31556952.0, { supportsFractionalPrefixes: true });
export const fortnight = createPrefixedUnits("fortnight", "fn", time.dimension, 1209600.0, { supportsFractionalPrefixes: true });
export const century = createPrefixedUnits("century", "century", time.dimension, 3155695200.0, { supportsFractionalPrefixes: true });
export const millennium = createPrefixedUnits("millennium", "millennium", time.dimension, 31556952000.0, { supportsFractionalPrefixes: true });
export const shake = createPrefixedUnits("shake", "shake", time.dimension, 1e-8, { supportsFractionalPrefixes: true });
export const svedberg = createPrefixedUnits("svedberg", "S_time", time.dimension, 1e-13, { supportsFractionalPrefixes: true });
export const jiffy = createPrefixedUnits("jiffy", "jiffy", time.dimension, 1.0 / 60.0, { supportsFractionalPrefixes: true });
export const physicsJiffy = createPrefixedUnits("physicsJiffy", "phys_jiffy", time.dimension, 3.33564095198e-11, { supportsFractionalPrefixes: true });
export const siderealDay = createPrefixedUnits("siderealDay", "sday", time.dimension, 86164.0905, { supportsFractionalPrefixes: true });
export const siderealYear = createPrefixedUnits("siderealYear", "syr", time.dimension, 31558149.763, { supportsFractionalPrefixes: true });
export const month = createPrefixedUnits("month", "mo", time.dimension, 2629743.0, { supportsFractionalPrefixes: true });
export const decade = createPrefixedUnits("decade", "dec", time.dimension, 315569520.0, { supportsFractionalPrefixes: true });

// Mass
export const gram = createPrefixedUnits("gram", "g", mass.dimension, 0.001, { supportsFractionalPrefixes: true });
export const kilogram = gram.kilogram;
export const grain = createPrefixedUnits("grain", "gr", mass.dimension, 0.00006479891, { supportsFractionalPrefixes: true });
export const ounce = createPrefixedUnits("ounce", "oz", mass.dimension, 0.028349523125, { supportsFractionalPrefixes: true });
export const pound = createPrefixedUnits("pound", "lb", mass.dimension, 0.45359237, { supportsFractionalPrefixes: true });
export const stone = createPrefixedUnits("stone", "st", mass.dimension, 6.35029318, { supportsFractionalPrefixes: true });
export const shortTon = createPrefixedUnits("shortTon", "ton", mass.dimension, 907.18474, { supportsFractionalPrefixes: true });
export const longTon = createPrefixedUnits("longTon", "lton", mass.dimension, 1016.0469088, { supportsFractionalPrefixes: true });
export const slug = createPrefixedUnits("slug", "slug", mass.dimension, 14.5939029, { supportsFractionalPrefixes: true });
export const carat = createPrefixedUnits("carat", "ct", mass.dimension, 0.0002, { supportsFractionalPrefixes: true });
export const dram = createPrefixedUnits("dram", "dr", mass.dimension, 0.0017718451953125, { supportsFractionalPrefixes: true });
export const troyDram = createPrefixedUnits("troyDram", "dr_t", mass.dimension, 0.0038879346, { supportsFractionalPrefixes: true });
export const troyOunce = createPrefixedUnits("troyOunce", "oz_t", mass.dimension, 0.0311034768, { supportsFractionalPrefixes: true });
export const troyPound = createPrefixedUnits("troyPound", "lb_t", mass.dimension, 0.3732417216, { supportsFractionalPrefixes: true });
export const pennyweight = createPrefixedUnits("pennyweight", "dwt", mass.dimension, 0.00155517384, { supportsFractionalPrefixes: true });
export const hundredweight = createPrefixedUnits("hundredweight", "cwt", mass.dimension, 45.359237, { supportsFractionalPrefixes: true });
export const longHundredweight = createPrefixedUnits("longHundredweight", "lcwt", mass.dimension, 50.80234544, { supportsFractionalPrefixes: true });
export const dalton = createPrefixedUnits("dalton", "Da", mass.dimension, 1.6605390666111e-27, { supportsFractionalPrefixes: true });
export const electronRestMass = createPrefixedUnits("electronRestMass", "m_e", mass.dimension, 9.1093837015e-31, { supportsFractionalPrefixes: true });
export const protonRestMass = createPrefixedUnits("protonRestMass", "m_p", mass.dimension, 1.67262192369e-27, { supportsFractionalPrefixes: true });
export const solarMass = createPrefixedUnits("solarMass", "M_S", mass.dimension, 1.98847e30, { supportsFractionalPrefixes: true });

// Area
export const squareMeter = createPrefixedUnits("squareMeter", "m²", area.dimension, 1.0, { supportsFractionalPrefixes: true });
export const acre = createPrefixedUnits("acre", "ac", area.dimension, 4046.8564224, { supportsFractionalPrefixes: true });
export const hectare = createPrefixedUnits("hectare", "ha", area.dimension, 10000.0, { supportsFractionalPrefixes: true });
export const barn = createPrefixedUnits("barn", "b_area", area.dimension, 1e-28, { supportsFractionalPrefixes: true });
export const squareMile = createPrefixedUnits("squareMile", "mi²", area.dimension, 2589988.110336, { supportsFractionalPrefixes: true });
export const squareYard = createPrefixedUnits("squareYard", "yd²", area.dimension, 0.83612736, { supportsFractionalPrefixes: true });
export const squareFoot = createPrefixedUnits("squareFoot", "ft²", area.dimension, 0.09290304, { supportsFractionalPrefixes: true });
export const squareInch = createPrefixedUnits("squareInch", "in²", area.dimension, 0.00064516, { supportsFractionalPrefixes: true });

// Temperature
export const kelvin = createPrefixedUnits("kelvin", "K", energy.dimension, 1.380649e-23, { supportsFractionalPrefixes: true });
export const rankine = createPrefixedUnits("rankine", "R", energy.dimension, 7.6702722222e-24, { supportsFractionalPrefixes: true });

// Force
export const newton = createPrefixedUnits("newton", "N", force.dimension, 1.0, { supportsFractionalPrefixes: true });
export const Newton = newton;
export const dyne = createPrefixedUnits("dyne", "dyn", force.dimension, 1e-5, { supportsFractionalPrefixes: true });
export const poundal = createPrefixedUnits("poundal", "pdl", force.dimension, 0.138254954376, { supportsFractionalPrefixes: true });
export const poundForce = createPrefixedUnits("poundForce", "lbf", force.dimension, 4.4482216152605, { supportsFractionalPrefixes: true });
export const ounceForce = createPrefixedUnits("ounceForce", "ozf", force.dimension, 0.27801385095378125, { supportsFractionalPrefixes: true });
export const kip = createPrefixedUnits("kip", "kip", force.dimension, 4448.2216152605, { supportsFractionalPrefixes: true });
export const tonForce = createPrefixedUnits("tonForce", "tnf", force.dimension, 8896.44323, { supportsFractionalPrefixes: true });
export const kilogramForce = createPrefixedUnits("kilogramForce", "kgf", force.dimension, 9.80665, { supportsFractionalPrefixes: true });

// Pressure
export const pascal = createPrefixedUnits("pascal", "Pa", pressure.dimension, 1.0, { supportsFractionalPrefixes: true });
export const Pascal = pascal;
export const bar = createPrefixedUnits("bar", "bar", pressure.dimension, 1e5, { supportsFractionalPrefixes: true });
export const atmosphere = createPrefixedUnits("atmosphere", "atm", pressure.dimension, 101325.0, { supportsFractionalPrefixes: true });
export const torr = createPrefixedUnits("torr", "Torr", pressure.dimension, 133.322387415, { supportsFractionalPrefixes: true });
export const psi = createPrefixedUnits("psi", "psi", pressure.dimension, 6894.757293168361, { supportsFractionalPrefixes: true });
export const barye = createPrefixedUnits("barye", "Ba_pres", pressure.dimension, 0.1, { supportsFractionalPrefixes: true });
export const millimeterOfMercury = createPrefixedUnits("millimeterOfMercury", "mmHg", pressure.dimension, 133.322387415, { supportsFractionalPrefixes: true });
export const inchOfMercury = createPrefixedUnits("inchOfMercury", "inHg", pressure.dimension, 3386.389, { supportsFractionalPrefixes: true });

// Energy
export const joule = createPrefixedUnits("joule", "J", energy.dimension, 1.0, { supportsFractionalPrefixes: true });
export const Joule = joule;
export const erg = createPrefixedUnits("erg", "erg", energy.dimension, 1e-7, { supportsFractionalPrefixes: true });
export const calorie = createPrefixedUnits("calorie", "cal", energy.dimension, 4.184, { supportsFractionalPrefixes: true });
export const britishThermalUnit = createPrefixedUnits("britishThermalUnit", "BTU", energy.dimension, 1055.05585262, { supportsFractionalPrefixes: true });
export const electronVolt = createPrefixedUnits("electronVolt", "eV", energy.dimension, 1.602176634e-19, { supportsFractionalPrefixes: true });
export const footPound = createPrefixedUnits("footPound", "ft·lb", energy.dimension, 1.3558179483314004, { supportsFractionalPrefixes: true });
export const wattHour = createPrefixedUnits("wattHour", "Wh", energy.dimension, 3600.0, { supportsFractionalPrefixes: true });
export const therm = createPrefixedUnits("therm", "thm", energy.dimension, 105480400.0, { supportsFractionalPrefixes: true });
export const tonOfTNT = createPrefixedUnits("tonOfTNT", "tTNT", energy.dimension, 4.184e9, { supportsFractionalPrefixes: true });
export const hartree = createPrefixedUnits("hartree", "E_h", energy.dimension, 4.3597447222071e-18, { supportsFractionalPrefixes: true });
export const rydberg = createPrefixedUnits("rydberg", "Ry", energy.dimension, 2.1798723611035e-18, { supportsFractionalPrefixes: true });

// Power
export const watt = createPrefixedUnits("watt", "W", power.dimension, 1.0, { supportsFractionalPrefixes: true });
export const Watt = watt;
export const horsepower = createPrefixedUnits("horsepower", "hp", power.dimension, 745.69987158227022, { supportsFractionalPrefixes: true });

// Velocity / Speed
export const meterPerSecond = createPrefixedUnits("meterPerSecond", "m/s", speed.dimension, 1.0, { supportsFractionalPrefixes: true });
export const kilometerPerHour = createPrefixedUnits("kilometerPerHour", "km/h", speed.dimension, 1.0 / 3.6, { supportsFractionalPrefixes: true });
export const milePerHour = createPrefixedUnits("milePerHour", "mph", speed.dimension, 0.44704, { supportsFractionalPrefixes: true });
export const knot = createPrefixedUnits("knot", "kt", speed.dimension, 1852.0 / 3600.0, { supportsFractionalPrefixes: true });
export const speedOfLight = createPrefixedUnits("speedOfLight", "c", speed.dimension, 299792458.0, { supportsFractionalPrefixes: true });

// Acceleration
export const meterPerSecondSquared = createPrefixedUnits("meterPerSecondSquared", "m/s^2", acceleration.dimension, 1.0, { supportsFractionalPrefixes: true });
export const gravity = createPrefixedUnits("gravity", "g", acceleration.dimension, 9.80665, { supportsFractionalPrefixes: true });

// Electricity
export const ampere = createPrefixedUnits("ampere", "A", current.dimension, 1.0, { supportsFractionalPrefixes: true });
export const coulomb = createPrefixedUnits("coulomb", "C", charge.dimension, 1.0, { supportsFractionalPrefixes: true });
export const volt = createPrefixedUnits("volt", "V", voltage.dimension, 1.0, { supportsFractionalPrefixes: true });
export const ohm = createPrefixedUnits("ohm", "Ω", resistance.dimension, 1.0, { supportsFractionalPrefixes: true });
export const farad = createPrefixedUnits("farad", "F", capacitance.dimension, 1.0, { supportsFractionalPrefixes: true });
export const henry = createPrefixedUnits("henry", "H", inductance.dimension, 1.0, { supportsFractionalPrefixes: true });
export const siemens = createPrefixedUnits("siemens", "S", conductance.dimension, 1.0, { supportsFractionalPrefixes: true });

// Frequency & Luminous Intensity
export const hertz = createPrefixedUnits("hertz", "Hz", frequency.dimension, 1.0, { supportsFractionalPrefixes: true });
export const candela = createPrefixedUnits("candela", "cd", LuminousIntensity, 1.0, { supportsFractionalPrefixes: true });

// Electromagnetism
export const weber = createPrefixedUnits("weber", "Wb", magneticFlux.dimension, 1.0, { supportsFractionalPrefixes: true });
export const maxwell = createPrefixedUnits("maxwell", "Mx", magneticFlux.dimension, 1e-8, { supportsFractionalPrefixes: true });
export const tesla = createPrefixedUnits("tesla", "T", magneticField.dimension, 1.0, { supportsFractionalPrefixes: true });
export const gauss = createPrefixedUnits("gauss", "G", magneticField.dimension, 1e-4, { supportsFractionalPrefixes: true });

// Photometry
export const lumen = createPrefixedUnits("lumen", "lm", LuminousFlux, 1.0, { supportsFractionalPrefixes: true });
export const lux = createPrefixedUnits("lux", "lx", Illuminance, 1.0, { supportsFractionalPrefixes: true });
export const phot = createPrefixedUnits("phot", "ph", Illuminance, 10000.0, { supportsFractionalPrefixes: true });
export const footCandle = createPrefixedUnits("footCandle", "fc", Illuminance, 10.7639104, { supportsFractionalPrefixes: true });

// Radiation
export const becquerel = createPrefixedUnits("becquerel", "Bq", frequency.dimension, 1.0, { supportsFractionalPrefixes: true });
export const curie = createPrefixedUnits("curie", "Ci", frequency.dimension, 3.7e10, { supportsFractionalPrefixes: true });
export const gray = createPrefixedUnits("gray", "Gy", specificEnergy.dimension, 1.0, { supportsFractionalPrefixes: true });
export const rad = createPrefixedUnits("rad", "rad_dose", specificEnergy.dimension, 0.01, { supportsFractionalPrefixes: true });
export const sievert = createPrefixedUnits("sievert", "Sv", specificEnergy.dimension, 1.0, { supportsFractionalPrefixes: true });
export const rem = createPrefixedUnits("rem", "rem_dose", specificEnergy.dimension, 0.01, { supportsFractionalPrefixes: true });

// Amount of Substance
export const mole = createPrefixedUnits("mole", "mol", AmountOfSubstance, 1.0, { supportsFractionalPrefixes: true });

// Dimensionless
export const percent = createPrefixedUnits("percent", "%", dimensionless.dimension, 0.01, { supportsFractionalPrefixes: true });
export const partsPerMillion = createPrefixedUnits("partsPerMillion", "ppm", dimensionless.dimension, 1e-6, { supportsFractionalPrefixes: true });
export const partsPerBillion = createPrefixedUnits("partsPerBillion", "ppb", dimensionless.dimension, 1e-9, { supportsFractionalPrefixes: true });
export const micromort = createPrefixedUnits("micromort", "micromort", dimensionless.dimension, 1e-6, { supportsFractionalPrefixes: true });
export const bit = createPrefixedUnits("bit", "bit", Data, 1.0, { supportsFractionalPrefixes: true, supportsBinaryPrefixes: true });
export const byte = createPrefixedUnits("byte", "byte", Data, 8.0, { supportsFractionalPrefixes: true, supportsBinaryPrefixes: true });
export const radian = createPrefixedUnits("radian", "rad", dimensionless.dimension, 1.0, { supportsFractionalPrefixes: true, supportsBinaryPrefixes: true });
export const degree = createPrefixedUnits("degree", "deg", dimensionless.dimension, 0.017453292519943295, { supportsFractionalPrefixes: true, supportsBinaryPrefixes: true });
export const gradian = createPrefixedUnits("gradian", "grad", dimensionless.dimension, 0.015707963267948967, { supportsFractionalPrefixes: true, supportsBinaryPrefixes: true });
export const arcminute = createPrefixedUnits("arcminute", "arcmin", dimensionless.dimension, 0.0002908882086657216, { supportsFractionalPrefixes: true, supportsBinaryPrefixes: true });
export const arcsecond = createPrefixedUnits("arcsecond", "arcsec", dimensionless.dimension, 4.84813681109536e-6, { supportsFractionalPrefixes: true, supportsBinaryPrefixes: true });

// Volume
export const liter = createPrefixedUnits("liter", "L", volume.dimension, 0.001, { supportsFractionalPrefixes: true });
export const fluidOunce = createPrefixedUnits("fluidOunce", "fl_oz", volume.dimension, 2.95735295625e-5, { supportsFractionalPrefixes: true });
export const usFluidOunce = createPrefixedUnits("usFluidOunce", "us_fl_oz", volume.dimension, 2.95735295625e-5, { supportsFractionalPrefixes: true });
export const imperialFluidOunce = createPrefixedUnits("imperialFluidOunce", "imp_fl_oz", volume.dimension, 2.84130625e-5, { supportsFractionalPrefixes: true });
export const cup = createPrefixedUnits("cup", "cup", volume.dimension, 0.0002365882365, { supportsFractionalPrefixes: true });
export const usCup = createPrefixedUnits("usCup", "us_cup", volume.dimension, 0.0002365882365, { supportsFractionalPrefixes: true });
export const usLegalCup = createPrefixedUnits("usLegalCup", "us_legal_cup", volume.dimension, 0.00024, { supportsFractionalPrefixes: true });
export const metricCup = createPrefixedUnits("metricCup", "metric_cup", volume.dimension, 0.00025, { supportsFractionalPrefixes: true });
export const imperialCup = createPrefixedUnits("imperialCup", "imp_cup", volume.dimension, 0.000284130625, { supportsFractionalPrefixes: true });
export const britishBreakfastCup = createPrefixedUnits("britishBreakfastCup", "breakfast_cup", volume.dimension, 0.0002273045, { supportsFractionalPrefixes: true });
export const japaneseCup = createPrefixedUnits("japaneseCup", "jp_cup", volume.dimension, 0.0002, { supportsFractionalPrefixes: true });
export const pint = createPrefixedUnits("pint", "pt", volume.dimension, 0.000473176473, { supportsFractionalPrefixes: true });
export const usPint = createPrefixedUnits("usPint", "us_pt", volume.dimension, 0.000473176473, { supportsFractionalPrefixes: true });
export const imperialPint = createPrefixedUnits("imperialPint", "imp_pt", volume.dimension, 0.00056826125, { supportsFractionalPrefixes: true });
export const quart = createPrefixedUnits("quart", "qt", volume.dimension, 0.000946352946, { supportsFractionalPrefixes: true });
export const usQuart = createPrefixedUnits("usQuart", "us_qt", volume.dimension, 0.000946352946, { supportsFractionalPrefixes: true });
export const imperialQuart = createPrefixedUnits("imperialQuart", "imp_qt", volume.dimension, 0.0011365225, { supportsFractionalPrefixes: true });
export const gallon = createPrefixedUnits("gallon", "gal", volume.dimension, 0.003785411784, { supportsFractionalPrefixes: true });
export const usGallon = createPrefixedUnits("usGallon", "us_gal", volume.dimension, 0.003785411784, { supportsFractionalPrefixes: true });
export const imperialGallon = createPrefixedUnits("imperialGallon", "imp_gal", volume.dimension, 0.00454609, { supportsFractionalPrefixes: true });
export const teaspoon = createPrefixedUnits("teaspoon", "tsp", volume.dimension, 4.92892159375e-6, { supportsFractionalPrefixes: true });
export const tablespoon = createPrefixedUnits("tablespoon", "tbsp", volume.dimension, 1.478676478125e-5, { supportsFractionalPrefixes: true });
export const barrel = createPrefixedUnits("barrel", "bbl", volume.dimension, 0.158987294928, { supportsFractionalPrefixes: true });
export const imperialBarrel = createPrefixedUnits("imperialBarrel", "imp_bbl", volume.dimension, 0.16365924, { supportsFractionalPrefixes: true });
export const peck = createPrefixedUnits("peck", "pk", volume.dimension, 0.00880976754172, { supportsFractionalPrefixes: true });
export const bushel = createPrefixedUnits("bushel", "bu", volume.dimension, 0.03523907016688, { supportsFractionalPrefixes: true });
export const tablespoonMetric = createPrefixedUnits("tablespoonMetric", "tbsp_m", volume.dimension, 1.5e-5, { supportsFractionalPrefixes: true });
export const teaspoonMetric = createPrefixedUnits("teaspoonMetric", "tsp_m", volume.dimension, 5e-6, { supportsFractionalPrefixes: true });
export const butt = createPrefixedUnits("butt", "butt", volume.dimension, 0.49097772, { supportsFractionalPrefixes: true });

export const Length = length.dimension;