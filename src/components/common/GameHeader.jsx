import React from 'react';
import PropTypes from 'prop-types';
import { Button, Navbar, Container } from 'react-bootstrap';
import { Home, List } from 'lucide-react';
import BlocklyNTLogo from '../ui/BlocklyNTLogo';
import './GameHeader.css';

/**
 * Header simplificado para jogos - navegação básica e informações de jogo
 */
const GameHeader = ({
  onGoHome,
  showHomeButton = true,
  gameTitle = '',
  gameIcon = '',
  currentPhase = null,
  totalPhases = null,
  onShowPhaseSelector,
  showPhaseSelector = false,
  isExecuting = false,
  className = '',
  children
}) => {return (
    <Navbar fixed="top" style={{ backgroundColor: 'var(--brand-primary)' }} variant="dark" className={`shadow-sm ${className}`}>
      <Container fluid>
        {/* Lado esquerdo - Botões de navegação */}
        <div className="d-flex align-items-center gap-2">
          {showHomeButton && (
            <div 
              onClick={onGoHome}
              title="Ir para Home"
              style={{ cursor: 'pointer' }}
              className="d-flex align-items-center"
            >
              <BlocklyNTLogo 
                size="32px" 
                color="white" 
                className="me-2"
              />
              <span className="d-none d-md-inline fw-bold text-white">Blockly NT</span>
            </div>
          )}
        </div>

        {/* Centro - Conteúdo customizado (se necessário) */}
        <div className="flex-grow-1 d-flex justify-content-center">
          {children}
        </div>        {/* Lado direito - Título, indicador de fase e seletor */}
        <div className="d-flex align-items-center gap-3">          
          {gameTitle && (
            <div className="d-flex align-items-center gap-2">
              {gameIcon && <span style={{ fontSize: '1.2rem' }}>{gameIcon}</span>}
              <h5 className="mb-0 text-white d-none d-sm-block">{gameTitle}</h5>
            </div>
          )}
          {currentPhase && totalPhases && (
            <div className="bg-white bg-opacity-25 px-2 py-1 rounded">
              <span className="text-white fw-bold">
                <span className="text-warning">{currentPhase}</span>/<span>{totalPhases}</span>
              </span>
            </div>
          )}
          {/* Botão do seletor de fases */}
          {showPhaseSelector && (
            <Button
              variant="outline-light"
              size="sm"
              onClick={onShowPhaseSelector}
              disabled={isExecuting}
              className="d-flex align-items-center gap-1"
              title="Selecionar Fase"
            >
              <List size={16} />
              <span className="d-none d-lg-inline">Fases</span>
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

GameHeader.propTypes = {
  onGoHome: PropTypes.func,
  showHomeButton: PropTypes.bool,
  gameTitle: PropTypes.string,
  gameIcon: PropTypes.string,
  currentPhase: PropTypes.number,
  totalPhases: PropTypes.number,
  onShowPhaseSelector: PropTypes.func,
  showPhaseSelector: PropTypes.bool,
  isExecuting: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default GameHeader;
