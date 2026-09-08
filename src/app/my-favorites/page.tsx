"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LEAGUES } from "@/lib/config";
import { getFavorites, type Favorite } from "@/lib/favorites";
import type { Match } from "@/lib/types";
import { Loading } from "@/components/Loading";
import { BackButton } from "@/components/BackButton";

interface DateGroup {
  label: string;
  matches: (Match & { leagueSlug: string })[];
}

function groupByDate(matches: (Match & { leagueSlug: string })[]): DateGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);

  const groups = new Map<string, (Match & { leagueSlug: string })[]>();

  for (const m of matches) {
    let label = "";
    if (m.timestamp > 0) {
      const d = new Date(m.timestamp * 1000);
      const md = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (md.getTime() === today.getTime()) label = "Bugün";
      else if (md.getTime() === tomorrow.getTime()) label = "Yarın";
      else label = d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
    } else {
      label = "Tarih Bilinmiyor";
    }
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(m);
  }

  return Array.from(groups.entries()).map(([label, matches]) => ({ label, matches }));
}

function formatTime(timestamp: number): string {
  if (timestamp === 0) return "";
  return new Date(timestamp * 1000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function MyFavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [favMatches, setFavMatches] = useState<(Match & { leagueSlug: string })[]>([]);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    async function load() {
      const favs = await getFavorites();
      setFavCount(favs.length);

      if (favs.length === 0) {
        setLoading(false);
        return;
      }

      // Group favs by league
      const leagueMap = new Map<string, string[]>();
      for (const f of favs) {
        if (!leagueMap.has(f.league)) leagueMap.set(f.league, []);
        leagueMap.get(f.league)!.push(f.team.toLowerCase());
      }

      // Fetch matches for each league
      const allMatches: (Match & { leagueSlug: string })[] = [];
      const now = Math.floor(Date.now() / 1000);

      for (const [slug, teamNames] of leagueMap.entries()) {
        try {
          const res = await fetch(`/api/matches/${slug}`);
          const data = await res.json();
          const matches: Match[] = data.matches || [];

          for (const m of matches) {
            if (m.timestamp > 0 && m.timestamp <= now) continue; // skip started
            const parts = m.name.split(" - ").map(p => p.trim().toLowerCase());
            const isFav = parts.some(p => teamNames.some(t => p.includes(t) || t.includes(p)));
            if (isFav) {
              allMatches.push({ ...m, leagueSlug: slug });
            }
          }
        } catch (e) {
          console.error(`Failed to fetch ${slug}:`, e);
        }
      }

      allMatches.sort((a, b) => a.timestamp - b.timestamp);
      setFavMatches(allMatches);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <Loading text="Favori maçlar yükleniyor..." />;

  const groups = groupByDate(favMatches);

  return (
    <div className="pt-4">
      <BackButton />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-white">⭐ Favorilerim</h1>
        {favCount > 0 && (
          <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full">
            {favCount} takım
          </span>
        )}
      </div>

      {favCount === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl mb-3">⭐</div>
          <p className="text-zinc-400 text-sm">Henüz favori takımın yok</p>
          <Link
            href="/favorites"
            className="inline-block mt-4 text-sm text-emerald-400 hover:text-emerald-300 bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-700/30"
          >
            ⚙️ Favori Ekle
          </Link>
        </div>
      ) : favMatches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl mb-3">📅</div>
          <p className="text-zinc-400 text-sm">Favori takımlarının yaklaşan maçı bulunamadı</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-zinc-700/50" />
                <span className="text-xs text-zinc-500 font-medium px-2">{group.label}</span>
                <div className="h-px flex-1 bg-zinc-700/50" />
              </div>

              <div className="space-y-1.5">
                {group.matches.map(match => (
                  <Link
                    key={match.rid}
                    href={`/match/${match.rid}?name=${encodeURIComponent(match.name)}&league=${match.leagueSlug}`}
                    className="flex items-center justify-between bg-zinc-800/60 rounded-xl px-4 py-3 border border-zinc-700/40 hover:border-zinc-600/60 active:scale-[0.99] transition-all"
                  >
                    <span className="text-sm text-zinc-200 font-medium truncate pr-3">
                      {match.name}
                    </span>
                    {match.timestamp > 0 && (
                      <span className="text-xs text-zinc-500 whitespace-nowrap">
                        {formatTime(match.timestamp)}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-2 mt-6">
        <Link
          href="/favorites"
          className="flex-1 text-center text-sm text-zinc-500 hover:text-zinc-300 py-2 bg-zinc-800/40 rounded-xl border border-zinc-700/30 transition-colors"
        >
          ⚙️ Favori Ayarla
        </Link>
        <Link
          href="/"
          className="flex-1 text-center text-sm text-zinc-500 hover:text-zinc-300 py-2 bg-zinc-800/40 rounded-xl border border-zinc-700/30 transition-colors"
        >
          ← Ana Menü
        </Link>
      </div>
    </div>
  );
}
