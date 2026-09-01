import type { ChampionPassive, ChampionSpell } from '../types/lol';
import { riotHtmlToText } from '../lib/text';

interface AbilityCardProps {
  ability: ChampionPassive | ChampionSpell;
  slot: 'P' | 'Q' | 'W' | 'E' | 'R';
  version: string;
  kind: 'passive' | 'spell';
}

function isSpell(ability: ChampionPassive | ChampionSpell): ability is ChampionSpell {
  return 'tooltip' in ability;
}

export function AbilityCard({ ability, slot, version, kind }: AbilityCardProps) {
  const folder = kind === 'passive' ? 'passive' : 'spell';
  const description = isSpell(ability)
    ? riotHtmlToText(ability.tooltip || ability.description)
    : riotHtmlToText(ability.description);
  const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/${folder}/${ability.image.full}`;

  return (
    <article className="ability-card">
      <div className="ability-icon">
        <img src={iconUrl} alt={`${ability.name} ability icon`} loading="lazy" />
        <span aria-label={`${slot} ability`}>{slot}</span>
      </div>
      <div className="ability-content">
        <div className="ability-heading">
          <div>
            <p>{kind === 'passive' ? 'Passive' : `Ability ${slot}`}</p>
            <h3>{ability.name}</h3>
          </div>
          {isSpell(ability) ? (
            <dl className="ability-meta">
              <div><dt>Cooldown</dt><dd>{ability.cooldownBurn || '—'}</dd></div>
              <div><dt>Cost</dt><dd>{ability.costBurn === '0' ? 'None' : ability.costBurn}</dd></div>
            </dl>
          ) : null}
        </div>
        <p className="ability-description">{description}</p>
      </div>
    </article>
  );
}
