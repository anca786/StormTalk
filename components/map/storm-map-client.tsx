"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  normalizePreferredUnit,
  preferredUnitToWeatherApi,
  UNIT_STORAGE_KEY,
} from "@/lib/preferences";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import L from "leaflet";
import type { WeatherContext } from "@/lib/agents";

type SelectedLocation = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

type AdvisorPayload = {
  agent?: string;
  message?: string;
  error?: string;
  mode?: "gemini" | "fallback";
  warning?: string;
};

type GeocodeResult = {
  id: string | number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

type ThemeMode = "light" | "dark";

const DEFAULT_LOCATION: SelectedLocation = {
  latitude: 44.4268,
  longitude: 26.1025,
};

const FALLBACK_MARKER_ICON = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({
  onSelect,
}: {
  onSelect: (location: SelectedLocation) => void;
}) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: Number(event.latlng.lat.toFixed(4)),
        longitude: Number(event.latlng.lng.toFixed(4)),
      });
    },
  });

  return null;
}

function ViewportUpdater({ location }: { location: SelectedLocation }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(
      [location.latitude, location.longitude],
      location.zoom ?? map.getZoom(),
      { duration: 1.2 },
    );
  }, [location, map]);

  return null;
}

function formatMetric(
  value: string | number | null | undefined,
  unit?: string,
  fallback = "N/A",
) {
  if (value === null || value === undefined) {
    return fallback;
  }

  return `${value}${unit ? ` ${unit}` : ""}`;
}

async function fetchWeather(location: SelectedLocation) {
  const preferredUnit =
    typeof window === "undefined"
      ? "C"
      : normalizePreferredUnit(window.localStorage.getItem(UNIT_STORAGE_KEY));

  const searchParams = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    unit: preferredUnitToWeatherApi(preferredUnit),
  });

  const response = await fetch(`/api/weather?${searchParams.toString()}`);
  const payload = (await response.json()) as WeatherContext & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Nu am putut prelua datele meteo.");
  }

  return payload;
}

async function fetchAdvisor(weather: WeatherContext) {
  const response = await fetch("/api/debate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ weather }),
  });

  const payload = (await response.json()) as AdvisorPayload;

  if (!response.ok || !payload.message) {
    throw new Error(payload.error ?? "Nu am putut genera analiza AI.");
  }

  return payload;
}

export default function StormMapClient() {
  const searchParams = useSearchParams();
  const initialLat = Number(searchParams.get("lat"));
  const initialLng = Number(searchParams.get("lng"));
  const initialLocation =
    Number.isFinite(initialLat) && Number.isFinite(initialLng)
      ? {
          latitude: Number(initialLat.toFixed(4)),
          longitude: Number(initialLng.toFixed(4)),
        }
      : DEFAULT_LOCATION;

  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation>(initialLocation);
  const [weather, setWeather] = useState<WeatherContext | null>(null);
  const [advisorMessage, setAdvisorMessage] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [advisorError, setAdvisorError] = useState<string | null>(null);
  const [preferredUnit, setPreferredUnit] = useState<"C" | "F">("C");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isDebateLoading, setIsDebateLoading] = useState(false);
  const { session, user } = useSupabaseSession();

  useEffect(() => {
    L.Marker.prototype.options.icon = FALLBACK_MARKER_ICON;
  }, []);

  useEffect(() => {
    const syncPreferences = () => {
      setPreferredUnit(
        normalizePreferredUnit(window.localStorage.getItem(UNIT_STORAGE_KEY)),
      );
    };

    syncPreferences();
    window.addEventListener("stormtalk-storage-updated", syncPreferences);

    return () => {
      window.removeEventListener("stormtalk-storage-updated", syncPreferences);
    };
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      setTheme(nextTheme);
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (Number.isFinite(initialLat) && Number.isFinite(initialLng)) {
      setSelectedLocation({
        latitude: Number(initialLat.toFixed(4)),
        longitude: Number(initialLng.toFixed(4)),
      });
    }
  }, [initialLat, initialLng]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    let isCancelled = false;
    setIsSearchLoading(true);
    setSearchError(null);

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/geocode?q=${encodeURIComponent(searchQuery.trim())}`,
        );
        const payload = (await response.json()) as {
          results?: GeocodeResult[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Nu am putut cauta locatia.");
        }

        if (!isCancelled) {
          setSearchResults(payload.results ?? []);
        }
      } catch (error) {
        if (!isCancelled) {
          setSearchError(
            error instanceof Error
              ? error.message
              : "A aparut o eroare la cautarea locatiei.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    let isCancelled = false;

    async function runWeatherFlow() {
      let weatherPayload: WeatherContext | null = null;

      setIsWeatherLoading(true);
      setWeatherError(null);
      setAdvisorError(null);
      setAdvisorMessage(null);

      try {
        weatherPayload = await fetchWeather(selectedLocation);

        if (!isCancelled) {
          setWeather(weatherPayload);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "A aparut o eroare neasteptata.";
        if (!isCancelled) {
          setWeather(null);
          setWeatherError(message);
        }
        return;
      } finally {
        if (!isCancelled) {
          setIsWeatherLoading(false);
        }
      }

      setIsDebateLoading(true);

      try {
        if (!weatherPayload) {
          throw new Error("Datele meteo nu sunt disponibile pentru analiza.");
        }

        const advisorPayload = await fetchAdvisor(weatherPayload);

        if (!isCancelled) {
          setAdvisorMessage(advisorPayload.message ?? null);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "A aparut o eroare neasteptata.";

        if (!isCancelled) {
          setAdvisorError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsDebateLoading(false);
        }
      }
    }

    void runWeatherFlow();

    return () => {
      isCancelled = true;
    };
  }, [preferredUnit, selectedLocation]);

  useEffect(() => {
    if (!weather || !advisorMessage || !session?.access_token || typeof window === "undefined") {
      return;
    }

    if (weather.latitude === 0 && weather.longitude === 0) {
      return; // Nu salvam punctul default (0, 0)
    }

    void fetch("/api/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        latitude: weather.latitude,
        longitude: weather.longitude,
        weather_payload: {
          ...weather.current,
          timezone: weather.timezone,
          current_units: weather.current_units,
        },
        ai_conversation: [{ role: "advisor", message: advisorMessage }],
      }),
    });
  }, [advisorMessage, session?.access_token, weather]);

  const metrics = useMemo(() => {
    if (!weather) {
      return [];
    }

    return [
      {
        label: "Temperatura",
        value: formatMetric(
          weather.current.temperature_2m,
          weather.current_units?.temperature_2m,
        ),
      },
      {
        label: "Feels like",
        value: formatMetric(
          weather.current.apparent_temperature,
          weather.current_units?.apparent_temperature,
        ),
      },
      {
        label: "Humidity",
        value: formatMetric(
          weather.current.relative_humidity_2m,
          weather.current_units?.relative_humidity_2m,
        ),
      },
      {
        label: "Wind",
        value: formatMetric(
          weather.current.wind_speed_10m,
          weather.current_units?.wind_speed_10m,
        ),
      },
      {
        label: "Pressure",
        value: formatMetric(
          weather.current.pressure_msl,
          weather.current_units?.pressure_msl,
        ),
      },
      {
        label: "Cloud cover",
        value: formatMetric(
          weather.current.cloud_cover,
          weather.current_units?.cloud_cover,
        ),
      },
    ];
  }, [weather]);

  const handleRefreshAdvisor = async () => {
    if (!weather) {
      return;
    }

    setIsDebateLoading(true);
    setAdvisorError(null);

    try {
      const payload = await fetchAdvisor(weather);
      setAdvisorMessage(payload.message ?? null);
      setAdvisorMode(payload.mode ?? null);
      setAdvisorWarning(payload.warning ?? null);
    } catch (error) {
      setAdvisorError(
        error instanceof Error
          ? error.message
          : "Nu am putut genera analiza.",
      );
    } finally {
      setIsDebateLoading(false);
    }
  };

  const handleSaveFavorite = () => {
    if (!weather || !session?.access_token || typeof window === "undefined") {
      return;
    }

    const label = window.prompt(
      "Cum vrei sa numesti aceasta locatie in favorite?",
      `Locatie ${weather.latitude}, ${weather.longitude}`,
    );

    if (!label) {
      return;
    }

    void fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        label,
        latitude: weather.latitude,
        longitude: weather.longitude,
      }),
    });
  };

  const handleSelectSearchResult = (result: GeocodeResult) => {
    setSelectedLocation({
      latitude: Number(result.latitude.toFixed(4)),
      longitude: Number(result.longitude.toFixed(4)),
      zoom: 10,
    });
    setSearchQuery(`${result.name}, ${result.country}`);
    setSearchResults([]);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0]);
    }
  };

  return (
    <section className="map-fullscreen">
      {/* Floating search bar */}
      <div className="map-search-float">
        <div className="earth-search">
          <span className="earth-search__icon" aria-hidden="true">🔍</span>
          <input
            aria-label="Cauta locatie"
            className="earth-search__input"
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search city, region or country..."
            value={searchQuery}
          />
          {isSearchLoading ? (
            <div className="earth-search__dropdown">
              <p className="helper-note">Searching...</p>
            </div>
          ) : searchError ? (
            <div className="earth-search__dropdown">
              <p className="error-note">{searchError}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="earth-search__dropdown">
              {searchResults.map((result) => (
                <button
                  className="earth-search__result"
                  key={result.id}
                  onClick={() => handleSelectSearchResult(result)}
                  type="button"
                >
                  <strong>{result.name}</strong>
                  <span>{result.country}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Fullscreen map */}
      <div className="map-frame-full">
        <MapContainer
          center={[selectedLocation.latitude, selectedLocation.longitude]}
          zoom={4}
          scrollWheelZoom
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            attribution=""
            url={
              theme === "dark"
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
          />
          <ViewportUpdater location={selectedLocation} />
          <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
            <Tooltip direction="top" offset={[0, -24]} opacity={1} permanent>
              {selectedLocation.latitude}, {selectedLocation.longitude}
            </Tooltip>
          </Marker>
          <ClickHandler onSelect={setSelectedLocation} />
          <ZoomControl position="bottomleft" />
        </MapContainer>
      </div>

      {/* Floating panel */}
      <aside className="map-panel-float">
        <article className="panel-glass panel-glass--weather">
          <div className="panel-glass__header">
            <span className="panel-glass__eyebrow">⛅ Live Weather</span>
            <h2 className="panel-glass__title">{weather?.timezone ?? "Select a point"}</h2>
            <p className="panel-glass__coords">
              {selectedLocation.latitude}, {selectedLocation.longitude}
              {" · "}
              {preferredUnit === "C" ? "Celsius" : "Fahrenheit"}
            </p>
          </div>

          {isWeatherLoading ? (
            <div className="panel-glass__skeleton">
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          ) : weatherError ? (
            <p className="error-note">{weatherError}</p>
          ) : weather ? (
            <div className="metric-grid">
              {metrics.map((metric) => (
                <div className="metric-card" key={metric.label}>
                  <span className="metric-label">{metric.label}</span>
                  <span className="metric-value">{metric.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-note">Click anywhere on the map.</p>
          )}

          {user?.email && weather ? (
            <button
              className="ghost-button ghost-button--small"
              onClick={handleSaveFavorite}
              type="button"
            >
              ⭐ Save to favorites
            </button>
          ) : null}
        </article>

        <article className="panel-glass panel-glass--chat">
          <div className="panel-glass__header">
            <h2 className="panel-glass__title">Weather Advisor</h2>
          </div>

          {isDebateLoading ? (
            <div className="panel-glass__skeleton">
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--long" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          ) : advisorError ? (
            <p className="error-note">{advisorError}</p>
          ) : advisorMessage ? (
            <div className="message-list">
              <article className="message-card message-card--meteorologist">
                <div className="message-card__topline">
                  <span className="message-role">🌦️ Weather Advisor</span>
                </div>
                <p style={{ whiteSpace: "pre-line" }}>{advisorMessage}</p>
              </article>
            </div>
          ) : (
            <p className="empty-note">Analiza AI va aparea aici.</p>
          )}

          <button
            className="primary-button"
            disabled={!weather || isDebateLoading}
            onClick={() => void handleRefreshAdvisor()}
            type="button"
          >
            🔄 Regenereaza analiza
          </button>
        </article>
      </aside>
    </section>
  );
}
