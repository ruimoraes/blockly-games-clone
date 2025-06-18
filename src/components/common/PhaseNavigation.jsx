import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Badge } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Target } from 'lucide-react';

/**
 * Componente de navegação simples entre fases adjacentes
 * Para seleção de fases específicas, use PhaseSelector
 */
export function PhaseNavigation({
  onPrevious,
  onNext,
  currentPhase,
  phaseData,
  isExecuting,
  canAdvance,
  totalPhases
}) {
  return (
    <Card className="phase-navigation mb-3">
      <Card.Body className="py-3">
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-primary"
            onClick={onPrevious}
            disabled={isExecuting || currentPhase === 1}
            className="d-flex align-items-center gap-2"
          >
            <ChevronLeft size={16} />
            <span className="d-none d-sm-inline">Fase Anterior</span>
            <span className="d-sm-none">Anterior</span>
          </Button>

          <div className="text-center flex-grow-1 mx-3">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <Target size={18} className="text-primary" />
              <strong className="h6 mb-0">{phaseData.name}</strong>
            </div>
            <p className="text-muted small mb-2">{phaseData.description}</p>
            {phaseData.maxBlocks !== Infinity && (
              <Badge bg="warning" text="dark" className="small">
                Máximo: {phaseData.maxBlocks} blocos
              </Badge>
            )}
          </div>

          <Button
            variant="outline-primary"
            onClick={onNext}
            disabled={isExecuting || !canAdvance || currentPhase >= totalPhases}
            className="d-flex align-items-center gap-2"
          >
            <span className="d-none d-sm-inline">Próxima Fase</span>
            <span className="d-sm-none">Próxima</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

PhaseNavigation.propTypes = {
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  currentPhase: PropTypes.number.isRequired,
  phaseData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    maxBlocks: PropTypes.number
  }).isRequired,
  isExecuting: PropTypes.bool.isRequired,
  canAdvance: PropTypes.bool.isRequired,
  totalPhases: PropTypes.number.isRequired
};

export default PhaseNavigation;
