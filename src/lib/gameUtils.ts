
/**
 * Format number with abbreviations (K, M, B, etc)
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toFixed(0);
  
  const abbrev = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const unrangifiedOrder = Math.floor(Math.log10(Math.abs(num)) / 3);
  const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1));
  const suffix = abbrev[order];
  
  return (num / Math.pow(10, order * 3)).toFixed(1) + suffix;
};

/**
 * Format time in a human-readable format
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Calculate time to reach a specific target amount based on current points per second
 */
export const calculateTimeToTarget = (current: number, target: number, pointsPerSecond: number): number | null => {
  if (pointsPerSecond <= 0) return null;
  if (current >= target) return 0;
  
  const remaining = target - current;
  return remaining / pointsPerSecond;
};

/**
 * Generate a random number between min and max
 */
export const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Animate a number from start to end value
 */
export function animateValue(
  start: number,
  end: number, 
  duration: number, 
  callback: (value: number) => void
): () => void {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    
    callback(value);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      callback(end);
    }
  };
  
  const animationFrame = window.requestAnimationFrame(step);
  
  // Return a function to cancel the animation
  return () => window.cancelAnimationFrame(animationFrame);
}
