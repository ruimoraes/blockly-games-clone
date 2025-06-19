import React, { useRef, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

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
  // isExecuting = false, // TODO: implementar indicador visual durante execução
  title = "Editor de Blocos Blockly"
}, ref) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);
  // Identificador único para este editor (útil para múltiplos jogos)
  const storageKey = useMemo(() => {
    // Usar parte do título como identificador
    const gameId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `blockly-workspace-${gameId}`;
  }, [title]);
    // Configurações padrão do Blockly
  const defaultOptions = useMemo(() => ({
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
  }), [toolbox, options]);
  
  // Inicializar Blockly
  useEffect(() => {
    if (blocklyDiv.current && !workspace.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, defaultOptions);
      
      // Tentar restaurar workspace do localStorage primeiro
      try {
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
          Blockly.Xml.domToWorkspace(
            Blockly.Xml.textToDom(savedState),
            workspace.current
          );
          console.log('Workspace restaurado do localStorage', storageKey);
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
            // console.log('Workspace salvo:', storageKey);
          } catch (error) {
            console.warn('Erro ao gerar código ou salvar workspace:', error);
            onCodeChange('');
          }
        }
      });
    }

    return () => {
      // Ao desmontar, salvar o estado atual do workspace antes de destruí-lo
      if (workspace.current) {
        try {
          const xml = Blockly.Xml.workspaceToDom(workspace.current);
          const xmlText = Blockly.Xml.domToText(xml);
          localStorage.setItem(storageKey, xmlText);
          console.log('Workspace salvo antes de desmontar:', storageKey);
        } catch (e) {
          console.error('Erro ao salvar workspace antes de desmontar:', e);
        }
        
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, [toolbox, defaultOptions, initialBlocks, onCodeChange, onWorkspaceChange, storageKey]);

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
        try {
          const xml = Blockly.Xml.workspaceToDom(workspace.current);
          const xmlText = Blockly.Xml.domToText(xml);
          localStorage.setItem(storageKey, xmlText);
          console.log('Workspace salvo manualmente:', storageKey);
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
          if (xmlText) {
            workspace.current.clear();
            const xml = Blockly.Xml.textToDom(xmlText);
            Blockly.Xml.domToWorkspace(xml, workspace.current);
            console.log('Workspace restaurado manualmente:', storageKey);
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
  }, []);  return (
    <div>
      <div>
        <div 
          ref={blocklyDiv}
        />
      </div>
    </div>
  );
});

BlocklyEditor.displayName = 'BlocklyEditor';

BlocklyEditor.propTypes = {
  toolbox: PropTypes.object.isRequired,
  onCodeChange: PropTypes.func,
  onWorkspaceChange: PropTypes.func,  options: PropTypes.object,
  initialBlocks: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  // isExecuting: PropTypes.bool, // removido temporariamente
  title: PropTypes.string
};

// Memoizar o componente para evitar re-renderizações desnecessárias
export default React.memo(BlocklyEditor);
