import { useState, useEffect } from 'react';

export function useBlockly(props = {}) {
  const { blocklyDiv, onCodeChange } = props;
  const [workspace, setWorkspace] = useState(null);
  const [blocklyLoaded, setBlocklyLoaded] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    let isMounted = true;
    let workspaceInstance = null;

    const loadBlockly = async () => {
      if (!blocklyDiv.current || workspace) return;

      try {
        console.log('Iniciando carregamento do Blockly...');
        const Blockly = await import('blockly');
        const BlocklyJavaScript = await import('blockly/javascript');
        const { defineBlocks, defineGenerators, getToolboxConfig } = await import('../blocks/mazeBlocks.js');

        console.log('Módulos importados, registrando blocos...');
        defineBlocks(Blockly);
        defineGenerators(BlocklyJavaScript.javascriptGenerator);
        const toolboxConfig = getToolboxConfig();
        
        console.log('Blocos e geradores registrados');
        console.log('Criando workspace...');

        // Criar workspace
        workspaceInstance = Blockly.inject(blocklyDiv.current, {
          toolbox: toolboxConfig,
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
          },
          zoom: {
            controls: true,
            wheel: false,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
          },
          trashcan: true,
          scrollbars: true,
          sounds: false,
          media: 'https://unpkg.com/blockly/media/',
          renderer: 'geras',
          theme: Blockly.Themes.Classic
        });

        // Configurar e adicionar listener para mudanças no workspace
        const updateGeneratedCode = () => {
          try {            if (workspaceInstance) {
              // Usar o método atualizado para obter variáveis
              const variableMap = workspaceInstance.getVariableMap();
              const variables = variableMap ? variableMap.getAllVariables() : [];
              
              // Gerar código com o contexto das variáveis
              const code = BlocklyJavaScript.javascriptGenerator.workspaceToCode(workspaceInstance);
              console.log('Código gerado:', code);
              console.log('Variáveis disponíveis:', variables);
              
              setGeneratedCode(code);
              onCodeChange?.(code);
            }
          } catch (error) {
            console.error('Erro ao gerar código:', error);
          }
        };

        // Atualizar código quando houver mudanças no workspace
        workspaceInstance.addChangeListener(updateGeneratedCode);

        if (isMounted) {
          console.log('Workspace criado com sucesso');
          setWorkspace(workspaceInstance);
          setBlocklyLoaded(true);
        }
      } catch (error) {
        console.error('Erro ao carregar Blockly:', error);
        setBlocklyLoaded(false);
      }
    };

    loadBlockly();

    return () => {
      isMounted = false;
      if (workspaceInstance) {
        workspaceInstance.dispose();
      }
    };
  }, [blocklyDiv, onCodeChange, workspace]);
  const clearWorkspace = () => {
    if (workspace) {
      // Limpar workspace
      workspace.clear();
      
      // Limpar variáveis usando o novo método
      const variableMap = workspace.getVariableMap();
      if (variableMap) {
        const variables = variableMap.getAllVariables();
        variables.forEach(variable => {
          workspace.deleteVariableById(variable.getId());
        });
      }
      
      setGeneratedCode('');
      onCodeChange?.('');
    }
  };

  return {
    workspace,
    blocklyLoaded,
    generatedCode,
    setGeneratedCode,
    clearWorkspace
  };
}
