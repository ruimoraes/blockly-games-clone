import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import BaseGame from '../../components/common/BaseGame';
import BlocklyEditor from '../../components/common/BlocklyEditor';
import GameArea from '../../components/common/GameArea';
import DebugPanel from '../../components/common/DebugPanel';
import { useAutomatoGame } from './hooks/useAutomatoGame';
import { defineBlocks, defineGenerators, generateDynamicToolbox } from './blocks/automatoBlocks';
import AutomatoRenderer from './components/AutomatoRenderer';
import './AutomatoGame.css';

// Garante que os blocos e geradores sejam definidos apenas uma vez
// quando o módulo do jogo for carregado.
defineBlocks();
defineGenerators();

function AutomatoGame() {
  // Estado local para mobile e código gerado
  const [isMobile, setIsMobile] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [debugPanelOpen, setDebugPanelOpen] = useState(false);
  
  // Referência para o editor Blockly
  const blocklyEditorRef = useRef(null);
  // Estabilizar a função de callback para evitar re-renderizações
  const handleCodeChange = useCallback((code) => {
    setGeneratedCode(code);
  }, []);

  // Hook do jogo com base genérica
  const {
    // Estados básicos
    gameState,
    playerPosition,
    playerVisible,
    isExecuting,
    mazeData,

    // Dados da fase (vem da base genérica)
    currentPhase,
    currentPhaseData,
    totalPhases,
    unlockedPhases,
    completedPhases,
    gameConfig,

    // Ações do jogo
    executeCode,
    resetGame,

    // Ações de fase (vem da base genérica)
    handlePhaseChange,
    handleNextPhase,
    handlePreviousPhase,
    getPhaseData,
    
    // Funções de debug
    debugUnlockAllPhases,
    debugCompleteAllPhases,
    debugResetProgress,
    debugGoToPhase
  } = useAutomatoGame();

  // Gerar toolbox dinâmico baseado na fase atual
  const toolboxConfig = useMemo(() => {
    const allowedBlocks = currentPhaseData?.allowedBlocks || [];
    return generateDynamicToolbox(allowedBlocks);
  }, [currentPhaseData]);

  // Detectar mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);  }, []);  
  
  // Debug: monitorar mudanças no gameState
  useEffect(() => {
    console.log('🎮 AutomatoGame - gameState mudou para:', gameState);
  }, [gameState]);  // Executar código com suporte para mobile
  const handleRunCode = useCallback(() => {    
    // Sempre obter o código mais recente do workspace
    const code = blocklyEditorRef.current?.getCode?.() || '';
    console.log('[Blockly] Código gerado para execução:', code);
    if (isMobile) {
      setTimeout(() => {
        executeCode(code);
      }, 200);
      const switchToGameEvent = new CustomEvent('switchToGameTab');
      window.dispatchEvent(switchToGameEvent);
    } else {
      executeCode(code);
    }
  }, [executeCode, isMobile]);

  // Função para controlar o debug panel
  const handleToggleDebugPanel = useCallback(() => {
    setDebugPanelOpen(prev => !prev);
  }, []);  // Handler para resetar apenas o estado do jogo, mantendo o workspace intacto
  const handleResetGame = useCallback(() => {
    // Reset apenas o estado do jogo, mantendo o workspace
    resetGame();
  }, [resetGame]);

  // Componentes específicos do jogo  
  const editorComponent = (
    <BlocklyEditor
      ref={blocklyEditorRef}
      toolbox={toolboxConfig}
      onCodeChange={handleCodeChange}
      isExecuting={isExecuting}
      title="Editor de Blocos - Autômato"
      // Props do GameControls
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
    >      <AutomatoRenderer
        mazeData={mazeData}
        playerPosition={playerPosition}
        playerVisible={playerVisible}
        gameState={gameState}
      />
    </GameArea>
  );

  // Componentes adicionais - removido código gerado para simplificar interface
  const additionalComponents = [];
  return (
    <>
      <BaseGame
        // Configuração do jogo
        gameTitle="Autômato"
        gameIcon="🤖"
        gameDescription="Aprenda programação visual guiando um autômato através de labirintos"

        // Dados da fase
        currentPhase={currentPhase}
        totalPhases={totalPhases}
        currentPhaseData={currentPhaseData}

        // Estados
        isExecuting={isExecuting}
        gameState={gameState}
        generatedCode={generatedCode}

        // Conteúdo específico do jogo
        editorComponent={editorComponent}
        gameAreaComponent={gameAreaComponent}
        additionalComponents={additionalComponents}

        // Ações
        onRunCode={handleRunCode}
        onResetGame={handleResetGame}
        onPhaseChange={handlePhaseChange}
        onNextPhase={handleNextPhase}
        onPreviousPhase={handlePreviousPhase}

        // Configurações de layout
        isMobile={isMobile}
        enableMobileTabs={true}
        gameAreaTitle="Autômato"

        // Sistema de fases
        unlockedPhases={unlockedPhases}
        completedPhases={completedPhases}
        getPhaseData={getPhaseData}
        gameConfig={gameConfig}        // Configurações do header
        showPhaseSelectorProp={true}
        showHomeButton={true}
        showBackButton={true}

        // Debug panel
        onShowDebugPanel={handleToggleDebugPanel}

        // Classe CSS específica
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
}

export default AutomatoGame;
