import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Eye, EyeOff, Unlock, Lock, SkipForward } from 'lucide-react';

/**
 * Painel de Debug para desenvolvimento
 * Permite navegar entre fases, desbloquear tudo, etc.
 */
const DebugPanel = ({
  // Dados das fases
  currentPhase,
  totalPhases,
  unlockedPhases = [],
  completedPhases = [],
  
  // Ações
  onPhaseChange,
  onUnlockAllPhases,
  onCompleteAllPhases,
  onResetProgress,
  
  // Configurações
  gameTitle = "Jogo",
  position = "bottom-right", // "bottom-right", "bottom-left", "top-right", "top-left"
  
  // Controle externo de visibilidade
  isOpen = null, // null = auto-detect, true/false = forçar estado
  onToggle = null // callback para mudanças de estado
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Função para alternar expansão
  const toggleExpanded = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) {
      onToggle(newState);
    }
  }, [isExpanded, onToggle]);  // Verificar se modo debug está ativo
  useEffect(() => {
    const checkDebugMode = () => {
      // Se há controle externo, usar ele
      if (isOpen !== null) {
        return isOpen;
      }
      
      // Verificar URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const debugParam = urlParams.get('debug');
      
      // Verificar localStorage
      const debugStorage = localStorage.getItem('blockly-games-debug');
      
      // Verificar variável global
      const debugGlobal = window.BLOCKLY_GAMES_DEBUG;
      
      return debugParam === 'true' || debugStorage === 'true' || debugGlobal === true;
    };

    setIsVisible(checkDebugMode());
    
    // Escutar mudanças na variável global
    const handleDebugToggle = () => {
      setIsVisible(checkDebugMode());
    };
    
    window.addEventListener('debugModeToggle', handleDebugToggle);
    return () => window.removeEventListener('debugModeToggle', handleDebugToggle);
  }, [isOpen]);

  // Sincronizar expansão com controle externo quando o painel for controlado externamente
  useEffect(() => {
    if (isOpen !== null) {
      setIsExpanded(isOpen);
    }
  }, [isOpen]);

  // Não renderizar se não estiver visível
  if (!isVisible) return null;

  // Calcular posição do painel
  const getPositionClasses = () => {
    const base = "fixed z-50 ";
    switch (position) {
      case "top-left":
        return base + "top-4 left-4";
      case "top-right":
        return base + "top-4 right-4";
      case "bottom-left":
        return base + "bottom-4 left-4";
      case "bottom-right":
      default:
        return base + "bottom-4 right-4";
    }
  };
  // Renderizar botão minimizado
  if (!isExpanded) {
    return (
      <div className={getPositionClasses()}>
        <button
          onClick={toggleExpanded}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Abrir Painel de Debug"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Renderizar painel expandido
  return (
    <div className={getPositionClasses()}>
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 w-80 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span className="font-semibold text-sm">Debug - {gameTitle}</span>
          </div>          <button
            onClick={toggleExpanded}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 space-y-4 max-h-80 overflow-y-auto">          {/* Info atual */}
          <div className="bg-gray-800 rounded p-3">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Status Atual</h3>
            <div className="text-xs space-y-1">
              <div>Fase: {currentPhase}/{totalPhases}</div>
              <div>Desbloqueadas: {unlockedPhases.length}/{totalPhases} ({unlockedPhases.join(', ')})</div>
              <div>Completadas: {completedPhases.length}/{totalPhases} ({completedPhases.join(', ')})</div>
            </div>
          </div>

          {/* Navegação rápida de fases */}
          <div className="bg-gray-800 rounded p-3">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Navegar para Fase</h3>
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: totalPhases }, (_, i) => i + 1).map(phase => (
                <button
                  key={phase}
                  onClick={() => onPhaseChange?.(phase)}
                  className={`
                    text-xs py-1 px-2 rounded transition-colors
                    ${phase === currentPhase 
                      ? 'bg-blue-600 text-white' 
                      : completedPhases.includes(phase)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : unlockedPhases.includes(phase)
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }
                  `}
                  title={`Fase ${phase} ${
                    completedPhases.includes(phase) ? '(Completada)' :
                    unlockedPhases.includes(phase) ? '(Desbloqueada)' :
                    '(Bloqueada)'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="bg-gray-800 rounded p-3">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Ações Rápidas</h3>            <div className="space-y-2">
              <button
                onClick={() => {
                  console.log('🐛 DEBUG BUTTON: Desbloquear Todas clicado');
                  console.log('🐛 onUnlockAllPhases:', onUnlockAllPhases);
                  if (onUnlockAllPhases) {
                    onUnlockAllPhases();
                  } else {
                    console.error('🐛 onUnlockAllPhases não está definido!');
                  }
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
              >
                <Unlock className="w-3 h-3" />
                <span>Desbloquear Todas</span>
              </button>
              
              <button
                onClick={() => {
                  console.log('🐛 DEBUG BUTTON: Completar Todas clicado');
                  console.log('🐛 onCompleteAllPhases:', onCompleteAllPhases);
                  if (onCompleteAllPhases) {
                    onCompleteAllPhases();
                  } else {
                    console.error('🐛 onCompleteAllPhases não está definido!');
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
              >
                <SkipForward className="w-3 h-3" />
                <span>Completar Todas</span>
              </button>
              
              <button
                onClick={() => {
                  console.log('🐛 DEBUG BUTTON: Resetar Progresso clicado');
                  console.log('🐛 onResetProgress:', onResetProgress);
                  if (onResetProgress) {
                    onResetProgress();
                  } else {
                    console.error('🐛 onResetProgress não está definido!');
                  }
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
              >
                <Lock className="w-3 h-3" />
                <span>Resetar Progresso</span>
              </button>
            </div>
          </div>

          {/* Informações de debug */}
          <div className="bg-gray-800 rounded p-3">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Debug Info</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <div>URL: ?debug=true</div>
              <div>Console: window.enableDebug()</div>
              <div>Storage: debug ativado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Funções globais para controle do debug
window.enableDebug = () => {
  localStorage.setItem('blockly-games-debug', 'true');
  window.BLOCKLY_GAMES_DEBUG = true;
  window.dispatchEvent(new Event('debugModeToggle'));
  console.log('🐛 Modo Debug ATIVADO! Recarregue a página se necessário.');
};

window.disableDebug = () => {
  localStorage.removeItem('blockly-games-debug');
  window.BLOCKLY_GAMES_DEBUG = false;
  window.dispatchEvent(new Event('debugModeToggle'));
  console.log('🐛 Modo Debug DESATIVADO! Recarregue a página se necessário.');
};

// Log de instruções no console
if (typeof window !== 'undefined') {
  console.log(`
🐛 MODO DEBUG DISPONÍVEL:
• URL: adicione ?debug=true
• Console: window.enableDebug() 
• Desativar: window.disableDebug()
  `);
}

export default DebugPanel;
