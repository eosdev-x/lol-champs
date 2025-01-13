import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sword, Shield, Heart, Zap, Percent, Users } from 'lucide-react';
import type { Champion, ChampionDetail } from '../types/lol';

interface ChampionModalProps {
  champion: Champion | null;
  championDetail: ChampionDetail | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}

const ChampionModal: React.FC<ChampionModalProps> = ({
  champion,
  championDetail,
  isOpen,
  onClose,
  loading = false,
  error = null,
}) => {
  if (!champion) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="h-64 relative">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`}
                  alt={champion.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-800 to-transparent p-8">
                  <h2 className="text-4xl font-bold">{champion.name}</h2>
                  <p className="text-xl text-gray-300">{champion.title}</p>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-400">Loading champion details...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-900/50 text-red-200 p-6 rounded-lg text-center">
                    <p>{error}</p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : championDetail ? (
                  <>
                    {/* Meta Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                        <Percent className="text-green-400" />
                        <div>
                          <p className="text-sm text-gray-300">Win Rate</p>
                          <p className="text-xl font-bold">{championDetail.meta.winRate}%</p>
                        </div>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                        <Users className="text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-300">Pick Rate</p>
                          <p className="text-xl font-bold">{championDetail.meta.pickRate}%</p>
                        </div>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                        <Shield className="text-yellow-400" />
                        <div>
                          <p className="text-sm text-gray-300">Ban Rate</p>
                          <p className="text-xl font-bold">{championDetail.meta.banRate}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Base Stats */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Base Stats</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Heart className="text-red-400" />
                          <div>
                            <p className="text-sm text-gray-300">Health</p>
                            <p>{champion.stats.hp} (+{champion.stats.hpperlevel})</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-300">Armor</p>
                            <p>{champion.stats.armor} (+{champion.stats.armorperlevel})</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sword className="text-yellow-400" />
                          <div>
                            <p className="text-sm text-gray-300">Attack Damage</p>
                            <p>{champion.stats.attackdamage} (+{champion.stats.attackdamageperlevel})</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="text-purple-400" />
                          <div>
                            <p className="text-sm text-gray-300">Attack Speed</p>
                            <p>{champion.stats.attackspeed} (+{champion.stats.attackspeedperlevel}%)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Abilities */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Abilities</h3>
                      <div className="grid gap-4">
                        {championDetail.abilities.map((ability) => (
                          <div key={ability.id} className="bg-gray-700/50 p-4 rounded-lg">
                            <div className="flex items-start gap-4">
                              <img
                                src={ability.icon}
                                alt={ability.name}
                                className="w-16 h-16 rounded-lg"
                              />
                              <div>
                                <h4 className="font-bold">{ability.name}</h4>
                                <p className="text-gray-300">{ability.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Builds */}
                    {championDetail.builds.items.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-4">Recommended Build</h3>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {championDetail.builds.items.map((item) => (
                              <div key={item.id} className="relative group">
                                <img
                                  src={item.icon}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-lg"
                                />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                  {item.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChampionModal;
