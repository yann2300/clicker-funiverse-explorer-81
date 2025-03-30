
import React, { useEffect, useRef } from 'react';
import { toast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockMessage: string;
  isUnlocked: boolean;
  progress: number;
  progressMax?: number;
}

interface AchievementSystemProps {
  achievements: Achievement[];
  gameState: any;
  previouslyUnlocked: Set<string>;
  surgeModeActivations: number;
  isInitialLoad: boolean;
  updatePreviouslyUnlocked: (ids: Set<string>) => void;
  setAchievements: (achievements: Achievement[]) => void;
  updateGameUnlocks: (ids: Set<string>) => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  gameState,
  previouslyUnlocked,
  surgeModeActivations,
  isInitialLoad,
  updatePreviouslyUnlocked,
  setAchievements,
  updateGameUnlocks
}) => {
  const previouslyUnlockedRef = useRef<Set<string>>(previouslyUnlocked);

  // Use this effect to sync the ref with the prop
  useEffect(() => {
    previouslyUnlockedRef.current = previouslyUnlocked;
  }, [previouslyUnlocked]);

  // Update achievement progress and check for unlocks
  useEffect(() => {
    // Skip achievement checks during initial load
    if (isInitialLoad) return;
    
    // Check for achievements
    const newAchievements = [...achievements];
    let changed = false;
    const newlyUnlocked: typeof achievements = [];

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
      updatePreviouslyUnlocked(newUnlockedIds);
      
      setAchievements(newAchievements);
      
      // Save achievements to localStorage
      localStorage.setItem('clickerGameAchievements', JSON.stringify(newAchievements));
      
      // Update game unlocks based on achievements
      updateGameUnlocks(newUnlockedIds);
    }
  }, [gameState, achievements, surgeModeActivations, isInitialLoad, updateGameUnlocks, setAchievements, updatePreviouslyUnlocked]);

  const showAchievementToast = (achievement: Achievement) => {
    toast({
      title: `Achievement Unlocked: ${achievement.title}`,
      description: `${achievement.description}\nHow to unlock: ${achievement.unlockMessage}`,
    });
  };

  return null; // This component doesn't render anything, it just handles achievement logic
};

export default AchievementSystem;
