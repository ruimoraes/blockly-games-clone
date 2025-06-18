import React from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * ResponsiveLayout - Componente de layout responsivo com design system
 */
const ResponsiveLayout = ({ 
  children, 
  backgroundGradient = 'primary',
  className = '',
  fluid = false,
  padding = 'default'
}) => {  const getBackgroundGradient = (type) => {
    const gradients = {
      primary: 'var(--primary-gradient)',
      hero: 'var(--hero-gradient)',
      secondary: 'var(--secondary-gradient)', 
      success: 'var(--success-gradient)',
      warning: 'var(--warning-gradient)',
      dark: 'linear-gradient(135deg, var(--neutral-800) 0%, var(--neutral-900) 100%)',
      light: 'linear-gradient(135deg, var(--neutral-50) 0%, var(--neutral-100) 100%)'
    };
    
    // Fallback direto para o gradiente hero caso as variáveis não funcionem
    if (type === 'hero') {
      return gradients.hero || 'linear-gradient(135deg, #ED1B2F 0%, #ED0973 30%, #B624C0 70%, #9333EA 100%)';
    }
    
    return gradients[type] || gradients.hero;
  };

  const getPaddingClass = (padding) => {
    const paddingClasses = {
      none: '',
      small: 'py-3',
      default: 'py-4 py-md-5',
      large: 'py-5 py-md-6'
    };
    return paddingClasses[padding] || paddingClasses.default;
  };

  return (
    <div 
      className={`min-vh-100 position-relative ${getPaddingClass(padding)} ${className}`}
      style={{ 
        background: getBackgroundGradient(backgroundGradient),
        minHeight: '100vh'
      }}
    >
      {/* Background Pattern Overlay */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}
      />
      
      <Container fluid={fluid} className="position-relative">
        {children}
      </Container>
    </div>
  );
};

ResponsiveLayout.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundGradient: PropTypes.oneOf(['primary', 'hero', 'secondary', 'success', 'warning', 'dark', 'light']),
  className: PropTypes.string,
  fluid: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'small', 'default', 'large'])
};

export default ResponsiveLayout;
