import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { GameState, Upgrade, Pet } from '@/types/gameState';
import usePetsSystem, { initialPets } from './usePetsSystem';
import useUpgradesSystem, { initialUpgrades } from './useUpgradesSystem';

// Define day thresholds
const DAY_THRESHOLDS = [
  0,        // Day 1 - initial state
  100,      // Day 2
  500,      // Day 3
  1000,     // Day 4
  5000,     // Day 5
  10000,    // Day 6
  30000,    // Day 7
  40000,    // Day 8
  50000,    // Day 9
  65000,    // Day 10
  80000,    // Day 11
  100000,   // Day 12
  120000,   // Day 13
  130000,   // Day 14
  150000,   // Day 15
  180000,   // Day 16
  230000,   // Day 17
  280000,   // Day 18
  310000,   // Day 19
  350000,   // Day 20
  400000,   // Day 21
  420000,   // Day 22
  480000,   // Day 23
  520000,   // Day 24
  570000,   // Day 25
  620000,   // Day 26
  680000,   // Day 27
  750000,   // Day 28
  830000,   // Day 29
  900000,   // Day 30
  1000000,  // Day 31
  Infinity  // Beyond day 31
];

// Calculate day based on total points
const calculateDayFromPoints = (totalPoints: number): { day: number; dayProgress: number; pointsToNextDay: number } => {
  // Find the current day based on points
  let day = 1;
  for (let i = 1; i < DAY_THRESHOLDS.length; i++) {
    if (totalPoints >= DAY_THRESHOLDS[i-1] && totalPoints < DAY_THRESHOLDS[i]) {
      day = i;
      break;
    }
  }
  
  // Ensure day is at least 1 and at most 31
  day = Math.max(1, Math.min(31, day));
  
  // Calculate progress within the current day
  const dayStartPoints = DAY_THRESHOLDS[day-1];
  const nextDayPoints = DAY_THRESHOLDS[day];
  const dayProgress = totalPoints - dayStartPoints;
  const pointsToNextDay = nextDayPoints - dayStartPoints;
  
  return { day, dayProgress, pointsToNextDay };
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
  day: 1,
  dayProgress: 0,
  pointsToNextDay: DAY_THRESHOLDS[1], // Points needed to go from day 1 to day 2
  clickValueBoost: 0,
  passiveBoost: 0,
  surgeModeChance: 0,
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
        if (parsed.clickValueBoost === undefined) {
          parsed.clickValueBoost = 0;
        }
        if (parsed.passiveBoost === undefined) {
          parsed.passiveBoost = 0;
        }
        if (parsed.surgeModeChance === undefined) {
          parsed.surgeModeChance = 0;
        }
        
        // Convert old level system to day system if needed
        if (parsed.level !== undefined && parsed.day === undefined) {
          const dayInfo = calculateDayFromPoints(parsed.totalPoints);
          parsed.day = dayInfo.day;
          parsed.dayProgress = dayInfo.dayProgress;
          parsed.pointsToNextDay = dayInfo.pointsToNextDay;
          
          // Remove old level properties
          delete parsed.level;
          delete parsed.xp;
          delete parsed.xpToNextLevel;
        }
        
        // Add day system if not present
        if (parsed.day === undefined) {
          const dayInfo = calculateDayFromPoints(parsed.totalPoints);
          parsed.day = dayInfo.day;
          parsed.dayProgress = dayInfo.dayProgress;
          parsed.pointsToNextDay = dayInfo.pointsToNextDay;
        }
        
        // Remove games property as it's no longer used
        if (parsed.games) {
          delete parsed.games;
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
      
      // Calculate day based on total points
      const dayInfo = calculateDayFromPoints(newTotalPoints);
      
      // Check for day change
      if (dayInfo.day > prev.day) {
        // Show toast message for day advancement
        toast({
          title: `Advanced to Day ${dayInfo.day}!`,
          description: `You've reached ${DAY_THRESHOLDS[dayInfo.day-1]} points!`
        });
        
        return {
          ...prev,
          points: prev.points + amount,
          totalPoints: newTotalPoints,
          day: dayInfo.day,
          dayProgress: dayInfo.dayProgress,
          pointsToNextDay: dayInfo.pointsToNextDay
        };
      }
      
      return {
        ...prev,
        points: prev.points + amount,
        totalPoints: newTotalPoints,
        dayProgress: dayInfo.dayProgress
      };
    });
  }, []);
  
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
      
      // Calculate day info in case total points change affects it
      const newTotalPoints = prev.totalPoints; // Total points don't change from upgrade
      const dayInfo = calculateDayFromPoints(newTotalPoints);
      
      const newState = {
        ...prev,
        points: prev.points - cost,
        pointsPerClick: newPointsPerClick,
        pointsPerSecond: newPointsPerSecond,
        pointsMultiplier: petBonuses.pointsMultiplier,
        surgeTimeBonus: petBonuses.surgeTimeBonus,
        clickValueBoost: petBonuses.clickValueBoost,
        passiveBoost: petBonuses.passiveBoost,
        surgeModeChance: petBonuses.surgeModeChance,
        upgrades: newUpgrades,
        pets: updatedPets,
        day: dayInfo.day,
        dayProgress: dayInfo.dayProgress,
        pointsToNextDay: dayInfo.pointsToNextDay,
        lastSaved: new Date(),
      };
      
      // Immediately save after purchase
      localStorage.setItem('clickerGameState', JSON.stringify(newState));
      
      return newState;
    });
  }, [calculateUpgradeCost, updateUnlockedPets, calculateNewClickValue, calculatePetBonuses]);
  
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
      
      // Calculate day info in case total points change affects it
      const newTotalPoints = prev.totalPoints; // Total points don't change from pet purchase
      const dayInfo = calculateDayFromPoints(newTotalPoints);
      
      const newState = {
        ...prev,
        points: prev.points - pet.cost,
        pets: newPets,
        pointsPerClick: newPointsPerClick,
        pointsMultiplier: petBonuses.pointsMultiplier,
        surgeTimeBonus: petBonuses.surgeTimeBonus,
        clickValueBoost: petBonuses.clickValueBoost,
        passiveBoost: petBonuses.passiveBoost,
        surgeModeChance: petBonuses.surgeModeChance,
        day: dayInfo.day,
        dayProgress: dayInfo.dayProgress,
        pointsToNextDay: dayInfo.pointsToNextDay,
        lastSaved: new Date(),
      };
      
      // Immediately save after purchase
      localStorage.setItem('clickerGameState', JSON.stringify(newState));
      
      return newState;
    });
  }, [calculatePetBonuses, calculateNewClickValue]);

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
  
  const updateGameUnlocks = useCallback((unlockedAchievements: Set<string>) => {
    // For now, this function does nothing but will be implemented later
  }, []);
  
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
