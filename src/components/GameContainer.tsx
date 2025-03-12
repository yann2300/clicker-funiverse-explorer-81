import { useEffect, useState } from 'react';
import ClickerButton from './ClickerButton';
import UpgradeShop from './UpgradeShop';
import Stats from './Stats';
import useGameState from '@/hooks/useGameState';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy } from 'lucide-react';
import AchievementsSidebar from './AchievementsSidebar';
import { achievements } from '@/lib/achievements';
import { toast } from "@/hooks/use-toast";

const GameContainer = () => {
  const { gameState, handleClick, purchaseUpgrade, calculateUpgradeCost, resetGame } = useGameState();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localAchievements, setLocalAchievements] = useState(achievements);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check for achievements
    const newAchievements = [...localAchievements];
    let changed = false;

    // First click
    if (gameState.totalClicks > 0 && !newAchievements.find(a => a.id === 'first-click')?.isUnlocked) {
      const achievement = newAchievements.find(a => a.id === 'first-click');
      if (achievement) {
        achievement.isUnlocked = true;
        changed = true;
      }
    }

    // Click master
    if (gameState.totalClicks >= 100 && !newAchievements.find(a => a.id === 'click-master')?.isUnlocked) {
      const achievement = newAchievements.find(a => a.id === 'click-master');
      if (achievement) {
        achievement.isUnlocked = true;
        changed = true;
      }
    }

    // Points collector
    if (gameState.totalPoints >= 1000 && !newAchievements.find(a => a.id === 'points-collector')?.isUnlocked) {
      const achievement = newAchievements.find(a => a.id === 'points-collector');
      if (achievement) {
        achievement.isUnlocked = true;
        changed = true;
      }
    }

    // Upgrade novice
    if (gameState.upgrades.some(u => u.currentLevel > 0) && !newAchievements.find(a => a.id === 'upgrade-novice')?.isUnlocked) {
      const achievement = newAchievements.find(a => a.id === 'upgrade-novice');
      if (achievement) {
        achievement.isUnlocked = true;
        changed = true;
      }
    }

    // Automation beginner
    if (gameState.upgrades.some(u => u.type === 'passive' && u.currentLevel > 0) && !newAchievements.find(a => a.id === 'automation-beginner')?.isUnlocked) {
      const achievement = newAchievements.find(a => a.id === 'automation-beginner');
      if (achievement) {
        achievement.isUnlocked = true;
        changed = true;
      }
    }

    if (changed) {
      setLocalAchievements(newAchievements);
      // Find the newly unlocked achievements and show notifications
      const newlyUnlocked = newAchievements.filter(
        (achievement, index) => 
          achievement.isUnlocked && !localAchievements[index].isUnlocked
      );
      
      newlyUnlocked.forEach(achievement => {
        toast({
          title: `Achievement Unlocked: ${achievement.title}`,
          description: `${achievement.description}\nHow to unlock: ${achievement.unlockMessage}`,
        });
      });
    }
  }, [gameState, localAchievements]);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 relative overflow-hidden">
      {/* Reset and Achievements buttons */}
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full p-2 h-auto"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Trophy size={16} />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full p-2 h-auto">
              <RefreshCw size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset game progress?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all your progress including points, upgrades, and statistics. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetGame} className="bg-red-500 hover:bg-red-600">Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none noise-bg"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left column - Stats and Clicker */}
        <div className="md:col-span-1 space-y-6 order-2 md:order-1">
          <Stats 
            points={gameState.points}
            pointsPerClick={gameState.pointsPerClick}
            pointsPerSecond={gameState.pointsPerSecond}
            totalClicks={gameState.totalClicks}
            totalPoints={gameState.totalPoints}
          />
          
          <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center">
            <ClickerButton 
              onClick={handleClick}
              pointsPerClick={gameState.pointsPerClick}
            />
          </div>
        </div>
        
        {/* Right column - Upgrades */}
        <div className="md:col-span-2 order-1 md:order-2">
          <UpgradeShop 
            gameState={gameState}
            onPurchase={purchaseUpgrade}
            calculateUpgradeCost={calculateUpgradeCost}
          />
        </div>
      </div>
      
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-game-neutral via-white to-game-neutral/50 -z-10"></div>

      {/* Achievements Sidebar */}
      <AchievementsSidebar
        achievements={localAchievements}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default GameContainer;
