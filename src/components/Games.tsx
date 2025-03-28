
import React from 'react';
import { Game } from '@/types/gameState';
import { Lock } from 'lucide-react';

interface GamesProps {
  games: Game[];
  userLevel: number;
}

const Games: React.FC<GamesProps> = ({ games, userLevel }) => {
  const handleGameClick = (game: Game) => {
    if (game.isUnlocked) {
      window.open(game.link, '_blank');
    }
  };

  return (
    <div className="glass-panel rounded-lg overflow-hidden">
      <div className="bg-[#2f3540] text-[#acb1b9] font-medium px-4 py-3 border-b border-[#44474e]">
        Available Games
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game)}
            className={`relative rounded overflow-hidden cursor-pointer transition-all duration-200 ${
              game.isUnlocked
                ? 'hover:scale-[1.03] hover:shadow-lg'
                : 'opacity-60 grayscale cursor-not-allowed'
            }`}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={game.imageUrl}
                alt={game.name}
                className="w-full h-full object-cover"
              />
              {!game.isUnlocked && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <Lock className="text-white/80" size={20} />
                    {game.unlockCondition.type === 'level' ? (
                      <span className="text-xs text-white/80">
                        Unlocks at level {game.unlockCondition.value}
                      </span>
                    ) : (
                      <span className="text-xs text-white/80">
                        Requires achievement
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-[#434a5a] text-white text-xs font-bold px-2 py-1 rounded">
                {game.pointsCost}P
              </div>
            </div>
            <div className="bg-white py-2 px-3">
              <div className="font-medium text-sm">{game.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
