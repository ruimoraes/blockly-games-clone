import React, { useRef, useEffect, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import GameControls from './GameControls';
import { Play, RotateCcw, Loader, Puzzle } from 'lucide-react';

/**
 * Componente customizado de controles para o footer do BlocklyEditor
 * Versão simplificada e estilizada do GameControls
 */
const GameControlsCustom = ({
  onRunCode,
  onResetGame,
  isExecuting = false,
  gameState = 'idle',
  runButtonText = 'Executar Código',
  resetButtonText = 'Reiniciar Jogo'
}) => {
  // Determina se o jogo precisa ser reiniciado (após sucesso ou falha)
  const needsReset = gameState === 'success' || gameState === 'failure';
  
  // Handler para o botão que muda de comportamento
  const handleButtonClick = () => {
    if (needsReset) {
      onResetGame();
    } else {
      onRunCode();
    }
  };

  return (    <button
      onClick={handleButtonClick}
      disabled={isExecuting}
      className={`flex items-center space-x-1.5 lg:space-x-3 px-4 py-2 lg:px-8 lg:py-4 rounded-full font-medium transition-all duration-200 shadow-md ${
        isExecuting
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : needsReset
            ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-orange-200'
            : 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 hover:from-red-600 hover:via-pink-600 hover:to-purple-700 text-white shadow-red-200'
      } ${!isExecuting ? 'hover:scale-105 hover:shadow-lg' : ''}`}
    >      {isExecuting ? (
        <>
          <Loader className="w-3.5 h-3.5 lg:w-5 lg:h-5 animate-spin" />
          <span className="text-xs lg:text-base font-medium">Executando...</span>
        </>
      ) : needsReset ? (
        <>
          <RotateCcw className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
          <span className="text-xs lg:text-base font-medium">{resetButtonText}</span>
        </>
      ) : (
        <>
          <Play className="w-3.5 h-3.5 lg:w-5 lg:h-5" />
          <span className="text-xs lg:text-base font-medium">{runButtonText}</span>
        </>
      )}
    </button>
  );
};

/**
 * Componente genérico de Editor Blockly para jogos
 * Fornece interface consistente para edição de blocos visual
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.toolbox - Configuração da toolbox do Blockly
 * @param {Function} props.onCodeChange - Callback quando o código muda
 * @param {Function} props.onWorkspaceChange - Callback quando o workspace muda
 * @param {Object} props.options - Opções adicionais do Blockly
 * @param {Array} props.initialBlocks - Blocos iniciais para carregar
 * @param {boolean} props.isExecuting - Se está executando código
 * @param {string} props.title - Título do editor
 * @param {Object} ref - Referência para métodos expostos
 */
const BlocklyEditor = forwardRef(({ 
  toolbox,
  onCodeChange,
  onWorkspaceChange,
  options = {},
  initialBlocks,
  title = "Editor de Blocos Blockly",  // Props do GameControls
  onRunCode,
  onResetGame,
  isExecuting = false,
  gameState = 'idle',
  runButtonText = 'Executar Código',
  resetButtonText = 'Reiniciar Jogo',
  footerButtons = null
}, ref) => {const blocklyDiv = useRef(null);
  const workspace = useRef(null);
  const isInitialized = useRef(false); // Flag para evitar dupla inicialização
  const initTimeoutRef = useRef(null); // Para controlar timeouts
  const [currentBlockCount, setCurrentBlockCount] = useState(0); // Estado para contador de blocos

  // Identificador único para este editor (útil para múltiplos jogos)
  const storageKey = useMemo(() => {
    // Usar parte do título como identificador
    const gameId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `blockly-workspace-${gameId}`;
  }, [title]);

  // Inicializar Blockly
  useEffect(() => {
    if (blocklyDiv.current && !workspace.current && !isInitialized.current) {
      isInitialized.current = true; // Marcar como em processo de inicialização
      let tentativas = 0;
      const maxTentativas = 10; // Máximo 10 tentativas (1 segundo)
      
      // Configurações do Blockly (movidas para dentro do useEffect)
      const defaultOptions = {
        toolbox: toolbox,
        scrollbars: true,
        trashcan: true,
        zoom: {
          controls: false, // Removido controles de zoom
          wheel: false,    // Evitar zoom com a roda do mouse
          startScale: 1.0,
          maxScale: 1.0,   // Impedir zoom para aumentar
          minScale: 0.8,   // Permitir apenas um zoom out limitado
          scaleSpeed: 1.0  // Velocidade neutra
        },
        grid: {
          spacing: 25,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        theme: Blockly.Themes.Modern,
        ...options
      };// Garantir que o elemento tenha dimensões antes da injeção
      const initBlockly = () => {
        // Se já foi inicializado durante uma tentativa anterior, parar
        if (workspace.current || !blocklyDiv.current) {
          return;
        }
        
        tentativas++;
          // Log apenas a cada 5 tentativas para evitar spam
        if (tentativas === 1 || tentativas % 5 === 0) {
          console.log(`⏳ Inicializando Blockly... (${tentativas}/${maxTentativas})`);
        }

        if (blocklyDiv.current && blocklyDiv.current.offsetWidth > 0 && blocklyDiv.current.offsetHeight > 0 && !workspace.current) {
          // Verificar se já existe um workspace no DOM para evitar duplicação
          const existingWorkspace = blocklyDiv.current.querySelector('.blocklyDiv');
          if (existingWorkspace) {
            blocklyDiv.current.innerHTML = '';
          }
          
          workspace.current = Blockly.inject(blocklyDiv.current, defaultOptions);
          console.log('✅ Blockly inicializado com sucesso');
          
          // Tentar restaurar workspace do localStorage primeiro
          try {
            const savedState = localStorage.getItem(storageKey);
            if (savedState) {
              Blockly.Xml.domToWorkspace(
                Blockly.Xml.textToDom(savedState),
                workspace.current
              );
            }
            // Se não houver estado salvo, usar blocos iniciais
            else if (initialBlocks) {
              if (typeof initialBlocks === 'string') {
                Blockly.Xml.domToWorkspace(
                  Blockly.Xml.textToDom(initialBlocks),
                  workspace.current
                );
              } else if (Array.isArray(initialBlocks)) {
                // Assumir que é um array de definições de blocos
                initialBlocks.forEach(blockDef => {
                  const block = workspace.current.newBlock(blockDef.type);
                  if (blockDef.fields) {
                    Object.entries(blockDef.fields).forEach(([field, value]) => {
                      block.setFieldValue(value, field);
                    });
                  }
                  block.initSvg();
                  block.render();
                });
              }
            }
          } catch (error) {
            console.warn('Erro ao restaurar workspace:', error);
          }
            // Listener para mudanças no workspace
          workspace.current.addChangeListener(() => {
            // Contar blocos no workspace
            const blocks = workspace.current.getAllBlocks(false);
            setCurrentBlockCount(blocks.length);
            
            if (onWorkspaceChange) {
              onWorkspaceChange(workspace.current);
            }
            
            if (onCodeChange) {
              try {
                const code = javascriptGenerator.workspaceToCode(workspace.current);
                onCodeChange(code);
                  // Salvar workspace no localStorage após cada mudança
                const xml = Blockly.Xml.workspaceToDom(workspace.current);
                const xmlText = Blockly.Xml.domToText(xml);
                localStorage.setItem(storageKey, xmlText);
              } catch (error) {
                console.warn('Erro ao gerar código ou salvar workspace:', error);
                onCodeChange('');
              }
            }
          });        } else {
          // Se ainda não tem dimensões, tentar novamente em breve
          if (tentativas < maxTentativas) {
            initTimeoutRef.current = setTimeout(initBlockly, 100);
          } else {
            console.error('❌ Falha ao inicializar Blockly: elemento sem dimensões após', maxTentativas, 'tentativas');
            isInitialized.current = false; // Permitir nova tentativa se necessário
          }
        }
      };
      
      // Usar timeout para garantir que o DOM esteja pronto
      initTimeoutRef.current = setTimeout(initBlockly, 50);
    }

    return () => {
      // Limpar timeout se ainda estiver pendente
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      
      // Ao desmontar, salvar o estado atual do workspace antes de destruí-lo
      if (workspace.current) {try {
          const xml = Blockly.Xml.workspaceToDom(workspace.current);
          const xmlText = Blockly.Xml.domToText(xml);
          localStorage.setItem(storageKey, xmlText);
        } catch (e) {
          console.error('Erro ao salvar workspace antes de desmontar:', e);
        }
        
        workspace.current.dispose();
        workspace.current = null;
      }
      
      // Resetar flag de inicialização para permitir nova inicialização
      isInitialized.current = false;
    };
  }, [toolbox, options, initialBlocks, onCodeChange, onWorkspaceChange, storageKey]);

  // Métodos expostos via ref
  useImperativeHandle(ref, () => ({
    getWorkspace: () => workspace.current,
    
    getCode: () => {
      if (workspace.current) {
        return javascriptGenerator.workspaceToCode(workspace.current);
      }
      return '';
    },
    
    clearWorkspace: () => {
      if (workspace.current) {
        workspace.current.clear();
        // Após limpar, também deve remover do localStorage
        localStorage.removeItem(storageKey);
      }
    },
    
    loadBlocks: (blocks) => {
      if (workspace.current) {
        workspace.current.clear();
        if (typeof blocks === 'string') {
          Blockly.Xml.domToWorkspace(
            Blockly.Xml.textToDom(blocks),
            workspace.current
          );
          
          // Após carregar, salvar no localStorage
          const xml = Blockly.Xml.workspaceToDom(workspace.current);
          localStorage.setItem(storageKey, Blockly.Xml.domToText(xml));
        }
      }
    },
    
    getBlocksXml: () => {
      if (workspace.current) {
        const xml = Blockly.Xml.workspaceToDom(workspace.current);
        return Blockly.Xml.domToText(xml);
      }
      return '';
    },
    
    saveWorkspace: () => {
      if (workspace.current) {
        try {          const xml = Blockly.Xml.workspaceToDom(workspace.current);
          const xmlText = Blockly.Xml.domToText(xml);
          localStorage.setItem(storageKey, xmlText);
          return true;
        } catch (e) {
          console.error('Erro ao salvar workspace manualmente:', e);
          return false;
        }
      }
      return false;
    },
    
    restoreWorkspace: () => {
      if (workspace.current) {
        try {
          const xmlText = localStorage.getItem(storageKey);
          if (xmlText) {            workspace.current.clear();
            const xml = Blockly.Xml.textToDom(xmlText);
            Blockly.Xml.domToWorkspace(xml, workspace.current);
            return true;
          }
        } catch (e) {
          console.error('Erro ao restaurar workspace manualmente:', e);
        }
      }
      return false;
    },
    
    resize: () => {
      if (workspace.current) {
        Blockly.svgResize(workspace.current);
      }
    }
  }), [storageKey]);

  // Redimensionar quando necessário
  useEffect(() => {
    const handleResize = () => {
      if (workspace.current) {
        Blockly.svgResize(workspace.current);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="h-full w-full flex flex-col">
      {/* Área principal do Blockly */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={blocklyDiv}
          className="h-full w-full"
          style={{ minHeight: '400px', minWidth: '300px' }}
        />
      </div>      {/* Footer para botões do editor */}
      <div className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
        {footerButtons || (onRunCode && onResetGame) ? (
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">              {/* Lado esquerdo: Contador de blocos */}              <div className="flex items-center space-x-2 lg:space-x-3 text-gray-600">
                <div className="w-5 h-5 lg:w-7 lg:h-7 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-md flex items-center justify-center">
                  <Puzzle className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <span className="text-sm lg:text-base font-medium">
                  {currentBlockCount} {currentBlockCount === 1 ? 'bloco' : 'blocos'}
                </span>
              </div>

              {/* Lado direito: GameControls customizado */}
              <div className="flex items-center">
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
        ) : (
          <div className="p-3 flex items-center justify-center">
            <div className="text-gray-400 text-sm">
              Área reservada para controles do editor de blocos
            </div>
          </div>
        )}
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
  initialBlocks: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  title: PropTypes.string,
  footerButtons: PropTypes.node,
  // Props do GameControls
  onRunCode: PropTypes.func,
  onResetGame: PropTypes.func,
  isExecuting: PropTypes.bool,
  gameState: PropTypes.oneOf(['idle', 'running', 'success', 'failure']),
  runButtonText: PropTypes.string,
  resetButtonText: PropTypes.string
};

// Memoizar o componente para evitar re-renderizações desnecessárias
export default React.memo(BlocklyEditor);
