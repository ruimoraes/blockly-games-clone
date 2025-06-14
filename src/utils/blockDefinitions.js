// Definições dos blocos Blockly customizados para o jogo Maze
import * as Blockly from 'blockly';

// Cores dos blocos
const MOVEMENT_HUE = 290;
const LOGIC_HUE = 210;
const LOOPS_HUE = 120;

// Símbolos de direção
const LEFT_TURN = '↺';
const RIGHT_TURN = '↻';

// Definições dos blocos
export const blockDefinitions = {
  // Bloco para mover para frente
  maze_moveForward: {
    type: "maze_moveForward",
    message0: "mover para frente",
    previousStatement: null,
    nextStatement: null,
    colour: MOVEMENT_HUE,
    tooltip: "Move o personagem um espaço para frente."
  },

  // Bloco para virar
  maze_turn: {
    type: "maze_turn",
    message0: "virar %1",
    args0: [
      {
        type: "field_dropdown",
        name: "DIR",
        options: [
          ["à esquerda " + LEFT_TURN, "turnLeft"],
          ["à direita " + RIGHT_TURN, "turnRight"]
        ]
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: MOVEMENT_HUE,
    tooltip: "Vira o personagem 90 graus para a esquerda ou direita."
  },

  // Bloco condicional "se há caminho"
  maze_if: {
    type: "maze_if",
    message0: "se há caminho %1",
    args0: [
      {
        type: "field_dropdown",
        name: "DIR",
        options: [
          ["à frente", "isPathForward"],
          ["à esquerda", "isPathLeft"],
          ["à direita", "isPathRight"]
        ]
      }
    ],
    message1: "faça %1",
    args1: [
      {
        type: "input_statement",
        name: "DO"
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: LOGIC_HUE,
    tooltip: "Se há um caminho na direção especificada, execute as ações dentro."
  },

  // Bloco condicional "se há caminho senão"
  maze_ifElse: {
    type: "maze_ifElse",
    message0: "se há caminho %1",
    args0: [
      {
        type: "field_dropdown",
        name: "DIR",
        options: [
          ["à frente", "isPathForward"],
          ["à esquerda", "isPathLeft"],
          ["à direita", "isPathRight"]
        ]
      }
    ],
    message1: "faça %1",
    args1: [
      {
        type: "input_statement",
        name: "DO"
      }
    ],
    message2: "senão %1",
    args2: [
      {
        type: "input_statement",
        name: "ELSE"
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: LOGIC_HUE,
    tooltip: "Se há um caminho na direção especificada, execute a primeira ação. Caso contrário, execute a segunda ação."
  },

  // Bloco de repetição
  maze_repeat: {
    type: "maze_repeat",
    message0: "repetir %1 vezes",
    args0: [
      {
        type: "field_number",
        name: "TIMES",
        value: 10,
        min: 1,
        max: 100
      }
    ],
    message1: "faça %1",
    args1: [
      {
        type: "input_statement",
        name: "DO"
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: LOOPS_HUE,
    tooltip: "Repete as ações internas um número específico de vezes."
  },

  // Bloco de repetição até
  maze_repeatUntil: {
    type: "maze_repeatUntil",
    message0: "repetir até %1",
    args0: [
      {
        type: "field_dropdown",
        name: "CONDITION",
        options: [
          ["chegar ao objetivo", "atGoal"],
          ["não há caminho à frente", "noPathForward"],
          ["não há caminho à esquerda", "noPathLeft"],
          ["não há caminho à direita", "noPathRight"]
        ]
      }
    ],
    message1: "faça %1",
    args1: [
      {
        type: "input_statement",
        name: "DO"
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: LOOPS_HUE,
    tooltip: "Repete as ações internas até que a condição seja verdadeira."
  }
};

// Geradores de código JavaScript
export const javascriptGenerators = {
  maze_moveForward: function(block) {
    return 'moveForward();\n';
  },

  maze_turn: function(block) {
    const direction = block.getFieldValue('DIR');
    return `${direction}();\n`;
  },

  maze_if: function(block) {
    const direction = block.getFieldValue('DIR');
    const statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `if (${direction}()) {\n${statements}}\n`;
  },

  maze_ifElse: function(block) {
    const direction = block.getFieldValue('DIR');
    const statementsIf = Blockly.JavaScript.statementToCode(block, 'DO');
    const statementsElse = Blockly.JavaScript.statementToCode(block, 'ELSE');
    return `if (${direction}()) {\n${statementsIf}} else {\n${statementsElse}}\n`;
  },

  maze_repeat: function(block) {
    const times = block.getFieldValue('TIMES');
    const statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `for (let i = 0; i < ${times}; i++) {\n${statements}}\n`;
  },

  maze_repeatUntil: function(block) {
    const condition = block.getFieldValue('CONDITION');
    const statements = Blockly.JavaScript.statementToCode(block, 'DO');
    return `while (!${condition}()) {\n${statements}}\n`;
  }
};

// Configuração da toolbox
export const toolboxConfig = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Movimento",
      colour: MOVEMENT_HUE,
      contents: [
        {
          kind: "block",
          type: "maze_moveForward"
        },
        {
          kind: "block",
          type: "maze_turn"
        }
      ]
    },
    {
      kind: "category",
      name: "Lógica",
      colour: LOGIC_HUE,
      contents: [
        {
          kind: "block",
          type: "maze_if"
        },
        {
          kind: "block",
          type: "maze_ifElse"
        }
      ]
    },
    {
      kind: "category",
      name: "Repetição",
      colour: LOOPS_HUE,
      contents: [
        {
          kind: "block",
          type: "maze_repeat"
        },
        {
          kind: "block",
          type: "maze_repeatUntil"
        }
      ]
    }
  ]
};

// Função para registrar todos os blocos
export function registerBlocks() {
  // Registrar definições dos blocos
  Object.keys(blockDefinitions).forEach(blockType => {
    if (!Blockly.Blocks[blockType]) {
      Blockly.Blocks[blockType] = {
        init: function() {
          this.jsonInit(blockDefinitions[blockType]);
        }
      };
    }
  });

  // Registrar geradores de código
  Object.keys(javascriptGenerators).forEach(blockType => {
    if (!Blockly.JavaScript[blockType]) {
      Blockly.JavaScript[blockType] = javascriptGenerators[blockType];
    }
  });
}

// Função para obter blocos permitidos por nível
export function getAllowedBlocks(level) {
  const baseBlocks = ['maze_moveForward', 'maze_turn'];
  
  if (level >= 3) {
    baseBlocks.push('maze_repeat');
  }
  
  if (level >= 5) {
    baseBlocks.push('maze_if');
  }
  
  if (level >= 7) {
    baseBlocks.push('maze_ifElse', 'maze_repeatUntil');
  }
  
  return baseBlocks;
}

