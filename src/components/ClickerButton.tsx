
import { useState, useRef, useEffect } from 'react';
import { formatNumber } from '@/lib/gameUtils';

interface ClickerButtonProps {
  onClick: () => void;
  pointsPerClick: number;
}

const ClickerButton = ({ onClick, pointsPerClick }: ClickerButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const idCounter = useRef(0);
  
  // Handle click with animations
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
    setIsPressed(true);
    
    // Create floating text effect at the position of the click
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newFloatingText = {
        id: idCounter.current++,
        x,
        y,
        value: pointsPerClick
      };
      
      setFloatingTexts(prev => [...prev, newFloatingText]);
      
      // Remove floating text after animation completes
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(text => text.id !== newFloatingText.id));
      }, 2000);
    }
    
    // Reset pressed state after a short delay
    setTimeout(() => {
      setIsPressed(false);
    }, 100);
  };
  
  return (
    <div className="relative flex items-center justify-center my-6">
      <button
        ref={buttonRef}
        className={`relative w-44 h-44 rounded-full button-click-effect
                   ${isPressed ? 'scale-95' : 'scale-100'}
                   transition-all duration-200 ease-out
                   bg-gradient-to-br from-game-accent-light to-game-accent
                   shadow-lg hover:shadow-xl hover:from-game-accent hover:to-game-accent-dark
                   flex items-center justify-center text-white font-medium
                   overflow-visible`}
        onClick={handleClick}
      >
        {/* Inner circle */}
        <div className="absolute inset-1.5 rounded-full bg-white/10 backdrop-blur-sm"></div>
        
        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-4">
          <span className="text-lg font-semibold tracking-tight mb-2">TAP</span>
          <span className="text-white/80 text-sm">+{formatNumber(pointsPerClick)}</span>
        </div>
        
        {/* Pulsing effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse-subtle"></div>
        
        {/* Floating point texts */}
        {floatingTexts.map((text) => (
          <div
            key={text.id}
            className="float-text text-white font-medium text-lg"
            style={{ left: `${text.x}px`, top: `${text.y}px` }}
          >
            +{formatNumber(text.value)}
          </div>
        ))}
      </button>
    </div>
  );
};

export default ClickerButton;
