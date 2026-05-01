"use client";

import { useEffect, useState } from "react";
import { DEMO_SESSION_STORAGE_KEY, readDemoSession } from "@/lib/auth";
import { normalizePreferredUnit, UNIT_STORAGE_KEY } from "@/lib/preferences";
import { useSupabaseSession } from "@/hooks/use-supabase-session";

export default function ProfilePage() {
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [sessionLabel, setSessionLabel] = useState("Neautentificat");
  const [displayName, setDisplayName] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const { session, user } = useSupabaseSession();

  useEffect(() => {
    setUnit(normalizePreferredUnit(window.localStorage.getItem(UNIT_STORAGE_KEY)));
    const session = readDemoSession(
      window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY),
    );
    setSessionLabel(session ? `${session.name} (${session.email})` : "Neautentificat");
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.access_token) {
        return;
      }

      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = (await response.json()) as {
        profile?: { display_name?: string; preferred_unit?: "C" | "F" };
      };

      if (response.ok && payload.profile) {
        setDisplayName(payload.profile.display_name ?? "");
        const nextUnit = payload.profile.preferred_unit === "F" ? "F" : "C";
        setUnit(nextUnit);
        window.localStorage.setItem(UNIT_STORAGE_KEY, nextUnit);
      }
    }

    void loadProfile();
  }, [session?.access_token]);

  const updateUnit = (nextUnit: "C" | "F") => {
    setUnit(nextUnit);
    window.localStorage.setItem(UNIT_STORAGE_KEY, nextUnit);
    window.dispatchEvent(new Event("stormtalk-storage-updated"));
  };

  const saveProfile = async () => {
    if (!session?.access_token) {
      setProfileMessage("Profilul local a fost actualizat. Pentru salvare cloud, autentifica-te.");
      return;
    }

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        display_name: displayName,
        preferred_unit: unit,
      }),
    });

    if (response.ok) {
      setProfileMessage("Profilul a fost salvat.");
    } else {
      setProfileMessage("Nu am putut salva profilul.");
    }
  };

  return (
    <main className="page-shell">
      {!user?.email ? (
        <section className="info-card">
          <p className="eyebrow">Cont</p>
          <h2>Trebuie sa fii autentificat</h2>
          <p className="panel-subtitle">
            Pagina de cont este disponibila doar dupa login.
          </p>
        </section>
      ) : null}

      {user?.email ? (
        <>
      <section className="info-card">
        <p className="eyebrow">Cont</p>
        <p className="panel-subtitle">Preferinte si profil utilizator.</p>
      </section>

      <section className="content-grid single-column-grid">
        <article className="info-card">
          <h2>Status cont</h2>
          <p className="panel-subtitle">
            {user?.email ? `Cont: ${user.email}` : sessionLabel}
          </p>
        </article>

        <article className="info-card">
          <h2>Nume afisat</h2>
          <div className="form-grid">
            <label className="field-label" htmlFor="display-name">
              Nume
            </label>
            <input
              className="text-field"
              id="display-name"
              onChange={(event) => setDisplayName(event.target.value)}
              value={displayName}
            />
          </div>
        </article>

        <article className="info-card">
          <h2>Unitate preferata pentru temperatura</h2>
          <div className="panel-actions">
            <button
              className={unit === "C" ? "primary-button" : "ghost-button"}
              onClick={() => updateUnit("C")}
              type="button"
            >
              Celsius
            </button>
            <button
              className={unit === "F" ? "primary-button" : "ghost-button"}
              onClick={() => updateUnit("F")}
              type="button"
            >
              Fahrenheit
            </button>
          </div>
          <p className="panel-subtitle">
            Selectia curenta: {unit === "C" ? "Celsius" : "Fahrenheit"}
          </p>
          <div className="panel-actions">
            <button className="primary-button" onClick={() => void saveProfile()} type="button">
              Salveaza profilul
            </button>
          </div>
          {profileMessage ? <p className="helper-note">{profileMessage}</p> : null}
        </article>
      </section>
        </>
      ) : null}
    </main>
  );
}
