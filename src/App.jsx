import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Dados dos labirintos
const MAZE_LEVELS = [
  {
    level: 1,
    maxBlocks: Infinity,
    map: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 1, 3, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ]
  }
];

function App() {
  const [gameState, setGameState] = useState('idle');
  const [playerPosition, setPlayerPosition] = useState({ x: 2, y: 4, direction: 1 });
  const [currentLevel] = useState(1);

  // Dados do labirinto simples
  const mazeData = MAZE_LEVELS[currentLevel - 1].map;

  const moveForward = () => {
    console.log('Moving forward...');
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    // Calcular nova posição baseada na direção
    switch (playerPosition.direction) {
      case 0: // Norte
        newY = playerPosition.y - 1;
        break;
      case 1: // Leste
        newX = playerPosition.x + 1;
        break;
      case 2: // Sul
        newY = playerPosition.y + 1;
        break;
      case 3: // Oeste
        newX = playerPosition.x - 1;
        break;
    }

    // Verificar se a posição é válida
    if (newY >= 0 && newY < mazeData.length && 
        newX >= 0 && newX < mazeData[0].length &&
        mazeData[newY][newX] !== 0) {
      
      setPlayerPosition(prev => ({ ...prev, x: newX, y: newY }));
      
      // Verificar se chegou ao objetivo
      if (mazeData[newY][newX] === 3) {
        setGameState('success');
      }
    } else {
      setGameState('failure');
    }
  };

  const turnLeft = () => {
    console.log('Turning left...');
    setPlayerPosition(prev => ({
      ...prev,
      direction: (prev.direction + 3) % 4
    }));
  };

  const turnRight = () => {
    console.log('Turning right...');
    setPlayerPosition(prev => ({
      ...prev,
      direction: (prev.direction + 1) % 4
    }));
  };

  const handleReset = () => {
    setPlayerPosition({ x: 2, y: 4, direction: 1 });
    setGameState('idle');
  };

  const handleRun = () => {
    // Simular execução de código
    setGameState('running');
    
    // Exemplo: mover para frente duas vezes
    setTimeout(() => {
      moveForward();
      setTimeout(() => {
        moveForward();
        setGameState('idle');
      }, 500);
    }, 500);
  };

  // Renderizar labirinto com responsividade
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
              <p className="mb-0 small">Jogo do Labirinto - Nível 1</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-primary px-3 py-2">
                <span className="d-none d-sm-inline">Nível </span>1/10
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container">
        <div className="row g-3">
          {/* Editor de Blocos */}
          <div className="col-12 col-lg-6 order-2 order-lg-1">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">Editor de Blocos</h5>
              </div>
              <div className="card-body">
                <div style={{ 
                  height: typeof window !== 'undefined' && window.innerWidth < 768 ? '300px' : '400px', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '0.375rem' 
                }}>
                  <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                    <p className="text-muted mb-3 text-center">Workspace Blockly será carregado aqui</p>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      <button className="btn btn-sm btn-outline-primary" onClick={moveForward}>
                        <span className="d-none d-sm-inline">Mover </span>Frente
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={turnLeft}>
                        <span className="d-none d-sm-inline">Virar </span>↺
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={turnRight}>
                        <span className="d-none d-sm-inline">Virar </span>↻
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Labirinto */}
          <div className="col-12 col-lg-6 order-1 order-lg-2">
            <div className="card h-100">
              <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                <h5 className="mb-0">Labirinto - Nível 1</h5>
                <div>
                  {gameState === 'success' && (
                    <span className="badge bg-success">Sucesso!</span>
                  )}
                  {gameState === 'failure' && (
                    <span className="badge bg-danger">Falhou!</span>
                  )}
                  {gameState === 'running' && (
                    <span className="badge bg-primary">Executando...</span>
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
        
        <div className="row mt-3 mt-md-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center align-items-center">
              <button 
                className="btn btn-success"
                onClick={handleRun}
                disabled={gameState === 'running'}
                style={{ minWidth: '120px' }}
              >
                {gameState === 'running' ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Executando...
                  </>
                ) : (
                  <>
                    <span className="d-none d-sm-inline">▶ </span>Executar
                  </>
                )}
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={handleReset}
                style={{ minWidth: '120px' }}
              >
                <span className="d-none d-sm-inline">↻ </span>Resetar
              </button>
              <button 
                className="btn btn-outline-primary"
                style={{ minWidth: '120px' }}
              >
                <span className="d-none d-sm-inline">⚙ </span>Configurações
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-light py-3 mt-5">
        <div className="container text-center">
          <small className="text-muted">
            Clone do Blockly Games - Desenvolvido com React e Bootstrap
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;

