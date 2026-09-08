"use client";

export function SkeletonCard() {
  return (
    <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/30 animate-pulse">
      <div className="h-4 bg-zinc-700 rounded w-3/4 mb-3" />
      <div className="h-10 bg-zinc-700/50 rounded-lg mb-3" />
      <div className="space-y-2">
        <div className="h-3 bg-zinc-700/40 rounded w-full" />
        <div className="h-3 bg-zinc-700/40 rounded w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-zinc-800/60 rounded-xl px-4 py-3 border border-zinc-700/30 animate-pulse">
          <div className="h-4 bg-zinc-700 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}
