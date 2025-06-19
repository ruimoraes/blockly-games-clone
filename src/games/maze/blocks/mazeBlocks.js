import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

// Definir blocos customizados para o jogo Maze
export const defineBlocks = () => {
  // Bloco: Mover Frente
  Blockly.Blocks['maze_move_forward'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🚶 mover frente");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Move o personagem uma posição para frente");
      this.setHelpUrl("");
    }
  };

  // Bloco: Virar à Esquerda
  Blockly.Blocks['maze_turn_left'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("↺ virar à esquerda");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip("Vira o personagem 90° para a esquerda");
      this.setHelpUrl("");
    }
  };

  // Bloco: Virar à Direita
  Blockly.Blocks['maze_turn_right'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("↻ virar à direita");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip("Vira o personagem 90° para a direita");
      this.setHelpUrl("");
    }
  };

  // Bloco: Repetir
  Blockly.Blocks['maze_repeat'] = {
    init: function() {
      this.appendValueInput("TIMES")
          .setCheck("Number")
          .appendField("🔄 repetir");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("vezes");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Repete as ações internas um número específico de vezes");
      this.setHelpUrl("");
    }
  };

  // Bloco: Número
  Blockly.Blocks['maze_number'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(1, 1, 10), "NUM");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("Um número de 1 a 10");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se caminho à frente
  Blockly.Blocks['maze_if_path_ahead'] = {
    init: function() {
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("🔍 se há caminho à frente");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Executa ações apenas se há um caminho livre à frente");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se caminho à esquerda
  Blockly.Blocks['maze_if_path_left'] = {
    init: function() {
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("🔍 se há caminho à esquerda");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Executa ações apenas se há um caminho livre à esquerda");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se caminho à direita
  Blockly.Blocks['maze_if_path_right'] = {
    init: function() {
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("🔍 se há caminho à direita");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Executa ações apenas se há um caminho livre à direita");
      this.setHelpUrl("");
    }
  };

  // Bloco: Enquanto caminho à frente
  Blockly.Blocks['maze_while_path_ahead'] = {
    init: function() {
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("🔁 enquanto há caminho à frente");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Repete as ações enquanto há um caminho livre à frente");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se/Senão
  Blockly.Blocks['maze_if_else'] = {
    init: function() {
      this.appendValueInput("IF0")
          .setCheck("Boolean")
          .appendField("🤔 se");
      this.appendStatementInput("DO0")
          .setCheck(null)
          .appendField("então");
      this.appendStatementInput("ELSE")
          .setCheck(null)
          .appendField("senão");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Executa uma ação ou outra baseado em uma condição");
      this.setHelpUrl("");
    }
  };

  // Bloco: Há caminho (retorna boolean)
  Blockly.Blocks['maze_path_ahead'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("há caminho à frente");
      this.setOutput(true, "Boolean");
      this.setColour(210);
      this.setTooltip("Verifica se há um caminho livre à frente");
      this.setHelpUrl("");
    }
  };
};

// Definir geradores de código JavaScript
export const defineGenerators = () => {  // Gerador: Mover Frente
  javascriptGenerator.forBlock['maze_move_forward'] = function() {
    return 'await moveForward();\n';
  };
  // Gerador: Virar à Esquerda
  javascriptGenerator.forBlock['maze_turn_left'] = function() {
    return 'await turnLeft();\n';
  };
  // Gerador: Virar à Direita
  javascriptGenerator.forBlock['maze_turn_right'] = function() {
    return 'await turnRight();\n';
  };  // Gerador: Repetir
  javascriptGenerator.forBlock['maze_repeat'] = function(block) {
    const times = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC) || '1';
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    const code = `for (let i = 0; i < ${times}; i++) {\n${statements}}\n`;
    return code;
  };
  // Gerador: Número
  javascriptGenerator.forBlock['maze_number'] = function(block) {
    const number = block.getFieldValue('NUM');
    return [number, javascriptGenerator.ORDER_ATOMIC];
  };
  // Gerador: Se caminho à frente
  javascriptGenerator.forBlock['maze_if_path_ahead'] = function(block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `if (isPathAhead()) {\n${statements}}\n`;
  };
  // Gerador: Se caminho à esquerda
  javascriptGenerator.forBlock['maze_if_path_left'] = function(block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `if (isPathLeft()) {\n${statements}}\n`;
  };
  // Gerador: Se caminho à direita
  javascriptGenerator.forBlock['maze_if_path_right'] = function(block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `if (isPathRight()) {\n${statements}}\n`;
  };
  // Gerador: Enquanto caminho à frente
  javascriptGenerator.forBlock['maze_while_path_ahead'] = function(block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `while (isPathAhead()) {\n${statements}}\n`;
  };
  // Gerador: Se/Senão
  javascriptGenerator.forBlock['maze_if_else'] = function(block) {
    const condition = javascriptGenerator.valueToCode(block, 'IF0', javascriptGenerator.ORDER_NONE) || 'false';
    const doStatements = javascriptGenerator.statementToCode(block, 'DO0');
    const elseStatements = javascriptGenerator.statementToCode(block, 'ELSE');
    return `if (${condition}) {\n${doStatements}} else {\n${elseStatements}}\n`;
  };  // Gerador: Há caminho
  javascriptGenerator.forBlock['maze_path_ahead'] = function() {
    return ['isPathAhead()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };
};

// Configuração da toolbox (caixa de ferramentas)
export const getToolboxConfig = () => {
  return {
    "kind": "categoryToolbox",
    "contents": [
      {
        "kind": "category",
        "name": "🚶 Movimento",
        "colour": "160",
        "contents": [
          {
            "kind": "block",
            "type": "maze_move_forward"
          },
          {
            "kind": "block",
            "type": "maze_turn_left"
          },
          {
            "kind": "block",
            "type": "maze_turn_right"
          }
        ]
      },
      {
        "kind": "category",
        "name": "🔄 Repetição",
        "colour": "120",
        "contents": [
          {
            "kind": "block",
            "type": "maze_repeat",
            "inputs": {
              "TIMES": {
                "shadow": {
                  "type": "maze_number",
                  "fields": {
                    "NUM": 3
                  }
                }
              }
            }
          },
          {
            "kind": "block",
            "type": "maze_while_path_ahead"
          }
        ]
      },
      {
        "kind": "category",
        "name": "🤔 Condições",
        "colour": "210",
        "contents": [
          {
            "kind": "block",
            "type": "maze_if_path_ahead"
          },
          {
            "kind": "block",
            "type": "maze_if_path_left"
          },
          {
            "kind": "block",
            "type": "maze_if_path_right"
          },
          {
            "kind": "block",
            "type": "maze_if_else",
            "inputs": {
              "IF0": {
                "shadow": {
                  "type": "maze_path_ahead"
                }
              }
            }
          }
        ]
      },
      {
        "kind": "category",
        "name": "🔍 Sensores",
        "colour": "210",
        "contents": [
          {
            "kind": "block",
            "type": "maze_path_ahead"
          }
        ]
      },
      {
        "kind": "category",
        "name": "🔢 Números",
        "colour": "230",
        "contents": [
          {
            "kind": "block",
            "type": "maze_number"
          }
        ]
      }
    ]
  };
};

