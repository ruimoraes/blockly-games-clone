import { useState, useCallback } from 'react';

export const useMazeGame = () => {
  const [gameState, setGameState] = useState('idle');
  const [playerPosition, setPlayerPosition] = useState({ x: 2, y: 4, direction: 1 });
  const [currentLevel] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSpeed] = useState(500); // ms entre ações

  // Dados do labirinto
  const MAZE_LEVELS = [
    {
      level: 1,
      maxBlocks: Infinity,
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 1, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    }
  ];

  const mazeData = MAZE_LEVELS[currentLevel - 1].map;

  // Função para verificar se uma posição é válida
  const isValidPosition = useCallback((x, y) => {
    return y >= 0 && y < mazeData.length && 
           x >= 0 && x < mazeData[0].length &&
           mazeData[y][x] !== 0;
  }, [mazeData]);

  // Função para obter nova posição baseada na direção
  const getNewPosition = useCallback((x, y, direction) => {
    switch (direction) {
      case 0: // Norte
        return { x, y: y - 1 };
      case 1: // Leste
        return { x: x + 1, y };
      case 2: // Sul
        return { x, y: y + 1 };
      case 3: // Oeste
        return { x: x - 1, y };
      default:
        return { x, y };
    }
  }, []);

  // Verificar se há caminho em uma direção específica
  const isPathInDirection = useCallback((direction) => {
    const newPos = getNewPosition(playerPosition.x, playerPosition.y, direction);
    return isValidPosition(newPos.x, newPos.y);
  }, [playerPosition, getNewPosition, isValidPosition]);

  // Funções de movimento que serão chamadas pelo código gerado
  const moveForward = useCallback(() => {
    return new Promise((resolve) => {
      setPlayerPosition(prev => {
        const newPos = getNewPosition(prev.x, prev.y, prev.direction);
        
        if (isValidPosition(newPos.x, newPos.y)) {
          const newPosition = { ...prev, x: newPos.x, y: newPos.y };
          
          // Verificar se chegou ao objetivo
          if (mazeData[newPos.y][newPos.x] === 3) {
            setTimeout(() => setGameState('success'), 100);
          }
          
          setTimeout(resolve, executionSpeed);
          return newPosition;
        } else {
          setTimeout(() => {
            setGameState('failure');
            resolve();
          }, 100);
          return prev;
        }
      });
    });
  }, [getNewPosition, isValidPosition, mazeData, executionSpeed]);

  const turnLeft = useCallback(() => {
    return new Promise((resolve) => {
      setPlayerPosition(prev => ({
        ...prev,
        direction: (prev.direction + 3) % 4
      }));
      setTimeout(resolve, executionSpeed);
    });
  }, [executionSpeed]);

  const turnRight = useCallback(() => {
    return new Promise((resolve) => {
      setPlayerPosition(prev => ({
        ...prev,
        direction: (prev.direction + 1) % 4
      }));
      setTimeout(resolve, executionSpeed);
    });
  }, [executionSpeed]);

  // Funções de verificação de caminho
  const isPathAhead = useCallback(() => {
    return isPathInDirection(playerPosition.direction);
  }, [isPathInDirection, playerPosition.direction]);

  const isPathLeft = useCallback(() => {
    return isPathInDirection((playerPosition.direction + 3) % 4);
  }, [isPathInDirection, playerPosition.direction]);

  const isPathRight = useCallback(() => {
    return isPathInDirection((playerPosition.direction + 1) % 4);
  }, [isPathInDirection, playerPosition.direction]);

  // Função para executar código gerado pelo Blockly
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

      // Criar função assíncrona a partir do código
      const asyncCode = `
        return (async function() {
          ${code}
        })();
      `;

      const executeFunction = new Function(...Object.keys(context), asyncCode);
      await executeFunction(...Object.values(context));

      if (gameState !== 'success' && gameState !== 'failure') {
        setGameState('idle');
      }
    } catch (error) {
      console.error('Erro na execução:', error);
      setGameState('failure');
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting, gameState, moveForward, turnLeft, turnRight, isPathAhead, isPathLeft, isPathRight]);

  // Função para resetar o jogo
  const resetGame = useCallback(() => {
    setPlayerPosition({ x: 2, y: 4, direction: 1 });
    setGameState('idle');
    setIsExecuting(false);
  }, []);

  return {
    gameState,
    playerPosition,
    currentLevel,
    mazeData,
    isExecuting,
    executeCode,
    resetGame,
    moveForward,
    turnLeft,
    turnRight,
    isPathAhead,
    isPathLeft,
    isPathRight
  };
};

