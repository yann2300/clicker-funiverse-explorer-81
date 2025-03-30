
import React from 'react';

interface BonusMoleProps {
  position: {
    x: number;
    y: number;
    corner: number;
    entering: boolean;
  };
  onClick: () => void;
}

const BonusMole: React.FC<BonusMoleProps> = ({ position, onClick }) => {
  // Calculate bonus position styles based on corner and animation state
  const getBonusStyles = () => {
    const baseStyles = {
      position: 'fixed',
      width: '30px',
      height: '30px',
      zIndex: 100,
      cursor: 'pointer',
      transition: 'all 1s ease-out',
    } as const;
    
    // Determine offsets based on corner
    let x = position.x;
    let y = position.y;
    
    // Apply offset based on animation state
    switch (position.corner) {
      case 0: // top-left
        x += position.entering ? 0 : 30;
        break;
      case 1: // top-right
        x -= position.entering ? 0 : 30;
        break;
      case 2: // bottom-left
        x += position.entering ? 0 : 30;
        break;
      case 3: // bottom-right
        x -= position.entering ? 0 : 30;
        break;
    }
    
    return {
      ...baseStyles,
      left: `${x}px`,
      top: `${y}px`,
    };
  };

  return (
    <div
      onClick={onClick}
      style={getBonusStyles()}
    >
      <img
        src="https://s3.eu-west-2.amazonaws.com/img.creativepool.com/files/candidate/portfolio/full/752444.png"
        alt="Bonus"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default BonusMole;
