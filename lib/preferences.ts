export const UNIT_STORAGE_KEY = "stormtalk-preferred-unit";

export type PreferredUnit = "C" | "F";

export function normalizePreferredUnit(value: string | null | undefined): PreferredUnit {
  return value === "F" ? "F" : "C";
}

export function preferredUnitToWeatherApi(unit: PreferredUnit) {
  return unit === "F" ? "fahrenheit" : "celsius";
}
