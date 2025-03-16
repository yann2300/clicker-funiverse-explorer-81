
import React from 'react';
import { formatNumber } from '@/lib/gameUtils';
import { BadgeCheck, BadgePercent, Zap, Activity } from 'lucide-react';

interface StatsTooltipProps {
  pointsPerClick: number;
  rawPointsPerClick: number;
  pointsPerSecond: number;
  rawPointsPerSecond: number;
  pointsMultiplier: number;
  surgeTimeBonus: number;
  clickValueBoost: number;
  passiveBoost: number;
  surgeModeChance: number;
  surgeMode: boolean;
}

const StatsTooltip: React.FC<StatsTooltipProps> = ({
  pointsPerClick,
  rawPointsPerClick,
  pointsPerSecond,
  rawPointsPerSecond,
  pointsMultiplier,
  surgeTimeBonus,
  clickValueBoost,
  passiveBoost,
  surgeModeChance,
  surgeMode
}) => {
  // Calculate the bonus amounts
  const clickBonus = pointsPerClick - rawPointsPerClick;
  const passiveBonus = pointsPerSecond - rawPointsPerSecond;
  
  // Define a helper function for displaying stat rows
  const StatRow = ({ label, value, rawValue, icon }: { 
    label: string, 
    value: number,
    rawValue: number,
    icon: React.ReactNode,
  }) => (
    <div className="flex items-center justify-between py-1 border-b border-game-neutral-dark/10 last:border-0">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold">{formatNumber(value)}</span>
        {value !== rawValue && (
          <span className="text-xs text-green-600">
            (+{formatNumber(value - rawValue)})
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="glass-panel p-4 space-y-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">Stats Breakdown</h3>
        {surgeMode && (
          <span className="text-xs py-0.5 px-2 bg-red-500 text-white rounded-full animate-pulse flex items-center gap-1">
            <Zap size={10} className="text-yellow-300" />
            SURGE MODE (2x)
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <StatRow 
          label="Points per Click" 
          value={pointsPerClick} 
          rawValue={rawPointsPerClick}
          icon={<Activity size={16} className="text-game-accent" />}
        />
        
        <StatRow 
          label="Points per Second" 
          value={pointsPerSecond} 
          rawValue={rawPointsPerSecond}
          icon={<Activity size={16} className="text-amber-500" />}
        />
      </div>
      
      <div className="mt-3 pt-2 border-t border-game-neutral-dark/10">
        <h4 className="text-sm font-medium mb-2">Active Bonuses</h4>
        <div className="grid grid-cols-2 gap-2">
          {pointsMultiplier > 1 && (
            <div className="flex items-center gap-1 text-xs bg-game-neutral-dark/5 p-1 rounded">
              <BadgePercent size={12} className="text-blue-500" />
              <span>+{((pointsMultiplier - 1) * 100).toFixed(0)}% Points</span>
            </div>
          )}
          
          {clickValueBoost > 0 && (
            <div className="flex items-center gap-1 text-xs bg-game-neutral-dark/5 p-1 rounded">
              <BadgePercent size={12} className="text-purple-500" />
              <span>+{(clickValueBoost * 100).toFixed(0)}% Click</span>
            </div>
          )}
          
          {passiveBoost > 0 && (
            <div className="flex items-center gap-1 text-xs bg-game-neutral-dark/5 p-1 rounded">
              <BadgePercent size={12} className="text-green-500" />
              <span>+{(passiveBoost * 100).toFixed(0)}% Passive</span>
            </div>
          )}
          
          {surgeTimeBonus > 0 && (
            <div className="flex items-center gap-1 text-xs bg-game-neutral-dark/5 p-1 rounded">
              <Zap size={12} className="text-yellow-500" />
              <span>+{surgeTimeBonus}s Surge</span>
            </div>
          )}
          
          {surgeModeChance > 0 && (
            <div className="flex items-center gap-1 text-xs bg-game-neutral-dark/5 p-1 rounded">
              <BadgeCheck size={12} className="text-red-500" />
              <span>{(surgeModeChance * 100).toFixed(0)}% Surge Chance</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsTooltip;
