import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight, CheckCircle } from 'lucide-react';

const GameArea = ({
  children,
  gameState = 'idle',
  onNextPhase,
  currentPhase,
  totalPhases
}) => {
  const isSuccess = gameState === 'success';
  const canGoNext = isSuccess && currentPhase < totalPhases;

  return (
    <div className="h-full flex flex-col">
      {/* Área principal do jogo */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Rodapé do jogo */}
      {isSuccess && (
        <div className="flex-shrink-0 bg-green-50 border-t border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-green-800 font-semibold">Parabéns!</h3>
                <p className="text-green-600 text-sm">Fase completada com sucesso!</p>
              </div>
            </div>
            
            {canGoNext && onNextPhase && (
              <button
                onClick={onNextPhase}
                className="flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-md bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 hover:from-red-600 hover:via-pink-600 hover:to-purple-700 text-white hover:scale-105 hover:shadow-lg"
              >
                <span>Próxima Fase</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

GameArea.propTypes = {
  children: PropTypes.node.isRequired,
  gameState: PropTypes.oneOf(['idle', 'running', 'success', 'failure']),
  onNextPhase: PropTypes.func,
  currentPhase: PropTypes.number,
  totalPhases: PropTypes.number
};

export default GameArea;
