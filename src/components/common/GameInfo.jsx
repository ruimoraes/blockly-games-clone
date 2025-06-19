import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Clock, Target } from 'lucide-react';
import './GameInfo.css';

/**
 * Componente para exibir informações da fase atual
 * Exibe título e descrição da fase, além do status de execução
 */
const GameInfo = ({
  phaseData = {},
  isExecuting = false,
  className = ''
}) => {  return (
    <div className={`game-info bg-light border-bottom ${className}`}>
      <Container fluid >
        <Row className="align-items-center">
          {/* Informações da fase */}
          <Col >
            {phaseData && phaseData.name && (
              <div className="phase-info">
                <div>
                  <h6 className="phase-title">{phaseData.name}</h6>
                  {phaseData.description && (
                    <p className="phase-description">{phaseData.description}</p>
                  )}
                </div>
              </div>
            )}
          </Col>          
        </Row>
      </Container>
    </div>
  );
};

GameInfo.propTypes = {
  phaseData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    maxBlocks: PropTypes.number
  }),
  isExecuting: PropTypes.bool,
  className: PropTypes.string
};

export default GameInfo;
