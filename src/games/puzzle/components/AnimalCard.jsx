import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const AnimalCard = ({ animal, isConfigured, onConfigure }) => {
  const { name, displayName, picture, legs, traits, color } = animal;

  return (
    <Card 
      className={`h-100 animal-card ${isConfigured ? 'configured' : 'unconfigured'}`}
      style={{ 
        borderColor: isConfigured ? color : '#dee2e6',
        borderWidth: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={onConfigure}
    >
      <Card.Body className="text-center p-3">
        <div className="mb-3">
          <img 
            src={picture} 
            alt={displayName}
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'contain',
              filter: isConfigured ? 'none' : 'grayscale(100%)'
            }}
          />
        </div>
        
        <h6 className="card-title mb-2" style={{ color: isConfigured ? color : '#6c757d' }}>
          {displayName}
        </h6>
        
        {isConfigured ? (
          <div>
            <div className="mb-2">
              <small className="text-muted">Pernas: </small>
              <Badge bg="primary" className="ms-1">{legs}</Badge>
            </div>
            
            <div className="d-flex flex-wrap justify-content-center gap-1">
              {traits.map((trait, index) => (
                <Badge 
                  key={index} 
                  bg="secondary" 
                  className="small"
                  style={{ fontSize: '0.7rem' }}
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-muted">
            <small>Clique para configurar</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AnimalCard;

