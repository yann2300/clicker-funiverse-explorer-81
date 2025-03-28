import React from 'react';
import { MousePointerClick } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AnimatedCounter from './AnimatedCounter';
import StatsBreakdown from './StatsBreakdown';
import { formatNumber } from '@/lib/gameUtils';

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
  surgeMode?: boolean;
}

const Stats: React.FC<StatsProps> = ({
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
  surgeMode = false
}) => {
  return (
    <div className="glass-panel rounded-lg p-4 text-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <h1 className="text-3xl font-bold text-center mb-1">
                {formatNumber(points)}
              </h1>
              <h2 className="text-xl font-medium text-steamgifts-text-light mb-2">
                points
              </h2>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="p-0 bg-white">
            <StatsBreakdown 
              rawPointsPerClick={rawPointsPerClick}
              rawPointsPerSecond={rawPointsPerSecond}
              pointsMultiplier={pointsMultiplier}
              clickValueBoost={clickValueBoost}
              passiveBoost={passiveBoost}
              surgeModeChance={surgeModeChance}
              surgeTimeBonus={surgeTimeBonus}
              surgeMode={surgeMode}
              totalClicks={totalClicks}
              totalPoints={totalPoints}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="mt-3 flex items-center justify-center text-steamgifts-text-light gap-1">
        <MousePointerClick size={14} className="text-game-accent" />
        <span className="font-medium text-lg">
          {formatNumber(pointsPerSecond)}/second
        </span>
      </div>
    </div>
  );
};

export default Stats;
