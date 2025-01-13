import type { Champion, ChampionResponse, ChampionDetail } from '../types/lol';

const API_BASE = 'https://lol-api.imtux.workers.dev';

const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const handleApiError = (status: number, endpoint: string) => {
  switch (status) {
    case 400:
      throw new Error('Invalid request format');
    case 403:
      throw new Error('Authentication failed - please check your API key');
    case 404:
      throw new Error(`${endpoint} not found`);
    case 429:
      throw new Error('Rate limit exceeded');
    default:
      throw new Error(`API request failed with status ${status}`);
  }
};

export const searchChampions = async (query: string): Promise<[Champion[], string]> => {
  try {
    const response = await fetch(
      `${API_BASE}/champions`,
      {
        method: 'GET',
        headers: API_HEADERS,
        mode: 'cors'
      }
    );

    if (!response.ok) {
      handleApiError(response.status, 'Champions');
    }

    const data: ChampionResponse = await response.json();
    const champions = Object.values(data.data);
    
    if (!query) return [champions, data.version];
    
    return [
      champions.filter(champion => 
        champion.name.toLowerCase().includes(query.toLowerCase()) ||
        champion.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ),
      data.version
    ];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch champions');
  }
};

export const getChampionDetails = async (championId: string, version: string): Promise<ChampionDetail> => {
  try {
    // Fetch champion abilities and lore
    const champResponse = await fetch(
      `${API_BASE}/champions/${championId}`,
      {
        method: 'GET',
        headers: API_HEADERS,
        mode: 'cors'
      }
    );

    if (!champResponse.ok) {
      handleApiError(champResponse.status, 'Champion Details');
    }

    // Fetch champion meta data
    const metaResponse = await fetch(
      `${API_BASE}/champions/${championId}/meta`,
      {
        method: 'GET',
        headers: API_HEADERS,
        mode: 'cors'
      }
    );

    if (!metaResponse.ok) {
      handleApiError(metaResponse.status, 'Champion Meta');
    }

    const [champData, metaData] = await Promise.all([
      champResponse.json(),
      metaResponse.json()
    ]);

    // The champion data is nested under data.{championId}
    const championData = champData.data[championId];
    if (!championData) {
      throw new Error('Champion data structure is invalid');
    }

    return {
      meta: {
        ratings: {
          damage: championData.info.attack,
          toughness: (championData.info.defense + championData.stats.armor) / 2,
          mobility: championData.info.mobility || championData.stats.movespeed / 4,
          utility: championData.info.magic,
          difficulty: championData.info.difficulty,
        },
        
        maxStats: {
          health: championData.stats.hp + (championData.stats.hpperlevel * 17),
          mana: championData.stats.mp + (championData.stats.mpperlevel * 17),
          armor: championData.stats.armor + (championData.stats.armorperlevel * 17),
          magicResist: championData.stats.spellblock + (championData.stats.spellblockperlevel * 17),
          attackDamage: championData.stats.attackdamage + (championData.stats.attackdamageperlevel * 17),
          attackSpeed: championData.stats.attackspeed + (championData.stats.attackspeedperlevel * 17),
        },
        
        abilities: championData.spells.map((spell: any) => ({
          name: spell.name,
          cooldown: spell.cooldown[0],
          cooldownPerLevel: spell.cooldown[spell.cooldown.length - 1] - spell.cooldown[0],
          resource: spell.costType,
          resourceCost: spell.cost[0],
        })),
        
        roles: championData.tags,
        resource: championData.partype,
        range: championData.stats.attackrange,
        moveSpeed: championData.stats.movespeed,
        
        patch: version,
        style: determinePlaystyle(championData.info),
        
        recommendedItems: metaData.recommendedItems || [],
        recommendedRunes: [],
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch champion details');
  }
};

function determinePlaystyle(info: any) {
  if (info.attack > 7) return 'Burst Damage';
  if (info.defense > 7) return 'Tank';
  if (info.mobility > 7) return 'Mobile';
  if (info.magic > 7) return 'Utility';
  return 'Balanced';
}