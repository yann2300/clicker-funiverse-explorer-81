
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface DayProgressProps {
  day: number;
  dayProgress: number;
  pointsToNextDay: number;
}

const DayProgress: React.FC<DayProgressProps> = ({ day, dayProgress, pointsToNextDay }) => {
  const progressPercentage = (dayProgress / pointsToNextDay) * 100;
  
  return (
    <div className="w-full mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-[#acb1b9]">Day {day}</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default DayProgress;
