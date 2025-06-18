import React from 'react';
import PropTypes from 'prop-types';
import { Button, Navbar, Container } from 'react-bootstrap';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * Header simplificado para jogos - apenas navegação básica
 */
const GameHeader = ({
  onGoHome,
  onGoBack,
  showHomeButton = true,
  showBackButton = false,
  className = '',
  children
}) => {
  return (
    <Navbar style={{ backgroundColor: 'var(--brand-primary)' }} variant="dark" className={`shadow-sm ${className}`}>
      <Container fluid>
        {/* Lado esquerdo - Botões de navegação */}
        <div className="d-flex align-items-center gap-2">
          {showBackButton && (
            <Button
              variant="outline-light"
              size="sm"
              onClick={onGoBack}
              title="Voltar"
            >
              <ArrowLeft size={16} />
            </Button>
          )}
          
          {showHomeButton && (
            <Button
              variant="outline-light"
              size="sm"
              onClick={onGoHome}
              title="Ir para Home"
            >
              <Home size={16} />
              <span className="d-none d-md-inline ms-1">Home</span>
            </Button>
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
  onGoBack: PropTypes.func,
  showHomeButton: PropTypes.bool,
  showBackButton: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default GameHeader;
