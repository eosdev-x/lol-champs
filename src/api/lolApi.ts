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