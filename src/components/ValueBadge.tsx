"use client";

export function ValueBadge({ pct, stars }: { pct: number; stars: number }) {
  if (stars === 0 && pct < 1) return null;

  const starStr = "★".repeat(stars);
  const color =
    pct >= 20 ? "text-emerald-400" :
    pct >= 10 ? "text-emerald-500" :
    pct >= 5  ? "text-yellow-400" :
               "text-zinc-400";

  return (
    <span className="flex items-center gap-1.5">
      {stars > 0 && (
        <span className="text-amber-400 text-xs tracking-wider">{starStr}</span>
      )}
      <span className={`text-xs font-medium ${color}`}>
        +%{pct.toFixed(1)}
      </span>
    </span>
  );
}
