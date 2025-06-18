import React, { useState, useEffect } from 'react';
import BaseGame from '../../components/common/BaseGame';
import { useMazeGame } from './hooks/useMazeGame';
import BlocklyEditor from './components/BlocklyEditor';
import GameArea from './components/GameArea';
import './MazeGame.css';

function MazeGame() {
  // Estado local para mobile e código gerado
  const [isMobile, setIsMobile] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

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

  // Componentes específicos do jogo
  const editorComponent = (
    <BlocklyEditor
      onCodeChange={setGeneratedCode}
      isExecuting={isExecuting}
      isBlocklyLoaded={true}
    />
  );

  const gameAreaComponent = (
    <GameArea
      gameState={gameState}
      playerPosition={playerPosition}
      mazeData={mazeData}
      phaseNumber={currentPhase}
    />
  );

  // Componentes adicionais (código gerado para debug)
  const additionalComponents = [];
  
  if (generatedCode?.trim()) {
    additionalComponents.push({
      content: (
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">📝 Código JavaScript Gerado</h6>
          </div>
          <div className="card-body">
            <pre className="bg-light p-3 rounded code-preview">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      ),
      colProps: { xs: 12 }
    });
  }

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
