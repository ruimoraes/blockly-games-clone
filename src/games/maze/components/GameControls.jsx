import React from 'react';
import PropTypes from 'prop-types';

export function GameControls({ 
  onRunCode, 
  onResetGame, 
  isExecuting, 
  isBlocklyLoaded, 
  hasCode 
}) {
  return (
    <div className="controls-container">
      <button
        className="btn btn-success btn-lg control-buttons"
        onClick={onRunCode}
        disabled={isExecuting || !isBlocklyLoaded || !hasCode}
      >
        {isExecuting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Executando...
          </>
        ) : (
          <>
            ▶️ Executar Programa
          </>
        )}
      </button>
      <button
        className="btn btn-outline-secondary btn-lg control-buttons"
        onClick={onResetGame}
        disabled={isExecuting}
      >
        🔄 Resetar Jogo
      </button>
    </div>
  );
}

GameControls.propTypes = {
  onRunCode: PropTypes.func.isRequired,
  onResetGame: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool.isRequired,
  isBlocklyLoaded: PropTypes.bool.isRequired,
  hasCode: PropTypes.bool.isRequired
};

export default GameControls;
