import React, { useState, useEffect } from 'react';
import { useMazeGame } from './hooks/useMazeGame';
import PhaseSelector from '../../components/common/PhaseSelector';
import BlocklyEditor from './components/BlocklyEditor';
import GameHeader from './components/GameHeader';
import GameControls from './components/GameControls';
import PhaseNavigation from './components/PhaseNavigation';
import GameArea from './components/GameArea';
import './MazeGame.css';

function MazeGame() {
  // Estado local
  const [activeTab, setActiveTab] = useState('workspace');
  const [isMobile, setIsMobile] = useState(false);
  const [showPhaseSelector, setShowPhaseSelector] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Custom hooks
  const {
    gameState,
    playerPosition,
    currentPhase,
    currentPhaseData,
    totalPhases,
    mazeData,
    isExecuting,
    unlockedPhases,
    completedPhases,
    gameConfig,
    executeCode,
    resetGame,
    handlePhaseChange,
    handleNextPhase,
    handlePreviousPhase,
    isPhaseUnlocked,
    isPhaseCompleted,
    getPhaseData
  } = useMazeGame();

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className="container-fluid maze-game">
      <GameHeader
        currentPhase={currentPhase}
        totalPhases={totalPhases}
        phaseName={currentPhaseData.name}
        onShowPhaseSelector={() => setShowPhaseSelector(true)}
        isExecuting={isExecuting}
      />

      <main className="container">
        {isMobile ? (
          // Layout Mobile com Abas
          <div className="mobile-layout">
            <div className="nav nav-tabs mb-3" role="tablist">
              <button
                className={`nav-link ${activeTab === 'workspace' ? 'active' : ''}`}
                onClick={() => setActiveTab('workspace')}
                type="button"
              >
                🧩 Editor de Blocos
              </button>
              <button
                className={`nav-link ${activeTab === 'game' ? 'active' : ''}`}
                onClick={() => setActiveTab('game')}
                type="button"
              >
                🎮 Labirinto
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'workspace' && (
                <BlocklyEditor
                  onCodeChange={setGeneratedCode}
                  isExecuting={isExecuting}
                  isBlocklyLoaded={true}
                />
              )}

              {activeTab === 'game' && (
                <GameArea
                  gameState={gameState}
                  playerPosition={playerPosition}
                  mazeData={mazeData}
                  phaseNumber={currentPhase}
                />
              )}
            </div>
          </div>
        ) : (
          // Layout Desktop (duas colunas)
          <div className="row g-3">
            <div className="col-12 col-lg-6 order-2 order-lg-1">
              <BlocklyEditor
                onCodeChange={setGeneratedCode}
                isExecuting={isExecuting}
                isBlocklyLoaded={true}
              />
            </div>

            <div className="col-12 col-lg-6 order-1 order-lg-2">
              <GameArea
                gameState={gameState}
                playerPosition={playerPosition}
                mazeData={mazeData}
                phaseNumber={currentPhase}
              />
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="row mt-3 mt-md-4">
          <div className="col-12">
            <GameControls
              onRunCode={() => executeCode(generatedCode || '')}
              onResetGame={resetGame}
              isExecuting={isExecuting}
              isBlocklyLoaded={true}
              hasCode={Boolean(generatedCode?.trim())}
            />
          </div>
        </div>

        {/* Navegação entre Fases */}
        <div className="row mt-3">
          <div className="col-12">
            <PhaseNavigation
              onPrevious={handlePreviousPhase}
              onNext={handleNextPhase}
              currentPhase={currentPhase}
              phaseData={currentPhaseData}
              isExecuting={isExecuting}
              canAdvance={isPhaseUnlocked(currentPhase + 1)}
              totalPhases={totalPhases}
            />
          </div>
        </div>

        {/* Debug: Código Gerado */}
        {generatedCode?.trim() && (
          <div className="row mt-4">
            <div className="col-12">
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
            </div>
          </div>
        )}
      </main>

      {/* Seletor de Fases */}
      <PhaseSelector
        currentPhase={currentPhase}
        unlockedPhases={unlockedPhases}
        completedPhases={completedPhases}
        totalPhases={totalPhases}
        onPhaseSelect={(phase) => {
          handlePhaseChange(phase);
          setShowPhaseSelector(false);
        }}
        getPhaseData={getPhaseData}
        gameConfig={gameConfig}
        isVisible={showPhaseSelector}
        onClose={() => setShowPhaseSelector(false)}
      />
    </div>
  );
}

export default MazeGame;

