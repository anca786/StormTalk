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

export function formatMetricSafe(value: string | number | null | undefined, unit?: string) {
  if (value === null || value === undefined) return 'N/A';
  const safeUnit = unit ? normalizeWeatherUnit(unit) : '';
  return `${value}${safeUnit ? ` ${safeUnit}` : ''}`;
}
