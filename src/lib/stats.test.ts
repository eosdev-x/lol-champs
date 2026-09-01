import { describe, expect, it } from 'vitest';
import { ahriSummary } from '../test/fixtures';
import { statsAtLevel } from './stats';

describe('statsAtLevel', () => {
  it('returns base stats at level one', () => {
    expect(statsAtLevel(ahriSummary.stats, 1)).toMatchObject({
      hp: 590,
      mp: 418,
      armor: 21,
      magicResist: 30,
      attackDamage: 53,
      attackSpeed: 0.668,
    });
  });

  it('applies per-level growth through level eighteen', () => {
    const result = statsAtLevel(ahriSummary.stats, 18);
    expect(result.hp).toBe(2358);
    expect(result.attackDamage).toBe(104);
    expect(result.attackSpeed).toBeCloseTo(0.9178, 4);
  });
});
