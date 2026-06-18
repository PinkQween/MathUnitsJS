# @pinkqween/mathunitsjs

A robust, type-safe dimensional analysis and physical units library in TypeScript. Define, compute, compare, and convert values across multiple dimensions with runtime safety and compile-time autocomplete support for prefixed units (SI and binary).

## Features

- **Type-safe Dimensions:** Prevent adding meters to seconds at compile-time and runtime.
- **Dynamic Prefix Macros:** Fully type-safe SI and Binary prefixed units (e.g. `meter.kilometer`, `byte.kibibyte`) with autocompletion support.
- **Unit Arithmetic:** Multiply, divide, exponentiate, or square root units to form derived units on-the-fly (e.g. `m/s`, `m/s^2`).
- **Physical Constants & Planck Scale:** Correct physical representations for constants like $c$, $\hbar$, $G$, $k_B$, and the Planck units.
- **Extensive Unit Registry:** Built-in support for Length, Time, Mass, Area, Volume, Force, Pressure, Energy, Power, Velocity, Acceleration, Electricity, Magnetism, Angles, and more.

---

## Installation

```bash
npm install @pinkqween/mathunitsjs
```
or
```bash
bun add @pinkqween/mathunitsjs
```

---

## Quick Start

### 1. Conversions
Convert values between units of the same dimension:

```typescript
import { Quantity, meter, kilometer, millimeter } from "@pinkqween/mathunitsjs";

// Convert 2.5 kilometers to meters
const length = new Quantity(2.5, kilometer);
console.log(length.valueIn(meter)); // 2500

// Convert to millimeter quantity
const mmQty = length.to(millimeter);
console.log(mmQty.toString()); // "2500000 mm"
```

### 2. Math Operations
Perform addition, subtraction, multiplication, and division:

```typescript
import { Quantity, meter, second } from "@pinkqween/mathunitsjs";

const d1 = new Quantity(500, meter);
const d2 = new Quantity(1.5, meter.kilometer); // kilometer prefix

// Add quantities (returns a Quantity in the unit of the left operand)
const total = d1.add(d2); 
console.log(total.toString()); // "2000 m"

// Multiply/Divide by scalars
const halved = total.divide(2);
console.log(halved.toString()); // "1000 m"
```

### 3. Comparisons
Compare physical values across compatible units:

```typescript
import { Quantity, meter, kilometer } from "@pinkqween/mathunitsjs";

const q1 = new Quantity(1, kilometer);
const q2 = new Quantity(1000, meter);
const q3 = new Quantity(2, kilometer);

console.log(q1.equals(q2)); // true
console.log(q1.lessThan(q3)); // true
console.log(q3.greaterThan(q1)); // true
```

---

## Derived Units and Algebra

Create derived units on the fly by multiplying and dividing existing ones:

```typescript
import { meter, second, LinearUnit, Quantity } from "@pinkqween/mathunitsjs";

// Derive Speed (m/s)
const meterPerSecond = meter.divide(second);

// Derive Acceleration (m/s^2)
const gravityAccel = meterPerSecond.divide(second);

// Use in Quantity calculations
const speed = new Quantity(10, meterPerSecond);
console.log(speed.toString()); // "10 m/s"
```

---

## Prefix Configurations

Units defined with prefixes (via `createPrefixedUnits`) automatically have SI or binary prefix units available as properties:

```typescript
import { meter, byte } from "@pinkqween/mathunitsjs";

// SI Prefixes (kilo, milli, micro, nano, etc.)
console.log(meter.kilometer.symbol); // "km"
console.log(meter.millimeter.symbol); // "mm"

// Binary Prefixes (kibi, mebi, gibi, etc. supported on Data units)
console.log(byte.kibibyte.symbol); // "KiB" (1024 B)
console.log(byte.mebibyte.symbol); // "MiB" (1048576 B)
```

---

## Physical Constants & Planck Units

Predefined dimensions and units representing physical laws of nature:

```typescript
import { length as planckLength, time as planckTime, c, hbar, G } from "@pinkqween/mathunitsjs";

// Speed of Light, Planck Constant, Gravitation
console.log(c.symbol); // "c"
console.log(hbar.symbol); // "ℏ"
console.log(G.symbol); // "G"

// Natural/Planck units are derived via constants
// Planck length: sqrt(hbar * G / c^3)
console.log(planckLength.symbol); // "sqrt(((Action*Gravitation)/(SpeedOfLight^3)))"
```

---

## License

MIT License
