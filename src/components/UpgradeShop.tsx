
import { useState } from 'react';
import { Upgrade, GameState } from '@/hooks/useGameState';
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
  Factory 
} from 'lucide-react';

interface UpgradeShopProps {
  gameState: GameState;
  onPurchase: (upgradeId: string) => void;
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

const UpgradeShop = ({ gameState, onPurchase, calculateUpgradeCost }: UpgradeShopProps) => {
  const [hoveredUpgrade, setHoveredUpgrade] = useState<string | null>(null);
  
  // Filter upgrades based on tab type
  const clickUpgrades = gameState.upgrades.filter(
    u => u.type === 'click' && (!u.unlockPoints || gameState.totalPoints >= u.unlockPoints)
  );
  
  const passiveUpgrades = gameState.upgrades.filter(
    u => u.type === 'passive' && (!u.unlockPoints || gameState.totalPoints >= u.unlockPoints)
  );
  
  // Handle upgrade purchase
  const handlePurchase = (upgradeId: string) => {
    onPurchase(upgradeId);
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
  
  return (
    <div className="w-full glass-panel rounded-2xl p-4 overflow-hidden">
      <h2 className="font-semibold text-xl mb-3 text-game-text">Upgrades</h2>
      
      <Tabs defaultValue="click" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="click">Click Upgrades</TabsTrigger>
          <TabsTrigger value="passive">Passive Upgrades</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default UpgradeShop;
