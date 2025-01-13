import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sword, Shield, Heart, Zap, Percent, Users, Star, Brain } from 'lucide-react';
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
                    {/* Combat Ratings */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                        <Sword className="text-red-400" />
                        <div>
                          <p className="text-sm text-gray-300">Damage</p>
                          <p className="text-xl font-bold">{championDetail.meta.ratings.damage}</p>
                        </div>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                        <Shield className="text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-300">Toughness</p>
                          <p className="text-xl font-bold">{championDetail.meta.ratings.toughness}</p>
                        </div>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                        <Zap className="text-yellow-400" />
                        <div>
                          <p className="text-sm text-gray-300">Mobility</p>
                          <p className="text-xl font-bold">{championDetail.meta.ratings.mobility}</p>
                        </div>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                        <Star className="text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-300">Utility</p>
                          <p className="text-xl font-bold">{championDetail.meta.ratings.utility}</p>
                        </div>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                        <Brain className="text-orange-400" />
                        <div>
                          <p className="text-sm text-gray-300">Difficulty</p>
                          <p className="text-xl font-bold">{championDetail.meta.ratings.difficulty}</p>
                        </div>
                      </div>
                    </div>

                    {/* Champion Stats */}
                    <div className="bg-gray-700/30 p-6 rounded-lg mb-8">
                      <h3 className="text-xl font-bold mb-4">Level 18 Stats</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-gray-400 mb-1">Health</p>
                          <p className="text-2xl font-bold">{championDetail.meta.maxStats.health}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">{championDetail.meta.resource}</p>
                          <p className="text-2xl font-bold">{championDetail.meta.maxStats.mana}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Attack Damage</p>
                          <p className="text-2xl font-bold">{championDetail.meta.maxStats.attackDamage}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Armor</p>
                          <p className="text-2xl font-bold">{championDetail.meta.maxStats.armor}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Magic Resist</p>
                          <p className="text-2xl font-bold">{championDetail.meta.maxStats.magicResist}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Attack Speed</p>
                          <p className="text-2xl font-bold">{championDetail.meta.maxStats.attackSpeed.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Abilities */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Abilities</h3>
                      {championDetail.meta.abilities.map((ability, index) => (
                        <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                          <h4 className="font-bold mb-2">{ability.name}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Cooldown</p>
                              <p>{ability.cooldown}s {ability.cooldownPerLevel > 0 ? `(${ability.cooldownPerLevel}s per level)` : ''}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Cost</p>
                              <p>{ability.resourceCost} {ability.resource}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex justify-between text-sm text-gray-400">
                        <div>
                          <p>Playstyle: <span className="text-white">{championDetail.meta.style}</span></p>
                          <p>Roles: <span className="text-white">{championDetail.meta.roles.join(', ')}</span></p>
                        </div>
                        <div className="text-right">
                          <p>Current Patch: <span className="text-white">{championDetail.meta.patch}</span></p>
                        </div>
                      </div>
                    </div>
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
