import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import BaseGame from '../../components/common/BaseGame';
import BlocklyEditor from '../../components/common/BlocklyEditor';
import GameArea from '../../components/common/GameArea';
import DebugPanel from '../../components/common/DebugPanel';
import { defineBlocks, defineGenerators, generateDynamicToolbox } from './blocks/beeBlocks';
import { useBeeGame } from './hooks/useBeeGame';
import BeeRenderer from './components/BeeRenderer';

defineBlocks();
defineGenerators();

function clearGameWorkspacesFromStorage(gameName) {
    if (!gameName) return;
    const prefix = `ws-${gameName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

function BeeGame() {
    const [isMobile, setIsMobile] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [debugPanelOpen, setDebugPanelOpen] = useState(false);

    const blocklyEditorRef = useRef(null);

    const {
        gameState,
        beePosition,
        beeVisible,
        isExecuting,
        hasNectar,
        flowersCollected,
        currentPhaseData,

        currentPhase,
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
    } = useBeeGame();

    const handleResetProgress = useCallback(() => {
        debugResetProgress();
        clearGameWorkspacesFromStorage('bee');
    }, [debugResetProgress]);

    const handleCodeChange = useCallback((code) => {
        setGeneratedCode(code);
    }, []);

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
    };

    const handleResetGame = useCallback(() => {
        resetGame();
    }, [resetGame]);

    const handleToggleDebugPanel = useCallback(() => {
        setDebugPanelOpen(prev => !prev);
    }, []);

    const editorComponent = (
        <BlocklyEditor
            ref={blocklyEditorRef}
            toolbox={toolboxConfig}
            onCodeChange={handleCodeChange}
            phaseKey={currentPhase}
            isExecuting={isExecuting}
            title="Editor de Blocos - Bee"
            gameName="bee"
            onRunCode={handleRunCode}
            onResetGame={handleResetGame}
            gameState={gameState}
            runButtonText="Executar Blocos"
            resetButtonText="Reiniciar Abelha"
        />
    );

    const gameAreaComponent = (
        <GameArea
            gameState={gameState}
            className="bee-game-area"
            onNextPhase={handleNextPhase}
            currentPhase={currentPhase}
            totalPhases={totalPhases}
        >
            <BeeRenderer
                currentPhaseData={currentPhaseData}
                beePosition={beePosition}
                beeVisible={beeVisible}
                hasNectar={hasNectar}
                gameState={gameState}
            />
        </GameArea>
    );

    const additionalComponents = [];

    return (
        <>
            <BaseGame
                gameTitle="Bee"
                gameIcon="🐝"
                gameDescription="Aprenda programação visual guiando uma abelha para coletar néctar"
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
                gameAreaTitle="Bee"
                unlockedPhases={unlockedPhases}
                completedPhases={completedPhases}
                getPhaseData={getPhaseData}
                gameConfig={gameConfig}
                showPhaseSelectorProp={true}
                showHomeButton={true}
                showBackButton={true}
                onShowDebugPanel={handleToggleDebugPanel}
                onResetAllProgress={handleResetProgress}
            />
            {/* Painel de Debug */}
            <DebugPanel
                gameTitle="Bee"
                currentPhase={currentPhase}
                totalPhases={totalPhases}
                unlockedPhases={unlockedPhases}
                completedPhases={completedPhases}
                onPhaseChange={debugGoToPhase}
                onUnlockAllPhases={debugUnlockAllPhases}
                onCompleteAllPhases={debugCompleteAllPhases}
                onResetProgress={handleResetProgress}
                position="bottom-right"
                isOpen={debugPanelOpen}
                onToggle={setDebugPanelOpen}
            />
        </>
    );
}

export default BeeGame;
