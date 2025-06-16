import React from 'react';
import { usePuzzleGame } from './hooks/usePuzzleGame';
import BlocklyEditor from './components/BlocklyEditor';
import PuzzleDisplay from './components/PuzzleDisplay';
import PuzzleToolbar from './components/PuzzleToolbar';
import PhaseSelector from '../../components/common/PhaseSelector';

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

      <style>{`
        .puzzle-game {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        
        .puzzle-header {
          background: white;
          border-radius: 12px;
          padding: 16px 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .back-button, .home-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        
        .back-button:hover, .home-button:hover {
          background: #2980b9;
        }
        
        .game-title h1 {
          margin: 0;
          font-size: 1.8rem;
          color: #2c3e50;
        }
        
        .subtitle {
          margin: 4px 0 0 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .phase-indicator {
          background: #e74c3c;
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 0.9rem;
          font-weight: bold;
        }
        
        .phase-info {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .phase-header h2 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.5rem;
        }
        
        .phase-badges {
          display: flex;
          gap: 8px;
        }
        
        .difficulty-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
          color: white;
        }
        
        .difficulty-badge.fácil {
          background: #27ae60;
        }
        
        .difficulty-badge.médio {
          background: #f39c12;
        }
        
        .difficulty-badge.difícil {
          background: #e74c3c;
        }
        
        .blocks-badge {
          background: #9b59b6;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .phase-instructions {
          margin-bottom: 16px;
        }
        
        .phase-instructions h3 {
          margin: 0 0 8px 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }
        
        .phase-instructions p {
          margin: 0;
          color: #5a6c7d;
          line-height: 1.5;
        }
        
        .hint-box {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }
        
        .hint-box h3 {
          margin: 0 0 8px 0;
          color: #856404;
          font-size: 1rem;
        }
        
        .hint-box p {
          margin: 0;
          color: #856404;
          line-height: 1.5;
        }
        
        .blockly-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .blockly-section h3 {
          margin: 0 0 8px 0;
          color: #2c3e50;
          font-size: 1.3rem;
        }
        
        .editor-instructions {
          margin: 0 0 16px 0;
          color: #7f8c8d;
          line-height: 1.5;
        }
        
        .navigation-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border-radius: 12px;
          padding: 16px 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .nav-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .nav-button:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-1px);
        }
        
        .nav-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
          transform: none;
        }
        
        .phase-progress {
          text-align: center;
          color: #2c3e50;
          font-weight: 500;
        }
        
        .complete-indicator {
          display: block;
          color: #27ae60;
          font-size: 0.9rem;
          margin-top: 4px;
        }
        
        .puzzle-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
          color: #7f8c8d;
        }
        
        @media (max-width: 768px) {
          .puzzle-game {
            padding: 10px;
          }
          
          .header-content {
            flex-direction: column;
            align-items: stretch;
          }
          
          .header-left, .header-right {
            justify-content: center;
          }
          
          .phase-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }
          
          .navigation-controls {
            flex-direction: column;
            gap: 12px;
          }
          
          .nav-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PuzzleGame;

