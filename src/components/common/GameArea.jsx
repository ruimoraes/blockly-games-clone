import React from 'react';
import PropTypes from 'prop-types';

const GameArea = ({ 
  gameState, 
  title,
  phaseNumber,
  children,
  footerInfo,
  className = ''
}) => {
  // Estados padrão com ícones e cores
  const getStateDisplay = (state) => {
    switch (state) {
      case 'success':
        return { icon: '🎉', text: 'Sucesso!', className: 'bg-success' };
      case 'failure':
        return { icon: '❌', text: 'Falhou!', className: 'bg-danger' };
      case 'running':
        return { icon: '⚡', text: 'Executando...', className: 'bg-primary' };
      case 'idle':
      default:
        return { icon: '⏸️', text: 'Aguardando', className: 'bg-secondary' };
    }
  };

  const stateDisplay = getStateDisplay(gameState);

  return (
    <div className={`card h-100 ${className}`}>
      <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
        <h5 className="mb-0">
          {title} - Fase {phaseNumber}
        </h5>
        <div>
          <span className={`badge ${stateDisplay.className}`}>
            {stateDisplay.icon} {stateDisplay.text}
          </span>
        </div>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center p-2 p-sm-3">
        <div className="game-display">
          {children}
        </div>
      </div>
      {footerInfo && (
        <div className="card-footer text-center">
          <small className="text-muted">
            {footerInfo}
          </small>
        </div>
      )}
    </div>
  );
};

GameArea.propTypes = {
  gameState: PropTypes.oneOf(['idle', 'running', 'success', 'failure']).isRequired,
  title: PropTypes.string.isRequired,
  phaseNumber: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  footerInfo: PropTypes.node,
  className: PropTypes.string
};

export default GameArea;
