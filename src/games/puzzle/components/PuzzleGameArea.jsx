import React from 'react';
import { Row, Col, Alert, ProgressBar } from 'react-bootstrap';
import AnimalCard from './AnimalCard';

const PuzzleGameArea = ({ 
  animals, 
  configuredAnimals, 
  onAnimalConfigure,
  phaseData,
  progress 
}) => {
  const getAnimalConfig = (animalName) => {
    return configuredAnimals.find(config => config.name === animalName);
  };

  const isAnimalConfigured = (animalName) => {
    const config = getAnimalConfig(animalName);
    return config && config.picture && config.legs !== undefined && config.traits.length > 0;
  };

  const completedCount = animals.filter(animal => isAnimalConfigured(animal.name)).length;
  const progressPercentage = (completedCount / animals.length) * 100;

  return (
    <div className="puzzle-game-area">
      <Alert variant="info" className="mb-4">
        <h6 className="mb-2">📋 Instruções da Fase</h6>
        <p className="mb-0">{phaseData.instructions}</p>
      </Alert>

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Progresso da Fase</h6>
          <small className="text-muted">{completedCount}/{animals.length} animais configurados</small>
        </div>
        <ProgressBar 
          now={progressPercentage} 
          variant={progressPercentage === 100 ? 'success' : 'primary'}
          style={{ height: '8px' }}
        />
      </div>

      <Row className="g-3">
        {animals.map((animal, index) => (
          <Col key={animal.name} xs={6} md={4} lg={3}>
            <AnimalCard
              animal={animal}
              isConfigured={isAnimalConfigured(animal.name)}
              onConfigure={() => onAnimalConfigure(animal)}
            />
          </Col>
        ))}
      </Row>

      {progressPercentage === 100 && (
        <Alert variant="success" className="mt-4 text-center">
          <h5>🎉 Parabéns!</h5>
          <p className="mb-0">Você configurou todos os animais desta fase!</p>
        </Alert>
      )}
    </div>
  );
};

export default PuzzleGameArea;

