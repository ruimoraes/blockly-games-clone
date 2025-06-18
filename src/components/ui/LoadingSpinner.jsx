import React from 'react';
import { Spinner } from 'react-bootstrap';
import ResponsiveCard from './ResponsiveCard';
import PropTypes from 'prop-types';

/**
 * LoadingSpinner - Componente de loading responsivo
 */
const LoadingSpinner = ({ 
  size = 'md',
  variant = 'primary',
  message = 'Carregando...',
  fullScreen = false,
  overlay = false,
  className = ''
}) => {
  const getSizeClasses = (size) => {
    const sizes = {
      sm: { spinner: 'spinner-border-sm', text: 'small' },
      md: { spinner: '', text: 'fs-6' },
      lg: { spinner: 'fs-4', text: 'fs-5' }
    };
    return sizes[size] || sizes.md;
  };

  const sizeClasses = getSizeClasses(size);

  const spinnerContent = (
    <div className={`text-center ${className}`}>
      <Spinner 
        animation="border" 
        variant={variant}
        className={`mb-3 ${sizeClasses.spinner}`}
        style={{
          width: size === 'lg' ? '3rem' : size === 'sm' ? '1.5rem' : '2rem',
          height: size === 'lg' ? '3rem' : size === 'sm' ? '1.5rem' : '2rem'
        }}
      />
      {message && (
        <p className={`mb-0 text-muted ${sizeClasses.text}`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="d-flex align-items-center justify-content-center min-vh-100"
        style={{ 
          background: overlay ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          position: overlay ? 'fixed' : 'relative',
          top: overlay ? 0 : 'auto',
          left: overlay ? 0 : 'auto',
          right: overlay ? 0 : 'auto',
          bottom: overlay ? 0 : 'auto',
          zIndex: overlay ? 9999 : 'auto'
        }}
      >
        {overlay ? (
          <ResponsiveCard variant="glass" className="p-4">
            {spinnerContent}
          </ResponsiveCard>
        ) : (
          spinnerContent
        )}
      </div>
    );
  }

  return spinnerContent;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.string,
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
  overlay: PropTypes.bool,
  className: PropTypes.string
};

export default LoadingSpinner;
