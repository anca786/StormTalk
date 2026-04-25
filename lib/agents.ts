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

// ═══════════════════════════════════════════
// AGENT 2: Vacation Finder
// ═══════════════════════════════════════════

export type VacationPreferences = {
  description: string;
  startDate?: string;
  endDate?: string;
};

export type SuggestedDestination = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  reason: string;
};

export function buildVacationFinderPrompt(preferences: VacationPreferences) {
  const dateInfo = preferences.startDate && preferences.endDate
    ? `Perioada: ${preferences.startDate} - ${preferences.endDate}`
    : "Perioada: flexibila";

  return `
Esti Vacation Finder-ul din aplicatia StormTalk - un agent AI care sugereaza destinatii de vacanta bazat pe preferintele meteo ale utilizatorului.

Preferintele utilizatorului: "${preferences.description}"
${dateInfo}

Sarcina ta: Sugereaza EXACT 4 destinatii de vacanta care se potrivesc cu preferintele.

Raspunde STRICT in format JSON, fara markdown, fara text suplimentar. Exact acest format:
[
  {"city": "Numele orasului", "country": "Tara", "latitude": 12.34, "longitude": 56.78, "reason": "Explicatie scurta in romana de ce se potriveste (max 30 cuvinte)"},
  ...
]

Reguli:
- Coordonatele trebuie sa fie REALE si PRECISE
- Alege orase din tari diferite daca e posibil
- Motivul trebuie sa fie legat de preferintele utilizatorului
- Raspunde DOAR cu JSON-ul, nimic altceva
`.trim();
}

export function buildVacationSummaryPrompt(
  destination: SuggestedDestination,
  forecast: { date: string; tempMax: number; tempMin: number; precipitation: number; weatherCode: number }[],
) {
  const forecastText = forecast
    .map((d) => `${d.date}: max ${d.tempMax}°C, min ${d.tempMin}°C, precipitatii ${d.precipitation}mm, cod_meteo: ${d.weatherCode}`)
    .join("\n");

  return `
Esti un ghid turistic prietenos din aplicatia StormTalk.
Raspunzi doar in romana, concis si util.

Destinatia: ${destination.city}, ${destination.country}
Motiv recomandat: ${destination.reason}

Prognoza meteo reala pentru aceasta destinatie:
${forecastText}

Scrie un paragraf scurt (max 80 cuvinte) care:
1. Descrie cum va fi vremea in aceasta perioada
2. Recomanda ce haine sa impacheteze
3. Sugereaza 1-2 activitati ideale pentru destinatie
Foloseste emoji-uri usor.
`.trim();
}

// ═══════════════════════════════════════════
// MULTI-PROVIDER AI (Gemini -> Groq Fallback)
// ═══════════════════════════════════════════

async function generateGeminiReply(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY lipseste");

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-goog-api-key": apiKey },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );

  if (!response.ok) throw new Error("Gemini API error");

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini invalid response");

  return text;
}

async function generateGroqReply(prompt: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY lipseste");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq API error text:", errorText);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    console.error("Groq invalid format, received:", JSON.stringify(data));
    throw new Error("Groq invalid response");
  }

  return text;
}

export async function generateIntelligentReply(prompt: string): Promise<{ text: string; provider: string }> {
  // Primul provider: Gemini
  try {
    const text = await generateGeminiReply(prompt);
    return { text, provider: "gemini" };
  } catch (error) {
    console.warn("Gemini a esuat, incercam Groq...", error instanceof Error ? error.message : error);
  }

  // Al doilea provider: Groq
  try {
    const text = await generateGroqReply(prompt);
    return { text, provider: "groq" };
  } catch (error) {
    console.warn("Groq a esuat si el.", error instanceof Error ? error.message : error);
    throw new Error("Toti providerii AI sunt offline sau limitele au fost atinse.");
  }
}

// Legacy exports for backward compatibility
export const buildMeteorologistPrompt = buildWeatherAdvisorPrompt;
export const buildLocalPrompt = buildWeatherAdvisorPrompt;
export type DebateAgentReply = AgentReply;
export function buildFallbackDebate(context: WeatherContext): AgentReply[] {
  return [{ role: "advisor", message: buildWeatherAdvisorFallback(context) }];
}
