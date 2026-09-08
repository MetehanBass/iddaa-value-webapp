import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "IDDAA Value Finder",
  description: "IDDAA oyuncu bahislerinde en yüksek oranları bul",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full antialiased">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full bg-[#0f0f0f] text-zinc-100">
        <main className="max-w-lg mx-auto px-4 pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
