// Layout Components
export { default as ResponsiveLayout } from './layout/ResponsiveLayout';
export { default as ResponsiveHeader } from './layout/ResponsiveHeader';
export { default as ResponsiveFooter } from './layout/ResponsiveFooter';
export { default as ResponsiveGrid, ResponsiveCol } from './layout/ResponsiveGrid';

// UI Components
export { default as ResponsiveCard } from './ui/ResponsiveCard';
export { default as LoadingSpinner } from './ui/LoadingSpinner';
export { default as StatsSection } from './ui/StatsSection';
export { default as ResponsiveSearchBar } from './ui/ResponsiveSearchBar';
export { default as BlocklyNTLogo } from './ui/BlocklyNTLogo';

// Game Components
export { default as GameCard } from './games/GameCard';

// Common Game Components
export { default as BaseGame } from './common/BaseGame';
export { default as GameHeader } from './common/GameHeader';
export { default as GameInfo } from './common/GameInfo';

// Hooks
export { useResponsive, useResponsiveClasses, useResponsiveAnimations } from '../hooks/useResponsive';

// Configuration
export * from '../config/responsive';
