import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { defineBlocks, defineGenerators, getToolboxConfig } from '../../utils/blockDefinitions';

const BlocklyWorkspace = ({ onCodeChange, onWorkspaceChange }) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);

  useEffect(() => {
    if (blocklyDiv.current && !workspace.current) {
      // Definir blocos e geradores customizados
      defineBlocks();
      defineGenerators();

      // Configurar workspace
      const toolboxConfig = getToolboxConfig();
      
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxConfig,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true,
        scrollbars: true,
        sounds: false,
        oneBasedIndex: false,
        horizontalLayout: false,
        toolboxPosition: 'start',
        css: true,
        media: 'https://unpkg.com/blockly/media/',
        rtl: false,
        renderer: 'geras',
        theme: Blockly.Themes.Classic
      });

      // Listener para mudanças no workspace
      workspace.current.addChangeListener((event) => {
        if (event.type === Blockly.Events.FINISHED_LOADING) {
          return;
        }

        // Gerar código JavaScript
        const code = Blockly.JavaScript.workspaceToCode(workspace.current);
        
        if (onCodeChange) {
          onCodeChange(code);
        }
        
        if (onWorkspaceChange) {
          onWorkspaceChange(workspace.current);
        }
      });

      // Redimensionar workspace quando a janela muda de tamanho
      const handleResize = () => {
        if (workspace.current) {
          Blockly.svgResize(workspace.current);
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (workspace.current) {
          workspace.current.dispose();
          workspace.current = null;
        }
      };
    }
  }, [onCodeChange, onWorkspaceChange]);

  // Função para redimensionar o workspace
  useEffect(() => {
    const resizeWorkspace = () => {
      if (workspace.current) {
        setTimeout(() => {
          Blockly.svgResize(workspace.current);
        }, 100);
      }
    };

    resizeWorkspace();
  });

  // Função para limpar o workspace
  const clearWorkspace = () => {
    if (workspace.current) {
      workspace.current.clear();
    }
  };

  // Função para carregar blocos iniciais
  const loadStarterBlocks = () => {
    if (workspace.current) {
      workspace.current.clear();
      
      // XML com blocos iniciais para demonstração
      const startXml = `
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="maze_move_forward" x="20" y="20">
            <next>
              <block type="maze_turn_right">
                <next>
                  <block type="maze_move_forward"></block>
                </next>
              </block>
            </next>
          </block>
        </xml>
      `;
      
      const xml = Blockly.Xml.textToDom(startXml);
      Blockly.Xml.domToWorkspace(xml, workspace.current);
    }
  };

  // Expor funções úteis através de ref
  React.useImperativeHandle(onWorkspaceChange, () => ({
    clearWorkspace,
    loadStarterBlocks,
    getWorkspace: () => workspace.current
  }));

  return (
    <div 
      ref={blocklyDiv} 
      style={{ 
        height: '100%', 
        width: '100%',
        minHeight: '400px'
      }}
    />
  );
};

export default BlocklyWorkspace;

