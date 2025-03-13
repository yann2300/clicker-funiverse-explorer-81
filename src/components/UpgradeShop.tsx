
import { useState } from 'react';
import { Upgrade, Pet, GameState } from '@/types/gameState';
import { formatNumber, calculateTimeToTarget } from '@/lib/gameUtils';
import AnimatedCounter from './AnimatedCounter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LucideIcon, 
  MousePointer, 
  Timer, 
  Zap, 
  Cpu, 
  Lightbulb, 
  Factory,
  Cat,
  Dog,
  Bird,
  Fish,
  Sparkle
} from 'lucide-react';

interface UpgradeShopProps {
  gameState: GameState;
  onPurchase: (upgradeId: string) => void;
  onPetPurchase: (petId: string) => void;
  calculateUpgradeCost: (upgrade: Upgrade) => number;
}

// Map of upgrade IDs to Lucide icons
const upgradeIcons: Record<string, LucideIcon> = {
  'better-click': MousePointer,
  'auto-clicker': Timer,
  'efficiency': Zap,
  'automatic-system': Cpu,
  'innovation': Lightbulb,
  'factory': Factory,
};

// Map of pet icons
const petIcons: Record<string, LucideIcon> = {
  'cat': Cat,
  'dog': Dog,
  'bird': Bird,
  'fish': Fish,
  'sparkle': Sparkle,
};

const UpgradeShop = ({ gameState, onPurchase, onPetPurchase, calculateUpgradeCost }: UpgradeShopProps) => {
  const [hoveredUpgrade, setHoveredUpgrade] = useState<string | null>(null);
  const [hoveredPet, setHoveredPet] = useState<string | null>(null);
  
  // Filter upgrades based on tab type
  const clickUpgrades = gameState.upgrades.filter(
    u => u.type === 'click' && (!u.unlockPoints || gameState.totalPoints >= u.unlockPoints)
  );
  
  const passiveUpgrades = gameState.upgrades.filter(
    u => u.type === 'passive' && (!u.unlockPoints || gameState.totalPoints >= u.unlockPoints)
  );
  
  // Filter pets that are unlocked
  const availablePets = gameState.pets.filter(p => p.unlocked);
  
  // Calculate total upgrade levels to show pet unlock progress
  const totalUpgradeLevel = gameState.upgrades.reduce(
    (total, upgrade) => total + upgrade.currentLevel, 
    0
  );
  
  // Check if pets tab is available (at least 5 total upgrade levels)
  const petsTabAvailable = totalUpgradeLevel >= 5;
  
  // Handle upgrade purchase
  const handlePurchase = (upgradeId: string) => {
    onPurchase(upgradeId);
  };
  
  // Handle pet purchase
  const handlePetPurchase = (petId: string) => {
    onPetPurchase(petId);
  };
  
  // Render an individual upgrade item
  const renderUpgradeItem = (upgrade: Upgrade) => {
    const cost = calculateUpgradeCost(upgrade);
    const canAfford = gameState.points >= cost;
    const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;
    const isHovered = hoveredUpgrade === upgrade.id;
    
    // Get the appropriate icon
    const IconComponent = upgradeIcons[upgrade.id] || MousePointer;
    
    // Calculate time to afford
    const timeToAfford = !canAfford && gameState.pointsPerSecond > 0
      ? calculateTimeToTarget(gameState.points, cost, gameState.pointsPerSecond)
      : null;
    
    return (
      <div 
        key={upgrade.id}
        className={`relative overflow-hidden rounded-xl p-4 transition-all duration-200
                    ${isHovered ? 'bg-game-neutral/70' : 'bg-white/80'}
                    ${canAfford && !isMaxLevel
                      ? 'cursor-pointer hover:shadow-md' 
                      : 'opacity-75 cursor-not-allowed'
                    }
                    backdrop-blur-sm border border-white/40 shadow-sm mb-3`}
        onClick={() => canAfford && !isMaxLevel && handlePurchase(upgrade.id)}
        onMouseEnter={() => setHoveredUpgrade(upgrade.id)}
        onMouseLeave={() => setHoveredUpgrade(null)}
      >
        <div className="flex items-center">
          <div className={`mr-3 p-2 rounded-full
                         ${upgrade.type === 'click' 
                           ? 'bg-game-accent text-white' 
                           : 'bg-amber-500 text-white'}`}
          >
            <IconComponent size={18} />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-game-text">
                {upgrade.name}
              </h3>
              <span className="text-sm text-game-text-secondary">
                Lvl <AnimatedCounter value={upgrade.currentLevel} format={false} />
                {upgrade.maxLevel !== Infinity && (
                  <span>/{upgrade.maxLevel}</span>
                )}
              </span>
            </div>
            
            <p className="text-xs text-game-text-secondary mt-0.5">
              {upgrade.description}
            </p>
            
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm font-medium">
                <span className={`${canAfford ? 'text-game-accent' : 'text-game-text-secondary'}`}>
                  {formatNumber(cost)} points
                </span>
                
                {timeToAfford !== null && (
                  <span className="text-xs text-game-text-secondary ml-1">
                    ({Math.ceil(timeToAfford)}s)
                  </span>
                )}
              </div>
              
              <div className="text-xs bg-game-neutral px-2 py-0.5 rounded-full text-game-text-secondary">
                {upgrade.type === 'click' 
                  ? `+${upgrade.baseValue} per click` 
                  : `+${upgrade.baseValue}/s`}
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress bar for max level */}
        {upgrade.maxLevel !== Infinity && (
          <div className="mt-3 h-1 w-full bg-game-neutral-dark/30 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${upgrade.type === 'click' ? 'bg-game-accent' : 'bg-amber-500'}`}
              style={{ width: `${(upgrade.currentLevel / upgrade.maxLevel) * 100}%` }}
            ></div>
          </div>
        )}
        
        {/* Max level indicator */}
        {isMaxLevel && (
          <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-game-text px-3 py-1 rounded-full text-white text-xs font-medium">
              MAX LEVEL
            </span>
          </div>
        )}
      </div>
    );
  };
  
  // Render an individual pet item
  const renderPetItem = (pet: Pet) => {
    const canAfford = gameState.points >= pet.cost;
    const isOwned = pet.owned;
    const isHovered = hoveredPet === pet.id;
    
    // Get the appropriate icon
    const IconComponent = petIcons[pet.icon] || Cat;
    
    // Calculate time to afford
    const timeToAfford = !canAfford && !isOwned && gameState.pointsPerSecond > 0
      ? calculateTimeToTarget(gameState.points, pet.cost, gameState.pointsPerSecond)
      : null;
    
    // Get bonus description
    const getBonusDescription = (pet: Pet) => {
      switch (pet.bonusType) {
        case 'pointsMultiplier':
          return `Increases all earned points by ${pet.bonusValue * 100}%`;
        case 'surgeTimeBonus':
          return `Extends SURGE MODE duration by ${pet.bonusValue} seconds`;
        case 'clickValueBoost':
          return `Boosts click value by ${pet.bonusValue * 100}%`;
        case 'passiveBoost':
          return `Increases passive income by ${pet.bonusValue * 100}%`;
        case 'surgeModeChance':
          return `${pet.bonusValue * 100}% chance to trigger SURGE MODE on clicks`;
        default:
          return '';
      }
    };
    
    return (
      <div 
        key={pet.id}
        className={`relative overflow-hidden rounded-xl p-4 transition-all duration-200
                    ${isHovered ? 'bg-game-neutral/70' : 'bg-white/80'}
                    ${!isOwned && canAfford
                      ? 'cursor-pointer hover:shadow-md' 
                      : isOwned 
                        ? 'bg-green-50/80 border-green-200/50' 
                        : 'opacity-75 cursor-not-allowed'
                    }
                    backdrop-blur-sm border border-white/40 shadow-sm mb-3`}
        onClick={() => !isOwned && canAfford && handlePetPurchase(pet.id)}
        onMouseEnter={() => setHoveredPet(pet.id)}
        onMouseLeave={() => setHoveredPet(null)}
      >
        <div className="flex items-center">
          <div className="mr-3 p-2 rounded-full bg-purple-500 text-white">
            <IconComponent size={18} />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-game-text">
                {pet.name}
              </h3>
              {isOwned && (
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Owned
                </span>
              )}
            </div>
            
            <p className="text-xs text-game-text-secondary mt-0.5">
              {pet.description}
            </p>
            
            <div className="mt-2">
              <div className="text-xs bg-game-neutral px-2 py-0.5 rounded-full text-game-text-secondary inline-block">
                {getBonusDescription(pet)}
              </div>
            </div>
            
            {!isOwned && (
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm font-medium">
                  <span className={`${canAfford ? 'text-purple-500' : 'text-game-text-secondary'}`}>
                    {formatNumber(pet.cost)} points
                  </span>
                  
                  {timeToAfford !== null && (
                    <span className="text-xs text-game-text-secondary ml-1">
                      ({Math.ceil(timeToAfford)}s)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Owned indicator */}
        {isOwned && (
          <div className="absolute top-2 right-2">
            <span className="text-green-500">
              <Sparkle size={16} />
            </span>
          </div>
        )}
      </div>
    );
  };

  // Render the pets locked message
  const renderPetsLocked = () => {
    // Find the next pet that will be unlocked
    const nextPet = gameState.pets.find(p => !p.unlocked);
    const nextUnlockLevel = nextPet ? nextPet.unlockLevel : 0;
    
    return (
      <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 flex flex-col items-center">
        <div className="text-gray-400 mb-3">
          <Cat size={48} />
        </div>
        <h3 className="text-lg font-medium text-game-text mb-2">
          Pets system locked
        </h3>
        <p className="text-sm text-game-text-secondary mb-4">
          {petsTabAvailable 
            ? "You've unlocked the pets system! Upgrade more to unlock pets."
            : "Unlock the pets system by getting more upgrades."}
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 max-w-md">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (totalUpgradeLevel / 5) * 100)}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-game-text-secondary mt-2">
          {totalUpgradeLevel < 5 
            ? `${totalUpgradeLevel}/5 upgrade levels to unlock Pets tab`
            : nextPet 
              ? `${totalUpgradeLevel}/${nextUnlockLevel} upgrade levels to unlock next pet`
              : "All pets can be unlocked!"}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full glass-panel rounded-2xl p-4 overflow-hidden">
      <h2 className="font-semibold text-xl mb-3 text-game-text">Upgrades</h2>
      
      <Tabs defaultValue="click" className="w-full">
        <TabsList className={`grid ${petsTabAvailable ? 'grid-cols-3' : 'grid-cols-2'} mb-4`}>
          <TabsTrigger value="click">Click Upgrades</TabsTrigger>
          <TabsTrigger value="passive">Passive Upgrades</TabsTrigger>
          {petsTabAvailable && (
            <TabsTrigger value="pets" className="relative">
              Pets
              {availablePets.some(p => !p.owned) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
              )}
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="click" className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          {clickUpgrades.length > 0 ? (
            clickUpgrades.map(renderUpgradeItem)
          ) : (
            <div className="text-center p-6 text-game-text-secondary">
              No click upgrades available yet
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="passive" className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          {passiveUpgrades.length > 0 ? (
            passiveUpgrades.map(renderUpgradeItem)
          ) : (
            <div className="text-center p-6 text-game-text-secondary">
              No passive upgrades available yet
            </div>
          )}
        </TabsContent>
        
        {petsTabAvailable && (
          <TabsContent value="pets" className="overflow-y-auto" style={{ maxHeight: '400px' }}>
            {availablePets.length > 0 ? (
              availablePets.map(renderPetItem)
            ) : (
              renderPetsLocked()
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UpgradeShop;
