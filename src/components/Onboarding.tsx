"use client";

import { useState, useEffect } from "react";

const ONBOARDING_KEY = "iddaa_onboarding_seen";

const steps = [
  {
    icon: "🔍",
    title: "Value Bahisleri Bul",
    desc: "IDDAA'nın diğer bahis şirketlerinden daha yüksek oran verdiği oyuncu bahislerini otomatik olarak buluyoruz.",
  },
  {
    icon: "⭐",
    title: "Favori Takımlarını Ekle",
    desc: "Favori takımlarını ekle, her saat başı yeni value bahisler otomatik olarak sana bildirilsin.",
  },
  {
    icon: "📊",
    title: "Oranları Karşılaştır",
    desc: "IDDAA oranını diğer şirketlerle karşılaştır, yıldız derecesine göre en değerli bahisleri seç.",
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  function next() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem(ONBOARDING_KEY, "1");
      onComplete();
    }
  }

  function skip() {
    localStorage.setItem(ONBOARDING_KEY, "1");
    onComplete();
  }

  const current = steps[step];

  return (
    <div className="fixed inset-0 bg-[#0f0f0f] z-50 flex flex-col items-center justify-center px-8">
      {/* Skip */}
      <button
        onClick={skip}
        className="absolute top-4 right-4 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
      >
        Atla
      </button>

      {/* Content */}
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">{current.icon}</div>
        <h2 className="text-xl font-bold text-white mb-3">{current.title}</h2>
        <p className="text-zinc-400 text-sm leading-relaxed">{current.desc}</p>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-10">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === step ? "bg-emerald-400 w-6" : "bg-zinc-700"
            }`}
          />
        ))}
      </div>

      {/* Button */}
      <button
        onClick={next}
        className="mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-8 py-3 rounded-xl transition-colors active:scale-[0.97]"
      >
        {step < steps.length - 1 ? "Devam" : "Başla"}
      </button>
    </div>
  );
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    setShowOnboarding(!seen);
    setChecked(true);
  }, []);

  return { showOnboarding, checked, dismiss: () => setShowOnboarding(false) };
}
