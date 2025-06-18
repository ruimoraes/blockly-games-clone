import React from 'react';
import PropTypes from 'prop-types';

export function GameHeader({ 
  currentPhase, 
  totalPhases, 
  phaseName, 
  onShowPhaseSelector, 
  isExecuting 
}) {
  return (
    <header className="bg-primary text-white py-2 py-md-3 mb-3 mb-md-4 game-header">
      <div className="container">
        <div className="header-content">
          <div>
            <h1 className="game-title h4 h3-md mb-0">Blockly Games - Clone</h1>
            <p className="mb-0 small">{phaseName} - Fase {currentPhase}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={onShowPhaseSelector}
              disabled={isExecuting}
            >
              📋 Fases
            </button>
            <span className="badge bg-light text-primary px-3 py-2 phase-indicator">
              <span className="d-none d-sm-inline">Fase </span>{currentPhase}/{totalPhases}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

GameHeader.propTypes = {
  currentPhase: PropTypes.number.isRequired,
  totalPhases: PropTypes.number.isRequired,
  phaseName: PropTypes.string.isRequired,
  onShowPhaseSelector: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool.isRequired
};

export default GameHeader;
