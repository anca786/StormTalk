import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, requireSupabaseServer } from "@/lib/supabase/api";

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedUser(request);

  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const server = requireSupabaseServer();

  if ("error" in server) {
    return NextResponse.json({ error: server.error }, { status: server.status });
  }

  const { data, error } = await server.supabase
    .from("history")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json(
      { error: "Nu am putut prelua istoricul utilizatorului." },
      { status: 500 },
    );
  }

  return NextResponse.json({ history: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthenticatedUser(request);

  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const server = requireSupabaseServer();

  if ("error" in server) {
    return NextResponse.json({ error: server.error }, { status: server.status });
  }

  const body = (await request.json()) as {
    latitude?: number;
    longitude?: number;
    weather_payload?: Record<string, unknown>;
    ai_conversation?: unknown[];
  };

  if (
    typeof body.latitude !== "number" ||
    typeof body.longitude !== "number" ||
    !body.weather_payload ||
    !body.ai_conversation
  ) {
    return NextResponse.json(
      { error: "Payload invalid pentru istoric." },
      { status: 400 },
    );
  }

  const { data, error } = await server.supabase
    .from("history")
    .insert({
      user_id: auth.user.id,
      latitude: body.latitude,
      longitude: body.longitude,
      weather_payload: body.weather_payload,
      ai_conversation: body.ai_conversation,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Nu am putut salva istoricul." },
      { status: 500 },
    );
  }

  return NextResponse.json({ history: data });
}
