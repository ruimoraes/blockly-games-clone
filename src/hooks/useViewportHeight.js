import { useEffect } from 'react';

/**
 * Hook para corrigir problema da barra de endereços em dispositivos móveis
 * Define uma variável CSS customizada com a altura real da viewport
 */
export const useViewportHeight = () => {
  useEffect(() => {
    const setVhProperty = () => {
      // Calcular 1% da altura atual da viewport
      const vh = window.innerHeight * 0.01;
      
      // Definir propriedade CSS customizada
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--full-height', `${window.innerHeight}px`);
    };

    // Definir na inicialização
    setVhProperty();

    // Atualizar quando a viewport mudar (rotação, barra de endereços, etc.)
    const handleResize = () => {
      setVhProperty();
    };

    const handleOrientationChange = () => {
      // Pequeno delay para aguardar a rotação completar
      setTimeout(setVhProperty, 100);
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Para iOS Safari - detectar mudanças na barra de endereços
    let lastInnerHeight = window.innerHeight;
    const detectViewportChange = () => {
      if (Math.abs(window.innerHeight - lastInnerHeight) > 50) {
        lastInnerHeight = window.innerHeight;
        setVhProperty();
      }
    };

    const intervalId = setInterval(detectViewportChange, 500);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearInterval(intervalId);
    };
  }, []);
};