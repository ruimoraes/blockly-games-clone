
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

        // Funções de debug
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
            { x: 0, y: -1, value: 0 }, // Norte (0)
            { x: 1, y: 0, value: 4 },  // Leste (1)
            { x: 0, y: 1, value: 8 },  // Sul (2)
            { x: -1, y: 0, value: 12 }  // Oeste (3)
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
                // Direções: 0=Norte, 4=Leste, 8=Sul, 12=Oeste
                // Para virar à direita: Norte(0)→Leste(4)→Sul(8)→Oeste(12)→Norte(0)
                const newDirection = (prev.direction + 4) % 16;
                return { ...prev, direction: newDirection };
            });
            setTimeout(resolve, executionSpeed);
        });
    }, [executionSpeed]);

    const turnLeft = useCallback(() => {
        return new Promise(resolve => {
            setPlayerPosition(prev => {
                // Direções: 0=Norte, 4=Leste, 8=Sul, 12=Oeste
                // Para virar à esquerda: Norte(0)→Oeste(12)→Sul(8)→Leste(4)→Norte(0)
                // +12 é equivalente a -4 no módulo 16                
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
        
        // console.log('Verificando caminho à frente:');
        // console.log('  - Posição atual:', { x, y, direction });
        // console.log('  - Próxima posição:', nextPos);
        // console.log('  - Valor do mapa:', mazeData[nextPos.y]?.[nextPos.x]);
        // console.log('  - Resultado:', mazeData[nextPos.y]?.[nextPos.x] === 1);
        
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
        
        // console.log('Verificando caminho à esquerda:');
        // console.log('  - Posição atual:', { x, y, direction });
        // console.log('  - Próxima posição:', nextPos);
        // console.log('  - Valor do mapa:', mazeData[nextPos.y]?.[nextPos.x]);
        // console.log('  - Resultado:', mazeData[nextPos.y]?.[nextPos.x] === 1);

        // Verificar se a posição está dentro dos limites do mapa
        if (nextPos.y < 0 || nextPos.y >= mazeData.length || 
            nextPos.x < 0 || nextPos.x >= mazeData[0].length) {
            return false;
        }
        
        // Verificar se é especificamente um caminho livre (valor 1)
        return mazeData[nextPos.y][nextPos.x] === 1;
    }, [getNewPosition, mazeData]);

    const isPathRight = useCallback(() => {
        const { x, y, direction } = playerPositionRef.current;
        const rightDirection = (direction + 4) % 16;
        const nextPos = getNewPosition(rightDirection, { x, y, direction: rightDirection });
        
        // console.log('Verificando caminho à direita:');
        // console.log('  - Posição atual:', { x, y, direction });
        // console.log('  - Próxima posição:', nextPos);
        // console.log('  - Valor do mapa:', mazeData[nextPos.y]?.[nextPos.x]);
        // console.log('  - Resultado:', mazeData[nextPos.y]?.[nextPos.x] === 1);

        // Verificar se a posição está dentro dos limites do mapa
        if (nextPos.y < 0 || nextPos.y >= mazeData.length || 
            nextPos.x < 0 || nextPos.x >= mazeData[0].length) {
            return false;
        }
        
        // Verificar se é especificamente um caminho livre (valor 1)
        return mazeData[nextPos.y][nextPos.x] === 1;
    }, [getNewPosition, mazeData]);

    const isAtGoal = useCallback(() => {
        const { x, y } = playerPosition;
        return mazeData[y] && mazeData[y][x] === 3;
    }, [playerPosition, mazeData]);

    const isFailure = useCallback(() => {
        return gameStateRef.current === 'failure';
    }, []);

    const executeCode = useCallback(async (code) => {
        if (isExecuting) return;

        setIsExecuting(true);
        setGameState('running');

        let goalAchieved = false;
        let shouldStop = false;    
        
        let iterationCount = 0;
        const MAX_ITERATIONS = 1000; // Limite razoável
        const startTime = Date.now();
        const MAX_TIME = 10000; // 10 segundos máximo

        try {
            const context = {
                moveForward: async () => {
                    if (shouldStop) return true;

                    return new Promise((resolve, reject) => {
                        setPlayerPosition(prev => {
                            const nextPos = getNewPosition(prev.direction, prev);

                            if (isValidPosition(nextPos.x, nextPos.y)) {
                                // console.log(`[moveForward] Caminho à frente é válido: (${nextPos.x}, ${nextPos.y})`);

                                const isGoalReached = mazeData[nextPos.y] && mazeData[nextPos.y][nextPos.x] === 3;

                                if (isGoalReached) {
                                    goalAchieved = true;
                                    shouldStop = true;
                                    setGameState('success');
                                    completePhase(currentPhase);
                                }

                                return { ...prev, x: nextPos.x, y: nextPos.y };
                            } else {
                                setTimeout(() => reject(new Error('Caminho bloqueado!')), executionSpeed);
                                setGameState('failure');
                                shouldStop = true;
                                return prev;
                            }
                        });

                        setTimeout(() => resolve(goalAchieved), executionSpeed);
                    });
                },
                turnRight,
                turnLeft,  
                isPathAhead,
                isPathLeft,
                isPathRight,
                isAtGoal: () => goalAchieved,
                isFailure
            };

            // console.log('Executando código do jogador:', code);

            const asyncWrapper = `(async () => { ${code} })()`;
            const func = new Function(...Object.keys(context), asyncWrapper);
            await func(...Object.values(context));

            // Aguardar tempo suficiente para processamento
            await new Promise(resolve => setTimeout(resolve, executionSpeed + 100));
        } catch (e) {
            console.error('Erro ao executar código do jogador:', e);
            if (!goalAchieved) { // Só define falha se não alcançou o objetivo
                setGameState('failure');
            }
            await new Promise(resolve => setTimeout(resolve, 300));
            
        } finally {
            setTimeout(() => {
                setIsExecuting(false);
                // console.log('Execução finalizada, botão liberado');
            }, 400);
        }
    }, [
        isExecuting,
        turnRight,
        turnLeft,
        isPathAhead,
        isPathLeft,
        isPathRight,
        isFailure,
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
        // console.log('🎮 handlePhaseChangeWrapper: Mudando para fase', newPhase);
        const result = handlePhaseChange(newPhase);
        if (result) {
            setGameState('idle');
            setIsExecuting(false);
        }
        return result;
    }, [handlePhaseChange]);

    const handleNextPhaseWrapper = useCallback(() => {
        // console.log('🎮 handleNextPhaseWrapper: Indo para próxima fase');
        const result = handleNextPhase();
        if (result) {
            setGameState('idle');
            setIsExecuting(false);
        }
        return result;
    }, [handleNextPhase]);

    const handlePreviousPhaseWrapper = useCallback(() => {
        // console.log('🎮 handlePreviousPhaseWrapper: Indo para fase anterior');
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
        getPhaseData
    };
}

export default useMazeGame;