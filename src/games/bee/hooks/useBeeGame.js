import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useBaseGame } from '../../../hooks/useBaseGame';
import { BEE_GAME_CONFIG } from '../config/beeConfig';

export const useBeeGame = () => {
    const [gameState, setGameState] = useState('idle');
    const gameStateRef = useRef(gameState);
    const [beePosition, setBeePosition] = useState({ x: 0, y: 0, angle: 0 });
    const beePositionRef = useRef(beePosition);
    const [isExecuting, setIsExecuting] = useState(false);
    const [beeVisible, setBeeVisible] = useState(true);
    const [executionSpeed] = useState(500);
    const [hasNectar, setHasNectar] = useState(false);
    const [flowersCollected, setFlowersCollected] = useState(new Set());

    const baseGameHook = useBaseGame(BEE_GAME_CONFIG);

    const {
        currentPhase,
        getCurrentPhaseData,
        completePhase,
        handlePhaseChange,
        handleNextPhase,
        handlePreviousPhase,
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

    const executionControlRef = useRef({
        shouldStop: false,
        iterationCount: 0,
        startTime: 0,
        isRunning: false
    });

    const EXECUTION_CONFIG = {
        MAX_ITERATIONS: 99000,
        MAX_TIME: 99000,
        YIELD_INTERVAL: 50
    };

    const initializeBeePosition = useCallback(() => {
        const phaseData = getCurrentPhaseData();
        if (phaseData?.startPosition) {
            const { x, y } = phaseData.startPosition;
            const angle = phaseData.startAngle || 0;
            setBeePosition({ x, y, angle });
        }
    }, [getCurrentPhaseData]);

    const isAtFlower = useCallback(() => {
        const { x, y } = beePositionRef.current;
        const phaseData = getCurrentPhaseData();
        
        // Verificar flor única
        if (phaseData?.flower) {
            const distance = Math.sqrt(
                Math.pow(x - phaseData.flower.x, 2) + 
                Math.pow(y - phaseData.flower.y, 2)
            );
            return distance < 10; // Tolerância de 10 unidades
        }
        
        // Verificar múltiplas flores
        if (phaseData?.flowers) {
            return phaseData.flowers.some(flower => {
                const distance = Math.sqrt(
                    Math.pow(x - flower.x, 2) + 
                    Math.pow(y - flower.y, 2)
                );
                return distance < 10;
            });
        }
        
        return false;
    }, [getCurrentPhaseData]);

    const isAtHive = useCallback(() => {
        const { x, y } = beePositionRef.current;
        const phaseData = getCurrentPhaseData();
        
        if (phaseData?.hive) {
            const distance = Math.sqrt(
                Math.pow(x - phaseData.hive.x, 2) + 
                Math.pow(y - phaseData.hive.y, 2)
            );
            return distance < 10; // Tolerância de 10 unidades
        }
        
        return false;
    }, [getCurrentPhaseData]);

    const checkWallCollision = useCallback((newX, newY) => {
        const phaseData = getCurrentPhaseData();
        if (!phaseData?.walls) return false;

        // Verificar colisão com paredes
        for (const wall of phaseData.walls) {
            // Implementação simples de colisão linha-ponto
            const distance = Math.abs(
                (wall.y2 - wall.y1) * newX - 
                (wall.x2 - wall.x1) * newY + 
                wall.x2 * wall.y1 - 
                wall.y2 * wall.x1
            ) / Math.sqrt(
                Math.pow(wall.y2 - wall.y1, 2) + 
                Math.pow(wall.x2 - wall.x1, 2)
            );
            
            if (distance < 5) { // Tolerância de 5 unidades
                return true;
            }
        }
        
        return false;
    }, [getCurrentPhaseData]);

    const beeMove = useCallback((angle) => {
        return new Promise(resolve => {
            setBeePosition(prev => {
                const radians = (angle * Math.PI) / 180;
                const distance = 10; // Distância fixa por movimento
                const newX = Math.max(0, Math.min(100, prev.x + Math.cos(radians) * distance));
                const newY = Math.max(0, Math.min(100, prev.y + Math.sin(radians) * distance));

                // Verificar colisão com paredes
                if (checkWallCollision(newX, newY)) {
                    setTimeout(() => {
                        setGameState('failure');
                        resolve(false);
                    }, executionSpeed);
                    return prev;
                }

                setTimeout(() => resolve(true), executionSpeed);
                return { ...prev, x: newX, y: newY, angle };
            });
        });
    }, [executionSpeed, checkWallCollision]);

    const collectNectar = useCallback(() => {
        return new Promise(resolve => {
            if (isAtFlower()) {
                setHasNectar(true);
                // Marcar flor como coletada se necessário
                setTimeout(() => resolve(true), executionSpeed);
            } else {
                setTimeout(() => resolve(false), executionSpeed);
            }
        });
    }, [isAtFlower, executionSpeed]);

    const yieldToMainThread = useCallback(async () => {
        const control = executionControlRef.current;
        control.iterationCount++;
        if (control.iterationCount % EXECUTION_CONFIG.YIELD_INTERVAL === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
        }
    }, []);

    const checkWinCondition = useCallback(() => {
        const phaseData = getCurrentPhaseData();
        
        // Se há colmeia, precisa estar nela com néctar
        if (phaseData?.hive) {
            return hasNectar && isAtHive();
        }
        
        // Se não há colmeia, só precisa estar na flor
        return isAtFlower();
    }, [getCurrentPhaseData, hasNectar, isAtHive, isAtFlower]);

    const executeCode = useCallback(async (code) => {
        if (isExecuting) return;

        setIsExecuting(true);
        setGameState('running');

        const control = executionControlRef.current;
        control.shouldStop = false;
        control.iterationCount = 0;
        control.startTime = Date.now();
        control.isRunning = true;

        let goalAchieved = false;

        try {
            const context = {
                beeMove: async (angle) => {
                    if (control.shouldStop) return false;
                    const result = await beeMove(angle);
                    yieldToMainThread();
                    if (checkWinCondition()) {
                        goalAchieved = true;
                        control.shouldStop = true;
                        setGameState('success');
                        completePhase(currentPhase);
                    }
                    return result;
                },
                collectNectar: async () => {
                    if (control.shouldStop) return false;
                    const result = await collectNectar();
                    yieldToMainThread();
                    if (checkWinCondition()) {
                        goalAchieved = true;
                        control.shouldStop = true;
                        setGameState('success');
                        completePhase(currentPhase);
                    }
                    return result;
                },
                atFlower: () => {
                    if (control.shouldStop) return false;
                    return isAtFlower();
                },
                atHive: () => {
                    if (control.shouldStop) return false;
                    return isAtHive();
                },
                nectarAvailable: () => {
                    if (control.shouldStop) return false;
                    return isAtFlower() && !hasNectar;
                }
            };

            const asyncFunc = new Function(...Object.keys(context), `
                return (async () => {
                    ${code}
                })();
            `);

            await asyncFunc(...Object.values(context));
            await new Promise(resolve => setTimeout(resolve, executionSpeed + 100));

            if (!goalAchieved && !control.shouldStop) {
                setGameState('failure');
            }
        } catch (error) {
            console.error('Erro na execução:', error);
            setGameState('failure');
        } finally {
            control.isRunning = false;
            setTimeout(() => {
                setIsExecuting(false);
            }, 400);
        }
    }, [
        isExecuting,
        beeMove,
        collectNectar,
        isAtFlower,
        isAtHive,
        hasNectar,
        checkWinCondition,
        completePhase,
        currentPhase,
        executionSpeed,
        yieldToMainThread
    ]);

    const resetGame = useCallback(() => {
        setGameState('idle');
        setIsExecuting(false);
        setHasNectar(false);
        setFlowersCollected(new Set());
        setBeeVisible(false);
        setTimeout(() => {
            initializeBeePosition();
            setBeeVisible(true);
        }, 50);
    }, [initializeBeePosition]);

    const handlePhaseChangeWrapper = useCallback((newPhase) => {
        const result = handlePhaseChange(newPhase);
        if (result) {
            setGameState('idle');
            setIsExecuting(false);
            setHasNectar(false);
            setFlowersCollected(new Set());
        }
        return result;
    }, [handlePhaseChange]);

    const handleNextPhaseWrapper = useCallback(() => {
        const result = handleNextPhase();
        if (result) {
            setGameState('idle');
            setIsExecuting(false);
            setHasNectar(false);
            setFlowersCollected(new Set());
        }
        return result;
    }, [handleNextPhase]);

    const handlePreviousPhaseWrapper = useCallback(() => {
        const result = handlePreviousPhase();
        if (result) {
            setGameState('idle');
            setIsExecuting(false);
            setHasNectar(false);
            setFlowersCollected(new Set());
        }
        return result;
    }, [handlePreviousPhase]);

    useEffect(() => {
        if (currentPhaseData) {
            initializeBeePosition();
        }
    }, [currentPhaseData, initializeBeePosition]);

    useEffect(() => {
        beePositionRef.current = beePosition;
    }, [beePosition]);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    return {
        gameState,
        beePosition,
        beeVisible,
        isExecuting,
        hasNectar,
        flowersCollected,
        currentPhaseData,
        executeCode,
        resetGame,
        
        // Sistema de fases
        currentPhase,
        totalPhases,
        unlockedPhases,
        completedPhases,
        gameConfig,
        handlePhaseChange: handlePhaseChangeWrapper,
        handleNextPhase: handleNextPhaseWrapper,
        handlePreviousPhase: handlePreviousPhaseWrapper,
        completePhase,
        getPhaseData,
        debugUnlockAllPhases,
        debugCompleteAllPhases,
        debugResetProgress,
        debugGoToPhase
    };
};
