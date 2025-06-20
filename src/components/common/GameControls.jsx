import React from 'react';
import PropTypes from 'prop-types';
import { Play, RotateCcw, Loader } from 'lucide-react';

/**
 * Componente genérico de controles para jogos
 * Fornece interface consistente para executar e resetar código
 */
const GameControls = ({
  onRunCode,
  onResetGame,
  isExecuting = false,
  gameState = 'idle',
  customButtons = [],
  runButtonText = 'Executar',
  resetButtonText = 'Reiniciar Jogo',
  runButtonIcon = Play,
  resetButtonIcon = RotateCcw,
  className = ''
}) => {
  const RunIcon = runButtonIcon;
  const ResetIcon = resetButtonIcon;
  
  // Determina se o jogo precisa ser reiniciado (após sucesso ou falha)
  const needsReset = gameState === 'success' || gameState === 'failure';
  
  // Handler para o botão que muda de comportamento
  const handleButtonClick = () => {
    if (needsReset) {
      // Se o jogo terminou (sucesso ou falha), reinicia
      onResetGame();
    } else {
      // Se está no estado inicial, executa o código
      onRunCode();
    }
  };

  return (
    <div className={`glass-panel p-4 ${className}`}>
      <div className="flex flex-wrap gap-3">
        {/* Botão Principal (Executar ou Reiniciar) */}
        <button
          onClick={handleButtonClick}
          disabled={isExecuting}          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
            isExecuting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : needsReset
                ? 'bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white shadow-orange-200'
                : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white shadow-green-200'
          } ${!isExecuting ? 'hover:scale-105 hover:shadow-xl' : ''}`}
        >
          {isExecuting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Executando...</span>
            </>
          ) : needsReset ? (
            <>
              <ResetIcon className="w-4 h-4" />
              <span>{resetButtonText}</span>
            </>
          ) : (
            <>
              <RunIcon className="w-4 h-4" />
              <span>{runButtonText}</span>
            </>
          )}
        </button>

        {/* Botões customizados */}
        {customButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            disabled={button.disabled || isExecuting}            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              button.disabled || isExecuting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:scale-105 shadow-md hover:shadow-lg'
            } ${button.className || ''}`}
            title={button.tooltip}
          >
            {button.icon && <button.icon className="w-4 h-4" />}
            <span>{button.text}</span>
          </button>
        ))}
      </div>
      
      {/* Feedback visual do estado do jogo */}
      {gameState !== 'idle' && !isExecuting && (
        <div className="mt-3 flex items-center space-x-2">          {gameState === 'success' && (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Sucesso! Clique em "Reiniciar" para tentar novamente.</span>
            </div>
          )}
          {gameState === 'failure' && (
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Tente novamente! Clique em "Reiniciar" para recomeçar.</span>
            </div>
          )}
          {gameState === 'running' && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Executando...</span>
            </div>
          )}
        </div>
      )}    </div>
  );
};

GameControls.propTypes = {
  onRunCode: PropTypes.func.isRequired,
  onResetGame: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool,
  gameState: PropTypes.oneOf(['idle', 'running', 'success', 'failure']),
  customButtons: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.elementType,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    tooltip: PropTypes.string
  })),
  runButtonText: PropTypes.string,
  resetButtonText: PropTypes.string,
  runButtonIcon: PropTypes.elementType,
  resetButtonIcon: PropTypes.elementType,
  className: PropTypes.string
};

export default GameControls;
