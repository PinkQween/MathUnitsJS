import { PhysicalDimension } from "./core.js";

// SI Base
export const dimensionless = new PhysicalDimension();
export const length = new PhysicalDimension({ length: 1 });
export const mass = new PhysicalDimension({ mass: 1 });
export const time = new PhysicalDimension({ time: 1 });
export const electricCurrent = new PhysicalDimension({ electricCurrent: 1 });
export const amountOfSubstance = new PhysicalDimension({ amountOfSubstance: 1 });
export const luminousIntensity = new PhysicalDimension({ luminousIntensity: 1 });
export const data = new PhysicalDimension({ data: 1 });
export const temperature = new PhysicalDimension({ temperature: 1 });
export const currency = new PhysicalDimension({ currency: 1 });

// Derived
export const area = new PhysicalDimension({ length: 2 });
export const volume = new PhysicalDimension({ length: 3 });
export const frequency = new PhysicalDimension({ time: -1 });
export const speed = new PhysicalDimension({ length: 1, time: -1 });
export const acceleration = new PhysicalDimension({ length: 1, time: -2 });
export const force = new PhysicalDimension({ mass: 1, length: 1, time: -2 });
export const energy = new PhysicalDimension({ mass: 1, length: 2, time: -2 });
export const power = new PhysicalDimension({ mass: 1, length: 2, time: -3 });
export const pressure = new PhysicalDimension({ mass: 1, length: -1, time: -2 });
export const charge = new PhysicalDimension({ time: 1, electricCurrent: 1 });
export const voltage = new PhysicalDimension({ mass: 1, length: 2, time: -3, electricCurrent: -1 });
export const resistance = new PhysicalDimension({ mass: 1, length: 2, time: -3, electricCurrent: -2 });
export const capacitance = new PhysicalDimension({ mass: -1, length: -2, time: 4, electricCurrent: 2 });
export const inductance = new PhysicalDimension({ mass: 1, length: 2, time: -2, electricCurrent: -2 });
export const conductance = new PhysicalDimension({ mass: -1, length: -2, time: 3, electricCurrent: 2 });
export const magneticFlux = new PhysicalDimension({ mass: 1, length: 2, time: -2, electricCurrent: -1 });
export const magneticField = new PhysicalDimension({ mass: 1, time: -2, electricCurrent: -1 });
export const specificEnergy = new PhysicalDimension({ length: 2, time: -2 });
export const luminousFlux = new PhysicalDimension({ luminousIntensity: 1 });
export const illuminance = new PhysicalDimension({ luminousIntensity: 1, length: -2 });
