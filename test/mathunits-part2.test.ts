import { describe, it, expect } from "bun:test";
import {
	NamedUnit, CompositeUnit, Quantity, SymbolPosition,
	PhysicalDimension, LinearConverter,
	length as lengthDim, mass as massDim, time as timeDim,
	slug, kilogram, footPound, joule, poundForce, newton,
	celsius, fahrenheit, kelvin,
	tesla, gauss, weber, maxwell,
	becquerel, curie, gray, rad, sievert, rem,
	radian, degree,
	beardSecond, poronkusema, butt, jiffy, physicsJiffy,
	micromort, percent, meter, kilometer, second, liter,
	usFluidOunce, imperialFluidOunce, usCup, britishBreakfastCup, troyPound, pound, carat, gram,
	usd, eur, gbp, jpy, btc, sek, resolveCurrency,
} from "../src/index.js";

describe("Customary & Physics Units", () => {
	it("slugs to kg", () => {
		expect(Math.abs(new Quantity(10.0, slug).converted(kilogram).value - 145.939029)).toBeLessThan(1e-4);
	});

	it("ft-lb to J", () => {
		expect(Math.abs(new Quantity(100.0, footPound).converted(joule).value - 135.58179483314004)).toBeLessThan(1e-6);
	});

	it("N to lbf", () => {
		expect(Math.abs(new Quantity(100.0, newton).converted(poundForce).value - 22.4808943)).toBeLessThan(1e-3);
	});
});

describe("Fahrenheit -> Kelvin -> BTU", () => {
	it("fahrenheit -> kelvin", () => {
		const tempF = new Quantity(77.0, fahrenheit);
		expect(Math.abs(tempF.converted(kelvin).value - 298.15)).toBeLessThan(1e-6);
	});

	it("thermal energy roundtrip", () => {
		const tempF = new Quantity(77.0, fahrenheit);
		const thermalE = tempF.thermalEnergy;
		// thermalEnergy should be in Joules
		const kB = 1.380649e-23;
		const expectedE = 298.15 * kB;
		expect(Math.abs(thermalE.value - expectedE)).toBeLessThan(1e-30);
	});
});

describe("Additional Customary Units", () => {
	it("british breakfast cup to us cup", () => {
		const v = new Quantity(2.0, britishBreakfastCup).converted(usCup);
		expect(Math.abs(v.value - 1.92151152)).toBeLessThan(1e-5);
	});

	it("imperial fl oz to us fl oz", () => {
		const v = new Quantity(20.0, imperialFluidOunce).converted(usFluidOunce);
		expect(Math.abs(v.value - 19.2151988)).toBeLessThan(1e-5);
	});

	it("troy pound to avoirdupois pound", () => {
		const v = new Quantity(10.0, troyPound).converted(pound);
		expect(Math.abs(v.value - 8.22857143)).toBeLessThan(1e-5);
	});

	it("carat to gram", () => {
		expect(Math.abs(new Quantity(5.0, carat).converted(gram).value - 1.0)).toBeLessThan(1e-9);
	});
});

describe("Scientific Dimensions", () => {
	it("tesla to gauss", () => {
		expect(Math.abs(new Quantity(1.5, tesla).converted(gauss).value - 15000.0)).toBeLessThan(1e-9);
	});

	it("weber to maxwell", () => {
		expect(Math.abs(new Quantity(0.001, weber).converted(maxwell).value - 100000.0)).toBeLessThan(1e-9);
	});

	it("becquerel to curie", () => {
		expect(Math.abs(new Quantity(3.7e10, becquerel).converted(curie).value - 1.0)).toBeLessThan(1e-9);
	});

	it("gray to rad", () => {
		expect(Math.abs(new Quantity(1.0, gray).converted(rad).value - 100.0)).toBeLessThan(1e-9);
	});

	it("degree to radian", () => {
		expect(Math.abs(new Quantity(90.0, degree).converted(radian).value - Math.PI / 2.0)).toBeLessThan(1e-9);
	});
});

describe("Fun Units", () => {
	it("beard-seconds to meters", () => {
		expect(new Quantity(2.0, beardSecond).converted(meter).value).toBe(1e-8);
	});

	it("poronkusema to km", () => {
		expect(new Quantity(1.0, poronkusema).converted(kilometer).value).toBe(7.5);
	});

	it("butt to liters", () => {
		expect(Math.abs(new Quantity(2.0, butt).converted(liter).value - 981.95544)).toBeLessThan(1e-5);
	});

	it("jiffy to seconds", () => {
		expect(new Quantity(60.0, jiffy).converted(second).value).toBe(1.0);
	});

	it("physics jiffy to seconds", () => {
		expect(Math.abs(new Quantity(1e11, physicsJiffy).converted(second).value - 3.33564095198)).toBeLessThan(1e-9);
	});

	it("micromort to percent", () => {
		expect(Math.abs(new Quantity(10000.0, micromort).converted(percent).value - 1.0)).toBeLessThan(1e-9);
	});
});

describe("Currency Conversion", () => {
	it("EUR -> USD -> EUR", () => {
		const inUsd = new Quantity(10.0, eur).converted(usd);
		expect(Math.abs(inUsd.value - 10.8)).toBeLessThan(1e-9);
		const back = inUsd.converted(eur);
		expect(Math.abs(back.value - 10.0)).toBeLessThan(1e-9);
	});

	it("BTC -> USD", () => {
		expect(new Quantity(1.0, btc).converted(usd).value).toBe(68000.0);
	});

	it("currency symbols", () => {
		expect(usd.symbol).toBe("$");
		expect(eur.symbol).toBe("\u20AC");
		expect(gbp.symbol).toBe("\u00A3");
		expect(jpy.symbol).toBe("\u00A5");
		expect(btc.symbol).toBe("\u20BF");
	});

	it("currency resolution", () => {
		expect(resolveCurrency("USD")).toBe(usd);
		expect(resolveCurrency("eur")).toBe(eur);
		expect(resolveCurrency("btc")).toBe(btc);
		expect(resolveCurrency("INVALID")).toBeUndefined();
	});
});

describe("Unit Equality", () => {
	it("named units are equal by symbol + dimension", () => {
		const a = new NamedUnit("$", new PhysicalDimension({ currency: 1 }), new LinearConverter(1.0));
		const b = new NamedUnit("$", new PhysicalDimension({ currency: 1 }), new LinearConverter(2.0));
		expect(a.equals(b)).toBe(true);
		expect(a.equals(sek)).toBe(false);
	});

	it("symbol position", () => {
		expect(usd.symbolPosition).toBe(SymbolPosition.Prefix);
		expect(meter.symbolPosition).toBe(SymbolPosition.Suffix);
		expect(sek.symbolPosition).toBe(SymbolPosition.Suffix);
	});
});

describe("Quantity Formatting", () => {
	it("prefix symbol (USD)", () => {
		const q = new Quantity(10.1234, usd);
		expect(q.formatted()).toBe("$10.12");
		expect(q.formatted(3)).toBe("$10.123");
		expect(q.formatted(2, true)).toBe("$ 10.12");
	});

	it("suffix symbol (meters)", () => {
		const q = new Quantity(5.5, meter);
		expect(q.formatted()).toBe("5.50 m");
		expect(q.formatted(1)).toBe("5.5 m");
		expect(q.formatted(2, false)).toBe("5.50m");
	});

	it("suffix currency (SEK)", () => {
		expect(new Quantity(100.0, sek).formatted(0)).toBe("100 kr");
	});

	it("percent without space", () => {
		const q = new Quantity(75.5, percent);
		expect(q.formatted(1)).toBe("75.5%");
		expect(q.formatted(1, true)).toBe("75.5 %");
	});
});
