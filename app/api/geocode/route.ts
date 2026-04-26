import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "6");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Nu am putut cauta locatia." },
        { status: 502 },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      results: (data.results ?? []).map(
        (item: {
          id?: number;
          name?: string;
          country?: string;
          admin1?: string;
          latitude: number;
          longitude: number;
        }) => ({
          id: item.id ?? `${item.latitude}-${item.longitude}`,
          name: item.name ?? "Locatie",
          country: item.country ?? "",
          admin1: item.admin1 ?? "",
          latitude: item.latitude,
          longitude: item.longitude,
        }),
      ),
    });
  } catch {
    return NextResponse.json(
      { error: "A aparut o eroare la cautarea locatiei." },
      { status: 500 },
    );
  }
}
