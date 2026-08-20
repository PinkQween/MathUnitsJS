import { describe, it, expect } from "bun:test";
import {
	Quantity, meter, kilometer, second, kelvin, celsius, fahrenheit,
	usd, eur, mxn, btc, gram, kilogram,
	NamedUnit, CompositeUnit, LinearConverter,
	deserialize, getUnit, allUnits,
} from "../src/index.js";

describe("NamedUnit.id", () => {
	it("auto-generated ids from createPrefixedUnits", () => {
		expect(meter.id).toBe("meter");
		expect(kilometer.id).toBe("kilometer");
		expect(second.id).toBe("second");
		expect(gram.id).toBe("gram");
		expect(kilogram.id).toBe("kilogram");
	});

	it("explicit ids for temperature", () => {
		expect(kelvin.id).toBe("kelvin");
		expect(celsius.id).toBe("celsius");
		expect(fahrenheit.id).toBe("fahrenheit");
	});

	it("ISO code ids for currencies", () => {
		expect(usd.id).toBe("USD");
		expect(eur.id).toBe("EUR");
		expect(mxn.id).toBe("MXN");
		expect(btc.id).toBe("BTC");
	});

	it("fallback to symbol when no id provided", () => {
		const custom = new NamedUnit("custom", meter.dimension, new LinearConverter(1.0));
		expect(custom.id).toBe("custom");
	});
});

describe("Quantity.toJSON()", () => {
	it("serializes basic unit", () => {
		const q = new Quantity(100, meter);
		expect(q.toJSON()).toEqual({ value: 100, unitId: "meter" });
	});

	it("serializes prefixed unit", () => {
		const q = new Quantity(5.5, kilometer);
		expect(q.toJSON()).toEqual({ value: 5.5, unitId: "kilometer" });
	});

	it("serializes temperature", () => {
		expect(new Quantity(37, celsius).toJSON()).toEqual({ value: 37, unitId: "celsius" });
		expect(new Quantity(98.6, fahrenheit).toJSON()).toEqual({ value: 98.6, unitId: "fahrenheit" });
	});

	it("serializes currencies with unique ids", () => {
		expect(new Quantity(10, usd).toJSON()).toEqual({ value: 10, unitId: "USD" });
		expect(new Quantity(10, eur).toJSON()).toEqual({ value: 10, unitId: "EUR" });
		expect(new Quantity(10, mxn).toJSON()).toEqual({ value: 10, unitId: "MXN" });
		expect(new Quantity(1, btc).toJSON()).toEqual({ value: 1, unitId: "BTC" });
	});

	it("serializes CompositeUnit (uses symbol as fallback)", () => {
		const speed = new Quantity(20, new CompositeUnit("m/s", meter.dimension, new LinearConverter(1.0)));
		const json = speed.toJSON();
		expect(json.value).toBe(20);
		expect(json.unitId).toBe("m/s");
	});
});

describe("getUnit()", () => {
	it("looks up unit by id", () => {
		expect(getUnit("meter")).toBe(meter);
		expect(getUnit("kilometer")).toBe(kilometer);
		expect(getUnit("USD")).toBe(usd);
		expect(getUnit("celsius")).toBe(celsius);
	});

	it("returns undefined for unknown id", () => {
		expect(getUnit("nonexistent")).toBeUndefined();
	});
});

describe("deserialize()", () => {
	it("round-trips basic units", () => {
		const q = new Quantity(42.5, meter);
		const restored = deserialize(q.toJSON());
		expect(restored.value).toBe(42.5);
		expect(restored.unit.id).toBe("meter");
		expect(restored.unit.symbol).toBe("m");
	});

	it("round-trips prefixed units", () => {
		const q = new Quantity(3.14, kilometer);
		const restored = deserialize(q.toJSON());
		expect(restored.value).toBe(3.14);
		expect(restored.unit.id).toBe("kilometer");
	});

	it("round-trips temperature", () => {
		const q = new Quantity(72, fahrenheit);
		const restored = deserialize(q.toJSON());
		expect(restored.value).toBe(72);
		expect(restored.unit.id).toBe("fahrenheit");
	});

	it("round-trips currencies with shared symbols", () => {
		// USD, MXN, CLP all have symbol "$" but different ids
		const jsonUsd = new Quantity(10, usd).toJSON();
		const jsonMxn = new Quantity(10, mxn).toJSON();
		expect(jsonUsd.unitId).toBe("USD");
		expect(jsonMxn.unitId).toBe("MXN");

		const restoredUsd = deserialize(jsonUsd);
		const restoredMxn = deserialize(jsonMxn);
		expect(restoredUsd.unit.id).toBe("USD");
		expect(restoredMxn.unit.id).toBe("MXN");
		// They should convert differently
		expect(restoredUsd.converted(eur).value).not.toBe(restoredMxn.converted(eur).value);
	});

	it("round-trips through a Prisma-like flow", () => {
		// Simulate: save to DB, load from DB
		const original = new Quantity(98.6, fahrenheit);
		const dbRow = original.toJSON(); // { value: 98.6, unitId: "fahrenheit" }
		const loaded = deserialize(dbRow);

		// Works like any Quantity
		expect(loaded.converted(celsius).value).toBeCloseTo(37.0, 1);
		expect(loaded.formatted()).toBe("98.60 °F");
	});

	it("throws on unknown unitId", () => {
		expect(() => deserialize({ value: 1, unitId: "INVALID" }))
			.toThrow('Unknown unit id: "INVALID"');
	});
});

describe("allUnits", () => {
	it("contains base units", () => {
		expect(allUnits.has("meter")).toBe(true);
		expect(allUnits.has("kilogram")).toBe(true);
		expect(allUnits.has("second")).toBe(true);
	});

	it("contains prefixed units", () => {
		expect(allUnits.has("kilometer")).toBe(true);
		expect(allUnits.has("millimeter")).toBe(true);
		expect(allUnits.has("kilogram")).toBe(true);
	});

	it("contains currencies", () => {
		expect(allUnits.has("USD")).toBe(true);
		expect(allUnits.has("EUR")).toBe(true);
		expect(allUnits.has("BTC")).toBe(true);
	});

	it("contains temperature units", () => {
		expect(allUnits.has("celsius")).toBe(true);
		expect(allUnits.has("fahrenheit")).toBe(true);
		expect(allUnits.has("kelvin")).toBe(true);
	});
});
