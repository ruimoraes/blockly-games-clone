import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { Lock, CheckCircle, Play, Star } from 'lucide-react';

const PhaseSelector = ({ 
  currentPhase, 
  unlockedPhases, 
  completedPhases, 
  totalPhases, 
  onPhaseSelect, 
  getPhaseData,
  isVisible = false,
  onClose 
}) => {
  if (!isVisible) return null;

  const getDifficultyColor = (level) => {
    if (level <= 3) return 'success';
    if (level <= 6) return 'warning';
    if (level <= 8) return 'danger';
    return 'dark';
  };

  const getDifficultyText = (level) => {
    if (level <= 3) return 'Fácil';
    if (level <= 6) return 'Médio';
    if (level <= 8) return 'Difícil';
    return 'Extremo';
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
        zIndex: 1050,
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3 p-4 shadow-lg"
        style={{ 
          maxWidth: '90vw', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          width: '800px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">
            <Star className="me-2" size={24} />
            Selecionar Fase
          </h3>
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center gap-3 text-sm text-muted">
            <div className="d-flex align-items-center gap-1">
              <CheckCircle size={16} className="text-success" />
              <span>{completedPhases.length} Completadas</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <Play size={16} className="text-primary" />
              <span>{unlockedPhases.length} Desbloqueadas</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <Lock size={16} className="text-muted" />
              <span>{totalPhases - unlockedPhases.length} Bloqueadas</span>
            </div>
          </div>
        </div>

        <Row className="g-3">
          {Array.from({ length: totalPhases }, (_, index) => {
            const phaseNumber = index + 1;
            const isUnlocked = unlockedPhases.includes(phaseNumber);
            const isCompleted = completedPhases.includes(phaseNumber);
            const isCurrent = currentPhase === phaseNumber;
            const phaseData = getPhaseData(phaseNumber);

            return (
              <Col key={phaseNumber} md={6} lg={4}>
                <Card 
                  className={`h-100 ${isCurrent ? 'border-primary' : ''} ${!isUnlocked ? 'opacity-50' : ''}`}
                  style={{ 
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    transform: isCurrent ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onClick={() => isUnlocked && onPhaseSelect(phaseNumber)}
                >
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                            isCurrent ? 'bg-primary text-white' : 
                            isCompleted ? 'bg-success text-white' : 
                            isUnlocked ? 'bg-light text-dark' : 'bg-secondary text-white'
                          }`}
                          style={{ width: '32px', height: '32px', fontSize: '14px' }}
                        >
                          {isCompleted ? <CheckCircle size={16} /> : 
                           !isUnlocked ? <Lock size={16} /> : phaseNumber}
                        </div>
                        <Badge bg={getDifficultyColor(phaseNumber)} className="small">
                          {getDifficultyText(phaseNumber)}
                        </Badge>
                      </div>
                      {isCurrent && (
                        <Badge bg="primary" className="small">
                          Atual
                        </Badge>
                      )}
                    </div>

                    <h6 className="card-title mb-2">
                      Fase {phaseNumber}
                    </h6>
                    
                    <h6 className="text-primary mb-2" style={{ fontSize: '14px' }}>
                      {phaseData.name}
                    </h6>
                    
                    <p className="card-text small text-muted mb-3">
                      {phaseData.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {phaseData.maxBlocks === Infinity ? 
                          'Blocos ilimitados' : 
                          `Máx: ${phaseData.maxBlocks} blocos`
                        }
                      </small>
                      
                      {isUnlocked && (
                        <Button 
                          variant={isCurrent ? 'primary' : 'outline-primary'} 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPhaseSelect(phaseNumber);
                          }}
                        >
                          {isCurrent ? 'Atual' : 'Jogar'}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        <div className="mt-4 pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              Progresso: {completedPhases.length}/{totalPhases} fases completadas
            </div>
            <div className="progress" style={{ width: '200px', height: '8px' }}>
              <div 
                className="progress-bar bg-success" 
                style={{ width: `${(completedPhases.length / totalPhases) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseSelector;

