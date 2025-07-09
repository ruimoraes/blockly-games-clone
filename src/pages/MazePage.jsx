import React, { useEffect } from 'react';
import MazeGame from '../games/maze/MazeGame';

const MazePage = () => {
  useEffect(() => {
    document.body.classList.add('is-game-page');
    return () => {
      document.body.classList.remove('is-game-page');
    };
  }, []);

  return <MazeGame />;
};

export default MazePage;