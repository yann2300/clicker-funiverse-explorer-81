import { useEffect, useState, useRef, useCallback } from 'react';
import ClickerButton from './ClickerButton';
import UpgradeShop from './UpgradeShop';
import Stats from './Stats';
import useGameState from '@/hooks/useGameState';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, Zap, Save, Volume2, VolumeX, Star, Puzzle } from 'lucide-react';
import AchievementsSidebar from './AchievementsSidebar';
import { achievements, Achievement } from '@/lib/achievements';
import { toast } from "@/hooks/use-toast";
import StatsBreakdown from './StatsBreakdown';
import usePetsSystem from '@/hooks/usePetsSystem';
import useSoundSettings from '@/hooks/useSoundSettings';
import NonogramGame from './NonogramGame';
import JigsawPuzzle from './JigsawPuzzle';

// Konami code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'b', 'a'
];

const GameContainer = () => {
  const { gameState, handleClick, purchaseUpgrade, purchasePet, calculateUpgradeCost, resetGame, getSurgeTime, saveGameState } = useGameState();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localAchievements, setLocalAchievements] = useState(achievements);
  const { soundEnabled, toggleSound, playClickSound } = useSoundSettings();
  
  // Track if this is the initial load to prevent showing achievement notifications
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // SURGE MODE states
  const [surgeMode, setSurgeMode] = useState(false);
  const [surgeModeTimeLeft, setSurgeModeTimeLeft] = useState(0);
  const surgeModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const surgeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Bonus mole states
  const [showBonus, setShowBonus] = useState(false);
  const [bonusPosition, setBonusPosition] = useState({ x: 0, y: 0, corner: 0, entering: true });
  const bonusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track SURGE MODE activations
  const [surgeModeActivations, setSurgeModeActivations] = useState(0);
  
  // Last save indicator
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // To store raw stat values before applying bonuses
  const [rawStats, setRawStats] = useState({
    pointsPerClick: 1,
    pointsPerSecond: 0
  });
  
  // Konami code tracking
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  
  // Previously unlockedAchievements to track changes
  const previouslyUnlockedRef = useRef<Set<string>>(new Set<string>());
  const { calculatePetBonuses } = usePetsSystem();

  // Add nonogram star states
  const [showStar, setShowStar] = useState(false);
  const [starPosition, setStarPosition] = useState({ x: 0, y: 0 });
  const [isNonogramOpen, setIsNonogramOpen] = useState(false);
  const starTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add jigsaw puzzle states
  const [showPuzzleIcon, setShowPuzzleIcon] = useState(false);
  const [puzzlePosition, setPuzzlePosition] = useState({ x: 0, y: 0 });
  const [isJigsawOpen, setIsJigsawOpen] = useState(false);
  const puzzleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [starClaimed, setStarClaimed] = useState(false);
  const [puzzleClaimed, setPuzzleClaimed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to show achievement toast notification when an achievement is unlocked
  const showAchievementToast = (achievement: Achievement) => {
    toast({
      title: "🏆 Achievement Unlocked!",
      description: achievement.title + ": " + achievement.description,
    });
  };

  // Always define the showBonusMole function before using it in useEffect
  const showBonusMole = useCallback(() => {
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
  }, []);

  const hideBonus = useCallback(() => {
    setBonusPosition(prev => ({ ...prev, entering: true }));
    
    // After exit animation, hide completely
    setTimeout(() => {
      setShowBonus(false);
    }, 1000);
  }, []);

  // Show random star function
  const showRandomStar = useCallback(() => {
    // Only show if not already showing and not claimed
    if (showStar || starClaimed) return;
    
    // Random position within viewport
    const x = Math.floor(Math.random() * (window.innerWidth - 100) + 50);
    const y = Math.floor(Math.random() * (window.innerHeight - 100) + 50);
    
    setStarPosition({ x, y });
    setShowStar(true);
    
    // Star will disappear after 10 seconds if not clicked
    starTimeoutRef.current = setTimeout(() => {
      setShowStar(false);
    }, 10000);
  }, [showStar, starClaimed]);

  // Show random puzzle function
  const showRandomPuzzle = useCallback(() => {
    // Only show if not already showing and not claimed
    if (showPuzzleIcon || puzzleClaimed) return;
    
    // Random position within viewport (different area than star to avoid overlap)
    const x = Math.floor(Math.random() * (window.innerWidth - 150) + 75);
    const y = Math.floor(Math.random() * (window.innerHeight - 150) + 75);
    
    setPuzzlePosition({ x, y });
    setShowPuzzleIcon(true);
    
    // Puzzle icon will disappear after 12 seconds if not clicked
    puzzleTimeoutRef.current = setTimeout(() => {
      setShowPuzzleIcon(false);
    }, 12000);
  }, [showPuzzleIcon, puzzleClaimed]);

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
  }, [mounted, surgeMode, showBonus, showBonusMole]);
  
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
  
  // Keyboard event listener for Konami code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Convert key to lowercase for b and a
      const key = ['a', 'b'].includes(e.key.toLowerCase()) 
        ? e.key.toLowerCase() 
        : e.key;
      
      setKonamiSequence(prev => {
        // Add the new key to the end of the sequence
        const newSequence = [...prev, key].slice(-KONAMI_CODE.length);
        
        // Check if the sequence matches the Konami code
        if (newSequence.length === KONAMI_CODE.length && 
            newSequence.every((k, i) => k === KONAMI_CODE[i])) {
          // Unlock the Konami achievement
          const newAchievements = [...localAchievements];
          const konamiAchievement = newAchievements.find(a => a.id === 'konami-master');
          
          if (konamiAchievement && !konamiAchievement.isUnlocked) {
            konamiAchievement.isUnlocked = true;
            konamiAchievement.progress = 1;
            setLocalAchievements(newAchievements);
            
            // Save achievements
            localStorage.setItem('clickerGameAchievements', JSON.stringify(newAchievements));
            
            // Show achievement unlock toast
            showAchievementToast(konamiAchievement);
            
            // Add a special bonus (e.g., 10,000 points)
            handleClick(100); // Give a big bonus!
            toast({
              title: "Konami Code Activated!",
              description: "You've received a special bonus!"
            });
          }
        }
        
        return newSequence;
      });
    };
    
    // Add the event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [localAchievements, handleClick, showAchievementToast]);
  
  // Handle bonus click - activate SURGE MODE
  const handleBonusClick = useCallback(() => {
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
    
    // Increment SURGE MODE activations for achievement tracking
    setSurgeModeActivations(prev => prev + 1);
    
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
  }, [getSurgeTime]);
  
  // Customized click handler for SURGE MODE
  const handleGameClick = useCallback(() => {
    // Play click sound if sound is enabled
    if (soundEnabled) {
      playClickSound();
    }
    
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
  }, [soundEnabled, playClickSound, gameState.pets, surgeMode, handleBonusClick, handleClick]);

  // Update last saved timestamp when gameState changes
  useEffect(() => {
    if (gameState.lastSaved) {
      setLastSaved(new Date(gameState.lastSaved));
    }
  }, [gameState.lastSaved]);

  // Load achievements from localStorage on mount and init previouslyUnlockedRef
  useEffect(() => {
    const savedAchievements = localStorage.getItem('clickerGameAchievements');
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        
        // Ensure all achievements have progress properties
        const updatedAchievements = parsed.map((savedAchievement: any) => {
          const baseAchievement = achievements.find(a => a.id === savedAchievement.id);
          if (baseAchievement && baseAchievement.progressMax && savedAchievement.progress === undefined) {
            return { 
              ...savedAchievement, 
              progress: savedAchievement.isUnlocked ? baseAchievement.progressMax : 0,
              progressMax: baseAchievement.progressMax
            };
          }
          return savedAchievement;
        });
        
        setLocalAchievements(updatedAchievements);
        
        // Initialize previously unlocked achievements set
        const unlockedIds = new Set<string>(
          updatedAchievements
            .filter((a: any) => a.isUnlocked)
            .map((a: any) => a.id)
        );
        previouslyUnlockedRef.current = unlockedIds;
      } catch (error) {
        console.error('Failed to parse saved achievements:', error);
      }
    }
    
    // Mark initial load as complete after loading saved achievements
    setIsInitialLoad(false);
  }, []);

  // Update raw stats when gameState changes
  useEffect(() => {
    setRawStats({
      pointsPerClick: gameState.pointsPerClick,
      pointsPerSecond: gameState.pointsPerSecond
    });
  }, [gameState.pointsPerClick, gameState.pointsPerSecond]);

  // Show star after 10 clicks and puzzle after 30 clicks
  useEffect(() => {
    if (mounted) {
      if (gameState.totalClicks === 10) {
        showRandomStar();
      } else if (gameState.totalClicks === 30) {
        showRandomPuzzle();
      }
    }
  }, [gameState.totalClicks, mounted, showRandomStar, showRandomPuzzle]);

  // Handle star click - open nonogram
  const handleStarClick = useCallback(() => {
    // Clear star timeout if active
    if (starTimeoutRef.current) {
      clearTimeout(starTimeoutRef.current);
      starTimeoutRef.current = null;
    }
    
    setShowStar(false);
    setIsNonogramOpen(true);
  }, []);
  
  // Handle puzzle click - open jigsaw
  const handlePuzzleClick = useCallback(() => {
    // Clear puzzle timeout if active
    if (puzzleTimeoutRef.current) {
      clearTimeout(puzzleTimeoutRef.current);
      puzzleTimeoutRef.current = null;
    }
    
    setShowPuzzleIcon(false);
    setIsJigsawOpen(true);
  }, []);
  
  // Handle nonogram completion
  const handleNonogramSolve = useCallback(() => {
    // Add 10,000 points
    handleClick(100); // Give 10,000 points (100 clicks × 100 points per click)
    setStarClaimed(true);
    
    toast({
      title: "Nonogram Solved!",
      description: "You've earned 10,000 points!",
    });
  }, [handleClick]);

  // Handle jigsaw completion
  const handleJigsawSolve = useCallback(() => {
    // Add 10,000 points
    handleClick(100); // Give 10,000 points (100 clicks × 100 points per click)
    setPuzzleClaimed(true);
    
    toast({
      title: "Jigsaw Puzzle Solved!",
      description: "You've earned 10,000 points!",
    });
  }, [handleClick]);

  
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
  
  // Get star styles
  const getStarStyles = () => {
    return {
      position: 'fixed',
      left: `${starPosition.x}px`,
      top: `${starPosition.y}px`,
      width: '40px',
      height: '40px',
      zIndex: 100,
      cursor: 'pointer',
      color: '#FFD700',
      filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
      animation: 'pulse-subtle 2s infinite ease-in-out'
    };
  };
  
  // Get puzzle styles
  const getPuzzleStyles = () => {
    return {
      position: 'fixed',
      left: `${puzzlePosition.x}px`,
      top: `${puzzlePosition.y}px`,
      width: '40px',
      height: '40px',
      zIndex: 100,
      cursor: 'pointer',
      color: '#4CAF50',
      filter: 'drop-shadow(0 0 4px rgba(76, 175, 80, 0.5))',
      animation: 'pulse-subtle 2s infinite ease-in-out'
    };
  };
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 relative overflow-hidden">
      
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
      
      
      {showStar && (
        <div 
          onClick={handleStarClick}
          style={getStarStyles() as React.CSSProperties}
          className="animate-pulse-subtle"
        >
          <Star size={40} fill="#FFD700" />
        </div>
      )}
      
      
      {showPuzzleIcon && (
        <div 
          onClick={handlePuzzleClick}
          style={getPuzzleStyles() as React.CSSProperties}
          className="animate-pulse-subtle"
        >
          <Puzzle size={40} fill="#4CAF50" />
        </div>
      )}
      
      
      <NonogramGame 
        isOpen={isNonogramOpen}
        onClose={() => setIsNonogramOpen(false)}
        onSolve={handleNonogramSolve}
      />
      
      
      <JigsawPuzzle 
        isOpen={isJigsawOpen}
        onClose={() => setIsJigsawOpen(false)}
        onSolve={handleJigsawSolve}
      />
      
      
      {surgeMode && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 z-50 animate-pulse">
          <Zap size={16} className="text-yellow-300" />
          <span className="font-bold">SURGE MODE: {surgeModeTimeLeft}s</span>
        </div>
      )}
      
      
      {lastSaved && (
        <div className="fixed bottom-4 right-4 text-xs text-gray-500 flex items-center gap-1">
          <Save size={12} />
          <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
        </div>
      )}
      
      
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full p-2 h-auto"
          onClick={toggleSound}
          title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </Button>
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
      
      
      <div className="absolute inset-0 pointer-events-none noise-bg"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        <div className="md:col-span-1 space-y-6 order-2 md:order-1">
          <Stats 
            points={gameState.points}
            pointsPerClick={gameState.pointsPerClick * (surgeMode ? 2 : 1)}
            pointsPerSecond={gameState.pointsPerSecond * (surgeMode ? 2 : 1)}
            totalClicks={gameState.totalClicks}
            totalPoints={gameState.totalPoints}
            rawPointsPerClick={rawStats.pointsPerClick * (surgeMode ? 2 : 1)}
            rawPointsPerSecond={rawStats.pointsPerSecond * (surgeMode ? 2 : 1)}
            pointsMultiplier={gameState.pointsMultiplier}
            surgeTimeBonus={gameState.surgeTimeBonus}
            clickValueBoost={calculatePetBonuses(gameState.pets).clickValueBoost}
            passiveBoost={calculatePetBonuses(gameState.pets).passiveBoost}
            surgeModeChance={calculatePetBonuses(gameState.pets).surgeModeChance}
            surgeMode={surgeMode}
          />
          
          <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center">
            <ClickerButton 
              onClick={handleGameClick}
              pointsPerClick={gameState.pointsPerClick * (surgeMode ? 2 : 1)}
              surgeMode={surgeMode}
              playSound={soundEnabled}
            />
          </div>
        </div>
        
        
        <div className="md:col-span-2 order-1 md:order-2">
          <UpgradeShop 
            gameState={gameState}
            onPurchase={purchaseUpgrade}
            onPetPurchase={purchasePet}
            calculateUpgradeCost={calculateUpgradeCost}
          />
        </div>
      </div>
      
      
      <div className="fixed inset-0 bg-gradient-to-br from-game-neutral via-white to-game-neutral/50 -z-10"></div>

      
      <AchievementsSidebar
        achievements={localAchievements}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default GameContainer;
