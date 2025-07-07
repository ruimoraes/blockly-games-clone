import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

// Função para gerar toolbox dinâmico baseado nos blocos permitidos
export const generateDynamicToolbox = (allowedBlocks = []) => {
  const blockDefinitions = {
    'moveForward': {
      kind: 'block',
      type: 'automato_move_forward'
    },
    'turnLeft': {
      kind: 'block',
      type: 'automato_turn_left'
    },
    'turnRight': {
      kind: 'block',
      type: 'automato_turn_right'
    },
    'automato_if': {
      kind: 'block',
      type: 'automato_if'
    },
    'automato_ifElse': {
      kind: 'block',
      type: 'automato_ifElse'
    },
    'isPathAhead': {
      kind: 'block',
      type: 'automato_is_path_ahead'
    },
    'isPathLeft': {
      kind: 'block',
      type: 'automato_is_path_left'
    },
    'isPathRight': {
      kind: 'block',
      type: 'automato_is_path_right'
    },
    'automato_repeat_until_goal': {
      kind: 'block',
      type: 'automato_repeat_until_goal'
    }
  };

  const toolboxContents = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Movimentos',
        colour: '160',
        contents: []
      },
      {
        kind: 'category',
        name: 'Lógica',
        colour: '210',
        contents: []
      },
      {
        kind: 'category',
        name: 'Sensores',
        colour: '290',
        contents: []
      }
    ]
  };

  // Distribuir blocos nas categorias corretas
  allowedBlocks.forEach(blockId => {
    const blockDef = blockDefinitions[blockId];
    if (!blockDef) return;    if (['moveForward', 'turnLeft', 'turnRight'].includes(blockId)) {
      toolboxContents.contents[0].contents.push(blockDef);
    } else if (['automato_repeat_until_goal', 'automato_if', 'automato_ifElse'].includes(blockId)) {
      toolboxContents.contents[1].contents.push(blockDef);
    } else if (['isPathAhead', 'isPathLeft', 'isPathRight'].includes(blockId)) {
      toolboxContents.contents[2].contents.push(blockDef);
    }
  });

  // Remover categorias vazias
  toolboxContents.contents = toolboxContents.contents.filter(category => 
    category.contents && category.contents.length > 0
  );

  return toolboxContents;
};

// Definir blocos customizados para o jogo Automato
export const defineBlocks = () => {
  // Bloco: Mover Frente
  Blockly.Blocks['automato_move_forward'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🤖 mover frente");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Move o autômato uma posição para frente");
      this.setHelpUrl("");
    }
  };

  // Bloco: Virar à Esquerda
  Blockly.Blocks['automato_turn_left'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("↺ virar à esquerda");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip("Vira o autômato 90° para a esquerda");
      this.setHelpUrl("");
    }
  };

  // Bloco: Virar à Direita
  Blockly.Blocks['automato_turn_right'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("↻ virar à direita");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip("Vira o autômato 90° para a direita");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se caminho à frente
  Blockly.Blocks['automato_if_path_ahead'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔍 se caminho à frente");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("fazer");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Executa as ações se houver caminho livre à frente");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se caminho à esquerda
  Blockly.Blocks['automato_if_path_left'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔍 se caminho à esquerda");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("fazer");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Executa as ações se houver caminho livre à esquerda");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se caminho à direita
  Blockly.Blocks['automato_if_path_right'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔍 se caminho à direita");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("fazer");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Executa as ações se houver caminho livre à direita");
      this.setHelpUrl("");
    }
  };

  // Bloco: Enquanto caminho à frente
  Blockly.Blocks['automato_while_path_ahead'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔄 enquanto caminho à frente");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("fazer");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Repete as ações enquanto houver caminho livre à frente");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se (condicional simples) - similar ao maze_if do Blockly Games
  Blockly.Blocks['automato_if'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("se")
          .appendField(new Blockly.FieldDropdown([
            ["há caminho à frente", "isPathAhead"],
            ["há caminho à esquerda", "isPathLeft"], 
            ["há caminho à direita", "isPathRight"]
          ]), "DIR");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("faça");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Execute comandos se a condição for verdadeira");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se/Senão (condicional com else) - similar ao maze_ifElse do Blockly Games
  Blockly.Blocks['automato_ifElse'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("se")
          .appendField(new Blockly.FieldDropdown([
            ["há caminho à frente", "isPathAhead"],
            ["há caminho à esquerda", "isPathLeft"], 
            ["há caminho à direita", "isPathRight"]
          ]), "DIR");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("faça");
      this.appendStatementInput("ELSE")
          .setCheck(null)
          .appendField("senão");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Execute comandos diferentes dependendo da condição");
      this.setHelpUrl("");
    }
  };

  // Bloco: Há caminho
  Blockly.Blocks['automato_path_ahead'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔍 há caminho à frente?");
      this.setOutput(true, "Boolean");
      this.setColour(210);
      this.setTooltip("Verifica se há caminho livre à frente");
      this.setHelpUrl("");
    }
  };

  // Bloco: Verificar se há caminho à frente
  Blockly.Blocks['automato_is_path_ahead'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("👁️ há caminho à frente?");
      this.setOutput(true, "Boolean");
      this.setColour(290);
      this.setTooltip("Verifica se há um caminho livre à frente do autômato");
      this.setHelpUrl("");
    }
  };

  // Bloco: Verificar se há caminho à esquerda
  Blockly.Blocks['automato_is_path_left'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("👁️ há caminho à esquerda?");
      this.setOutput(true, "Boolean");
      this.setColour(290);
      this.setTooltip("Verifica se há um caminho livre à esquerda do autômato");
      this.setHelpUrl("");
    }
  };

  // Bloco: Verificar se há caminho à direita
  Blockly.Blocks['automato_is_path_right'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("👁️ há caminho à direita?");
      this.setOutput(true, "Boolean");
      this.setColour(290);
      this.setTooltip("Verifica se há um caminho livre à direita do autômato");
      this.setHelpUrl("");
    }
  };

  // Bloco: Repita até o objetivo
  Blockly.Blocks['automato_repeat_until_goal'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('🔁 repita até o objetivo');
      this.appendStatementInput('DO')
          .setCheck(null)
          .appendField('fazer');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip('Repete as ações até o objetivo ser alcançado');
      this.setHelpUrl('');
    }
  };

};

// Definir geradores de código JavaScript
export const defineGenerators = () => {
  // Gerador: Mover Frente
  javascriptGenerator.forBlock['automato_move_forward'] = function() {
    return 'await moveForward();\n';
  };

  // Gerador: Virar à Esquerda
  javascriptGenerator.forBlock['automato_turn_left'] = function() {
    return 'await turnLeft();\n';
  };

  // Gerador: Virar à Direita
  javascriptGenerator.forBlock['automato_turn_right'] = function() {
    return 'await turnRight();\n';
  };

  // Gerador: Número
  javascriptGenerator.forBlock['automato_number'] = function(block) {
    const code = Number(block.getFieldValue('NUM'));
    return [code, javascriptGenerator.ORDER_ATOMIC];
  };

  // Gerador: Se caminho à frente
  javascriptGenerator.forBlock['automato_if_path_ahead'] = function(block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `await if (isPathAhead()) {\n${statements}}\n`;
  };

  // Gerador: Se caminho à esquerda
  javascriptGenerator.forBlock['automato_if_path_left'] = function(block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `await if (isPathLeft()) {\n${statements}}\n`;
  };

  // Gerador: Se caminho à direita
  javascriptGenerator.forBlock['automato_if_path_right'] = function(block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `await if (isPathRight()) {\n${statements}}\n`;
  };

  // Gerador: Enquanto caminho à frente
  javascriptGenerator.forBlock['automato_while_path_ahead'] = function(block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `while (isPathAhead()) {\n${statements}}\n`;
  };

  // Gerador: Se (condicional simples)
  javascriptGenerator.forBlock['automato_if'] = function(block) {
    const condition = block.getFieldValue('DIR');
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `if (${condition}()) {\n${statements}}\n`;
  };

  // Gerador: Se/Senão (condicional com else)
  javascriptGenerator.forBlock['automato_ifElse'] = function(block) {
    const condition = block.getFieldValue('DIR');
    const statementsIf = javascriptGenerator.statementToCode(block, 'DO');
    const statementsElse = javascriptGenerator.statementToCode(block, 'ELSE');
    return `if (${condition}()) {\n${statementsIf}} else {\n${statementsElse}}\n`;
  };  

  // Gerador: Há caminho
  javascriptGenerator.forBlock['automato_path_ahead'] = function() {
    return ['isPathAhead()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  // Gerador: Há caminho a esquerda
  javascriptGenerator.forBlock['automato_is_path_left'] = function() {
    return ['isPathLeft()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  // Gerador: Há caminho a direita  
  javascriptGenerator.forBlock['automato_is_path_right'] = function() {
    return ['isPathRight()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  // Gerador: Repita até o objetivo
  javascriptGenerator.forBlock['automato_repeat_until_goal'] = function (block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `while (!isAtGoal() && !isFailure()) {\n${statements}}\n`;
  };
};

// Configuração da toolbox (caixa de ferramentas)
export const getToolboxConfig = () => {
  return {
    "kind": "categoryToolbox",
    "contents": [
      {
        "kind": "category",
        "name": "🤖 Movimento",
        "colour": "160",
        "contents": [
          {
            "kind": "block",
            "type": "automato_move_forward"
          },
          {
            "kind": "block",
            "type": "automato_turn_left"
          },
          {
            "kind": "block",
            "type": "automato_turn_right"
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
            "type": "automato_repeat_until_goal"
          },
          {
            "kind": "block",
            "type": "automato_while_path_ahead"
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
            "type": "automato_if_path_ahead"
          },
          {
            "kind": "block",
            "type": "automato_if_path_left"
          },
          {
            "kind": "block",
            "type": "automato_if_path_right"
          },
          {
            "kind": "block",
            "type": "automato_if_else",
            "inputs": {
              "IF0": {
                "shadow": {
                  "type": "automato_path_ahead"
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
            "type": "automato_path_ahead"
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
            "type": "automato_number"
          }
        ]
      }
    ]
  };
};