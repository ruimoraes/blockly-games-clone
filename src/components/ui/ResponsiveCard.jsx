import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * ResponsiveCard - Componente de card responsivo com efeitos visuais
 */
const ResponsiveCard = ({ 
  children, 
  variant = 'solid',
  hover = true,
  animation = false,
  className = '',
  style = {},
  ...props 
}) => {
  const getCardVariant = (variant) => {
    const variants = {
      glass: 'glass-card',
      glassDark: 'glass-card-dark',
      solid: 'bg-white',
      transparent: 'bg-transparent'
    };
    return variants[variant] || variants.glass;
  };

  const getCardClasses = () => {
    let classes = ['border-0', 'shadow-lg', getCardVariant(variant)];
    
    if (hover) {
      classes.push('hover-lift', 'game-card');
    }
    
    if (animation) {
      classes.push('floating-card');
    }
    
    classes.push(className);
    
    return classes.join(' ');
  };

  const cardStyle = {
    borderRadius: 'var(--border-radius-lg)',
    transition: 'all var(--transition-medium)',
    ...style
  };

  return (
    <Card 
      className={getCardClasses()}
      style={cardStyle}
      {...props}
    >
      {children}
    </Card>
  );
};

// Adicionar Card.Body como propriedade do componente
ResponsiveCard.Body = Card.Body;

ResponsiveCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['glass', 'glassDark', 'solid', 'transparent']),
  hover: PropTypes.bool,
  animation: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ResponsiveCard;
