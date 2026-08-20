import { NamedUnit, LinearConverter, SymbolPosition } from "./core.js";
import { currency as currDim } from "./dimensions.js";

export const usd = new NamedUnit("$", currDim, new LinearConverter(1.0), SymbolPosition.Prefix);
export const eur = new NamedUnit("\u20AC", currDim, new LinearConverter(1.08), SymbolPosition.Prefix);
export const jpy = new NamedUnit("\u00A5", currDim, new LinearConverter(0.0064), SymbolPosition.Prefix);
export const gbp = new NamedUnit("\u00A3", currDim, new LinearConverter(1.27), SymbolPosition.Prefix);
export const aud = new NamedUnit("A$", currDim, new LinearConverter(0.66), SymbolPosition.Prefix);
export const cad = new NamedUnit("C$", currDim, new LinearConverter(0.73), SymbolPosition.Prefix);
export const chf = new NamedUnit("CHF", currDim, new LinearConverter(1.11), SymbolPosition.Prefix);
export const cny = new NamedUnit("\u00A5", currDim, new LinearConverter(0.14), SymbolPosition.Prefix);
export const sek = new NamedUnit("kr", currDim, new LinearConverter(0.094), SymbolPosition.Suffix);
export const nzd = new NamedUnit("NZ$", currDim, new LinearConverter(0.61), SymbolPosition.Prefix);
export const mxn = new NamedUnit("$", currDim, new LinearConverter(0.059), SymbolPosition.Prefix);
export const sgd = new NamedUnit("S$", currDim, new LinearConverter(0.74), SymbolPosition.Prefix);
export const hkd = new NamedUnit("HK$", currDim, new LinearConverter(0.13), SymbolPosition.Prefix);
export const nok = new NamedUnit("kr", currDim, new LinearConverter(0.094), SymbolPosition.Suffix);
export const krw = new NamedUnit("\u20A9", currDim, new LinearConverter(0.00073), SymbolPosition.Prefix);
export const turkishLira = new NamedUnit("\u20BA", currDim, new LinearConverter(0.031), SymbolPosition.Prefix);
export const inr = new NamedUnit("\u20B9", currDim, new LinearConverter(0.012), SymbolPosition.Prefix);
export const rub = new NamedUnit("\u20BD", currDim, new LinearConverter(0.011), SymbolPosition.Prefix);
export const brl = new NamedUnit("R$", currDim, new LinearConverter(0.19), SymbolPosition.Prefix);
export const zar = new NamedUnit("R", currDim, new LinearConverter(0.054), SymbolPosition.Prefix);
export const dkk = new NamedUnit("kr", currDim, new LinearConverter(0.15), SymbolPosition.Suffix);
export const pln = new NamedUnit("z\u0142", currDim, new LinearConverter(0.25), SymbolPosition.Suffix);
export const twd = new NamedUnit("NT$", currDim, new LinearConverter(0.031), SymbolPosition.Prefix);
export const thb = new NamedUnit("\u0E3F", currDim, new LinearConverter(0.027), SymbolPosition.Prefix);
export const idr = new NamedUnit("Rp", currDim, new LinearConverter(0.000062), SymbolPosition.Prefix);
export const huf = new NamedUnit("Ft", currDim, new LinearConverter(0.0028), SymbolPosition.Suffix);
export const czk = new NamedUnit("K\u010D", currDim, new LinearConverter(0.043), SymbolPosition.Suffix);
export const ils = new NamedUnit("\u20AA", currDim, new LinearConverter(0.27), SymbolPosition.Prefix);
export const clp = new NamedUnit("$", currDim, new LinearConverter(0.0011), SymbolPosition.Prefix);
export const php = new NamedUnit("\u20B1", currDim, new LinearConverter(0.017), SymbolPosition.Prefix);
export const aed = new NamedUnit("AED", currDim, new LinearConverter(0.27), SymbolPosition.Prefix);
export const cop = new NamedUnit("$", currDim, new LinearConverter(0.00026), SymbolPosition.Prefix);
export const sar = new NamedUnit("SR", currDim, new LinearConverter(0.27), SymbolPosition.Prefix);
export const myr = new NamedUnit("RM", currDim, new LinearConverter(0.21), SymbolPosition.Prefix);
export const ron = new NamedUnit("lei", currDim, new LinearConverter(0.22), SymbolPosition.Suffix);
export const vnd = new NamedUnit("\u20AB", currDim, new LinearConverter(0.000039), SymbolPosition.Prefix);
export const ars = new NamedUnit("$", currDim, new LinearConverter(0.0011), SymbolPosition.Prefix);
export const btc = new NamedUnit("\u20BF", currDim, new LinearConverter(68000.0), SymbolPosition.Prefix);
export const eth = new NamedUnit("\u039E", currDim, new LinearConverter(3800.0), SymbolPosition.Prefix);

const CURRENCY_BY_CODE: Record<string, NamedUnit> = {
	USD: usd, EUR: eur, JPY: jpy, GBP: gbp, AUD: aud, CAD: cad,
	CHF: chf, CNY: cny, SEK: sek, NZD: nzd, MXN: mxn, SGD: sgd,
	HKD: hkd, NOK: nok, KRW: krw, TRY: turkishLira, INR: inr, RUB: rub,
	BRL: brl, ZAR: zar, DKK: dkk, PLN: pln, TWD: twd, THB: thb,
	IDR: idr, HUF: huf, CZK: czk, ILS: ils, CLP: clp, PHP: php,
	AED: aed, COP: cop, SAR: sar, MYR: myr, RON: ron, VND: vnd,
	ARS: ars, BTC: btc, ETH: eth,
};

export function resolveCurrency(code: string): NamedUnit | undefined {
	return CURRENCY_BY_CODE[code.toUpperCase()];
}

export const allCurrencies: Readonly<Record<string, NamedUnit>> = CURRENCY_BY_CODE;
