"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LEAGUES } from "@/lib/config";
import { getFavorites, addFavorite, removeFavorite, isFavorite } from "@/lib/favorites";
import type { Match } from "@/lib/types";
import { BackButton } from "@/components/BackButton";
import { Loading } from "@/components/Loading";

export default function FavoritesPage() {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setRefresh] = useState(0); // force re-render on fav change

  const favLeagues = LEAGUES.filter(l => !l.favExcluded);

  useEffect(() => {
    if (!selectedLeague) return;
    setLoading(true);
    fetch(`/api/matches/${selectedLeague}`)
      .then(r => r.json())
      .then(data => {
        const matches: Match[] = data.matches || [];
        const teamSet = new Set<string>();
        for (const m of matches) {
          const parts = m.name.split(" - ");
          for (const p of parts) {
            const t = p.trim();
            if (t) teamSet.add(t);
          }
        }
        setTeams([...teamSet].sort());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedLeague]);

  function toggleFavorite(team: string) {
    if (!selectedLeague) return;
    if (isFavorite(team, selectedLeague)) {
      removeFavorite(team, selectedLeague);
    } else {
      addFavorite(team, selectedLeague);
    }
    setRefresh(n => n + 1);
  }

  const favCount = getFavorites().length;

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
            const fav = isFavorite(team, selectedLeague);
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
