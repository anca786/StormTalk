import { describe, expect, it } from "vitest";
import {
  buildVacationFinderPrompt,
  buildVacationSummaryPrompt,
  buildWeatherAdvisorPrompt,
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
  it("builds the weather advisor prompt in romanian with weather values", () => {
    const prompt = buildWeatherAdvisorPrompt(weatherContext);

    expect(prompt).toContain("Esti Weather Advisor-ul");
    expect(prompt).toContain("Raspunzi doar in limba romana");
    expect(prompt).toContain("temperature_2m: 18.4");
    expect(prompt).toContain("wind_speed_10m: 16.7");
  });

  it("builds the vacation finder prompt as strict JSON instruction", () => {
    const prompt = buildVacationFinderPrompt({
      description: "vreau o vacanta calda la plaja",
      startDate: "2026-07-01",
      endDate: "2026-07-07",
    });

    expect(prompt).toContain("Esti Vacation Finder-ul");
    expect(prompt).toContain("Sugereaza EXACT 4 destinatii");
    expect(prompt).toContain("Raspunde STRICT in format JSON");
    expect(prompt).toContain("Perioada: 2026-07-01 - 2026-07-07");
  });

  it("builds the vacation summary prompt with real forecast context", () => {
    const prompt = buildVacationSummaryPrompt(
      {
        city: "Barcelona",
        country: "Spania",
        latitude: 41.39,
        longitude: 2.17,
        reason: "Climat mediteranean potrivit pentru plaja.",
      },
      [{ date: "2026-07-01", tempMax: 29, tempMin: 21, precipitation: 0, weatherCode: 0 }],
    );

    expect(prompt).toContain("Esti un ghid turistic prietenos");
    expect(prompt).toContain("Destinatia: Barcelona, Spania");
    expect(prompt).toContain("2026-07-01: max 29");
  });
});
