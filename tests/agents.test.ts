import { describe, expect, it } from "vitest";
import {
  buildWeatherAdvisorPrompt,
  buildVacationFinderPrompt,
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
  it("builds the weather advisor prompt with accurate weather context", () => {
    const prompt = buildWeatherAdvisorPrompt(weatherContext);

    expect(prompt).toContain("Esti Weather Advisor-ul din aplicatia StormTalk");
    expect(prompt).toContain("Raspunzi doar in limba romana");
    expect(prompt).toContain("temperature_2m: 18.4");
    expect(prompt).toContain("wind_speed_10m: 16.7");
  });

  it("builds the vacation finder prompt with preferences", () => {
    const prompt = buildVacationFinderPrompt({
      description: "Vreau sa merg undeva la caldura, pe o plaja superba.",
    });

    expect(prompt).toContain("Esti Vacation Finder-ul din aplicatia StormTalk");
    expect(prompt).toContain("Vreau sa merg undeva la caldura");
    expect(prompt).toContain("Raspunde STRICT in format JSON");
    expect(prompt).toContain("Perioada: flexibila");
  });
});
