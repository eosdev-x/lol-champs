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
    hpperlevel: number;
    mp: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeed: number;
    attackspeedperlevel: number;
  };
  lore: string;
}

export interface ChampionResponse {
  version: string;
  data: { [key: string]: Champion };
}

export interface ChampionDetail {
  meta: {
    winRate: number;
    pickRate: number;
    banRate: number;
    tier: string;
  };
  abilities: {
    id: string;
    name: string;
    description: string;
    icon: string;
  }[];
  builds: {
    items: {
      id: string;
      name: string;
      icon: string;
    }[];
    runes: {
      id: string;
      name: string;
      icon: string;
    }[];
  };
}