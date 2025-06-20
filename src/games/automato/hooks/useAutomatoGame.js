import { useState, useCallback, useEffect, useMemo } from 'react';
import { useBaseGame } from '../../../hooks/useBaseGame';
import { AUTOMATO_GAME_CONFIG } from '../config/automatoConfig';

export const useAutomatoGame = () => {
  // Estado específico do Automato
  const [gameState, setGameState] = useState('idle');
  const [playerPosition, setPlayerPosition] = useState({ x: 2, y: 4, direction: 1 });
  const [playerVisible, setPlayerVisible] = useState(true); // Iniciar visível
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSpeed] = useState(500); // ms entre ações

  // Usar hook base genérico
  const baseGameHook = useBaseGame(AUTOMATO_GAME_CONFIG);
    // Desestruturar dados do hook base
  const {
    currentPhase,
    getCurrentPhaseData,
    completePhase,
    handlePhaseChange,
    handleNextPhase,
    handlePreviousPhase,
    isPhaseUnlocked,
    isPhaseCompleted,
    unlockedPhases,
    completedPhases,
    totalPhases,
    getPhaseData,
    gameConfig,
    
    // Funções de debug
    debugUnlockAllPhases,
    debugCompleteAllPhases,
    debugResetProgress,
    debugGoToPhase
  } = baseGameHook;

  // Obter dados da fase atual
  const currentPhaseData = getCurrentPhaseData();
  const mazeData = useMemo(() => currentPhaseData?.map || [], [currentPhaseData]);  // Inicializar posição do jogador baseada na fase atual  // Inicializar posição do jogador baseada na fase atual (versão simplificada)
  const initializePlayerPosition = useCallback(() => {
    const phaseData = getCurrentPhaseData();
    console.log('🎮 [Manual] Inicializando posição do jogador para fase', currentPhase);
    
    if (phaseData?.startPosition) {
      setPlayerPosition({
        x: phaseData.startPosition.x,
        y: phaseData.startPosition.y,
        direction: phaseData.startPosition.direction
      });
    }
  }, [getCurrentPhaseData, currentPhase]);

  // Função para verificar se uma posição é válida
  const isValidPosition = useCallback((x, y) => {
    return y >= 0 && y < mazeData.length && 
           x >= 0 && x < mazeData[0].length &&
           mazeData[y][x] !== 0;
  }, [mazeData]);

  // Função para obter nova posição baseada na direção
  const getNewPosition = useCallback((direction) => {
    const { x, y } = playerPosition;
    const directions = [
      { x: 0, y: -1 }, // Norte (0)
      { x: 1, y: 0 },  // Leste (1)
      { x: 0, y: 1 },  // Sul (2)
      { x: -1, y: 0 }  // Oeste (3)
    ];
    
    const delta = directions[direction];
    return { x: x + delta.x, y: y + delta.y };
  }, [playerPosition]);
  // Verificar se há caminho à frente
  const isPathAhead = useCallback(() => {
    // Usar animação de look
    if (window.automatoAnimations?.scheduleLook) {
      window.automatoAnimations.scheduleLook(playerPosition.direction);
    }
    
    const newPos = getNewPosition(playerPosition.direction);
    return isValidPosition(newPos.x, newPos.y);
  }, [getNewPosition, playerPosition.direction, isValidPosition]);

  // Verificar se há caminho à esquerda
  const isPathLeft = useCallback(() => {
    const leftDirection = (playerPosition.direction + 3) % 4;
    
    // Usar animação de look
    if (window.automatoAnimations?.scheduleLook) {
      window.automatoAnimations.scheduleLook(leftDirection);
    }
    
    const newPos = getNewPosition(leftDirection);
    return isValidPosition(newPos.x, newPos.y);
  }, [getNewPosition, playerPosition.direction, isValidPosition]);

  // Verificar se há caminho à direita
  const isPathRight = useCallback(() => {
    const rightDirection = (playerPosition.direction + 1) % 4;
    
    // Usar animação de look
    if (window.automatoAnimations?.scheduleLook) {
      window.automatoAnimations.scheduleLook(rightDirection);    }
    
    const newPos = getNewPosition(rightDirection);
    return isValidPosition(newPos.x, newPos.y);
  }, [getNewPosition, playerPosition.direction, isValidPosition]);

  // Mover para frente
  const moveForward = useCallback(async () => {
    if (!isPathAhead()) {
      // Usar animação de falha
      if (window.automatoAnimations?.scheduleFail) {
        window.automatoAnimations.scheduleFail(playerPosition.direction);
      }
      throw new Error('Não é possível mover para frente - há um obstáculo!');
    }

    const newPos = getNewPosition(playerPosition.direction);
      // Usar animação de movimento
    if (window.automatoAnimations?.scheduleMove) {
      const startPos = [playerPosition.x, playerPosition.y, playerPosition.direction * 4];
      const endPos = [newPos.x, newPos.y, playerPosition.direction * 4];
      
      window.automatoAnimations.scheduleMove(startPos, endPos, () => {
        // Callback chamado quando animação termina
        setPlayerPosition(prev => ({ ...prev, x: newPos.x, y: newPos.y }));
        
        // Verificar se chegou ao objetivo
        if (mazeData[newPos.y] && mazeData[newPos.y][newPos.x] === 3) {
          console.log('🎯 OBJETIVO ALCANÇADO! Definindo gameState como success');
          setGameState('success');
          if (window.automatoAnimations?.scheduleVictory) {
            window.automatoAnimations.scheduleVictory();
          }
          completePhase(currentPhase);
        }
      });
    } else {
      // Fallback sem animação
      setPlayerPosition(prev => ({ ...prev, x: newPos.x, y: newPos.y }));
      
      if (mazeData[newPos.y] && mazeData[newPos.y][newPos.x] === 3) {
        console.log('🎯 OBJETIVO ALCANÇADO! (sem animação) Definindo gameState como success');
        setGameState('success');
        completePhase(currentPhase);
      }
    }
    
    // Aguardar animação
    await new Promise(resolve => setTimeout(resolve, executionSpeed));
    
    return false;
  }, [isPathAhead, getNewPosition, playerPosition.direction, playerPosition.x, playerPosition.y, executionSpeed, mazeData, completePhase, currentPhase]);
  // Virar à esquerda
  const turnLeft = useCallback(async () => {
    const newDirection = (playerPosition.direction + 3) % 4;
    
    // Usar animação de rotação
    if (window.automatoAnimations?.scheduleMove) {
      const startPos = [playerPosition.x, playerPosition.y, playerPosition.direction * 4];
      const endPos = [playerPosition.x, playerPosition.y, newDirection * 4];
      
      window.automatoAnimations.scheduleMove(startPos, endPos, () => {
        setPlayerPosition(prev => ({
          ...prev,
          direction: newDirection
        }));
      });
    } else {
      // Fallback sem animação
      setPlayerPosition(prev => ({
        ...prev,
        direction: newDirection
      }));
    }
    
    await new Promise(resolve => setTimeout(resolve, executionSpeed));
  }, [playerPosition.direction, playerPosition.x, playerPosition.y, executionSpeed]);

  // Virar à direita
  const turnRight = useCallback(async () => {
    const newDirection = (playerPosition.direction + 1) % 4;
    
    // Usar animação de rotação
    if (window.automatoAnimations?.scheduleMove) {
      const startPos = [playerPosition.x, playerPosition.y, playerPosition.direction * 4];
      const endPos = [playerPosition.x, playerPosition.y, newDirection * 4];
      
      window.automatoAnimations.scheduleMove(startPos, endPos, () => {
        setPlayerPosition(prev => ({
          ...prev,
          direction: newDirection
        }));
      });
    } else {
      // Fallback sem animação
      setPlayerPosition(prev => ({
        ...prev,
        direction: newDirection
      }));
    }
    
    await new Promise(resolve => setTimeout(resolve, executionSpeed));
  }, [playerPosition.direction, playerPosition.x, playerPosition.y, executionSpeed]);
  // Executar código gerado
  const executeCode = useCallback(async (code) => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setGameState('running');

    try {
      // Criar contexto de execução com as funções disponíveis
      const context = {
        moveForward,
        turnLeft,
        turnRight,
        isPathAhead,
        isPathLeft,
        isPathRight
      };

      // Criar função executável como async e garantir await nas funções
      const asyncWrapper = `(async () => {\n${code}\n})()`;
      const func = new Function(...Object.keys(context), asyncWrapper);
      await func(...Object.values(context));
      
      // SEMPRE definir um estado final após execução
      // Verificar com setTimeout para permitir que as ações assíncronas terminem
      setTimeout(() => {
        setGameState(prevState => {
          console.log('🎯 Estado final da execução:', prevState);
          // Se ainda está 'running', significa que não completou o objetivo
          if (prevState === 'running') {
            console.log('❌ Execução terminada sem completar objetivo - definindo como failure');
            return 'failure';
          }
          // Se já é 'success' ou 'failure', manter o estado
          return prevState;
        });
      }, 100);
      
    } catch (error) {
      console.error('Erro na execução:', error);
      setGameState('failure');    } finally {
      setIsExecuting(false);
    }  }, [
    isExecuting, 
    moveForward, 
    turnLeft, 
    turnRight, 
    isPathAhead, 
    isPathLeft, 
    isPathRight
  ]);
  // Reset do jogo
  const resetGame = useCallback(() => {
    setGameState('idle');
    setIsExecuting(false);
    setPlayerVisible(false); // Esconder player durante reset
    
    // Reposicionar e tornar visível novamente
    setTimeout(() => {
      initializePlayerPosition();
      setPlayerVisible(true);
    }, 50);
  }, [initializePlayerPosition]);// Wrapper para mudança de fase
  const handlePhaseChangeWrapper = useCallback((newPhase) => {
    console.log('🎮 handlePhaseChangeWrapper: Mudando para fase', newPhase);
    const result = handlePhaseChange(newPhase);
    if (result) {
      setGameState('idle');
      setIsExecuting(false);
      // A posição será atualizada automaticamente pelo useEffect quando currentPhase mudar
    }
    return result;
  }, [handlePhaseChange]);

  // Wrapper para próxima fase
  const handleNextPhaseWrapper = useCallback(() => {
    console.log('🎮 handleNextPhaseWrapper: Indo para próxima fase');
    const result = handleNextPhase();
    if (result) {
      setGameState('idle');
      setIsExecuting(false);
      // A posição será atualizada automaticamente pelo useEffect quando currentPhase mudar
    }
    return result;
  }, [handleNextPhase]);

  // Wrapper para fase anterior
  const handlePreviousPhaseWrapper = useCallback(() => {
    console.log('🎮 handlePreviousPhaseWrapper: Indo para fase anterior');
    const result = handlePreviousPhase();
    if (result) {
      setGameState('idle');
      setIsExecuting(false);
      // A posição será atualizada automaticamente pelo useEffect quando currentPhase mudar
    }
    return result;
  }, [handlePreviousPhase]);  // Inicializar posição quando a fase atual mudar
  useEffect(() => {
    console.log('🎮 useEffect: Fase atual mudou para', currentPhase);
    
    // Primeiro, esconder o player durante a transição
    setPlayerVisible(false);
    
    // Aguardar um pouco para garantir que os dados da fase estejam atualizados
    const timer = setTimeout(() => {
      const phaseData = getCurrentPhaseData();
      console.log('🎮 Inicializando posição do jogador para fase', currentPhase);
      console.log('🎮 Dados da fase:', phaseData);
      
      if (phaseData?.startPosition) {
        console.log('🎮 Posição inicial encontrada:', phaseData.startPosition);
        
        // Primeiro definir a posição
        setPlayerPosition({
          x: phaseData.startPosition.x,
          y: phaseData.startPosition.y,
          direction: phaseData.startPosition.direction
        });
        
        // Aguardar um pouco para que o pegman seja posicionado, depois resetar e tornar visível
        setTimeout(() => {
          if (window.automatoAnimations?.resetPegman) {
            window.automatoAnimations.resetPegman(
              phaseData.startPosition.x,
              phaseData.startPosition.y,
              phaseData.startPosition.direction
            );
          }
          
          // Tornar o player visível na posição correta
          setPlayerVisible(true);
          
          // Executar animação inicial após o player estar visível
          setTimeout(() => {
            if (window.automatoAnimations?.scheduleInitialAnimation) {
              console.log('🎬 Executando animação inicial do pegman');
              window.automatoAnimations.scheduleInitialAnimation(
                phaseData.startPosition.x,
                phaseData.startPosition.y,
                phaseData.startPosition.direction
              );
            }
          }, 50);
        }, 100);
      } else {
        console.warn('🎮 Posição inicial não encontrada para a fase', currentPhase);
        // Fallback para posição padrão
        const defaultPosition = { x: 2, y: 4, direction: 1 };
        setPlayerPosition(defaultPosition);
        setPlayerVisible(true); // Tornar visível mesmo com posição padrão
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentPhase, getCurrentPhaseData]);  return {
    // Estados específicos do Automato
    gameState,
    playerPosition,
    playerVisible,
    isExecuting,
    mazeData,
    
    // Ações específicas do Automato
    executeCode,
    resetGame,
    moveForward,
    turnLeft,
    turnRight,
    isPathAhead,
    isPathLeft,
    isPathRight,
    
    // Dados e ações da base (propagados do useBaseGame)
    currentPhase,
    currentPhaseData,
    totalPhases,
    unlockedPhases,
    completedPhases,
    gameConfig,
    handlePhaseChange: handlePhaseChangeWrapper,
    handleNextPhase: handleNextPhaseWrapper,
    handlePreviousPhase: handlePreviousPhaseWrapper,
    completePhase,
    getPhaseData,
    isPhaseUnlocked,
    isPhaseCompleted,
      // Funções de debug (propagadas do useBaseGame)
    debugUnlockAllPhases,
    debugCompleteAllPhases,
    debugResetProgress,
    debugGoToPhase
  };
};
