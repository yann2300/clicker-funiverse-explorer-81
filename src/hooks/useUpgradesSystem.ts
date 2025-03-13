
import { useCallback } from 'react';
import { Upgrade } from '@/types/gameState';

// Initial upgrades configuration
export const initialUpgrades: Upgrade[] = [
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
];

export const useUpgradesSystem = () => {
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
  
  return {
    initialUpgrades,
    calculateNewClickValue
  };
};

export default useUpgradesSystem;
