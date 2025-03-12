
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
    id: 'points-collector',
    title: 'Points Collector',
    description: 'Amass a small fortune',
    unlockMessage: 'Reach 1,000 total points',
    isUnlocked: false,
    icon: 'Coins'
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
  }
];
