import React from 'react';
import { GameState } from '@/types/gameState';

export interface StatsBreakdownProps {
  rawStats: {
    pointsPerClick: number;
    pointsPerSecond: number;
  };
  gameState: GameState;
}

const StatsBreakdown = ({ rawStats, gameState }: StatsBreakdownProps) => {
  const { pointsPerClick, pointsPerSecond } = rawStats;
  const { pointsMultiplier, clickValueBoost, passiveBoost } = gameState;
  
  // Calculate total click value boost percentage
  const totalClickBoost = (clickValueBoost) * 100;
  
  // Calculate total passive boost percentage
  const totalPassiveBoost = (passiveBoost) * 100;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="font-bold text-lg mb-2 text-gray-700">Stats Breakdown</h2>
      
      <div className="mb-2">
        <h3 className="font-medium text-md text-gray-700">Clicking</h3>
        <p className="text-sm text-gray-500">
          Base Points per Click: {pointsPerClick}
        </p>
        <p className="text-sm text-gray-500">
          Click Value Boost from Pets: +{totalClickBoost.toFixed(0)}%
        </p>
        <p className="text-sm text-gray-500">
          Total Points per Click: {(pointsPerClick * (1 + clickValueBoost)).toFixed(2)}
        </p>
      </div>
      
      <div>
        <h3 className="font-medium text-md text-gray-700">Passive Income</h3>
        <p className="text-sm text-gray-500">
          Base Points per Second: {pointsPerSecond}
        </p>
        <p className="text-sm text-gray-500">
          Passive Boost from Pets: +{totalPassiveBoost.toFixed(0)}%
        </p>
        <p className="text-sm text-gray-500">
          Points Multiplier: x{pointsMultiplier.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          Total Points per Second: {(pointsPerSecond * pointsMultiplier * (1 + passiveBoost)).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default StatsBreakdown;
