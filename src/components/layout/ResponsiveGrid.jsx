import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * ResponsiveGrid - Componente de grid responsivo otimizado
 */
const ResponsiveGrid = ({ 
  children, 
  fluid = false,
  spacing = 'default',
  justify = 'start',
  align = 'stretch',
  className = ''
}) => {
  const getSpacingClass = (spacing) => {
    const spacingClasses = {
      none: 'g-0',
      small: 'g-2 g-md-3',
      default: 'g-3 g-md-4',
      large: 'g-4 g-md-5'
    };
    return spacingClasses[spacing] || spacingClasses.default;
  };

  return (
    <Container fluid={fluid} className={className}>
      <Row 
        className={`
          ${getSpacingClass(spacing)} 
          justify-content-${justify} 
          align-items-${align}
        `}
      >
        {children}
      </Row>
    </Container>
  );
};

/**
 * ResponsiveCol - Componente de coluna responsiva
 */
export const ResponsiveCol = ({ 
  children, 
  xs = 12, 
  sm, 
  md, 
  lg, 
  xl, 
  xxl,
  className = '',
  ...props 
}) => {
  return (
    <Col 
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      xxl={xxl}
      className={className}
      {...props}
    >
      {children}
    </Col>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  fluid: PropTypes.bool,
  spacing: PropTypes.oneOf(['none', 'small', 'default', 'large']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'around', 'between', 'evenly']),
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  className: PropTypes.string
};

ResponsiveCol.propTypes = {
  children: PropTypes.node.isRequired,
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  xl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  xxl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string
};

export default ResponsiveGrid;
