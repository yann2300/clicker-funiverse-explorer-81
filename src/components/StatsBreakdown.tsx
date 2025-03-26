
import React from 'react';

interface StatsBreakdownProps {
  rawPointsPerClick: number;
  rawPointsPerSecond: number;
  pointsMultiplier: number;
  clickValueBoost: number;
  passiveBoost: number;
  surgeModeChance: number;
  surgeTimeBonus: number;
  surgeMode?: boolean;
}

const StatsBreakdown: React.FC<StatsBreakdownProps> = ({
  rawPointsPerClick,
  rawPointsPerSecond,
  pointsMultiplier,
  clickValueBoost,
  passiveBoost,
  surgeModeChance,
  surgeTimeBonus,
  surgeMode = false
}) => {
  return (
    <div className="p-4 min-w-[280px] max-w-[320px]">
      <h3 className="text-lg font-bold mb-3 text-steamgifts-text">Stats Breakdown</h3>
      
      {/* Click Value Breakdown */}
      <div className="mb-4">
        <h4 className="font-semibold text-steamgifts-text">Click Value</h4>
        <div className="text-sm space-y-1 mt-1">
          <div className="flex justify-between">
            <span className="text-steamgifts-text-light">Base value:</span>
            <span className="font-medium text-steamgifts-text">{rawPointsPerClick.toFixed(1)}</span>
          </div>
          
          {clickValueBoost > 0 && (
            <div className="flex justify-between">
              <span className="text-steamgifts-text-light">Pet boost:</span>
              <span className="font-medium text-green-600">+{(clickValueBoost * 100).toFixed(0)}%</span>
            </div>
          )}
          
          {pointsMultiplier > 1 && (
            <div className="flex justify-between">
              <span className="text-steamgifts-text-light">Multiplier:</span>
              <span className="font-medium text-green-600">×{pointsMultiplier.toFixed(1)}</span>
            </div>
          )}
          
          {surgeMode && (
            <div className="flex justify-between">
              <span className="text-steamgifts-text-light">SURGE MODE:</span>
              <span className="font-medium text-red-500">×2</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Passive Income Breakdown */}
      <div className="mb-4">
        <h4 className="font-semibold text-steamgifts-text">Passive Income</h4>
        <div className="text-sm space-y-1 mt-1">
          <div className="flex justify-between">
            <span className="text-steamgifts-text-light">Base rate:</span>
            <span className="font-medium text-steamgifts-text">{rawPointsPerSecond.toFixed(1)}/s</span>
          </div>
          
          {passiveBoost > 0 && (
            <div className="flex justify-between">
              <span className="text-steamgifts-text-light">Pet boost:</span>
              <span className="font-medium text-green-600">+{(passiveBoost * 100).toFixed(0)}%</span>
            </div>
          )}
          
          {pointsMultiplier > 1 && (
            <div className="flex justify-between">
              <span className="text-steamgifts-text-light">Multiplier:</span>
              <span className="font-medium text-green-600">×{pointsMultiplier.toFixed(1)}</span>
            </div>
          )}
          
          {surgeMode && (
            <div className="flex justify-between">
              <span className="text-steamgifts-text-light">SURGE MODE:</span>
              <span className="font-medium text-red-500">×2</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Special Bonuses */}
      <div>
        <h4 className="font-semibold text-steamgifts-text">Special Bonuses</h4>
        <div className="text-sm space-y-1 mt-1">
          {surgeModeChance > 0 && (
            <div className="flex justify-between">
              <span className="text-steamgifts-text-light">SURGE chance:</span>
              <span className="font-medium text-blue-500">{(surgeModeChance * 100).toFixed(1)}%</span>
            </div>
          )}
          
          {surgeTimeBonus > 0 && (
            <div className="flex justify-between">
              <span className="text-steamgifts-text-light">SURGE duration:</span>
              <span className="font-medium text-blue-500">+{surgeTimeBonus}s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsBreakdown;
