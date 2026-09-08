"use client";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="text-3xl">⚠️</div>
      <p className="text-zinc-400 text-sm text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-emerald-400 hover:text-emerald-300 bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-700/30 transition-colors"
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
