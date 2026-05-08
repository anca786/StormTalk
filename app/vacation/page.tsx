"use client";

import { useState } from "react";

type ForecastDay = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  weatherCode: number;
  description: string;
};

type Destination = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  reason: string;
  forecast: ForecastDay[];
  summary: string;
};

export default function VacationPage() {
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!description.trim()) {
      setError("Descrie ce tip de vacanta iti doresti.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDestinations([]);

    try {
      const response = await fetch("/api/vacation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Eroare la cautarea destinatiilor.");
        return;
      }

      setDestinations(data.destinations ?? []);
    } catch {
      setError("Eroare de retea. Verifica conexiunea.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="vacation-hero">
        <div className="vacation-hero__content">
          <h1 className="vacation-hero__title">Smart Vacation Finder</h1>
          <p className="vacation-hero__subtitle">
            Descrie vacanta perfecta si agentul AI iti va sugera destinatii
            cu prognoza meteo reala.
          </p>
        </div>

        <div className="vacation-form">
          <div className="vacation-form__main">
            <textarea
              className="vacation-textarea"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrie ce vreme iti doresti in vacanta... ex: Vreau o destinatie calda, cu plaja si soare, temperatura peste 28°C, fara ploaie. Prefer Europa de Sud."
              rows={3}
              value={description}
            />
          </div>

          <div className="vacation-form__dates">
            <div className="vacation-date-field">
              <label className="field-label" htmlFor="start-date">
                Data start (optional)
              </label>
              <input
                className="text-field"
                id="start-date"
                onChange={(e) => setStartDate(e.target.value)}
                type="date"
                value={startDate}
              />
            </div>
            <div className="vacation-date-field">
              <label className="field-label" htmlFor="end-date">
                Data sfarsit (optional)
              </label>
              <input
                className="text-field"
                id="end-date"
                onChange={(e) => setEndDate(e.target.value)}
                type="date"
                value={endDate}
              />
            </div>
          </div>

          <button
            className="primary-button vacation-submit"
            disabled={isLoading || !description.trim()}
            onClick={() => void handleSearch()}
            type="button"
          >
            {isLoading ? "🔍 Caut destinatii..." : "✈️ Gaseste destinatii"}
          </button>

          {error ? <p className="error-note">{error}</p> : null}
        </div>
      </section>

      {isLoading ? (
        <section className="vacation-loading">
          <div className="vacation-loading__spinner" />
          <p>Agentul AI analizeaza preferintele tale si cauta cele mai bune destinatii...</p>
        </section>
      ) : null}

      {destinations.length > 0 ? (
        <section className="vacation-results">
          <h2 className="vacation-results__title">
            🌍 {destinations.length} destinatii recomandate
          </h2>

          <div className="vacation-grid">
            {destinations.map((dest) => (
              <article className="vacation-card" key={`${dest.city}-${dest.country}`}>
                <div className="vacation-card__header">
                  <h3 className="vacation-card__city">{dest.city}</h3>
                  <span className="vacation-card__country">{dest.country}</span>
                </div>

                <p className="vacation-card__reason">{dest.reason}</p>

                {dest.summary ? (
                  <div className="vacation-card__summary">
                    <p>{dest.summary}</p>
                  </div>
                ) : null}

                {dest.forecast.length > 0 ? (
                  <div className="vacation-forecast">
                    <p className="vacation-forecast__label">📅 Prognoza meteo</p>
                    <div className="vacation-forecast__grid">
                      {dest.forecast.slice(0, 7).map((day) => (
                        <div className="forecast-day" key={day.date}>
                          <span className="forecast-day__date">
                            {new Date(day.date).toLocaleDateString("ro-RO", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span className="forecast-day__desc">{day.description}</span>
                          <span className="forecast-day__temps">
                            <strong>{Math.round(day.tempMax)}°</strong>
                            <span className="forecast-day__min">{Math.round(day.tempMin)}°</span>
                          </span>
                          {day.precipitation > 0 ? (
                            <span className="forecast-day__rain">💧 {day.precipitation}mm</span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="vacation-card__coords">
                  📍 {dest.latitude.toFixed(2)}, {dest.longitude.toFixed(2)}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
