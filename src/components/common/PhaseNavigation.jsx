import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
}) {  return (
    <div>
      <div>
        <div>
          <button
            onClick={onPrevious}
            disabled={isExecuting || currentPhase === 1}
          >
            <ChevronLeft size={16} />
            <span>Fase Anterior</span>
            <span>Anterior</span>
          </button>
          
          <div>
            {phaseData.maxBlocks !== Infinity && (
              <span>
                Máx: {phaseData.maxBlocks} blocos
              </span>
            )}
          </div>
          
          <button
            onClick={onNext}
            disabled={isExecuting || !canAdvance || currentPhase >= totalPhases}
          >
            <span>Próxima Fase</span>
            <span>Próxima</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
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
