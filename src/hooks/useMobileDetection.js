import { useState, useEffect } from 'react';

/**
 * Hook para detectar se a tela é mobile automaticamente
 */
export const useMobileDetection = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Verificar na inicialização
    checkIsMobile();

    // Adicionar listener de resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
};
