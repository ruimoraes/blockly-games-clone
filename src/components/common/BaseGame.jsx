import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameHeader from './GameHeader';
import GameInfo from './GameInfo';
import GameFooter from './GameFooter';
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
  // Configurações do header
  showPhaseSelectorProp = true,
  showHomeButton = true,

  // Função para debug panel
  onShowDebugPanel,

  // Props adicionais
  children
}) => {
  const [showPhaseSelector, setShowPhaseSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  // Escutar evento para mudar para aba do game em dispositivos móveis
  useEffect(() => {
    const handleSwitchToGame = () => {
      if (isMobile && enableMobileTabs) {
        setActiveTab('game');
      }
    };

    window.addEventListener('switchToGameTab', handleSwitchToGame);
    return () => {
      window.removeEventListener('switchToGameTab', handleSwitchToGame);
    };
  }, [isMobile, enableMobileTabs]);

  // Handlers padrão
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const handlePhaseSelect = (phase) => {
    if (onPhaseChange) {
      onPhaseChange(phase);
    }
    setShowPhaseSelector(false);
  }; return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col overflow-hidden">{/* Header fixo */}
      <GameHeader
        onGoHome={handleGoHome}
        showHomeButton={showHomeButton}
        gameTitle={gameTitle}
        gameIcon={gameIcon}
      >
        {customHeaderContent}
      </GameHeader>{/* Área de conteúdo principal - ocupa o restante da tela */}
      <div className="flex-1 flex flex-col overflow-hidden">        {/* GameInfo compacto */}
        <div className="flex-shrink-0 px-1 py-1 lg:px-3 lg:py-3">
          <GameInfo
            phaseData={currentPhaseData}
            currentPhase={currentPhase}
            isExecuting={isExecuting}
          />
        </div>{/* Área do jogo - ocupa todo espaço restante */}
        <div className="flex-1 px-1 pb-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Layout do jogo */}
            <div className="flex-1 overflow-hidden">
              {isMobile && enableMobileTabs ?
                (              // Layout Mobile com Abas Integradas
                  <div className="glass-panel h-full flex flex-col overflow-hidden">
                    {/* Abas integradas no topo do painel */}
                    <nav className="flex space-x-2 p-1 rounded-lg flex-shrink-0 m-4 mb-0">                  
                    <div className="flex-1">
                      <a
                        onClick={() => {
                          setActiveTab('editor');
                          // Disparar evento para redimensionar BlocklyEditor quando aba é ativada
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('tabChanged', { detail: { activeTab: 'editor' } }));
                          }, 50);
                        }}
                        className={`block w-full text-center py-3 px-4 rounded-full font-medium cursor-pointer ${activeTab === 'editor'
                            ? 'tab-active'
                            : 'tab-inactive'
                          }`}
                      >
                        🧩 Blocos
                      </a>
                    </div>
                      <div className="flex-1">
                        <a
                          onClick={() => {
                            setActiveTab('game');
                            window.dispatchEvent(new CustomEvent('tabChanged', { detail: { activeTab: 'game' } }));
                          }}
                          className={`block w-full text-center py-3 px-4 rounded-full font-medium cursor-pointer ${activeTab === 'game'
                              ? 'tab-active'
                              : 'tab-inactive'
                            }`}
                        >
                          🎮 Game
                        </a>
                      </div>
                    </nav>                {/* Conteúdo das abas */}
                    <div className="flex-1 p-2 pt-1 overflow-hidden">
                      <div className={`h-full ${activeTab === 'editor' ? 'block' : 'hidden'}`}>
                        {editorComponent}
                      </div>
                      <div className={`h-full ${activeTab === 'game' ? 'block' : 'hidden'}`}>
                        {gameAreaComponent}
                      </div>
                    </div>
                  </div>) : (
                  // Layout Desktop (duas colunas)
                  <div className="h-full grid lg:grid-cols-2 gap-6 overflow-hidden">
                    <div className="flex flex-col space-y-6 overflow-hidden">
                      <div className="glass-panel flex-1 p-4 overflow-hidden rounded-2xl">
                        {editorComponent}

                      </div>
                    </div>
                    <div className="flex flex-col space-y-6 overflow-hidden">
                      <div className="glass-panel flex-1 p-4 overflow-hidden rounded-2xl">
                        {gameAreaComponent}
                      </div>
                    </div>
                  </div>
                )}

              {/* Componentes adicionais */}
              {additionalComponents.length > 0 && (
                <div className="flex-shrink-0 space-y-4 mt-4">
                  {additionalComponents.map((component, index) => (
                    <div key={index} {...(component.colProps || { xs: 12 })}>
                      {component.content}
                    </div>
                  ))}
                </div>)}
              {/* Conteúdo adicional */}
              {children}
            </div>
          </div>
        </div>      {/* Footer experimental com informações de fase */}
        <GameFooter
          currentPhase={currentPhase}
          totalPhases={totalPhases}
          onShowPhaseSelector={() => setShowPhaseSelector(true)}
          showPhaseSelector={showPhaseSelectorProp}
          isExecuting={isExecuting}
          onShowHelp={() => alert('Funcionalidade de ajuda em desenvolvimento')}
          onShowDebugPanel={onShowDebugPanel}
        />
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

  // Ações de controle do jogo
  onRunCode: PropTypes.func,
  onResetGame: PropTypes.func,

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

  // Configurações do header
  showPhaseSelectorProp: PropTypes.bool,
  showHomeButton: PropTypes.bool,
  showBackButton: PropTypes.bool,

  // Props adicionais
  className: PropTypes.string,
  children: PropTypes.node
};

export default BaseGame;
