
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
  level: number;
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
  surgeMode = false,
  level
}) => {
  return (
    <div className="bg-[#2f3540] rounded-b-md px-4 py-3 text-center w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help mb-2">
              <h1 className="text-2xl font-bold text-[#acb1b9]">
                {formatNumber(points)}P
              </h1>
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
      
      <div className="flex items-center justify-center gap-4 text-[#acb1b9]">
        <div className="flex items-center gap-1">
          <span className="text-sm">+{formatNumber(pointsPerClick)}/click</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm">+{formatNumber(pointsPerSecond)}/sec</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
