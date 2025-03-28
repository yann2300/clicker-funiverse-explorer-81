
import { Game } from '@/types/gameState';

export const initialGames: Game[] = [
  {
    id: 'nonogram',
    name: 'Nonogram Puzzle',
    description: 'Solve the pixel puzzle to earn points',
    imageUrl: 'https://cdn.pixabay.com/photo/2021/10/13/11/31/nonogram-6706748_1280.jpg',
    pointsCost: 1000,
    unlockCondition: {
      type: 'level',
      value: 2
    },
    link: '/games/nonogram',
    isUnlocked: false
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Match pairs of cards to earn points',
    imageUrl: 'https://cdn.pixabay.com/photo/2016/03/31/19/19/cards-1295699_1280.png',
    pointsCost: 5000,
    unlockCondition: {
      type: 'level',
      value: 5
    },
    link: '/games/memory',
    isUnlocked: false
  },
  {
    id: 'snake',
    name: 'Snake Game',
    description: 'Control the snake to eat food and grow',
    imageUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/21/snake-310151_1280.png',
    pointsCost: 10000,
    unlockCondition: {
      type: 'level',
      value: 10
    },
    link: '/games/snake',
    isUnlocked: false
  },
  {
    id: 'puzzle',
    name: 'Jigsaw Puzzle',
    description: 'Complete the jigsaw puzzle to earn points',
    imageUrl: 'https://cdn.pixabay.com/photo/2016/02/01/12/33/puzzle-1173426_1280.png',
    pointsCost: 25000,
    unlockCondition: {
      type: 'achievement',
      value: 'points-collector'
    },
    link: '/games/puzzle',
    isUnlocked: false
  }
];

export const findGameById = (games: Game[], id: string): Game | undefined => {
  return games.find(game => game.id === id);
};
