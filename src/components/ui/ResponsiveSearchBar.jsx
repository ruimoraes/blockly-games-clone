import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Search, X } from 'lucide-react';
import ResponsiveCard from './ResponsiveCard';
import PropTypes from 'prop-types';

/**
 * ResponsiveSearchBar - Componente de busca responsivo
 */
const ResponsiveSearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Buscar...',
  showClearButton = true,
  variant = 'glass',
  size = 'lg',
  className = ''
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <ResponsiveCard variant={variant} hover={false} className={className}>
      <ResponsiveCard.Body className="p-3 p-md-4">
        <InputGroup size={size}>
          <InputGroup.Text className="bg-transparent border-0">
            <Search size={20} className="text-muted" />
          </InputGroup.Text>
          
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="bg-transparent border-0 shadow-none"
            style={{
              fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
              '::placeholder': {
                color: 'rgba(108, 117, 125, 0.7)'
              }
            }}
          />
          
          {showClearButton && value && (
            <Button
              variant="link"
              className="border-0 text-muted p-2"
              onClick={handleClear}
              aria-label="Limpar busca"
            >
              <X size={18} />
            </Button>
          )}
        </InputGroup>
      </ResponsiveCard.Body>
    </ResponsiveCard>
  );
};

ResponsiveSearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  showClearButton: PropTypes.bool,
  variant: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  className: PropTypes.string
};

export default ResponsiveSearchBar;
