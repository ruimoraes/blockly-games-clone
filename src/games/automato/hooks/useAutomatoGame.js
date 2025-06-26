import { useState, useCallback, useEffect, useMemo } from 'react';
import { useBaseGame } from '../../../hooks/useBaseGame';
import { AUTOMATO_GAME_CONFIG } from '../config/automatoConfig';

export const useAutomatoGame = () => {
  const [gameState, setGameState] = useState('idle');
  const [playerPosition, setPlayerPosition] = useState({ x: 2, y: 4, direction: 1 });
  const [playerVisible, setPlayerVisible] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSpeed] = useState(500);

  const baseGameHook = useBaseGame(AUTOMATO_GAME_CONFIG);
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
    debugUnlockAllPhases,
    debugCompleteAllPhases,
    debugResetProgress,
    debugGoToPhase
  } = baseGameHook;

  const currentPhaseData = getCurrentPhaseData();
  const mazeData = useMemo(() => currentPhaseData?.map || [], [currentPhaseData]);
  const initializePlayerPosition = useCallback(() => {
    const phaseData = getCurrentPhaseData();
    if (phaseData?.startPosition) {
      setPlayerPosition({
        x: phaseData.startPosition.x,
        y: phaseData.startPosition.y,
        direction: phaseData.startPosition.direction
      });
    }
  }, [getCurrentPhaseData, currentPhase]);

  const isValidPosition = useCallback((x, y) => {
    return y >= 0 && y < mazeData.length && 
           x >= 0 && x < mazeData[0].length &&
           mazeData[y][x] !== 0;
  }, [mazeData]);

  const getNewPosition = useCallback((direction) => {
    const { x, y } = playerPosition;
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];
    const delta = directions[direction];
    return { x: x + delta.x, y: y + delta.y };
  }, [playerPosition]);

  const isPathAhead = useCallback(() => {
    const newPos = getNewPosition(playerPosition.direction);
    return isValidPosition(newPos.x, newPos.y);
  }, [getNewPosition, playerPosition.direction, isValidPosition]);

  const isPathLeft = useCallback(() => {
    const leftDirection = (playerPosition.direction + 3) % 4;
    const newPos = getNewPosition(leftDirection);
    return isValidPosition(newPos.x, newPos.y);
  }, [getNewPosition, playerPosition.direction, isValidPosition]);

  const isPathRight = useCallback(() => {
    const rightDirection = (playerPosition.direction + 1) % 4;
    const newPos = getNewPosition(rightDirection);
    return isValidPosition(newPos.x, newPos.y);
  }, [getNewPosition, playerPosition.direction, isValidPosition]);

  const moveForward = useCallback(async () => {
    if (!isPathAhead()) {
      throw new Error('Não é possível mover para frente - há um obstáculo!');
    }
    const newPos = getNewPosition(playerPosition.direction);
    setPlayerPosition(prev => ({ ...prev, x: newPos.x, y: newPos.y }));
    if (mazeData[newPos.y] && mazeData[newPos.y][newPos.x] === 3) {
      setGameState('success');
      completePhase(currentPhase);
    }
    await new Promise(resolve => setTimeout(resolve, executionSpeed));
    return false;
  }, [isPathAhead, getNewPosition, playerPosition.direction, executionSpeed, mazeData, completePhase, currentPhase]);

  const turnLeft = useCallback(async () => {
    const newDirection = (playerPosition.direction + 3) % 4;
    setPlayerPosition(prev => ({
      ...prev,
      direction: newDirection
    }));
    await new Promise(resolve => setTimeout(resolve, executionSpeed));
  }, [playerPosition.direction, executionSpeed]);

  const turnRight = useCallback(async () => {
    const newDirection = (playerPosition.direction + 1) % 4;
    setPlayerPosition(prev => ({
      ...prev,
      direction: newDirection
    }));
    await new Promise(resolve => setTimeout(resolve, executionSpeed));
  }, [playerPosition.direction, executionSpeed]);

  const resetGame = useCallback(() => {
    setGameState('idle');
    setIsExecuting(false);
    setPlayerVisible(false);
    setTimeout(() => {
      initializePlayerPosition();
      setPlayerVisible(true);
    }, 50);
  }, [initializePlayerPosition]);

  const handlePhaseChangeWrapper = useCallback((newPhase) => {
    const result = handlePhaseChange(newPhase);
    if (result) {
      setGameState('idle');
      setIsExecuting(false);
    }
    return result;
  }, [handlePhaseChange]);

  const handleNextPhaseWrapper = useCallback(() => {
    const result = handleNextPhase();
    if (result) {
      setGameState('idle');
      setIsExecuting(false);
    }
    return result;
  }, [handleNextPhase]);

  const handlePreviousPhaseWrapper = useCallback(() => {
    const result = handlePreviousPhase();
    if (result) {
      setGameState('idle');
      setIsExecuting(false);
    }
    return result;
  }, [handlePreviousPhase]);

  useEffect(() => {
    setPlayerVisible(false);
    const timer = setTimeout(() => {
      const phaseData = getCurrentPhaseData();
      if (phaseData?.startPosition) {
        setPlayerPosition({
          x: phaseData.startPosition.x,
          y: phaseData.startPosition.y,
          direction: phaseData.startPosition.direction
        });
        setTimeout(() => {
          setPlayerVisible(true);
        }, 100);
      } else {
        const defaultPosition = { x: 2, y: 4, direction: 1 };
        setPlayerPosition(defaultPosition);
        setPlayerVisible(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPhase, getCurrentPhaseData]);

  return {
    gameState,
    playerPosition,
    playerVisible,
    isExecuting,
    mazeData,
    resetGame,
    moveForward,
    turnLeft,
    turnRight,
    isPathAhead,
    isPathLeft,
    isPathRight,
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
    debugUnlockAllPhases,
    debugCompleteAllPhases,
    debugResetProgress,
    debugGoToPhase
  };
};
