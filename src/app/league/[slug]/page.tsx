"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Match } from "@/lib/types";
import type { LeagueConfig } from "@/lib/config";
import { Loading } from "@/components/Loading";
import { BackButton } from "@/components/BackButton";

interface DateGroup {
  label: string;
  matches: Match[];
}

function groupByDate(matches: Match[]): DateGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);

  const groups = new Map<string, Match[]>();

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
  const d = new Date(timestamp * 1000);
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function LeaguePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [league, setLeague] = useState<LeagueConfig | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/matches/${slug}`)
      .then(r => r.json())
      .then(data => {
        setLeague(data.league);
        setMatches(data.matches);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading text="Maçlar yükleniyor..." />;

  const groups = groupByDate(matches);

  return (
    <div className="pt-4">
      <BackButton />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{league?.flag}</span>
        <h1 className="text-lg font-bold text-white">{league?.name}</h1>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">Yaklaşan maç bulunamadı</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.label}>
              {/* Date header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-zinc-700/50" />
                <span className="text-xs text-zinc-500 font-medium px-2">{group.label}</span>
                <div className="h-px flex-1 bg-zinc-700/50" />
              </div>

              {/* Matches */}
              <div className="space-y-1.5">
                {group.matches.map(match => (
                  <Link
                    key={match.rid}
                    href={`/match/${match.rid}?name=${encodeURIComponent(match.name)}&league=${slug}`}
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

      {/* Back to home */}
      <Link
        href="/"
        className="block text-center text-sm text-zinc-500 hover:text-zinc-300 mt-6 py-2 transition-colors"
      >
        ← Liglere Dön
      </Link>
    </div>
  );
}
