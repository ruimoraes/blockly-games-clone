import React from 'react';

export function MazeRenderer({ mazeData, playerPosition, gameState }) {
  const SQUARE_SIZE = typeof window !== 'undefined' && window.innerWidth < 576 ? 40 : 50;
  const rows = mazeData.length;
  const cols = mazeData[0].length;
  const mazeWidth = cols * SQUARE_SIZE;
  const mazeHeight = rows * SQUARE_SIZE;
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
      <rect width={mazeWidth} height={mazeHeight} fill="#F1EEE7" stroke="#CCB" strokeWidth="1" />

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
}

export default MazeRenderer;