import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Play, RotateCcw, Loader } from 'lucide-react';

/**
 * Componente genérico de controles para jogos
 * Fornece interface consistente para executar/resetar código
 */
const GameControls = ({
  onRunCode,
  onResetGame,
  isExecuting = false,
  isBlocklyLoaded = true,
  hasCode = false,
  customButtons = [],
  runButtonText = 'Executar Código',
  resetButtonText = 'Resetar Jogo',
  runButtonIcon = Play,
  resetButtonIcon = RotateCcw,
  variant = 'primary',
  size = 'lg',
  className = ''
}) => {
  const RunIcon = runButtonIcon;
  const ResetIcon = resetButtonIcon;

  return (
    <div className={`d-flex justify-content-center gap-3 flex-wrap ${className}`}>
      <ButtonGroup size={size}>
        {/* Botão Executar */}
        <Button
          variant={variant}
          onClick={onRunCode}
          disabled={isExecuting || !isBlocklyLoaded || !hasCode}
          className="d-flex align-items-center gap-2"
        >
          {isExecuting ? (
            <>
              <Loader size={20} className="animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <RunIcon size={20} />
              {runButtonText}
            </>
          )}
        </Button>

        {/* Botão Reset */}
        <Button
          variant="outline-secondary"
          onClick={onResetGame}
          disabled={isExecuting}
          className="d-flex align-items-center gap-2"
        >
          <ResetIcon size={20} />
          {resetButtonText}
        </Button>

        {/* Botões customizados */}
        {customButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant || 'outline-primary'}
            onClick={button.onClick}
            disabled={button.disabled || isExecuting}
            className={`d-flex align-items-center gap-2 ${button.className || ''}`}
            title={button.tooltip}
          >
            {button.icon && <button.icon size={20} />}
            {button.text}
          </Button>
        ))}
      </ButtonGroup>      {/* Status indicators */}
      <div className="d-flex align-items-center gap-2">
        {!isBlocklyLoaded && (
          <span className="badge bg-warning">
            <Loader size={14} className="animate-spin me-1" />
            Carregando Blockly...
          </span>
        )}
        
        {isBlocklyLoaded && !hasCode && (
          <span className="badge bg-info">
            💡 Arraste blocos para criar seu código
          </span>
        )}
      </div>
    </div>
  );
};

GameControls.propTypes = {
  onRunCode: PropTypes.func.isRequired,
  onResetGame: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool,
  isBlocklyLoaded: PropTypes.bool,
  hasCode: PropTypes.bool,
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
