import React from 'react';
import PropTypes from 'prop-types';

/**
 * Footer experimental para jogos - informações de fase movidas do header
 */
const GameFooter = ({
  currentPhase = null,
  totalPhases = null,
  onShowPhaseSelector,
  showPhaseSelector = false,
  isExecuting = false,
  onShowHelp
}) => {  return (
    <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 border-t border-white/20 border-b-0">
      <div className="flex items-center justify-between px-6 py-3">        {/* Lado esquerdo - Botão de Ajuda */}
        <div className="flex items-center">
          <button
            onClick={onShowHelp}
            title="Ajuda"
            className="!bg-white !text-gray-800 font-medium py-2 px-6 lg:py-3 lg:px-9 lg:text-lg rounded-full transition-all duration-200 hover:!bg-gray-900 hover:!text-white hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Ajuda
          </button>
        </div>        {/* Centro - Indicador de Fase Atual/Total */}
        <div className="flex items-center">
          {currentPhase && totalPhases && (
            <div className="phase-indicator">
              <span className="text-white font-medium text-base lg:text-2xl">
                <span className="phase-current">{currentPhase}</span>
                <span className="phase-separator">/</span>
                <span className="phase-total">{totalPhases}</span>
              </span>
            </div>
          )}
        </div>{/* Lado direito - Botão do Seletor de Fases */}
        <div className="flex items-center">
          {showPhaseSelector && (
            <button
              onClick={onShowPhaseSelector}
              disabled={isExecuting}
              title="Selecionar Fase"
              className={`!bg-white !text-gray-800 font-medium py-2 px-6 lg:py-3 lg:px-9 lg:text-lg rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                isExecuting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:!bg-gray-900 hover:!text-white hover:scale-105 hover:shadow-lg'
              }`}
            >
              Fases
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

GameFooter.propTypes = {
  currentPhase: PropTypes.number,
  totalPhases: PropTypes.number,
  onShowPhaseSelector: PropTypes.func,
  showPhaseSelector: PropTypes.bool,
  isExecuting: PropTypes.bool,
  onShowHelp: PropTypes.func
};

export default GameFooter;
