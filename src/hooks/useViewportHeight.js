import { useEffect } from 'react';

export const useViewportHeight = () => {
  useEffect(() => {
    const setVhProperty = () => {
      const vh = window.innerHeight * 0.01;
      
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--full-height', `${window.innerHeight}px`);
    };

    setVhProperty();

    const handleResize = () => {
      setVhProperty();
    };

    const handleOrientationChange = () => {
      setTimeout(setVhProperty, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    let lastInnerHeight = window.innerHeight;
    const detectViewportChange = () => {
      if (Math.abs(window.innerHeight - lastInnerHeight) > 50) {
        lastInnerHeight = window.innerHeight;
        setVhProperty();
      }
    };

    const intervalId = setInterval(detectViewportChange, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearInterval(intervalId);
    };
  }, []);
};