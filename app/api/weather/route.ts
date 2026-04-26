import { NextRequest, NextResponse } from "next/server";
import { normalizeWeatherUnits } from "@/lib/weather";

const CURRENT_WEATHER_FIELDS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "precipitation",
  "rain",
  "showers",
  "snowfall",
  "cloud_cover",
  "pressure_msl",
  "surface_pressure",
  "wind_speed_10m",
  "wind_direction_10m",
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const unit = searchParams.get("unit");

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Parametrii latitude si longitude sunt obligatorii." },
      { status: 400 },
    );
  }

  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (
    Number.isNaN(parsedLatitude) ||
    Number.isNaN(parsedLongitude) ||
    parsedLatitude < -90 ||
    parsedLatitude > 90 ||
    parsedLongitude < -180 ||
    parsedLongitude > 180
  ) {
    return NextResponse.json(
      { error: "Coordonatele sunt invalide." },
      { status: 400 },
    );
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("current", CURRENT_WEATHER_FIELDS.join(","));
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("temperature_unit", unit === "fahrenheit" ? "fahrenheit" : "celsius");

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Nu am putut prelua datele meteo din Open-Meteo." },
        { status: 502 },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      source: "open-meteo",
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      current: data.current,
      current_units: normalizeWeatherUnits(data.current_units),
    });
  } catch {
    return NextResponse.json(
      { error: "A aparut o eroare la conectarea cu serviciul meteo." },
      { status: 500 },
    );
  }
}
