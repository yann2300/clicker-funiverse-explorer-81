
import { useEffect, useState, useRef } from 'react';
import ClickerButton from './ClickerButton';
import UpgradeShop from './UpgradeShop';
import Stats from './Stats';
import useGameState from '@/hooks/useGameState';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, Zap } from 'lucide-react';
import AchievementsSidebar from './AchievementsSidebar';
import { achievements } from '@/lib/achievements';
import { toast } from "@/hooks/use-toast";

const GameContainer = () => {
  const { gameState, handleClick, purchaseUpgrade, purchasePet, calculateUpgradeCost, resetGame, getSurgeTime } = useGameState();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localAchievements, setLocalAchievements] = useState(achievements);
  
  // SURGE MODE states
  const [surgeMode, setSurgeMode] = useState(false);
  const [surgeModeTimeLeft, setSurgeModeTimeLeft] = useState(0);
  const surgeModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const surgeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Bonus mole states
  const [showBonus, setShowBonus] = useState(false);
  const [bonusPosition, setBonusPosition] = useState({ x: 0, y: 0, corner: 0, entering: true });
  const bonusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for bonus appearance every 90 seconds
  useEffect(() => {
    if (mounted && !surgeMode) {
      // Initial delay before first appearance (random between 5-15 seconds)
      const initialDelay = Math.random() * 10000 + 5000;
      
      const initialTimer = setTimeout(() => {
        if (!showBonus && !surgeMode) {
          showBonusMole();
        }
        
        // Set up the 90-second interval after the initial appearance
        const bonusInterval = setInterval(() => {
          if (!showBonus && !surgeMode) {
            showBonusMole();
          }
        }, 90000); // 90 seconds
        
        return () => clearInterval(bonusInterval);
      }, initialDelay);
      
      return () => clearTimeout(initialTimer);
    }
  }, [mounted, surgeMode]);
  
  // Handle SURGE MODE timer
  useEffect(() => {
    if (surgeMode) {
      if (surgeIntervalRef.current) {
        clearInterval(surgeIntervalRef.current);
      }
      
      surgeIntervalRef.current = setInterval(() => {
        setSurgeModeTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(surgeIntervalRef.current!);
            setSurgeMode(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (surgeIntervalRef.current) {
        clearInterval(surgeIntervalRef.current);
      }
    };
  }, [surgeMode]);
  
  // Show bonus mole function
  const showBonusMole = () => {
    const corner = Math.floor(Math.random() * 4); // 0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right
    
    let x = 0;
    let y = 0;
    
    // Position based on corner
    switch (corner) {
      case 0: // top-left
        x = -30;
        y = Math.floor(Math.random() * 200) - 30;
        break;
      case 1: // top-right
        x = window.innerWidth - 30;
        y = Math.floor(Math.random() * 200) - 30;
        break;
      case 2: // bottom-left
        x = -30;
        y = window.innerHeight - Math.floor(Math.random() * 200) - 30;
        break;
      case 3: // bottom-right
        x = window.innerWidth - 30;
        y = window.innerHeight - Math.floor(Math.random() * 200) - 30;
        break;
    }
    
    setBonusPosition({ x, y, corner, entering: true });
    setShowBonus(true);
    
    // Start animation sequence
    // 1. Enter animation (30px)
    setTimeout(() => {
      setBonusPosition(prev => ({ ...prev, entering: false }));
      
      // 2. Wait a bit then start exit animation
      bonusTimeoutRef.current = setTimeout(() => {
        hideBonus();
      }, 3000);
    }, 1000);
  };
  
  const hideBonus = () => {
    setBonusPosition(prev => ({ ...prev, entering: true }));
    
    // After exit animation, hide completely
    setTimeout(() => {
      setShowBonus(false);
    }, 1000);
  };
  
  // Handle bonus click - activate SURGE MODE
  const handleBonusClick = () => {
    // Clear bonus timeout if active
    if (bonusTimeoutRef.current) {
      clearTimeout(bonusTimeoutRef.current);
      bonusTimeoutRef.current = null;
    }
    
    // Hide bonus
    setShowBonus(false);
    
    // Get surge time including pet bonuses
    const surgeTime = getSurgeTime();
    
    // Activate SURGE MODE
    setSurgeMode(true);
    setSurgeModeTimeLeft(surgeTime);
    
    // Clear previous timeout if exists
    if (surgeModeTimeoutRef.current) {
      clearTimeout(surgeModeTimeoutRef.current);
    }
    
    // Set timeout to end SURGE MODE
    surgeModeTimeoutRef.current = setTimeout(() => {
      setSurgeMode(false);
    }, surgeTime * 1000);
    
    // Show toast
    toast({
      title: "SURGE MODE ACTIVATED!",
      description: `2x points for ${surgeTime} seconds!`,
    });
  };
  
  // Customized click handler for SURGE MODE
  const handleGameClick = () => {
    // Check if we have a chance to trigger SURGE MODE from pets
    const petBonuses = gameState.pets.filter(p => p.owned && p.bonusType === 'surgeModeChance');
    let triggerChance = 0;
    
    petBonuses.forEach(pet => {
      triggerChance += pet.bonusValue;
    });
    
    // If not in SURGE MODE and we roll a success, activate SURGE MODE
    if (!surgeMode && Math.random() < triggerChance) {
      handleBonusClick(); // Reuse the same function
    }
    
    // If in SURGE MODE, double points
    handleClick(surgeMode ? 2 : 1);
  };

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
        showAchievementToast(achievement);
      }
    }

    // Click master
    if (gameState.totalClicks >= 100 && !newAchievements.find(a => a.id === 'click-master')?.isUnlocked) {
      const achievement = newAchievements.find(a => a.id === 'click-master');
      if (achievement) {
        achievement.isUnlocked = true;
        changed = true;
        showAchievementToast(achievement);
      }
    }

    // Points collector
    if (gameState.totalPoints >= 1000 && !newAchievements.find(a => a.id === 'points-collector')?.isUnlocked) {
      const achievement = newAchievements.find(a => a.id === 'points-collector');
      if (achievement) {
        achievement.isUnlocked = true;
        changed = true;
        showAchievementToast(achievement);
      }
    }

    // Upgrade novice
    if (gameState.upgrades.some(u => u.currentLevel > 0) && !newAchievements.find(a => a.id === 'upgrade-novice')?.isUnlocked) {
      const achievement = newAchievements.find(a => a.id === 'upgrade-novice');
      if (achievement) {
        achievement.isUnlocked = true;
        changed = true;
        showAchievementToast(achievement);
      }
    }

    // Automation beginner
    if (gameState.upgrades.some(u => u.type === 'passive' && u.currentLevel > 0) && !newAchievements.find(a => a.id === 'automation-beginner')?.isUnlocked) {
      const achievement = newAchievements.find(a => a.id === 'automation-beginner');
      if (achievement) {
        achievement.isUnlocked = true;
        changed = true;
        showAchievementToast(achievement);
      }
    }

    if (changed) {
      setLocalAchievements(newAchievements);
    }
  }, [gameState, localAchievements]);
  
  const showAchievementToast = (achievement: typeof localAchievements[0]) => {
    toast({
      title: `Achievement Unlocked: ${achievement.title}`,
      description: `${achievement.description}\nHow to unlock: ${achievement.unlockMessage}`,
    });
  };
  
  if (!mounted) {
    return null;
  }
  
  // Calculate bonus position styles based on corner and animation state
  const getBonusStyles = () => {
    const baseStyles = {
      position: 'fixed',
      width: '30px',
      height: '30px',
      zIndex: 100,
      cursor: 'pointer',
      transition: 'all 1s ease-out',
    };
    
    // Determine offsets based on corner
    let x = bonusPosition.x;
    let y = bonusPosition.y;
    
    // Apply offset based on animation state
    switch (bonusPosition.corner) {
      case 0: // top-left
        x += bonusPosition.entering ? 0 : 30;
        break;
      case 1: // top-right
        x -= bonusPosition.entering ? 0 : 30;
        break;
      case 2: // bottom-left
        x += bonusPosition.entering ? 0 : 30;
        break;
      case 3: // bottom-right
        x -= bonusPosition.entering ? 0 : 30;
        break;
    }
    
    return {
      ...baseStyles,
      left: `${x}px`,
      top: `${y}px`,
    };
  };
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 relative overflow-hidden">
      {/* Bonus mole */}
      {showBonus && (
        <div 
          onClick={handleBonusClick}
          style={getBonusStyles() as React.CSSProperties}
        >
          <img 
            src="https://dejpknyizje2n.cloudfront.net/media/carstickers/versions/mole-pixel-sticker-ud740-811c-x450.png" 
            alt="Bonus" 
            className="w-full h-full object-contain"
          />
        </div>
      )}
      
      {/* SURGE MODE timer */}
      {surgeMode && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 z-50 animate-pulse">
          <Zap size={16} className="text-yellow-300" />
          <span className="font-bold">SURGE MODE: {surgeModeTimeLeft}s</span>
        </div>
      )}
      
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
            pointsPerClick={gameState.pointsPerClick * (surgeMode ? 2 : 1)}
            pointsPerSecond={gameState.pointsPerSecond * (surgeMode ? 2 : 1)}
            totalClicks={gameState.totalClicks}
            totalPoints={gameState.totalPoints}
          />
          
          <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center">
            <ClickerButton 
              onClick={handleGameClick}
              pointsPerClick={gameState.pointsPerClick * (surgeMode ? 2 : 1)}
              surgeMode={surgeMode}
            />
          </div>
        </div>
        
        {/* Right column - Upgrades */}
        <div className="md:col-span-2 order-1 md:order-2">
          <UpgradeShop 
            gameState={gameState}
            onPurchase={purchaseUpgrade}
            onPetPurchase={purchasePet}
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
