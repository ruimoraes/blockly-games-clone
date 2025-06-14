import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { DirectionType, SquareType, GAME_CONFIG } from '../../utils/mazeData';

function MazeRenderer({ levelData, playerPosition, gameState, skin = 0 }) {
  const svgRef = useRef(null);
  const playerRef = useRef(null);

  // Calcular dimensões do labirinto
  const rows = levelData?.map?.length || 0;
  const cols = levelData?.map?.[0]?.length || 0;
  const mazeWidth = cols * GAME_CONFIG.SQUARE_SIZE;
  const mazeHeight = rows * GAME_CONFIG.SQUARE_SIZE;

  // Renderizar o labirinto
  useEffect(() => {
    if (!svgRef.current || !levelData?.map) return;

    const svg = svgRef.current;
    
    // Limpar SVG
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Desenhar fundo
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', mazeWidth);
    background.setAttribute('height', mazeHeight);
    background.setAttribute('fill', '#F1EEE7');
    background.setAttribute('stroke', '#CCB');
    background.setAttribute('stroke-width', '1');
    svg.appendChild(background);

    // Desenhar tiles do labirinto
    levelData.map.forEach((row, y) => {
      row.forEach((cell, x) => {
        const tileX = x * GAME_CONFIG.SQUARE_SIZE;
        const tileY = y * GAME_CONFIG.SQUARE_SIZE;

        if (cell === SquareType.WALL) {
          // Parede
          const wall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          wall.setAttribute('x', tileX);
          wall.setAttribute('y', tileY);
          wall.setAttribute('width', GAME_CONFIG.SQUARE_SIZE);
          wall.setAttribute('height', GAME_CONFIG.SQUARE_SIZE);
          wall.setAttribute('fill', '#8B4513');
          wall.setAttribute('stroke', '#654321');
          wall.setAttribute('stroke-width', '1');
          svg.appendChild(wall);
        } else if (cell === SquareType.OPEN || cell === SquareType.START) {
          // Caminho livre
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          path.setAttribute('x', tileX);
          path.setAttribute('y', tileY);
          path.setAttribute('width', GAME_CONFIG.SQUARE_SIZE);
          path.setAttribute('height', GAME_CONFIG.SQUARE_SIZE);
          path.setAttribute('fill', '#FFFFFF');
          path.setAttribute('stroke', '#E0E0E0');
          path.setAttribute('stroke-width', '0.5');
          svg.appendChild(path);
        } else if (cell === SquareType.FINISH) {
          // Objetivo
          const goal = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          goal.setAttribute('x', tileX);
          goal.setAttribute('y', tileY);
          goal.setAttribute('width', GAME_CONFIG.SQUARE_SIZE);
          goal.setAttribute('height', GAME_CONFIG.SQUARE_SIZE);
          goal.setAttribute('fill', '#90EE90');
          goal.setAttribute('stroke', '#32CD32');
          goal.setAttribute('stroke-width', '2');
          svg.appendChild(goal);

          // Ícone de objetivo
          const goalIcon = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          goalIcon.setAttribute('cx', tileX + GAME_CONFIG.SQUARE_SIZE / 2);
          goalIcon.setAttribute('cy', tileY + GAME_CONFIG.SQUARE_SIZE / 2);
          goalIcon.setAttribute('r', '15');
          goalIcon.setAttribute('fill', '#FFD700');
          goalIcon.setAttribute('stroke', '#FFA500');
          goalIcon.setAttribute('stroke-width', '2');
          svg.appendChild(goalIcon);
        }
      });
    });

    // Desenhar personagem
    const playerX = playerPosition.x * GAME_CONFIG.SQUARE_SIZE + GAME_CONFIG.SQUARE_SIZE / 2;
    const playerY = playerPosition.y * GAME_CONFIG.SQUARE_SIZE + GAME_CONFIG.SQUARE_SIZE / 2;

    const player = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    player.setAttribute('id', 'player');
    player.setAttribute('transform', `translate(${playerX}, ${playerY})`);

    // Corpo do personagem
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    body.setAttribute('r', '18');
    body.setAttribute('fill', getPlayerColor(skin));
    body.setAttribute('stroke', '#333');
    body.setAttribute('stroke-width', '2');
    player.appendChild(body);

    // Direção do personagem
    const direction = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const directionPoints = getDirectionArrow(playerPosition.direction);
    direction.setAttribute('points', directionPoints);
    direction.setAttribute('fill', '#333');
    player.appendChild(direction);

    // Adicionar classe para animação
    player.classList.add('character-move');
    
    // Estado visual baseado no gameState
    if (gameState === 'success') {
      body.setAttribute('fill', '#32CD32');
    } else if (gameState === 'failure') {
      body.setAttribute('fill', '#FF6B6B');
    }

    svg.appendChild(player);
    playerRef.current = player;

  }, [levelData, playerPosition, gameState, skin, mazeWidth, mazeHeight]);

  // Função para obter cor do personagem baseada no skin
  function getPlayerColor(skinId) {
    const colors = ['#4A90E2', '#E94B3C', '#F5A623'];
    return colors[skinId] || colors[0];
  }

  // Função para obter pontos da seta de direção
  function getDirectionArrow(direction) {
    switch (direction) {
      case DirectionType.NORTH:
        return '0,-8 -6,4 6,4';
      case DirectionType.EAST:
        return '8,0 -4,-6 -4,6';
      case DirectionType.SOUTH:
        return '0,8 -6,-4 6,-4';
      case DirectionType.WEST:
        return '-8,0 4,-6 4,6';
      default:
        return '8,0 -4,-6 -4,6';
    }
  }

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Labirinto - Nível {levelData?.level}</h5>
        <div className="d-flex align-items-center gap-2">
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
      </Card.Header>
      <Card.Body className="d-flex justify-content-center align-items-center p-3">
        <div className="maze-container">
          <svg
            ref={svgRef}
            className="maze-svg"
            width={mazeWidth}
            height={mazeHeight}
            viewBox={`0 0 ${mazeWidth} ${mazeHeight}`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </Card.Body>
      <Card.Footer className="text-center">
        <small className="text-muted">
          Posição: ({playerPosition.x}, {playerPosition.y}) | 
          Direção: {['Norte', 'Leste', 'Sul', 'Oeste'][playerPosition.direction]}
        </small>
      </Card.Footer>
    </Card>
  );
}

export default MazeRenderer;

