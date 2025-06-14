import { useState, useEffect, useRef, useCallback } from 'react';
import * as Blockly from 'blockly';
import { registerBlocks, toolboxConfig } from '../utils/blockDefinitions';

export function useBlockly(containerId, gameActions) {
  const [workspace, setWorkspace] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const workspaceRef = useRef(null);

  // Inicializar workspace
  const initializeWorkspace = useCallback(() => {
    if (!containerId) return;

    // Registrar blocos customizados
    registerBlocks();

    // Configuração do workspace
    const workspaceConfig = {
      toolbox: toolboxConfig,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      move: {
        scrollbars: true,
        drag: true,
        wheel: false
      },
      sounds: false,
      oneBasedIndex: false
    };

    try {
      const newWorkspace = Blockly.inject(containerId, workspaceConfig);
      workspaceRef.current = newWorkspace;
      setWorkspace(newWorkspace);

      // Listener para mudanças no workspace
      newWorkspace.addChangeListener(() => {
        const code = Blockly.JavaScript.workspaceToCode(newWorkspace);
        setGeneratedCode(code);
      });

      return newWorkspace;
    } catch (error) {
      console.error('Erro ao inicializar workspace Blockly:', error);
      return null;
    }
  }, [containerId]);

  // Gerar código JavaScript
  const generateCode = useCallback(() => {
    if (!workspace) return '';
    
    try {
      const code = Blockly.JavaScript.workspaceToCode(workspace);
      setGeneratedCode(code);
      return code;
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      return '';
    }
  }, [workspace]);

  // Executar código gerado
  const executeCode = useCallback(async () => {
    if (!generatedCode || !gameActions) return false;

    try {
      // Criar contexto de execução com as ações do jogo
      const executionContext = {
        moveForward: gameActions.moveForward,
        turnLeft: gameActions.turnLeft,
        turnRight: gameActions.turnRight,
        isPathForward: gameActions.isPathForward,
        isPathLeft: gameActions.isPathLeft,
        isPathRight: gameActions.isPathRight,
        atGoal: gameActions.atGoal,
        noPathForward: gameActions.noPathForward,
        noPathLeft: gameActions.noPathLeft,
        noPathRight: gameActions.noPathRight
      };

      // Criar função executável
      const executableCode = `
        (function() {
          ${generatedCode}
        })();
      `;

      // Executar código no contexto do jogo
      const func = new Function(...Object.keys(executionContext), executableCode);
      await func(...Object.values(executionContext));
      
      return true;
    } catch (error) {
      console.error('Erro na execução do código:', error);
      return false;
    }
  }, [generatedCode, gameActions]);

  // Limpar workspace
  const clearWorkspace = useCallback(() => {
    if (workspace) {
      workspace.clear();
      setGeneratedCode('');
    }
  }, [workspace]);

  // Redimensionar workspace
  const resizeWorkspace = useCallback(() => {
    if (workspace) {
      Blockly.svgResize(workspace);
    }
  }, [workspace]);

  // Salvar workspace como XML
  const saveWorkspace = useCallback(() => {
    if (!workspace) return null;
    
    try {
      const xml = Blockly.Xml.workspaceToDom(workspace);
      return Blockly.Xml.domToText(xml);
    } catch (error) {
      console.error('Erro ao salvar workspace:', error);
      return null;
    }
  }, [workspace]);

  // Carregar workspace de XML
  const loadWorkspace = useCallback((xmlText) => {
    if (!workspace || !xmlText) return false;
    
    try {
      const xml = Blockly.Xml.textToDom(xmlText);
      workspace.clear();
      Blockly.Xml.domToWorkspace(xml, workspace);
      return true;
    } catch (error) {
      console.error('Erro ao carregar workspace:', error);
      return false;
    }
  }, [workspace]);

  // Obter estatísticas do workspace
  const getWorkspaceStats = useCallback(() => {
    if (!workspace) return { blockCount: 0, hasBlocks: false };
    
    const allBlocks = workspace.getAllBlocks();
    return {
      blockCount: allBlocks.length,
      hasBlocks: allBlocks.length > 0,
      topBlocks: workspace.getTopBlocks().length
    };
  }, [workspace]);

  // Definir limite de blocos
  const setBlockLimit = useCallback((limit) => {
    if (!workspace) return;
    
    // Implementar limite de blocos se necessário
    workspace.addChangeListener((event) => {
      if (event.type === Blockly.Events.BLOCK_CREATE) {
        const blockCount = workspace.getAllBlocks().length;
        if (blockCount > limit) {
          // Remover o último bloco adicionado
          const block = workspace.getBlockById(event.blockId);
          if (block) {
            block.dispose();
          }
        }
      }
    });
  }, [workspace]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

  // Redimensionar quando a janela muda de tamanho
  useEffect(() => {
    const handleResize = () => {
      resizeWorkspace();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeWorkspace]);

  return {
    workspace,
    generatedCode,
    initializeWorkspace,
    generateCode,
    executeCode,
    clearWorkspace,
    resizeWorkspace,
    saveWorkspace,
    loadWorkspace,
    getWorkspaceStats,
    setBlockLimit
  };
}

