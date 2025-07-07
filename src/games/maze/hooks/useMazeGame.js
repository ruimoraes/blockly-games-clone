import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useBaseGame } from '../../../hooks/useBaseGame';
import { MAZE_GAME_CONFIG } from '../config/mazeConfig';
import { detectInitialDirection } from '../components/MazeRenderer';

export const useMazeGame = () => {
    const [gameState, setGameState] = useState('idle');
    const gameStateRef = useRef(gameState);
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, direction: 0 });
    const playerPositionRef = useRef(playerPosition);
    const [isExecuting, setIsExecuting] = useState(false);
    const [playerVisible, setPlayerVisible] = useState(true);
    const [executionSpeed] = useState(500);

    const baseGameHook = useBaseGame(MAZE_GAME_CONFIG);

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

    const executionControlRef = useRef({
        shouldStop: false,
        iterationCount: 0,
        startTime: 0,
        lastFingerprint: null,
        sameStateCount: 0,
        isRunning: false
    });

    const EXECUTION_CONFIG = {
        MAX_ITERATIONS: 99000,
        MAX_TIME: 99000,
        STUCK_THRESHOLD: 20,
        YIELD_INTERVAL: 50
    };

    const initializePlayerPosition = useCallback(() => {
        const phaseData = getCurrentPhaseData();
        if (phaseData?.startPosition) {
            const { x, y } = phaseData.startPosition;
            const direction = detectInitialDirection(mazeData, x, y);
            setPlayerPosition({ x, y, direction });
        }
    }, [getCurrentPhaseData, mazeData]);

    const isValidPosition = useCallback((x, y) => {
        return y >= 0 && y < mazeData.length &&
            x >= 0 && x < mazeData[0].length &&
            mazeData[y][x] !== 0;
    }, [mazeData]);

    const getNewPosition = useCallback((direction, currentPos = null) => {
        const pos = currentPos || playerPositionRef.current;
        if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
            console.error('Posição inválida em getNewPosition:', pos);
            return { x: 0, y: 0 };
        }
        const directions = [
            { x: 0, y: -1, value: 0 },
            { x: 1, y: 0, value: 4 },
            { x: 0, y: 1, value: 8 },
            { x: -1, y: 0, value: 12 }
        ];

        const index = direction / 4;
        const delta = directions[index];
        if (!delta) {
            console.error('Direção inválida:', direction);
            return { x: pos.x, y: pos.y };
        }
        return { x: pos.x + delta.x, y: pos.y + delta.y };
    }, []);

    const turnRight = useCallback(() => {
        return new Promise(resolve => {
            setPlayerPosition(prev => {
                const newDirection = (prev.direction + 4) % 16;
                return { ...prev, direction: newDirection };
            });
            setTimeout(resolve, executionSpeed);
        });
    }, [executionSpeed]);

    const turnLeft = useCallback(() => {
        return new Promise(resolve => {
            setPlayerPosition(prev => {
                const newDirection = (prev.direction + 12) % 16;
                return { ...prev, direction: newDirection };
            });
            setTimeout(resolve, executionSpeed);
        });
    }, [executionSpeed]);

    useEffect(() => {
        playerPositionRef.current = playerPosition;
    }, [playerPosition]);

    const isPathAhead = useCallback(() => {
        const { x, y, direction } = playerPositionRef.current;
        const nextPos = getNewPosition(direction, { x, y, direction });
        if (nextPos.y < 0 || nextPos.y >= mazeData.length ||
            nextPos.x < 0 || nextPos.x >= mazeData[0].length) {
            return false;
        }
        return mazeData[nextPos.y][nextPos.x] === 1;
    }, [getNewPosition, mazeData]);

    const isPathLeft = useCallback(() => {
        const { x, y, direction } = playerPositionRef.current;
        const leftDirection = (direction + 12) % 16;
        const nextPos = getNewPosition(leftDirection, { x, y, direction: leftDirection });
        if (nextPos.y < 0 || nextPos.y >= mazeData.length ||
            nextPos.x < 0 || nextPos.x >= mazeData[0].length) {
            return false;
        }
        return mazeData[nextPos.y][nextPos.x] === 1;
    }, [getNewPosition, mazeData]);

    const isPathRight = useCallback(() => {
        const { x, y, direction } = playerPositionRef.current;
        const rightDirection = (direction + 4) % 16;
        const nextPos = getNewPosition(rightDirection, { x, y, direction: rightDirection });
        if (nextPos.y < 0 || nextPos.y >= mazeData.length ||
            nextPos.x < 0 || nextPos.x >= mazeData[0].length) {
            return false;
        }
        return mazeData[nextPos.y][nextPos.x] === 1;
    }, [getNewPosition, mazeData]);


    const createPositionFingerprint = useCallback(() => {
        const { x, y, direction } = playerPositionRef.current;
        const pathAhead = isPathAhead();
        const pathLeft = isPathLeft();
        const pathRight = isPathRight();
        return `${x},${y},${direction}|${pathAhead}|${pathLeft}|${pathRight}`;
    }, [isPathAhead, isPathLeft, isPathRight]);

    const shouldStopExecution = useCallback(() => {
        const control = executionControlRef.current;
        if (control.iterationCount >= EXECUTION_CONFIG.MAX_ITERATIONS) {
            console.warn('Limite de operações atingido');
            return true;
        }
        if (Date.now() - control.startTime > EXECUTION_CONFIG.MAX_TIME) {
            console.warn('Tempo limite de execução atingido');
            return true;
        }
        const currentFingerprint = createPositionFingerprint();
        if (currentFingerprint === control.lastFingerprint) {
            control.sameStateCount++;
            if (control.sameStateCount > EXECUTION_CONFIG.STUCK_THRESHOLD) {
                console.warn('🚫 Personagem preso - interrompendo execução');
                return true;
            }
        } else {
            control.sameStateCount = 0;
        }
        control.lastFingerprint = currentFingerprint;
        return false;
    }, [EXECUTION_CONFIG.MAX_ITERATIONS, EXECUTION_CONFIG.MAX_TIME, EXECUTION_CONFIG.STUCK_THRESHOLD, createPositionFingerprint]);

    const yieldToMainThread = useCallback(async () => {
        const control = executionControlRef.current;
        control.iterationCount++;
        if (control.iterationCount % EXECUTION_CONFIG.YIELD_INTERVAL === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
        }
    }, []);

    const isAtGoalControlled = useCallback(() => {
        const control = executionControlRef.current;
        if (shouldStopExecution()) {
            control.shouldStop = true;
            setGameState('failure');
            return true;
        }
        yieldToMainThread();
        const { x, y } = playerPositionRef.current;
        const actuallyAtGoal = mazeData[y] && mazeData[y][x] === 3;
        if (actuallyAtGoal) {
            console.log('🎯 Objetivo alcançado!');
            setGameState('success');
        }
        return actuallyAtGoal;
    }, [shouldStopExecution, yieldToMainThread, mazeData]);

    const isFailureControlled = useCallback(() => {
        const control = executionControlRef.current;
        return control.shouldStop || gameStateRef.current === 'failure';
    }, []);

    const executeCode = useCallback(async (code) => {
        if (isExecuting) return;

        setIsExecuting(true);
        setGameState('running');

        const control = executionControlRef.current;
        control.shouldStop = false;
        control.iterationCount = 0;
        control.startTime = Date.now();
        control.lastFingerprint = null;
        control.sameStateCount = 0;
        control.isRunning = true;

        let goalAchieved = false;

        try {
            const context = {
                moveForward: async () => {
                    if (control.shouldStop) return false;
                    return new Promise((resolve) => {
                        setPlayerPosition(prev => {
                            const nextPos = getNewPosition(prev.direction, prev);
                            if (isValidPosition(nextPos.x, nextPos.y)) {
                                const cellValue = mazeData[nextPos.y]?.[nextPos.x];
                                if (cellValue === 3) {
                                    goalAchieved = true;
                                    control.shouldStop = true;
                                    setGameState('success');
                                    completePhase(currentPhase);
                                }
                                setTimeout(() => resolve(true), executionSpeed);
                                return { ...prev, x: nextPos.x, y: nextPos.y };
                            } else {
                                setTimeout(() => {
                                    console.warn('🚧 Caminho bloqueado');
                                    setGameState('failure');
                                    control.shouldStop = true;
                                    resolve(false);
                                }, executionSpeed);
                                return prev;
                            }
                        });
                    });
                },
                turnRight: async () => {
                    if (control.shouldStop) return false;
                    await turnRight();
                    return true;
                },
                turnLeft: async () => {
                    if (control.shouldStop) return false;
                    await turnLeft();
                    return true;
                },
                isPathAhead: () => {
                    if (control.shouldStop) return false;
                    return isPathAhead();
                },
                isPathLeft: () => {
                    if (control.shouldStop) return false;
                    return isPathLeft();
                },
                isPathRight: () => {
                    if (control.shouldStop) return false;
                    return isPathRight();
                },
                isAtGoal: isAtGoalControlled,
                isFailure: isFailureControlled
            };

            const asyncFunc = new Function(...Object.keys(context), `
            return (async () => {
                ${code}
            })();
        `);

            await asyncFunc(...Object.values(context));
            await new Promise(resolve => setTimeout(resolve, executionSpeed + 100));
            console.log(`📊 Execução finalizada: ${control.iterationCount} iterações em ${Date.now() - control.startTime}ms`);

            if (!goalAchieved && control.shouldStop) {
                setGameState('failure');
            } else if (!goalAchieved && !control.shouldStop) {
                setGameState('failure');
            }
        } catch (error) {
            console.error('💥 Erro na execução:', error);
            setGameState('failure');
            await new Promise(resolve => setTimeout(resolve, 300));
        } finally {
            control.isRunning = false;
            setTimeout(() => {
                setIsExecuting(false);
            }, 400);
        }
    }, [
        isExecuting,
        turnRight,
        turnLeft,
        isPathAhead,
        isPathLeft,
        isPathRight,
        isAtGoalControlled,
        isFailureControlled,
        executionSpeed,
        getNewPosition,
        isValidPosition,
        mazeData,
        completePhase,
        currentPhase
    ]);

    const resetGame = useCallback(() => {
        setGameState('idle');
        setIsExecuting(false);
        setPlayerVisible(false);
        setTimeout(() => {
            initializePlayerPosition();
            setPlayerVisible(true);
        }, 50);
    }, [initializePlayerPosition])

    const handlePhaseChangWrapper = useCallback((newPhase) => {
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
        if (mazeData.length > 0) {
            initializePlayerPosition();
        }
    }, [mazeData, initializePlayerPosition]);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    return {
        gameState,
        playerPosition,
        playerVisible,
        isExecuting,
        mazeData,
        executeCode,
        resetGame,
        turnRight,
        currentPhase,
        currentPhaseData,
        totalPhases,
        unlockedPhases,
        completedPhases,
        gameConfig,
        handlePhaseChange: handlePhaseChangWrapper,
        handleNextPhase: handleNextPhaseWrapper,
        handlePreviousPhase: handlePreviousPhaseWrapper,
        completePhase,
        getPhaseData,
        debugUnlockAllPhases,
        debugCompleteAllPhases,
        debugResetProgress,
        debugGoToPhase        
    };
}