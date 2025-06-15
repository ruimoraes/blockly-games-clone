import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useMaze } from '../../hooks/useMaze';
import { useBlockly } from '../../hooks/useBlockly';
import BlocklyWorkspace from '../blockly/BlocklyWorkspace';
import MazeRenderer from './MazeRenderer';

function MazeGame({ initialLevel = 1 }) {
  const {
    currentLevel,
    gameState,
    playerPosition,
    getCurrentLevelData,
    resetGame,
    changeLevel,
    setGameState,
    moveForward,
    turnLeft,
    turnRight,
    isPathForward,
    isPathLeft,
    isPathRight,
    atGoal,
    noPathForward,
    noPathLeft,
    noPathRight
  } = useMaze(initialLevel);

  const levelData = getCurrentLevelData();

  // Ações do jogo para o Blockly
  const gameActions = {
    moveForward,
    turnLeft,
    turnRight,
    isPathForward,
    isPathLeft,
    isPathRight,
    atGoal,
    noPathForward,
    noPathLeft,
    noPathRight
  };

  const {
    executeCode,
    clearWorkspace
  } = useBlockly('blockly-workspace', gameActions);

  // Executar código do Blockly
  const handleRun = async () => {
    if (gameState === 'running') return;
    
    setGameState('running');
    
    try {
      const success = await executeCode();
      
      // Verificar se chegou ao objetivo
      if (atGoal()) {
        setGameState('success');
      } else if (!success) {
        setGameState('failure');
      } else {
        setGameState('idle');
      }
    } catch (error) {
      console.error('Erro na execução:', error);
      setGameState('failure');
    }
  };

  // Resetar jogo
  const handleReset = () => {
    resetGame();
    clearWorkspace();
  };

  // Mudar nível
  const handleLevelChange = (newLevel) => {
    changeLevel(newLevel);
    clearWorkspace();
  };

  return (
    <div className="game-layout">
      <Row className="h-100 g-3">
        {/* Workspace Blockly */}
        <Col lg={6} className="d-flex flex-column">
          <BlocklyWorkspace
            gameActions={gameActions}
            maxBlocks={levelData?.maxBlocks}
            onCodeChange={(code) => {
              // Callback para mudanças no código se necessário
            }}
          />
        </Col>

        {/* Labirinto */}
        <Col lg={6} className="d-flex flex-column">
          <MazeRenderer
            levelData={levelData}
            playerPosition={playerPosition}
            gameState={gameState}
            skin={0} // Pode ser configurável
          />
        </Col>
      </Row>
    </div>
  );
}

export default MazeGame;

