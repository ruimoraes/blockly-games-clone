import React from 'react';
import { Lock, CheckCircle, Play, Star } from 'lucide-react';

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

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <h3>
            <Star />
            Selecionar Fase - {gameConfig.gameName}
          </h3>
          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <div>
          <div>
            <div>
              <CheckCircle />
              <span>{completedPhases.length} Completadas</span>
            </div>
            <div>
              <Play />
              <span>{unlockedPhases.length} Desbloqueadas</span>
            </div>
            <div>
              <Lock />
              <span>{totalPhases - unlockedPhases.length} Bloqueadas</span>
            </div>
          </div>
        </div>

        <div>
          {Array.from({ length: totalPhases }, (_, index) => {
            const phaseNumber = index + 1;
            const isUnlocked = unlockedPhases.includes(phaseNumber);
            const isCompleted = completedPhases.includes(phaseNumber);
            const isCurrent = currentPhase === phaseNumber;
            const phaseData = getPhaseData(phaseNumber);

            return (
              <div key={phaseNumber}>
                <div onClick={() => isUnlocked && onPhaseSelect(phaseNumber)}>
                  <div>
                    <div>
                      <div>
                        <div>
                          {isCompleted ? <CheckCircle /> : 
                           !isUnlocked ? <Lock /> : phaseNumber}
                        </div>
                        <span>
                          {getDifficultyText(phaseNumber)}
                        </span>
                      </div>
                      {isCurrent && (
                        <span>
                          Atual
                        </span>
                      )}
                    </div>

                    <h6>
                      Fase {phaseNumber}
                    </h6>
                    
                    <h6>
                      {phaseData.name}
                    </h6>
                    
                    <p>
                      {phaseData.description}
                    </p>

                    <div>
                      <small>
                        {phaseData.maxBlocks === Infinity ? 
                          'Blocos ilimitados' : 
                          `Máx: ${phaseData.maxBlocks} blocos`
                        }
                      </small>
                      
                      {isUnlocked && (
                        <button 
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
              </div>
            );
          })}
        </div>

        <div>
          <div>
            <div>
              Progresso: {completedPhases.length}/{totalPhases} fases completadas
            </div>
            <div>
              <div />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseSelector;

