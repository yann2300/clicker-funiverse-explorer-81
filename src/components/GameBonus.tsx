
import React from 'react';
import { Star, Puzzle } from 'lucide-react';

interface GameBonusProps {
  type: 'star' | 'puzzle';
  position: { x: number; y: number };
  onClick: () => void;
}

const GameBonus: React.FC<GameBonusProps> = ({ type, position, onClick }) => {
  const getStyles = () => {
    return {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '40px',
      height: '40px',
      zIndex: 100,
      cursor: 'pointer',
      color: type === 'star' ? '#FFD700' : '#4CAF50',
      filter: `drop-shadow(0 0 4px ${type === 'star' ? 'rgba(255, 215, 0, 0.5)' : 'rgba(76, 175, 80, 0.5)'})`,
      animation: 'pulse-subtle 2s infinite ease-in-out'
    } as const;
  };

  return (
    <div onClick={onClick} style={getStyles()}>
      {type === 'star' ? <Star size={40} /> : <Puzzle size={40} />}
    </div>
  );
};

export default GameBonus;
