import React, { useRef, useEffect, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { Play, RotateCcw, Loader, Puzzle } from 'lucide-react';
import './BlocklyEditor.mobile.css';

// Sistema global mais robusto para prevenir múltiplas inicializações
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
  },
  
  // Método para reutilizar workspace existente
  reuseOrCreateInstance(id, createFn) {
    if (this.isActive(id)) {
      console.log(`♻️ Reutilizando instância existente: ${id}`);
      return this.getInstance(id);
    }
    console.log(`🆕 Criando nova instância: ${id}`);
    return createFn();
  }
};

// Controles customizados
const GameControlsCustom = ({
  onRunCode,
  onResetGame,
  isExecuting = false,
  gameState = 'idle',
  runButtonText = 'Executar Código',
  resetButtonText = 'Reiniciar Jogo'
}) => {
  const needsReset = gameState === 'success' || gameState === 'failure';
  
  // Debug: monitorar mudanças no gameState
  useEffect(() => {
    console.log('🎮 GameControlsCustom - gameState mudou para:', gameState);
    console.log('🎮 needsReset agora é:', needsReset);
    console.log('🎮 isExecuting:', isExecuting);
  }, [gameState, needsReset, isExecuting]);
  
  const handleClick = () => {
    console.log('🔥 GameControlsCustom handleClick chamado!');
    console.log('needsReset:', needsReset);
    console.log('gameState atual:', gameState);
    console.log('onRunCode:', typeof onRunCode);
    console.log('onResetGame:', typeof onResetGame);
    
    if (needsReset) {
      console.log('🔄 Chamando onResetGame...');
      onResetGame();
    } else {
      console.log('▶️ Chamando onRunCode...');
      onRunCode();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isExecuting}
      className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-md ${
        isExecuting
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

// Editor Blockly com prevenção de flicker
const BlocklyEditor = forwardRef(({ 
  toolbox,
  onCodeChange,
  onWorkspaceChange,
  options = {},
  title = "Editor de Blocos Blockly",
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
  const [forceRecreate, setForceRecreate] = useState(0); // Trigger para forçar recriação
  
  // Refs para funções que podem mudar frequentemente
  const onCodeChangeRef = useRef(onCodeChange);
  const onWorkspaceChangeRef = useRef(onWorkspaceChange);
  
  // Atualizar refs quando as funções mudarem
  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);
  
  useEffect(() => {
    onWorkspaceChangeRef.current = onWorkspaceChange;
  }, [onWorkspaceChange]);

  // Atualizar toolbox quando ela mudar (importante para mudança de fases)
  useEffect(() => {
    if (workspace.current && toolbox) {
      console.log('🔄 Toolbox mudou - atualizando workspace');
      try {
        // Salvar estado atual dos blocos
        const currentState = Blockly.serialization.workspaces.save(workspace.current);
        
        // Atualizar toolbox
        workspace.current.updateToolbox(toolbox);
        
        // Restaurar blocos (eles devem permanecer mesmo com toolbox nova)
        if (currentState && currentState.blocks && currentState.blocks.blocks && currentState.blocks.blocks.length > 0) {
          // Apenas manter os blocos que ainda são válidos com a nova toolbox
          workspace.current.clear();
          Blockly.serialization.workspaces.load(currentState, workspace.current);
        }
        
        console.log('✅ Toolbox atualizada com sucesso');
      } catch (error) {
        console.warn('⚠️ Erro ao atualizar toolbox:', error);
        // Se houve erro, forçar recriação do workspace
        setForceRecreate(prev => prev + 1);
      }
    }
  }, [toolbox]);

  // ID único para esta instância (baseado no título, mas estável)
  const instanceId = useMemo(() => {
    const gameId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${gameId}-editor`;
  }, [title]);

  // Storage key
  const storageKey = useMemo(() => {
    const gameId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const key = `blockly-workspace-${gameId}`;
    return key;
  }, [title]);

  // Inicialização do Blockly
  useEffect(() => {
    let mounted = true;
    let initTimeout;

    const initBlockly = () => {
      if (!mounted || !blocklyDiv.current) return;

      // Verificar dimensões
      const rect = blocklyDiv.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        initTimeout = setTimeout(initBlockly, 100);
        return;
      }

      // Se já existe uma instância ativa, tentar reutilizar primeiro
      if (BlocklyInstances.isActive(instanceId)) {
        const existingWorkspace = BlocklyInstances.getInstance(instanceId);
        if (existingWorkspace) {
          console.log(`♻️ Tentando reutilizar workspace existente: ${instanceId}`);
          
          // Verificar se o workspace atual está realmente conectado a um DOM válido
          const existingSvg = existingWorkspace.getParentSvg();
          const isWorkspaceVisible = existingSvg && 
                                   existingSvg.parentNode && 
                                   existingSvg.parentNode.isConnected &&
                                   existingSvg.style.display !== 'none';
          
          if (isWorkspaceVisible) {
            console.log(`✅ Workspace existente válido - reutilizando`);
            workspace.current = existingWorkspace;
            setIsReady(true);
            return;
          } else {
            console.log(`🔄 Workspace existente não está visível - forçando recriação`);
            // Salvar estado antes de dispose
            let savedState = null;
            try {
              savedState = Blockly.serialization.workspaces.save(existingWorkspace);
            } catch (error) {
              console.warn('Erro ao salvar estado do workspace:', error);
            }
            
            // Dispose do workspace antigo
            BlocklyInstances.removeInstance(instanceId);
            
            // Recriar com estado salvo
            createNewWorkspace(savedState);
            return;
          }
        }
      }

      // Criar novo workspace
      createNewWorkspace();
    };

    const createNewWorkspace = (savedState = null) => {
      if (!mounted || !blocklyDiv.current) return;

      console.log(`🚀 Criando novo workspace para ${instanceId}`);

      // Limpar conteúdo existente
      blocklyDiv.current.innerHTML = '';

      // Configurações mínimas necessárias
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

        console.log('✅ Novo workspace criado com sucesso');

        // Restaurar estado salvo ou localStorage
        try {
          const stateToLoad = savedState || (() => {
            const localState = localStorage.getItem(storageKey);
            return localState ? JSON.parse(localState) : null;
          })();
          
          if (stateToLoad) {
            Blockly.serialization.workspaces.load(stateToLoad, newWorkspace);
            console.log('📁 Estado restaurado no novo workspace');
          }
        } catch (error) {
          console.warn('Erro ao restaurar workspace:', error);
        }

        // Adicionar listener de mudanças
        newWorkspace.addChangeListener(() => {
          if (!mounted) return;

          const blocks = newWorkspace.getAllBlocks(false);
          setCurrentBlockCount(blocks.length);
          
          if (onWorkspaceChangeRef.current) {
            onWorkspaceChangeRef.current(newWorkspace);
          }
          
          if (onCodeChangeRef.current) {
            try {
              const code = javascriptGenerator.workspaceToCode(newWorkspace);
              onCodeChangeRef.current(code);
              
              const state = Blockly.serialization.workspaces.save(newWorkspace);
              localStorage.setItem(storageKey, JSON.stringify(state));
            } catch (error) {
              console.warn('Erro ao gerar código:', error);
              onCodeChangeRef.current('');
            }
          }
        });

        setIsReady(true);

      } catch (error) {
        console.error('❌ Erro ao criar novo workspace:', error);
      }
    };

    initTimeout = setTimeout(initBlockly, 50);

    return () => {
      mounted = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      // Não remover instância no cleanup - mantê-la viva para reutilização
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceId, forceRecreate]); // Adicionar forceRecreate para permitir recriação forçada

  // Redimensionar workspace quando houver mudanças de layout
  useEffect(() => {
    let resizeTimer;
    
    const handleResize = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      
      resizeTimer = setTimeout(() => {
        if (workspace.current && blocklyDiv.current) {
          console.log('📐 Redimensionando workspace Blockly devido a mudança de layout');
          
          // Forçar recálculo de dimensões
          const rect = blocklyDiv.current.getBoundingClientRect();
          console.log('📏 Dimensões do container:', rect.width, 'x', rect.height);
          
          if (rect.width > 0 && rect.height > 0) {
            try {
              // Salvar estado atual antes de redimensionar
              const currentState = Blockly.serialization.workspaces.save(workspace.current);
              
              // Redimensionar
              Blockly.svgResize(workspace.current);
              
              // Se ainda não está visível, tentar recriar o SVG
              const svg = workspace.current.getParentSvg();
              if (!svg || svg.style.display === 'none') {
                console.log('🔄 SVG não visível, forçando re-renderização');
                
                // Re-aplicar o estado para forçar re-renderização
                workspace.current.clear();
                Blockly.serialization.workspaces.load(currentState, workspace.current);
              }
              
              console.log('✅ Workspace redimensionado com sucesso');
            } catch (error) {
              console.error('❌ Erro ao redimensionar workspace:', error);
            }
          } else {
            console.warn('⚠️ Container com dimensões inválidas, aguardando...');
            // Tentar novamente após um delay maior
            setTimeout(handleResize, 200);
          }
        }
      }, 150);
    };

    // Escutar mudanças de tamanho da janela
    window.addEventListener('resize', handleResize);
    
    // Escutar mudanças de layout específicas do mobile
    window.addEventListener('switchToGameTab', handleResize);
    
    // Escutar mudanças de aba
    const handleTabChange = (event) => {
      if (event.detail?.activeTab === 'editor') {
        console.log('📱 Aba do editor ativada - redimensionando workspace');
        handleResize();
      }
    };
    window.addEventListener('tabChanged', handleTabChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('switchToGameTab', handleResize);
      window.removeEventListener('tabChanged', handleTabChange);
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
    };
  }, [isReady]);

  // Detectar quando o container se torna visível novamente (importante para abas mobile)
  useEffect(() => {
    if (!isReady || !workspace.current || !blocklyDiv.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            console.log('👁️ BlocklyEditor tornou-se visível - verificando workspace');
            
            setTimeout(() => {
              if (workspace.current && blocklyDiv.current) {
                const rect = blocklyDiv.current.getBoundingClientRect();
                console.log('👁️ Dimensões ao tornar-se visível:', rect.width, 'x', rect.height);
                
                if (rect.width > 0 && rect.height > 0) {
                  // Verificar se o workspace está realmente visível
                  const svg = workspace.current.getParentSvg();
                  const isWorkspaceVisible = svg && 
                                           svg.parentNode && 
                                           svg.parentNode.isConnected &&
                                           svg.style.display !== 'none' &&
                                           svg.style.visibility !== 'hidden';
                  
                  if (!isWorkspaceVisible) {
                    console.log('🔄 Workspace não visível - forçando recriação');
                    setIsReady(false); // Reset do estado ready
                    setForceRecreate(prev => prev + 1); // Trigger recriação
                  } else {
                    console.log('✅ Workspace visível - apenas redimensionando');
                    try {
                      Blockly.svgResize(workspace.current);
                    } catch (error) {
                      console.error('❌ Erro ao redimensionar:', error);
                    }
                  }
                } else {
                  console.warn('⚠️ Container ainda sem dimensões válidas na intersecção');
                }
              }
            }, 100);
          }
        });
      },
      { threshold: [0, 0.1] }
    );

    // Adicionar MutationObserver para detectar mudanças no DOM
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          
          const target = mutation.target;
          const isBlocklyContainer = target === blocklyDiv.current || 
                                   blocklyDiv.current?.contains(target);
          
          if (isBlocklyContainer) {
            // console.log('🔄 Mudança de estilo detectada no container Blockly');
            setTimeout(() => {
              if (workspace.current) {
                const rect = blocklyDiv.current.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                  // Verificar se precisa recriar ou apenas redimensionar
                  const svg = workspace.current.getParentSvg();
                  if (!svg || !svg.parentNode || !svg.parentNode.isConnected) {
                    // console.log('🔄 Workspace desconectado - forçando recriação');
                    setIsReady(false);
                    setForceRecreate(prev => prev + 1);
                  } else {
                    // console.log('🔄 Redimensionando devido a mudança de estilo');
                    Blockly.svgResize(workspace.current);
                  }
                }
              }
            }, 50);
          }
        }
      });
    });

    observer.observe(blocklyDiv.current);
    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [isReady]);

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
    loadBlocks: (blocks) => {
      if (!workspace.current || !blocks) return;
      try {
        workspace.current.clear();
        if (typeof blocks === 'string') {
          const dom = Blockly.utils.xml.textToDom(blocks);
          Blockly.Xml.domToWorkspace(dom, workspace.current);
        }
      } catch (error) {
        console.error('Erro ao carregar blocos:', error);
      }
    },
    clearWorkspace: () => {
      if (workspace.current) {
        workspace.current.clear();
      }
    },
    resize: () => {
      if (workspace.current && blocklyDiv.current) {
        console.log('🔄 Método resize() chamado manualmente');
        const rect = blocklyDiv.current.getBoundingClientRect();
        console.log('🔄 Dimensões do container:', rect.width, 'x', rect.height);
        
        if (rect.width > 0 && rect.height > 0) {
          try {
            // Salvar estado atual
            const currentState = Blockly.serialization.workspaces.save(workspace.current);
            
            // Redimensionar
            Blockly.svgResize(workspace.current);
            
            // Se ainda não visível, forçar recriação
            const svg = workspace.current.getParentSvg();
            if (!svg || svg.style.display === 'none' || svg.style.visibility === 'hidden') {
              console.log('🔄 Forçando recriação do workspace devido a SVG invisível');
              workspace.current.clear();
              Blockly.serialization.workspaces.load(currentState, workspace.current);
              
              // Redimensionar novamente após recriação
              setTimeout(() => {
                if (workspace.current) {
                  Blockly.svgResize(workspace.current);
                }
              }, 50);
            }
          } catch (error) {
            console.error('❌ Erro no método resize():', error);
          }
        }
      }
    },
    saveWorkspace: () => {
      if (workspace.current) {
        try {
          const state = Blockly.serialization.workspaces.save(workspace.current);
          localStorage.setItem(storageKey, JSON.stringify(state));
          console.log('💾 Workspace salvo');
        } catch (error) {
          console.error('Erro ao salvar workspace:', error);
        }
      }
    },
    restoreWorkspace: () => {
      if (workspace.current) {
        try {
          const savedState = localStorage.getItem(storageKey);
          if (savedState) {
            const state = JSON.parse(savedState);
            Blockly.serialization.workspaces.load(state, workspace.current);
            console.log('📁 Workspace restaurado');
          }
        } catch (error) {
          console.error('Erro ao restaurar workspace:', error);
        }
      }
    }
  }));
  
  return (
    <div className="flex flex-col h-full rounded-2xl bg-white/80 shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 shadow-md rounded-t-2xl blockly-header-responsive"
        style={{ background: 'linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)' }}
      >
        <div className="flex items-center justify-between text-white min-h-0">
          <div className="flex items-center space-x-3 blockly-header-title-group">
            <Puzzle className="w-5 h-5 blockly-header-icon" />
            <h3 className="font-semibold text-xs blockly-header-title">{title}</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm blockly-header-blockcount">
            <span className="bg-white/20 px-2 py-1 rounded-full">
              {currentBlockCount} blocos
            </span>
          </div>
        </div>
      </div>

      {/* Área do Blockly */}
      <div className="flex-1 relative min-h-0">
        {/* Loading overlay */}
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
          className={`w-full h-full ${isReady ? 'opacity-100' : 'opacity-0'} rounded-b-2xl overflow-auto`}
          style={{
            minHeight: '200px',
            maxHeight: 'calc(100vh - 170px)',
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-4 py-3 rounded-b-2xl">
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
  initialBlocks: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  title: PropTypes.string,
  onRunCode: PropTypes.func,
  onResetGame: PropTypes.func,
  isExecuting: PropTypes.bool,
  gameState: PropTypes.oneOf(['idle', 'running', 'success', 'failure']),
  runButtonText: PropTypes.string,
  resetButtonText: PropTypes.string,
  footerButtons: PropTypes.node
};

export default React.memo(BlocklyEditor);