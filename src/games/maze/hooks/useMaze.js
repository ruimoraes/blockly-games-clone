import { useState, useCallback } from 'react';
import { MAZE_LEVELS, DirectionType, GameState, GAME_CONFIG } from '../utils/mazeData';

export function useMaze(initialLevel = 1) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [gameState, setGameState] = useState(GameState.IDLE);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, direction: DirectionType.EAST });
  const [executionLog, setExecutionLog] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState(GAME_CONFIG.ANIMATION_SPEED);

  // Obter dados do nível atual
  const getCurrentLevelData = useCallback(() => {
    return MAZE_LEVELS[currentLevel - 1];
  }, [currentLevel]);

  // Encontrar posição inicial no mapa
  const findStartPosition = useCallback((map) => {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 2) { // START
          return { x, y, direction: DirectionType.EAST };
        }
      }
    }
    return { x: 0, y: 0, direction: DirectionType.EAST };
  }, []);

  // Encontrar posição do objetivo
  const findGoalPosition = useCallback((map) => {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 3) { // FINISH
          return { x, y };
        }
      }
    }
    return { x: 0, y: 0 };
  }, []);

  // Verificar se uma posição é válida
  const isValidPosition = useCallback((x, y, map) => {
    if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) {
      return false;
    }
    return map[y][x] !== 0; // Não é parede
  }, []);

  // Obter próxima posição baseada na direção
  const getNextPosition = useCallback((x, y, direction) => {
    switch (direction) {
      case DirectionType.NORTH:
        return { x, y: y - 1 };
      case DirectionType.EAST:
        return { x: x + 1, y };
      case DirectionType.SOUTH:
        return { x, y: y + 1 };
      case DirectionType.WEST:
        return { x: x - 1, y };
      default:
        return { x, y };
    }
  }, []);

  // Verificar se há caminho em uma direção
  const isPathInDirection = useCallback((x, y, direction, map) => {
    const nextPos = getNextPosition(x, y, direction);
    return isValidPosition(nextPos.x, nextPos.y, map);
  }, [getNextPosition, isValidPosition]);

  // Verificar se chegou ao objetivo
  const isAtGoal = useCallback((x, y, map) => {
    return map[y] && map[y][x] === 3; // FINISH
  }, []);

  // Resetar jogo para o nível atual
  const resetGame = useCallback(() => {
    const levelData = getCurrentLevelData();
    const startPos = findStartPosition(levelData.map);
    setPlayerPosition(startPos);
    setGameState(GameState.IDLE);
    setExecutionLog([]);
  }, [getCurrentLevelData, findStartPosition]);

  // Mudar para um nível específico
  const changeLevel = useCallback((level) => {
    if (level >= 1 && level <= MAZE_LEVELS.length) {
      setCurrentLevel(level);
      const levelData = MAZE_LEVELS[level - 1];
      const startPos = findStartPosition(levelData.map);
      setPlayerPosition(startPos);
      setGameState(GameState.IDLE);
      setExecutionLog([]);
    }
  }, [findStartPosition]);

  // Executar movimento para frente
  const moveForward = useCallback(() => {
    const levelData = getCurrentLevelData();
    const nextPos = getNextPosition(playerPosition.x, playerPosition.y, playerPosition.direction);
    
    if (isValidPosition(nextPos.x, nextPos.y, levelData.map)) {
      setPlayerPosition(prev => ({ ...prev, x: nextPos.x, y: nextPos.y }));
      setExecutionLog(prev => [...prev, { action: 'move', from: { x: playerPosition.x, y: playerPosition.y }, to: nextPos }]);
      
      // Verificar se chegou ao objetivo
      if (isAtGoal(nextPos.x, nextPos.y, levelData.map)) {
        setGameState(GameState.SUCCESS);
      }
      
      return true;
    } else {
      setGameState(GameState.FAILURE);
      return false;
    }
  }, [playerPosition, getCurrentLevelData, getNextPosition, isValidPosition, isAtGoal]);

  // Virar à esquerda
  const turnLeft = useCallback(() => {
    setPlayerPosition(prev => ({
      ...prev,
      direction: (prev.direction + 3) % 4 // -1 mod 4
    }));
    setExecutionLog(prev => [...prev, { action: 'turnLeft', direction: (playerPosition.direction + 3) % 4 }]);
  }, [playerPosition.direction]);

  // Virar à direita
  const turnRight = useCallback(() => {
    setPlayerPosition(prev => ({
      ...prev,
      direction: (prev.direction + 1) % 4
    }));
    setExecutionLog(prev => [...prev, { action: 'turnRight', direction: (playerPosition.direction + 1) % 4 }]);
  }, [playerPosition.direction]);

  // Verificar se há caminho à frente
  const isPathForward = useCallback(() => {
    const levelData = getCurrentLevelData();
    return isPathInDirection(playerPosition.x, playerPosition.y, playerPosition.direction, levelData.map);
  }, [playerPosition, getCurrentLevelData, isPathInDirection]);

  // Verificar se há caminho à esquerda
  const isPathLeft = useCallback(() => {
    const levelData = getCurrentLevelData();
    const leftDirection = (playerPosition.direction + 3) % 4;
    return isPathInDirection(playerPosition.x, playerPosition.y, leftDirection, levelData.map);
  }, [playerPosition, getCurrentLevelData, isPathInDirection]);

  // Verificar se há caminho à direita
  const isPathRight = useCallback(() => {
    const levelData = getCurrentLevelData();
    const rightDirection = (playerPosition.direction + 1) % 4;
    return isPathInDirection(playerPosition.x, playerPosition.y, rightDirection, levelData.map);
  }, [playerPosition, getCurrentLevelData, isPathInDirection]);

  // Verificar se chegou ao objetivo
  const atGoal = useCallback(() => {
    const levelData = getCurrentLevelData();
    return isAtGoal(playerPosition.x, playerPosition.y, levelData.map);
  }, [playerPosition, getCurrentLevelData, isAtGoal]);

  // Funções de verificação negativas
  const noPathForward = useCallback(() => !isPathForward(), [isPathForward]);
  const noPathLeft = useCallback(() => !isPathLeft(), [isPathLeft]);
  const noPathRight = useCallback(() => !isPathRight(), [isPathRight]);

  return {
    // Estado
    currentLevel,
    gameState,
    playerPosition,
    executionLog,
    animationSpeed,
    
    // Dados do nível
    getCurrentLevelData,
    findGoalPosition,
    
    // Controles do jogo
    resetGame,
    changeLevel,
    setGameState,
    setAnimationSpeed,
    
    // Ações do jogador
    moveForward,
    turnLeft,
    turnRight,
    
    // Verificações de caminho
    isPathForward,
    isPathLeft,
    isPathRight,
    atGoal,
    noPathForward,
    noPathLeft,
    noPathRight
  };
}

