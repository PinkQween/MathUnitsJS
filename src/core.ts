// =============================================================================
// PhysicalDimension - Exponent-based dimensional analysis
// =============================================================================

export class PhysicalDimension {
	readonly exponents: Readonly<Record<string, number>>;

	constructor(exponents: Record<string, number> = {}) {
		const filtered: Record<string, number> = {};
		for (const [key, value] of Object.entries(exponents)) {
			if (value !== 0) filtered[key] = value;
		}
		this.exponents = Object.freeze(filtered);
	}

	static add(a: PhysicalDimension, b: PhysicalDimension): PhysicalDimension {
		const r: Record<string, number> = { ...a.exponents };
		for (const [d, e] of Object.entries(b.exponents)) {
			r[d] = (r[d] ?? 0) + e;
		}
		return new PhysicalDimension(r);
	}

	static subtract(a: PhysicalDimension, b: PhysicalDimension): PhysicalDimension {
		const r: Record<string, number> = { ...a.exponents };
		for (const [d, e] of Object.entries(b.exponents)) {
			r[d] = (r[d] ?? 0) - e;
		}
		return new PhysicalDimension(r);
	}

	static scale(d: PhysicalDimension, n: number): PhysicalDimension {
		const r: Record<string, number> = {};
		for (const [dim, exp] of Object.entries(d.exponents)) {
			r[dim] = exp * n;
		}
		return new PhysicalDimension(r);
	}

	static equals(a: PhysicalDimension, b: PhysicalDimension): boolean {
		const kA = Object.keys(a.exponents);
		const kB = Object.keys(b.exponents);
		if (kA.length !== kB.length) return false;
		for (const k of kA) {
			if (a.exponents[k] !== b.exponents[k]) return false;
		}
		return true;
	}

	get isDimensionless(): boolean {
		return Object.keys(this.exponents).length === 0;
	}

	toString(): string {
		const keys = Object.keys(this.exponents).sort();
		if (keys.length === 0) return "1";
		return keys.map(k => {
			const e = this.exponents[k]!;
			return e === 1 ? k : `${k}^${e}`;
		}).join("");
	}
}

// =============================================================================
// UnitConverter
// =============================================================================

export interface UnitConverter {
	convertToBase(value: number): number;
	convertFromBase(value: number): number;
}

export class LinearConverter implements UnitConverter {
	readonly coefficient: number;
	constructor(coefficient: number) { this.coefficient = coefficient; }
	convertToBase(v: number) { return v * this.coefficient; }
	convertFromBase(v: number) { return v / this.coefficient; }
}

export class OffsetConverter implements UnitConverter {
	readonly coefficient: number;
	readonly constant: number;
	constructor(coefficient: number, constant: number) {
		this.coefficient = coefficient;
		this.constant = constant;
	}
	convertToBase(v: number) { return (v * this.coefficient) + this.constant; }
	convertFromBase(v: number) { return (v - this.constant) / this.coefficient; }
}

export class EmptyConverter implements UnitConverter {
	convertToBase(v: number) { return v; }
	convertFromBase(v: number) { return v; }
}

// =============================================================================
// SymbolPosition
// =============================================================================

export enum SymbolPosition {
	Prefix = "prefix",
	Suffix = "suffix",
}

// =============================================================================
// Unit Interface
// =============================================================================

export interface Unit {
	readonly symbol: string;
	readonly dimension: PhysicalDimension;
	readonly converter: UnitConverter;
	readonly symbolPosition: SymbolPosition;
}

// =============================================================================
// NamedUnit
// =============================================================================

export class NamedUnit implements Unit {
	readonly id: string;
	readonly symbol: string;
	readonly dimension: PhysicalDimension;
	readonly converter: UnitConverter;
	readonly symbolPosition: SymbolPosition;

	constructor(
		symbol: string,
		dimension: PhysicalDimension,
		converter: UnitConverter,
		symbolPosition?: SymbolPosition,
		id?: string,
	) {
		this.id = id ?? symbol;
		this.symbol = symbol;
		this.dimension = dimension;
		this.converter = converter;
		this.symbolPosition = symbolPosition
			?? (PhysicalDimension.equals(dimension, currencyDimension)
				? SymbolPosition.Prefix
				: SymbolPosition.Suffix);
	}

	get base(): NamedUnit {
		return new NamedUnit(this.symbol, this.dimension, new LinearConverter(1.0), this.symbolPosition, this.id);
	}

	toBase(v: number) { return this.converter.convertToBase(v); }
	fromBase(v: number) { return this.converter.convertFromBase(v); }

	equals(other: Unit): boolean {
		return this.symbol === other.symbol
			&& PhysicalDimension.equals(this.dimension, other.dimension);
	}
}

// Forward reference - set by registry
let currencyDimension = new PhysicalDimension({ currency: 1 });
export function _setCurrencyDimension(d: PhysicalDimension) { currencyDimension = d; }

// =============================================================================
// CompositeUnit (derived from unit algebra)
// =============================================================================

export class CompositeUnit implements Unit {
	readonly symbol: string;
	readonly dimension: PhysicalDimension;
	readonly converter: UnitConverter;
	readonly symbolPosition: SymbolPosition = SymbolPosition.Suffix;

	constructor(symbol: string, dimension: PhysicalDimension, converter: UnitConverter) {
		this.symbol = symbol;
		this.dimension = dimension;
		this.converter = converter;
	}

	get base(): CompositeUnit {
		return new CompositeUnit(this.symbol, this.dimension, new LinearConverter(1.0));
	}

	toBase(v: number) { return this.converter.convertToBase(v); }
	fromBase(v: number) { return this.converter.convertFromBase(v); }
}

// =============================================================================
// Unit algebra operators
// =============================================================================

export function multiplyUnits(a: Unit, b: Unit): CompositeUnit {
	const dim = PhysicalDimension.add(a.dimension, b.dimension);
	const sym = `(${a.symbol}*${b.symbol})`;
	const coeff = a.converter.convertToBase(1.0) * b.converter.convertToBase(1.0);
	return new CompositeUnit(sym, dim, new LinearConverter(coeff));
}

export function divideUnits(a: Unit, b: Unit): CompositeUnit {
	const dim = PhysicalDimension.subtract(a.dimension, b.dimension);
	const sym = `(${a.symbol}/${b.symbol})`;
	const coeff = a.converter.convertToBase(1.0) / b.converter.convertToBase(1.0);
	return new CompositeUnit(sym, dim, new LinearConverter(coeff));
}

// =============================================================================
// Quantity
// =============================================================================

export class Quantity<U extends Unit = Unit> {
	readonly value: number;
	readonly unit: U;

	constructor(value: number, unit: U) {
		this.value = value;
		this.unit = unit;
	}

	// --- Conversion ---

	converted<T extends Unit>(target: T): Quantity<T> {
		if (!PhysicalDimension.equals(this.unit.dimension, target.dimension)) {
			throw new Error(
				`Cannot convert between different dimensions: ` +
				`${this.unit.dimension} and ${target.dimension}`
			);
		}
		const base = this.unit.converter.convertToBase(this.value);
		return new Quantity(target.converter.convertFromBase(base), target);
	}

	to<T extends Unit>(target: T): Quantity<T> {
		return this.converted(target);
	}

	valueIn(target: Unit): number {
		return this.converted(target).value;
	}

	// --- Same-dimension arithmetic ---

	add(other: Quantity): Quantity<U> {
		if (!PhysicalDimension.equals(this.unit.dimension, other.unit.dimension)) {
			throw new Error(
				`Cannot add quantities of different dimensions: ` +
				`${this.unit.dimension} and ${other.unit.dimension}`
			);
		}
		return new Quantity(this.value + other.converted(this.unit).value, this.unit);
	}

	subtract(other: Quantity): Quantity<U> {
		if (!PhysicalDimension.equals(this.unit.dimension, other.unit.dimension)) {
			throw new Error(
				`Cannot subtract quantities of different dimensions: ` +
				`${this.unit.dimension} and ${other.unit.dimension}`
			);
		}
		return new Quantity(this.value - other.converted(this.unit).value, this.unit);
	}

	// --- Scalar operations ---

	multiplyScalar(scalar: number): Quantity<U> {
		return new Quantity(this.value * scalar, this.unit);
	}

	divideScalar(scalar: number): Quantity<U> {
		return new Quantity(this.value / scalar, this.unit);
	}

	// --- Dimensional algebra ---

	multiply(other: Quantity): Quantity<CompositeUnit> {
		return new Quantity(
			this.value * other.value,
			multiplyUnits(this.unit, other.unit),
		);
	}

	divide(other: Quantity): Quantity<CompositeUnit> {
		return new Quantity(
			this.value / other.value,
			divideUnits(this.unit, other.unit),
		);
	}

	// --- Comparison ---

	equals(other: Quantity, tolerance = 1e-12): boolean {
		if (!PhysicalDimension.equals(this.unit.dimension, other.unit.dimension)) return false;
		return Math.abs(this.value - other.converted(this.unit).value) <= tolerance;
	}

	isEquivalent(other: Quantity, tolerance = 1e-12): boolean {
		return this.equals(other, tolerance);
	}

	compare(other: Quantity): number {
		if (!PhysicalDimension.equals(this.unit.dimension, other.unit.dimension)) {
			throw new Error(
				`Cannot compare quantities of different dimensions: ` +
				`${this.unit.dimension} and ${other.unit.dimension}`
			);
		}
		const d = this.value - other.converted(this.unit).value;
		return d < 0 ? -1 : d > 0 ? 1 : 0;
	}

	lessThan(other: Quantity): boolean { return this.compare(other) < 0; }
	greaterThan(other: Quantity): boolean { return this.compare(other) > 0; }

	// --- Thermal energy (temperature -> energy via kB) ---

	get thermalEnergy(): Quantity {
		const kB = 1.380649e-23;
		const tempDim = new PhysicalDimension({ temperature: 1 });
		const energyDim = new PhysicalDimension({ mass: 1, length: 2, time: -2 });
		const kelvinUnit = new NamedUnit("K", tempDim, new LinearConverter(1.0));
		const jouleUnit = new NamedUnit("J", energyDim, new LinearConverter(1.0));
		const tempInK = this.converted(kelvinUnit).value;
		return new Quantity(tempInK * kB, jouleUnit);
	}

	thermalEnergyIn(target: Unit): Quantity {
		return this.thermalEnergy.converted(target);
	}

	// --- Serialization ---

	toJSON(): { value: number; unitId: string } {
		const unitId = this.unit instanceof NamedUnit ? this.unit.id : this.unit.symbol;
		return { value: this.value, unitId };
	}

	// --- Formatting ---

	formatted(decimalPlaces = 2, includeSpace?: boolean): string {
		const v = this.value.toFixed(decimalPlaces);
		if (this.unit.symbolPosition === SymbolPosition.Prefix) {
			const sp = includeSpace === true ? " " : "";
			return `${this.unit.symbol}${sp}${v}`;
		}
		const defaultSpace = this.unit.symbol !== "%";
		const sp = includeSpace !== undefined
			? (includeSpace ? " " : "")
			: (defaultSpace ? " " : "");
		return `${v}${sp}${this.unit.symbol}`;
	}

	toString(): string {
		return this.formatted();
	}
}
