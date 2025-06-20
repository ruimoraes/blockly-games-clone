import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import BaseGame from '../../components/common/BaseGame';
import BlocklyEditor from '../../components/common/BlocklyEditor';
import GameArea from '../../components/common/GameArea';
import { useMazeGame } from './hooks/useMazeGame';
import { defineBlocks, defineGenerators, getToolboxConfig } from './blocks/mazeBlocks';
import MazeRenderer from './components/MazeRenderer';
import './MazeGame.css';

// Garante que os blocos e geradores sejam definidos apenas uma vez
// quando o módulo do jogo for carregado.
defineBlocks();
defineGenerators();

function MazeGame() {
  // Estado local para mobile e código gerado
  const [isMobile, setIsMobile] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  // Referência para o editor Blockly
  const blocklyEditorRef = useRef(null);

  // Estabilizar a função de callback para evitar re-renderizações
  const handleCodeChange = useCallback((code) => {
    setGeneratedCode(code);
  }, []);

  // Memorizar a configuração da toolbox para evitar recriações
  const toolboxConfig = useMemo(() => {
    return getToolboxConfig();
  }, []);

  // Hook do jogo com base genérica
  const {
    // Estados básicos
    gameState,
    playerPosition,
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
    getPhaseData
  } = useMazeGame();

  // Detectar mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);  
  
  // Salvar explicitamente o workspace antes de executar código
  // para garantir que não seja perdido durante a execução
  const handleRunCode = useCallback(() => {
    // Tentar salvar o workspace antes de executar
    if (blocklyEditorRef.current) {
      blocklyEditorRef.current.saveWorkspace();
    }
    executeCode(generatedCode || '');
  }, [executeCode, generatedCode]);
  
  // Handler para garantir que o workspace seja preservado ao resetar o jogo
  const handleResetGame = useCallback(() => {
    // Certificar que o workspace está salvo antes de resetar
    if (blocklyEditorRef.current) {
      blocklyEditorRef.current.saveWorkspace();
    }
    // Reset apenas o estado do jogo, não o workspace
    resetGame();
    
    // Opcional: restaurar o workspace após o reset para garantir
    setTimeout(() => {
      if (blocklyEditorRef.current) {
        blocklyEditorRef.current.restoreWorkspace();
      }
    }, 50);
  }, [resetGame]);
    // Componentes específicos do jogo  
  const editorComponent = (
  <BlocklyEditor
    ref={blocklyEditorRef}
    toolbox={toolboxConfig}
    onCodeChange={handleCodeChange}
    isExecuting={isExecuting}
    title="Editor de Blocos - Labirinto"    // Props do GameControls
    onRunCode={handleRunCode}
    onResetGame={handleResetGame}
    gameState={gameState}
    runButtonText="Executar Blocos"
    resetButtonText="Reiniciar Labirinto"
  />
  );  const gameAreaComponent = (
    <GameArea
      gameState={gameState}
      className="maze-game-area"
    >
      <MazeRenderer
        mazeData={mazeData}
        playerPosition={playerPosition}
        gameState={gameState}
      />
    </GameArea>
  );

  // Componentes adicionais - removido código gerado para simplificar interface
  const additionalComponents = [];

  return (
    <BaseGame
      // Configuração do jogo
      gameTitle="Autômato"
      gameIcon="🤖"
      gameDescription="Aprenda programação visual guiando um robô através de labirintos"

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
      gameAreaTitle="Labirinto"

      // Sistema de fases
      unlockedPhases={unlockedPhases}
      completedPhases={completedPhases}
      getPhaseData={getPhaseData}
      gameConfig={gameConfig}

      // Configurações do header
      showPhaseSelectorProp={true}
      showHomeButton={true}
      showBackButton={true}

      // Classe CSS específica
      className="maze-game"
    />
  );
}

export default MazeGame;
