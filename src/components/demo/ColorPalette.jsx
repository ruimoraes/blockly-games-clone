import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ResponsiveCard from '../ui/ResponsiveCard';

/**
 * ColorPalette - Componente para demonstrar a paleta de cores do Blockly NT
 */
const ColorPalette = () => {
  const brandColors = [
    { name: 'Primary', variable: '--brand-primary', value: '#ED1B2F' },
    { name: 'Secondary', variable: '--brand-secondary', value: '#ED0973' },
    { name: 'Accent', variable: '--brand-accent', value: '#B624C0' },
    { name: 'Light', variable: '--brand-light', value: '#FF6B9D' },
    { name: 'Dark', variable: '--brand-dark', value: '#C41E3A' },
    { name: 'Purple Light', variable: '--brand-purple-light', value: '#D946EF' },
    { name: 'Purple Dark', variable: '--brand-purple-dark', value: '#9333EA' }
  ];

  const semanticColors = [
    { name: 'Success', variable: '--success', value: '#10B981' },
    { name: 'Warning', variable: '--warning', value: '#F59E0B' },
    { name: 'Error', variable: '--error', value: '#EF4444' },
    { name: 'Info', variable: '--info', value: '#3B82F6' }
  ];

  const gradients = [
    { name: 'Primary', variable: 'primary-gradient' },
    { name: 'Hero', variable: 'hero-gradient' },
    { name: 'Secondary', variable: 'secondary-gradient' },
    { name: 'Success', variable: 'success-gradient' },
    { name: 'Warning', variable: 'warning-gradient' }
  ];

  const ColorSwatch = ({ name, variable, value, isGradient = false }) => (
    <Col xs={6} md={4} lg={3} className="mb-3">
      <ResponsiveCard variant="glass" hover={false} className="h-100">
        <div
          className="w-100"
          style={{
            height: '60px',
            background: isGradient ? `var(--${variable})` : `var(${variable})`,
            borderTopLeftRadius: 'var(--border-radius-lg)',
            borderTopRightRadius: 'var(--border-radius-lg)'
          }}
        />
        <Card.Body className="p-3">
          <h6 className="mb-1 text-truncate">{name}</h6>
          <small className="text-muted d-block text-truncate">{variable}</small>
          {value && <small className="text-muted d-block">{value}</small>}
        </Card.Body>
      </ResponsiveCard>
    </Col>
  );

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="gradient-text-brand mb-3">Sistema de Cores Blockly NT</h2>
        <p className="text-muted">Paleta de cores harmoniosa baseada no gradiente da marca</p>
      </div>

      {/* Brand Colors */}
      <div className="mb-5">
        <h4 className="mb-4 text-brand-primary">Cores da Marca</h4>
        <Row>
          {brandColors.map((color, index) => (
            <ColorSwatch key={index} {...color} />
          ))}
        </Row>
      </div>

      {/* Semantic Colors */}
      <div className="mb-5">
        <h4 className="mb-4 text-brand-primary">Cores Semânticas</h4>
        <Row>
          {semanticColors.map((color, index) => (
            <ColorSwatch key={index} {...color} />
          ))}
        </Row>
      </div>

      {/* Gradients */}
      <div className="mb-5">
        <h4 className="mb-4 text-brand-primary">Gradientes</h4>
        <Row>
          {gradients.map((gradient, index) => (
            <ColorSwatch key={index} {...gradient} isGradient={true} />
          ))}
        </Row>
      </div>

      {/* Glass Effects Demo */}
      <div className="mb-5">
        <h4 className="mb-4 text-brand-primary">Efeitos Glass</h4>
        <Row>
          <Col md={6} className="mb-3">
            <ResponsiveCard variant="glass" className="h-100">
              <ResponsiveCard.Body className="p-4 text-center">
                <h5>Glass Light</h5>
                <p className="mb-0 text-muted">Efeito glass morphism claro</p>
              </ResponsiveCard.Body>
            </ResponsiveCard>
          </Col>
          <Col md={6} className="mb-3">
            <ResponsiveCard variant="glassDark" className="h-100">
              <ResponsiveCard.Body className="p-4 text-center">
                <h5 className="text-white">Glass Dark</h5>
                <p className="mb-0 text-white-75">Efeito glass morphism escuro</p>
              </ResponsiveCard.Body>
            </ResponsiveCard>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ColorPalette;
