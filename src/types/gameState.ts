
// Game state types for the clicker game
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

export interface Pet {
  id: string;
  name: string;
  description: string;
  cost: number;
  bonusType: 'pointsMultiplier' | 'surgeTimeBonus' | 'clickValueBoost' | 'passiveBoost' | 'surgeModeChance';
  bonusValue: number;
  unlockLevel: number; // Minimum total upgrade levels needed to unlock
  unlocked: boolean;
  owned: boolean;
  icon: string;
}

export interface GameState {
  points: number;
  pointsPerClick: number;
  pointsPerSecond: number;
  totalClicks: number;
  totalPoints: number;
  upgrades: Upgrade[];
  pets: Pet[];
  lastSaved: Date;
  // Additional properties for bonuses
  surgeTimeBonus: number;
  pointsMultiplier: number;
}
