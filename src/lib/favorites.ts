"use client";

export interface Favorite {
  team: string;
  league: string;
}

const STORAGE_KEY = "iddaa_favorites";

export function getFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFavorite(team: string, league: string): void {
  const favs = getFavorites();
  if (favs.some(f => f.team.toLowerCase() === team.toLowerCase() && f.league === league)) return;
  favs.push({ team, league });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function removeFavorite(team: string, league: string): void {
  const favs = getFavorites().filter(
    f => !(f.team.toLowerCase() === team.toLowerCase() && f.league === league),
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function isFavorite(team: string, league: string): boolean {
  return getFavorites().some(
    f => f.team.toLowerCase() === team.toLowerCase() && f.league === league,
  );
}

export function getFavoriteLeagues(): string[] {
  return [...new Set(getFavorites().map(f => f.league))];
}
