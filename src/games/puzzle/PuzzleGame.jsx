import React, { useState, useEffect } from 'react';
import BaseGame from '../../components/common/BaseGame';
import BlocklyEditor from '../../components/common/BlocklyEditor';
import { usePuzzleGame } from './hooks/usePuzzleGame';
import PuzzleDisplay from './components/PuzzleDisplay';
import PuzzleToolbar from './components/PuzzleToolbar';
import { PUZZLE_TOOLBOX } from './blocks/puzzleBlocks';
import './PuzzleGame.css';

// Importar e registrar os blocos personalizados
import './blocks/puzzleBlocks';

function PuzzleGame() {
  // Estado local para mobile
  const [isMobile, setIsMobile] = useState(false);

  // Hook do jogo com base genérica
  const {
    // Estados básicos
    gameState,
    isExecuting,
    
    // Estados específicos do puzzle
    animalStates,
    isComplete,
    correctCount,
    totalAnimals,
    showHint,
    currentHint,
    
    // Dados da fase (vem da base genérica)
    currentPhase,
    currentPhaseData,
    totalPhases,
    unlockedPhases,
    completedPhases,
    gameConfig,
    
    // Ações específicas do puzzle
    checkSolution,
    resetPuzzle,
    toggleHint,
    handleWorkspaceChange,
    executeCode,
    
    // Ações de fase (vem da base genérica)
    handlePhaseChange,
    handleNextPhase,
    handlePreviousPhase,
    getPhaseData
  } = usePuzzleGame();

  // Detectar mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Componente do editor Blockly
  const editorComponent = (
    <div className="puzzle-editor-section">
      <div className="editor-instructions mb-3">
        <h6>🔧 Editor de Blocos</h6>
        <p className="text-muted small">
          Arraste blocos das categorias à esquerda para configurar os animais. 
          Conecte os blocos de propriedades aos blocos de animais.
        </p>
      </div>
      
      <BlocklyEditor
        toolbox={PUZZLE_TOOLBOX}
        onWorkspaceChange={handleWorkspaceChange}
        initialBlocks={null}
        title="Editor de Blocos do Puzzle"
      />
    </div>
  );

  // Componente da área do jogo
  const gameAreaComponent = (
    <GameArea
      gameState={gameState}
      className="puzzle-game-area"
      onRunCode={checkSolution}
      onResetGame={resetPuzzle}
      isExecuting={isExecuting}
    >
      <PuzzleDisplay animalStates={animalStates} />
    </GameArea>
  );

  // Componentes adicionais (toolbar e dicas)
  const additionalComponents = [];
  
  // Adicionar toolbar
  additionalComponents.push({
    content: (
      <PuzzleToolbar
        onCheckSolution={checkSolution}
        onResetPuzzle={resetPuzzle}
        onShowHint={toggleHint}
        correctCount={correctCount}
        totalAnimals={totalAnimals}
        isComplete={isComplete}
      />
    ),
    colProps: { xs: 12 }
  });

  // Adicionar dica se estiver visível
  if (showHint && currentHint) {
    additionalComponents.push({
      content: (
        <div className="card border-warning">
          <div className="card-header bg-warning bg-opacity-10">
            <h6 className="mb-0">💡 Dica</h6>
          </div>
          <div className="card-body">
            <p className="mb-0">{currentHint}</p>
          </div>
        </div>
      ),
      colProps: { xs: 12 }
    });
  }

  // Controles customizados específicos do puzzle
  const customControls = [
    {
      text: 'Verificar Solução',
      onClick: checkSolution,
      variant: 'success',
      disabled: false,
      tooltip: 'Verificar se os animais estão configurados corretamente'
    },
    {
      text: showHint ? 'Ocultar Dica' : 'Mostrar Dica',
      onClick: toggleHint,
      variant: 'info',
      disabled: false,
      tooltip: 'Mostrar/ocultar dica para a fase atual'
    }
  ];

  // Conteúdo customizado do header
  const customHeaderContent = (
    <div className="d-flex align-items-center gap-2">
      <span className="badge bg-success">
        {correctCount}/{totalAnimals} corretos
      </span>
      {isComplete && (
        <span className="badge bg-warning">
          ✓ Completo
        </span>
      )}
    </div>
  );

  return (
    <BaseGame
      // Configuração do jogo
      gameTitle="Quebra-Cabeça"
      gameIcon="🧩"
      gameDescription="Aprenda variáveis e propriedades com Blockly"
      
      // Dados da fase
      currentPhase={currentPhase}
      totalPhases={totalPhases}
      currentPhaseData={currentPhaseData}
      
      // Estados
      isExecuting={isExecuting}
      gameState={gameState}
      generatedCode="" // Puzzle não usa código gerado visível
      
      // Conteúdo específico do jogo
      editorComponent={editorComponent}
      gameAreaComponent={gameAreaComponent}
      additionalComponents={additionalComponents}
      
      // Ações
      onRunCode={() => executeCode('')} // Executar verificação
      onResetGame={resetPuzzle}
      onPhaseChange={handlePhaseChange}
      onNextPhase={handleNextPhase}
      onPreviousPhase={handlePreviousPhase}
      
      // Configurações de layout
      isMobile={isMobile}
      enableMobileTabs={true}
      editorTitle="Editor de Blocos"
      gameAreaTitle="Animais"
      
      // Sistema de fases
      unlockedPhases={unlockedPhases}
      completedPhases={completedPhases}
      getPhaseData={getPhaseData}
      gameConfig={gameConfig}
      
      // Customização
      customControls={customControls}
      customHeaderContent={customHeaderContent}
      
      // Configurações do header
      showPhaseSelectorProp={true}
      showHomeButton={true}
      showBackButton={true}
      
      // Classe CSS específica
      className="puzzle-game-refactored"
    />
  );
}

export default PuzzleGame;

