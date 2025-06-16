import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button, Container } from 'react-bootstrap';
import MazeGame from '../games/maze/MazeGame';

const MazePage = () => {
  return (
    <div className="min-vh-100">
      {/* Navigation Header */}
      <div className="bg-primary text-white py-2">
        <Container>
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="text-decoration-none">
              <Button variant="outline-light" size="sm" className="d-flex align-items-center gap-2">
                <ArrowLeft size={16} />
                Voltar
              </Button>
            </Link>
            <div className="flex-grow-1">
              <h6 className="mb-0">Jogo do Labirinto</h6>
            </div>
            <Link to="/" className="text-decoration-none">
              <Button variant="outline-light" size="sm" className="d-flex align-items-center gap-2">
                <Home size={16} />
                Início
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* Game Content */}
      <MazeGame />
    </div>
  );
};

export default MazePage;

