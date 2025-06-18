import React from 'react';
import PropTypes from 'prop-types';

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
    <div className="phase-navigation">
      <button
        className="btn btn-outline-primary"
        onClick={onPrevious}
        disabled={isExecuting || currentPhase === 1}
      >
        ← Fase Anterior
      </button>

      <div className="phase-info">
        <div className="phase-title">
          <strong>{phaseData.name}</strong>
        </div>
        <div className="phase-description">
          <small>{phaseData.description}</small>
        </div>
        {phaseData.maxBlocks !== Infinity && (
          <div className="blocks-limit">
            <small className="badge bg-warning text-dark">
              Máximo: {phaseData.maxBlocks} blocos
            </small>
          </div>
        )}
      </div>

      <button
        className="btn btn-outline-primary"
        onClick={onNext}
        disabled={isExecuting || !canAdvance}
      >
        Próxima Fase →
      </button>
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
