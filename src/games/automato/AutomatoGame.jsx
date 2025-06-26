import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import BaseGame from '../../components/common/BaseGame';
import BlocklyEditor from '../../components/common/BlocklyEditor';
import GameArea from '../../components/common/GameArea';
import DebugPanel from '../../components/common/DebugPanel';
import { useAutomatoGame } from './hooks/useAutomatoGame';
import { defineBlocks, defineGenerators, generateDynamicToolbox } from './blocks/automatoBlocks';
import AutomatoRenderer from './components/AutomatoRenderer';

defineBlocks();
defineGenerators();

function AutomatoGame() {
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
    handlePhaseChange,
    handleNextPhase,
    handlePreviousPhase,
    getPhaseData,
    debugUnlockAllPhases,
    debugCompleteAllPhases,
    debugResetProgress,
    debugGoToPhase,
    resetGame
  } = useAutomatoGame();

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
  }, [gameState]);

  const handleRunCode = useCallback(() => {
    const code = blocklyEditorRef.current?.getCode?.() || '';
    console.log('[Blockly] Código gerado para execução:', code);
  }, [isMobile]);

  const handleToggleDebugPanel = useCallback(() => {
    setDebugPanelOpen(prev => !prev);
  }, []);

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
    >
      <AutomatoRenderer
        mazeData={mazeData}
        playerPosition={playerPosition}
        playerVisible={playerVisible}
        gameState={gameState}
      />
    </GameArea>
  );

  const additionalComponents = [];
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
        onShowDebugPanel={handleToggleDebugPanel}
        className="automato-game"
      />
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
}

export default AutomatoGame;
