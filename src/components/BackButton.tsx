"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function BackButton() {
  const router = useRouter();

  useEffect(() => {
    // Telegram back button
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();
      tg.BackButton.onClick(() => router.back());
      return () => {
        tg.BackButton.hide();
        tg.BackButton.offClick(() => router.back());
      };
    }
  }, [router]);

  return null;
}
