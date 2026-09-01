import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import {
  Activity,
  ArrowLeft,
  Gauge,
  Heart,
  Shield,
  Sparkles,
  Swords,
  Target,
  Waves,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { fetchChampion } from '../api/lolApi';
import { AbilityCard } from '../components/AbilityCard';
import { StatusPanel } from '../components/StatusPanel';
import { statsAtLevel } from '../lib/stats';

const ABILITY_SLOTS = ['Q', 'W', 'E', 'R'] as const;

function formatStat(value: number, decimals = 0): string {
  return value.toFixed(decimals).replace(/\.0+$/u, '');
}

export function ChampionDetailPage() {
  const { id } = useParams({ from: '/champion/$id' });
  const [level, setLevel] = useState(1);
  const championQuery = useQuery({
    queryKey: ['champion', id],
    queryFn: ({ signal }) => fetchChampion(id, signal),
    staleTime: 1000 * 60 * 60,
  });
  const champion = championQuery.data?.champion;
  const scaledStats = useMemo(
    () => (champion ? statsAtLevel(champion.stats, level) : null),
    [champion, level],
  );

  if (championQuery.isPending) {
    return (
      <div className="detail-loading" aria-busy="true">
        <div className="detail-skeleton" />
        <p>Opening the champion archive…</p>
      </div>
    );
  }

  if (championQuery.isError || !champion || !scaledStats) {
    return (
      <div className="detail-status-wrap">
        <StatusPanel
          kind="error"
          title="Champion record unavailable"
          message={championQuery.error?.message ?? 'This champion could not be found.'}
          action={{ label: 'Try again', onClick: () => void championQuery.refetch() }}
        />
        <Link to="/" className="back-link"><ArrowLeft size={16} /> Return to all champions</Link>
      </div>
    );
  }

  const { version } = championQuery.data;
  const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;

  return (
    <article className="champion-detail">
      <header className="detail-hero">
        <img src={splashUrl} alt={`${champion.name} splash artwork`} />
        <div className="detail-overlay" />
        <div className="detail-hero-content page-shell">
          <Link to="/" className="back-link"><ArrowLeft size={16} /> All champions</Link>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow">{champion.tags.join(' · ')}</p>
            <h1>{champion.name}</h1>
            <p className="champion-title">{champion.title}</p>
          </motion.div>
        </div>
      </header>

      <div className="page-shell detail-body">
        <section className="lore-section" aria-labelledby="lore-heading">
          <div>
            <p className="eyebrow">Biography</p>
            <h2 id="lore-heading">Lore</h2>
          </div>
          <p>{champion.lore}</p>
        </section>

        <section className="identity-grid" aria-label="Champion profile">
          <div><Sparkles aria-hidden="true" /><span>Resource</span><strong>{champion.partype || 'None'}</strong></div>
          <div><Target aria-hidden="true" /><span>Attack range</span><strong>{champion.stats.attackrange}</strong></div>
          <div><Gauge aria-hidden="true" /><span>Move speed</span><strong>{champion.stats.movespeed}</strong></div>
          <div><Waves aria-hidden="true" /><span>Difficulty</span><strong>{champion.info.difficulty} / 10</strong></div>
        </section>

        <section className="stats-section" aria-labelledby="stats-heading">
          <div className="section-heading level-heading">
            <div>
              <p className="eyebrow">Growth profile</p>
              <h2 id="stats-heading">Combat stats</h2>
            </div>
            <label className="level-control">
              <span>Level <strong>{level}</strong></span>
              <input
                type="range"
                min="1"
                max="18"
                value={level}
                onChange={(event) => setLevel(Number(event.target.value))}
                aria-label="Champion level"
              />
            </label>
          </div>
          <dl className="stat-grid" aria-live="polite">
            <div><dt><Heart aria-hidden="true" /> Health</dt><dd>{formatStat(scaledStats.hp)}</dd></div>
            <div><dt><Sparkles aria-hidden="true" /> {champion.partype || 'Resource'}</dt><dd>{formatStat(scaledStats.mp)}</dd></div>
            <div><dt><Shield aria-hidden="true" /> Armor</dt><dd>{formatStat(scaledStats.armor, 1)}</dd></div>
            <div><dt><Activity aria-hidden="true" /> Magic resist</dt><dd>{formatStat(scaledStats.magicResist, 1)}</dd></div>
            <div><dt><Swords aria-hidden="true" /> Attack damage</dt><dd>{formatStat(scaledStats.attackDamage, 1)}</dd></div>
            <div><dt><Gauge aria-hidden="true" /> Attack speed</dt><dd>{formatStat(scaledStats.attackSpeed, 3)}</dd></div>
          </dl>
        </section>

        <section className="abilities-section" aria-labelledby="abilities-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Kit</p>
              <h2 id="abilities-heading">Abilities</h2>
            </div>
            <p>Patch {version}</p>
          </div>
          <div className="ability-list">
            <AbilityCard ability={champion.passive} slot="P" version={version} kind="passive" />
            {champion.spells.map((spell, index) => (
              <AbilityCard
                key={spell.id}
                ability={spell}
                slot={ABILITY_SLOTS[index] ?? 'R'}
                version={version}
                kind="spell"
              />
            ))}
          </div>
        </section>

        <section className="skins-section" aria-labelledby="skins-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Collection</p>
              <h2 id="skins-heading">Skins</h2>
            </div>
            <p>{champion.skins.length} available</p>
          </div>
          <div className="skins-gallery">
            {champion.skins.map((skin) => {
              const skinName = skin.name === 'default' ? champion.name : skin.name;
              const skinUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${skin.num}.jpg`;
              return (
                <figure key={skin.id}>
                  <img src={skinUrl} alt={`${skinName} splash artwork`} loading="lazy" />
                  <figcaption>{skinName}</figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      </div>
    </article>
  );
}
