
import { useCallback } from 'react';
import { Pet, GameState } from '@/types/gameState';

// Initial pets configuration
export const initialPets: Pet[] = [
  {
    id: 'fluffy',
    name: 'Fluffy',
    description: 'A cute little kitten that increases all earned points by 10%',
    cost: 5000,
    bonusType: 'pointsMultiplier',
    bonusValue: 0.1, // 10% increase
    unlockLevel: 5, // Total upgrade levels needed
    unlocked: false,
    owned: false,
    icon: 'cat'
  },
  {
    id: 'rex',
    name: 'Rex',
    description: 'A loyal dog that extends SURGE MODE duration by 2 seconds',
    cost: 15000,
    bonusType: 'surgeTimeBonus',
    bonusValue: 2, // +2 seconds
    unlockLevel: 10,
    unlocked: false,
    owned: false,
    icon: 'dog'
  },
  {
    id: 'tweety',
    name: 'Tweety',
    description: 'A cheerful bird that boosts click value by 25%',
    cost: 50000,
    bonusType: 'clickValueBoost',
    bonusValue: 0.25, // 25% boost
    unlockLevel: 15,
    unlocked: false,
    owned: false,
    icon: 'bird'
  },
  {
    id: 'goldie',
    name: 'Goldie',
    description: 'A magical fish that increases passive income by 20%',
    cost: 100000,
    bonusType: 'passiveBoost',
    bonusValue: 0.2, // 20% boost
    unlockLevel: 20,
    unlocked: false,
    owned: false,
    icon: 'fish'
  },
  {
    id: 'sparkles',
    name: 'Sparkles',
    description: 'A mystical unicorn that gives 10% chance for SURGE MODE to trigger on clicks',
    cost: 500000,
    bonusType: 'surgeModeChance',
    bonusValue: 0.1, // 10% chance
    unlockLevel: 30,
    unlocked: false,
    owned: false,
    icon: 'sparkle'
  }
];

export const usePetsSystem = () => {
  // Check which pets should be unlocked based on total upgrade levels
  const updateUnlockedPets = useCallback((gameState: GameState): Pet[] => {
    // Calculate total upgrade levels
    const totalUpgradeLevel = gameState.upgrades.reduce(
      (total, upgrade) => total + upgrade.currentLevel, 
      0
    );
    
    return gameState.pets.map(pet => ({
      ...pet,
      unlocked: pet.unlocked || totalUpgradeLevel >= pet.unlockLevel
    }));
  }, []);
  
  // Calculate bonus values from owned pets
  const calculatePetBonuses = useCallback((pets: Pet[]) => {
    // Initialize bonuses with base values
    // For pointsMultiplier, we start with 1.0 (100%) as the base value
    let pointsMultiplier = 1.0;
    let surgeTimeBonus = 0;
    let clickValueBoost = 0;
    let passiveBoost = 0;
    let surgeModeChance = 0;
    
    // Apply all pet bonuses
    for (const pet of pets) {
      if (pet.owned) {
        switch (pet.bonusType) {
          case 'pointsMultiplier':
            // For Fluffy: add 0.1 (10%) to the multiplier
            pointsMultiplier += pet.bonusValue;
            break;
          case 'surgeTimeBonus':
            surgeTimeBonus += pet.bonusValue;
            break;
          case 'clickValueBoost':
            clickValueBoost += pet.bonusValue;
            break;
          case 'passiveBoost':
            passiveBoost += pet.bonusValue;
            break;
          case 'surgeModeChance':
            surgeModeChance += pet.bonusValue;
            break;
        }
      }
    }
    
    return {
      pointsMultiplier,
      surgeTimeBonus,
      clickValueBoost,
      passiveBoost,
      surgeModeChance
    };
  }, []);
  
  return {
    initialPets,
    updateUnlockedPets,
    calculatePetBonuses
  };
};

export default usePetsSystem;
