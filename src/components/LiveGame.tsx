import { Shield, Swords } from 'lucide-react';
import type { LiveGame } from '../types/lol';

interface LiveGameProps {
  game: LiveGame;
}

export default function LiveGame({ game }: LiveGameProps) {
  const blueTeam = game.participants.filter(p => p.teamId === 100);
  const redTeam = game.participants.filter(p => p.teamId === 200);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Live Game</h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-500">Blue Team</h3>
          </div>
          {blueTeam.map(player => (
            <div key={player.summonerName} className="mb-2 text-gray-300">
              {player.summonerName}
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Swords className="text-red-500" />
            <h3 className="text-lg font-semibold text-red-500">Red Team</h3>
          </div>
          {redTeam.map(player => (
            <div key={player.summonerName} className="mb-2 text-gray-300">
              {player.summonerName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}