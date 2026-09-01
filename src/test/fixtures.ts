import type { ChampionDetail, ChampionSummary } from '../types/lol';

const image = {
  full: 'Ahri.png',
  sprite: 'champion0.png',
  group: 'champion',
  x: 0,
  y: 0,
  w: 48,
  h: 48,
};

const stats = {
  hp: 590,
  hpperlevel: 104,
  mp: 418,
  mpperlevel: 25,
  movespeed: 330,
  armor: 21,
  armorperlevel: 4.7,
  spellblock: 30,
  spellblockperlevel: 1.3,
  attackrange: 550,
  hpregen: 2.5,
  hpregenperlevel: 0.6,
  mpregen: 8,
  mpregenperlevel: 0.8,
  crit: 0,
  critperlevel: 0,
  attackdamage: 53,
  attackdamageperlevel: 3,
  attackspeedperlevel: 2.2,
  attackspeed: 0.668,
};

export const ahriSummary: ChampionSummary = {
  id: 'Ahri',
  key: '103',
  name: 'Ahri',
  title: 'the Nine-Tailed Fox',
  blurb: 'A fox-like vastaya.',
  info: { attack: 3, defense: 4, magic: 8, difficulty: 5 },
  image,
  tags: ['Mage', 'Assassin'],
  partype: 'Mana',
  stats,
};

export const garenSummary: ChampionSummary = {
  ...ahriSummary,
  id: 'Garen',
  key: '86',
  name: 'Garen',
  title: 'The Might of Demacia',
  image: { ...image, full: 'Garen.png' },
  tags: ['Fighter', 'Tank'],
  partype: 'None',
};

export const ahriDetail: ChampionDetail = {
  ...ahriSummary,
  lore: 'Innately connected to the magic of the spirit realm, Ahri is a mysterious vastaya.',
  allytips: [],
  enemytips: [],
  skins: [{ id: '103000', num: 0, name: 'default', chromas: true }],
  passive: {
    name: 'Essence Theft',
    description: 'Ahri heals after taking down enemies.',
    image: { ...image, full: 'Ahri_SoulEater2.png', group: 'passive' },
  },
  spells: [
    {
      id: 'AhriQ',
      name: 'Orb of Deception',
      description: 'Ahri sends out and pulls back her orb.',
      tooltip: '<mainText>Deals <magicDamage>magic damage</magicDamage>.</mainText>',
      maxrank: 5,
      cooldown: [7, 7, 7, 7, 7],
      cooldownBurn: '7',
      cost: [55, 65, 75, 85, 95],
      costBurn: '55/65/75/85/95',
      costType: ' Mana',
      range: [970, 970, 970, 970, 970],
      rangeBurn: '970',
      image: { ...image, full: 'AhriQ.png', group: 'spell' },
    },
  ],
};
