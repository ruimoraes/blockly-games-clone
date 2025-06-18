/**
 * Breakpoints Configuration
 * Sistema de breakpoints responsivos baseado no Bootstrap 5
 */

export const BREAKPOINTS = {
  xs: 0,      // Extra small devices (portrait phones)
  sm: 576,    // Small devices (landscape phones)  
  md: 768,    // Medium devices (tablets)
  lg: 992,    // Large devices (desktops)
  xl: 1200,   // Extra large devices (large desktops)
  xxl: 1400   // Extra extra large devices (larger desktops)
};

/**
 * Media Queries para uso em styled-components ou JavaScript
 */
export const MEDIA_QUERIES = {
  xs: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  xxl: `(min-width: ${BREAKPOINTS.xxl}px)`,
  
  // Between breakpoints
  smToMd: `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
  mdToLg: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  lgToXl: `(min-width: ${BREAKPOINTS.lg}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`,
  
  // Max width queries
  maxSm: `(max-width: ${BREAKPOINTS.sm - 1}px)`,
  maxMd: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  maxLg: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  maxXl: `(max-width: ${BREAKPOINTS.xl - 1}px)`
};

/**
 * Grid Configuration
 */
export const GRID_CONFIG = {
  columns: 12,
  gutterWidth: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 32
  },
  containerMaxWidths: {
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1140,
    xxl: 1320
  }
};

/**
 * Typography Scale
 */
export const TYPOGRAPHY_SCALE = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
};

/**
 * Spacing Scale
 */
export const SPACING_SCALE = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
  '5xl': '8rem'
};

/**
 * Hook para detectar breakpoint atual
 */
export const useBreakpoint = () => {
  if (typeof window === 'undefined') return 'lg'; // SSR fallback
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS.xxl) return 'xxl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * Utility functions
 */
export const isBreakpoint = (breakpoint) => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= BREAKPOINTS.lg;
};
