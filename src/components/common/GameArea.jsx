import React from 'react';
import PropTypes from 'prop-types';

const GameArea = ({
  children
}) => {  return (
    <div>
      <div>        
        <div>
          <div>
            <div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

GameArea.propTypes = {
  children: PropTypes.node.isRequired
};

export default GameArea;
