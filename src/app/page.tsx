"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LEAGUES } from "@/lib/config";
import { getFavorites } from "@/lib/favorites";

export default function Home() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    setFavCount(getFavorites().length);
  }, []);

  return (
    <div className="pt-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Value Finder</h1>
        <p className="text-zinc-500 text-xs">IDDAA oyuncu bahislerinde en yüksek oranlar</p>
      </div>

      {/* League Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {LEAGUES.map(league => (
          <Link
            key={league.slug}
            href={`/league/${league.slug}`}
            className="flex items-center gap-2.5 bg-zinc-800/60 backdrop-blur-sm rounded-xl px-3.5 py-3 border border-zinc-700/40 hover:border-zinc-600/60 active:scale-[0.98] transition-all"
          >
            <span className="text-lg">{league.flag}</span>
            <span className="text-sm font-medium text-zinc-200 truncate">{league.name}</span>
          </Link>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        <Link
          href="/favorites"
          className="flex items-center justify-center gap-2 bg-emerald-900/20 rounded-xl px-3.5 py-3 border border-emerald-700/30 hover:border-emerald-600/50 active:scale-[0.98] transition-all"
        >
          <span className="text-sm">⭐</span>
          <span className="text-sm font-medium text-emerald-300">
            Favorilerim{favCount > 0 ? ` (${favCount})` : ""}
          </span>
        </Link>
        <Link
          href="/favorites"
          className="flex items-center justify-center gap-2 bg-zinc-800/60 rounded-xl px-3.5 py-3 border border-zinc-700/40 hover:border-zinc-600/60 active:scale-[0.98] transition-all"
        >
          <span className="text-sm">⚙️</span>
          <span className="text-sm font-medium text-zinc-300">Ayarla</span>
        </Link>
      </div>

      {/* Info */}
      <div className="mt-4 bg-zinc-800/40 rounded-xl p-4 border border-zinc-700/30">
        <p className="text-zinc-400 text-xs leading-relaxed">
          Favori takımlarını eklersen, her saat 50 geçe yeni value bahisler mesaj olarak gelir.
          Herhangi bir maç özelinde değerli bahisleri incelemek için menüyü kullan.
        </p>
      </div>
    </div>
  );
}
