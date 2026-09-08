import { NextResponse } from "next/server";
import { LEAGUES } from "@/lib/config";
import { fetchLeagueMatches } from "@/lib/scraper";
import { parseMatches } from "@/lib/parser";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const league = LEAGUES.find(l => l.slug === slug);
  if (!league) {
    return NextResponse.json({ error: "League not found" }, { status: 404 });
  }

  try {
    const html = await fetchLeagueMatches(slug, league.leagueId);
    const matches = parseMatches(html, league.name);

    // Filter: future matches within 5 days
    const now = Math.floor(Date.now() / 1000);
    const maxTs = now + 5 * 86400;
    const filtered = matches.filter(
      m => m.timestamp === 0 || (m.timestamp > now && m.timestamp < maxTs),
    );
    filtered.sort((a, b) => a.timestamp - b.timestamp);

    return NextResponse.json({ league, matches: filtered });
  } catch (e) {
    console.error(`Failed to fetch matches for ${slug}:`, e);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
