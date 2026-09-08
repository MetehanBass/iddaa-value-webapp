"use client";

export function Loading({ text = "Yükleniyor..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-400 text-sm">{text}</p>
    </div>
  );
}
