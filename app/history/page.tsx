"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoredHistoryEntry } from "@/lib/app-data";
import { useSupabaseSession } from "@/hooks/use-supabase-session";

export default function HistoryPage() {
  const { session, user } = useSupabaseSession();
  const [history, setHistory] = useState<StoredHistoryEntry[]>([]);

  useEffect(() => {
    async function loadHistory() {
      if (!session?.access_token) {
        return;
      }

      const response = await fetch("/api/history", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = (await response.json()) as {
        history?: Array<{
          id: string;
          latitude: number;
          longitude: number;
          weather_payload: Record<string, string | number | null>;
          ai_conversation: StoredHistoryEntry["agents"];
          created_at: string;
        }>;
      };

      if (response.ok && payload.history) {
        setHistory(
          payload.history.map((entry) => ({
            id: entry.id,
            latitude: entry.latitude,
            longitude: entry.longitude,
            weather: entry.weather_payload,
            agents: entry.ai_conversation,
            createdAt: entry.created_at,
          })),
        );
      }
    }

    void loadHistory();
  }, [session?.access_token]);

  if (!user?.email) {
    return (
      <main className="page-shell">
        <section className="info-card">
          <p className="eyebrow">Istoric</p>
          <h2>Trebuie sa fii autentificat</h2>
          <p className="panel-subtitle">
            Istoricul conversatiilor AI este disponibil doar dupa login.
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
        <p className="eyebrow">Istoric</p>
      </section>

      <section className="content-grid single-column-grid">
        {history.length > 0 ? (
          history.map((entry) => (
            <article className="info-card" key={entry.id}>
              <h2>
                {entry.latitude}, {entry.longitude}
              </h2>
              <p>
                Consultat la: {new Date(entry.createdAt).toLocaleString("ro-RO")}
              </p>
              <p>
                Temperatura: {entry.weather.temperature_2m}
                {entry.weatherUnits?.temperature_2m
                  ? ` ${entry.weatherUnits.temperature_2m}`
                  : ""}
              </p>

              <div className="message-list compact-message-list">
                {entry.agents.map((agent) => (
                  <article className="message-card" key={`${entry.id}-${agent.role}`}>
                    <span className="message-role">
                      {agent.role === "meteorolog" ? "Meteorolog" : "Localnic"}
                    </span>
                    <p>{agent.message}</p>
                  </article>
                ))}
              </div>
            </article>
          ))
        ) : (
          <article className="info-card">
            <h2>Nu exista istoric inca</h2>
            <p>
              Dupa ce folosesti harta si agentii AI, conversatiile vor aparea
              aici automat.
            </p>
          </article>
        )}
      </section>
    </main>
  );
}

