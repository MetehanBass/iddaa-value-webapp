export const BETMONITOR_BASE = "https://www.betmonitor.com";
export const BETMONITOR_PROPS_URL = `${BETMONITOR_BASE}/content/get_players.php`;
export const IDDAA_EVENTS_URL = "https://sportsbookv2.iddaa.com/sportsbook/events?st=1&type=0&version=0";
export const IDDAA_EVENT_URL = "https://sportsbookv2.iddaa.com/sportsbook/event/";

export const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  Referer: BETMONITOR_BASE,
  "X-Requested-With": "XMLHttpRequest",
};

export interface LeagueConfig {
  slug: string;
  name: string;
  leagueId: string;
  flag: string;
  favExcluded?: boolean;
}

export const LEAGUES: LeagueConfig[] = [
  { slug: "england-premier-league", name: "Premier League", leagueId: "10000070", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { slug: "spain-la-liga", name: "La Liga", leagueId: "10000184", flag: "🇪🇸" },
  { slug: "germany-bundesliga", name: "Bundesliga", leagueId: "10000090", flag: "🇩🇪" },
  { slug: "italy-serie-a", name: "Serie A", leagueId: "10000124", flag: "🇮🇹" },
  { slug: "france-ligue-1", name: "Ligue 1", leagueId: "10000080", flag: "🇫🇷" },
  { slug: "turkcell-super-league", name: "Süper Lig", leagueId: "10000204", flag: "🇹🇷" },
  { slug: "brazil-serie-a", name: "Brazil Serie A", leagueId: "10001637", flag: "🇧🇷" },
  { slug: "portugal-primeira-liga", name: "Primeira Liga", leagueId: "10000161", flag: "🇵🇹" },
  { slug: "uefa-champions-league", name: "Şampiyonlar Ligi", leagueId: "10000315", flag: "🏆", favExcluded: true },
  { slug: "uefa-europa-league", name: "Avrupa Ligi", leagueId: "10000314", flag: "🥈", favExcluded: true },
  { slug: "uefa-conference-league", name: "Konferans Ligi", leagueId: "10018549", flag: "🥉", favExcluded: true },
];

export const TARGET_MARKETS = ["tackpp", "shoTurnovers per Player", "shot", "foulpp"];

export const MARKET_NAMES: Record<string, string> = {
  tackpp: "Top Çalma",
  shot: "İsabetli Şut",
  "shoTurnovers per Player": "Şut",
  foulpp: "Faul Yapar",
  savepp: "Kaleci Kurtarışı",
};

export const BOOKIE_NAMES: Record<string, string> = {
  "1xbet": "1xBet",
  bet365: "Bet365",
  betway: "Betway",
  draftkings: "DraftKings",
  fanduel: "FanDuel",
  paddypower: "Paddy Power",
  boylesports: "BoyleSports",
  ladbrokes: "Ladbrokes",
  coral: "Coral",
  unibet: "Unibet",
  novibet: "Novibet",
  betmgm_uk: "BetMGM",
  fanatics: "Fanatics",
  hardrock: "Hard Rock",
  midnite: "Midnite",
  iddaa: "IDDAA",
  msport: "MSport",
  betsson: "Betsson",
  bwin: "Bwin",
  williamhill: "William Hill",
};
