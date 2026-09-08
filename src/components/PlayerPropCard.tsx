"use client";

import { useState } from "react";
import type { PlayerProp } from "@/lib/types";
import { ValueBadge } from "./ValueBadge";

export function PlayerPropCard({ prop }: { prop: PlayerProp }) {
  const isLowValue = prop.valuePct < 5;
  const [expanded, setExpanded] = useState(false);

  // Low value: compact single row, bookies hidden by default
  if (isLowValue) {
    return (
      <div className="bg-zinc-800/40 rounded-lg px-3 py-2.5 border border-zinc-700/30">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-sm truncate pr-2">{prop.playerName}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-zinc-500 text-xs">+%{prop.valuePct.toFixed(1)}</span>
            <span className="text-white font-semibold text-sm">{prop.iddaaOdd.toFixed(2)}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-2 pt-2 border-t border-zinc-700/30 space-y-1">
            {prop.bookies.map((b, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">{b.displayName}</span>
                <span className="text-zinc-400 font-mono">{b.over.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {prop.bookies.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-zinc-600 hover:text-zinc-400 mt-1 transition-colors"
          >
            {expanded ? "Gizle" : `${prop.bookies.length} şirket`}
          </button>
        )}
      </div>
    );
  }

  // High value: full card
  const visibleBookies = expanded ? prop.bookies : prop.bookies.slice(0, 3);
  const hasMore = prop.bookies.length > 3;

  return (
    <div className="bg-zinc-800/60 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold text-sm leading-tight">
          {prop.playerName}
        </h3>
        <ValueBadge pct={prop.valuePct} stars={prop.stars} />
      </div>

      {/* IDDAA Odds */}
      <div className="flex items-center gap-2 mb-3 bg-emerald-900/30 rounded-lg px-3 py-2 border border-emerald-700/30">
        <span className="text-emerald-400 text-xs font-medium">IDDAA</span>
        <span className="text-white font-bold text-lg ml-auto">{prop.iddaaOdd.toFixed(2)}</span>
      </div>

      {/* Other bookies */}
      <div className="space-y-1.5">
        {visibleBookies.map((b, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">{b.displayName}</span>
            <span className="text-zinc-300 font-mono">{b.over.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Expand/collapse */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors pt-1 border-t border-zinc-700/30"
        >
          {expanded ? "Daha az göster" : `+${prop.bookies.length - 3} bahis şirketi daha`}
        </button>
      )}
    </div>
  );
}
