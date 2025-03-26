
import AnimatedCounter from './AnimatedCounter';
import { formatNumber } from '@/lib/gameUtils';
import { MousePointer, Timer, BarChart, BadgePercent, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StatsTooltip from './StatsTooltip';

interface StatsProps {
  points: number;
  pointsPerClick: number;
  pointsPerSecond: number;
  totalClicks: number;
  totalPoints: number;
  rawPointsPerClick: number;
  rawPointsPerSecond: number;
  pointsMultiplier: number;
  surgeTimeBonus: number;
  clickValueBoost: number;
  passiveBoost: number;
  surgeModeChance: number;
  surgeMode: boolean;
}

const Stats = ({ 
  points, 
  pointsPerClick, 
  pointsPerSecond, 
  totalClicks, 
  totalPoints,
  rawPointsPerClick,
  rawPointsPerSecond,
  pointsMultiplier,
  surgeTimeBonus,
  clickValueBoost,
  passiveBoost,
  surgeModeChance,
  surgeMode
}: StatsProps) => {
  return (
    <div className="steamgifts-card p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Current points with tooltip */}
        <div className="flex flex-col items-center relative">
          <div className="flex items-center gap-2">
            <h1 className="text-lg text-steamgifts-text-light font-medium">Points</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-steamgifts-text-light hover:text-steamgifts-link focus:outline-none">
                    <Info size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="w-80 p-0" side="right">
                  <StatsTooltip
                    pointsPerClick={pointsPerClick}
                    rawPointsPerClick={rawPointsPerClick}
                    pointsPerSecond={pointsPerSecond}
                    rawPointsPerSecond={rawPointsPerSecond}
                    pointsMultiplier={pointsMultiplier}
                    surgeTimeBonus={surgeTimeBonus}
                    clickValueBoost={clickValueBoost}
                    passiveBoost={passiveBoost}
                    surgeModeChance={surgeModeChance}
                    surgeMode={surgeMode}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-4xl font-bold tracking-tight text-steamgifts-text">
            <AnimatedCounter value={points} duration={800} />
          </span>
        </div>
        
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-steamgifts-border">
          {/* Points per click */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-steamgifts-text mb-1">
              <MousePointer size={16} className="mr-1 text-steamgifts-link" />
              <span className="text-sm">Per Click</span>
              {pointsPerClick > 1 && <BadgePercent size={12} className="ml-1 text-steamgifts-link" />}
            </div>
            <span className="text-xl font-semibold tracking-tight text-steamgifts-text">
              <AnimatedCounter value={pointsPerClick} duration={800} />
            </span>
          </div>
          
          {/* Points per second */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-steamgifts-text mb-1">
              <Timer size={16} className="mr-1 text-steamgifts-primary" />
              <span className="text-sm">Per Second</span>
              {pointsPerSecond > 0 && <BadgePercent size={12} className="ml-1 text-steamgifts-link" />}
            </div>
            <span className="text-xl font-semibold tracking-tight text-steamgifts-text">
              <AnimatedCounter value={pointsPerSecond} duration={800} />
            </span>
          </div>
        </div>
        
        {/* Additional stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-steamgifts-border">
          {/* Total clicks */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-steamgifts-text-light mb-1">
              <MousePointer size={14} className="mr-1" />
              <span className="text-xs">Total Clicks</span>
            </div>
            <span className="text-base font-medium text-steamgifts-text">
              {formatNumber(totalClicks)}
            </span>
          </div>
          
          {/* All time points */}
          <div className="flex flex-col items-center">
            <div className="flex items-center text-steamgifts-text-light mb-1">
              <BarChart size={14} className="mr-1" />
              <span className="text-xs">All-time Points</span>
            </div>
            <span className="text-base font-medium text-steamgifts-text">
              {formatNumber(totalPoints)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
