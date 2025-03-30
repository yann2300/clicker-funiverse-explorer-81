import React from 'react';

export interface StatsProps {
  pointsPerClick: number;
  pointsPerSecond: number;
  clickBoost: number;
  passiveBoost: number;
  surgeModeChance: number;
  surgeMode: boolean;
  surgeModeTimeLeft: number;
}

const Stats = ({ pointsPerClick, pointsPerSecond, clickBoost, passiveBoost, surgeModeChance, surgeMode, surgeModeTimeLeft }: StatsProps) => {
  return (
    <div>
      <div className="mb-2">
        <strong>Click Value:</strong> {pointsPerClick} (+{clickBoost * 100}%)
      </div>
      <div className="mb-2">
        <strong>Passive Income:</strong> {pointsPerSecond} (+{passiveBoost * 100}%)
      </div>
      <div className="mb-2">
        <strong>Surge Mode Chance:</strong> {surgeModeChance * 100}%
      </div>
      {surgeMode && (
        <div className="mb-2 text-green-500">
          <strong>SURGE MODE ACTIVE:</strong> {surgeModeTimeLeft} seconds
        </div>
      )}
    </div>
  );
};

export default Stats;
