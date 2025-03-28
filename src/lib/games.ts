
import { Game } from '@/types/gameState';

// Initial games data
export const initialGames: Game[] = [
  {
    id: 'diluvian-ultra',
    name: 'Diluvian Ultra',
    description: 'A roguelike deck-building experience set in a post-apocalyptic world.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1057680/capsule_616x353.jpg?t=1686891840',
    pointsCost: 50,
    unlockCondition: {
      type: 'level',
      value: 1
    },
    link: 'https://store.steampowered.com/app/1057680/Diluvian_Ultra/',
    isUnlocked: true
  },
  {
    id: 'zoeti',
    name: 'Zoeti',
    description: 'A beautiful action-adventure game with a touching narrative.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1394450/capsule_616x353.jpg?t=1621530532',
    pointsCost: 100,
    unlockCondition: {
      type: 'level',
      value: 2
    },
    link: 'https://store.steampowered.com/app/1394450/Zoeti/',
    isUnlocked: false
  },
  {
    id: 'hyperviolent',
    name: 'Hyperviolent',
    description: 'A fast-paced hardcore first-person shooter.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1577380/capsule_616x353.jpg?t=1677700789',
    pointsCost: 76,
    unlockCondition: {
      type: 'level',
      value: 3
    },
    link: 'https://store.steampowered.com/app/1577380/Hyperviolent/',
    isUnlocked: false
  },
  {
    id: 'ravensword-shadowlands',
    name: 'Ravensword: Shadowlands',
    description: 'An open-world fantasy RPG with epic battles and vast landscapes.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/253410/capsule_616x353.jpg?t=1584725981',
    pointsCost: 126,
    unlockCondition: {
      type: 'level',
      value: 4
    },
    link: 'https://store.steampowered.com/app/253410/Ravensword_Shadowlands/',
    isUnlocked: false
  },
  {
    id: 'youtubers-life',
    name: 'Youtubers Life',
    description: 'Become the world's greatest YouTuber by editing videos, expanding, and improving your skills.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/428690/capsule_616x353.jpg?t=1679653784',
    pointsCost: 176,
    unlockCondition: {
      type: 'achievement',
      value: 'first-click'
    },
    link: 'https://store.steampowered.com/app/428690/Youtubers_Life/',
    isUnlocked: false
  },
  {
    id: 'vengeance',
    name: 'Vengeance of Mr. Peppermint',
    description: 'A stylish noir action game with a revenge plot.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1041300/capsule_616x353.jpg?t=1578063302',
    pointsCost: 276,
    unlockCondition: {
      type: 'achievement',
      value: 'click-master'
    },
    link: 'https://store.steampowered.com/app/1041300/',
    isUnlocked: false
  },
  {
    id: 'inua',
    name: 'Inua - A Story in Ice and Time',
    description: 'A narrative adventure blending myth and history.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1787810/capsule_616x353.jpg?t=1677680768',
    pointsCost: 376,
    unlockCondition: {
      type: 'level',
      value: 8
    },
    link: 'https://store.steampowered.com/app/1787810/Inua__A_Story_in_Ice_and_Time/',
    isUnlocked: false
  },
  {
    id: 'end-of-sun',
    name: 'The End of the Sun',
    description: 'A first-person exploration and adventure game set in Slavic fantasy world.',
    imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1434100/capsule_616x353.jpg?t=1683027319',
    pointsCost: 676,
    unlockCondition: {
      type: 'level',
      value: 10
    },
    link: 'https://store.steampowered.com/app/1434100/The_End_of_the_Sun/',
    isUnlocked: false
  },
];
