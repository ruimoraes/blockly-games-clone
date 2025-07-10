import React, { useEffect } from 'react';
import AutomatoGame from '../games/automato/AutomatoGame';

const AutomatoPage = () => {
  useEffect(() => {
    document.body.classList.add('is-game-page');
    return () => {
      document.body.classList.remove('is-game-page');
    };
  }, []);

  return <AutomatoGame />;
};

export default AutomatoPage;