import React from 'react';
import PropTypes from 'prop-types';
import logoSvg from '../../assets/logont.svg';

/**
 * BlocklyNTLogo - Componente do logo da aplicação usando logont.svg
 */
const BlocklyNTLogo = ({ 
  size = 24, 
  className = "",
  style = {},
  ...props 
}) => {
  return (
    <img
      src={logoSvg}
      width={size}
      height={size}
      alt="Blockly NT Logo"
      className={className}
      style={{ 
        display: 'inline-block',
        ...style
      }}
      {...props}
    />
  );
};

BlocklyNTLogo.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object
};

export default BlocklyNTLogo;
