import React from 'react';
import PropTypes from 'prop-types';
import MazeRenderer from './MazeRenderer';

const GameArea = ({ 
  gameState, 
  playerPosition, 
  mazeData, 
  phaseNumber 
}) => {
  return (
    <div className="card h-100">
      <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
        <h5 className="mb-0">Labirinto - Fase {phaseNumber}</h5>
        <div>
          {gameState === 'success' && (
            <span className="badge bg-success">🎉 Sucesso!</span>
          )}
          {gameState === 'failure' && (
            <span className="badge bg-danger">❌ Falhou!</span>
          )}
          {gameState === 'running' && (
            <span className="badge bg-primary">⚡ Executando...</span>
          )}
          {gameState === 'idle' && (
            <span className="badge bg-secondary">⏸️ Aguardando</span>
          )}
        </div>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center p-2 p-sm-3">
        <div className="maze-display">
          <MazeRenderer
            mazeData={mazeData}
            playerPosition={playerPosition}
            gameState={gameState}
          />
        </div>
      </div>
      <div className="card-footer text-center">
        <small className="text-muted">
          <span className="d-block d-sm-inline">Posição: ({playerPosition.x}, {playerPosition.y})</span>
          <span className="d-none d-sm-inline"> | </span>
          <span className="d-block d-sm-inline">Direção: {['Norte', 'Leste', 'Sul', 'Oeste'][playerPosition.direction]}</span>
        </small>
      </div>
    </div>
  );
};

GameArea.propTypes = {
  gameState: PropTypes.oneOf(['idle', 'running', 'success', 'failure']).isRequired,
  playerPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    direction: PropTypes.number.isRequired
  }).isRequired,
  mazeData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  phaseNumber: PropTypes.number.isRequired
};

export default GameArea;
