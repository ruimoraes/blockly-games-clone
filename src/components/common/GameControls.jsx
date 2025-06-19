import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Play, RotateCcw, Loader } from 'lucide-react';

/**
 * Componente genérico de controles para jogos
 * Fornece interface consistente para executar e resetar código
 */
const GameControls = ({
  onRunCode,
  onResetGame,
  isExecuting = false,
  gameState = 'idle',

  customButtons = [],
  runButtonText = 'Executar Código',
  resetButtonText = 'Reiniciar Jogo',
  runButtonIcon = Play,
  resetButtonIcon = RotateCcw,
  variant = 'brand-primary',
  size = 'sm',
  className = ''
}) => {
  const RunIcon = runButtonIcon;
  const ResetIcon = resetButtonIcon;
  
  // Determina se o jogo precisa ser reiniciado (após sucesso ou falha)
  const needsReset = gameState === 'success' || gameState === 'failure';
  
  // Handler para o botão que muda de comportamento
  const handleButtonClick = () => {
    if (needsReset) {
      // Se o jogo terminou (sucesso ou falha), reinicia
      onResetGame();
    } else {
      // Se está no estado inicial, executa o código
      onRunCode();
    }
  };
  
  return (
    <div className={`d-flex justify-content-center ${className}`}>
      <ButtonGroup size={size}>
        {/* Botão Único (Executar ou Reiniciar) */}        <Button
          variant={needsReset ? "outline-secondary" : variant}
          onClick={handleButtonClick}
          disabled={isExecuting}
          className={`d-flex align-items-center gap-1 px-3 game-controls-button ${needsReset ? 'btn-reset' : ''}`}
        >
          {isExecuting ? (
            <>
              <Loader size={16} className="animate-spin" />
              <span>Executando...</span>
            </>
          ) : needsReset ? (
            <>
              <ResetIcon size={16} />
              <span>{resetButtonText}</span>
            </>
          ) : (
            <>
              <RunIcon size={16} />
              <span>{runButtonText}</span>
            </>
          )}
        </Button>

        {/* Botões customizados */}
        {customButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant || 'outline-primary'}
            onClick={button.onClick}
            disabled={button.disabled || isExecuting}
            className={`d-flex align-items-center gap-1 ${button.className || ''}`}
            title={button.tooltip}
          >
            {button.icon && <button.icon size={16} />}
            <span>{button.text}</span>
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

GameControls.propTypes = {
  onRunCode: PropTypes.func.isRequired,
  onResetGame: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool,
  gameState: PropTypes.oneOf(['idle', 'running', 'success', 'failure']),

  customButtons: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.elementType,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    tooltip: PropTypes.string
  })),
  runButtonText: PropTypes.string,
  resetButtonText: PropTypes.string,
  runButtonIcon: PropTypes.elementType,
  resetButtonIcon: PropTypes.elementType,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string
};

export default GameControls;
