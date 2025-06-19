import React from 'react';
import PropTypes from 'prop-types';
import { Button, Navbar, Container } from 'react-bootstrap';
import { Home } from 'lucide-react';
import BlocklyNTLogo from '../ui/BlocklyNTLogo';

/**
 * Header simplificado para jogos - apenas navegação básica
 */
const GameHeader = ({
  onGoHome,
  showHomeButton = true,
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
        </div>

        {/* Lado direito - Espaço reservado para futuros controles */}
        <div className="d-flex align-items-center gap-2">
          {/* Espaço para controles futuros */}
        </div>
      </Container>
    </Navbar>
  );
};

GameHeader.propTypes = {
  onGoHome: PropTypes.func,
  showHomeButton: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default GameHeader;
