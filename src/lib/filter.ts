import { TARGET_MARKETS, MARKET_NAMES, BOOKIE_NAMES } from "./config";
import type { PlayerProp, MatchResult } from "./types";

interface RawProp {
  market: string;
  playerName: string;
  highestBookie: string;
  bookies: { name: string; over: number; under: number }[];
}

function calcValueScore(iddaaOdd: number, secondBest: number): { pct: number; stars: number } {
  if (secondBest <= 0) return { pct: 0, stars: 0 };
  const pct = ((iddaaOdd - secondBest) / secondBest) * 100;
  let stars = 0;
  if (pct >= 40) stars = 5;
  else if (pct >= 30) stars = 4;
  else if (pct >= 20) stars = 3;
  else if (pct >= 10) stars = 2;
  else if (pct >= 5) stars = 1;
  return { pct, stars };
}

function bookieDisplayName(name: string): string {
  return BOOKIE_NAMES[name.toLowerCase()] || name;
}

export function filterAndEnrich(
  rawProps: RawProp[],
  matchName: string,
): MatchResult {
  const highlight = "iddaa";
  const marketsLower = TARGET_MARKETS.map(m => m.toLowerCase());

  const filtered: PlayerProp[] = [];

  for (const prop of rawProps) {
    if (!marketsLower.includes(prop.market.toLowerCase())) continue;
    if (prop.highestBookie.toLowerCase() !== highlight) continue;

    // Find IDDAA odd
    let iddaaOdd = 0;
    for (const b of prop.bookies) {
      if (b.name.toLowerCase() === highlight) {
        iddaaOdd = b.over;
        break;
      }
    }

    // Others sorted by over desc
    const others = prop.bookies
      .filter(b => b.name.toLowerCase() !== highlight)
      .sort((a, b) => b.over - a.over);

    const secondBest = others.length > 0 ? others[0].over : 0;
    const { pct, stars } = calcValueScore(iddaaOdd, secondBest);

    filtered.push({
      market: prop.market,
      marketName: MARKET_NAMES[prop.market] || prop.market,
      playerName: prop.playerName,
      highestBookie: prop.highestBookie,
      bookies: others.map(b => ({
        name: b.name,
        displayName: bookieDisplayName(b.name),
        over: b.over,
      })),
      iddaaOdd,
      secondBest,
      valuePct: pct,
      stars,
    });
  }

  // Sort within each market by value desc
  filtered.sort((a, b) => {
    if (a.market !== b.market) return a.market.localeCompare(b.market);
    return b.valuePct - a.valuePct;
  });

  return {
    matchName,
    totalProps: rawProps.length,
    valueCount: filtered.length,
    props: filtered,
  };
}
