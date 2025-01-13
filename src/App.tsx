import React, { useState } from 'react';
import { searchChampions, getChampionDetails } from './api/lolApi';
import SearchBar from './components/SearchBar';
import ChampionModal from './components/ChampionModal';
import type { Champion, ChampionDetail } from './types/lol';
import { Shield, Sword, Heart, Zap } from 'lucide-react';

function App() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [version, setVersion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [championDetail, setChampionDetail] = useState<ChampionDetail | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const [results, ver] = await searchChampions(query);
      setChampions(results);
      setVersion(ver);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChampionClick = async (champion: Champion) => {
    setSelectedChampion(champion);
    setDetailsLoading(true);
    setDetailsError(null);
    setChampionDetail(null);

    try {
      const details = await getChampionDetails(champion.id, version);
      setChampionDetail(details);
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : 'Failed to load champion details');
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Mama's LOL Search</h1>
        
        <SearchBar onSearch={handleSearch} />
        
        {loading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="mt-8 p-4 bg-red-900/50 rounded-lg text-center text-red-200">
            {error}
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {champions.map((champion) => (
            <div
              key={champion.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all cursor-pointer"
              onClick={() => handleChampionClick(champion)}
            >
              <div className="relative mb-4">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`}
                  alt={champion.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-bold">{champion.name}</h3>
                  <p className="text-gray-300">{champion.title}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {champion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Heart className="text-red-400" size={16} />
                    <span>{champion.stats.hp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="text-blue-400" size={16} />
                    <span>{champion.stats.armor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sword className="text-yellow-400" size={16} />
                    <span>{champion.stats.attackdamage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="text-purple-400" size={16} />
                    <span>{champion.stats.attackspeed}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ChampionModal
          champion={selectedChampion}
          championDetail={championDetail}
          isOpen={selectedChampion !== null}
          onClose={() => {
            setSelectedChampion(null);
            setChampionDetail(null);
            setDetailsError(null);
          }}
          loading={detailsLoading}
          error={detailsError}
        />
      </div>
    </div>
  );
}

export default App;