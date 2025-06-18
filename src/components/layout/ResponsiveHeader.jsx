import React from 'react';
import { Container, Badge } from 'react-bootstrap';
import { Star, Users, Play } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ResponsiveHeader - Componente de header responsivo e moderno
 */
const ResponsiveHeader = ({ 
  title = "Blockly Games Clone",
  subtitle = "Aprenda programação de forma divertida com jogos educacionais",
  showBadges = true,
  className = ""
}) => {
  const badges = [
    { icon: Star, text: "Educacional", bg: "light" },
    { icon: Users, text: "Para todas as idades", bg: "light" },
    { icon: Play, text: "Gratuito", bg: "light" }
  ];

  return (
    <header className={`py-4 py-md-5 text-white ${className}`}>
      <Container>
        <div className="text-center">
          {/* Title */}
          <h1 className="display-responsive fw-bold mb-3 gradient-text-light">
            <span className="me-3">🎮</span>
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="lead-responsive mb-4 text-white-75">
            {subtitle}
          </p>
          
          {/* Badges */}
          {showBadges && (
            <div className="d-flex justify-content-center gap-2 gap-md-3 flex-wrap">
              {badges.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <Badge 
                    key={index}
                    bg={badge.bg} 
                    text="dark" 
                    className="px-3 py-2 fs-6 fs-md-5 d-flex align-items-center gap-2 hover-lift"
                    style={{
                      borderRadius: 'var(--border-radius-md)',
                      transition: 'all var(--transition-medium)',
                      cursor: 'default'
                    }}
                  >
                    <IconComponent size={16} />
                    <span className="d-none d-sm-inline">{badge.text}</span>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

ResponsiveHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showBadges: PropTypes.bool,
  className: PropTypes.string
};

export default ResponsiveHeader;
