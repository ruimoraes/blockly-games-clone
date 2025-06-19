import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

const GameArea = ({
  children,
  className = ''
}) => {
  return (
    <div className={'card game-card blockly-editor-card h-100 border-0 rounded-0'}>
      <div className="card-body p-0 d-flex flex-column overflow-hidden">        
        <div className="game-display flex-grow-1 position-relative overflow-hidden">
          <Container fluid className="h-100 p-2 d-flex align-items-center justify-content-center" style={{
            maxWidth: '80%',
            maxHeight: '80%',             
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',              
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {children}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

GameArea.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default GameArea;
