import { Link } from '@tanstack/react-router';
import { Heart, Shield, Swords, Wind } from 'lucide-react';
import type { ChampionSummary } from '../types/lol';

interface ChampionCardProps {
  champion: ChampionSummary;
  version: string;
}

export function ChampionCard({ champion, version }: ChampionCardProps) {
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`;

  return (
    <article className="champion-card">
      <Link
        to="/champion/$id"
        params={{ id: champion.id }}
        className="champion-card-link"
        aria-label={`View ${champion.name}, ${champion.title}`}
      >
        <div className="portrait-frame">
          <img src={imageUrl} alt={`${champion.name} champion portrait`} loading="lazy" />
          <div className="portrait-vignette" />
          <div className="champion-identity">
            <h2>{champion.name}</h2>
            <p>{champion.title}</p>
          </div>
        </div>
        <div className="card-body">
          <div className="role-list" aria-label={`${champion.name} classes`}>
            {champion.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <dl className="compact-stats">
            <div title="Health">
              <dt><Heart aria-hidden="true" size={15} /><span className="sr-only">Health</span></dt>
              <dd>{champion.stats.hp}</dd>
            </div>
            <div title="Armor">
              <dt><Shield aria-hidden="true" size={15} /><span className="sr-only">Armor</span></dt>
              <dd>{champion.stats.armor}</dd>
            </div>
            <div title="Attack damage">
              <dt><Swords aria-hidden="true" size={15} /><span className="sr-only">Attack damage</span></dt>
              <dd>{champion.stats.attackdamage}</dd>
            </div>
            <div title="Move speed">
              <dt><Wind aria-hidden="true" size={15} /><span className="sr-only">Move speed</span></dt>
              <dd>{champion.stats.movespeed}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}
