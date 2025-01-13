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
    // Combat Ratings
    ratings: {
      damage: number;
      toughness: number;
      mobility: number;
      utility: number;
      difficulty: number;
    };
    
    // Level 18 Stats
    maxStats: {
      health: number;
      mana: number;
      armor: number;
      magicResist: number;
      attackDamage: number;
      attackSpeed: number;
    };
    
    // Ability Information
    abilities: Array<{
      name: string;
      cooldown: number;
      cooldownPerLevel: number;
      resource: string;
      resourceCost: number;
    }>;
    
    // Champion Identity
    roles: string[];
    resource: string;
    range: number;
    moveSpeed: number;
    
    // Additional Info
    patch: string;
    style: string;
    
    // Build Information
    recommendedItems: Array<{
      id: string;
      name: string;
      image: {
        full: string;
      };
    }>;
    recommendedRunes: any[];
  };
}