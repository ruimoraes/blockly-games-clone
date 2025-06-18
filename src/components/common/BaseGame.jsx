



import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import GameHeader from './GameHeader';
import GameInfo from './GameInfo';
import GameControls from './GameControls';
import PhaseSelector from './PhaseSelector';

/**
 * Componente base genérico para todos os jogos
 * Fornece layout consistente e funcionalidades comuns
 */
const BaseGame = ({
  // Configuração do jogo
  gameTitle,
  gameIcon = '🎮',
  gameDescription = '',
  
  // Dados da fase
  currentPhase,
  totalPhases,
  currentPhaseData = {},
    // Estados
  isExecuting = false,
  gameState = 'idle',
  generatedCode = '',
  
  // Conteúdo específico do jogo
  editorComponent,
  gameAreaComponent,
  additionalComponents = [],
  
  // Ações
  onRunCode,
  onResetGame,
  onPhaseChange,
  onNextPhase,
  onPreviousPhase,
  
  // Configurações de layout
  isMobile = false,
  enableMobileTabs = true,
  editorTitle = 'Editor de Blocos',
  gameAreaTitle = 'Área do Jogo',
  
  // Sistema de fases
  unlockedPhases = [],
  completedPhases = [],
  getPhaseData,
  gameConfig = {},
  
  // Controles customizados
  customControls = [],
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

  // Detectar se é mobile automaticamente se não especificado
  useEffect(() => {
    if (isMobile === undefined) {
      const checkIsMobile = () => {
        return window.innerWidth < 768;
      };

      const mediaQuery = window.matchMedia('(max-width: 767px)');
      const handleMediaChange = () => {
        // Atualizar estado mobile se necessário
      };

      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, [isMobile]);

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
    <div className={`base-game ${className}`} style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Header simplificado */}
      <GameHeader
        onGoHome={handleGoHome}
        onGoBack={handleGoBack}
        showHomeButton={showHomeButton}
        showBackButton={showBackButton}
      >
        {customHeaderContent}
      </GameHeader>      {/* Informações do jogo */}
      <GameInfo
        gameTitle={gameTitle}
        gameIcon={gameIcon}
        currentPhase={currentPhase}
        totalPhases={totalPhases}
        phaseName={currentPhaseData.name}
        isExecuting={isExecuting}
        onShowPhaseSelector={() => setShowPhaseSelector(true)}
        showPhaseSelector={showPhaseSelectorProp}
      />      {/* Conteúdo principal */}
      <Container fluid className="py-4">
        {/* Layout Principal */}
        {isMobile && enableMobileTabs ? (
          // Layout Mobile com Abas
          <div className="mobile-layout">
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'editor'}
                  onClick={() => setActiveTab('editor')}
                >
                  🧩 {editorTitle}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === 'game'}
                  onClick={() => setActiveTab('game')}
                >
                  🎮 {gameAreaTitle}
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <div className="tab-content">
              {activeTab === 'editor' && editorComponent}
              {activeTab === 'game' && gameAreaComponent}
            </div>
          </div>
        ) : (          // Layout Desktop (duas colunas)
          <Row className="g-4">
            <Col key="editor-col" lg={6} className="order-2 order-lg-1">
              {editorComponent}
            </Col>
            <Col key="game-area-col" lg={6} className="order-1 order-lg-2">
              {gameAreaComponent}
            </Col>
          </Row>
        )}

        {/* Componentes adicionais */}
        {additionalComponents.length > 0 && (
          <Row className="mt-4">
            {additionalComponents.map((component, index) => (
              <Col key={index} {...(component.colProps || { xs: 12 })}>
                {component.content}
              </Col>
            ))}
          </Row>
        )}

        {/* Controles do jogo */}
        <Row className="mt-4">
          <Col>            <GameControls
              onRunCode={onRunCode}
              onResetGame={onResetGame}
              isExecuting={isExecuting}
              hasCode={Boolean(generatedCode?.trim())}
              customButtons={customControls}
            />
          </Col>
        </Row>

        {/* Navegação entre fases */}
        <Row className="mt-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-outline-secondary"
                onClick={onPreviousPhase}
                disabled={currentPhase === 1 || isExecuting}
              >
                ← Fase Anterior
              </button>

              <div className="text-center">
                <small className="text-muted">
                  Fase {currentPhase} de {totalPhases}
                  {gameState === 'success' && (
                    <span className="text-success ms-2">✓ Completa</span>
                  )}
                </small>
              </div>

              <button
                className="btn btn-outline-primary"
                onClick={onNextPhase}
                disabled={currentPhase === totalPhases || isExecuting || gameState !== 'success'}
              >
                Próxima Fase →
              </button>
            </div>
          </Col>
        </Row>

        {/* Conteúdo adicional */}
        {children}
      </Container>

      {/* Seletor de Fases */}
      {showPhaseSelector && (
        <PhaseSelector
          currentPhase={currentPhase}
          unlockedPhases={unlockedPhases}
          completedPhases={completedPhases}
          totalPhases={totalPhases}
          onPhaseSelect={handlePhaseSelect}
          getPhaseData={getPhaseData}
          gameConfig={gameConfig}
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
  generatedCode: PropTypes.string,
  
  // Conteúdo específico
  editorComponent: PropTypes.node.isRequired,
  gameAreaComponent: PropTypes.node.isRequired,
  additionalComponents: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.node.isRequired,
    colProps: PropTypes.object
  })),
  
  // Ações
  onRunCode: PropTypes.func.isRequired,
  onResetGame: PropTypes.func.isRequired,
  onPhaseChange: PropTypes.func,
  onNextPhase: PropTypes.func,
  onPreviousPhase: PropTypes.func,
  
  // Layout
  isMobile: PropTypes.bool,
  enableMobileTabs: PropTypes.bool,
  editorTitle: PropTypes.string,
  gameAreaTitle: PropTypes.string,
  
  // Sistema de fases
  unlockedPhases: PropTypes.array,
  completedPhases: PropTypes.array,
  getPhaseData: PropTypes.func,
  gameConfig: PropTypes.object,
  
  // Customização
  customControls: PropTypes.array,
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
