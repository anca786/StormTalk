export function normalizeWeatherUnit(unit: string) {
  return unit
    .replaceAll("Â°C", "C")
    .replaceAll("°C", "C")
    .replaceAll("Â°", "deg")
    .replaceAll("°", "deg");
}

export function normalizeWeatherUnits(
  units: Record<string, string> | undefined,
) {
  if (!units) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(units).map(([key, value]) => [key, normalizeWeatherUnit(value)]),
  );
}
