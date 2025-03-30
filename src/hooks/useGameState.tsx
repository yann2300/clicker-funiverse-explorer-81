import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { GameState, Upgrade, Pet } from '@/types/gameState';
import usePetsSystem, { initialPets } from './usePetsSystem';
import useUpgradesSystem, { initialUpgrades } from './useUpgradesSystem';
import { initialGames } from '@/lib/games';

// Calculate XP needed for next level based on current level
const calculateXpForLevel = (level: number): number => {
  return Math.floor(10000 * Math.pow(1.07, level - 1));
};

// Calculate level based on total points
const calculateLevelFromXp = (totalPoints: number): { level: number; xp: number; xpToNextLevel: number } => {
  // We'll base levels on total points, with level 100 at 1 billion points
  const pointsPerLevel = 1000000000 / 100; // 10 million points per level
  
  let level = Math.min(100, Math.floor(totalPoints / pointsPerLevel) + 1);
  // Ensure level is at least 1
  level = Math.max(1, level);
  
  // Calculate progress within the current level
  const levelStartPoints = (level - 1) * pointsPerLevel;
  const xp = totalPoints - levelStartPoints;
  const xpToNextLevel = level < 100 ? pointsPerLevel : 1; // At level 100, just show 1 to avoid division by zero
  
  return { level, xp, xpToNextLevel };
};

// Initial game state
const initialGameState: GameState = {
  points: 0,
  pointsPerClick: 1,
  pointsPerSecond: 0,
  totalClicks: 0,
  totalPoints: 0,
  upgrades: initialUpgrades,
  pets: initialPets,
  lastSaved: new Date(),
  surgeTimeBonus: 0,
  pointsMultiplier: 1.0,
  level: 1,
  xp: 0,
  xpToNextLevel: 10000000, // Updated for new leveling system
  games: initialGames
};

// Hook to manage game state
export const useGameState = () => {
  const { updateUnlockedPets, calculatePetBonuses } = usePetsSystem();
  const { calculateNewClickValue } = useUpgradesSystem();
  
  // Load state from localStorage
  const loadState = (): GameState => {
    const savedState = localStorage.getItem('clickerGameState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        parsed.lastSaved = new Date(parsed.lastSaved);
        
        // Ensure pets array exists (for backward compatibility)
        if (!parsed.pets) {
          parsed.pets = initialPets;
        }
        
        // Ensure new properties exist
        if (parsed.surgeTimeBonus === undefined) {
          parsed.surgeTimeBonus = 0;
        }
        if (parsed.pointsMultiplier === undefined) {
          parsed.pointsMultiplier = 1.0;
        }
        
        // Add level system if not present
        if (parsed.level === undefined) {
          parsed.level = 1;
          parsed.xp = 0;
          parsed.xpToNextLevel = calculateXpForLevel(1);
        }
        
        // Add games if not present
        if (!parsed.games) {
          parsed.games = initialGames;
        }
        
        return parsed;
      } catch (error) {
        console.error('Failed to parse saved game state:', error);
        return { ...initialGameState };
      }
    }
    return { ...initialGameState };
  };

  const [gameState, setGameState] = useState<GameState>(loadState);
  
  // Save game state to localStorage
  const saveGameState = useCallback(() => {
    const currentState = {
      ...gameState,
      lastSaved: new Date(),
    };
    
    localStorage.setItem('clickerGameState', JSON.stringify(currentState));
    setGameState(currentState);
  }, [gameState]);
  
  // Calculate upgrade cost based on its base cost and current level
  const calculateUpgradeCost = useCallback((upgrade: Upgrade): number => {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.currentLevel));
  }, []);
  
  // Add points (from clicking or passive generation)
  const addPoints = useCallback((amount: number) => {
  setGameState(prev => {
    const newTotalPoints = prev.totalPoints + amount;
    
    // Calculate level based on total points
    const levelInfo = calculateLevelFromXp(newTotalPoints);
    
    // Check for level up
    if (levelInfo.level > prev.level) {
      // Show toast message for level up
      toast({
        title: `Level Up!`,
        description: `You are now level ${levelInfo.level}!`
      });
      
      // Check if any games got unlocked
      const updatedGames = prev.games.map(game => {
        if (!game.isUnlocked && 
            game.unlockCondition.type === 'level' && 
            typeof game.unlockCondition.value === 'number' &&
            levelInfo.level >= game.unlockCondition.value) {
          
          toast({
            title: `New Game Unlocked!`,
            description: `${game.name} is now available!`
          });
          
          return { ...game, isUnlocked: true };
        }
        return game;
      });
      
      return {
        ...prev,
        points: prev.points + amount,
        totalPoints: newTotalPoints,
        level: levelInfo.level,
        xp: levelInfo.xp,
        xpToNextLevel: levelInfo.xpToNextLevel,
        games: updatedGames
      };
    }
    
    return {
      ...prev,
      points: prev.points + amount,
      totalPoints: newTotalPoints,
      xp: levelInfo.xp,
      xpToNextLevel: levelInfo.xpToNextLevel
    };
  });
}, []);
  
  // Handle clicking the main button, with an optional multiplier for SURGE MODE
  const handleClick = useCallback((multiplier = 1) => {
    setGameState(prev => {
      // Calculate bonuses from pets
      const petBonuses = calculatePetBonuses(prev.pets);
      
      // Apply click value boost and points multiplier from pets
      const clickBoost = 1 + petBonuses.clickValueBoost;
      const totalMultiplier = prev.pointsMultiplier * multiplier * clickBoost;
      
      // Check for random SURGE MODE activation from pet bonus
      let surgeTrigger = false;
      if (petBonuses.surgeModeChance > 0) {
        surgeTrigger = Math.random() < petBonuses.surgeModeChance;
      }
      
      // Calculate XP gain (same as points)
      const pointsGained = prev.pointsPerClick * totalMultiplier;
      
      return {
        ...prev,
        points: prev.points + pointsGained,
        totalPoints: prev.totalPoints + pointsGained,
        totalClicks: prev.totalClicks + 1,
        // Return surge trigger status in case we need it
        surgeTrigger: surgeTrigger
      };
    });
    
    // Add XP based on points earned
    const pointsEarned = gameState.pointsPerClick * (multiplier * (1 + calculatePetBonuses(gameState.pets).clickValueBoost));
    addPoints(pointsEarned);
  }, [calculatePetBonuses, addPoints, gameState.pointsPerClick, gameState.pets]);
  
  // Purchase an upgrade
  const purchaseUpgrade = useCallback((upgradeId: string) => {
    setGameState(prev => {
      const upgradeIndex = prev.upgrades.findIndex(u => u.id === upgradeId);
      
      if (upgradeIndex === -1) return prev;
      
      const upgrade = prev.upgrades[upgradeIndex];
      const cost = calculateUpgradeCost(upgrade);
      
      // Check if we can afford it and haven't reached max level
      if (prev.points < cost || upgrade.currentLevel >= upgrade.maxLevel) {
        return prev;
      }
      
      // Create a copy of the upgrades array
      const newUpgrades = [...prev.upgrades];
      
      // Increment the level of the purchased upgrade
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        currentLevel: upgrade.currentLevel + 1,
      };
      
      // Calculate new points per click and per second
      let newPointsPerClick = calculateNewClickValue(1, newUpgrades);
      let newPointsPerSecond = 0;
      
      // Calculate passive points generation
      newUpgrades.forEach(upgrade => {
        if (upgrade.type === 'passive') {
          newPointsPerSecond += upgrade.baseValue * upgrade.currentLevel;
        }
      });
      
      // Update unlocked pets based on new upgrade levels
      const updatedPets = updateUnlockedPets({
        ...prev,
        upgrades: newUpgrades
      });
      
      // Recalculate pet bonuses after buying the upgrade
      const petBonuses = calculatePetBonuses(updatedPets);
      
      const newState = {
        ...prev,
        points: prev.points - cost,
        pointsPerClick: newPointsPerClick,
        pointsPerSecond: newPointsPerSecond,
        pointsMultiplier: petBonuses.pointsMultiplier,
        surgeTimeBonus: petBonuses.surgeTimeBonus,
        upgrades: newUpgrades,
        pets: updatedPets,
        lastSaved: new Date(),
      };
      
      // Immediately save after purchase
      localStorage.setItem('clickerGameState', JSON.stringify(newState));
      
      return newState;
    });
  }, [calculateUpgradeCost, updateUnlockedPets, calculateNewClickValue, calculatePetBonuses]);
  
  // Purchase a pet
  const purchasePet = useCallback((petId: string) => {
    setGameState(prev => {
      const petIndex = prev.pets.findIndex(p => p.id === petId);
      
      if (petIndex === -1) return prev;
      
      const pet = prev.pets[petIndex];
      
      // Check if the pet is unlocked, not already owned, and affordable
      if (!pet.unlocked || pet.owned || prev.points < pet.cost) {
        return prev;
      }
      
      // Create a copy of the pets array
      const newPets = [...prev.pets];
      
      // Mark the pet as owned
      newPets[petIndex] = {
        ...pet,
        owned: true
      };
      
      // Recalculate bonuses from pets
      const petBonuses = calculatePetBonuses(newPets);
      
      // Fix: Recalculate pointsPerClick with pet bonuses
      const newPointsPerClick = calculateNewClickValue(1, prev.upgrades);
      
      const newState = {
        ...prev,
        points: prev.points - pet.cost,
        pets: newPets,
        pointsPerClick: newPointsPerClick,
        pointsMultiplier: petBonuses.pointsMultiplier,
        surgeTimeBonus: petBonuses.surgeTimeBonus,
        lastSaved: new Date(),
      };
      
      // Immediately save after purchase
      localStorage.setItem('clickerGameState', JSON.stringify(newState));
      
      return newState;
    });
  }, [calculatePetBonuses, calculateNewClickValue]);
  
  // Update game unlock state based on achievements
  const updateGameUnlocks = useCallback((unlockedAchievements: Set<string>) => {
    setGameState(prev => {
      const updatedGames = prev.games.map(game => {
        if (!game.isUnlocked && 
            game.unlockCondition.type === 'achievement' && 
            typeof game.unlockCondition.value === 'string' &&
            unlockedAchievements.has(game.unlockCondition.value)) {
          
          toast({
            title: `New Game Unlocked!`,
            description: `${game.name} is now available!`
          });
          
          return { ...game, isUnlocked: true };
        }
        return game;
      });
      
      return {
        ...prev,
        games: updatedGames
      };
    });
  }, []);
  
  // Passive income generation with pet bonuses
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState.pointsPerSecond > 0) {
        // Calculate bonuses from pets
        const petBonuses = calculatePetBonuses(gameState.pets);
        const passiveBoost = 1 + petBonuses.passiveBoost;
        
        // Apply bonuses to passive income
        const totalPassiveIncome = gameState.pointsPerSecond * gameState.pointsMultiplier * passiveBoost;
        addPoints(totalPassiveIncome / 10); // Divide by 10 because we update 10 times per second
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [gameState.pointsPerSecond, gameState.pointsMultiplier, gameState.pets, addPoints, calculatePetBonuses]);
  
  // Auto-save game state every 3 seconds
  useEffect(() => {
    const saveTimer = setInterval(saveGameState, 3000); // 3 seconds
    
    return () => clearInterval(saveTimer);
  }, [saveGameState]);
  
  // Reset game state
  const resetGame = useCallback(() => {
    localStorage.removeItem('clickerGameState');
    localStorage.removeItem('clickerGameAchievements'); // Also clear achievements
    setGameState({ ...initialGameState });
    toast({
      title: "Game Reset",
      description: "Game has been reset successfully"
    });
  }, []);
  
  // Get surge time including pet bonuses
  const getSurgeTime = useCallback(() => {
    return 10 + gameState.surgeTimeBonus; // Base 10 seconds + pet bonuses
  }, [gameState.surgeTimeBonus]);
  
  return {
    gameState,
    handleClick,
    purchaseUpgrade,
    purchasePet,
    calculateUpgradeCost,
    resetGame,
    getSurgeTime,
    saveGameState,
    updateGameUnlocks,
  };
};

export default useGameState;
