"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { LEAGUES } from "@/lib/config";
import { getFavorites, addFavorite, removeFavorite, isFavorite } from "@/lib/favorites";
import type { Match } from "@/lib/types";
import { BackButton } from "@/components/BackButton";
import { Loading } from "@/components/Loading";

export default function FavoritesPage() {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [teams, setTeams] = useState<string[]>([]);
  const [favSet, setFavSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [favCount, setFavCount] = useState(0);

  const favLeagues = LEAGUES.filter(l => !l.favExcluded);

  // Load fav count
  useEffect(() => {
    getFavorites().then(favs => setFavCount(favs.length));
  }, []);

  // Load teams when league selected
  useEffect(() => {
    if (!selectedLeague) return;
    setLoading(true);

    Promise.all([
      fetch(`/api/matches/${selectedLeague}`).then(r => r.json()),
      getFavorites(),
    ]).then(([data, favs]) => {
      const matches: Match[] = data.matches || [];
      const teamSet = new Set<string>();
      for (const m of matches) {
        for (const p of m.name.split(" - ")) {
          const t = p.trim();
          if (t) teamSet.add(t);
        }
      }
      setTeams([...teamSet].sort());

      // Build set of fav team keys for this league
      const fs = new Set<string>();
      for (const f of favs) {
        if (f.league === selectedLeague) fs.add(f.team.toLowerCase());
      }
      setFavSet(fs);
    }).catch(console.error).finally(() => setLoading(false));
  }, [selectedLeague]);

  const toggleFavorite = useCallback(async (team: string) => {
    if (!selectedLeague) return;
    const key = team.toLowerCase();
    if (favSet.has(key)) {
      await removeFavorite(team, selectedLeague);
      setFavSet(prev => { const n = new Set(prev); n.delete(key); return n; });
      setFavCount(c => c - 1);
    } else {
      await addFavorite(team, selectedLeague);
      setFavSet(prev => new Set(prev).add(key));
      setFavCount(c => c + 1);
    }
  }, [selectedLeague, favSet]);

  // League selection view
  if (!selectedLeague) {
    return (
      <div className="pt-4">
        <BackButton />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-white">Favori Ayarla</h1>
          {favCount > 0 && (
            <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full">
              {favCount} takım
            </span>
          )}
        </div>

        <p className="text-zinc-500 text-xs mb-4">Takım eklemek için bir lig seçin</p>

        <div className="grid grid-cols-2 gap-2">
          {favLeagues.map(league => (
            <button
              key={league.slug}
              onClick={() => setSelectedLeague(league.slug)}
              className="flex items-center gap-2 bg-zinc-800/60 rounded-xl px-3.5 py-3 border border-zinc-700/40 hover:border-zinc-600/60 active:scale-[0.98] transition-all text-left"
            >
              <span className="text-lg">{league.flag}</span>
              <span className="text-sm font-medium text-zinc-200 truncate">{league.name}</span>
            </button>
          ))}
        </div>

        <Link
          href="/"
          className="block text-center text-sm text-zinc-500 hover:text-zinc-300 mt-6 py-2 transition-colors"
        >
          ← Ana Menü
        </Link>
      </div>
    );
  }

  // Team list view
  const league = LEAGUES.find(l => l.slug === selectedLeague);

  return (
    <div className="pt-4">
      <BackButton />

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => { setSelectedLeague(null); setTeams([]); }}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ←
        </button>
        <span className="text-lg">{league?.flag}</span>
        <h1 className="text-base font-bold text-white">{league?.name}</h1>
      </div>

      {loading ? (
        <Loading text="Takımlar yükleniyor..." />
      ) : teams.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-8">Takım bulunamadı</p>
      ) : (
        <div className="grid grid-cols-2 gap-1.5">
          {teams.map(team => {
            const fav = favSet.has(team.toLowerCase());
            return (
              <button
                key={team}
                onClick={() => toggleFavorite(team)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border text-left text-sm transition-all active:scale-[0.98] ${
                  fav
                    ? "bg-emerald-900/30 border-emerald-700/50 text-emerald-300"
                    : "bg-zinc-800/60 border-zinc-700/40 text-zinc-300 hover:border-zinc-600/60"
                }`}
              >
                {fav && <span className="text-xs">⭐</span>}
                <span className="truncate">{team}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
