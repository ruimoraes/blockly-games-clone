import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  }, []);  // Componentes específicos do jogo
  const editorComponent = (
    <BlocklyEditor
      toolbox={toolboxConfig}
      onCodeChange={handleCodeChange}
      isExecuting={isExecuting}
      title="Editor de Blocos - Labirinto"
    />
  );
  const gameAreaComponent = (
    <GameArea
      gameState={gameState}
      title="Labirinto"
      phaseNumber={currentPhase}
      className="maze-game-area"
      footerInfo={
        <>
          <span className="d-block d-sm-inline">Posição: ({playerPosition.x}, {playerPosition.y})</span>
          <span className="d-none d-sm-inline"> | </span>
          <span className="d-block d-sm-inline">Direção: {['Norte', 'Leste', 'Sul', 'Oeste'][playerPosition.direction]}</span>
        </>
      }
    >
      <MazeRenderer
        mazeData={mazeData}
        playerPosition={playerPosition}
        gameState={gameState}
      />
    </GameArea>  );

  // Componentes adicionais - removido código gerado para simplificar interface
  const additionalComponents = [];

  return (
    <BaseGame
      // Configuração do jogo
      gameTitle="Jogo do Labirinto"
      gameIcon="🧩"
      gameDescription="Aprenda programação visual guiando um personagem através de labirintos"
      
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
      onRunCode={() => executeCode(generatedCode || '')}
      onResetGame={resetGame}
      onPhaseChange={handlePhaseChange}
      onNextPhase={handleNextPhase}
      onPreviousPhase={handlePreviousPhase}
      
      // Configurações de layout
      isMobile={isMobile}
      enableMobileTabs={true}
      editorTitle="Editor de Blocos"
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
