import { BETMONITOR_BASE, BETMONITOR_PROPS_URL, HEADERS } from "./config";

// Server-side cache
const cache = new Map<string, { time: number; data: string }>();
const LEAGUE_TTL = 300_000; // 5 min
const PROPS_TTL = 180_000;  // 3 min

function getCached(key: string, ttl: number): string | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < ttl) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: string) {
  cache.set(key, { time: Date.now(), data });
}

export async function fetchLeagueMatches(slug: string, leagueId: string): Promise<string> {
  const cacheKey = `league:${slug}`;
  const cached = getCached(cacheKey, LEAGUE_TTL);
  if (cached) return cached;

  const url = `${BETMONITOR_BASE}/odds-comparison/football/${slug}/${leagueId}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Failed to fetch ${slug}: ${res.status}`);
  const text = await res.text();
  setCache(cacheKey, text);
  return text;
}

export async function fetchPlayerProps(rid: string): Promise<string> {
  const cacheKey = `props:${rid}`;
  const cached = getCached(cacheKey, PROPS_TTL);
  if (cached) return cached;

  const res = await fetch(BETMONITOR_PROPS_URL, {
    method: "POST",
    headers: { ...HEADERS, "Content-Type": "application/x-www-form-urlencoded" },
    body: `rid=${rid}`,
  });
  if (!res.ok) throw new Error(`Failed to fetch props for ${rid}: ${res.status}`);
  const text = await res.text();
  setCache(cacheKey, text);
  return text;
}
