import { describe, expect, it } from "vitest";
import {
  appendHistoryEntry,
  safeParseJson,
  upsertFavorite,
  type StoredHistoryEntry,
} from "../lib/app-data";

describe("app data helpers", () => {
  it("adds a new favorite when location does not already exist", () => {
    const favorites = upsertFavorite([], {
      label: "Bucuresti",
      latitude: 44.4268,
      longitude: 26.1025,
    });

    expect(favorites).toHaveLength(1);
    expect(favorites[0]?.label).toBe("Bucuresti");
  });

  it("updates an existing favorite with the same coordinates", () => {
    const initial = upsertFavorite([], {
      label: "Locatie initiala",
      latitude: 44.4268,
      longitude: 26.1025,
    });

    const updated = upsertFavorite(initial, {
      label: "Locatie schimbata",
      latitude: 44.4268,
      longitude: 26.1025,
    });

    expect(updated).toHaveLength(1);
    expect(updated[0]?.label).toBe("Locatie schimbata");
  });

  it("keeps at most 20 history entries", () => {
    const history = Array.from({ length: 20 }).reduce<StoredHistoryEntry[]>(
      (accumulator, _, index) => {
        return appendHistoryEntry(accumulator, {
          latitude: index,
          longitude: index + 1,
          weather: {},
          agents: [],
        });
      },
      [],
    );

    const nextHistory = appendHistoryEntry(history, {
      latitude: 3,
      longitude: 4,
      weather: {},
      agents: [],
    });

    expect(nextHistory).toHaveLength(20);
  });

  it("deduplicates the newest history entry when the payload is unchanged", () => {
    const history = appendHistoryEntry([], {
      latitude: 44.4,
      longitude: 26.1,
      weather: {},
      agents: [{ role: "meteorolog", message: "Aceeasi analiza" }],
    });

    const duplicate = appendHistoryEntry(history, {
      latitude: 44.4,
      longitude: 26.1,
      weather: {},
      agents: [{ role: "meteorolog", message: "Aceeasi analiza" }],
    });

    expect(duplicate).toHaveLength(1);
  });

  it("returns fallback when json is invalid", () => {
    const parsed = safeParseJson("invalid-json", ["fallback"]);

    expect(parsed).toEqual(["fallback"]);
  });
});
