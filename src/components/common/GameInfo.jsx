import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { List, Trophy, Clock } from 'lucide-react';

/**
 * Componente compacto para informações essenciais do jogo
 */
const GameInfo = ({
  gameTitle,
  gameIcon = '🎮',
  currentPhase,
  totalPhases,
  phaseName = '',
  isExecuting = false,
  onShowPhaseSelector,
  showPhaseSelector = true,
  className = ''
}) => {
  return (
    <div className={`bg-light border-bottom ${className}`}>
      <Container fluid className="py-2">
        <Row className="align-items-center">
          {/* Título compacto */}
          <Col xs={12} md={4} className="mb-2 mb-md-0">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.5rem' }}>{gameIcon}</span>
              <h5 className="mb-0 text-brand-primary">{gameTitle}</h5>
            </div>
          </Col>

          {/* Informações da fase e controles */}
          <Col xs={12} md={8}>
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
  isExecuting: PropTypes.bool,
  onShowPhaseSelector: PropTypes.func,
  showPhaseSelector: PropTypes.bool,
  className: PropTypes.string
};

export default GameInfo;
