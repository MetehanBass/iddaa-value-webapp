"use client";

const API_BASE = "https://iddaa-value-player-finder.fly.dev";

export interface Favorite {
  team: string;
  league: string;
}

function getInitData(): string {
  if (typeof window === "undefined") return "";
  return window.Telegram?.WebApp?.initData || "";
}

async function apiFetch(path: string, options?: RequestInit) {
  const initData = getInitData();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Init-Data": initData,
      ...(options?.headers || {}),
    },
  });
  return res.json();
}

// Local cache to avoid repeated API calls
let _cache: Favorite[] | null = null;
let _cacheTime = 0;
const CACHE_TTL = 30_000; // 30 seconds

export async function getFavorites(): Promise<Favorite[]> {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  try {
    const data = await apiFetch("/api/favorites");
    if (Array.isArray(data)) {
      _cache = data;
      _cacheTime = Date.now();
      return data;
    }
  } catch (e) {
    console.error("Failed to fetch favorites:", e);
  }
  return _cache || [];
}

export async function addFavorite(team: string, league: string): Promise<void> {
  try {
    await apiFetch("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ team, league }),
    });
    _cache = null; // invalidate cache
  } catch (e) {
    console.error("Failed to add favorite:", e);
  }
}

export async function removeFavorite(team: string, league: string): Promise<void> {
  try {
    await apiFetch("/api/favorites", {
      method: "DELETE",
      body: JSON.stringify({ team, league }),
    });
    _cache = null;
  } catch (e) {
    console.error("Failed to remove favorite:", e);
  }
}

export async function isFavorite(team: string, league: string): Promise<boolean> {
  const favs = await getFavorites();
  return favs.some(
    f => f.team.toLowerCase() === team.toLowerCase() && f.league === league,
  );
}
