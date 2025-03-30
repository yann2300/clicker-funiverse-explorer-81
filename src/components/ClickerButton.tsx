
import { useState, useRef, useEffect } from 'react';
import { formatNumber } from '@/lib/gameUtils';

interface ClickerButtonProps {
  onClick: () => void;
  pointsPerClick?: number;
  surgeMode?: boolean;
  surgeModeTimeLeft?: number;
  playSound?: boolean;
}

const ClickerButton = ({ 
  onClick, 
  pointsPerClick = 1, 
  surgeMode = false, 
  surgeModeTimeLeft = 0, 
  playSound = true 
}: ClickerButtonProps) => {
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
        value: pointsPerClick || 1 // Ensure value is never undefined
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
    <div className="relative flex items-center justify-center my-4 w-full max-w-[240px] mx-auto">
      <button
        ref={buttonRef}
        className={`relative w-full aspect-square rounded-md button-click-effect
                   ${isPressed ? 'scale-95' : 'scale-100'}
                   transition-all duration-200 ease-out
                   ${surgeMode 
                     ? 'bg-red-500 animate-surge-shake' 
                     : 'bg-[#2f3540]'}
                   shadow-lg hover:shadow-xl hover:brightness-110
                   flex items-center justify-center text-white font-medium
                   overflow-visible`}
        onClick={handleClick}
      >
        {/* Use the SG logo image */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img 
            src="https://s3.eu-west-2.amazonaws.com/img.creativepool.com/files/candidate/portfolio/full/752444.png" 
            alt="SteamGifts Logo" 
            className="w-full h-full object-contain"
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
