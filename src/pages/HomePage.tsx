import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchChampions } from '../api/lolApi';
import { ChampionCard } from '../components/ChampionCard';
import { RoleFilters } from '../components/RoleFilters';
import { SearchBar } from '../components/SearchBar';
import { StatusPanel } from '../components/StatusPanel';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { filterChampions } from '../lib/search';
import type { ChampionRole } from '../types/lol';

export function HomePage() {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<ChampionRole | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebouncedValue(query, 180);
  const championQuery = useQuery({
    queryKey: ['champions'],
    queryFn: ({ signal }) => fetchChampions(signal),
    staleTime: 1000 * 60 * 60,
  });

  const champions = useMemo(
    () => filterChampions(championQuery.data?.champions ?? [], debouncedQuery, role),
    [championQuery.data?.champions, debouncedQuery, role],
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if (event.key === '/' && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if (event.key === 'Escape' && query) {
        setQuery('');
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [query]);

  const clearFilters = () => {
    setQuery('');
    setRole(null);
  };

  return (
    <>
      <section className="hero-panel">
        <p className="eyebrow">Champion Archive · Live Data Dragon Catalog</p>
        <h1>Know every legend.</h1>
        <p className="hero-copy">
          Search the Rift by name, title, or class, then inspect abilities, scaling stats,
          lore, and every available skin.
        </p>
        <SearchBar inputRef={searchInputRef} value={query} onChange={setQuery} />
        <RoleFilters selectedRole={role} onChange={setRole} />
      </section>

      <section className="catalog-section" aria-labelledby="catalog-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The roster</p>
            <h2 id="catalog-heading">Champions</h2>
          </div>
          {championQuery.data ? (
            <p aria-live="polite">
              <strong>{champions.length}</strong> of {championQuery.data.champions.length} champions
              <span>Patch {championQuery.data.version}</span>
            </p>
          ) : null}
        </div>

        {championQuery.isPending ? (
          <div className="champion-grid" aria-label="Loading champions" aria-busy="true">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="card-skeleton" key={index} />
            ))}
          </div>
        ) : championQuery.isError ? (
          <StatusPanel
            kind="error"
            title="The archive is unavailable"
            message={championQuery.error.message}
            action={{ label: 'Try again', onClick: () => void championQuery.refetch() }}
          />
        ) : champions.length === 0 ? (
          <StatusPanel
            kind="empty"
            title="No champions found"
            message="Try another spelling or remove a class filter."
            action={{ label: 'Clear filters', onClick: clearFilters }}
          />
        ) : (
          <div className="champion-grid">
            {champions.map((champion) => (
              <ChampionCard
                key={champion.id}
                champion={champion}
                version={championQuery.data.version}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
