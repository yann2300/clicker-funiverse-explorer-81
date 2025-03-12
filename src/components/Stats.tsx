
import AnimatedCounter from './AnimatedCounter';
import { formatNumber } from '@/lib/gameUtils';
import { MousePointer, Timer, BarChart } from 'lucide-react';

interface StatsProps {
  points: number;
  pointsPerClick: number;
  pointsPerSecond: number;
  totalClicks: number;
  totalPoints: number;
}

const Stats = ({ 
  points, 
  pointsPerClick, 
  pointsPerSecond, 
  totalClicks, 
  totalPoints 
}: StatsProps) => {
  return (
    <div className="glass-panel rounded-2xl p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Current points */}
        <div className="flex flex-col items-center">
          <h1 className="text-lg text-game-text-secondary font-medium">Points</h1>
          <span className="text-4xl font-bold tracking-tight text-game-text">
            <AnimatedCounter value={points} duration={800} />
          </span>
        </div>
        
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-game-neutral-dark/30">
          {/* Points per click */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-game-text mb-1">
              <MousePointer size={16} className="mr-1 text-game-accent" />
              <span className="text-sm">Per Click</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-game-text">
              <AnimatedCounter value={pointsPerClick} duration={800} />
            </span>
          </div>
          
          {/* Points per second */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-game-text mb-1">
              <Timer size={16} className="mr-1 text-amber-500" />
              <span className="text-sm">Per Second</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-game-text">
              <AnimatedCounter value={pointsPerSecond} duration={800} />
            </span>
          </div>
        </div>
        
        {/* Additional stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-game-neutral-dark/30">
          {/* Total clicks */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-game-text-secondary mb-1">
              <MousePointer size={14} className="mr-1" />
              <span className="text-xs">Total Clicks</span>
            </div>
            <span className="text-base font-medium text-game-text">
              {formatNumber(totalClicks)}
            </span>
          </div>
          
          {/* All time points */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-game-text-secondary mb-1">
              <BarChart size={14} className="mr-1" />
              <span className="text-xs">All-time Points</span>
            </div>
            <span className="text-base font-medium text-game-text">
              {formatNumber(totalPoints)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
