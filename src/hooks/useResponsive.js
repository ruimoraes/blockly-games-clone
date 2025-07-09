import { useState, useEffect } from 'react';
import { BREAKPOINTS, useBreakpoint as getBreakpoint, isMobile, isTablet, isDesktop } from '../config/responsive';

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  const [breakpoint, setBreakpoint] = useState('lg');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isTabletDevice, setIsTabletDevice] = useState(false);
  const [isDesktopDevice, setIsDesktopDevice] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setBreakpoint(getBreakpoint());
      setIsMobileDevice(isMobile());
      setIsTabletDevice(isTablet());
      setIsDesktopDevice(isDesktop());
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    screenSize,
    breakpoint,
    isMobile: isMobileDevice,
    isTablet: isTabletDevice,
    isDesktop: isDesktopDevice,
    isSmallScreen: screenSize.width < BREAKPOINTS.md,
    isLargeScreen: screenSize.width >= BREAKPOINTS.lg
  };
};

export const useResponsiveClasses = () => {
  const { isMobile, isTablet, breakpoint } = useResponsive();

  const getResponsiveClass = (mobileClass, tabletClass, desktopClass) => {
    if (isMobile) return mobileClass;
    if (isTablet) return tabletClass || mobileClass;
    return desktopClass || tabletClass || mobileClass;
  };

  const getBreakpointClass = (classes) => {
    return classes[breakpoint] || classes['default'] || '';
  };

  return {
    getResponsiveClass,
    getBreakpointClass,
    breakpointClasses: {
      xs: 'd-block d-sm-none',
      sm: 'd-none d-sm-block d-md-none',
      md: 'd-none d-md-block d-lg-none',
      lg: 'd-none d-lg-block d-xl-none',
      xl: 'd-none d-xl-block d-xxl-none',
      xxl: 'd-none d-xxl-block'
    }
  };
};

export const useResponsiveAnimations = () => {
  const { isMobile } = useResponsive();

  const getAnimationDuration = (desktop = 300, mobile = 200) => {
    return isMobile ? mobile : desktop;
  };

  const shouldReduceMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const getTransition = (property = 'all', duration = 300, easing = 'ease') => {
    if (shouldReduceMotion()) return 'none';
    return `${property} ${getAnimationDuration(duration)}ms ${easing}`;
  };

  return {
    getAnimationDuration,
    shouldReduceMotion,
    getTransition,
    animationClasses: {
      hover: shouldReduceMotion() ? '' : 'hover-lift',
      floating: shouldReduceMotion() ? '' : 'floating-card'
    }
  };
};
