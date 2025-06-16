import React from 'react';

const PuzzleToolbar = ({ 
  onCheckSolution, 
  onResetPuzzle, 
  onShowHint,
  correctCount,
  totalAnimals,
  isComplete 
}) => {
  return (
    <div className="puzzle-toolbar">
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-text">
            Progresso: {correctCount}/{totalAnimals} animais corretos
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(correctCount / totalAnimals) * 100}%` }}
            />
          </div>
        </div>
        
        {isComplete && (
          <div className="completion-badge">
            🎉 Puzzle Completo!
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <button 
          className="btn btn-primary"
          onClick={onCheckSolution}
          title="Verificar se a solução está correta"
        >
          🔍 Verificar Solução
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={onShowHint}
          title="Mostrar dica para resolver o puzzle"
        >
          💡 Dica
        </button>
        
        <button 
          className="btn btn-danger"
          onClick={onResetPuzzle}
          title="Limpar todos os blocos e recomeçar"
        >
          🔄 Resetar
        </button>
      </div>
      
      <style jsx>{`
        .puzzle-toolbar {
          background: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .progress-section {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 200px;
        }
        
        .progress-info {
          flex: 1;
          max-width: 300px;
        }
        
        .progress-text {
          display: block;
          font-size: 0.9rem;
          color: #5a6c7d;
          margin-bottom: 6px;
          font-weight: 500;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #ecf0f1;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #2ecc71);
          transition: width 0.3s ease;
          border-radius: 4px;
        }
        
        .completion-badge {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
          white-space: nowrap;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .btn:active {
          transform: translateY(0);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #2980b9, #1f5f8b);
        }
        
        .btn-secondary {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
        }
        
        .btn-secondary:hover {
          background: linear-gradient(135deg, #e67e22, #d35400);
        }
        
        .btn-danger {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
        }
        
        .btn-danger:hover {
          background: linear-gradient(135deg, #c0392b, #a93226);
        }
        
        @media (max-width: 768px) {
          .puzzle-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .progress-section {
            justify-content: center;
          }
          
          .action-buttons {
            justify-content: center;
          }
          
          .btn {
            flex: 1;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default PuzzleToolbar;

