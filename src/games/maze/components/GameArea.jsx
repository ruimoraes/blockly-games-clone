import React from 'react';
import PropTypes from 'prop-types';

const GameArea = ({ 
  gameState, 
  title,
  phaseNumber,
  children,
  footerInfo,
  className = ''
}) => {  // Estados padrão com ícones e cores
  const getStateDisplay = (state) => {
    switch (state) {
      case 'success':
        return { icon: '🎉', text: 'Sucesso!', className: 'success-state' };
      case 'failure':
        return { icon: '❌', text: 'Falhou!', className: 'failure-state' };
      case 'running':
        return { icon: '⚡', text: 'Executando...', className: 'running-state' };
      case 'idle':
      default:
        return { icon: '⏸️', text: 'Aguardando', className: 'idle-state' };
    }
  };

  const stateDisplay = getStateDisplay(gameState);
  return (
    <div className={`game-area ${className}`}>
      <div className="game-header">
        <h5>
          {title} - Fase {phaseNumber}
        </h5>
        <div>
          <span className={`state-badge ${stateDisplay.className}`}>
            {stateDisplay.icon} {stateDisplay.text}
          </span>
        </div>
      </div>
      <div className="game-body">
        <div className="game-display">
          {children}
        </div>
      </div>
      {footerInfo && (
        <div className="game-footer">
          <small>
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
