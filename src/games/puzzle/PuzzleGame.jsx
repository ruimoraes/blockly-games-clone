import React from 'react';
import { Container, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { usePuzzleGame } from './hooks/usePuzzleGame';
import PuzzleGameArea from './components/PuzzleGameArea';
import AnimalConfigModal from './components/AnimalConfigModal';
import PhaseSelector from '../../components/common/PhaseSelector';

function PuzzleGame() {
  const {
    // Estado do jogo
    configuredAnimals,
    selectedAnimal,
    showConfigModal,
    animals,
    targetTraits,
    currentPhaseData,
    
    // Ações
    configureAnimal,
    openConfigModal,
    closeConfigModal,
    resetPhase,
    getAnimalConfig,
    
    // Verificações
    checkPhaseCompletion,
    getPhaseProgress,
    
    // Dados das fases
    currentPhase,
    totalPhases,
    unlockedPhases,
    completedPhases,
    gameConfig,
    changePhase,
    goToNextPhase,
    goToPreviousPhase,
    getPhaseData
  } = usePuzzleGame();

  const [showPhaseSelector, setShowPhaseSelector] = React.useState(false);

  const handleAnimalSave = (config) => {
    if (selectedAnimal) {
      configureAnimal(selectedAnimal.name, config);
    }
  };

  const isPhaseComplete = checkPhaseCompletion();
  const progress = getPhaseProgress();

  return (
    <Container fluid className="puzzle-game-container">
      {/* Header */}
      <div className="bg-primary text-white p-3 mb-4">
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center gap-3">
              <Link to="/" className="btn btn-outline-light btn-sm">
                ← Voltar
              </Link>
              <div>
                <h4 className="mb-0">Quebra-Cabeça</h4>
                <small>{currentPhaseData?.name} - Fase {currentPhase}</small>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <div className="d-flex align-items-center gap-2">
              <Link to="/" className="btn btn-outline-light btn-sm">
                🏠 Início
              </Link>
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={() => setShowPhaseSelector(true)}
              >
                📋 Fases
              </Button>
              <Badge bg="success" className="px-3 py-2">
                Fase {currentPhase}/{totalPhases}
              </Badge>
            </div>
          </Col>
        </Row>
      </div>

      <Container>
        <Row>
          <Col lg={8}>
            {/* Área principal do jogo */}
            <PuzzleGameArea
              animals={animals}
              configuredAnimals={configuredAnimals}
              onAnimalConfigure={openConfigModal}
              phaseData={currentPhaseData}
              progress={progress}
            />
          </Col>
          
          <Col lg={4}>
            {/* Painel lateral */}
            <div className="sticky-top" style={{ top: '20px' }}>
              {/* Informações da fase */}
              <div className="card mb-3">
                <div className="card-header">
                  <h6 className="mb-0">📊 Informações da Fase</h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <small className="text-muted">Dificuldade:</small>
                    <Badge 
                      bg={
                        currentPhaseData?.difficulty === 'easy' ? 'success' :
                        currentPhaseData?.difficulty === 'medium' ? 'warning' : 'danger'
                      }
                      className="ms-2"
                    >
                      {currentPhaseData?.difficulty === 'easy' ? 'Fácil' :
                       currentPhaseData?.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">Limite de blocos:</small>
                    <Badge bg="info" className="ms-2">
                      {currentPhaseData?.maxBlocks === Infinity ? 'Ilimitado' : currentPhaseData?.maxBlocks}
                    </Badge>
                  </div>

                  <div>
                    <small className="text-muted">Características disponíveis:</small>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {targetTraits.map(trait => (
                        <Badge key={trait} bg="secondary" className="small">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">🎮 Controles</h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={resetPhase}
                    >
                      🔄 Resetar Fase
                    </Button>
                    
                    <hr />
                    
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={goToPreviousPhase}
                      disabled={currentPhase === 1}
                    >
                      ← Fase Anterior
                    </Button>
                    
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={goToNextPhase}
                      disabled={!isPhaseComplete || currentPhase === totalPhases}
                    >
                      Próxima Fase →
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status da fase */}
              {isPhaseComplete && (
                <Alert variant="success" className="mt-3 text-center">
                  <h6>🎉 Fase Completa!</h6>
                  <small>Todos os animais foram configurados corretamente!</small>
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal de configuração */}
      <AnimalConfigModal
        animal={selectedAnimal}
        isVisible={showConfigModal}
        onClose={closeConfigModal}
        onSave={handleAnimalSave}
        availableTraits={targetTraits}
        currentConfig={selectedAnimal ? getAnimalConfig(selectedAnimal.name) : null}
      />

      {/* Seletor de fases */}
      <PhaseSelector
        currentPhase={currentPhase}
        unlockedPhases={unlockedPhases}
        completedPhases={completedPhases}
        totalPhases={totalPhases}
        onPhaseSelect={(phase) => {
          changePhase(phase);
          setShowPhaseSelector(false);
        }}
        getPhaseData={getPhaseData}
        gameConfig={gameConfig}
        isVisible={showPhaseSelector}
        onClose={() => setShowPhaseSelector(false)}
      />
    </Container>
  );
}

export default PuzzleGame;

