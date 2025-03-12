
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Achievement } from '@/lib/achievements';
import * as LucideIcons from 'lucide-react';

interface AchievementsSidebarProps {
  achievements: Achievement[];
  isOpen: boolean;
  onClose: () => void;
}

const AchievementsSidebar = ({ achievements, isOpen, onClose }: AchievementsSidebarProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 z-50 bg-white shadow-lg border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Achievements</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 overflow-auto flex-grow">
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const IconComponent = (LucideIcons as any)[achievement.icon] || LucideIcons.Award;
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg transition-all ${
                  achievement.isUnlocked
                    ? 'bg-game-neutral'
                    : 'bg-gray-100 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent 
                    className={`h-5 w-5 ${
                      achievement.isUnlocked ? 'text-game-accent' : 'text-gray-400'
                    }`}
                  />
                  <h3 className="font-semibold">{achievement.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsSidebar;
