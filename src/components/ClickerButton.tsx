
import { useState, useRef, useEffect } from 'react';
import { formatNumber } from '@/lib/gameUtils';

interface ClickerButtonProps {
  onClick: () => void;
  pointsPerClick: number;
  surgeMode: boolean;
  playSound?: boolean;
}

const ClickerButton = ({ onClick, pointsPerClick, surgeMode, playSound = true }: ClickerButtonProps) => {
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
    <div className="relative flex items-center justify-center my-6 w-full max-w-[280px]">
      <button
        ref={buttonRef}
        className={`relative w-full aspect-square rounded-full button-click-effect
                   ${isPressed ? 'scale-95' : 'scale-100'}
                   transition-all duration-200 ease-out
                   ${surgeMode 
                     ? 'bg-gradient-to-br from-red-400 to-red-600 animate-surge-shake' 
                     : 'bg-gradient-to-br from-amber-300 to-amber-600'}
                   shadow-lg hover:shadow-xl hover:brightness-110
                   flex items-center justify-center text-white font-medium
                   overflow-visible`}
        onClick={handleClick}
      >
        {/* Use the cookie image */}
        <div className="absolute inset-4 rounded-full overflow-hidden">
          <img 
            src="/lovable-uploads/41fd9055-8be3-471b-ab52-fd11b819b3b8.png" 
            alt="Cookie" 
            className="w-full h-full object-cover"
          />
        </div>
        
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
