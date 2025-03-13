
export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockMessage: string;
  isUnlocked: boolean;
  icon: string;
}

export const achievements: Achievement[] = [
  {
    id: 'first-click',
    title: 'First Steps',
    description: 'Begin your clicking journey',
    unlockMessage: 'Click the main button once',
    isUnlocked: false,
    icon: 'MousePointer'
  },
  {
    id: 'click-master',
    title: 'Click Master',
    description: 'Become proficient at clicking',
    unlockMessage: 'Reach 100 total clicks',
    isUnlocked: false,
    icon: 'MousePointerClick'
  },
  {
    id: 'click-enthusiast',
    title: 'Click Enthusiast',
    description: 'Your fingers are getting stronger',
    unlockMessage: 'Reach 1,000 total clicks',
    isUnlocked: false,
    icon: 'Pointer'
  },
  {
    id: 'points-collector',
    title: 'Points Collector',
    description: 'Amass a small fortune',
    unlockMessage: 'Reach 1,000 total points',
    isUnlocked: false,
    icon: 'Coins'
  },
  {
    id: 'points-hoarder',
    title: 'Points Hoarder',
    description: 'Your wealth is growing rapidly',
    unlockMessage: 'Reach 100,000 total points',
    isUnlocked: false,
    icon: 'Gem'
  },
  {
    id: 'points-tycoon',
    title: 'Points Tycoon',
    description: 'You\'ve become a points millionaire',
    unlockMessage: 'Reach 1,000,000 total points',
    isUnlocked: false,
    icon: 'Trophy'
  },
  {
    id: 'upgrade-novice',
    title: 'Upgrade Novice',
    description: 'Start improving your setup',
    unlockMessage: 'Purchase your first upgrade',
    isUnlocked: false,
    icon: 'ArrowUpCircle'
  },
  {
    id: 'automation-beginner',
    title: 'Automation Pioneer',
    description: 'Begin your automation journey',
    unlockMessage: 'Purchase your first passive upgrade',
    isUnlocked: false,
    icon: 'Settings'
  },
  {
    id: 'pet-friend',
    title: 'Pet Friend',
    description: 'Adopt your first pet companion',
    unlockMessage: 'Purchase your first pet',
    isUnlocked: false,
    icon: 'Heart'
  },
  {
    id: 'pet-collector',
    title: 'Pet Collector',
    description: 'Create a pet sanctuary',
    unlockMessage: 'Collect all available pets',
    isUnlocked: false,
    icon: 'Sparkles'
  },
  {
    id: 'surge-master',
    title: 'Surge Master',
    description: 'Harness the power of SURGE MODE',
    unlockMessage: 'Activate SURGE MODE 5 times',
    isUnlocked: false,
    icon: 'Zap'
  }
];
