# @pinkqween/mathunitsjs

A robust, type-safe dimensional analysis and physical units library in TypeScript. Define, compute, compare, and convert values across multiple dimensions with runtime safety and compile-time autocomplete support for prefixed units (SI and binary).

Works in **browsers**, **Node.js**, and **Bun** — ships both ESM and CommonJS builds.

## Features

- **Exponent-based Dimensional Analysis** — `PhysicalDimension` with integer exponents (`{length: 1, time: -2}`), matching the architecture of the Swift reference implementation.
- **Type-safe Dimensions:** Prevent adding meters to seconds at runtime.
- **Dynamic Prefix Macros:** Fully type-safe SI and Binary prefixed units (e.g. `meter.kilometer`, `byte.kibibyte`) with autocompletion support.
- **Unit Algebra:** Multiply, divide, exponentiate, or square root units to form derived units on-the-fly (e.g. `m/s`, `m/s^2`).
- **Quantity Algebra:** Multiply/divide quantities to get composite units (`mass * acceleration = force`).
- **Temperature with Offset Converters:** Celsius, Fahrenheit, Kelvin, Rankine — all conversions work, including cross-system.
- **38 Currencies:** ISO 4217 codes with `resolveCurrency()` lookup.
- **Planck Units:** Base SI and Planck-scale constants with proper conversion factors.
- **Formatting:** `formatted(decimalPlaces, includeSpace)` with prefix/suffix symbol positioning (e.g. `$10.12`, `5.50 m`, `100 kr`).
- **Thermal Energy:** `quantity.thermalEnergy` converts temperature to energy via Boltzmann's constant.
- **Dual-format Build:** ESM + CommonJS via tsup.

## Installation

```bash
npm install @pinkqween/mathunitsjs
# or
bun add @pinkqween/mathunitsjs
```

## Quick Start

### Conversions

```typescript
import { Quantity, meter, kilometer, millimeter } from "@pinkqween/mathunitsjs";

const length = new Quantity(2.5, kilometer);
console.log(length.valueIn(meter));    // 2500
console.log(length.to(millimeter).toString()); // "2500000.00 mm"
```

### Temperature (with offset converters)

```typescript
import { Quantity, celsius, fahrenheit, kelvin } from "@pinkqween/mathunitsjs";

const boiling = new Quantity(100.0, celsius);
console.log(boiling.converted(fahrenheit).formatted()); // "212.00 °F"
console.log(boiling.converted(kelvin).formatted());     // "373.15 K"
```

### Math Operations

```typescript
import { Quantity, meter, second, kilogram, CompositeUnit, LinearConverter } from "@pinkqween/mathunitsjs";
import { acceleration as accelDim } from "@pinkqween/mathunitsjs";

const d1 = new Quantity(500, meter);
const d2 = new Quantity(1.5, meter.kilometer);

// Add quantities (converts to left operand's unit)
const total = d1.add(d2);
console.log(total.formatted()); // "2000.00 m"

// Multiply quantities to get composite units
const distance = new Quantity(100, meter);
const time = new Quantity(5, second);
const speed = distance.divide(time);
console.log(speed.formatted()); // "20.00 (m/s)"

// Mass * Acceleration = Force
const accel = new Quantity(9.81, new CompositeUnit("m/s²", accelDim, new LinearConverter(1)));
const force = new Quantity(80, kilogram).multiply(accel);
console.log(force.formatted()); // "784.80 (kg*m/s²)"
```

### Comparisons

```typescript
import { Quantity, meter, kilometer } from "@pinkqween/mathunitsjs";

const q1 = new Quantity(1, kilometer);
const q2 = new Quantity(1000, meter);
const q3 = new Quantity(2, kilometer);

console.log(q1.equals(q2));      // true
console.log(q1.lessThan(q3));    // true
console.log(q3.greaterThan(q1)); // true
```

### Currency

```typescript
import { Quantity, usd, eur, resolveCurrency } from "@pinkqween/mathunitsjs";

const price = new Quantity(10, eur);
console.log(price.converted(usd).formatted()); // "$10.80"

const btc = resolveCurrency("BTC");
console.log(new Quantity(1, btc).converted(usd).formatted()); // "$68000.00"
```

### Formatting

```typescript
import { Quantity, usd, meter, percent } from "@pinkqween/mathunitsjs";

console.log(new Quantity(10.5, usd).formatted());          // "$10.50"
console.log(new Quantity(5.5, meter).formatted(1));        // "5.5 m"
console.log(new Quantity(75.5, percent).formatted(1));     // "75.5%"
console.log(new Quantity(100, usd).formatted(0, true));    // "$ 100"
```

### Prefix Configurations

```typescript
import { meter, byte, bit } from "@pinkqween/mathunitsjs";

console.log(meter.kilometer.symbol);    // "km"
console.log(meter.millimeter.symbol);   // "mm"
console.log(byte.gigabyte.symbol);      // "Gb"
console.log(byte.gibibyte.symbol);      // "GiB"
console.log(bit.mebibit.symbol);        // "Mib"
```

## Available Units

| Category | Units |
|----------|-------|
| **Length** | meter, kilometer, millimeter, inch, foot, yard, mile, parsec, light-year, astronomical unit, angstrom, and 15 more |
| **Time** | second, minute, hour, day, week, year, jiffy, shake, svedberg, and more |
| **Mass** | gram, kilogram, pound, ounce, stone, slug, carat, dalton, solar mass, and more |
| **Temperature** | kelvin, celsius, fahrenheit, rankine (with offset converters) |
| **Force** | newton, dyne, pound-force, kilogram-force, kip |
| **Pressure** | pascal, bar, atmosphere, psi, torr, mmHg, inHg |
| **Energy** | joule, calorie, BTU, electron-volt, foot-pound, watt-hour, hartree |
| **Power** | watt, horsepower |
| **Speed** | m/s, km/h, mph, knot, speed of light |
| **Electricity** | ampere, coulomb, volt, ohm, farad, henry, siemens |
| **Magnetism** | tesla, gauss, weber, maxwell |
| **Radiation** | becquerel, curie, gray, rad, sievert, rem |
| **Data** | bit, byte (with SI + binary prefixes) |
| **Volume** | liter, cup, pint, quart, gallon, tablespoon, teaspoon, barrel, and more |
| **Area** | m², acre, hectare, barn |
| **Currency** | 38 currencies (USD, EUR, JPY, GBP, BTC, ETH, and more) |
| **Dimensionless** | %, ppm, ppb, radian, degree, gradian, arcminute, arcsecond |
| **Photometry** | candela, lumen, lux, foot-candle |

All prefixed units support SI prefixes (quetta through quecto) and data units also support binary prefixes (kibi through yobi).

## License

MIT License
