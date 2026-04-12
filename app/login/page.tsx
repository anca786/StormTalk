"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSupabaseSession } from "@/hooks/use-supabase-session";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useSupabaseSession();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email si parola sunt obligatorii.");
      return;
    }

    setMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? "A aparut o eroare.");
        setIsSubmitting(false);
        return;
      }

      // If we got tokens back, set the session on the client-side Supabase
      if (data.session?.access_token && data.session?.refresh_token) {
        const supabase = getSupabaseBrowserClient();

        if (supabase) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        }
      }

      setMessage(data.message ?? "Succes!");
    } catch {
      setErrorMessage("Eroare de retea. Verifica conexiunea la internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setMessage("Te-ai delogat cu succes.");
    setErrorMessage(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      void handleSubmit();
    }
  };

  return (
    <main className="page-shell">
      <section className="auth-shell">
        <article className="auth-card">
          <p className="eyebrow">Autentificare</p>
          <h1 className="auth-title">Intra in StormTalk</h1>

          {user?.email ? (
            <>
              <p className="panel-subtitle">
                Esti conectat ca <strong>{user.email}</strong>
              </p>
              <div className="panel-actions auth-actions">
                <button
                  className="ghost-button"
                  onClick={() => void handleLogout()}
                  type="button"
                >
                  Logout
                </button>
              </div>
              {message ? <p className="helper-note">{message}</p> : null}
            </>
          ) : (
            <>
              <p className="panel-subtitle">
                {mode === "login"
                  ? "Login cu email si parola."
                  : "Creeaza un cont nou."}
              </p>

              <div className="form-grid">
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="text-field"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="email@exemplu.com"
                  type="email"
                  value={email}
                />
                <label className="field-label" htmlFor="password">
                  Parola
                </label>
                <input
                  className="text-field"
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="minim 6 caractere"
                  type="password"
                  value={password}
                />
              </div>

              <div className="panel-actions auth-actions">
                <button
                  className="primary-button"
                  disabled={isLoading || isSubmitting}
                  onClick={() => void handleSubmit()}
                  type="button"
                >
                  {isSubmitting
                    ? "Se proceseaza..."
                    : mode === "login"
                      ? "Login"
                      : "Creeaza cont"}
                </button>
              </div>

              {message ? <p className="helper-note">{message}</p> : null}
              {errorMessage ? <p className="error-note">{errorMessage}</p> : null}

              <p className="auth-session-line">
                <button
                  className="auth-inline-toggle"
                  onClick={() =>
                    setMode((current) =>
                      current === "login" ? "register" : "login",
                    )
                  }
                  type="button"
                >
                  {mode === "login"
                    ? "Nu ai cont? Inregistreaza-te"
                    : "Ai deja cont? Login"}
                </button>
              </p>
            </>
          )}
        </article>
      </section>
    </main>
  );
}
