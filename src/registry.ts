import { NamedUnit, Quantity } from "./core.js";
import * as units from "./units.js";
import * as volume from "./volume.js";
import * as currency from "./currency.js";

const unitRegistry = new Map<string, NamedUnit>();

function reg(unit: NamedUnit) {
	unitRegistry.set(unit.id, unit);
}

function regAll(obj: Record<string, unknown>) {
	for (const val of Object.values(obj)) {
		if (val instanceof NamedUnit) {
			reg(val);
			// register prefixed variants (properties on the NamedUnit object)
			for (const child of Object.values(val as unknown as Record<string, unknown>)) {
				if (child instanceof NamedUnit && child.id !== val.id) {
					reg(child);
				}
			}
		}
	}
}

// Register all units
regAll(units as unknown as Record<string, unknown>);
regAll(volume as unknown as Record<string, unknown>);
regAll(currency as unknown as Record<string, unknown>);

export function getUnit(id: string): NamedUnit | undefined {
	return unitRegistry.get(id);
}

export function deserialize(data: { value: number; unitId: string }): Quantity {
	const unit = unitRegistry.get(data.unitId);
	if (!unit) throw new Error(`Unknown unit id: "${data.unitId}". Available unit ids: ${[...unitRegistry.keys()].sort().join(", ")}`);
	return new Quantity(data.value, unit);
}

export const allUnits: ReadonlyMap<string, NamedUnit> = unitRegistry;
