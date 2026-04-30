import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      mode?: "login" | "register";
    };

    const email = body.email?.trim();
    const password = body.password?.trim();
    const mode = body.mode ?? "login";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email si parola sunt obligatorii." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Parola trebuie sa aiba minim 6 caractere." },
        { status: 400 },
      );
    }

    if (mode === "register") {
      // Use admin API to bypass rate limits and auto-confirm email
      const admin = getAdminClient();

      if (!admin) {
        return NextResponse.json(
          { error: "Supabase nu este configurat pe server." },
          { status: 500 },
        );
      }

      const { data: newUser, error: createError } =
        await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto-confirm, no email verification needed
        });

      if (createError) {
        // Handle duplicate email
        if (createError.message.includes("already been registered") ||
            createError.message.includes("already exists")) {
          return NextResponse.json(
            { error: "Acest email este deja inregistrat. Incearca login." },
            { status: 409 },
          );
        }

        return NextResponse.json(
          { error: createError.message },
          { status: 400 },
        );
      }

      // Now sign in the newly created user to get tokens
      const anon = getAnonClient();

      if (!anon) {
        return NextResponse.json(
          { error: "Nu pot genera sesiunea." },
          { status: 500 },
        );
      }

      const { data: signInData, error: signInError } =
        await anon.auth.signInWithPassword({ email, password });

      if (signInError || !signInData.session) {
        // User was created but sign-in failed — still return success
        return NextResponse.json({
          message: "Cont creat cu succes! Te poti loga acum.",
          user: { id: newUser.user.id, email: newUser.user.email },
        });
      }

      return NextResponse.json({
        message: "Cont creat si autentificat cu succes!",
        session: {
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
        },
        user: {
          id: signInData.user.id,
          email: signInData.user.email,
        },
      });
    }

    // LOGIN mode
    const anon = getAnonClient();

    if (!anon) {
      return NextResponse.json(
        { error: "Supabase nu este configurat pe server." },
        { status: 500 },
      );
    }

    const { data, error } = await anon.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.session) {
      return NextResponse.json(
        { error: "Nu s-a putut genera sesiunea." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Autentificare reusita!",
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Eroare interna la server." },
      { status: 500 },
    );
  }
}
