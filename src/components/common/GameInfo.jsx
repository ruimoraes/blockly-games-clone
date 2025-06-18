import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { List, Trophy, Clock } from 'lucide-react';

/**
 * Componente para exibir informações do jogo abaixo do header
 */
const GameInfo = ({
  gameTitle,
  gameIcon = '🎮',
  currentPhase,
  totalPhases,
  phaseName = '',
  phaseDescription = '',
  isExecuting = false,
  onShowPhaseSelector,
  showPhaseSelector = true,
  className = ''
}) => {
  return (
    <div className={`bg-light border-bottom ${className}`}>
      <Container fluid className="py-3">
        <Row className="align-items-center">
          {/* Título e ícone do jogo */}
          <Col xs={12} md={6} className="mb-2 mb-md-0">
            <div className="d-flex align-items-center gap-3">
              <span style={{ fontSize: '2rem' }}>{gameIcon}</span>
              <div>
                <h4 className="mb-1 text-brand-primary">{gameTitle}</h4>
                {phaseDescription && (
                  <p className="mb-0 text-muted small">{phaseDescription}</p>
                )}
              </div>
            </div>
          </Col>

          {/* Informações da fase e controles */}
          <Col xs={12} md={6}>
            <div className="d-flex align-items-center justify-content-md-end gap-3 flex-wrap">
              {/* Status de execução */}
              {isExecuting && (
                <Badge bg="warning" className="d-flex align-items-center gap-1">
                  <Clock size={14} className="animate-spin" />
                  Executando...
                </Badge>
              )}

              {/* Informações da fase */}
              <div className="text-center">
                <div className="fw-bold text-brand-primary">
                  Fase {currentPhase}/{totalPhases}
                </div>
                {phaseName && (
                  <small className="text-muted">{phaseName}</small>
                )}
              </div>

              {/* Botão do seletor de fases */}
              {showPhaseSelector && (
                <Button
                  variant="outline-brand-primary"
                  size="sm"
                  onClick={onShowPhaseSelector}
                  disabled={isExecuting}
                  className="d-flex align-items-center gap-1"
                >
                  <List size={16} />
                  <span className="d-none d-sm-inline">Fases</span>
                </Button>
              )}

              {/* Indicador de progresso */}
              <div className="d-flex align-items-center gap-1">
                <Trophy size={16} className="text-warning" />
                <small className="text-muted">
                  {currentPhase - 1}/{totalPhases} completas
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

GameInfo.propTypes = {
  gameTitle: PropTypes.string.isRequired,
  gameIcon: PropTypes.string,
  currentPhase: PropTypes.number.isRequired,
  totalPhases: PropTypes.number.isRequired,
  phaseName: PropTypes.string,
  phaseDescription: PropTypes.string,
  isExecuting: PropTypes.bool,
  onShowPhaseSelector: PropTypes.func,
  showPhaseSelector: PropTypes.bool,
  className: PropTypes.string
};

export default GameInfo;
