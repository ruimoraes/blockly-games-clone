import React from 'react';
import PropTypes from 'prop-types';
import { Home, List } from 'lucide-react';

/**
 * Header simplificado para jogos - navegação básica e informações de jogo
 */
const GameHeader = ({
  onGoHome,
  showHomeButton = true,
  gameTitle = '',
  gameIcon = '',
  currentPhase = null,
  totalPhases = null,
  onShowPhaseSelector,
  showPhaseSelector = false,
  isExecuting = false,
  children
}) => {
  return (
    <nav>
      <div>
        {/* Lado esquerdo - Botões de navegação */}
        <div>          {showHomeButton && (
            <div 
              onClick={onGoHome}
              title="Ir para Home"
            >
              <span>🎮</span>
              <span>Blockly NT</span>
            </div>
          )}
        </div>

        {/* Centro - Conteúdo customizado (se necessário) */}
        <div>
          {children}
        </div>

        {/* Lado direito - Título, indicador de fase e seletor */}
        <div>          
          {gameTitle && (
            <div>
              {gameIcon && <span>{gameIcon}</span>}
              <h5>{gameTitle}</h5>
            </div>
          )}
          {currentPhase && totalPhases && (
            <div>
              <span>
                <span>{currentPhase}</span>/<span>{totalPhases}</span>
              </span>
            </div>
          )}
          {/* Botão do seletor de fases */}
          {showPhaseSelector && (
            <button
              onClick={onShowPhaseSelector}
              disabled={isExecuting}
              title="Selecionar Fase"
            >
              <List size={16} />
              <span>Fases</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

GameHeader.propTypes = {
  onGoHome: PropTypes.func,
  showHomeButton: PropTypes.bool,
  gameTitle: PropTypes.string,
  gameIcon: PropTypes.string,
  currentPhase: PropTypes.number,
  totalPhases: PropTypes.number,
  onShowPhaseSelector: PropTypes.func,
  showPhaseSelector: PropTypes.bool,
  isExecuting: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default GameHeader;
