import { NextRequest, NextResponse } from "next/server";
import {
  buildVacationFinderPrompt,
  buildVacationSummaryPrompt,
  generateIntelligentReply,
  type SuggestedDestination,
  type VacationPreferences,
} from "@/lib/agents";

type ForecastDay = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  weatherCode: number;
};

async function fetchForecast(
  latitude: number,
  longitude: number,
  startDate?: string,
  endDate?: string,
): Promise<ForecastDay[]> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
    timezone: "auto",
  });

  if (startDate && endDate) {
    params.set("start_date", startDate);
    params.set("end_date", endDate);
  } else {
    params.set("forecast_days", "7");
  }

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const daily = data?.daily;

  if (!daily?.time) {
    return [];
  }

  return daily.time.map((date: string, i: number) => ({
    date,
    tempMax: daily.temperature_2m_max?.[i] ?? 0,
    tempMin: daily.temperature_2m_min?.[i] ?? 0,
    precipitation: daily.precipitation_sum?.[i] ?? 0,
    weatherCode: daily.weather_code?.[i] ?? 0,
  }));
}

function weatherCodeToDescription(code: number): string {
  if (code === 0) return "Senin ☀️";
  if (code <= 3) return "Partial innorat ⛅";
  if (code <= 48) return "Ceata 🌫️";
  if (code <= 57) return "Burniță 🌦️";
  if (code <= 67) return "Ploaie 🌧️";
  if (code <= 77) return "Ninsoare 🌨️";
  if (code <= 82) return "Averse 🌧️";
  if (code <= 86) return "Viscol ❄️";
  if (code <= 99) return "Furtuna ⛈️";
  return "Necunoscut";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VacationPreferences;

    if (!body?.description?.trim()) {
      return NextResponse.json(
        { error: "Descrie ce tip de vacanta iti doresti." },
        { status: 400 },
      );
    }

    // Step 1: Ask AI to suggest destinations
    const finderPrompt = buildVacationFinderPrompt(body);
    let destinations: SuggestedDestination[] = [];

    try {
      const { text: rawResponse } = await generateIntelligentReply(finderPrompt);

      // Parse JSON from response (handle markdown code blocks)
      const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        destinations = JSON.parse(jsonMatch[0]) as SuggestedDestination[];
      }
      
      // Dacă a returnat array gol sau incorect, forțăm eroarea ca să intre în catch
      if (!destinations || destinations.length === 0) {
        throw new Error("Invalid response format");
      }
    } catch {
      // Fallback destinations if AI fails
      const text = body.description.toLowerCase();
      const isWinter = text.includes("ning") || text.includes("aurora") || text.includes("zapada") || text.includes("frig") || text.includes("iarna") || text.includes("schi");
      const isAsia = text.includes("asia") || text.includes("tailanda") || text.includes("bali");

      if (isWinter) {
        destinations = [
          { city: "Tromsø", country: "Norvegia", latitude: 69.64, longitude: 18.95, reason: "Ales in modul de rezerva. Locatie excelenta pentru aurora boreala si zapada abundenta." },
          { city: "Reykjavik", country: "Islanda", latitude: 64.14, longitude: -21.92, reason: "Ales in modul de rezerva. Peisaje inghetate de basm, izvoare termale si sanse de aurora." },
          { city: "Rovaniemi", country: "Finlanda", latitude: 66.50, longitude: 25.72, reason: "Ales in modul de rezerva. Orasul lui Mos Craciun, zapada garantata si atmosfera magica." },
          { city: "Innsbruck", country: "Austria", latitude: 47.26, longitude: 11.39, reason: "Ales in modul de rezerva. Paradis al sporturilor de iarna, inconjurat de Alpi." },
        ];
      } else if (isAsia) {
        destinations = [
          { city: "Bali", country: "Indonezia", latitude: -8.40, longitude: 115.18, reason: "Ales in modul de rezerva. Plaje exotice, temple antice si cultura vibranta in Asia." },
          { city: "Phuket", country: "Thailanda", latitude: 7.88, longitude: 98.39, reason: "Ales in modul de rezerva. Clima tropicala, insule spectaculoase si mancare thailandeza." },
          { city: "Kyoto", country: "Japonia", latitude: 35.01, longitude: 135.76, reason: "Ales in modul de rezerva. Cultura asiatica, temple zen si o atmosfera foarte relaxanta." },
          { city: "Palawan", country: "Filipine", latitude: 9.83, longitude: 118.73, reason: "Ales in modul de rezerva. Apa cristalina, lagune ascunse si plaje de vis din Asia." },
        ];
      } else {
        destinations = [
          { city: "Barcelona", country: "Spania", latitude: 41.39, longitude: 2.17, reason: "Ales in modul de rezerva. Climat mediteranean ideal, plaje frumoase si cultura bogata." },
          { city: "Santorini", country: "Grecia", latitude: 36.39, longitude: 25.46, reason: "Ales in modul de rezerva. Apusuri spectaculoase, vreme calda si arhitectura unica." },
          { city: "Lisabona", country: "Portugalia", latitude: 38.72, longitude: -9.14, reason: "Ales in modul de rezerva. Temperaturi placute, bucatarie excelenta si atmosfera relaxata." },
          { city: "Dubrovnik", country: "Croatia", latitude: 42.65, longitude: 18.09, reason: "Ales in modul de rezerva. Coasta superba, apa cristalina si cetate medievala." },
        ];
      }
    }

    // Step 2: Fetch real weather forecasts for each destination
    const results = await Promise.all(
      destinations.map(async (dest) => {
        const forecast = await fetchForecast(
          dest.latitude,
          dest.longitude,
          body.startDate,
          body.endDate,
        );

        // Step 3: Generate AI summary for each destination
        let summary = "";
        try {
          const summaryPrompt = buildVacationSummaryPrompt(dest, forecast);
          const response = await generateIntelligentReply(summaryPrompt);
          summary = response.text;
        } catch {
          // Fallback summary
          if (forecast.length > 0) {
            const avgMax = Math.round(forecast.reduce((s, d) => s + d.tempMax, 0) / forecast.length);
            const avgMin = Math.round(forecast.reduce((s, d) => s + d.tempMin, 0) / forecast.length);
            summary = `Temperaturi intre ${avgMin}°C si ${avgMax}°C. ${dest.reason}`;
          } else {
            summary = dest.reason;
          }
        }

        return {
          ...dest,
          forecast: forecast.map((d) => ({
            ...d,
            description: weatherCodeToDescription(d.weatherCode),
          })),
          summary,
        };
      }),
    );

    return NextResponse.json({ destinations: results });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Eroare la cautarea destinatiilor.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
