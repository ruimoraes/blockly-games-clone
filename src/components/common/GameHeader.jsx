import React from 'react';
import PropTypes from 'prop-types';
import logo from '../../assets/logont.svg';

const GameHeader = ({
  onGoHome,
  showHomeButton = true,
  gameTitle = '',
  gameIcon = '',
  children
}) => {return (    
    <nav className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 sticky top-0 z-50 border-b border-white/20 shadow-lg">
      <div className="flex items-center justify-between px-4 py-1 lg:px-6 lg:py-2">
        {/* Lado esquerdo - Botões de navegação */}
        <div className="flex items-center space-x-4">          
          {showHomeButton && (
            <div 
              onClick={onGoHome}
              title="Ir para Home"
              className="header-logo group"
            >              
              <img 
                src='/home/logo_nav.png'
                alt="Blockly NT"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
              />
              <span className="header-logo-text" style={{ display: 'none' }}>Blockly NT</span>
            </div>
          )}
        </div>        
        {/* Centro - Conteúdo customizado (se necessário) */}
        <div className="flex-1 flex justify-center">
          {children}
        </div>        
        {/* Lado direito - Título do jogo */}
        <div className="flex items-center space-x-4">
          {gameTitle && (
            <div className="flex items-center space-x-2">
              {gameIcon && <span className="text-2xl lg:text-3xl">{gameIcon}</span>}
              <h5 className="text-white font-semibold text-2xl lg:text-3xl">{gameTitle}</h5>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

GameHeader.propTypes = {
  onGoHome: PropTypes.func,
  showHomeButton: PropTypes.bool,
  gameTitle: PropTypes.string,
  gameIcon: PropTypes.string,
  children: PropTypes.node
};

export default GameHeader;
