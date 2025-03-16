
import { useState, useEffect, useCallback, useRef } from 'react';

const useSoundSettings = () => {
  // Load sound settings from localStorage
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const savedSetting = localStorage.getItem('clickerGameSoundEnabled');
    return savedSetting !== null ? savedSetting === 'true' : true; // Default to true
  });
  
  // Create refs for audio elements
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements when component mounts
  useEffect(() => {
    // Create audio elements
    clickSoundRef.current = new Audio('/click-sound.mp3');
    clickSoundRef.current.preload = 'auto';
    
    // Save a reference to the current audio element for cleanup
    const clickSound = clickSoundRef.current;
    
    // Cleanup function
    return () => {
      if (clickSound) {
        clickSound.pause();
        clickSound.src = '';
      }
    };
  }, []);
  
  // Toggle sound enabled/disabled
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('clickerGameSoundEnabled', String(newValue));
      return newValue;
    });
  }, []);
  
  // Play click sound
  const playClickSound = useCallback(() => {
    if (clickSoundRef.current) {
      // Reset the audio to the beginning to allow rapid clicks
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(err => {
        // Handle potential play() errors (like user hasn't interacted with the page yet)
        console.error("Error playing click sound:", err);
      });
    }
  }, []);
  
  return {
    soundEnabled,
    toggleSound,
    playClickSound
  };
};

export default useSoundSettings;
