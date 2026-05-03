import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, requireSupabaseServer } from "@/lib/supabase/api";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: NextRequest, context: Context) {
  const auth = await getAuthenticatedUser(request);

  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const server = requireSupabaseServer();

  if ("error" in server) {
    return NextResponse.json({ error: server.error }, { status: server.status });
  }

  const { id } = await context.params;

  const { error } = await server.supabase
    .from("favorites")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.user.id);

  if (error) {
    return NextResponse.json(
      { error: "Nu am putut sterge favoritul." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
