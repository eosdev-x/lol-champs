import { useState } from 'react';
import type { Match } from '../types/lol';

interface MatchHistoryProps {
  matches: Match[];
}

export default function MatchHistory({ matches }: MatchHistoryProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.metadata.matchId}
          className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-all"
          onClick={() => setSelectedMatch(match)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match.info.participants[0].championName}.png`}
                alt={match.info.participants[0].championName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-100">
                  {match.info.participants[0].championName}
                </h3>
                <p className="text-gray-400">
                  {match.info.participants[0].kills}/
                  {match.info.participants[0].deaths}/
                  {match.info.participants[0].assists}
                </p>
              </div>
            </div>
            <span className="text-gray-400">
              {new Date(match.info.gameCreation).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}