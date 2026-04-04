export type WeatherContext = {
  latitude: number;
  longitude: number;
  timezone?: string;
  current: Record<string, string | number | null>;
  current_units?: Record<string, string>;
};

export type AgentReply = {
  role: "advisor" | "vacation";
  message: string;
};

function formatWeatherContext(context: WeatherContext) {
  const entries = Object.entries(context.current)
    .map(([key, value]) => {
      const unit = context.current_units?.[key];
      return `${key}: ${value}${unit ? ` ${unit}` : ""}`;
    })
    .join("\n");

  return [
    `Coordonate: ${context.latitude}, ${context.longitude}`,
    `Fus orar: ${context.timezone ?? "necunoscut"}`,
    "Parametri meteo curenti:",
    entries,
  ].join("\n");
}

function metric(
  context: WeatherContext,
  key: string,
  fallback: string,
) {
  const value = context.current[key];
  const unit = context.current_units?.[key];

  if (value === null || value === undefined) {
    return fallback;
  }

  return `${value}${unit ? ` ${unit}` : ""}`;
}

// ═══════════════════════════════════════════
// AGENT 1: Weather Advisor
// ═══════════════════════════════════════════

export function buildWeatherAdvisorPrompt(context: WeatherContext) {
  return `
Esti Weather Advisor-ul din aplicatia StormTalk - un asistent meteo prietenos si practic.
Raspunzi doar in limba romana, natural si conversational.

Sarcina ta:
1. Explica pe scurt cum este vremea acum (temperatura, vant, umiditate, precipitatii)
2. Da recomandari CONCRETE de imbracaminte (ex: "poarta un tricou usor si pantaloni scurti" sau "ia o geaca groasa si fular")
3. Mentioneaza daca e nevoie de umbrela, ochelari de soare, crema solara, etc.
4. Sugereaza 1-2 activitati potrivite pentru aceasta vreme
5. Adauga un sfat practic sau o observatie interesanta despre clima zonei

Reguli: Nu inventa date. Fii concis (max 150 cuvinte). Foloseste emoji-uri usor.

${formatWeatherContext(context)}
`.trim();
}

export function buildWeatherAdvisorFallback(context: WeatherContext): string {
  const temperature = metric(context, "temperature_2m", "N/A");
  const apparent = metric(context, "apparent_temperature", "N/A");
  const humidity = metric(context, "relative_humidity_2m", "N/A");
  const wind = metric(context, "wind_speed_10m", "N/A");
  const precipitation = metric(context, "precipitation", "0 mm");
  const cloudCover = metric(context, "cloud_cover", "N/A");

  const tempNum = Number(context.current["temperature_2m"]) || 20;

  let clothing: string;
  if (tempNum > 30) {
    clothing = "👕 Poarta haine lejere, tricou si pantaloni scurti. Nu uita crema solara si apa!";
  } else if (tempNum > 20) {
    clothing = "👔 O tinuta usoara e perfecta. Un tricou cu pantaloni lungi sau scurti, dupa preferinta.";
  } else if (tempNum > 10) {
    clothing = "🧥 Ia o geaca usoara sau un hanorac. Straturile sunt ideale.";
  } else if (tempNum > 0) {
    clothing = "🧣 E frig! Geaca groasa, fular si manusi. Imbracamintea in straturi e esentiala.";
  } else {
    clothing = "🥶 E foarte frig! Haine groase, cagula, manusi si cizme de iarna.";
  }

  return [
    `📍 Coordonate: ${context.latitude}, ${context.longitude}`,
    `🌡️ Temperatura: ${temperature} (se simte ca ${apparent})`,
    `💧 Umiditate: ${humidity} | 💨 Vant: ${wind}`,
    `☁️ Nori: ${cloudCover} | 🌧️ Precipitatii: ${precipitation}`,
    "",
    clothing,
    "",
    "ℹ️ Aceasta analiza este generata automat pe baza datelor meteo reale.",
  ].join("\n");
}

