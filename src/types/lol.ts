export const CHAMPION_ROLES = [
  'Fighter',
  'Tank',
  'Mage',
  'Assassin',
  'Marksman',
  'Support',
] as const;

export type ChampionRole = (typeof CHAMPION_ROLES)[number];

export interface DataDragonImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

export interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

export interface ChampionSummary {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: ChampionInfo;
  image: DataDragonImage;
  tags: ChampionRole[];
  partype: string;
  stats: ChampionStats;
}

export interface ChampionSkin {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

export interface ChampionSpell {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  maxrank: number;
  cooldown: number[];
  cooldownBurn: string;
  cost: number[];
  costBurn: string;
  costType: string;
  range: number[];
  rangeBurn: string;
  image: DataDragonImage;
  resource?: string;
}

export interface ChampionPassive {
  name: string;
  description: string;
  image: DataDragonImage;
}

export interface ChampionDetail extends ChampionSummary {
  lore: string;
  allytips: string[];
  enemytips: string[];
  skins: ChampionSkin[];
  spells: ChampionSpell[];
  passive: ChampionPassive;
}

export interface ChampionCatalog {
  version: string;
  champions: ChampionSummary[];
}

export interface ChampionDetailResult {
  version: string;
  champion: ChampionDetail;
}

export interface ChampionResponse<T> {
  type: string;
  format: string;
  version: string;
  data: Record<string, T>;
}
