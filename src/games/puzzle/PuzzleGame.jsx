import React from 'react';
import { usePuzzleGame } from './hooks/usePuzzleGame';
import BlocklyEditor from './components/BlocklyEditor';
import PuzzleDisplay from './components/PuzzleDisplay';
import PuzzleToolbar from './components/PuzzleToolbar';
import PhaseSelector from '../../components/common/PhaseSelector';
import './PuzzleGame.css';

// Importar e registrar os blocos personalizados
import './blocks/puzzleBlocks';

const PuzzleGame = () => {
  const {
    // Estado do jogo
    gameState,
    currentPhase,
    gameConfig,
    
    // Estado do puzzle
    animalStates,
    isComplete,
    correctCount,
    totalAnimals,
    
    // Dicas
    showHint,
    currentHint,
    
    // Ações
    checkSolution,
    resetPuzzle,
    toggleHint,
    handleWorkspaceChange,
    goToNextPhase,
    goToPreviousPhase,
    
    // Dados da fase atual
    currentPhaseData
  } = usePuzzleGame();

  if (!currentPhaseData) {
    return (
      <div className="puzzle-loading">
        <p>Carregando jogo Puzzle...</p>
      </div>
    );
  }

  return (
    <div className="puzzle-game">
      {/* Header com informações da fase */}
      <header className="puzzle-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="back-button"
              onClick={() => window.history.back()}
              title="Voltar"
            >
              ← Voltar
            </button>
            <div className="game-title">
              <h1>🧩 Quebra-Cabeça</h1>
              <p className="subtitle">Aprenda variáveis e propriedades com Blockly</p>
            </div>
          </div>
          
          <div className="header-right">
            <button className="home-button" onClick={() => window.location.href = '/'}>
              🏠 Início
            </button>
            <PhaseSelector
              currentPhase={currentPhase}
              phases={gameConfig.phases}
              gameState={gameState}
              onPhaseSelect={(phase) => {
                // Implementar navegação entre fases se necessário
                console.log('Fase selecionada:', phase);
              }}
              gameConfig={gameConfig}
            />
            <div className="phase-indicator">
              Fase {currentPhase}/5
            </div>
          </div>
        </div>
      </header>

      {/* Informações da fase atual */}
      <div className="phase-info">
        <div className="phase-header">
          <h2>{currentPhaseData.title}</h2>
          <div className="phase-badges">
            <span className={`difficulty-badge ${currentPhaseData.difficulty.toLowerCase()}`}>
              {currentPhaseData.difficulty}
            </span>
            {currentPhaseData.maxBlocks && (
              <span className="blocks-badge">
                Máx {currentPhaseData.maxBlocks} blocos
              </span>
            )}
          </div>
        </div>
        
        <div className="phase-instructions">
          <h3>📋 Instruções da Fase</h3>
          <p>{currentPhaseData.instructions}</p>
        </div>

        {showHint && (
          <div className="hint-box">
            <h3>💡 Dica</h3>
            <p>{currentHint}</p>
          </div>
        )}
      </div>

      {/* Toolbar com controles */}
      <PuzzleToolbar
        onCheckSolution={checkSolution}
        onResetPuzzle={resetPuzzle}
        onShowHint={toggleHint}
        correctCount={correctCount}
        totalAnimals={totalAnimals}
        isComplete={isComplete}
      />

      {/* Display dos animais */}
      <PuzzleDisplay animalStates={animalStates} />

      {/* Editor Blockly */}
      <div className="blockly-section">
        <h3>🔧 Editor de Blocos</h3>
        <p className="editor-instructions">
          Arraste blocos das categorias à esquerda para configurar os animais. 
          Conecte os blocos de propriedades aos blocos de animais.
        </p>
        <BlocklyEditor
          onWorkspaceChange={handleWorkspaceChange}
          initialBlocks={null}
        />
      </div>

      {/* Controles de navegação */}
      <div className="navigation-controls">
        <button 
          className="nav-button prev"
          onClick={goToPreviousPhase}
          disabled={currentPhase === 1}
        >
          ← Fase Anterior
        </button>
        
        <div className="phase-progress">
          <span>Fase {currentPhase} de {gameConfig.phases.length}</span>
          {isComplete && (
            <span className="complete-indicator">✓ Completa</span>
          )}
        </div>
        
        <button 
          className="nav-button next"
          onClick={goToNextPhase}
          disabled={!isComplete || currentPhase === gameConfig.phases.length}
        >
          Próxima Fase →
        </button>
      </div>
    </div>
  );
};

export default PuzzleGame;

