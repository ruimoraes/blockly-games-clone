import React from 'react';
import { Modal, Button, Form, Badge } from 'react-bootstrap';

const AnimalConfigModal = ({ 
  animal, 
  isVisible, 
  onClose, 
  onSave,
  availableTraits,
  currentConfig 
}) => {
  const [picture, setPicture] = React.useState(currentConfig?.picture || '');
  const [legs, setLegs] = React.useState(currentConfig?.legs || '');
  const [selectedTraits, setSelectedTraits] = React.useState(currentConfig?.traits || []);

  React.useEffect(() => {
    if (animal && currentConfig) {
      setPicture(currentConfig.picture || '');
      setLegs(currentConfig.legs || '');
      setSelectedTraits(currentConfig.traits || []);
    }
  }, [animal, currentConfig]);

  const handleTraitToggle = (trait) => {
    setSelectedTraits(prev => 
      prev.includes(trait) 
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  const handleSave = () => {
    onSave({
      picture,
      legs: parseInt(legs) || 0,
      traits: selectedTraits
    });
    onClose();
  };

  const isValid = picture && legs !== '' && selectedTraits.length > 0;

  if (!animal) return null;

  return (
    <Modal show={isVisible} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Configurar {animal.displayName}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="text-center mb-4">
          <img 
            src={animal.picture} 
            alt={animal.displayName}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Imagem (picture)</Form.Label>
            <Form.Select 
              value={picture} 
              onChange={(e) => setPicture(e.target.value)}
            >
              <option value="">Escolha uma imagem...</option>
              <option value={animal.picture}>{animal.displayName}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Número de Pernas (legs)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="20"
              value={legs}
              onChange={(e) => setLegs(e.target.value)}
              placeholder="Digite o número de pernas"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Características (traits)</Form.Label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {availableTraits.map(trait => (
                <Badge
                  key={trait}
                  bg={selectedTraits.includes(trait) ? 'primary' : 'outline-secondary'}
                  className="p-2"
                  style={{ 
                    cursor: 'pointer',
                    border: selectedTraits.includes(trait) ? 'none' : '1px solid #6c757d'
                  }}
                  onClick={() => handleTraitToggle(trait)}
                >
                  {trait}
                </Badge>
              ))}
            </div>
            <small className="text-muted">
              Clique nas características para selecioná-las
            </small>
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={!isValid}
        >
          Salvar Configuração
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnimalConfigModal;

