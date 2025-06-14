import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Play, RotateCcw, Settings, Home } from 'lucide-react';

function GameLayout({ children, onRun, onReset, onSettings, currentLevel, maxLevel, gameState }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <Container fluid>
          <Row className="align-items-center py-3">
            <Col xs={12} md={6}>
              <div className="d-flex align-items-center gap-3">
                <Home className="text-primary" size={24} />
                <h1 className="h4 mb-0 text-foreground">Blockly Games</h1>
                <span className="badge bg-primary">Maze</span>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="d-flex align-items-center justify-content-md-end gap-2 mt-2 mt-md-0">
                <span className="level-indicator">
                  Nível {currentLevel} de {maxLevel}
                </span>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success d-flex align-items-center gap-2"
                    onClick={onRun}
                    disabled={gameState === 'running'}
                  >
                    <Play size={16} />
                    <span className="d-none d-sm-inline">Executar</span>
                  </button>
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                    onClick={onReset}
                  >
                    <RotateCcw size={16} />
                    <span className="d-none d-sm-inline">Resetar</span>
                  </button>
                  <button
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                    onClick={onSettings}
                  >
                    <Settings size={16} />
                    <span className="d-none d-sm-inline">Config</span>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1">
        <Container fluid className="py-4">
          {children}
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border py-3">
        <Container fluid>
          <Row>
            <Col xs={12} className="text-center">
              <small className="text-muted-foreground">
                Clone do Blockly Games - Desenvolvido com React e Bootstrap
              </small>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default GameLayout;

