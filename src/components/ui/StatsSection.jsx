import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ResponsiveCard from '../ui/ResponsiveCard';
import PropTypes from 'prop-types';

/**
 * StatsSection - Componente de estatísticas responsivo
 */
const StatsSection = ({ stats, className = "" }) => {
  return (
    <Row className={`justify-content-center ${className}`}>
      <Col lg={8} xl={6}>
        <ResponsiveCard 
          variant="glassDark" 
          hover={false}
          animation={true}
        >
          <ResponsiveCard.Body className="py-3 py-md-4">
            <Row className="text-center text-white g-3">
              {stats.map((stat, index) => (
                <Col key={index} xs={12} sm={4}>
                  <div className="stat-item">
                    <h3 
                      className="fw-bold mb-1 gradient-text-light"
                      style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
                    >
                      {stat.value}
                    </h3>
                    <p 
                      className="mb-0 text-white-75"
                      style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </ResponsiveCard.Body>
        </ResponsiveCard>
      </Col>
    </Row>
  );
};

StatsSection.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  className: PropTypes.string
};

export default StatsSection;
