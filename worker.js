export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    
    try {
      // Fetch latest version first
      const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
      const versions = await versionResponse.json();
      const latestVersion = versions[0];

      // Handle base champion data request
      if (path === '/champions') {
        const championsResponse = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
        );

        if (!championsResponse.ok) {
          throw new Error('Failed to fetch champion data');
        }

        return new Response(championsResponse.body, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          },
        });
      }

      // Handle detailed champion data request
      const championMatch = path.match(/^\/champions\/([^\/]+)$/);
      if (championMatch) {
        const championId = championMatch[1];
        const championResponse = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${championId}.json`
        );

        if (!championResponse.ok) {
          throw new Error('Failed to fetch champion details');
        }

        return new Response(championResponse.body, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          },
        });
      }

      // Handle champion meta data request
      const metaMatch = path.match(/^\/champions\/([^\/]+)\/meta$/);
      if (metaMatch) {
        const championId = metaMatch[1];
        
        // Fetch champion data to determine role and playstyle
        const championResponse = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${championId}.json`
        );

        if (!championResponse.ok) {
          throw new Error('Failed to fetch champion data');
        }

        const champData = await championResponse.json();
        const champion = champData.data[championId];
        
        // Generate role-specific mock data
        const mockData = generateMockMetaData(champion);

        return new Response(JSON.stringify(mockData), {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          },
        });
      }

      // Handle other Riot API requests
      const region = url.searchParams.get('region') || 'na1';
      const riotUrl = `https://${region}.api.riotgames.com${path}`;
      
      const response = await fetch(riotUrl, {
        method: request.method,
        headers: {
          'X-Riot-Token': env.RIOT_API_KEY,
          'Content-Type': 'application/json',
        }
      });

      return new Response(response.body, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
      });

    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message || 'Failed to fetch data' }), 
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

function generateMockMetaData(champion) {
  const roleBuilds = {
    Mage: {
      items: [
        { id: '6655', name: 'Luden\'s Tempest', image: { full: '6655.png' } },
        { id: '3089', name: 'Rabadon\'s Deathcap', image: { full: '3089.png' } },
        { id: '3157', name: 'Zhonya\'s Hourglass', image: { full: '3157.png' } },
        { id: '3165', name: 'Morellonomicon', image: { full: '3165.png' } },
        { id: '3020', name: 'Sorcerer\'s Shoes', image: { full: '3020.png' } },
        { id: '3135', name: 'Void Staff', image: { full: '3135.png' } },
      ],
      winRate: 51.2,
    },
    Fighter: {
      items: [
        { id: '6631', name: 'Stridebreaker', image: { full: '6631.png' } },
        { id: '3053', name: 'Sterak\'s Gage', image: { full: '3053.png' } },
        { id: '3742', name: 'Dead Man\'s Plate', image: { full: '3742.png' } },
        { id: '3111', name: 'Mercury\'s Treads', image: { full: '3111.png' } },
        { id: '3071', name: 'Black Cleaver', image: { full: '3071.png' } },
        { id: '3156', name: 'Maw of Malmortius', image: { full: '3156.png' } },
      ],
      winRate: 49.8,
    },
    Assassin: {
      items: [
        { id: '6691', name: 'Duskblade of Draktharr', image: { full: '6691.png' } },
        { id: '3142', name: 'Youmuu\'s Ghostblade', image: { full: '3142.png' } },
        { id: '3814', name: 'Edge of Night', image: { full: '3814.png' } },
        { id: '3158', name: 'Ionian Boots of Lucidity', image: { full: '3158.png' } },
        { id: '3036', name: 'Lord Dominik\'s Regards', image: { full: '3036.png' } },
        { id: '6676', name: 'The Collector', image: { full: '6676.png' } },
      ],
      winRate: 50.5,
    },
    Marksman: {
      items: [
        { id: '6672', name: 'Kraken Slayer', image: { full: '6672.png' } },
        { id: '3046', name: 'Phantom Dancer', image: { full: '3046.png' } },
        { id: '3031', name: 'Infinity Edge', image: { full: '3031.png' } },
        { id: '3006', name: 'Berserker\'s Greaves', image: { full: '3006.png' } },
        { id: '3072', name: 'Bloodthirster', image: { full: '3072.png' } },
        { id: '3036', name: 'Lord Dominik\'s Regards', image: { full: '3036.png' } },
      ],
      winRate: 50.8,
    },
    Tank: {
      items: [
        { id: '3068', name: 'Sunfire Aegis', image: { full: '3068.png' } },
        { id: '3075', name: 'Thornmail', image: { full: '3075.png' } },
        { id: '3110', name: 'Frozen Heart', image: { full: '3110.png' } },
        { id: '3111', name: 'Mercury\'s Treads', image: { full: '3111.png' } },
        { id: '3193', name: 'Gargoyle Stoneplate', image: { full: '3193.png' } },
        { id: '3065', name: 'Spirit Visage', image: { full: '3065.png' } },
      ],
      winRate: 48.9,
    },
    Support: {
      items: [
        { id: '6617', name: 'Moonstone Renewer', image: { full: '6617.png' } },
        { id: '3504', name: 'Ardent Censer', image: { full: '3504.png' } },
        { id: '3011', name: 'Chemtech Putrifier', image: { full: '3011.png' } },
        { id: '3158', name: 'Ionian Boots of Lucidity', image: { full: '3158.png' } },
        { id: '3222', name: 'Mikael\'s Blessing', image: { full: '3222.png' } },
        { id: '3190', name: 'Locket of the Iron Solari', image: { full: '3190.png' } },
      ],
      winRate: 50.2,
    },
  };

  // Get primary role from champion tags
  const primaryRole = champion.tags[0];
  const buildData = roleBuilds[primaryRole] || roleBuilds.Fighter;

  // Generate slightly randomized stats based on role
  const baseWinRate = buildData.winRate + (Math.random() * 4 - 2); // ±2%
  const basePickRate = 5 + (Math.random() * 10); // 5-15%
  const baseBanRate = 2 + (Math.random() * 8); // 2-10%

  // Determine tier based on win rate and pick rate
  let tier;
  const score = baseWinRate * 0.7 + basePickRate * 0.3;
  if (score > 54) tier = 'S+';
  else if (score > 52) tier = 'S';
  else if (score > 50) tier = 'A';
  else if (score > 48) tier = 'B';
  else tier = 'C';

  return {
    winRate: parseFloat(baseWinRate.toFixed(1)),
    pickRate: parseFloat(basePickRate.toFixed(1)),
    banRate: parseFloat(baseBanRate.toFixed(1)),
    tier,
    recommendedItems: buildData.items,
    recommendedRunes: [], // We could add role-specific runes here as well
  };
}