import { describe, expect, it } from 'vitest';
import { ahriSummary, garenSummary } from '../test/fixtures';
import { filterChampions } from './search';

describe('filterChampions', () => {
  const champions = [ahriSummary, garenSummary];

  it('fuzzy searches champion names and titles locally', () => {
    expect(filterChampions(champions, 'ahry', null).map(({ name }) => name)).toEqual(['Ahri']);
    expect(filterChampions(champions, 'might demacia', null).map(({ name }) => name)).toEqual([
      'Garen',
    ]);
  });

  it('filters by champion class', () => {
    expect(filterChampions(champions, '', 'Tank').map(({ name }) => name)).toEqual(['Garen']);
  });
});
