import React from 'react';

export interface ClickerButtonProps {
  onClick: () => void;
  surgeMode?: boolean;
}

const ClickerButton: React.FC<ClickerButtonProps> = ({ onClick, surgeMode }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-6 rounded-xl text-white font-bold text-xl transition-transform duration-200
                  ${surgeMode ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-xl hover:scale-105' : 'bg-game-accent hover:scale-105'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-game-accent`}
    >
      {surgeMode ? 'SURGE MODE!' : 'Click Me!'}
    </button>
  );
};

export default ClickerButton;
