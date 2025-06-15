import { useState, useCallback, useEffect } from 'react';

export const useGamePhases = (gameConfig) => {
  const { gameId, phases: gamePhasesConfig } = gameConfig;
  
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
  }, [unlockedPhases, gameId]);

  useEffect(() => {
    localStorage.setItem(`${gameId}-completed-phases`, JSON.stringify(completedPhases));
  }, [completedPhases, gameId]);

  useEffect(() => {
    localStorage.setItem(`${gameId}-current-phase`, currentPhase.toString());
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
    gameConfig
  };
};

