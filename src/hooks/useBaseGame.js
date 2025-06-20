import { useState, useCallback } from 'react';
import { useGamePhases } from './useGamePhases';

/**
 * Hook base genérico para todos os jogos
 * Fornece funcionalidades comuns como:
 * - Gerenciamento de estado de execução
 * - Integração com sistema de fases
 * - Estados padrão do jogo
 * - Interface consistente para execução/reset
 */
export const useBaseGame = (gameConfig) => {
  // Estados básicos do jogo
  const [gameState, setGameState] = useState('idle'); // idle, running, success, failure
  const [isExecuting, setIsExecuting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Usar sistema genérico de fases
  const phaseSystem = useGamePhases(gameConfig);

  // Função genérica para executar código
  const executeCode = useCallback(async (code, gameLogic = {}) => {
    if (isExecuting) return false;
    
    setIsExecuting(true);
    setGameState('running');

    try {
      // Se foi fornecida lógica específica do jogo, executá-la
      if (gameLogic.execute && typeof gameLogic.execute === 'function') {
        await gameLogic.execute(code);
      }

      // Se o estado não foi alterado pela lógica específica, voltar para idle
      if (gameState === 'running') {
        setGameState('idle');
      }
      
      return true;
    } catch (error) {
      console.error('Erro na execução:', error);
      setGameState('failure');
      return false;
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting, gameState]);

  // Função genérica para resetar jogo
  const resetGame = useCallback((resetLogic = {}) => {
    setGameState('idle');
    setIsExecuting(false);
    
    // Se foi fornecida lógica específica de reset, executá-la
    if (resetLogic.reset && typeof resetLogic.reset === 'function') {
      resetLogic.reset();
    }
  }, []);

  // Manipular mudança de código gerado
  const handleCodeChange = useCallback((code) => {
    setGeneratedCode(code);
  }, []);

  // Manipular sucesso do jogo
  const handleGameSuccess = useCallback(() => {
    setGameState('success');
    phaseSystem.completePhase(phaseSystem.currentPhase);
  }, [phaseSystem]);

  // Manipular falha do jogo
  const handleGameFailure = useCallback(() => {
    setGameState('failure');
  }, []);

  // Navegação entre fases com reset automático
  const handlePhaseChange = useCallback((newPhase, resetLogic = {}) => {
    if (phaseSystem.changePhase(newPhase)) {
      setGameState('idle');
      setIsExecuting(false);
      setGeneratedCode('');
      
      // Reset específico do jogo se fornecido
      if (resetLogic.reset && typeof resetLogic.reset === 'function') {
        resetLogic.reset();
      }
      
      return true;
    }
    return false;
  }, [phaseSystem]);

  const handleNextPhase = useCallback((resetLogic = {}) => {
    if (phaseSystem.goToNextPhase()) {
      setGameState('idle');
      setIsExecuting(false);
      setGeneratedCode('');
      
      if (resetLogic.reset && typeof resetLogic.reset === 'function') {
        resetLogic.reset();
      }
      
      return true;
    }
    return false;
  }, [phaseSystem]);

  const handlePreviousPhase = useCallback((resetLogic = {}) => {
    if (phaseSystem.goToPreviousPhase()) {
      setGameState('idle');
      setIsExecuting(false);
      setGeneratedCode('');
      
      if (resetLogic.reset && typeof resetLogic.reset === 'function') {
        resetLogic.reset();
      }
      
      return true;
    }
    return false;  }, [phaseSystem]);  // ========== FUNÇÕES DE DEBUG ==========
  
  // Usar as funções de debug diretas do phaseSystem
  const debugUnlockAllPhases = useCallback(() => {
    phaseSystem.debugUnlockAllPhases();
    setGameState('idle');
    setIsExecuting(false);
    setGeneratedCode('');
  }, [phaseSystem]);

  const debugCompleteAllPhases = useCallback(() => {
    phaseSystem.debugCompleteAllPhases();
    setGameState('idle');
    setIsExecuting(false);
    setGeneratedCode('');
  }, [phaseSystem]);

  const debugResetProgress = useCallback(() => {
    phaseSystem.debugResetProgress();
    setGameState('idle');
    setIsExecuting(false);
    setGeneratedCode('');
  }, [phaseSystem]);

  const debugGoToPhase = useCallback((targetPhase) => {
    const success = phaseSystem.debugGoToPhase(targetPhase);
    if (success) {
      setGameState('idle');
      setIsExecuting(false);
      setGeneratedCode('');
    }
    return success;
  }, [phaseSystem]);

  return {
    // Estados básicos
    gameState,
    isExecuting,
    generatedCode,
    
    // Sistema de fases (exposto completamente)
    ...phaseSystem,
    
    // Ações básicas
    executeCode,
    resetGame,
    handleCodeChange,
    handleGameSuccess,
    handleGameFailure,
    
    // Navegação com reset automático
    handlePhaseChange,
    handleNextPhase,
    handlePreviousPhase,
      // Setters para casos específicos
    setGameState,
    setIsExecuting,
    setGeneratedCode,
    
    // ========== FUNÇÕES DE DEBUG ==========
    debugUnlockAllPhases,
    debugCompleteAllPhases,
    debugResetProgress,
    debugGoToPhase
  };
};
