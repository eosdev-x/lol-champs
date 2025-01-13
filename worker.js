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
    
    // Handle champion data request
    if (path === '/champions') {
      try {
        // Fetch latest version first
        const versionResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionResponse.json();
        const latestVersion = versions[0];

        // Fetch champion data
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
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch champion data' }), 
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }

    // Handle other Riot API requests
    const region = url.searchParams.get('region') || 'na1';
    const riotUrl = `https://${region}.api.riotgames.com${path}`;
    
    try {
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
        JSON.stringify({ error: 'Failed to fetch data from Riot API' }), 
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