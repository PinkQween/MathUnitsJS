import type { PhysicalDimension, Unit } from "./core.js";
import { NamedUnit, LinearConverter } from "./core.js";

// =============================================================================
// SI Prefixes
// =============================================================================

export type SIPrefixName =
	| "quetta" | "ronna" | "yotta" | "zetta" | "exa" | "peta" | "tera"
	| "giga" | "mega" | "kilo" | "hecto" | "deca"
	| "deci" | "centi" | "milli" | "micro" | "nano" | "pico"
	| "femto" | "atto" | "zepto" | "yocto" | "ronto" | "quecto";

export type SIPrefixes<Frac extends boolean> = Frac extends true
	? SIPrefixName
	: "quetta" | "ronna" | "yotta" | "zetta" | "exa" | "peta" | "tera"
	| "giga" | "mega" | "kilo" | "hecto" | "deca";

export type BinaryPrefixName = "yobi" | "zebi" | "exbi" | "pebi" | "tebi" | "gibi" | "mebi" | "kibi";

export const SI_PREFIXES = [
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
	{ name: "quecto", symbol: "q", value: 1e-30 },
] as const;

export const BINARY_PREFIXES = [
	{ name: "yobi", symbol: "Yi", value: 2 ** 80 },
	{ name: "zebi", symbol: "Zi", value: 2 ** 70 },
	{ name: "exbi", symbol: "Ei", value: 2 ** 60 },
	{ name: "pebi", symbol: "Pi", value: 2 ** 50 },
	{ name: "tebi", symbol: "Ti", value: 2 ** 40 },
	{ name: "gibi", symbol: "Gi", value: 2 ** 30 },
	{ name: "mebi", symbol: "Mi", value: 2 ** 20 },
	{ name: "kibi", symbol: "Ki", value: 2 ** 10 },
] as const;

// =============================================================================
// Prefixed Unit Factory
// =============================================================================

export type PrefixedUnitMap<
	N extends string,
	Frac extends boolean,
	Bin extends boolean,
> = {
	[K in `${SIPrefixes<Frac>}${N}`]: NamedUnit;
} & (Bin extends true
	? { [K in `${BinaryPrefixName}${N}`]: NamedUnit }
	: {});

export function createPrefixedUnits<
	N extends string,
	Frac extends boolean = true,
	Bin extends boolean = false,
>(
	name: N,
	symbol: string,
	dimension: PhysicalDimension,
	baseCoeff = 1.0,
	options?: {
		supportsFractionalPrefixes?: Frac;
		supportsBinaryPrefixes?: Bin;
	},
): NamedUnit & PrefixedUnitMap<N, Frac, Bin> {
	const supportsFrac = options?.supportsFractionalPrefixes !== false;
	const supportsBin = options?.supportsBinaryPrefixes === true;

	const base = new NamedUnit(symbol, dimension, new LinearConverter(baseCoeff));
	const obj = base as NamedUnit & Record<string, NamedUnit>;

	for (const p of SI_PREFIXES) {
		const isFrac = p.value < 1;
		if (!isFrac || supportsFrac) {
			obj[`${p.name}${name}`] = new NamedUnit(
				`${p.symbol}${symbol}`,
				dimension,
				new LinearConverter(baseCoeff * p.value),
			);
		}
	}

	if (supportsBin) {
		for (const p of BINARY_PREFIXES) {
			obj[`${p.name}${name}`] = new NamedUnit(
				`${p.symbol}${symbol}`,
				dimension,
				new LinearConverter(baseCoeff * p.value),
			);
		}
	}

	return base as NamedUnit & PrefixedUnitMap<N, Frac, Bin>;
}
