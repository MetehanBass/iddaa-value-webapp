export interface Match {
  name: string;
  rid: string;
  league: string;
  time: string;
  timestamp: number;
  url: string;
}

export interface BookieOdd {
  name: string;
  displayName: string;
  over: number;
}

export interface PlayerProp {
  market: string;
  marketName: string;
  playerName: string;
  highestBookie: string;
  bookies: BookieOdd[];
  iddaaOdd: number;
  secondBest: number;
  valuePct: number;
  stars: number;
}

export interface MatchResult {
  matchName: string;
  totalProps: number;
  valueCount: number;
  props: PlayerProp[];
}
