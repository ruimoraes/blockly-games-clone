import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Badge } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './PhaseNavigation.css';

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
    <Card className="phase-navigation">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-brand-primary"
            onClick={onPrevious}
            disabled={isExecuting || currentPhase === 1}
            className="d-flex align-items-center gap-2"
            size="sm"
          >
            <ChevronLeft size={16} />
            <span className="d-none d-sm-inline">Fase Anterior</span>
            <span className="d-sm-none">Anterior</span>
          </Button>          <div className="text-center flex-grow-1 mx-2 mx-sm-3">
            {phaseData.maxBlocks !== Infinity && (
              <Badge bg="brand-accent" pill className="small">
                Máx: {phaseData.maxBlocks} blocos
              </Badge>
            )}
          </div>
          
          <Button
            variant={canAdvance && currentPhase < totalPhases ? "brand-primary" : "outline-brand-primary"}
            onClick={onNext}
            disabled={isExecuting || !canAdvance || currentPhase >= totalPhases}
            className="d-flex align-items-center gap-2"
            size="sm"
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
