import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { useBlockly } from '../../hooks/useBlockly';

function BlocklyWorkspace({ gameActions, maxBlocks, onCodeChange }) {
  const containerRef = useRef(null);
  const {
    workspace,
    generatedCode,
    initializeWorkspace,
    executeCode,
    clearWorkspace,
    resizeWorkspace,
    getWorkspaceStats,
    setBlockLimit
  } = useBlockly('blockly-workspace', gameActions);

  // Inicializar workspace quando o componente montar
  useEffect(() => {
    if (containerRef.current) {
      initializeWorkspace();
    }
  }, [initializeWorkspace]);

  // Definir limite de blocos quando mudar
  useEffect(() => {
    if (workspace && maxBlocks && maxBlocks !== Infinity) {
      setBlockLimit(maxBlocks);
    }
  }, [workspace, maxBlocks, setBlockLimit]);

  // Notificar mudanças no código
  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(generatedCode);
    }
  }, [generatedCode, onCodeChange]);

  // Redimensionar quando necessário
  useEffect(() => {
    const timer = setTimeout(() => {
      resizeWorkspace();
    }, 100);

    return () => clearTimeout(timer);
  }, [resizeWorkspace]);

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Editor de Blocos</h5>
        <div className="d-flex gap-2 align-items-center">
          {maxBlocks && maxBlocks !== Infinity && (
            <small className="text-muted">
              Máximo: {maxBlocks} blocos
            </small>
          )}
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={clearWorkspace}
            title="Limpar workspace"
          >
            Limpar
          </button>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div
          id="blockly-workspace"
          ref={containerRef}
          className="blockly-workspace"
          style={{ height: '400px', minHeight: '300px' }}
        />
      </Card.Body>
      {generatedCode && (
        <Card.Footer>
          <details>
            <summary className="text-muted small cursor-pointer">
              Ver código gerado
            </summary>
            <pre className="mt-2 p-2 bg-light rounded small">
              <code>{generatedCode}</code>
            </pre>
          </details>
        </Card.Footer>
      )}
    </Card>
  );
}

export default BlocklyWorkspace;

