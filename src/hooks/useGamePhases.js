import { useState, useCallback, useEffect } from 'react';

export const useGamePhases = (gameConfig) => {
  const { gameId, phases: gamePhasesConfig } = gameConfig;
  
  // Estado reativo forçado
  const [forceUpdate, setForceUpdate] = useState(0);
  const triggerUpdate = useCallback(() => setForceUpdate(prev => prev + 1), []);
  
  const [unlockedPhases, setUnlockedPhases] = useState(() => {
    const saved = localStorage.getItem(`${gameId}-unlocked-phases`);
    return saved ? JSON.parse(saved) : [1]; // Sempre começa com fase 1 desbloqueada
  });

  const [completedPhases, setCompletedPhases] = useState(() => {
    const saved = localStorage.getItem(`${gameId}-completed-phases`);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPhase, setCurrentPhase] = useState(() => {
    const saved = localStorage.getItem(`${gameId}-current-phase`);
    return saved ? parseInt(saved) : 1;
  });

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(`${gameId}-unlocked-phases`, JSON.stringify(unlockedPhases));
    console.log(`📦 Salvando fases desbloqueadas para ${gameId}:`, unlockedPhases);
  }, [unlockedPhases, gameId]);

  useEffect(() => {
    localStorage.setItem(`${gameId}-completed-phases`, JSON.stringify(completedPhases));
    console.log(`📦 Salvando fases completadas para ${gameId}:`, completedPhases);
  }, [completedPhases, gameId]);

  useEffect(() => {
    localStorage.setItem(`${gameId}-current-phase`, currentPhase.toString());
    console.log(`📦 Salvando fase atual para ${gameId}:`, currentPhase);
  }, [currentPhase, gameId]);

  // Função para desbloquear próxima fase
  const unlockNextPhase = useCallback((phaseNumber) => {
    const nextPhase = phaseNumber + 1;
    if (nextPhase <= gamePhasesConfig.length && !unlockedPhases.includes(nextPhase)) {
      setUnlockedPhases(prev => [...prev, nextPhase].sort((a, b) => a - b));
    }
  }, [unlockedPhases, gamePhasesConfig.length]);

  // Função para marcar fase como completada
  const completePhase = useCallback((phaseNumber) => {
    if (!completedPhases.includes(phaseNumber)) {
      setCompletedPhases(prev => [...prev, phaseNumber].sort((a, b) => a - b));
      unlockNextPhase(phaseNumber);
    }
  }, [completedPhases, unlockNextPhase]);

  // Função para mudar fase atual
  const changePhase = useCallback((phaseNumber) => {
    if (unlockedPhases.includes(phaseNumber)) {
      setCurrentPhase(phaseNumber);
      return true;
    }
    return false;
  }, [unlockedPhases]);

  // Função para resetar progresso
  const resetProgress = useCallback(() => {
    setUnlockedPhases([1]);
    setCompletedPhases([]);
    setCurrentPhase(1);
    localStorage.removeItem(`${gameId}-unlocked-phases`);
    localStorage.removeItem(`${gameId}-completed-phases`);
    localStorage.removeItem(`${gameId}-current-phase`);
  }, [gameId]);

  // Função para ir para próxima fase
  const goToNextPhase = useCallback(() => {
    const nextPhase = currentPhase + 1;
    if (nextPhase <= gamePhasesConfig.length && unlockedPhases.includes(nextPhase)) {
      setCurrentPhase(nextPhase);
      return true;
    }
    return false;
  }, [currentPhase, unlockedPhases, gamePhasesConfig.length]);

  // Função para ir para fase anterior
  const goToPreviousPhase = useCallback(() => {
    const prevPhase = currentPhase - 1;
    if (prevPhase >= 1) {
      setCurrentPhase(prevPhase);
      return true;
    }
    return false;
  }, [currentPhase]);

  // Verificar se uma fase está desbloqueada
  const isPhaseUnlocked = useCallback((phaseNumber) => {
    return unlockedPhases.includes(phaseNumber);
  }, [unlockedPhases]);

  // Verificar se uma fase está completada
  const isPhaseCompleted = useCallback((phaseNumber) => {
    return completedPhases.includes(phaseNumber);
  }, [completedPhases]);

  // Funções de debug diretas com atualização forçada
  const debugUnlockAllPhases = useCallback(() => {
    const allPhases = Array.from({ length: gamePhasesConfig.length }, (_, i) => i + 1);
    console.log('🐛 DEBUG useGamePhases: Desbloqueando todas as fases');
    console.log('🐛 gameId:', gameId);
    console.log('🐛 Phases antes:', unlockedPhases);
    console.log('🐛 Phases que serão definidas:', allPhases);
    
    // Atualizar localStorage imediatamente
    localStorage.setItem(`${gameId}-unlocked-phases`, JSON.stringify(allPhases));
    
    // Atualizar estado
    setUnlockedPhases(allPhases);
    triggerUpdate();
    
    // Verificar imediatamente
    setTimeout(() => {
      const stored = localStorage.getItem(`${gameId}-unlocked-phases`);
      console.log('🐛 Verificação localStorage após debug:', stored);
    }, 50);
  }, [gamePhasesConfig.length, gameId, unlockedPhases]);

  const debugCompleteAllPhases = useCallback(() => {
    const allPhases = Array.from({ length: gamePhasesConfig.length }, (_, i) => i + 1);
    console.log('🐛 DEBUG useGamePhases: Completando todas as fases');
    console.log('🐛 gameId:', gameId);
    console.log('🐛 Phases que serão definidas:', allPhases);
    
    // Atualizar localStorage imediatamente
    localStorage.setItem(`${gameId}-unlocked-phases`, JSON.stringify(allPhases));
    localStorage.setItem(`${gameId}-completed-phases`, JSON.stringify(allPhases));
    
    // Atualizar estados
    setUnlockedPhases(allPhases);
    setCompletedPhases(allPhases);
    triggerUpdate();
  }, [gamePhasesConfig.length, gameId]);

  const debugResetProgress = useCallback(() => {
    console.log('🐛 DEBUG useGamePhases: Resetando progresso');
    console.log('🐛 gameId:', gameId);
    
    // Atualizar localStorage imediatamente
    localStorage.setItem(`${gameId}-unlocked-phases`, JSON.stringify([1]));
    localStorage.setItem(`${gameId}-completed-phases`, JSON.stringify([]));
    localStorage.setItem(`${gameId}-current-phase`, '1');
    
    // Atualizar estados
    setUnlockedPhases([1]);
    setCompletedPhases([]);
    setCurrentPhase(1);
    triggerUpdate();
  }, [gameId]);

  const debugGoToPhase = useCallback((targetPhase) => {
    if (targetPhase >= 1 && targetPhase <= gamePhasesConfig.length) {
      console.log(`🐛 DEBUG useGamePhases: Indo para fase ${targetPhase}`);
      console.log('🐛 gameId:', gameId);
      
      // Desbloquear fases necessárias
      const currentUnlocked = [...unlockedPhases];
      const phasesToUnlock = [];
      for (let i = 1; i <= targetPhase; i++) {
        if (!currentUnlocked.includes(i)) {
          phasesToUnlock.push(i);
        }
      }
      if (phasesToUnlock.length > 0) {
        const newUnlocked = [...currentUnlocked, ...phasesToUnlock].sort((a, b) => a - b);
        console.log(`🐛 DEBUG: Fases ${phasesToUnlock.join(', ')} desbloqueadas automaticamente`);
        
        // Atualizar localStorage imediatamente
        localStorage.setItem(`${gameId}-unlocked-phases`, JSON.stringify(newUnlocked));
        setUnlockedPhases(newUnlocked);
      }
      
      // Atualizar fase atual
      localStorage.setItem(`${gameId}-current-phase`, targetPhase.toString());
      setCurrentPhase(targetPhase);
      triggerUpdate();
      return true;
    }
    console.warn(`🐛 DEBUG: Fase ${targetPhase} inválida (deve ser 1-${gamePhasesConfig.length})`);
    return false;
  }, [gamePhasesConfig.length, unlockedPhases, gameId]);

  // Obter dados da fase atual
  const getCurrentPhaseData = useCallback(() => {
    return gamePhasesConfig[currentPhase - 1];
  }, [currentPhase, gamePhasesConfig]);

  // Obter dados de uma fase específica
  const getPhaseData = useCallback((phaseNumber) => {
    return gamePhasesConfig[phaseNumber - 1];
  }, [gamePhasesConfig]);

  return {
    // Estado
    currentPhase,
    unlockedPhases,
    completedPhases,
    
    // Dados
    getCurrentPhaseData,
    getPhaseData,
    totalPhases: gamePhasesConfig.length,
    
    // Ações
    changePhase,
    completePhase,
    goToNextPhase,
    goToPreviousPhase,
    resetProgress,
    
    // Verificações
    isPhaseUnlocked,
    isPhaseCompleted,
    
    // Configuração
    gameConfig,
    
    // Setters diretos (para casos especiais)
    setCurrentPhase,
    setUnlockedPhases,
    setCompletedPhases,
    
    // Funções de debug diretas
    debugUnlockAllPhases,
    debugCompleteAllPhases,
    debugResetProgress,
    debugGoToPhase,
    
    // Force update para debug
    forceUpdate,
    triggerUpdate
  };
};

