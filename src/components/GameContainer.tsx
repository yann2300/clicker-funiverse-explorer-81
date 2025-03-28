import { useEffect, useState, useRef, useCallback } from 'react';
import ClickerButton from './ClickerButton';
import UpgradeShop from './UpgradeShop';
import Stats from './Stats';
import useGameState from '@/hooks/useGameState';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, Zap, Save, Volume2, VolumeX, Star, Puzzle } from 'lucide-react';
import AchievementsSidebar from './AchievementsSidebar';
import { achievements } from '@/lib/achievements';
import { toast } from "@/hooks/use-toast";
import StatsBreakdown from './StatsBreakdown';
import usePetsSystem from '@/hooks/usePetsSystem';
import useSoundSettings from '@/hooks/useSoundSettings';
import NonogramGame from './NonogramGame';
import JigsawPuzzle from './JigsawPuzzle';
import Games from './Games';
import LevelProgress from './LevelProgress';
import { formatNumber } from '@/lib/gameUtils';

// Konami code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'b', 'a'
];

const GameContainer = () => {
  const { gameState, handleClick, purchaseUpgrade, purchasePet, calculateUpgradeCost, resetGame, getSurgeTime, saveGameState, updateGameUnlocks } = useGameState();
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

  useEffect(() => {
    setMounted(true);
  }, []);

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
    // Only show if not already showing
    if (showStar) return;
    
    // Random position within viewport
    const x = Math.floor(Math.random() * (window.innerWidth - 100) + 50);
    const y = Math.floor(Math.random() * (window.innerHeight - 100) + 50);
    
    setStarPosition({ x, y });
    setShowStar(true);
    
    // Star will disappear after 10 seconds if not clicked
    starTimeoutRef.current = setTimeout(() => {
      setShowStar(false);
    }, 10000);
  }, [showStar]);

  // Show random puzzle function
  const showRandomPuzzle = useCallback(() => {
    // Only show if not already showing
    if (showPuzzleIcon) return;
    
    // Random position within viewport (different area than star to avoid overlap)
    const x = Math.floor(Math.random() * (window.innerWidth - 150) + 75);
    const y = Math.floor(Math.random() * (window.innerHeight - 150) + 75);
    
    setPuzzlePosition({ x, y });
    setShowPuzzleIcon(true);
    
    // Puzzle icon will disappear after 12 seconds if not clicked
    puzzleTimeoutRef.current = setTimeout(() => {
      setShowPuzzleIcon(false);
    }, 12000);
  }, [showPuzzleIcon]);

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
  }, [localAchievements, handleClick]);
  
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
    
    toast({
      title: "Nonogram Solved!",
      description: "You've earned 10,000 points!",
    });
  }, [handleClick]);

  // Handle jigsaw completion
  const handleJigsawSolve = useCallback(() => {
    // Add 10,000 points
    handleClick(100); // Give 10,000 points (100 clicks × 100 points per click)
    
    toast({
      title: "Jigsaw Puzzle Solved!",
      description: "You've earned 10,000 points!",
    });
  }, [handleClick]);

  // Update achievement progress and check for unlocks
  useEffect(() => {
    // Skip achievement checks during initial load
    if (isInitialLoad) return;
    
    // Check for achievements
    const newAchievements = [...localAchievements];
    let changed = false;
    const newlyUnlocked: typeof localAchievements = [];

    // First click
    const firstClickAchievement = newAchievements.find(a => a.id === 'first-click');
    if (firstClickAchievement) {
      firstClickAchievement.progress = Math.min(gameState.totalClicks, 1);
      if (gameState.totalClicks > 0 && !firstClickAchievement.isUnlocked && !previouslyUnlockedRef.current.has('first-click')) {
        firstClickAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(firstClickAchievement);
      }
    }

    // Click master (100 clicks)
    const clickMasterAchievement = newAchievements.find(a => a.id === 'click-master');
    if (clickMasterAchievement) {
      clickMasterAchievement.progress = Math.min(gameState.totalClicks, 100);
      if (gameState.totalClicks >= 100 && !clickMasterAchievement.isUnlocked && !previouslyUnlockedRef.current.has('click-master')) {
        clickMasterAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(clickMasterAchievement);
      }
    }
    
    // Click enthusiast (1,000 clicks)
    const clickEnthusiastAchievement = newAchievements.find(a => a.id === 'click-enthusiast');
    if (clickEnthusiastAchievement) {
      clickEnthusiastAchievement.progress = Math.min(gameState.totalClicks, 1000);
      if (gameState.totalClicks >= 1000 && !clickEnthusiastAchievement.isUnlocked && !previouslyUnlockedRef.current.has('click-enthusiast')) {
        clickEnthusiastAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(clickEnthusiastAchievement);
      }
    }

    // Points collector (1,000 points)
    const pointsCollectorAchievement = newAchievements.find(a => a.id === 'points-collector');
    if (pointsCollectorAchievement) {
      pointsCollectorAchievement.progress = Math.min(gameState.totalPoints, 1000);
      if (gameState.totalPoints >= 1000 && !pointsCollectorAchievement.isUnlocked && !previouslyUnlockedRef.current.has('points-collector')) {
        pointsCollectorAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(pointsCollectorAchievement);
      }
    }
    
    // Points hoarder (100,000 points)
    const pointsHoarderAchievement = newAchievements.find(a => a.id === 'points-hoarder');
    if (pointsHoarderAchievement) {
      pointsHoarderAchievement.progress = Math.min(gameState.totalPoints, 100000);
      if (gameState.totalPoints >= 100000 && !pointsHoarderAchievement.isUnlocked && !previouslyUnlockedRef.current.has('points-hoarder')) {
        pointsHoarderAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(pointsHoarderAchievement);
      }
    }
    
    // Points tycoon (1,000,000 points)
    const pointsTycoonAchievement = newAchievements.find(a => a.id === 'points-tycoon');
    if (pointsTycoonAchievement) {
      pointsTycoonAchievement.progress = Math.min(gameState.totalPoints, 1000000);
      if (gameState.totalPoints >= 1000000 && !pointsTycoonAchievement.isUnlocked && !previouslyUnlockedRef.current.has('points-tycoon')) {
        pointsTycoonAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(pointsTycoonAchievement);
      }
    }

    // Upgrade novice
    const upgradeNoviceAchievement = newAchievements.find(a => a.id === 'upgrade-novice');
    if (upgradeNoviceAchievement) {
      const hasUpgrades = gameState.upgrades.some(u => u.currentLevel > 0);
      upgradeNoviceAchievement.progress = hasUpgrades ? 1 : 0;
      if (hasUpgrades && !upgradeNoviceAchievement.isUnlocked && !previouslyUnlockedRef.current.has('upgrade-novice')) {
        upgradeNoviceAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(upgradeNoviceAchievement);
      }
    }

    // Automation beginner
    const automationBeginnerAchievement = newAchievements.find(a => a.id === 'automation-beginner');
    if (automationBeginnerAchievement) {
      const hasPassiveUpgrades = gameState.upgrades.some(u => u.type === 'passive' && u.currentLevel > 0);
      automationBeginnerAchievement.progress = hasPassiveUpgrades ? 1 : 0;
      if (hasPassiveUpgrades && !automationBeginnerAchievement.isUnlocked && !previouslyUnlockedRef.current.has('automation-beginner')) {
        automationBeginnerAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(automationBeginnerAchievement);
      }
    }
    
    // Pet friend (first pet)
    const petFriendAchievement = newAchievements.find(a => a.id === 'pet-friend');
    if (petFriendAchievement) {
      const hasPets = gameState.pets.some(p => p.owned);
      petFriendAchievement.progress = hasPets ? 1 : 0;
      if (hasPets && !petFriendAchievement.isUnlocked && !previouslyUnlockedRef.current.has('pet-friend')) {
        petFriendAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(petFriendAchievement);
      }
    }
    
    // Pet collector (all pets)
    const petCollectorAchievement = newAchievements.find(a => a.id === 'pet-collector');
    if (petCollectorAchievement) {
      const totalUnlockedPets = gameState.pets.filter(p => p.unlocked).length;
      const ownedPets = gameState.pets.filter(p => p.owned).length;
      petCollectorAchievement.progress = ownedPets;
      
      if (totalUnlockedPets > 0 && totalUnlockedPets === ownedPets && !petCollectorAchievement.isUnlocked && !previouslyUnlockedRef.current.has('pet-collector')) {
        petCollectorAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(petCollectorAchievement);
      }
    }
    
    // Surge master (activate SURGE MODE 5 times)
    const surgeMasterAchievement = newAchievements.find(a => a.id === 'surge-master');
    if (surgeMasterAchievement) {
      surgeMasterAchievement.progress = Math.min(surgeModeActivations, 5);
      if (surgeModeActivations >= 5 && !surgeMasterAchievement.isUnlocked && !previouslyUnlockedRef.current.has('surge-master')) {
        surgeMasterAchievement.isUnlocked = true;
        changed = true;
        newlyUnlocked.push(surgeMasterAchievement);
      }
    }

    if (changed) {
      // Update the list of previously unlocked achievements
      const newUnlockedIds = new Set<string>(previouslyUnlockedRef.current);
      newlyUnlocked.forEach(achievement => {
        newUnlockedIds.add(achievement.id);
        showAchievementToast(achievement);
      });
      previouslyUnlockedRef.current = newUnlockedIds;
      
      setLocalAchievements(newAchievements);
      
      // Save achievements to localStorage
      localStorage.setItem('clickerGameAchievements', JSON.stringify(newAchievements));
      
      // Update game unlocks based on achievements
      updateGameUnlocks(newUnlockedIds);
    }
  }, [gameState, localAchievements, surgeModeActivations, isInitialLoad, updateGameUnlocks]);
  
  const showAchievementToast = useCallback((achievement: typeof localAchievements[0]) => {
    toast({
      title: `Achievement Unlocked: ${achievement.title}`,
      description: `${achievement.description}\nHow to unlock: ${achievement.unlockMessage}`,
    });
  }, []);
  
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
    <div className="container mx-auto px-4 py-3 relative overflow-hidden">
      {/* Header with game stats */}
      <div className="bg-[#2f3540] rounded-md shadow-md flex items-center justify-between px-4 py-3 mb-4 text-[#acb1b9]">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold">{formatNumber(gameState.points)}P</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">+{formatNumber(gameState.pointsPerClick)}/click</div>
            <div className="text-sm">+{formatNumber(gameState.pointsPerSecond)}/sec</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-[#434a5a] rounded-md px-3 py-1">
            <span className="text-sm font-medium">Level {gameState.level}</span>
          </div>
          
          {/* Reset, Achievements and Sound toggle buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full p-2 h-auto bg-[#434a5a] border-none text-[#acb1b9]"
              onClick={toggleSound}
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full p-2 h-auto bg-[#434a5a] border-none text-[#acb1b9]"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Trophy size={16} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full p-2 h-auto bg-[#434a5a] border-none text-[#acb1b9]">
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
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column - Clicker and Upgrades */}
        <div className="md:col-span-1 space-y-4">
          {/* Clicker panel */}
          <div className="glass-panel rounded-md overflow-hidden">
            <div className="bg-[#eef1f5] p-4 flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-[#515763] mb-4">
                SG Clicker: a small grind to get them giveaways!
              </h2>
              <ClickerButton 
                onClick={handleGameClick}
                pointsPerClick={gameState.pointsPerClick * (surgeMode ? 2 : 1)}
                surgeMode={surgeMode}
                playSound={soundEnabled}
              />
              
              {/* Level progress bar */}
              <LevelProgress 
                level={gameState.level}
                xp={gameState.xp}
                xpToNextLevel={gameState.xpToNextLevel}
              />
            </div>
            
            {/* Stats shown below the clicker */}
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
              level={gameState.level}
            />
          </div>
          
          {/* Upgrades panel moved to bottom left */}
          <UpgradeShop 
            gameState={gameState}
            onPurchase={purchaseUpgrade}
            onPetPurchase={purchasePet}
            calculateUpgradeCost={calculateUpgradeCost}
          />
        </div>
        
        {/* Right column - Games */}
        <div className="md:col-span-2">
          <Games games={gameState.games} userLevel={gameState.level} />
        </div>
      </div>
      
      {/* Bonus elements */}
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
          className="
