import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Play, Star, Users, Clock } from 'lucide-react';
import {
  ResponsiveLayout,
  ResponsiveHeader,
  ResponsiveFooter,
  ResponsiveCard,
  ResponsiveGrid,
  ResponsiveCol,
  LoadingSpinner,
  StatsSection,
  BlocklyNTLogo
} from '../components';
import ColorPalette from '../components/demo/ColorPalette';

/**
 * DemoPage - Página para demonstrar todos os componentes responsivos
 */
function DemoPage() {
  const demoStats = [
    { value: 15, label: 'Componentes' },
    { value: 7, label: 'Layouts' },
    { value: 12, label: 'Utilidades' }
  ];

  return (
    <ResponsiveLayout backgroundGradient="hero">
      {/* Header */}
      <ResponsiveHeader 
        title="Demo System"
        subtitle="Demonstração do sistema de design responsivo do Blockly NT"
        showBadges={false}
      />

      {/* Logo Demo */}
      <Container className="mb-5">
        <ResponsiveCard variant="glass">
          <ResponsiveCard.Body className="p-4 text-center">
            <h4 className="mb-4">Logo Blockly NT</h4>
            <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
              <div className="text-center">
                <BlocklyNTLogo size={32} />
                <small className="d-block mt-2 text-muted">32px</small>
              </div>
              <div className="text-center">
                <BlocklyNTLogo size={48} />
                <small className="d-block mt-2 text-muted">48px</small>
              </div>
              <div className="text-center">
                <BlocklyNTLogo size={64} />
                <small className="d-block mt-2 text-muted">64px</small>
              </div>
              <div className="text-center">
                <BlocklyNTLogo size={80} color="white" />
                <small className="d-block mt-2 text-muted">80px branco</small>
              </div>
            </div>
          </ResponsiveCard.Body>
        </ResponsiveCard>
      </Container>

      {/* Cards Demo */}
      <Container className="mb-5">
        <h3 className="text-white mb-4 text-center">Cards Responsivos</h3>
        <ResponsiveGrid spacing="default">
          <ResponsiveCol md={6} lg={4}>
            <ResponsiveCard variant="glass" hover={true}>
              <ResponsiveCard.Body className="p-4 text-center">
                <Star size={32} className="text-warning mb-3" />
                <h5>Glass Card</h5>
                <p className="text-muted">Card com efeito glass morphism e hover</p>
                <Button variant="primary" size="sm">Ação</Button>
              </ResponsiveCard.Body>
            </ResponsiveCard>
          </ResponsiveCol>

          <ResponsiveCol md={6} lg={4}>
            <ResponsiveCard variant="glassDark" animation={true}>
              <ResponsiveCard.Body className="p-4 text-center">
                <Play size={32} className="text-info mb-3" />
                <h5 className="text-white">Glass Dark</h5>
                <p className="text-white-75">Card escuro com animação flutuante</p>
                <Button variant="outline-light" size="sm">Ação</Button>
              </ResponsiveCard.Body>
            </ResponsiveCard>
          </ResponsiveCol>

          <ResponsiveCol md={6} lg={4}>
            <ResponsiveCard variant="solid">
              <ResponsiveCard.Body className="p-4 text-center">
                <Users size={32} className="text-success mb-3" />
                <h5>Solid Card</h5>
                <p className="text-muted">Card sólido sem transparência</p>
                <Button variant="success" size="sm">Ação</Button>
              </ResponsiveCard.Body>
            </ResponsiveCard>
          </ResponsiveCol>
        </ResponsiveGrid>
      </Container>

      {/* Loading Demo */}
      <Container className="mb-5">
        <h3 className="text-white mb-4 text-center">Loading States</h3>
        <ResponsiveGrid spacing="default">
          <ResponsiveCol md={4}>
            <ResponsiveCard variant="glass">
              <ResponsiveCard.Body className="text-center">
                <LoadingSpinner size="sm" message="Carregando..." />
              </ResponsiveCard.Body>
            </ResponsiveCard>
          </ResponsiveCol>
          <ResponsiveCol md={4}>
            <ResponsiveCard variant="glass">
              <ResponsiveCard.Body className="text-center">
                <LoadingSpinner size="md" variant="success" message="Processando..." />
              </ResponsiveCard.Body>
            </ResponsiveCard>
          </ResponsiveCol>
          <ResponsiveCol md={4}>
            <ResponsiveCard variant="glass">
              <ResponsiveCard.Body className="text-center">
                <LoadingSpinner size="lg" variant="warning" message="Quase pronto..." />
              </ResponsiveCard.Body>
            </ResponsiveCard>
          </ResponsiveCol>
        </ResponsiveGrid>
      </Container>

      {/* Typography Demo */}
      <Container className="mb-5">
        <ResponsiveCard variant="glass">
          <ResponsiveCard.Body className="p-4">
            <h3 className="mb-4 text-center">Tipografia Responsiva</h3>
            <div className="text-center mb-4">
              <h1 className="display-responsive gradient-text-brand">Display Responsivo</h1>
              <p className="lead-responsive text-muted">Texto lead responsivo que se adapta ao viewport</p>
              <p className="responsive-text">Texto responsivo padrão com clamp functions</p>
            </div>
            <Row>
              <Col md={6}>
                <h4 className="responsive-heading">Heading Responsivo</h4>
                <p>Este é um exemplo de heading que se adapta ao tamanho da tela usando clamp().</p>
              </Col>
              <Col md={6}>
                <h5 className="gradient-text">Texto com Gradiente</h5>
                <p className="text-brand-primary">Texto com cor da marca primária.</p>
                <p className="text-brand-secondary">Texto com cor da marca secundária.</p>
              </Col>
            </Row>
          </ResponsiveCard.Body>
        </ResponsiveCard>
      </Container>

      {/* Badges Demo */}
      <Container className="mb-5">
        <ResponsiveCard variant="glass">
          <ResponsiveCard.Body className="p-4 text-center">
            <h4 className="mb-4">Badges e Elementos</h4>
            <div className="d-flex justify-content-center gap-2 flex-wrap mb-3">
              <Badge bg="primary">Primary</Badge>
              <Badge bg="success">Success</Badge>
              <Badge bg="warning">Warning</Badge>
              <Badge bg="danger">Danger</Badge>
              <Badge bg="info">Info</Badge>
              <Badge bg="dark">Dark</Badge>
            </div>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Badge bg="light" text="dark" className="px-3 py-2">
                <Clock size={14} className="me-1" />
                Com ícone
              </Badge>
              <Badge className="px-3 py-2" style={{ background: 'var(--primary-gradient)' }}>
                Gradiente
              </Badge>
            </div>
          </ResponsiveCard.Body>
        </ResponsiveCard>
      </Container>

      {/* Stats Demo */}
      <StatsSection stats={demoStats} className="mb-5" />

      {/* Color Palette */}
      <ColorPalette />

      {/* Footer */}
      <ResponsiveFooter text="© 2025 Demo System - Blockly NT" />
    </ResponsiveLayout>
  );
}

export default DemoPage;
