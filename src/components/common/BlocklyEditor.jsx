import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
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
  isExecuting = false,
  title = "Editor de Blocos Blockly"
}, ref) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);

  // Configurações padrão do Blockly
  const defaultOptions = {
    toolbox: toolbox,
    scrollbars: true,
    trashcan: true,
    zoom: {
      controls: true,
      wheel: false,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    theme: Blockly.Themes.Modern,
    ...options
  };  // Inicializar Blockly
  useEffect(() => {
    if (blocklyDiv.current && !workspace.current) {
      workspace.current = Blockly.inject(blocklyDiv.current, defaultOptions);
      
      // Carregar blocos iniciais se fornecidos
      if (initialBlocks) {
        try {
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
        } catch (error) {
          console.warn('Erro ao carregar blocos iniciais:', error);
        }
      }

      // Listener para mudanças no workspace
      workspace.current.addChangeListener((event) => {
        if (onWorkspaceChange) {
          onWorkspaceChange(workspace.current);
        }
        
        if (onCodeChange) {
          try {
            const code = javascriptGenerator.workspaceToCode(workspace.current);
            onCodeChange(code);
          } catch (error) {
            console.warn('Erro ao gerar código:', error);
            onCodeChange('');
          }
        }
      });
    }

    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, [toolbox]);

  // Métodos expostos via ref
  useImperativeHandle(ref, () => ({
    getWorkspace: () => workspace.current,    getCode: () => {
      if (workspace.current) {
        return javascriptGenerator.workspaceToCode(workspace.current);
      }
      return '';
    },
    clearWorkspace: () => {
      if (workspace.current) {
        workspace.current.clear();
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
    resize: () => {
      if (workspace.current) {
        Blockly.svgResize(workspace.current);
      }
    }
  }), []);

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
    <div className="card game-card h-100">
      <div className="card-header">
        <h5 className="mb-0">{title}</h5>
        <div className="status-badges">
          <span className={`badge ${workspace.current ? 'bg-success' : 'bg-warning'}`}>
            {workspace.current ? 'Pronto' : 'Carregando...'}
          </span>
          {isExecuting && (
            <span className="badge bg-info ms-2">
              Executando...
            </span>
          )}
        </div>
      </div>
      <div className="card-body p-0">
        <div 
          ref={blocklyDiv} 
          className="blockly-editor"
          style={{ 
            height: '400px', 
            width: '100%',
            minHeight: '300px'
          }}
        />
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
  isExecuting: PropTypes.bool,
  title: PropTypes.string
};

// Memoizar o componente para evitar re-renderizações desnecessárias
export default React.memo(BlocklyEditor);
