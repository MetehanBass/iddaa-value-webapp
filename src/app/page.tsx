"use client";

import Link from "next/link";
import { LEAGUES } from "@/lib/config";

export default function Home() {
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

      {/* Info */}
      <div className="mt-6 bg-zinc-800/40 rounded-xl p-4 border border-zinc-700/30">
        <p className="text-zinc-400 text-xs leading-relaxed">
          Favori takımlarını eklersen, her saat 50 geçe yeni value bahisler mesaj olarak gelir.
          Herhangi bir maç özelinde değerli bahisleri incelemek için menüyü kullan.
        </p>
      </div>
    </div>
  );
}
