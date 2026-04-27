import { NextRequest, NextResponse } from "next/server";
import {
  buildWeatherAdvisorFallback,
  buildWeatherAdvisorPrompt,
  generateIntelligentReply,
  type WeatherContext,
} from "@/lib/agents";

type RequestBody = {
  weather: WeatherContext;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body?.weather?.current) {
      return NextResponse.json(
        { error: "Payload-ul weather este obligatoriu." },
        { status: 400 },
      );
    }

    const prompt = buildWeatherAdvisorPrompt(body.weather);

    try {
      const response = await generateIntelligentReply(prompt);

      return NextResponse.json({
        mode: response.provider,
        agent: "advisor",
        message: response.text,
      });
    } catch (error) {
      const fallbackMessage = buildWeatherAdvisorFallback(body.weather);
      const warning =
        error instanceof Error
          ? error.message
          : "Niciun provider AI nu a putut raspunde.";

      return NextResponse.json({
        mode: "fallback",
        agent: "advisor",
        message: fallbackMessage,
        warning,
      });
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "A aparut o eroare la generarea analizei.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
