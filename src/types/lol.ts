// API Response Types
export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
  };
  tags: string[];
  stats: {
    hp: number;
    mp: number;
    armor: number;
    spellblock: number;
    attackdamage: number;
    attackspeed: number;
  };
}

export interface ChampionResponse {
  version: string;
  data: { [key: string]: Champion };
}