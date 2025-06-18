import React from 'react';
import PropTypes from 'prop-types';
import { Button, Badge, Navbar, Container } from 'react-bootstrap';
import { Home, ArrowLeft, List, Clock, Trophy, User } from 'lucide-react';

/**
 * Header genérico para jogos
 * Fornece navegação, informações da fase e status
 */
const GameHeader = ({
  gameTitle,
  gameIcon = '🎮',
  currentPhase,
  totalPhases,
  phaseName = '',
  phaseDescription = '',
  isExecuting = false,
  onShowPhaseSelector,
  onGoHome,
  onGoBack,
  showPhaseSelector = true,
  showHomeButton = true,
  showBackButton = true,
  className = '',
  children
}) => {  return (
    <Navbar style={{ backgroundColor: 'var(--brand-primary)' }} variant="dark" className={`shadow-sm ${className}`}>
      <Container fluid>
        {/* Lado esquerdo - Título e informações */}
        <div className="d-flex align-items-center gap-3">
          {/* Botões de navegação */}
          <div className="d-flex gap-2">
            {showBackButton && (
              <Button
                variant="outline-light"
                size="sm"
                onClick={onGoBack}
                disabled={isExecuting}
                title="Voltar"
              >
                <ArrowLeft size={16} />
              </Button>
            )}
            
            {showHomeButton && (
              <Button
                variant="outline-light"
                size="sm"
                onClick={onGoHome}
                disabled={isExecuting}
                title="Ir para Home"
              >
                <Home size={16} />
              </Button>
            )}
          </div>

          {/* Título do jogo */}
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.5rem' }}>{gameIcon}</span>
            <div>
              <h5 className="mb-0 text-white">{gameTitle}</h5>
              {phaseDescription && (
                <small className="text-light opacity-75">{phaseDescription}</small>
              )}
            </div>
          </div>
        </div>

        {/* Centro - Informações da fase */}
        <div className="d-flex align-items-center gap-3">
          {/* Status de execução */}
          {isExecuting && (
            <Badge bg="warning" className="d-flex align-items-center gap-1">
              <Clock size={12} className="animate-spin" />
              Executando...
            </Badge>
          )}

          {/* Informações da fase */}
          <div className="text-center">
            <div className="text-white">
              <strong>Fase {currentPhase}/{totalPhases}</strong>
            </div>
            {phaseName && (
              <small className="text-light opacity-75">{phaseName}</small>
            )}
          </div>
        </div>

        {/* Lado direito - Controles */}
        <div className="d-flex align-items-center gap-2">
          {/* Conteúdo customizado */}
          {children}

          {/* Botão do seletor de fases */}
          {showPhaseSelector && (
            <Button
              variant="outline-light"
              size="sm"
              onClick={onShowPhaseSelector}
              disabled={isExecuting}
              title="Selecionar Fase"
            >
              <List size={16} className="me-1" />
              Fases
            </Button>
          )}

          {/* Indicadores de progresso */}
          <div className="d-flex align-items-center gap-1 ms-2">
            <Trophy size={14} className="text-warning" />
            <small className="text-light">
              {currentPhase - 1}/{totalPhases}
            </small>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

GameHeader.propTypes = {
  gameTitle: PropTypes.string.isRequired,
  gameIcon: PropTypes.string,
  currentPhase: PropTypes.number.isRequired,
  totalPhases: PropTypes.number.isRequired,
  phaseName: PropTypes.string,
  phaseDescription: PropTypes.string,
  isExecuting: PropTypes.bool,
  onShowPhaseSelector: PropTypes.func,
  onGoHome: PropTypes.func,
  onGoBack: PropTypes.func,
  showPhaseSelector: PropTypes.bool,
  showHomeButton: PropTypes.bool,
  showBackButton: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default GameHeader;
