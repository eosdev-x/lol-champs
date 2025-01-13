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

    const abilities = championData.spells.map((spell: any, index: number) => ({
      id: ['Q', 'W', 'E', 'R'][index],
      name: spell.name,
      description: spell.description,
      icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`,
    }));

    // Add passive ability
    abilities.unshift({
      id: 'P',
      name: championData.passive.name,
      description: championData.passive.description,
      icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${championData.passive.image.full}`,
    });

    return {
      meta: {
        winRate: metaData.winRate,
        pickRate: metaData.pickRate,
        banRate: metaData.banRate,
        tier: metaData.tier,
      },
      abilities,
      builds: {
        items: metaData.recommendedItems?.map((item: any) => ({
          id: item.id,
          name: item.name,
          icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`,
        })) || [],
        runes: metaData.recommendedRunes?.map((rune: any) => ({
          id: rune.id,
          name: rune.name,
          icon: `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`,
        })) || [],
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch champion details');
  }
};