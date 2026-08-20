import { describe, it, expect } from "bun:test";
import {
	PhysicalDimension, LinearConverter, OffsetConverter, EmptyConverter,
	NamedUnit, CompositeUnit, Quantity, SymbolPosition,
	// Dimensions
	length as lengthDim, mass as massDim, time as timeDim,
	acceleration as accelDim,
	resistance as resistanceDim,
	capacitance as capacitanceDim, inductance as inductanceDim,
	conductance as conductanceDim,
	// Units
	planckLength, meter, kilometer, millimeter, parsec, angstrom,
	beardSecond, poronkusema, nauticalMile, astronomicalUnit,
	second, minute, hour, day, week, year, jiffy, physicsJiffy,
	gram, kilogram, ounce, pound, stone, slug, carat, troyPound,
	squareMeter, acre, hectare,
	kelvin, celsius, fahrenheit, rankine,
	newton, poundForce, dyne,
	pascal, bar, atmosphere, psi,
	joule, calorie, britishThermalUnit, electronVolt, footPound,
	watt, horsepower,
	meterPerSecond, kilometerPerHour, milePerHour, knot, speedOfLightUnit,
	ampere, coulomb, volt, ohm, farad, henry, siemens,
	hertz, becquerel, curie, candela,
	tesla, gauss, weber, maxwell,
	lumen, lux, phot, footCandle,
	gray, rad, sievert, rem,
	mole,
	percent, micromort,
	radian, degree,
	bit, byte,
	liter, usFluidOunce, imperialFluidOunce, usCup, britishBreakfastCup, butt,
	usd, eur, gbp, btc, sek, resolveCurrency,
} from "../src/index.js";

describe("Base Conversion", () => {
	it("km <-> m", () => {
		expect(new Quantity(5.0, kilometer).converted(meter).value).toBe(5000.0);
		expect(new Quantity(2000.0, meter).converted(kilometer).value).toBe(2.0);
	});
});

describe("Empty Converter", () => {
	it("passes through", () => {
		const c = new EmptyConverter();
		expect(c.convertToBase(5.0)).toBe(5.0);
		expect(c.convertFromBase(10.0)).toBe(10.0);
	});
});

describe("Planck Scales", () => {
	it("megaparsec -> meters -> planck lengths", () => {
		const oneMpc = new Quantity(1.0, parsec.megaparsec);
		expect(Math.abs(oneMpc.converted(meter).value - 3.0856775814913673e22)).toBeLessThan(1.0);
		const inPlanck = oneMpc.converted(planckLength);
		const expected = 3.0856775814913673e22 / 1.616255e-35;
		expect(Math.abs(inPlanck.value - expected) / expected).toBeLessThan(1e-12);
	});

	it("1 planck length -> meters", () => {
		expect(new Quantity(1.0, planckLength).converted(meter).value).toBe(1.616255e-35);
	});
});

describe("Offset Temperature", () => {
	it("celsius -> kelvin", () => {
		expect(new Quantity(0.0, celsius).converted(kelvin).value).toBe(273.15);
		expect(new Quantity(100.0, celsius).converted(kelvin).value).toBe(373.15);
	});

	it("kelvin -> celsius", () => {
		expect(Math.abs(new Quantity(293.15, kelvin).converted(celsius).value - 20.0)).toBeLessThan(1e-9);
	});

	it("fahrenheit -> celsius (body temp)", () => {
		expect(Math.abs(new Quantity(98.6, fahrenheit).converted(celsius).value - 37.0)).toBeLessThan(1e-4);
	});

	it("fahrenheit -> kelvin", () => {
		expect(Math.abs(new Quantity(77.0, fahrenheit).converted(kelvin).value - 298.15)).toBeLessThan(1e-6);
	});

	it("rankine -> kelvin", () => {
		expect(Math.abs(new Quantity(491.67, rankine).converted(kelvin).value - 273.15)).toBeLessThan(1e-3);
	});
});

describe("Dimensional Addition/Subtraction", () => {
	it("add same dimension different units", () => {
		const a = new Quantity(5.0, meter);
		const b = new Quantity(2.0, kilometer);
		const sum = a.add(b);
		expect(sum.value).toBe(2005.0);
		expect(sum.unit.symbol).toBe("m");
	});

	it("subtract", () => {
		const diff = new Quantity(2.0, kilometer).subtract(new Quantity(5.0, meter));
		expect(diff.value).toBe(1.995);
		expect(diff.unit.symbol).toBe("km");
	});
});

describe("Dimensional Algebra", () => {
	it("distance / time = speed", () => {
		const v = new Quantity(100.0, meter).divide(new Quantity(5.0, second));
		expect(v.value).toBe(20.0);
		expect(v.unit.symbol).toBe("(m/s)");
	});

	it("distance * distance = area", () => {
		const d = new Quantity(100.0, meter);
		const a = d.multiply(d);
		expect(a.value).toBe(10000.0);
		expect(a.unit.symbol).toBe("(m*m)");
	});

	it("mass * acceleration = force", () => {
		const accel = new Quantity(9.81, new CompositeUnit("m/s\u00B2", accelDim, new LinearConverter(1.0)));
		const f = new Quantity(80.0, kilogram).multiply(accel);
		expect(Math.abs(f.value - 784.8)).toBeLessThan(1e-9);
		expect(f.unit.symbol).toBe("(kg*m/s\u00B2)");
	});

	it("force * distance = energy", () => {
		const accel = new Quantity(9.81, new CompositeUnit("m/s\u00B2", accelDim, new LinearConverter(1.0)));
		const f = new Quantity(80.0, kilogram).multiply(accel);
		const e = f.multiply(new Quantity(100.0, meter));
		expect(Math.abs(e.value - 78480.0)).toBeLessThan(1e-9);
		expect(e.unit.symbol).toBe("((kg*m/s\u00B2)*m)");
	});

	it("SI derived dimension exponents", () => {
		expect(resistanceDim.exponents).toEqual({ mass: 1, length: 2, time: -3, electricCurrent: -2 });
		expect(capacitanceDim.exponents).toEqual({ mass: -1, length: -2, time: 4, electricCurrent: 2 });
		expect(inductanceDim.exponents).toEqual({ mass: 1, length: 2, time: -2, electricCurrent: -2 });
		expect(conductanceDim.exponents).toEqual({ mass: -1, length: -2, time: 3, electricCurrent: 2 });
	});
});

describe("Custom Dimensions", () => {
	it("user-defined dimension conversion", () => {
		const dim = new PhysicalDimension({ USD: 1 });
		const usdU = new NamedUnit("$", dim, new LinearConverter(1.0));
		const eurU = new NamedUnit("\u20AC", dim, new LinearConverter(1.09));
		expect(new Quantity(10.0, eurU).converted(usdU).value).toBeCloseTo(10.9);
	});

	it("custom dimension algebra", () => {
		const dimA = new PhysicalDimension({ USD: 1 });
		const dimB = new PhysicalDimension({ user: 1 });
		const usdU = new NamedUnit("$", dimA, new LinearConverter(1.0));
		const userU = new NamedUnit("user", dimB, new LinearConverter(1.0));
		const rpu = new Quantity(1000.0, usdU).divide(new Quantity(10.0, userU));
		expect(rpu.value).toBe(100.0);
		expect(rpu.unit.symbol).toBe("($/user)");
		expect(PhysicalDimension.equals(rpu.unit.dimension, new PhysicalDimension({ USD: 1, user: -1 }))).toBe(true);
	});
});

describe("Prefixed Units", () => {
	it("decimal and binary data prefixes", () => {
		expect(new Quantity(2.0, byte.gigabyte).converted(byte).value).toBe(2e9);
		expect(new Quantity(2.0, byte.gibibyte).converted(byte).value).toBe(2.0 * 1073741824);
	});

	it("mass SI prefixes", () => {
		expect(new Quantity(1.0, kilogram).converted(gram).value).toBe(1000.0);
		expect(new Quantity(1e6, gram.microgram).converted(gram).value).toBeCloseTo(1.0);
	});

	it("bit binary prefixes", () => {
		expect(new Quantity(1.0, bit.mebibit).converted(bit).value).toBe(1048576.0);
	});
});
