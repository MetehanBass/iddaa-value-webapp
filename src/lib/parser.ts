import type { Match } from "./types";

const MATCH_URL_RE = /\/odds-comparison\/football\/([^/]+)\/([^/]+)\/(\d+)/;

export function parseMatches(html: string, leagueDisplayName: string): Match[] {
  const matches: Match[] = [];
  const seenRids = new Set<string>();

  // Find all match links
  const linkRe = /<a[^>]*href="(\/odds-comparison\/football\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let linkMatch;

  while ((linkMatch = linkRe.exec(html)) !== null) {
    const href = linkMatch[1];
    const urlMatch = MATCH_URL_RE.exec(href);
    if (!urlMatch) continue;

    const [, , matchSlug, rid] = urlMatch;
    if (seenRids.has(rid)) continue;
    seenRids.add(rid);

    // Extract match name from the link content
    const linkContent = linkMatch[2];
    const teamsMatch = /class="teams"[^>]*>([\s\S]*?)<\//.exec(linkContent);
    let name = "";
    if (teamsMatch) {
      // Get text from the teams span, handling nested elements
      name = teamsMatch[1].replace(/<[^>]+>/g, "").trim();
    }
    // Also try finding the link text for the match name within parent context
    if (!name) {
      name = linkContent.replace(/<[^>]+>/g, "").trim();
    }
    if (!name) {
      name = matchSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }

    // Extract timestamp
    let timestamp = 0;
    let timeStr = "";

    // Search for data-timestamp near this match in the HTML
    // Look backwards from the link position for the nearest league-event-new container
    const beforeLink = html.substring(Math.max(0, linkMatch.index - 2000), linkMatch.index + linkMatch[0].length + 500);
    const tsMatch = /data-timestamp="(\d+)"/.exec(beforeLink);
    if (tsMatch) {
      timestamp = parseInt(tsMatch[1], 10);
      // Extract time text
      const timeTextMatch = /class="evtime-switch"[^>]*>([^<]*)/i.exec(beforeLink);
      if (timeTextMatch) timeStr = timeTextMatch[1].trim();
    }

    matches.push({
      name,
      rid,
      league: leagueDisplayName,
      time: timeStr,
      timestamp,
      url: href,
    });
  }

  return matches;
}

interface RawBookieOdd {
  name: string;
  over: number;
  under: number;
}

interface RawPlayerProp {
  market: string;
  playerName: string;
  highestBookie: string;
  bookies: RawBookieOdd[];
}

export function parsePlayerProps(html: string): RawPlayerProp[] {
  const props: RawPlayerProp[] = [];

  // Split by h2 tags to get market sections
  const sections = html.split(/<h2>/);

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const marketEnd = section.indexOf("</h2>");
    if (marketEnd === -1) continue;
    const market = section.substring(0, marketEnd).trim();

    // Find all player blocks (outright-league)
    const playerRe = /class="outright-league">([\s\S]*?)(?=class="outright-league">|$)/gi;
    const content = section.substring(marketEnd);
    let playerMatch;

    while ((playerMatch = playerRe.exec(content)) !== null) {
      const block = playerMatch[1];

      // Player name
      const nameMatch = /class="outright-league-team">\s*<span>([^<]+)/.exec(block);
      if (!nameMatch) continue;
      const playerName = nameMatch[1].trim();

      // Highest bookie
      const highestMatch = /Highest:\s*<\/span>([^<]+)/.exec(block);
      const highestBookie = highestMatch ? highestMatch[1].trim() : "";

      // Individual bookie odds
      const bookies: RawBookieOdd[] = [];
      const bookieRe = /class="bookie-logo-name">([^<]+)<\/span>[\s\S]*?class="odd-decimal\s*">([^<]+)[\s\S]*?class="odd-decimal\s*">([^<]+)/g;
      let bookieMatch;

      while ((bookieMatch = bookieRe.exec(block)) !== null) {
        bookies.push({
          name: bookieMatch[1].trim(),
          over: parseFloat(bookieMatch[2].trim()) || 0,
          under: parseFloat(bookieMatch[3].trim()) || 0,
        });
      }

      props.push({ market, playerName, highestBookie, bookies });
    }
  }

  return props;
}

export function extractTeams(matches: Match[]): string[] {
  const teams = new Set<string>();
  for (const m of matches) {
    const parts = m.name.split(" - ");
    for (const p of parts) {
      const t = p.trim();
      if (t) teams.add(t);
    }
  }
  return [...teams].sort();
}
