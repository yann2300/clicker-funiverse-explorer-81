
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface LevelProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ level, xp, xpToNextLevel }) => {
  const progressPercentage = (xp / xpToNextLevel) * 100;
  
  return (
    <div className="w-full mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-[#acb1b9]">Level {level}</span>
        <span className="text-xs text-[#acb1b9]">{xp}/{xpToNextLevel} XP</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default LevelProgress;
