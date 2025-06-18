import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useBlockly } from '../hooks/useBlockly';

export function BlocklyEditor({ onCodeChange, isExecuting }) {
  const blocklyDiv = useRef(null);
  const { 
    blocklyLoaded,
    clearWorkspace,
    generatedCode
  } = useBlockly({
    blocklyDiv,
    onCodeChange
  });

  return (
    <div className="card game-card h-100">
      <div className="card-header">
        <h5 className="mb-0">Editor de Blocos Blockly</h5>
        <div className="status-badges">
          {blocklyLoaded ? (
            <span className="badge bg-success">✓ Carregado</span>
          ) : (
            <span className="badge bg-warning">⏳ Carregando...</span>
          )}
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={clearWorkspace}
            disabled={isExecuting || !blocklyLoaded}
          >
            🗑️ Limpar
          </button>
        </div>
      </div>
      <div className="card-body p-0 blockly-editor">
        <div
          ref={blocklyDiv}
          className="blockly-editor"
          style={{ height: '100%', width: '100%' }}
        />
        {!blocklyLoaded && (
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="text-muted">Carregando Blockly...</p>
          </div>
        )}
      </div>
      <div className="card-footer">
        <small className="text-muted">
          Arraste blocos da caixa de ferramentas para programar o personagem
        </small>
      </div>
    </div>
  );
}

BlocklyEditor.propTypes = {
  onCodeChange: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool.isRequired
};

export default BlocklyEditor;
