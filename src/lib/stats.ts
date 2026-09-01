import type { ChampionStats } from '../types/lol';

export interface LevelStats {
  hp: number;
  mp: number;
  armor: number;
  magicResist: number;
  attackDamage: number;
  attackSpeed: number;
}

function linearStat(base: number, growth: number, level: number): number {
  return base + growth * (level - 1);
}

export function statsAtLevel(stats: ChampionStats, requestedLevel: number): LevelStats {
  const level = Math.min(18, Math.max(1, Math.round(requestedLevel)));
  const levelsGained = level - 1;

  return {
    hp: linearStat(stats.hp, stats.hpperlevel, level),
    mp: linearStat(stats.mp, stats.mpperlevel, level),
    armor: linearStat(stats.armor, stats.armorperlevel, level),
    magicResist: linearStat(stats.spellblock, stats.spellblockperlevel, level),
    attackDamage: linearStat(stats.attackdamage, stats.attackdamageperlevel, level),
    attackSpeed: stats.attackspeed * (1 + (stats.attackspeedperlevel / 100) * levelsGained),
  };
}
