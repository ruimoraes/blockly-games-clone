import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GameHeader from './GameHeader';
import GameInfo from './GameInfo';
import PhaseSelector from './PhaseSelector';

/**
 * Componente base genérico para todos os jogos
 * Fornece layout consistente e funcionalidades comuns
 */
const BaseGame = ({
  // Configuração do jogo
  gameTitle,
  gameIcon = '🎮',

  // Dados da fase
  currentPhase,
  totalPhases,
  currentPhaseData = {},  // Estados
  isExecuting = false,
  // gameState = 'idle', // TODO: implementar uso do gameState

  // Conteúdo específico do jogo
  editorComponent,
  gameAreaComponent,
  additionalComponents = [],
  // Ações para navegação de fases
  onPhaseChange,
  onNextPhase, // eslint-disable-line no-unused-vars
  onPreviousPhase, // eslint-disable-line no-unused-vars
  // Configurações de layout
  isMobile = false,
  enableMobileTabs = true,

  // Sistema de fases
  unlockedPhases = [],
  completedPhases = [],
  getPhaseData,
  gameConfig = {},

  // Controles customizados
  customHeaderContent,

  // Callbacks de navegação
  onGoHome,
  onGoBack,

  // Configurações do header
  showPhaseSelectorProp = true,  showHomeButton = true,
  showBackButton = true,

  // Props adicionais
  children
}) => {
  const [showPhaseSelector, setShowPhaseSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  
  // Handlers padrão
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  const handlePhaseSelect = (phase) => {
    if (onPhaseChange) {
      onPhaseChange(phase);
    }
    setShowPhaseSelector(false);
  };
    return (
    <div>      
      {/* Header fixo */}
      <GameHeader
        onGoHome={handleGoHome}
        onGoBack={handleGoBack}
        showHomeButton={showHomeButton}
        showBackButton={showBackButton}
        gameTitle={gameTitle}
        gameIcon={gameIcon}
        currentPhase={currentPhase}
        totalPhases={totalPhases}
        onShowPhaseSelector={() => setShowPhaseSelector(true)}
        showPhaseSelector={showPhaseSelectorProp}
        isExecuting={isExecuting}
      >
        {customHeaderContent}
      </GameHeader>
        
      {/* Área de conteúdo principal */}
      <div>
        <GameInfo
          phaseData={currentPhaseData}
          isExecuting={isExecuting}
        />
            <div>
          {/* Layout do jogo */}
          <div>
            {isMobile && enableMobileTabs ? (
              // Layout Mobile com Abas
              <div>
                <nav>
                  <div>
                    <a
                      onClick={() => setActiveTab('editor')}
                    >
                      🧩 Blocos
                    </a>
                  </div>
                  <div>
                    <a
                      onClick={() => setActiveTab('game')}
                    >
                      🎮 Game
                    </a>
                  </div>
                </nav>
                
                <div>
                  <div style={{ display: activeTab === 'editor' ? 'block' : 'none' }}>
                    {editorComponent}
                  </div>
                  <div style={{ display: activeTab === 'game' ? 'block' : 'none' }}>
                    {gameAreaComponent}
                  </div>
                </div>
              </div>
            ) : (
              // Layout Desktop (duas colunas)
              <div>
                <div>
                  <div>
                    {editorComponent}
                  </div>
                  <div>
                    {gameAreaComponent}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Componentes adicionais */}
          {additionalComponents.length > 0 && (
            <div>
              {additionalComponents.map((component, index) => (
                <div key={index} {...(component.colProps || { xs: 12 })}>
                  {component.content}
                </div>
              ))}
            </div>
          )}
          
          {/* Conteúdo adicional */}
          {children}
        </div>
      </div>

      {/* Seletor de fases (modal) */}
      {showPhaseSelector && (
        <PhaseSelector 
          gameConfig={gameConfig}
          currentPhase={currentPhase}
          completedPhases={completedPhases}
          unlockedPhases={unlockedPhases}
          totalPhases={totalPhases}
          getPhaseData={getPhaseData}
          onPhaseSelect={handlePhaseSelect}
          isVisible={showPhaseSelector}
          onClose={() => setShowPhaseSelector(false)}
        />
      )}
    </div>
  );
};

BaseGame.propTypes = {
  // Configuração do jogo
  gameTitle: PropTypes.string.isRequired,
  gameIcon: PropTypes.string,
  gameDescription: PropTypes.string,

  // Dados da fase
  currentPhase: PropTypes.number.isRequired,
  totalPhases: PropTypes.number.isRequired,
  currentPhaseData: PropTypes.object,

  // Estados
  isExecuting: PropTypes.bool,
  gameState: PropTypes.oneOf(['idle', 'running', 'success', 'failure']),

  // Conteúdo específico
  editorComponent: PropTypes.node.isRequired,
  gameAreaComponent: PropTypes.node.isRequired,
  additionalComponents: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.node.isRequired,
    colProps: PropTypes.object
  })),
  // Ações de fase
  onPhaseChange: PropTypes.func,
  onNextPhase: PropTypes.func,
  onPreviousPhase: PropTypes.func,
  // Layout
  isMobile: PropTypes.bool,
  enableMobileTabs: PropTypes.bool,

  // Sistema de fases
  unlockedPhases: PropTypes.array,
  completedPhases: PropTypes.array,
  getPhaseData: PropTypes.func,
  gameConfig: PropTypes.object,
  // Customização
  customHeaderContent: PropTypes.node,
  onGoHome: PropTypes.func,
  onGoBack: PropTypes.func,

  // Configurações do header
  showPhaseSelectorProp: PropTypes.bool,
  showHomeButton: PropTypes.bool,
  showBackButton: PropTypes.bool,

  // Props adicionais
  className: PropTypes.string,
  children: PropTypes.node
};

export default BaseGame;
