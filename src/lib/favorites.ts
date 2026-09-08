"use client";

const API_BASE = "https://iddaa-value-player-finder.fly.dev";
const LOCAL_KEY = "iddaa_favorites";

export interface Favorite {
  team: string;
  league: string;
}

function getInitData(): string {
  if (typeof window === "undefined") return "";
  return window.Telegram?.WebApp?.initData || "";
}

function isInTelegram(): boolean {
  return !!getInitData();
}

// ── Local Storage (fallback when not in Telegram) ──

function localGet(): Favorite[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function localAdd(team: string, league: string) {
  const favs = localGet();
  if (favs.some(f => f.team.toLowerCase() === team.toLowerCase() && f.league === league)) return;
  favs.push({ team, league });
  localStorage.setItem(LOCAL_KEY, JSON.stringify(favs));
}

function localRemove(team: string, league: string) {
  const favs = localGet().filter(
    f => !(f.team.toLowerCase() === team.toLowerCase() && f.league === league),
  );
  localStorage.setItem(LOCAL_KEY, JSON.stringify(favs));
}

// ── API (when in Telegram) ──

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Init-Data": getInitData(),
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// ── Public API ──

let _cache: Favorite[] | null = null;
let _cacheTime = 0;
const CACHE_TTL = 10_000; // 10 seconds

export async function getFavorites(): Promise<Favorite[]> {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL) return _cache;

  let favs: Favorite[];

  if (isInTelegram()) {
    try {
      const data = await apiFetch("/api/favorites");
      favs = Array.isArray(data) ? data : [];
    } catch {
      favs = localGet(); // fallback
    }
  } else {
    favs = localGet();
  }

  _cache = favs;
  _cacheTime = Date.now();
  return favs;
}

export async function addFavorite(team: string, league: string): Promise<void> {
  _cache = null;
  if (isInTelegram()) {
    try {
      await apiFetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ team, league }),
      });
      return;
    } catch { /* fallback */ }
  }
  localAdd(team, league);
}

export async function removeFavorite(team: string, league: string): Promise<void> {
  _cache = null;
  if (isInTelegram()) {
    try {
      await apiFetch("/api/favorites", {
        method: "DELETE",
        body: JSON.stringify({ team, league }),
      });
      return;
    } catch { /* fallback */ }
  }
  localRemove(team, league);
}

export async function isFavorite(team: string, league: string): Promise<boolean> {
  const favs = await getFavorites();
  return favs.some(
    f => f.team.toLowerCase() === team.toLowerCase() && f.league === league,
  );
}
