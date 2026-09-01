import Fuse from 'fuse.js';
import type { ChampionRole, ChampionSummary } from '../types/lol';

export function filterChampions(
  champions: ChampionSummary[],
  query: string,
  role: ChampionRole | null,
): ChampionSummary[] {
  const roleMatches = role
    ? champions.filter((champion) => champion.tags.includes(role))
    : champions;
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return roleMatches;
  }

  const fuse = new Fuse(roleMatches, {
    keys: [
      { name: 'name', weight: 0.6 },
      { name: 'title', weight: 0.25 },
      { name: 'tags', weight: 0.15 },
    ],
    ignoreLocation: true,
    threshold: 0.35,
  });

  return fuse.search(normalizedQuery).map(({ item }) => item);
}
