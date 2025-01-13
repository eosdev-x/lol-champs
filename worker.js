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
        const region = url.searchParams.get('region') || 'kr'; // Korea server for most accurate meta
        const queueType = url.searchParams.get('tier') || 'PLATINUM_PLUS';
        const queue = url.searchParams.get('queue') || 'RANKED_SOLO_5x5';

        // Get champion stats from Riot API
        const statsResponse = await fetch(
          `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${championId}`,
          {
            headers: {
              'X-Riot-Token': env.RIOT_API_KEY
            }
          }
        );

        // Get recommended builds from Riot's match history API
        const matchesResponse = await fetch(
          `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${championId}?queue=${queue}&type=ranked&start=0&count=100`,
          {
            headers: {
              'X-Riot-Token': env.RIOT_API_KEY
            }
          }
        );

        if (!statsResponse.ok || !matchesResponse.ok) {
          throw new Error('Failed to fetch champion statistics');
        }

        const [statsData, matchesData] = await Promise.all([
          statsResponse.json(),
          matchesResponse.json()
        ]);

        // Process match data to find most common builds
        const itemCounts = new Map();
        let totalGames = 0;
        let wins = 0;
        let bans = 0;

        for (const match of matchesData) {
          const participants = match.info.participants;
          const championParticipants = participants.filter(p => p.championId === parseInt(championId));
          
          totalGames += championParticipants.length;
          wins += championParticipants.filter(p => p.win).length;
          bans += match.info.bannedChampions.filter(b => b.championId === parseInt(championId)).length;

          // Count item frequencies
          for (const participant of championParticipants) {
            if (participant.win) { // Only count winning builds
              for (let i = 0; i < 6; i++) {
                const itemId = participant[`item${i}`];
                if (itemId && itemId !== 0) {
                  itemCounts.set(itemId, (itemCounts.get(itemId) || 0) + 1);
                }
              }
            }
          }
        }

        // Get top 6 most common items
        const sortedItems = Array.from(itemCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);

        // Fetch item data to get names and images
        const itemsResponse = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`
        );
        const itemsData = await itemsResponse.json();

        const recommendedItems = sortedItems.map(([itemId]) => ({
          id: itemId.toString(),
          name: itemsData.data[itemId].name,
          image: { full: `${itemId}.png` }
        }));

        // Calculate statistics
        const winRate = (wins / totalGames) * 100;
        const pickRate = (totalGames / matchesData.length) * 100;
        const banRate = (bans / matchesData.length) * 100;

        // Determine tier based on win rate and pick rate
        let tier;
        const score = winRate * 0.7 + pickRate * 0.3;
        if (score > 54) tier = 'S+';
        else if (score > 52) tier = 'S';
        else if (score > 50) tier = 'A';
        else if (score > 48) tier = 'B';
        else tier = 'C';

        const metaData = {
          winRate: parseFloat(winRate.toFixed(1)),
          pickRate: parseFloat(pickRate.toFixed(1)),
          banRate: parseFloat(banRate.toFixed(1)),
          tier,
          recommendedItems,
          recommendedRunes: [] // Could add rune data from match history as well
        };

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