import { NamedUnit, LinearConverter, SymbolPosition } from "./core.js";
import { currency as currDim } from "./dimensions.js";

export const usd = new NamedUnit("$", currDim, new LinearConverter(1.0), SymbolPosition.Prefix, "USD");
export const eur = new NamedUnit("\u20AC", currDim, new LinearConverter(1.08), SymbolPosition.Prefix, "EUR");
export const jpy = new NamedUnit("\u00A5", currDim, new LinearConverter(0.0064), SymbolPosition.Prefix, "JPY");
export const gbp = new NamedUnit("\u00A3", currDim, new LinearConverter(1.27), SymbolPosition.Prefix, "GBP");
export const aud = new NamedUnit("A$", currDim, new LinearConverter(0.66), SymbolPosition.Prefix, "AUD");
export const cad = new NamedUnit("C$", currDim, new LinearConverter(0.73), SymbolPosition.Prefix, "CAD");
export const chf = new NamedUnit("CHF", currDim, new LinearConverter(1.11), SymbolPosition.Prefix, "CHF");
export const cny = new NamedUnit("\u00A5", currDim, new LinearConverter(0.14), SymbolPosition.Prefix, "CNY");
export const sek = new NamedUnit("kr", currDim, new LinearConverter(0.094), SymbolPosition.Suffix, "SEK");
export const nzd = new NamedUnit("NZ$", currDim, new LinearConverter(0.61), SymbolPosition.Prefix, "NZD");
export const mxn = new NamedUnit("$", currDim, new LinearConverter(0.059), SymbolPosition.Prefix, "MXN");
export const sgd = new NamedUnit("S$", currDim, new LinearConverter(0.74), SymbolPosition.Prefix, "SGD");
export const hkd = new NamedUnit("HK$", currDim, new LinearConverter(0.13), SymbolPosition.Prefix, "HKD");
export const nok = new NamedUnit("kr", currDim, new LinearConverter(0.094), SymbolPosition.Suffix, "NOK");
export const krw = new NamedUnit("\u20A9", currDim, new LinearConverter(0.00073), SymbolPosition.Prefix, "KRW");
export const turkishLira = new NamedUnit("\u20BA", currDim, new LinearConverter(0.031), SymbolPosition.Prefix, "TRY");
export const inr = new NamedUnit("\u20B9", currDim, new LinearConverter(0.012), SymbolPosition.Prefix, "INR");
export const rub = new NamedUnit("\u20BD", currDim, new LinearConverter(0.011), SymbolPosition.Prefix, "RUB");
export const brl = new NamedUnit("R$", currDim, new LinearConverter(0.19), SymbolPosition.Prefix, "BRL");
export const zar = new NamedUnit("R", currDim, new LinearConverter(0.054), SymbolPosition.Prefix, "ZAR");
export const dkk = new NamedUnit("kr", currDim, new LinearConverter(0.15), SymbolPosition.Suffix, "DKK");
export const pln = new NamedUnit("z\u0142", currDim, new LinearConverter(0.25), SymbolPosition.Suffix, "PLN");
export const twd = new NamedUnit("NT$", currDim, new LinearConverter(0.031), SymbolPosition.Prefix, "TWD");
export const thb = new NamedUnit("\u0E3F", currDim, new LinearConverter(0.027), SymbolPosition.Prefix, "THB");
export const idr = new NamedUnit("Rp", currDim, new LinearConverter(0.000062), SymbolPosition.Prefix, "IDR");
export const huf = new NamedUnit("Ft", currDim, new LinearConverter(0.0028), SymbolPosition.Suffix, "HUF");
export const czk = new NamedUnit("K\u010D", currDim, new LinearConverter(0.043), SymbolPosition.Suffix, "CZK");
export const ils = new NamedUnit("\u20AA", currDim, new LinearConverter(0.27), SymbolPosition.Prefix, "ILS");
export const clp = new NamedUnit("$", currDim, new LinearConverter(0.0011), SymbolPosition.Prefix, "CLP");
export const php = new NamedUnit("\u20B1", currDim, new LinearConverter(0.017), SymbolPosition.Prefix, "PHP");
export const aed = new NamedUnit("AED", currDim, new LinearConverter(0.27), SymbolPosition.Prefix, "AED");
export const cop = new NamedUnit("$", currDim, new LinearConverter(0.00026), SymbolPosition.Prefix, "COP");
export const sar = new NamedUnit("SR", currDim, new LinearConverter(0.27), SymbolPosition.Prefix, "SAR");
export const myr = new NamedUnit("RM", currDim, new LinearConverter(0.21), SymbolPosition.Prefix, "MYR");
export const ron = new NamedUnit("lei", currDim, new LinearConverter(0.22), SymbolPosition.Suffix, "RON");
export const vnd = new NamedUnit("\u20AB", currDim, new LinearConverter(0.000039), SymbolPosition.Prefix, "VND");
export const ars = new NamedUnit("$", currDim, new LinearConverter(0.0011), SymbolPosition.Prefix, "ARS");
export const btc = new NamedUnit("\u20BF", currDim, new LinearConverter(68000.0), SymbolPosition.Prefix, "BTC");
export const eth = new NamedUnit("\u039E", currDim, new LinearConverter(3800.0), SymbolPosition.Prefix, "ETH");

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
