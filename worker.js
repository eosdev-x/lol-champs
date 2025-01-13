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
        
        // Fetch champion statistics from u.gg API
        const region = url.searchParams.get('region') || 'world';
        const rank = url.searchParams.get('rank') || 'platinum_plus';
        const patch = latestVersion.split('.').slice(0, 2).join('.');
        
        const uggResponse = await fetch(
          `https://u.gg/api/champions/${championId}/stats?region=${region}&rank=${rank}&patch=${patch}`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0',
              'Accept': 'application/json',
            }
          }
        );

        if (!uggResponse.ok) {
          // If u.gg API fails, return mock data
          return new Response(JSON.stringify({
            winRate: 50 + (Math.random() * 5 - 2.5), // 47.5-52.5%
            pickRate: 5 + (Math.random() * 10), // 5-15%
            banRate: 2 + (Math.random() * 8), // 2-10%
            tier: ['S+', 'S', 'A', 'B', 'C'][Math.floor(Math.random() * 5)],
            recommendedItems: [
              { id: '3153', name: 'Blade of the Ruined King', image: { full: '3153.png' } },
              { id: '6672', name: 'Kraken Slayer', image: { full: '6672.png' } },
              { id: '3046', name: 'Phantom Dancer', image: { full: '3046.png' } },
              { id: '3031', name: 'Infinity Edge', image: { full: '3031.png' } },
              { id: '3072', name: 'Bloodthirster', image: { full: '3072.png' } },
              { id: '3006', name: 'Berserker\'s Greaves', image: { full: '3006.png' } },
            ],
            recommendedRunes: []
          }), {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
          });
        }

        const metaData = await uggResponse.json();
        return new Response(JSON.stringify(metaData), {
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