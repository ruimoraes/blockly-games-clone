import React from 'react';
import PropTypes from 'prop-types';
import { Clock, Target } from 'lucide-react';

/**
 * Componente para exibir informações da fase atual
 * Exibe título e descrição da fase, além do status de execução
 */
const GameInfo = ({
  phaseData = {}
  // isExecuting = false, // TODO: implementar indicador visual durante execução
}) => {

return (
    <div>
      <div>
        <div>
          {/* Informações da fase */}
          <div>
            {phaseData && phaseData.name && (
              <div>
                <div>
                  <h6>{phaseData.name}</h6>
                  {phaseData.description && (
                    <p>{phaseData.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>          
        </div>
      </div>
    </div>
  );
};

GameInfo.propTypes = {
  phaseData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    maxBlocks: PropTypes.number
  })
  // isExecuting: PropTypes.bool, // removido temporariamente
};

export default GameInfo;
