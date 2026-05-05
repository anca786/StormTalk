import { describe, expect, it } from "vitest";
import { normalizeWeatherUnit, normalizeWeatherUnits } from "../lib/weather";

describe("weather helpers", () => {
  it("normalizes degree units to ascii-safe variants", () => {
    expect(normalizeWeatherUnit("°C")).toBe("C");
    expect(normalizeWeatherUnit("Â°")).toBe("deg");
  });

  it("normalizes all units in the payload", () => {
    expect(
      normalizeWeatherUnits({
        temperature_2m: "°C",
        wind_direction_10m: "°",
      }),
    ).toEqual({
      temperature_2m: "C",
      wind_direction_10m: "deg",
    });
  });
});
