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
    .from("favorites")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Nu am putut prelua favoritele utilizatorului." },
      { status: 500 },
    );
  }

  return NextResponse.json({ favorites: data ?? [] });
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
    label?: string;
    latitude?: number;
    longitude?: number;
  };

  if (
    !body.label ||
    typeof body.latitude !== "number" ||
    typeof body.longitude !== "number"
  ) {
    return NextResponse.json(
      { error: "Payload invalid pentru favorite." },
      { status: 400 },
    );
  }

  const { data, error } = await server.supabase
    .from("favorites")
    .insert({
      user_id: auth.user.id,
      label: body.label.trim(),
      latitude: body.latitude,
      longitude: body.longitude,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Nu am putut salva favoritul." },
      { status: 500 },
    );
  }

  return NextResponse.json({ favorite: data });
}
