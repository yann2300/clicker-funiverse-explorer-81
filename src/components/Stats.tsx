
import React from 'react';
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AnimatedCounter from './AnimatedCounter';
import StatsBreakdown from './StatsBreakdown';

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
    <div className="glass-panel rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-steamgifts-text flex items-center gap-2">
          Stats
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <QuestionMarkCircledIcon className="w-4 h-4 text-steamgifts-text-light cursor-help" />
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
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-sm text-steamgifts-text-light">Current Points:</div>
          <div className="text-xl font-bold text-steamgifts-text tabular-nums">
            <AnimatedCounter value={Math.floor(points)} />
          </div>
        </div>
        
        <div>
          <div className="text-sm text-steamgifts-text-light">Per Click:</div>
          <div className="text-xl font-bold text-steamgifts-text tabular-nums">
            <AnimatedCounter value={pointsPerClick} decimals={1} />
          </div>
        </div>
        
        <div>
          <div className="text-sm text-steamgifts-text-light">Per Second:</div>
          <div className="text-xl font-bold text-steamgifts-text tabular-nums">
            <AnimatedCounter value={pointsPerSecond} decimals={1} />
          </div>
        </div>
        
        <div>
          <div className="text-sm text-steamgifts-text-light">Total Clicks:</div>
          <div className="text-xl font-bold text-steamgifts-text tabular-nums">
            <AnimatedCounter value={totalClicks} />
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-sm text-steamgifts-text-light">Total Points Earned:</div>
        <div className="text-xl font-bold text-steamgifts-text tabular-nums">
          <AnimatedCounter value={Math.floor(totalPoints)} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
