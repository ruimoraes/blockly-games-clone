import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useMazeGame } from './hooks/useMazeGame';

function App() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [workspace, setWorkspace] = useState(null);
  const [blocklyLoaded, setBlocklyLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace' ou 'game'
  const [isMobile, setIsMobile] = useState(false);
  const blocklyDiv = useRef(null);
  
  const {
    gameState,
    playerPosition,
    currentLevel,
    mazeData,
    isExecuting,
    executeCode,
    resetGame
  } = useMazeGame();

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Carregar Blockly
  useEffect(() => {
    let isMounted = true;
    let workspaceInstance = null;
    
    const loadBlockly = async () => {
      try {
        console.log('Iniciando carregamento do Blockly...');
        
        if (!isMounted || !blocklyDiv.current || workspace) {
          console.log('Cancelando carregamento - componente desmontado ou workspace já existe');
          return;
        }

        // Limpar qualquer conteúdo existente no div
        if (blocklyDiv.current.firstChild) {
          blocklyDiv.current.innerHTML = '';
        }
        
        // Importar Blockly e blocos
        const Blockly = await import('blockly');
        const BlocklyBlocks = await import('blockly/blocks');
        const BlocklyJavaScript = await import('blockly/javascript');
        
        console.log('Blockly importado com sucesso');

        // Definir blocos customizados
        Blockly.Blocks['maze_move_forward'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("🚶 mover frente");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Move o personagem uma posição para frente");
            this.setHelpUrl("");
          }
        };

        Blockly.Blocks['maze_turn_left'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("↺ virar à esquerda");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(20);
            this.setTooltip("Vira o personagem 90° para a esquerda");
            this.setHelpUrl("");
          }
        };

        Blockly.Blocks['maze_turn_right'] = {
          init: function() {
            this.appendDummyInput()
                .appendField("↻ virar à direita");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(20);
            this.setTooltip("Vira o personagem 90° para a direita");
            this.setHelpUrl("");
          }
        };

        Blockly.Blocks['maze_repeat'] = {
          init: function() {
            this.appendValueInput("TIMES")
                .setCheck("Number")
                .appendField("🔄 repetir");
            this.appendStatementInput("DO")
                .setCheck(null)
                .appendField("vezes");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(120);
            this.setTooltip("Repete as ações internas um número específico de vezes");
            this.setHelpUrl("");
          }
        };

        Blockly.Blocks['maze_number'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldNumber(1, 1, 10), "NUM");
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("Um número de 1 a 10");
            this.setHelpUrl("");
          }
        };

        // Geradores de código JavaScript
        BlocklyJavaScript.javascriptGenerator.forBlock['maze_move_forward'] = function(block, generator) {
          return 'await moveForward();\n';
        };

        BlocklyJavaScript.javascriptGenerator.forBlock['maze_turn_left'] = function(block, generator) {
          return 'await turnLeft();\n';
        };

        BlocklyJavaScript.javascriptGenerator.forBlock['maze_turn_right'] = function(block, generator) {
          return 'await turnRight();\n';
        };

        BlocklyJavaScript.javascriptGenerator.forBlock['maze_repeat'] = function(block, generator) {
          const times = generator.valueToCode(block, 'TIMES', BlocklyJavaScript.javascriptGenerator.ORDER_ATOMIC) || '1';
          const statements = generator.statementToCode(block, 'DO');
          return `for (let i = 0; i < ${times}; i++) {\n${statements}}\n`;
        };

        BlocklyJavaScript.javascriptGenerator.forBlock['maze_number'] = function(block, generator) {
          const number = block.getFieldValue('NUM');
          return [number, BlocklyJavaScript.javascriptGenerator.ORDER_ATOMIC];
        };

        console.log('Blocos customizados definidos');

        // Configuração da toolbox
        const toolboxConfig = {
          "kind": "categoryToolbox",
          "contents": [
            {
              "kind": "category",
              "name": "🚶 Movimento",
              "colour": "160",
              "contents": [
                {
                  "kind": "block",
                  "type": "maze_move_forward"
                },
                {
                  "kind": "block",
                  "type": "maze_turn_left"
                },
                {
                  "kind": "block",
                  "type": "maze_turn_right"
                }
              ]
            },
            {
              "kind": "category",
              "name": "🔄 Repetição",
              "colour": "120",
              "contents": [
                {
                  "kind": "block",
                  "type": "maze_repeat",
                  "inputs": {
                    "TIMES": {
                      "shadow": {
                        "type": "maze_number",
                        "fields": {
                          "NUM": 3
                        }
                      }
                    }
                  }
                }
              ]
            },
            {
              "kind": "category",
              "name": "🔢 Números",
              "colour": "230",
              "contents": [
                {
                  "kind": "block",
                  "type": "maze_number"
                }
              ]
            }
          ]
        };

        if (blocklyDiv.current && !workspace) {
          console.log('Criando workspace Blockly...');
          
          // Criar workspace
          const newWorkspace = Blockly.inject(blocklyDiv.current, {
            toolbox: toolboxConfig,
            grid: {
              spacing: 20,
              length: 3,
              colour: '#ccc',
              snap: true
            },
            zoom: {
              controls: true,
              wheel: false, // Desabilita zoom com scroll do mouse
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

          console.log('Workspace criado:', newWorkspace);
          workspaceInstance = newWorkspace;
          
          if (!isMounted) {
            newWorkspace.dispose();
            return;
          }
          
          setWorkspace(newWorkspace);

          // Listener para mudanças no workspace
          newWorkspace.addChangeListener(() => {
            try {
              const code = BlocklyJavaScript.javascriptGenerator.workspaceToCode(newWorkspace);
              console.log('Código gerado:', code);
              setGeneratedCode(code);
            } catch (error) {
              console.error('Erro ao gerar código:', error);
            }
          });

          // Redimensionar workspace
          const handleResize = () => {
            if (newWorkspace) {
              Blockly.svgResize(newWorkspace);
            }
          };

          window.addEventListener('resize', handleResize);
          setBlocklyLoaded(true);
          console.log('Blockly carregado com sucesso!');

          // Cleanup
          return () => {
            window.removeEventListener('resize', handleResize);
            if (newWorkspace) {
              newWorkspace.dispose();
            }
          };
        }
      } catch (error) {
        console.error('Erro ao carregar Blockly:', error);
        setBlocklyLoaded(false);
      }
    };

    loadBlockly();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (workspaceInstance) {
        console.log('Limpando workspace na desmontagem...');
        workspaceInstance.dispose();
        workspaceInstance = null;
      }
    };
  }, []);

  // Função para executar o código gerado
  const handleRunCode = () => {
    if (generatedCode.trim()) {
      console.log('Executando código:', generatedCode);
      executeCode(generatedCode);
    } else {
      alert('Adicione alguns blocos ao workspace antes de executar!');
    }
  };

  // Função para limpar workspace
  const handleClearWorkspace = () => {
    if (workspace) {
      workspace.clear();
    }
  };

  // Renderizar labirinto
  const renderMaze = () => {
    const SQUARE_SIZE = typeof window !== 'undefined' && window.innerWidth < 576 ? 40 : 50;
    const rows = mazeData.length;
    const cols = mazeData[0].length;
    const mazeWidth = cols * SQUARE_SIZE;
    const mazeHeight = rows * SQUARE_SIZE;

    return (
      <svg 
        width={mazeWidth} 
        height={mazeHeight} 
        viewBox={`0 0 ${mazeWidth} ${mazeHeight}`}
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          minWidth: '280px'
        }}
      >
        {/* Fundo */}
        <rect width={mazeWidth} height={mazeHeight} fill="#F1EEE7" stroke="#CCB" strokeWidth="1"/>
        
        {/* Tiles do labirinto */}
        {mazeData.map((row, y) =>
          row.map((cell, x) => {
            const tileX = x * SQUARE_SIZE;
            const tileY = y * SQUARE_SIZE;

            if (cell === 0) {
              // Parede
              return (
                <rect
                  key={`${x}-${y}`}
                  x={tileX}
                  y={tileY}
                  width={SQUARE_SIZE}
                  height={SQUARE_SIZE}
                  fill="#8B4513"
                  stroke="#654321"
                  strokeWidth="1"
                />
              );
            } else if (cell === 1 || cell === 2) {
              // Caminho livre
              return (
                <rect
                  key={`${x}-${y}`}
                  x={tileX}
                  y={tileY}
                  width={SQUARE_SIZE}
                  height={SQUARE_SIZE}
                  fill="#FFFFFF"
                  stroke="#E0E0E0"
                  strokeWidth="0.5"
                />
              );
            } else if (cell === 3) {
              // Objetivo
              return (
                <g key={`${x}-${y}`}>
                  <rect
                    x={tileX}
                    y={tileY}
                    width={SQUARE_SIZE}
                    height={SQUARE_SIZE}
                    fill="#90EE90"
                    stroke="#32CD32"
                    strokeWidth="2"
                  />
                  <circle
                    cx={tileX + SQUARE_SIZE / 2}
                    cy={tileY + SQUARE_SIZE / 2}
                    r="15"
                    fill="#FFD700"
                    stroke="#FFA500"
                    strokeWidth="2"
                  />
                </g>
              );
            }
            return null;
          })
        )}
        
        {/* Personagem */}
        <g transform={`translate(${playerPosition.x * SQUARE_SIZE + SQUARE_SIZE / 2}, ${playerPosition.y * SQUARE_SIZE + SQUARE_SIZE / 2})`}>
          <circle
            r="18"
            fill={gameState === 'success' ? '#32CD32' : gameState === 'failure' ? '#FF6B6B' : '#4A90E2'}
            stroke="#333"
            strokeWidth="2"
          />
          <polygon
            points={getDirectionArrow(playerPosition.direction)}
            fill="#333"
          />
        </g>
      </svg>
    );
  };

  const getDirectionArrow = (direction) => {
    switch (direction) {
      case 0: // Norte
        return '0,-8 -6,4 6,4';
      case 1: // Leste
        return '8,0 -4,-6 -4,6';
      case 2: // Sul
        return '0,8 -6,-4 6,-4';
      case 3: // Oeste
        return '-8,0 4,-6 4,6';
      default:
        return '8,0 -4,-6 -4,6';
    }
  };

  return (
    <div className="container-fluid">
      <header className="bg-primary text-white py-2 py-md-3 mb-3 mb-md-4">
        <div className="container">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
            <div>
              <h1 className="h4 h3-md mb-0">Blockly Games - Clone</h1>
              <p className="mb-0 small">Jogo do Labirinto - Nível {currentLevel}</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-primary px-3 py-2">
                <span className="d-none d-sm-inline">Nível </span>{currentLevel}/10
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container">
        {isMobile ? (
          // Layout Mobile com Abas
          <div className="mobile-layout">
            {/* Navegação por Abas */}
            <div className="nav nav-tabs mb-3" role="tablist">
              <button 
                className={`nav-link ${activeTab === 'workspace' ? 'active' : ''}`}
                onClick={() => setActiveTab('workspace')}
                type="button"
              >
                🧩 Editor de Blocos
              </button>
              <button 
                className={`nav-link ${activeTab === 'game' ? 'active' : ''}`}
                onClick={() => setActiveTab('game')}
                type="button"
              >
                🎮 Labirinto
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="tab-content">
              {/* Aba do Workspace */}
              {activeTab === 'workspace' && (
                <div className="tab-pane fade show active">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Editor de Blocos Blockly</h5>
                      <div className="d-flex gap-2">
                        {blocklyLoaded ? (
                          <span className="badge bg-success">✓ Carregado</span>
                        ) : (
                          <span className="badge bg-warning">⏳ Carregando...</span>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={handleClearWorkspace}
                          disabled={isExecuting || !blocklyLoaded}
                        >
                          🗑️ Limpar
                        </button>
                      </div>
                    </div>
                    <div className="card-body p-0" style={{ height: '400px' }}>
                      <div 
                        ref={blocklyDiv}
                        style={{ height: '100%', width: '100%' }}
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
                    <div className="card-footer">
                      <small className="text-muted">
                        Arraste blocos da caixa de ferramentas para programar o personagem
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Aba do Jogo */}
              {activeTab === 'game' && (
                <div className="tab-pane fade show active">
                  <div className="card">
                    <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                      <h5 className="mb-0">Labirinto - Nível {currentLevel}</h5>
                      <div>
                        {gameState === 'success' && (
                          <span className="badge bg-success">🎉 Sucesso!</span>
                        )}
                        {gameState === 'failure' && (
                          <span className="badge bg-danger">❌ Falhou!</span>
                        )}
                        {gameState === 'running' && (
                          <span className="badge bg-primary">⚡ Executando...</span>
                        )}
                        {gameState === 'idle' && (
                          <span className="badge bg-secondary">⏸️ Aguardando</span>
                        )}
                      </div>
                    </div>
                    <div className="card-body d-flex justify-content-center align-items-center p-2 p-sm-3">
                      <div style={{ 
                        maxWidth: '100%', 
                        overflow: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        {renderMaze()}
                      </div>
                    </div>
                    <div className="card-footer text-center">
                      <small className="text-muted">
                        <span className="d-block d-sm-inline">Posição: ({playerPosition.x}, {playerPosition.y})</span>
                        <span className="d-none d-sm-inline"> | </span>
                        <span className="d-block d-sm-inline">Direção: {['Norte', 'Leste', 'Sul', 'Oeste'][playerPosition.direction]}</span>
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Layout Desktop (duas colunas)
          <div className="row g-3">
            {/* Editor de Blocos Blockly */}
            <div className="col-12 col-lg-6 order-2 order-lg-1">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Editor de Blocos Blockly</h5>
                  <div className="d-flex gap-2">
                    {blocklyLoaded ? (
                      <span className="badge bg-success">✓ Blockly Carregado</span>
                    ) : (
                      <span className="badge bg-warning">⏳ Carregando...</span>
                    )}
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleClearWorkspace}
                      disabled={isExecuting || !blocklyLoaded}
                    >
                      🗑️ Limpar
                    </button>
                  </div>
                </div>
                <div className="card-body p-0" style={{ height: '400px' }}>
                  <div 
                    ref={blocklyDiv}
                    style={{ height: '100%', width: '100%' }}
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
                <div className="card-footer">
                  <small className="text-muted">
                    Arraste blocos da caixa de ferramentas para programar o personagem
                  </small>
                </div>
              </div>
            </div>
            
            {/* Labirinto */}
            <div className="col-12 col-lg-6 order-1 order-lg-2">
              <div className="card h-100">
                <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                  <h5 className="mb-0">Labirinto - Nível {currentLevel}</h5>
                  <div>
                    {gameState === 'success' && (
                      <span className="badge bg-success">🎉 Sucesso!</span>
                    )}
                    {gameState === 'failure' && (
                      <span className="badge bg-danger">❌ Falhou!</span>
                    )}
                    {gameState === 'running' && (
                      <span className="badge bg-primary">⚡ Executando...</span>
                    )}
                    {gameState === 'idle' && (
                      <span className="badge bg-secondary">⏸️ Aguardando</span>
                    )}
                  </div>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center p-2 p-sm-3">
                  <div style={{ 
                    maxWidth: '100%', 
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {renderMaze()}
                  </div>
                </div>
                <div className="card-footer text-center">
                  <small className="text-muted">
                    <span className="d-block d-sm-inline">Posição: ({playerPosition.x}, {playerPosition.y})</span>
                    <span className="d-none d-sm-inline"> | </span>
                    <span className="d-block d-sm-inline">Direção: {['Norte', 'Leste', 'Sul', 'Oeste'][playerPosition.direction]}</span>
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Controles */}
        <div className="row mt-3 mt-md-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center align-items-center">
              <button 
                className="btn btn-success btn-lg"
                onClick={handleRunCode}
                disabled={isExecuting || !blocklyLoaded || !generatedCode.trim()}
                style={{ minWidth: '150px' }}
              >
                {isExecuting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Executando...
                  </>
                ) : (
                  <>
                    ▶️ Executar Programa
                  </>
                )}
              </button>
              <button 
                className="btn btn-outline-secondary btn-lg"
                onClick={resetGame}
                disabled={isExecuting}
                style={{ minWidth: '150px' }}
              >
                🔄 Resetar Jogo
              </button>
            </div>
          </div>
        </div>

        {/* Debug: Código Gerado */}
        {generatedCode && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">📝 Código JavaScript Gerado</h6>
                </div>
                <div className="card-body">
                  <pre className="bg-light p-3 rounded" style={{ fontSize: '0.85rem', maxHeight: '200px', overflow: 'auto' }}>
                    <code>{generatedCode || '// Nenhum código gerado ainda'}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-light py-3 mt-5">
        <div className="container text-center">
          <small className="text-muted">
            Clone do Blockly Games - Desenvolvido com React, Bootstrap e Blockly
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;

