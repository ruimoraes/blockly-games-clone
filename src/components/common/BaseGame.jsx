import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import GameHeader from './GameHeader';
import GameInfo from './GameInfo';
import PhaseSelector from './PhaseSelector';
import './BaseGame.css';

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
  showPhaseSelectorProp = true,
  showHomeButton = true,
  showBackButton = true,

  // Props adicionais
  className = '',
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
    <div className={`base-game ${className}`}>      {/* Header fixo */}
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
      <div className="main-content">
        <GameInfo
          phaseData={currentPhaseData}
          isExecuting={isExecuting}
        />
          <Container fluid className="h-100 d-flex flex-column">
          {/* Layout do jogo */}
          <div className="game-layout flex-grow-1 d-flex flex-column">
            {isMobile && enableMobileTabs ? (
              // Layout Mobile com Abas
              <div className="mobile-layout flex-grow-1 d-flex flex-column">
                <Nav variant="tabs" className="mb-2 flex-shrink-0">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'editor'}
                      onClick={() => setActiveTab('editor')}
                    >
                      🧩 Blocos
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'game'}
                      onClick={() => setActiveTab('game')}
                    >
                      🎮 Game
                    </Nav.Link>
                  </Nav.Item>
                </Nav>                <div className="tab-content flex-grow-1">
                  <div style={{ display: activeTab === 'editor' ? 'block' : 'none' }} className="h-100">
                    {editorComponent}
                  </div>
                  <div style={{ display: activeTab === 'game' ? 'block' : 'none' }} className="h-100">
                    {gameAreaComponent}
                  </div>
                </div>
              </div>
            ) : (
              // Layout Desktop (duas colunas)
              <div className="desktop-layout flex-grow-1">                <Row className="h-100 g-2">
                  <Col key="editor-col" lg={6} className="order-2 order-lg-1 d-flex flex-column">
                    {editorComponent}
                  </Col>
                  <Col key="game-area-col" lg={6} className="order-1 order-lg-2 d-flex flex-column">
                    {gameAreaComponent}
                  </Col>
                </Row>
              </div>
            )}
          </div>

          {/* Componentes adicionais */}
          {additionalComponents.length > 0 && (
            <Row className="mb-2">
              {additionalComponents.map((component, index) => (
                <Col key={index} {...(component.colProps || { xs: 12 })}>
                  {component.content}
                </Col>
              ))}
            </Row>
          )}
          
          {/* Conteúdo adicional */}
          {children}        </Container>
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
