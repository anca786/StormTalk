"use client";

import { useEffect, useState } from "react";
import {
  FAVORITES_STORAGE_KEY,
  HISTORY_STORAGE_KEY,
  safeParseJson,
  type StoredFavorite,
  type StoredHistoryEntry,
} from "@/lib/app-data";

function readFavorites() {
  if (typeof window === "undefined") {
    return [] as StoredFavorite[];
  }

  return safeParseJson<StoredFavorite[]>(
    window.localStorage.getItem(FAVORITES_STORAGE_KEY),
    [],
  );
}

function readHistory() {
  if (typeof window === "undefined") {
    return [] as StoredHistoryEntry[];
  }

  return safeParseJson<StoredHistoryEntry[]>(
    window.localStorage.getItem(HISTORY_STORAGE_KEY),
    [],
  );
}

export function useStormTalkStorage() {
  const [favorites, setFavorites] = useState<StoredFavorite[]>([]);
  const [history, setHistory] = useState<StoredHistoryEntry[]>([]);

  useEffect(() => {
    const sync = () => {
      setFavorites(readFavorites());
      setHistory(readHistory());
    };

    sync();

    window.addEventListener("stormtalk-storage-updated", sync);

    return () => {
      window.removeEventListener("stormtalk-storage-updated", sync);
    };
  }, []);

  return { favorites, history };
}
