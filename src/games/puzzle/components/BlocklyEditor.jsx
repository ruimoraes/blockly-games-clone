import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as Blockly from 'blockly';
import { PUZZLE_TOOLBOX } from '../blocks/puzzleBlocks';

const BlocklyEditor = forwardRef(({ onWorkspaceChange, initialBlocks }, ref) => {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);

  useEffect(() => {
    if (blocklyDiv.current && !workspace.current) {
      // Configuração do workspace Blockly
      workspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: PUZZLE_TOOLBOX,
        scrollbars: true,
        trashcan: true,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        }
      });

      // Listener para mudanças no workspace
      workspace.current.addChangeListener((event) => {
        if (onWorkspaceChange) {
          onWorkspaceChange(workspace.current, event);
        }
      });

      // Carregar blocos iniciais se fornecidos
      if (initialBlocks) {
        try {
          Blockly.Xml.domToWorkspace(
            Blockly.Xml.textToDom(initialBlocks),
            workspace.current
          );
        } catch (error) {
          console.warn('Erro ao carregar blocos iniciais:', error);
        }
      }
    }

    // Cleanup
    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, []);

  // Método para obter o workspace (usado pelo componente pai)
  const getWorkspace = () => workspace.current;

  // Método para obter XML dos blocos
  const getBlocksXml = () => {
    if (workspace.current) {
      const xml = Blockly.Xml.workspaceToDom(workspace.current);
      return Blockly.Xml.domToText(xml);
    }
    return '';
  };

  // Método para limpar o workspace
  const clearWorkspace = () => {
    if (workspace.current) {
      workspace.current.clear();
    }
  };

  // Expor métodos para o componente pai
  useImperativeHandle(ref, () => ({
    getWorkspace,
    getBlocksXml,
    clearWorkspace
  }));

  return (
    <div 
      ref={blocklyDiv}
      style={{ 
        height: '500px', 
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}
    />
  );
});

export default BlocklyEditor;

