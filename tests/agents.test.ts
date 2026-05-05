import { describe, expect, it } from "vitest";
import {
  buildLocalPrompt,
  buildMeteorologistPrompt,
  type WeatherContext,
} from "../lib/agents";

const weatherContext: WeatherContext = {
  latitude: 44.4268,
  longitude: 26.1025,
  timezone: "Europe/Bucharest",
  current: {
    temperature_2m: 18.4,
    relative_humidity_2m: 55,
    pressure_msl: 1015.2,
    wind_speed_10m: 16.7,
  },
  current_units: {
    temperature_2m: "°C",
    relative_humidity_2m: "%",
    pressure_msl: "hPa",
    wind_speed_10m: "km/h",
  },
};

describe("agent prompts", () => {
  it("builds the meteorologist prompt in romanian with weather values", () => {
    const prompt = buildMeteorologistPrompt(weatherContext);

    expect(prompt).toContain("Esti Meteorologul");
    expect(prompt).toContain("Raspunzi doar in limba romana");
    expect(prompt).toContain("temperature_2m: 18.4");
    expect(prompt).toContain("wind_speed_10m: 16.7");
  });

  it("builds the local prompt in romanian with practical guidance context", () => {
    const prompt = buildLocalPrompt(weatherContext);

    expect(prompt).toContain("Esti Localnicul");
    expect(prompt).toContain("Vorbeste natural si practic");
    expect(prompt).toContain("pressure_msl: 1015.2");
    expect(prompt).toContain("Coordonate: 44.4268, 26.1025");
  });
});
