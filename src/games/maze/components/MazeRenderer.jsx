import React, { useEffect, useState, useRef } from 'react';

export function MazeRenderer({ mazeData, playerPosition, gameState }) {
  const containerRef = useRef(null);
  
  // Calcular o tamanho responsivo dos blocos com base no tamanho disponível
  const [squareSize, setSquareSize] = useState(
    typeof window !== 'undefined' && window.innerWidth < 576 ? 40 : 50
  );
  
  useEffect(() => {
    // Função para calcular o tamanho ideal dos blocos baseado no container
    const calculateSquareSize = () => {
      if (!containerRef.current) return;
      
      // Obtém as dimensões do container
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Calcula o tamanho ideal considerando o número de células do labirinto
      const cols = mazeData[0].length;
      const rows = mazeData.length;
      
      // Tamanho sugerido baseado no container (com uma pequena margem)
      const suggestedWidth = (containerWidth * 0.98) / cols;
      const suggestedHeight = (containerHeight * 0.98) / rows;
      
      // Escolher o menor para garantir que caiba
      const suggestedSize = Math.min(suggestedWidth, suggestedHeight);
      
      // Limites mínimo e máximo
      const minSize = 25;
      const maxSize = 60;
      
      const newSize = Math.min(Math.max(minSize, suggestedSize), maxSize);
      setSquareSize(newSize);
    };
    
    // Calcular o tamanho inicial
    calculateSquareSize();
    
    // Adicionar event listener para recalcular quando o tamanho mudar
    window.addEventListener('resize', calculateSquareSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', calculateSquareSize);
    };
  }, [mazeData]);
  
  const rows = mazeData.length;
  const cols = mazeData[0].length;
  const mazeWidth = cols * squareSize;
  const mazeHeight = rows * squareSize;
  
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
  
  return (    <div 
      ref={containerRef}
      className="maze-container d-flex justify-content-center align-items-center w-100 h-100"
      style={{ padding: 0, borderRadius: 0, overflow: 'hidden' }}
    >
      <svg
        width={mazeWidth}
        height={mazeHeight}
        viewBox={`0 0 ${mazeWidth} ${mazeHeight}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Fundo sem borda */}
        <rect width={mazeWidth} height={mazeHeight} fill="#F1EEE7" strokeWidth="0" />

        {/* Tiles do labirinto */}
        {mazeData.map((row, y) =>
          row.map((cell, x) => {
            const tileX = x * squareSize;
            const tileY = y * squareSize;

            if (cell === 0) {
              // Parede
              return (
                <rect
                  key={`${x}-${y}`}
                  x={tileX}
                  y={tileY}
                  width={squareSize}
                  height={squareSize}
                  fill="#8B4513"
                  stroke="#654321"
                  strokeWidth="0.5"
                />
              );
            } else if (cell === 1 || cell === 2) {
              // Caminho livre
              return (
                <rect
                  key={`${x}-${y}`}
                  x={tileX}
                  y={tileY}
                  width={squareSize}
                  height={squareSize}
                  fill="#FFFFFF"
                  stroke="#E0E0E0"
                  strokeWidth="0.2"
                />
              );
            } else if (cell === 3) {
              // Objetivo
              return (
                <g key={`${x}-${y}`}>
                  <rect
                    x={tileX}
                    y={tileY}
                    width={squareSize}
                    height={squareSize}
                    fill="#90EE90"
                    stroke="#32CD32"
                    strokeWidth="1"
                  />
                  <circle
                    cx={tileX + squareSize / 2}
                    cy={tileY + squareSize / 2}
                    r={squareSize / 3}
                    fill="#FFD700"
                    stroke="#FFA500"
                    strokeWidth="1"
                  />
                </g>
              );
            }
            return null;
          })
        )}

        {/* Personagem */}
        <g transform={`translate(${playerPosition.x * squareSize + squareSize / 2}, ${playerPosition.y * squareSize + squareSize / 2})`}>
          <circle
            r={squareSize / 2.8}
            fill={gameState === 'success' ? '#32CD32' : gameState === 'failure' ? '#FF6B6B' : '#4A90E2'}
            stroke="#333"
            strokeWidth="1.5"
          />
          <polygon
            points={getDirectionArrow(playerPosition.direction)}
            transform={`scale(${squareSize/50})`}
            fill="#333"
          />
        </g>
      </svg>
    </div>
  );
}

export default MazeRenderer;