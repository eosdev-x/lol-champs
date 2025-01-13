import { Trophy, Star, Activity } from 'lucide-react';
import type { Summoner, RankInfo } from '../types/lol';

interface SummonerProfileProps {
  summoner: Summoner;
  rank?: RankInfo;
}

export default function SummonerProfile({ summoner, rank }: SummonerProfileProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg transform hover:scale-102 transition-all">
      <div className="flex items-center space-x-4">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${summoner.profileIconId}.png`}
          alt="Profile Icon"
          className="w-24 h-24 rounded-full border-4 border-blue-500"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-100">{summoner.name}</h2>
          <p className="text-gray-400">Level {summoner.summonerLevel}</p>
          {rank && (
            <div className="flex items-center mt-2 space-x-2">
              <Trophy className="text-yellow-500" size={20} />
              <span className="text-gray-200">
                {rank.tier} {rank.rank} - {rank.leaguePoints} LP
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}