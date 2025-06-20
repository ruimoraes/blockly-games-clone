import React from 'react';
import PropTypes from 'prop-types';

const GameArea = ({
  children
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Área principal do jogo */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

GameArea.propTypes = {
  children: PropTypes.node.isRequired
};

export default GameArea;
