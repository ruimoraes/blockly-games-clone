import React from 'react';
import { ANIMALS_DATA } from '../blocks/puzzleBlocks';

const AnimalDisplay = ({ animalId, isCorrect }) => {
  if (!animalId || animalId === '0') {
    return (
      <div className="animal-display empty">
        <div className="animal-placeholder">
          <span>?</span>
          <p>Animal não selecionado</p>
        </div>
      </div>
    );
  }

  const animal = ANIMALS_DATA[parseInt(animalId) - 1];
  if (!animal) return null;

  return (
    <div className={`animal-display ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="animal-header">
        <h3>{animal.name}</h3>
        <div className={`status-indicator ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? '✓' : '✗'}
        </div>
      </div>
      
      <div className="animal-image">
        <img 
          src={animal.pic} 
          alt={animal.name}
          onError={(e) => {
            e.target.src = '/images/animals/placeholder.png';
          }}
        />
      </div>
      
      <div className="animal-info">
        <div className="property">
          <strong>Pernas:</strong> {animal.legs}
        </div>
        <div className="property">
          <strong>Características:</strong>
          <div className="traits">
            {animal.traits.map((trait, index) => (
              <span key={index} className="trait-badge">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PuzzleDisplay = ({ animalStates }) => {
  return (
    <div className="puzzle-display">
      <h2>🧩 Quebra-Cabeça dos Animais</h2>
      <p className="instructions">
        Configure cada animal usando os blocos Blockly. Arraste os blocos para definir:
        <strong> imagem, número de pernas e características</strong>.
      </p>
      
      <div className="animals-grid">
        {animalStates.map((state, index) => (
          <AnimalDisplay
            key={index}
            animalId={state.animalId}
            isCorrect={state.isCorrect}
          />
        ))}
      </div>
      
      <style>{`
        .puzzle-display {
          padding: 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .puzzle-display h2 {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 1.8rem;
        }
        
        .instructions {
          text-align: center;
          color: #5a6c7d;
          margin-bottom: 20px;
          font-size: 1.1rem;
          line-height: 1.5;
        }
        
        .animals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .animal-display {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 3px solid transparent;
        }
        
        .animal-display.correct {
          border-color: #27ae60;
          box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
        }
        
        .animal-display.incorrect {
          border-color: #e74c3c;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        }
        
        .animal-display.empty {
          border-color: #bdc3c7;
          background: #f8f9fa;
        }
        
        .animal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .animal-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.3rem;
        }
        
        .status-indicator {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          color: white;
        }
        
        .status-indicator.correct {
          background: #27ae60;
        }
        
        .status-indicator.incorrect {
          background: #e74c3c;
        }
        
        .animal-image {
          text-align: center;
          margin-bottom: 12px;
        }
        
        .animal-image img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #ecf0f1;
        }
        
        .animal-placeholder {
          text-align: center;
          color: #7f8c8d;
          padding: 20px;
        }
        
        .animal-placeholder span {
          font-size: 3rem;
          display: block;
          margin-bottom: 8px;
        }
        
        .property {
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
        
        .property strong {
          color: #2c3e50;
        }
        
        .traits {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }
        
        .trait-badge {
          background: #3498db;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .animals-grid {
            grid-template-columns: 1fr;
          }
          
          .puzzle-display h2 {
            font-size: 1.5rem;
          }
          
          .instructions {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PuzzleDisplay;

