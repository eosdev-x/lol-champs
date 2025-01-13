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
        
        try {
          // Get champion data from Data Dragon (no rate limit)
          const championResponse = await fetch(
            `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${championId}.json`
          );

          if (!championResponse.ok) {
            throw new Error('Failed to fetch champion data');
          }

          const champData = await championResponse.json();
          const champion = champData.data[championId];

          // Calculate combat stats per level
          const statsPerLevel = {
            health: champion.stats.hp + (champion.stats.hpperlevel * 17),
            mana: champion.stats.mp + (champion.stats.mpperlevel * 17),
            armor: champion.stats.armor + (champion.stats.armorperlevel * 17),
            magicResist: champion.stats.spellblock + (champion.stats.spellblockperlevel * 17),
            attackDamage: champion.stats.attackdamage + (champion.stats.attackdamageperlevel * 17),
            attackSpeed: champion.stats.attackspeed + (champion.stats.attackspeedperlevel * 17),
          };

          // Calculate stat ratings (0-100 scale)
          const ratings = {
            damage: calculateRating(champion.info.attack),
            toughness: calculateRating((champion.info.defense + champion.stats.armor) / 2),
            mobility: calculateRating(champion.info.mobility || champion.stats.movespeed / 4),
            utility: calculateRating(champion.info.magic), // Using magic rating as proxy for utility
            difficulty: calculateRating(champion.info.difficulty),
          };

          // Get role-specific builds
          const roleBuilds = {
            Mage: {
              items: [
                { id: '6655', name: 'Luden\'s Tempest', image: { full: '6655.png' } },
                { id: '3089', name: 'Rabadon\'s Deathcap', image: { full: '3089.png' } },
                { id: '3157', name: 'Zhonya\'s Hourglass', image: { full: '3157.png' } },
                { id: '3020', name: 'Sorcerer\'s Shoes', image: { full: '3020.png' } },
                { id: '3165', name: 'Morellonomicon', image: { full: '3165.png' } },
                { id: '3135', name: 'Void Staff', image: { full: '3135.png' } },
              ]
            },
            Fighter: {
              items: [
                { id: '6631', name: 'Divine Sunderer', image: { full: '6631.png' } },
                { id: '3053', name: 'Sterak\'s Gage', image: { full: '3053.png' } },
                { id: '3111', name: 'Mercury\'s Treads', image: { full: '3111.png' } },
                { id: '3071', name: 'Black Cleaver', image: { full: '3071.png' } },
                { id: '3742', name: 'Dead Man\'s Plate', image: { full: '3742.png' } },
                { id: '3156', name: 'Maw of Malmortius', image: { full: '3156.png' } },
              ]
            },
            // ... (keep other role builds)
          };

          // Get recommended items based on role
          const primaryRole = champion.tags[0];
          const recommendedItems = roleBuilds[primaryRole]?.items || roleBuilds.Fighter.items;

          // Format ability cooldowns
          const abilityCooldowns = champion.spells.map(spell => ({
            name: spell.name,
            cooldown: spell.cooldown[0],
            cooldownPerLevel: spell.cooldown[spell.cooldown.length - 1] - spell.cooldown[0],
            resource: spell.costType,
            resourceCost: spell.cost[0]
          }));

          const metaData = {
            // Champion Identity
            title: champion.title,
            roles: champion.tags,
            resource: champion.partype,
            range: champion.stats.attackrange,
            moveSpeed: champion.stats.movespeed,
            
            // Combat Ratings (0-100)
            ratings,
            
            // Stats at level 18
            maxStats: statsPerLevel,
            
            // Ability Information
            abilities: abilityCooldowns,
            
            // Build Information
            recommendedItems,
            recommendedRunes: [],
            
            // Additional Info
            releaseYear: parseInt(champion.version),
            difficulty: champion.info.difficulty,
            style: determinePlaystyle(ratings),
            
            // Data Source
            dataSource: 'Official Riot API (Data Dragon)',
            patch: latestVersion
          };

          return new Response(JSON.stringify(metaData), {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
          });

        } catch (error) {
          console.error('Error fetching champion data:', error);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to fetch champion data',
              details: error.message
            }),
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

      // Handle other requests
      return new Response(
        JSON.stringify({ error: 'Invalid endpoint' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: error.message || 'Internal server error' }), 
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

// Helper functions
function calculateRating(value) {
  return Math.min(100, Math.max(0, value * 20)); // Convert 0-5 scale to 0-100
}

function determinePlaystyle(ratings) {
  if (ratings.damage > 70) return 'Burst Damage';
  if (ratings.toughness > 70) return 'Tank';
  if (ratings.mobility > 70) return 'Mobile';
  if (ratings.utility > 70) return 'Utility';
  return 'Balanced';
}