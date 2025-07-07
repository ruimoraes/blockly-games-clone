import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import BaseGame from '../../components/common/BaseGame';
import BlocklyEditor from '../../components/common/BlocklyEditor';
import GameArea from '../../components/common/GameArea';
import DebugPanel from '../../components/common/DebugPanel';
import { defineBlocks, defineGenerators, generateDynamicToolbox } from './blocks/mazeBlocks';
import { useMazeGame } from './hooks/useMazeGame';
import MazeRenderer from './components/MazeRenderer';

defineBlocks();
defineGenerators();

function MazeGame() {
    const [isMobile, setIsMobile] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [debugPanelOpen, setDebugPanelOpen] = useState(false);

    const blocklyEditorRef = useRef(null);
    
    const handleCodeChange = useCallback((code) => {
        setGeneratedCode(code);
    }, []);

    const {
        gameState,
        playerPosition,
        playerVisible,
        isExecuting,
        mazeData,

        currentPhase,
        currentPhaseData,
        totalPhases,
        unlockedPhases,
        completedPhases,
        gameConfig,

        executeCode,
        resetGame,

        handlePhaseChange,
        handleNextPhase,
        handlePreviousPhase,
        getPhaseData,

        debugUnlockAllPhases,
        debugCompleteAllPhases,
        debugResetProgress,
        debugGoToPhase
    } = useMazeGame();

    const toolboxConfig = useMemo(() => {        
        const allowedBlocks = currentPhaseData?.allowedBlocks || [];
        return generateDynamicToolbox(allowedBlocks);
    }, [currentPhaseData]);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

useEffect(() => {
}, [currentPhaseData]);    

    const handleRunCode = () => {
        const code = blocklyEditorRef.current?.getCode?.() || '';
        
        if (isMobile) {
            setTimeout(() => {
                executeCode(code);
            }, 200);
            const switchToGameEvent = new CustomEvent('switchToGameTab');
            window.dispatchEvent(switchToGameEvent);
        } else {
            executeCode(code);
        }
    }

    const handleResetGame = useCallback(() => {
        resetGame();
    }, [resetGame]);

    const editorComponent = (
        <BlocklyEditor
            ref={blocklyEditorRef}
            toolbox={toolboxConfig}
            onCodeChange={handleCodeChange}
            isExecuting={isExecuting}
            title="Editor de Blocos - Autômato"
            onRunCode={handleRunCode}
            onResetGame={handleResetGame}
            gameState={gameState}
            runButtonText="Executar Blocos"
            resetButtonText="Reiniciar Autômato"
        />
    );

    const gameAreaComponent = (
        <GameArea
            gameState={gameState}
            className="automato-game-area"
        >      <MazeRenderer
                mazeData={mazeData}
                playerPosition={playerPosition}
                playerVisible={playerVisible}
                gameState={gameState}
            />
        </GameArea>
    );

    const additionalComponents = [];

    // console.log('🎮 MazeGame - gameState:', gameState);
    
    return (
        <>
            <BaseGame
                gameTitle="Autômato"
                gameIcon="🤖"
                gameDescription="Aprenda programação visual guiando um autômato através de labirintos"

                currentPhase={currentPhase}
                totalPhases={totalPhases}
                currentPhaseData={currentPhaseData}

                isExecuting={isExecuting}
                gameState={gameState}
                generatedCode={generatedCode}

                editorComponent={editorComponent}
                gameAreaComponent={gameAreaComponent}
                additionalComponents={additionalComponents}

                onRunCode={handleRunCode}
                onResetGame={handleResetGame}
                onPhaseChange={handlePhaseChange}
                onNextPhase={handleNextPhase}
                onPreviousPhase={handlePreviousPhase}

                isMobile={isMobile}
                enableMobileTabs={true}
                gameAreaTitle="Autômato"

                unlockedPhases={unlockedPhases}
                completedPhases={completedPhases}
                getPhaseData={getPhaseData}
                gameConfig={gameConfig}
                showPhaseSelectorProp={true}
                showHomeButton={true}
                showBackButton={true}

                className="automato-game"
            />
            {/* Painel de Debug */}
            <DebugPanel
                gameTitle="Autômato"
                currentPhase={currentPhase}
                totalPhases={totalPhases}
                unlockedPhases={unlockedPhases}
                completedPhases={completedPhases}
                onPhaseChange={debugGoToPhase}
                onUnlockAllPhases={debugUnlockAllPhases}
                onCompleteAllPhases={debugCompleteAllPhases}
                onResetProgress={debugResetProgress}
                position="bottom-right"
                isOpen={debugPanelOpen}
                onToggle={setDebugPanelOpen}
            />
        </>
    );
};

export default MazeGame;