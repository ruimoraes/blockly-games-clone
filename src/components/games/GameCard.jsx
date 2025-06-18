import React from 'react';
import { Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Play, Clock, Users, Star } from 'lucide-react';
import ResponsiveCard from '../ui/ResponsiveCard';
import PropTypes from 'prop-types';

/**
 * GameCard - Componente responsivo para exibir informações de jogos
 */
const GameCard = ({ game }) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'success',
      iniciante: 'success',
      intermediate: 'warning',
      intermediário: 'warning',
      advanced: 'danger',
      avançado: 'danger'
    };
    return colors[difficulty?.toLowerCase()] || 'secondary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      logic: '🧩',
      programming: '💻',
      puzzle: '🧩',
      maze: '🌟'
    };
    return icons[category] || '🎮';
  };

  const getThemeColor = (game) => {
    return game.theme?.primaryColor || 'primary';
  };

  return (
    <ResponsiveCard variant="glass" hover={true} className="h-100">
      <ResponsiveCard.Body className="p-3 p-md-4">
        <Row className="align-items-center g-3 g-md-4">
          {/* Game Icon */}
          <Col xs={12} sm={3} md={2} className="text-center">
            <div
              className="game-icon rounded-circle d-inline-flex align-items-center justify-content-center mx-auto"
              style={{
                width: 'clamp(60px, 15vw, 80px)',
                height: 'clamp(60px, 15vw, 80px)',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                background: `var(--bs-${getThemeColor(game)})`,
                color: 'white'
              }}
            >
              {game.icon || getCategoryIcon(game.category)}
            </div>
          </Col>

          {/* Game Info */}
          <Col xs={12} sm={9} md={7}>
            <div className="mb-3">
              {/* Title and Badges */}
              <div className="d-flex flex-wrap align-items-start gap-2 mb-2">
                <h3 className="mb-0 me-auto display-responsive" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                  {game.name}
                </h3>
                <div className="d-flex flex-wrap gap-1">
                  <Badge bg={getDifficultyColor(game.difficulty)} className="fs-6">
                    {game.difficulty}
                  </Badge>
                  {game.isNew && (
                    <Badge bg="danger" className="fs-6">
                      Novo!
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted mb-3 lead-responsive">
                {game.description}
              </p>

              {/* Stats */}
              <Row className="g-2 text-sm text-muted mb-3">
                <Col xs={12} sm={4} className="d-flex align-items-center gap-1">
                  <Play size={14} />
                  <small>{game.metadata?.totalPhases || game.levels || 0} níveis</small>
                </Col>
                <Col xs={12} sm={4} className="d-flex align-items-center gap-1">
                  <Users size={14} />
                  <small>{game.stats?.totalPlayers || 'Novo'}</small>
                </Col>
                <Col xs={12} sm={4} className="d-flex align-items-center gap-1">
                  <Clock size={14} />
                  <small>{game.estimatedTime}</small>
                </Col>
              </Row>

              {/* Features */}
              {(game.concepts || game.features) && (
                <div className="mb-3">
                  <h6 className="text-muted mb-2 small">Características:</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {(game.concepts || game.features || []).map((feature, index) => (
                      <Badge 
                        key={index}
                        bg="light" 
                        text="dark" 
                        className="px-2 py-1 small"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* Action Button */}
          <Col xs={12} md={3} className="text-center">
            <div className="d-grid gap-2">
              <Link to={game.route || game.path} className="text-decoration-none">
                <Button
                  variant={getThemeColor(game)}
                  size="lg"
                  className="w-100 shadow-sm hover-lift"
                  style={{
                    borderRadius: 'var(--border-radius-lg)',
                    fontWeight: '600'
                  }}
                  disabled={!game.enabled}
                >
                  <Play size={18} className="me-2" />
                  {game.enabled ? 'Jogar Agora' : 'Em Breve'}
                </Button>
              </Link>
              
              <small className="text-muted mt-1">
                {game.enabled ? 'Comece do nível 1' : 'Em desenvolvimento'}
              </small>
            </div>
          </Col>
        </Row>
      </ResponsiveCard.Body>
    </ResponsiveCard>
  );
};

GameCard.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string,
    difficulty: PropTypes.string,
    icon: PropTypes.string,
    enabled: PropTypes.bool,
    isNew: PropTypes.bool,
    route: PropTypes.string,
    path: PropTypes.string,
    estimatedTime: PropTypes.string,
    theme: PropTypes.object,
    metadata: PropTypes.object,
    stats: PropTypes.object,
    concepts: PropTypes.array,
    features: PropTypes.array,
    levels: PropTypes.number
  }).isRequired
};

export default GameCard;
