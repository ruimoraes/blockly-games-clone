import React, { useEffect } from 'react';
import BeeGame from '../games/bee/BeeGame';

const BeePage = () => {
  useEffect(() => {
    document.body.classList.add('is-game-page');
    return () => {
      document.body.classList.remove('is-game-page');
    };
  }, []);

  return <BeeGame />;
};

export default BeePage;