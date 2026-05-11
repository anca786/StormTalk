import type { NextRequest } from "next/server";
import { getSupabaseAnonServerClient, getSupabaseServerClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!accessToken) {
    return { error: "Lipseste tokenul de autentificare.", status: 401 as const };
  }

  const supabaseAuth = getSupabaseAnonServerClient();

  if (!supabaseAuth) {
    return { error: "Supabase nu este configurat.", status: 500 as const };
  }

  const { data, error } = await supabaseAuth.auth.getUser(accessToken);

  if (error || !data.user) {
    return { error: "Sesiunea utilizatorului nu este valida.", status: 401 as const };
  }

  return { user: data.user } as const;
}

export function requireSupabaseServer() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase nu este configurat.", status: 500 as const };
  }

  return { supabase } as const;
}
