"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import type { StoredFavorite } from "@/lib/app-data";

export default function FavoritesPage() {
  const { session, user } = useSupabaseSession();
  const [favorites, setFavorites] = useState<StoredFavorite[]>([]);

  useEffect(() => {
    async function loadFavorites() {
      if (!session?.access_token) {
        return;
      }

      const response = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = (await response.json()) as {
        favorites?: Array<{
          id: string;
          label: string;
          latitude: number;
          longitude: number;
          created_at: string;
        }>;
      };

      if (response.ok && payload.favorites) {
        setFavorites(
          payload.favorites.map((favorite) => ({
            id: favorite.id,
            label: favorite.label,
            latitude: favorite.latitude,
            longitude: favorite.longitude,
            createdAt: favorite.created_at,
          })),
        );
      }
    }

    void loadFavorites();
  }, [session?.access_token]);

  const removeFavorite = async (id: string) => {
    if (!session?.access_token) {
      return;
    }

    const response = await fetch(`/api/favorites/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (response.ok) {
      setFavorites((current) => current.filter((favorite) => favorite.id !== id));
    }
  };

  if (!user?.email) {
    return (
      <main className="page-shell">
        <section className="info-card">
          <p className="eyebrow">Favorite</p>
          <h2>Trebuie sa fii autentificat</h2>
          <p className="panel-subtitle">
            Paginea de favorite este disponibila doar dupa login. Locatiile salvate se pastreaza in cloud.
          </p>
          <div className="panel-actions" style={{ marginTop: 16 }}>
            <Link className="primary-link" href="/login">
              Mergi la login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="info-card">
        <p className="eyebrow">Favorite</p>
        <p className="panel-subtitle">
          Locatiile tale salvate.
        </p>
      </section>

      <section className="content-grid single-column-grid">
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <article className="info-card" key={favorite.id}>
              <h2>{favorite.label}</h2>
              <p>
                Coordonate: {favorite.latitude}, {favorite.longitude}
              </p>
              <p>Salvat la: {new Date(favorite.createdAt).toLocaleString("ro-RO")}</p>
              <div className="panel-actions" style={{ marginTop: 16 }}>
                <Link
                  className="primary-link"
                  href={`/map?lat=${favorite.latitude}&lng=${favorite.longitude}`}
                >
                  Deschide pe harta
                </Link>
                <button
                  className="ghost-button"
                  onClick={() => void removeFavorite(favorite.id)}
                  type="button"
                >
                  Sterge
                </button>
              </div>
            </article>
          ))
        ) : (
          <article className="info-card">
            <h2>Nu exista favorite inca</h2>
            <p>
              Mergi pe pagina harta si salveaza o locatie dupa ce se incarca
              vremea si raspunsurile celor doi agenti.
            </p>
          </article>
        )}
      </section>
    </main>
  );
}

