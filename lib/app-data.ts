export type StoredFavorite = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};

export type StoredHistoryEntry = {
  id: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  weather: Record<string, string | number | null>;
  weatherUnits?: Record<string, string>;
  agents: {
    role: "advisor" | "vacation";
    message: string;
  }[];
  createdAt: string;
};

export const FAVORITES_STORAGE_KEY = "stormtalk-favorites";
export const HISTORY_STORAGE_KEY = "stormtalk-history";

export function createStorageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function safeParseJson<T>(value: string | null, fallback: T) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function upsertFavorite(
  favorites: StoredFavorite[],
  incoming: Omit<StoredFavorite, "id" | "createdAt">,
) {
  const existing = favorites.find(
    (favorite) =>
      favorite.latitude === incoming.latitude &&
      favorite.longitude === incoming.longitude,
  );

  if (existing) {
    return favorites.map((favorite) =>
      favorite.id === existing.id
        ? { ...favorite, label: incoming.label }
        : favorite,
    );
  }

  return [
    {
      id: createStorageId("favorite"),
      createdAt: new Date().toISOString(),
      ...incoming,
    },
    ...favorites,
  ];
}

export function appendHistoryEntry(
  history: StoredHistoryEntry[],
  entry: Omit<StoredHistoryEntry, "id" | "createdAt">,
) {
  const previous = history[0];

  if (
    previous &&
    previous.latitude === entry.latitude &&
    previous.longitude === entry.longitude &&
    JSON.stringify(previous.agents) === JSON.stringify(entry.agents)
  ) {
    return history;
  }

  const nextEntry: StoredHistoryEntry = {
    id: createStorageId("history"),
    createdAt: new Date().toISOString(),
    ...entry,
  };

  return [nextEntry, ...history].slice(0, 20);
}
