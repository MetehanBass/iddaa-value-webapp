"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { MatchResult } from "@/lib/types";
import { MARKET_NAMES } from "@/lib/config";
import { PlayerPropCard } from "@/components/PlayerPropCard";
import { Loading } from "@/components/Loading";
import { BackButton } from "@/components/BackButton";

export default function MatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rid = params.rid as string;
  const matchName = searchParams.get("name") || "";
  const leagueSlug = searchParams.get("league") || "";

  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/props/${rid}?name=${encodeURIComponent(matchName)}`)
      .then(r => r.json())
      .then(data => setResult(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [rid, matchName]);

  if (loading) return <Loading text="Value bahisler taranıyor..." />;
  if (!result) return <div className="text-center py-12 text-zinc-500">Veri yüklenemedi</div>;

  // Group props by market
  const marketGroups = new Map<string, typeof result.props>();
  for (const prop of result.props) {
    const key = prop.market;
    if (!marketGroups.has(key)) marketGroups.set(key, []);
    marketGroups.get(key)!.push(prop);
  }

  return (
    <div className="pt-4">
      <BackButton />

      {/* Match Header */}
      <div className="bg-zinc-800/60 rounded-xl p-4 mb-4 border border-zinc-700/40">
        <h1 className="text-base font-bold text-white text-center">{matchName}</h1>
        <div className="flex justify-center gap-4 mt-2">
          <span className="text-xs text-zinc-500">
            {result.totalProps} oyuncu bahsi tarandı
          </span>
          <span className={`text-xs font-medium ${result.valueCount > 0 ? "text-emerald-400" : "text-zinc-500"}`}>
            {result.valueCount} value bulundu
          </span>
        </div>
      </div>

      {result.props.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-zinc-400 text-sm">Bu maçta value bahis bulunamadı</p>
          <p className="text-zinc-600 text-xs mt-1">
            IDDAA henüz bu maç için en yüksek oranı sunmuyor olabilir
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {Array.from(marketGroups.entries()).map(([market, props]) => (
            <div key={market}>
              {/* Market header */}
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <h2 className="text-sm font-semibold text-zinc-300">
                  {MARKET_NAMES[market] || market}
                </h2>
                <span className="text-xs text-zinc-600 ml-auto">{props.length} value</span>
              </div>

              {/* Props */}
              <div className="space-y-2">
                {props.map((prop, i) => (
                  <PlayerPropCard key={i} prop={prop} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-2 mt-6">
        {leagueSlug && (
          <Link
            href={`/league/${leagueSlug}`}
            className="flex-1 text-center text-sm text-zinc-500 hover:text-zinc-300 py-2 bg-zinc-800/40 rounded-xl border border-zinc-700/30 transition-colors"
          >
            ← Maçlara Dön
          </Link>
        )}
        <Link
          href="/"
          className="flex-1 text-center text-sm text-zinc-500 hover:text-zinc-300 py-2 bg-zinc-800/40 rounded-xl border border-zinc-700/30 transition-colors"
        >
          Ligler
        </Link>
      </div>
    </div>
  );
}
