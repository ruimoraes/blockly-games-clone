import React from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * ResponsiveFooter - Componente de footer responsivo
 */
const ResponsiveFooter = ({ 
  text = "© 2025 Blockly NT - Sistema de Registry Dinâmico v3.0",
  className = ""
}) => {
  return (
    <footer 
      className={`py-3 py-md-4 mt-5 ${className}`}
      style={{ background: 'rgba(0, 0, 0, 0.2)' }}
    >
      <Container>
        <div className="text-center">
          <p 
            className="mb-0 text-white-50"
            style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
          >
            {text}
          </p>
        </div>
      </Container>
    </footer>
  );
};

ResponsiveFooter.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string
};

export default ResponsiveFooter;
