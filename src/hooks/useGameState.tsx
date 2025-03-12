
import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/hooks/use-toast"; // Changed from @/components/ui/sonner to the correct path

// Define types for our game state
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  currentLevel: number;
  maxLevel: number;
  baseValue: number;
  type: 'click' | 'passive';
  unlockPoints?: number;
  icon: string;
}

export interface GameState {
  points: number;
  pointsPerClick: number;
  pointsPerSecond: number;
  totalClicks: number;
  totalPoints: number;
  upgrades: Upgrade[];
  lastSaved: Date;
}

// Initial game state
const initialGameState: GameState = {
  points: 0,
  pointsPerClick: 1,
  pointsPerSecond: 0,
  totalClicks: 0,
  totalPoints: 0,
  upgrades: [
    {
      id: 'better-click',
      name: 'Better Click',
      description: 'Increase points per click',
      baseCost: 10,
      currentLevel: 0,
      maxLevel: 100,
      baseValue: 1,
      type: 'click',
      icon: 'mouse-pointer',
    },
    {
      id: 'auto-clicker',
      name: 'Auto Clicker',
      description: 'Automatically generates points',
      baseCost: 50,
      currentLevel: 0,
      maxLevel: 100,
      baseValue: 1,
      type: 'passive',
      unlockPoints: 30,
      icon: 'timer',
    },
    {
      id: 'efficiency',
      name: 'Efficiency',
      description: 'All clicks are 50% more effective',
      baseCost: 200,
      currentLevel: 0,
      maxLevel: 10,
      baseValue: 0.5,
      type: 'click',
      unlockPoints: 150,
      icon: 'zap',
    },
    {
      id: 'automatic-system',
      name: 'Automatic System',
      description: 'More sophisticated auto-generation',
      baseCost: 500,
      currentLevel: 0,
      maxLevel: 50,
      baseValue: 5,
      type: 'passive',
      unlockPoints: 400,
      icon: 'cpu',
    },
    {
      id: 'innovation',
      name: 'Innovation',
      description: 'Revolutionary clicking technology',
      baseCost: 2000,
      currentLevel: 0,
      maxLevel: 25,
      baseValue: 10,
      type: 'click',
      unlockPoints: 1500,
      icon: 'lightbulb',
    },
    {
      id: 'factory',
      name: 'Factory',
      description: 'Mass production of points',
      baseCost: 5000,
      currentLevel: 0,
      maxLevel: 25,
      baseValue: 25,
      type: 'passive',
      unlockPoints: 3000,
      icon: 'factory',
    }
  ],
  lastSaved: new Date(),
};

// Hook to manage game state
export const useGameState = () => {
  // Load state from localStorage
  const loadState = (): GameState => {
    const savedState = localStorage.getItem('clickerGameState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        parsed.lastSaved = new Date(parsed.lastSaved);
        return parsed;
      } catch (error) {
        console.error('Failed to parse saved game state:', error);
        return { ...initialGameState };
      }
    }
    return { ...initialGameState };
  };

  const [gameState, setGameState] = useState<GameState>(loadState);
  
  // Calculate upgrade cost based on its base cost and current level
  const calculateUpgradeCost = useCallback((upgrade: Upgrade): number => {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.currentLevel));
  }, []);
  
  // Add points (from clicking or passive generation)
  const addPoints = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      points: prev.points + amount,
      totalPoints: prev.totalPoints + amount,
    }));
  }, []);
  
  // Handle clicking the main button
  const handleClick = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      points: prev.points + prev.pointsPerClick,
      totalPoints: prev.totalPoints + prev.pointsPerClick,
      totalClicks: prev.totalClicks + 1,
    }));
  }, []);
  
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
      let newPointsPerClick = prev.pointsPerClick;
      let newPointsPerSecond = prev.pointsPerSecond;
      
      if (upgrade.type === 'click') {
        if (upgrade.id === 'efficiency') {
          // Efficiency upgrade increases all clicks by a percentage
          newPointsPerClick = calculateNewClickValue(prev.pointsPerClick, prev.upgrades);
        } else {
          // Regular click upgrade
          newPointsPerClick += upgrade.baseValue;
        }
      } else if (upgrade.type === 'passive') {
        newPointsPerSecond += upgrade.baseValue;
      }
      
      // Show toast for upgrade purchase - Fixed toast implementation
      toast({
        title: "Upgrade Purchased",
        description: `Upgraded ${upgrade.name} to level ${upgrade.currentLevel + 1}`
      });
      
      return {
        ...prev,
        points: prev.points - cost,
        pointsPerClick: newPointsPerClick,
        pointsPerSecond: newPointsPerSecond,
        upgrades: newUpgrades,
      };
    });
  }, [calculateUpgradeCost]);
  
  // Calculate click value based on upgrades
  const calculateNewClickValue = useCallback((baseValue: number, upgrades: Upgrade[]): number => {
    let multiplier = 1;
    
    // Find the efficiency upgrade
    const efficiencyUpgrade = upgrades.find(u => u.id === 'efficiency');
    if (efficiencyUpgrade && efficiencyUpgrade.currentLevel > 0) {
      // Each level adds 50% to the multiplier
      multiplier += efficiencyUpgrade.baseValue * efficiencyUpgrade.currentLevel;
    }
    
    // Calculate base click power from direct click upgrades
    let baseClick = 1; // Start with 1 as the minimum
    upgrades.forEach(upgrade => {
      if (upgrade.type === 'click' && upgrade.id !== 'efficiency') {
        baseClick += upgrade.baseValue * upgrade.currentLevel;
      }
    });
    
    return baseClick * multiplier;
  }, []);
  
  // Passive income generation
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState.pointsPerSecond > 0) {
        addPoints(gameState.pointsPerSecond / 10); // Divide by 10 because we update 10 times per second
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [gameState.pointsPerSecond, addPoints]);
  
  // Auto-save game state every 10 seconds
  useEffect(() => {
    const saveTimer = setInterval(() => {
      localStorage.setItem('clickerGameState', JSON.stringify({
        ...gameState,
        lastSaved: new Date(),
      }));
    }, 10000);
    
    return () => clearInterval(saveTimer);
  }, [gameState]);
  
  // Reset game state
  const resetGame = useCallback(() => {
    localStorage.removeItem('clickerGameState');
    setGameState({ ...initialGameState });
    // Fixed toast implementation
    toast({
      title: "Game Reset",
      description: "Game has been reset successfully"
    });
  }, []);
  
  return {
    gameState,
    handleClick,
    purchaseUpgrade,
    calculateUpgradeCost,
    resetGame,
  };
};

export default useGameState;
