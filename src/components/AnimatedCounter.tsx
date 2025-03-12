
import { useEffect, useState, useRef } from 'react';
import { formatNumber } from '@/lib/gameUtils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  format?: boolean;
}

const AnimatedCounter = ({ 
  value, 
  duration = 500, 
  className = "", 
  format = true 
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const animationFrame = useRef<number | null>(null);
  
  useEffect(() => {
    // If the value hasn't changed, don't animate
    if (previousValue.current === value) return;
    
    // Cancel any existing animation
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
    }
    
    const startValue = previousValue.current;
    const startTime = performance.now();
    const endTime = startTime + duration;
    
    const animateCount = (time: number) => {
      if (time >= endTime) {
        setDisplayValue(value);
        previousValue.current = value;
        animationFrame.current = null;
        return;
      }
      
      const progress = (time - startTime) / duration;
      // Use easeOutExpo for a nice, smooth animation that slows down at the end
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      
      // Calculate current value
      const currentValue = startValue + easeOutExpo * (value - startValue);
      setDisplayValue(currentValue);
      
      // Continue animation
      animationFrame.current = requestAnimationFrame(animateCount);
    };
    
    animationFrame.current = requestAnimationFrame(animateCount);
    
    // Cleanup on unmount or when value changes
    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [value, duration]);
  
  // Update previousValue when component unmounts
  useEffect(() => {
    return () => {
      previousValue.current = value;
    };
  }, [value]);
  
  return (
    <span className={`font-medium tabular-nums transition-all duration-300 ${className}`}>
      {format ? formatNumber(displayValue) : displayValue.toFixed(0)}
    </span>
  );
};

export default AnimatedCounter;
