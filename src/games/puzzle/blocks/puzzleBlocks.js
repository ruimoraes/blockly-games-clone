// Blocos Blockly personalizados para o jogo Puzzle
// Baseado no código original do Blockly Games

import * as Blockly from 'blockly';

// Cores dos blocos (HSV)
const ANIMAL_HUE = 120;  // Verde para blocos de animais
const PICTURE_HUE = 30;  // Laranja para blocos de imagem
const TRAIT_HUE = 290;   // Roxo para blocos de características

// Dados dos animais (simplificado para React)
const ANIMALS_DATA = [
  {
    id: 1,
    name: 'Pato',
    pic: '/images/animals/duck.png',
    legs: 2,
    traits: ['Bico', 'Penas']
  },
  {
    id: 2,
    name: 'Gato', 
    pic: '/images/animals/cat.png',
    legs: 4,
    traits: ['Bigodes', 'Pelo']
  },
  {
    id: 3,
    name: 'Abelha',
    pic: '/images/animals/bee.png', 
    legs: 6,
    traits: ['Asas', 'Listras']
  },
  {
    id: 4,
    name: 'Caracol',
    pic: '/images/animals/snail.png',
    legs: 0,
    traits: ['Concha', 'Antenas']
  }
];

// Bloco Animal - representa um animal específico
Blockly.Blocks['puzzle_animal'] = {
  init: function() {
    this.setColour(ANIMAL_HUE);
    this.appendDummyInput()
        .appendField('Animal:')
        .appendField(new Blockly.FieldDropdown([
          ['Escolha...', '0'],
          ['Pato', '1'],
          ['Gato', '2'], 
          ['Abelha', '3'],
          ['Caracol', '4']
        ]), 'ANIMAL_ID');
    this.appendValueInput('PICTURE')
        .setCheck('Picture')
        .appendField('imagem:');
    this.appendValueInput('LEGS')
        .setCheck('Number')
        .appendField('pernas:');
    this.appendValueInput('TRAITS')
        .setCheck('Traits')
        .appendField('características:');
    this.setInputsInline(false);
    this.setOutput(false);
    this.setTooltip('Configure as propriedades do animal');
  },
  
  // Método para verificar se o animal está configurado corretamente
  isCorrect: function() {
    const animalId = parseInt(this.getFieldValue('ANIMAL_ID'));
    if (animalId === 0) return false;
    
    const animalData = ANIMALS_DATA[animalId - 1];
    if (!animalData) return false;
    
    // Verificar imagem
    const pictureBlock = this.getInputTargetBlock('PICTURE');
    if (!pictureBlock || pictureBlock.getFieldValue('IMAGE') !== animalData.pic) {
      return false;
    }
    
    // Verificar número de pernas
    const legsBlock = this.getInputTargetBlock('LEGS');
    if (!legsBlock || parseInt(legsBlock.getFieldValue('NUM')) !== animalData.legs) {
      return false;
    }
    
    // Verificar características
    const traitsBlock = this.getInputTargetBlock('TRAITS');
    if (!traitsBlock) return false;
    
    const selectedTraits = traitsBlock.getSelectedTraits();
    if (selectedTraits.length !== animalData.traits.length) return false;
    
    for (const trait of animalData.traits) {
      if (!selectedTraits.includes(trait)) return false;
    }
    
    return true;
  }
};

// Bloco Picture - representa a imagem de um animal
Blockly.Blocks['puzzle_picture'] = {
  init: function() {
    this.setColour(PICTURE_HUE);
    this.appendDummyInput()
        .appendField('Imagem:')
        .appendField(new Blockly.FieldDropdown([
          ['Escolha...', ''],
          ['Pato', '/images/animals/duck.png'],
          ['Gato', '/images/animals/cat.png'],
          ['Abelha', '/images/animals/bee.png'],
          ['Caracol', '/images/animals/snail.png']
        ]), 'IMAGE');
    this.setOutput(true, 'Picture');
    this.setTooltip('Selecione a imagem do animal');
  }
};

// Bloco Number - representa o número de pernas
Blockly.Blocks['puzzle_legs'] = {
  init: function() {
    this.setColour(PICTURE_HUE);
    this.appendDummyInput()
        .appendField('Pernas:')
        .appendField(new Blockly.FieldNumber(0, 0, 8), 'NUM');
    this.setOutput(true, 'Number');
    this.setTooltip('Digite o número de pernas do animal');
  }
};

// Bloco Traits - representa as características do animal
Blockly.Blocks['puzzle_traits'] = {
  init: function() {
    this.setColour(TRAIT_HUE);
    this.appendDummyInput()
        .appendField('Características:');
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'BICO')
        .appendField('Bico');
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'PENAS')
        .appendField('Penas');
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'BIGODES')
        .appendField('Bigodes');
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'PELO')
        .appendField('Pelo');
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'ASAS')
        .appendField('Asas');
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'LISTRAS')
        .appendField('Listras');
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'CONCHA')
        .appendField('Concha');
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'ANTENAS')
        .appendField('Antenas');
    this.setOutput(true, 'Traits');
    this.setTooltip('Selecione as características do animal');
  },
  
  // Método para obter características selecionadas
  getSelectedTraits: function() {
    const traits = [];
    const traitMap = {
      'BICO': 'Bico',
      'PENAS': 'Penas', 
      'BIGODES': 'Bigodes',
      'PELO': 'Pelo',
      'ASAS': 'Asas',
      'LISTRAS': 'Listras',
      'CONCHA': 'Concha',
      'ANTENAS': 'Antenas'
    };
    
    for (const [field, name] of Object.entries(traitMap)) {
      if (this.getFieldValue(field) === 'TRUE') {
        traits.push(name);
      }
    }
    
    return traits;
  }
};

// Toolbox para o workspace
export const PUZZLE_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Animais',
      colour: ANIMAL_HUE,
      contents: [
        {
          kind: 'block',
          type: 'puzzle_animal'
        }
      ]
    },
    {
      kind: 'category', 
      name: 'Propriedades',
      colour: PICTURE_HUE,
      contents: [
        {
          kind: 'block',
          type: 'puzzle_picture'
        },
        {
          kind: 'block',
          type: 'puzzle_legs'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Características',
      colour: TRAIT_HUE,
      contents: [
        {
          kind: 'block',
          type: 'puzzle_traits'
        }
      ]
    }
  ]
};

// Função para verificar se o puzzle está resolvido
export function checkPuzzleSolution(workspace) {
  const animalBlocks = workspace.getBlocksByType('puzzle_animal');
  let correctCount = 0;
  
  for (const block of animalBlocks) {
    if (block.isCorrect()) {
      correctCount++;
    }
  }
  
  // Para ser considerado resolvido, pelo menos um animal deve estar correto
  return correctCount > 0;
}

// Exportar dados dos animais para uso em outros componentes
export { ANIMALS_DATA };

