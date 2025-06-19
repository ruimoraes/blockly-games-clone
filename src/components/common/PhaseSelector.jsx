import React from 'react';
import { Lock, CheckCircle, Play, Star, X } from 'lucide-react';

const PhaseSelector = ({ 
  currentPhase, 
  unlockedPhases, 
  completedPhases, 
  totalPhases, 
  onPhaseSelect, 
  getPhaseData,
  gameConfig,
  isVisible = false,
  onClose 
}) => {
  if (!isVisible) return null;

  const getDifficultyText = (level) => {
    if (level <= 3) return 'Fácil';
    if (level <= 6) return 'Médio';
    if (level <= 8) return 'Difícil';
    return 'Extremo';
  };

  const getDifficultyColor = (level) => {
    if (level <= 3) return 'text-green-600 bg-green-100';
    if (level <= 6) return 'text-yellow-600 bg-yellow-100';
    if (level <= 8) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Selecionar Fase - {gameConfig.gameName || 'Jogo'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-white/20">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="text-sm text-gray-600">Completadas</div>
              <div className="text-xl font-bold text-gray-800">{completedPhases.length}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-2">
                <Play className="w-6 h-6" />
              </div>
              <div className="text-sm text-gray-600">Desbloqueadas</div>
              <div className="text-xl font-bold text-gray-800">{unlockedPhases.length}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <div className="text-sm text-gray-600">Bloqueadas</div>
              <div className="text-xl font-bold text-gray-800">{totalPhases - unlockedPhases.length}</div>
            </div>
          </div>
        </div>

        {/* Phases Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: totalPhases }, (_, index) => {
              const phaseNumber = index + 1;
              const isUnlocked = unlockedPhases.includes(phaseNumber);
              const isCompleted = completedPhases.includes(phaseNumber);
              const isCurrent = currentPhase === phaseNumber;
              const phaseData = getPhaseData(phaseNumber);

              return (
                <div 
                  key={phaseNumber}
                  className={`bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-4 cursor-pointer transition-all duration-200 border-2 ${
                    isCurrent 
                      ? 'border-blue-400 ring-2 ring-blue-200' 
                      : isUnlocked 
                        ? 'border-transparent hover:border-blue-300' 
                        : 'border-gray-200 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => isUnlocked && onPhaseSelect(phaseNumber)}
                >
                  {/* Phase Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isCompleted 
                          ? 'bg-green-100 text-green-600' 
                          : !isUnlocked 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-blue-100 text-blue-600'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : 
                         !isUnlocked ? <Lock className="w-4 h-4" /> : phaseNumber}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(phaseNumber)}`}>
                        {getDifficultyText(phaseNumber)}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">
                        Atual
                      </span>
                    )}
                  </div>

                  {/* Phase Content */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      Fase {phaseNumber}
                    </h4>
                    
                    <h5 className="font-medium text-gray-700 text-sm">
                      {phaseData.name}
                    </h5>
                    
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {phaseData.description}
                    </p>

                    {/* Phase Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <small className="text-xs text-gray-500">
                        {phaseData.maxBlocks === Infinity ? 
                          'Blocos ilimitados' : 
                          `Máx: ${phaseData.maxBlocks} blocos`
                        }
                      </small>
                      
                      {isUnlocked && (
                        <button 
                          className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                            isCurrent 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPhaseSelect(phaseNumber);
                          }}
                        >
                          {isCurrent ? 'Atual' : 'Jogar'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-t border-white/20">
          <div className="text-center mb-3">
            <div className="text-sm text-gray-600">
              Progresso: {completedPhases.length}/{totalPhases} fases completadas
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedPhases.length / totalPhases) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseSelector;

