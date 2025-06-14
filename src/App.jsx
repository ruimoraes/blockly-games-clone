import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useMazeGame } from './hooks/useMazeGame';

function App() {
  const blocklyDiv = useRef(null);
  const [workspace, setWorkspace] = useState(null);
  const [blocklyLoaded, setBlocklyLoaded] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('editor');

  const {
    gameState,
    playerPosition,
    currentLevel,
    mazeData,
    isExecuting,
    executeCode,
    resetGame,
    moveForward,
    turnLeft,
    turnRight,
    isPathAhead,
    isPathLeft,
    isPathRight
  } = useMazeGame();

  // Extrair propriedades para compatibilidade
  const position = playerPosition;
  const direction = ['Norte', 'Leste', 'Sul', 'Oeste'][playerPosition.direction];
  const isAtGoal = gameState === 'success';

  // Função para renderizar o labirinto
  const renderMaze = () => {
    const cellSize = 60;
    const mazeWidth = mazeData[0].length * cellSize;
    const mazeHeight = mazeData.length * cellSize;

    return (
      <svg width={mazeWidth} height={mazeHeight} className="border">
        {/* Renderizar células do labirinto */}
        {mazeData.map((row, y) =>
          row.map((cell, x) => {
            let fill = '#8B4513'; // Marrom para paredes
            
            if (cell === 1) fill = '#FFFFFF'; // Branco para caminho
            if (cell === 2) fill = '#FFFFFF'; // Branco para início
            if (cell === 3) fill = '#90EE90'; // Verde claro para objetivo
            
            return (
              <rect
                key={`${x}-${y}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fill}
                stroke="#654321"
                strokeWidth="1"
              />
            );
          })
        )}
        
        {/* Renderizar objetivo */}
        {mazeData.map((row, y) =>
          row.map((cell, x) => {
            if (cell === 3) {
              return (
                <circle
                  key={`goal-${x}-${y}`}
                  cx={x * cellSize + cellSize / 2}
                  cy={y * cellSize + cellSize / 2}
                  r={cellSize / 3}
                  fill="#FFD700"
                  stroke="#FFA500"
                  strokeWidth="3"
                />
              );
            }
            return null;
          })
        )}
        
        {/* Renderizar personagem */}
        <g>
          <circle
            cx={position.x * cellSize + cellSize / 2}
            cy={position.y * cellSize + cellSize / 2}
            r={cellSize / 3}
            fill={isAtGoal ? "#00FF00" : "#4169E1"}
            stroke="#000080"
            strokeWidth="2"
          />
          
          {/* Seta indicando direção */}
          <polygon
            points={(() => {
              const centerX = position.x * cellSize + cellSize / 2;
              const centerY = position.y * cellSize + cellSize / 2;
              const size = cellSize / 6;
              
              switch (position.direction) {
                case 0: // Norte
                  return `${centerX},${centerY - size} ${centerX - size/2},${centerY + size/2} ${centerX + size/2},${centerY + size/2}`;
                case 1: // Leste
                  return `${centerX + size},${centerY} ${centerX - size/2},${centerY - size/2} ${centerX - size/2},${centerY + size/2}`;
                case 2: // Sul
                  return `${centerX},${centerY + size} ${centerX - size/2},${centerY - size/2} ${centerX + size/2},${centerY - size/2}`;
                case 3: // Oeste
                  return `${centerX - size},${centerY} ${centerX + size/2},${centerY - size/2} ${centerX + size/2},${centerY + size/2}`;
                default:
                  return '';
              }
            })()}
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="1"
          />
        </g>
      </svg>
    );
  };

  // Detectar mudanças de tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Se mudou para desktop e estava na aba do labirinto, voltar para editor
      if (!mobile && activeTab === 'maze') {
        setActiveTab('editor');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  // Carregar Blockly de forma robusta
  useEffect(() => {
    let mounted = true;
    let currentWorkspace = null;

    const loadBlockly = async () => {
      try {
        console.log('Iniciando carregamento do Blockly...');
        
        // Aguardar o DOM estar pronto
        await new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            window.addEventListener('load', resolve, { once: true });
          }
        });

        if (!mounted || !blocklyDiv.current) {
          console.log('Componente desmontado ou div não encontrada');
          return;
        }

        // Importar Blockly dinamicamente
        const Blockly = await import('blockly');
        const { defineBlocks, defineGenerators, getToolboxConfig } = await import('./utils/blockDefinitions');

        if (!mounted) return;

        console.log('Blockly importado com sucesso');

        // Definir blocos e geradores
        defineBlocks(Blockly);
        defineGenerators(Blockly);

        // Limpar qualquer workspace existente
        if (currentWorkspace) {
          try {
            currentWorkspace.dispose();
          } catch (e) {
            console.warn('Erro ao limpar workspace anterior:', e);
          }
        }

        // Limpar o div
        const div = blocklyDiv.current;
        if (div) {
          div.innerHTML = '';
          
          // Garantir que o div está visível e com dimensões
          div.style.display = 'block';
          div.style.visibility = 'visible';
          div.style.width = '100%';
          div.style.height = '100%';
          div.style.position = 'relative';
        }

        // Aguardar um frame para garantir que o DOM foi atualizado
        await new Promise(resolve => requestAnimationFrame(resolve));

        if (!mounted || !blocklyDiv.current) return;

        console.log('Criando workspace...');

        // Criar workspace com configurações otimizadas
        currentWorkspace = Blockly.inject(blocklyDiv.current, {
          toolbox: getToolboxConfig(),
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
          },
          zoom: {
            controls: true,
            wheel: false, // Desabilitar zoom com scroll
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
          collapse: true,
          comments: true,
          disable: true,
          maxBlocks: Infinity,
          maxInstances: {},
          modalInputs: true,
          move: {
            scrollbars: {
              horizontal: true,
              vertical: true
            },
            drag: true,
            wheel: false
          },
          renderer: 'geras'
        });

        if (!mounted) {
          currentWorkspace?.dispose();
          return;
        }

        console.log('Workspace criado com sucesso:', currentWorkspace);

        // Configurar listener para mudanças no workspace
        currentWorkspace.addChangeListener((event) => {
          if (event.type === Blockly.Events.FINISHED_LOADING ||
              event.type === Blockly.Events.BLOCK_CHANGE ||
              event.type === Blockly.Events.BLOCK_CREATE ||
              event.type === Blockly.Events.BLOCK_DELETE ||
              event.type === Blockly.Events.BLOCK_MOVE) {
            
            try {
              const code = Blockly.JavaScript.workspaceToCode(currentWorkspace);
              setGeneratedCode(code);
            } catch (error) {
              console.error('Erro ao gerar código:', error);
            }
          }
        });

        // Forçar redimensionamento inicial
        setTimeout(() => {
          if (mounted && currentWorkspace) {
            try {
              Blockly.svgResize(currentWorkspace);
              currentWorkspace.render();
              console.log('Workspace redimensionado e renderizado');
            } catch (error) {
              console.error('Erro no redimensionamento inicial:', error);
            }
          }
        }, 100);

        if (mounted) {
          setWorkspace(currentWorkspace);
          setBlocklyLoaded(true);
          console.log('Blockly carregado e configurado com sucesso!');
        }

      } catch (error) {
        console.error('Erro ao carregar Blockly:', error);
        if (mounted) {
          setBlocklyLoaded(false);
        }
      }
    };

    loadBlockly();

    // Cleanup
    return () => {
      mounted = false;
      if (currentWorkspace) {
        try {
          currentWorkspace.dispose();
        } catch (e) {
          console.warn('Erro ao limpar workspace no cleanup:', e);
        }
      }
    };
  }, []);

  // Redimensionar workspace quando necessário
  useEffect(() => {
    if (workspace && blocklyLoaded) {
      const handleResize = () => {
        try {
          // Aguardar um pouco para o layout se estabilizar
          setTimeout(() => {
            if (workspace && blocklyDiv.current) {
              const div = blocklyDiv.current;
              
              // Garantir visibilidade no modo correto
              if (isMobile) {
                div.style.display = activeTab === 'editor' ? 'block' : 'none';
              } else {
                div.style.display = 'block';
              }
              
              if (div.style.display === 'block') {
                console.log('Redimensionando workspace...');
                window.Blockly?.svgResize(workspace);
                workspace.render();
              }
            }
          }, 150);
        } catch (error) {
          console.error('Erro ao redimensionar workspace:', error);
        }
      };

      // Redimensionar quando mudar de aba ou tamanho da tela
      handleResize();

      // Listener para mudanças de tamanho da janela
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [workspace, blocklyLoaded, activeTab, isMobile]);

  // Função para executar o código gerado
  const handleRunCode = async () => {
    if (!generatedCode.trim()) {
      alert('Arraste alguns blocos para o workspace primeiro!');
      return;
    }

    try {
      // Resetar posição antes de executar
      resetGame();
      
      // Aguardar um pouco para o reset
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Criar contexto de execução com as funções do jogo
      const context = {
        moveForward,
        turnLeft,
        turnRight,
        console
      };

      // Executar o código gerado
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const executeCode = new AsyncFunction(
        'moveForward', 'turnLeft', 'turnRight', 'console',
        generatedCode
      );

      await executeCode(moveForward, turnLeft, turnRight, console);
      
    } catch (error) {
      console.error('Erro ao executar código:', error);
      alert('Erro ao executar o programa: ' + error.message);
    }
  };

  // Função para limpar workspace
  const handleClearWorkspace = () => {
    if (workspace) {
      workspace.clear();
      setGeneratedCode('');
    }
  };

  return (
    <div className="App">
      <header className="bg-primary text-white py-3 mb-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h3 mb-0">Blockly Games - Clone</h1>
              <small>Jogo do Labirinto - Nível 1</small>
            </div>
            <div className="col-auto">
              <span className="badge bg-light text-primary fs-6">
                Nível 1/10
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container-fluid">
        {isMobile ? (
          // Layout Mobile com Abas
          <div className="mobile-layout">
            {/* Navegação por Abas */}
            <ul className="nav nav-tabs mb-3" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'editor' ? 'active' : ''}`}
                  onClick={() => setActiveTab('editor')}
                  type="button"
                >
                  🧩 Editor de Blocos
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'maze' ? 'active' : ''}`}
                  onClick={() => setActiveTab('maze')}
                  type="button"
                >
                  🎮 Labirinto
                </button>
              </li>
            </ul>

            {/* Conteúdo das Abas */}
            <div className="tab-content">
              {/* Aba Editor de Blocos */}
              {activeTab === 'editor' && (
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Editor de Blocos Blockly</h5>
                    <div className="d-flex gap-2">
                      <span className={`badge ${blocklyLoaded ? 'bg-success' : 'bg-warning'}`}>
                        {blocklyLoaded ? '✓ Carregado' : '⏳ Carregando...'}
                      </span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleClearWorkspace}
                        disabled={!blocklyLoaded}
                      >
                        🗑️ Limpar
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0" style={{ height: '400px', position: 'relative' }}>
                    <div 
                      ref={blocklyDiv}
                      style={{ 
                        height: '100%', 
                        width: '100%',
                        display: 'block'
                      }}
                    />
                    {!blocklyLoaded && (
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                        <p className="text-muted">Carregando Blockly...</p>
                      </div>
                    )}
                  </div>
                  <div className="card-footer text-muted">
                    Arraste blocos da caixa de ferramentas para programar o personagem
                  </div>
                </div>
              )}

              {/* Aba Labirinto */}
              {activeTab === 'maze' && (
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Labirinto - Nível 1</h5>
                    <span className={`badge ${
                      gameState === 'success' ? 'bg-success' : 
                      gameState === 'failure' ? 'bg-danger' : 
                      gameState === 'running' ? 'bg-info' : 'bg-secondary'
                    }`}>
                      {gameState === 'success' ? '🎉 Sucesso!' : 
                       gameState === 'failure' ? '❌ Falhou!' : 
                       gameState === 'running' ? '▶️ Executando' : '⏸️ Aguardando'}
                    </span>
                  </div>
                  <div className="card-body text-center">
                    {renderMaze()}
                  </div>
                  <div className="card-footer text-center text-muted">
                    Posição: ({position.x}, {position.y}) | Direção: {direction}
                  </div>
                </div>
              )}
            </div>

            {/* Controles sempre visíveis */}
            <div className="row mt-3 justify-content-center">
              <div className="col-auto">
                <button
                  className="btn btn-success btn-lg me-2"
                  onClick={handleRunCode}
                  disabled={!blocklyLoaded || !generatedCode.trim()}
                >
                  ▶️ Executar Programa
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={resetGame}
                >
                  🔄 Resetar Jogo
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Layout Desktop (duas colunas)
          <div className="row g-4">
            {/* Coluna Editor de Blocos */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Editor de Blocos Blockly</h5>
                  <div className="d-flex gap-2">
                    <span className={`badge ${blocklyLoaded ? 'bg-success' : 'bg-warning'}`}>
                      {blocklyLoaded ? '✓ Blockly Carregado' : '⏳ Carregando...'}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleClearWorkspace}
                      disabled={!blocklyLoaded}
                    >
                      🗑️ Limpar
                    </button>
                  </div>
                </div>
                <div className="card-body p-0" style={{ height: '400px', position: 'relative' }}>
                  <div 
                    ref={blocklyDiv}
                    style={{ 
                      height: '100%', 
                      width: '100%',
                      display: 'block'
                    }}
                  />
                  {!blocklyLoaded && (
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="text-muted">Carregando Blockly...</p>
                    </div>
                  )}
                </div>
                <div className="card-footer text-muted">
                  Arraste blocos da caixa de ferramentas para programar o personagem
                </div>
              </div>
            </div>

            {/* Coluna Labirinto */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Labirinto - Nível 1</h5>
                  <span className={`badge ${
                    gameState === 'success' ? 'bg-success' : 
                    gameState === 'failure' ? 'bg-danger' : 
                    gameState === 'running' ? 'bg-info' : 'bg-secondary'
                  }`}>
                    {gameState === 'success' ? '🎉 Sucesso!' : 
                     gameState === 'failure' ? '❌ Falhou!' : 
                     gameState === 'running' ? '▶️ Executando' : '⏸️ Aguardando'}
                  </span>
                </div>
                <div className="card-body text-center">
                  {renderMaze()}
                </div>
                <div className="card-footer text-center text-muted">
                  Posição: ({position.x}, {position.y}) | Direção: {direction}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controles para Desktop */}
        {!isMobile && (
          <div className="row mt-4 justify-content-center">
            <div className="col-auto">
              <button
                className="btn btn-success btn-lg me-3"
                onClick={handleRunCode}
                disabled={!blocklyLoaded || !generatedCode.trim()}
              >
                ▶️ Executar Programa
              </button>
              <button
                className="btn btn-outline-secondary btn-lg"
                onClick={resetGame}
              >
                🔄 Resetar Jogo
              </button>
            </div>
          </div>
        )}

        {/* Código Gerado (Debug) */}
        {generatedCode && (
          <div className="row mt-4">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title mb-0">JavaScript Gerado</h6>
                </div>
                <div className="card-body">
                  <pre className="bg-light p-3 rounded">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-muted py-3 mt-5">
        <small>Clone do Blockly Games - Desenvolvido com React, Bootstrap e Blockly</small>
      </footer>
    </div>
  );
}

export default App;

