import React from 'react';
import PropTypes from 'prop-types';
import { Clock } from 'lucide-react';

/**
 * Componente para exibir informações da fase atual
 * Exibe título e descrição da fase, além do status de execução
 */
const GameInfo = ({
  phaseData = {},
  currentPhase,
  isExecuting = false
}) => {
  // Função para determinar a dificuldade baseada na fase
  const getDifficulty = (phase) => {
    if (!phase) return null;
    if (phase <= 3) return { level: 'Fácil', color: 'bg-green-500', emoji: '😊' };
    if (phase <= 6) return { level: 'Médio', color: 'bg-yellow-500', emoji: '🤔' };
    if (phase <= 8) return { level: 'Difícil', color: 'bg-orange-500', emoji: '😤' };
    return { level: 'Extremo', color: 'bg-red-500', emoji: '🔥' };
  };

  const difficulty = getDifficulty(currentPhase);  return (
    <div className="p-1 lg:px-3 lg:py-2">
      {phaseData && phaseData.name ? (
        <div className="flex items-center justify-between">          {/* Número da fase */}
          <div className="flex-shrink-0 w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm lg:text-lg font-bold shadow-lg">
            {currentPhase}
          </div>
          
          {/* Título/Subtítulo */}
          <div className="flex-1 min-w-0 px-3 lg:px-5">            <div className="flex items-center space-x-2">
              <h3 className="text-base lg:text-2xl font-semibold text-gray-800 truncate">
                {phaseData.name}
              </h3>
              {isExecuting && (
                <div className="flex items-center space-x-1 text-amber-600">
                  <Clock className="w-3 h-3 lg:w-5 lg:h-5 animate-spin" />
                  <span className="text-xs lg:text-sm font-medium">Executando...</span>
                </div>
              )}
            </div>
            {phaseData.description && (
              <p className="text-sm lg:text-xl text-gray-600 leading-tight truncate">
                {phaseData.description}
              </p>
            )}</div>          {/* Dificuldade */}
          <div className="flex-shrink-0">
            {difficulty && (
              <div className={`flex items-center space-x-1 text-xs lg:text-sm text-white px-2 py-1 lg:px-3 lg:py-1.5 rounded-full font-medium ${difficulty.color}`}>
                <span className="lg:text-base">{difficulty.emoji}</span>
                <span>{difficulty.level}</span>
              </div>
            )}
          </div>
        </div>
      ) : (        <div className="flex items-center justify-between text-gray-500">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-sm lg:text-lg font-bold">
            ?
          </div>
          <div className="flex-1 px-3 lg:px-5">
            <p className="text-xs lg:text-sm">Selecione uma fase para começar</p>
          </div>
          <div className="flex-shrink-0">
            {/* Espaço para dificuldade */}
          </div>
        </div>
      )}
    </div>
  );
};

GameInfo.propTypes = {
  phaseData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string
  }),
  currentPhase: PropTypes.number,
  isExecuting: PropTypes.bool
};

export default GameInfo;
