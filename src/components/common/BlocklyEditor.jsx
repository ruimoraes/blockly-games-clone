import React, { useRef, useEffect, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { Play, RotateCcw, Loader, Puzzle } from 'lucide-react';
import './BlocklyEditor.mobile.css';

const BlocklyInstances = {
  instances: new Map(),

  isActive(id) {
    return this.instances.has(id) && this.instances.get(id).workspace !== null;
  },

  getInstance(id) {
    return this.instances.get(id)?.workspace || null;
  },

  setInstance(id, workspace) {
    this.instances.set(id, { workspace, timestamp: Date.now() });
  },

  removeInstance(id) {
    const instance = this.instances.get(id);
    if (instance && instance.workspace) {
      try {
        instance.workspace.dispose();
      } catch (e) {
        console.warn('Erro ao dispose:', e);
      }
    }
    this.instances.delete(id);
  }
};

// Controles customizados (sem mudanças)
const GameControlsCustom = ({
  onRunCode,
  onResetGame,
  isExecuting = false,
  gameState = 'idle',
  runButtonText = 'Executar Código',
  resetButtonText = 'Reiniciar Jogo'
}) => {
  const needsReset = gameState === 'success' || gameState === 'failure';

  const handleClick = () => {
    if (needsReset) {
      onResetGame();
    } else {
      onRunCode();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isExecuting}
      className={`game-controls-custom flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-md ${isExecuting
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : needsReset
          ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
          : 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 hover:from-red-600 hover:via-pink-600 hover:to-purple-700 text-white'
        } ${!isExecuting ? 'hover:scale-105 hover:shadow-lg' : ''}`}
    >
      {isExecuting ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span>Executando...</span>
        </>
      ) : needsReset ? (
        <>
          <RotateCcw className="w-4 h-4" />
          <span>{resetButtonText}</span>
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          <span>{runButtonText}</span>
        </>
      )}
    </button>
  );
};

const configureMobileToolbox = (workspace) => {
  if (!workspace || window.innerWidth > 480) return;

  const applyMobileConfig = () => {
    setTimeout(() => {
      const categories = document.querySelectorAll('.blocklyToolboxCategory');
      categories.forEach((category, index) => {
        try {
          // Primeiro, corrigir o pointer-events do container
          const contentContainer = category.querySelector('.blocklyTreeRowContentContainer');
          if (contentContainer) {
            contentContainer.style.setProperty('pointer-events', 'auto', 'important');
          }

          // Buscar ícone usando a classe correta do Blockly
          const treeIcon = category.querySelector('.blocklyToolboxCategoryIcon') ||
            category.querySelector('.blocklyTreeIcon') ||
            category.querySelector('[class*="Icon"]');

          const treeLabel = category.querySelector('.blocklyToolboxCategoryLabel') ||
            category.querySelector('.blocklyTreeLabel') ||
            category.querySelector('[class*="Label"]');

          if (treeIcon && treeLabel) {
            const categoryName = treeLabel.textContent.trim().toLowerCase();
            
            const iconMap = {
              'movimentos': 'fas fa-running',
              'lógica': 'fas fa-brain',
              'loop': 'fas fa-sync-alt',
              'loops': 'fas fa-sync-alt',
              'repetir': 'fas fa-sync-alt',
              'matemática': 'fas fa-calculator',
              'texto': 'fas fa-font',
              'variáveis': 'fas fa-box',
              'funções': 'fas fa-cog',
              'sensores': 'fas fa-eye',
              'controle': 'fas fa-gamepad',
              'eventos': 'fas fa-bolt',
              'operadores': 'fas fa-plus',
              'dados': 'fas fa-database'
            };

            const iconClass = iconMap[categoryName] || 'fas fa-puzzle-piece';
            treeIcon.innerHTML = '';
            treeIcon.className = `${iconClass} blocklyToolboxCategoryIcon`;            
            treeLabel.style.setProperty('display', 'none', 'important');
          }

        } catch (error) {
          console.error(`❌ Erro ao configurar categoria ${index}:`, error);
        }
      });
    }, 500);
  }

  applyMobileConfig();

  const observer = new MutationObserver((mutations) => {
    let shouldReapply = false;

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE &&
            (node.classList.contains('blocklyToolboxCategory') ||
              node.querySelector('.blocklyToolboxCategory'))) {
            shouldReapply = true;
          }
        });
      }
    });

    if (shouldReapply) {
      applyMobileConfig();
    }
  });

  const toolboxDiv = document.querySelector('.blocklyToolboxDiv') ||
    document.querySelector('.blocklyToolbox');

  if (toolboxDiv) {
    observer.observe(toolboxDiv, {
      childList: true,
      subtree: true
    });
  }

  return () => {
    observer.disconnect();
  };
};

// Editor Blockly com sistema de fases
const BlocklyEditor = forwardRef(({
  toolbox,
  onCodeChange,
  onWorkspaceChange,
  options = {},
  title = "Editor de Blocos Blockly",
  gameName = '',
  phaseKey = null,
  onRunCode,
  onResetGame,
  isExecuting = false,
  gameState = 'idle',
  runButtonText = 'Executar Código',
  resetButtonText = 'Reiniciar Jogo',
  footerButtons = null
}, ref) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);
  const [currentBlockCount, setCurrentBlockCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const onCodeChangeRef = useRef(onCodeChange);
  const onWorkspaceChangeRef = useRef(onWorkspaceChange);

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  useEffect(() => {
    onWorkspaceChangeRef.current = onWorkspaceChange;
  }, [onWorkspaceChange]);

  const storageKey = useMemo(() => {
    const gameId = gameName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    return phaseKey
      ? `ws-${gameId}-ps-${phaseKey}`
      : `ws-${gameId}`;
  }, [gameName, phaseKey]);

  const instanceId = useMemo(() => {
    const gameId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${gameId}-editor`;
  }, [title]);

  const saveWorkspaceToStorage = useMemo(() => (workspace) => {
    if (!workspace) return;
    try {
      const state = Blockly.serialization.workspaces.save(workspace);
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn('❌ Erro ao salvar workspace:', error);
    }
  }, [storageKey]);

  const loadWorkspaceFromStorage = useMemo(() => (workspace) => {
    if (!workspace) return false;
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const state = JSON.parse(savedState);
        workspace.clear();
        Blockly.serialization.workspaces.load(state, workspace);
        return true;
      }
    } catch (error) {
      console.warn('❌ Erro ao carregar workspace:', error);
    }
    return false;
  }, [storageKey]);

  const previousPhaseRef = useRef(phaseKey);

  useEffect(() => {
    if (!workspace.current || !phaseKey) return;
    previousPhaseRef.current = phaseKey;

    const timeoutId = setTimeout(() => {
      const loaded = loadWorkspaceFromStorage(workspace.current);
      if (!loaded) {
        const hasBlocks = workspace.current.getAllBlocks(false).length > 0;
        if (!hasBlocks) {
          workspace.current.clear();
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [phaseKey, loadWorkspaceFromStorage, saveWorkspaceToStorage]);

  const handleWorkspaceChange = useMemo(() => () => {
    if (!workspace.current) return;

    const blocks = workspace.current.getAllBlocks(false);
    setCurrentBlockCount(blocks.length);

    saveWorkspaceToStorage(workspace.current);

    if (onWorkspaceChangeRef.current) {
      onWorkspaceChangeRef.current(workspace.current);
    }

    if (onCodeChangeRef.current) {
      try {
        const code = javascriptGenerator.workspaceToCode(workspace.current);
        onCodeChangeRef.current(code);
      } catch (error) {
        console.warn('Erro ao gerar código:', error);
        onCodeChangeRef.current('');
      }
    }
  }, [saveWorkspaceToStorage]);

  useEffect(() => {
    let mounted = true;
    let initTimeout;

    const initBlockly = () => {
      if (!mounted || !blocklyDiv.current) return;

      const rect = blocklyDiv.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        initTimeout = setTimeout(initBlockly, 100);
        return;
      }

      if (BlocklyInstances.isActive(instanceId)) {
        BlocklyInstances.removeInstance(instanceId);
      }

      blocklyDiv.current.innerHTML = '';

      const workspaceOptions = {
        toolbox: toolbox,
        scrollbars: { horizontal: false, vertical: false },
        trashcan: true,
        zoom: { controls: false, wheel: false, startScale: 1.0, maxScale: 1.0, minScale: 0.8 },
        grid: { spacing: 25, length: 3, colour: '#ccc', snap: true },
        theme: Blockly.Themes.Modern,
        ...options
      };

      try {
        const newWorkspace = Blockly.inject(blocklyDiv.current, workspaceOptions);

        if (!mounted) {
          newWorkspace.dispose();
          return;
        }

        workspace.current = newWorkspace;
        BlocklyInstances.setInstance(instanceId, newWorkspace);

        if (phaseKey) {
          loadWorkspaceFromStorage(newWorkspace);
        }

        newWorkspace.addChangeListener(handleWorkspaceChange);

        configureMobileToolbox(newWorkspace);

        setIsReady(true);
      } catch (error) {
        console.error('❌ Erro ao criar workspace:', error);
      }
    };

    initTimeout = setTimeout(initBlockly, 50);

    return () => {
      mounted = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      // Manter instância para reutilização
    };
  }, [instanceId, handleWorkspaceChange, phaseKey, loadWorkspaceFromStorage]);

  useEffect(() => {
    if (workspace.current && toolbox && isReady) {
      try {
        workspace.current.updateToolbox(toolbox);
        configureMobileToolbox(workspace.current);
      } catch (error) {
        console.warn('⚠️ Erro ao atualizar toolbox:', error);
      }
    }
  }, [toolbox, isReady]);

  // Métodos expostos
  useImperativeHandle(ref, () => ({
    getWorkspace: () => workspace.current,
    getCode: () => {
      if (workspace.current) {
        try {
          return javascriptGenerator.workspaceToCode(workspace.current);
        } catch (error) {
          console.error('Erro ao gerar código:', error);
          return '';
        }
      }
      return '';
    },
    getWorkspaceXml: () => {
      if (!workspace.current) return '';
      try {
        const state = Blockly.serialization.workspaces.save(workspace.current);
        return JSON.stringify(state);
      } catch (error) {
        console.error('Erro ao obter XML:', error);
        return '';
      }
    },
    setWorkspaceXml: (xmlString) => {
      if (!workspace.current || !xmlString) return;
      try {
        const state = JSON.parse(xmlString);
        workspace.current.clear();
        Blockly.serialization.workspaces.load(state, workspace.current);
      } catch (error) {
        console.error('Erro ao definir XML:', error);
      }
    },
    clearWorkspace: () => {
      if (workspace.current) {
        workspace.current.clear();
        localStorage.removeItem(storageKey);
      }
    },
    saveWorkspace: () => saveWorkspaceToStorage(workspace.current),
    restoreWorkspace: () => loadWorkspaceFromStorage(workspace.current)
  }), [storageKey, saveWorkspaceToStorage, loadWorkspaceFromStorage]);

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white/80 shadow-lg">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 shadow-md rounded-t-2xl blockly-header-responsive blockly-editor-header-mobile" style={{ background: 'linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)' }}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3 blockly-header-title-group">
            <Puzzle className="w-5 h-5 blockly-header-icon" />
            <h3 className="font-semibold text-lg blockly-header-title">{title}</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="bg-white/20 px-2 py-1 rounded-full blockly-header-blockcount">
              {currentBlockCount} blocos
            </span>
          </div>
        </div>
      </div>

      {/* Área do Blockly */}
      <div className="flex-1 relative overflow-auto">
        {!isReady && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 rounded-b-2xl">
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Carregando editor...</span>
            </div>
          </div>
        )}

        <div
          ref={blocklyDiv}
          className={`w-full h-full ${isReady ? 'opacity-100' : 'opacity-0'} rounded-b-2xl`}
          style={{
            minHeight: '400px',
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 py-3 blockly-editor-footer-mobile">
        <div className="flex justify-center">
          {footerButtons || (
            <GameControlsCustom
              onRunCode={onRunCode}
              onResetGame={onResetGame}
              isExecuting={isExecuting}
              gameState={gameState}
              runButtonText={runButtonText}
              resetButtonText={resetButtonText}
            />
          )}
        </div>
      </div>
    </div>
  );
});

BlocklyEditor.displayName = 'BlocklyEditor';

BlocklyEditor.propTypes = {
  toolbox: PropTypes.object.isRequired,
  onCodeChange: PropTypes.func,
  onWorkspaceChange: PropTypes.func,
  options: PropTypes.object,
  title: PropTypes.string,
  gameName: PropTypes.string,
  phaseKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 🆕
  onRunCode: PropTypes.func,
  onResetGame: PropTypes.func,
  isExecuting: PropTypes.bool,
  gameState: PropTypes.oneOf(['idle', 'running', 'success', 'failure']),
  runButtonText: PropTypes.string,
  resetButtonText: PropTypes.string,
  footerButtons: PropTypes.node
};

export default React.memo(BlocklyEditor);