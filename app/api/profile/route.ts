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
    .from("profiles")
    .select("*")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Nu am putut prelua profilul utilizatorului." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    profile:
      data ?? {
        user_id: auth.user.id,
        display_name: auth.user.user_metadata?.name ?? "",
        preferred_unit: "C",
      },
  });
}

export async function PUT(request: NextRequest) {
  const auth = await getAuthenticatedUser(request);

  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const server = requireSupabaseServer();

  if ("error" in server) {
    return NextResponse.json({ error: server.error }, { status: server.status });
  }

  const body = (await request.json()) as {
    display_name?: string;
    preferred_unit?: "C" | "F";
  };

  const payload = {
    user_id: auth.user.id,
    display_name: body.display_name?.trim() ?? auth.user.user_metadata?.name ?? "",
    preferred_unit: body.preferred_unit === "F" ? "F" : "C",
  };

  const { data, error } = await server.supabase
    .from("profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Nu am putut salva profilul utilizatorului." },
      { status: 500 },
    );
  }

  return NextResponse.json({ profile: data });
}
