import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';

// Função para gerar toolbox dinâmico baseado nos blocos permitidos
export const generateDynamicToolbox = (allowedBlocks = []) => {
  const blockDefinitions = {
    'bee_move': {
      kind: 'block',
      type: 'bee_move'
    },
    'bee_nectar': {
      kind: 'block',
      type: 'bee_nectar'
    },
    'bee_if_flower': {
      kind: 'block',
      type: 'bee_if_flower'
    },
    'bee_if_else': {
      kind: 'block',
      type: 'bee_if_else'
    },
    'bee_repeat': {
      kind: 'block',
      type: 'bee_repeat'
    },
    'bee_at_flower': {
      kind: 'block',
      type: 'bee_at_flower'
    },
    'bee_at_hive': {
      kind: 'block',
      type: 'bee_at_hive'
    },
    'bee_nectar_available': {
      kind: 'block',
      type: 'bee_nectar_available'
    }
  };

  const toolboxContents = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Movimento',
        colour: '160',
        contents: []
      },
      {
        kind: 'category',
        name: 'Ações',
        colour: '40',
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
    if (!blockDef) return;

    if (['bee_move'].includes(blockId)) {
      toolboxContents.contents[0].contents.push(blockDef);
    } else if (['bee_nectar'].includes(blockId)) {
      toolboxContents.contents[1].contents.push(blockDef);
    } else if (['bee_if_flower', 'bee_if_else', 'bee_repeat'].includes(blockId)) {
      toolboxContents.contents[2].contents.push(blockDef);
    } else if (['bee_at_flower', 'bee_at_hive', 'bee_nectar_available'].includes(blockId)) {
      toolboxContents.contents[3].contents.push(blockDef);
    }
  });

  // Remover categorias vazias
  toolboxContents.contents = toolboxContents.contents.filter(category => 
    category.contents && category.contents.length > 0
  );

  return toolboxContents;
};

// Definir blocos customizados para o jogo Bee
export const defineBlocks = () => {
  // Bloco: Mover/Voar
  Blockly.Blocks['bee_move'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🐝 voar para")
          .appendField(new Blockly.FieldAngle(0), "ANGLE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Move a abelha na direção especificada");
      this.setHelpUrl("");
    }
  };

  // Bloco: Coletar Néctar
  Blockly.Blocks['bee_nectar'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🌸 coletar néctar");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(40);
      this.setTooltip("Coleta néctar se estiver em uma flor");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se há flor
  Blockly.Blocks['bee_if_flower'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🌺 se há flor aqui");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("faça");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Executa ações se houver uma flor na posição atual");
      this.setHelpUrl("");
    }
  };

  // Bloco: Se/Senão
  Blockly.Blocks['bee_if_else'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🌺 se há flor aqui");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("faça");
      this.appendStatementInput("ELSE")
          .setCheck(null)
          .appendField("senão");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Executa diferentes ações dependendo se há flor");
      this.setHelpUrl("");
    }
  };

  // Bloco: Repetir
  Blockly.Blocks['bee_repeat'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔄 repetir")
          .appendField(new Blockly.FieldNumber(5, 1, 10), "TIMES")
          .appendField("vezes");
      this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("faça");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip("Repete as ações um número específico de vezes");
      this.setHelpUrl("");
    }
  };

  // Bloco: Está na flor (sensor)
  Blockly.Blocks['bee_at_flower'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🌸 está na flor?");
      this.setOutput(true, "Boolean");
      this.setColour(290);
      this.setTooltip("Verifica se a abelha está em uma flor");
      this.setHelpUrl("");
    }
  };

  // Bloco: Está na colmeia (sensor)
  Blockly.Blocks['bee_at_hive'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🍯 está na colmeia?");
      this.setOutput(true, "Boolean");
      this.setColour(290);
      this.setTooltip("Verifica se a abelha está na colmeia");
      this.setHelpUrl("");
    }
  };

  // Bloco: Néctar disponível (sensor)
  Blockly.Blocks['bee_nectar_available'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🌺 há néctar disponível?");
      this.setOutput(true, "Boolean");
      this.setColour(290);
      this.setTooltip("Verifica se há néctar disponível na flor atual");
      this.setHelpUrl("");
    }
  };
};

// Definir geradores de código JavaScript
export const defineGenerators = () => {
  // Gerador: Mover/Voar
  javascriptGenerator.forBlock['bee_move'] = function(block) {
    const angle = block.getFieldValue('ANGLE');
    return `await beeMove(${angle});\n`;
  };

  // Gerador: Coletar Néctar
  javascriptGenerator.forBlock['bee_nectar'] = function(block) {
    return 'await collectNectar();\n';
  };

  // Gerador: Se há flor
  javascriptGenerator.forBlock['bee_if_flower'] = function(block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `if (atFlower()) {\n${statements}}\n`;
  };

  // Gerador: Se/Senão
  javascriptGenerator.forBlock['bee_if_else'] = function(block) {
    const statementsIf = javascriptGenerator.statementToCode(block, 'DO');
    const statementsElse = javascriptGenerator.statementToCode(block, 'ELSE');
    return `if (atFlower()) {\n${statementsIf}} else {\n${statementsElse}}\n`;
  };

  // Gerador: Repetir
  javascriptGenerator.forBlock['bee_repeat'] = function(block) {
    const times = block.getFieldValue('TIMES');
    const statements = javascriptGenerator.statementToCode(block, 'DO');
    return `for (let i = 0; i < ${times}; i++) {\n${statements}}\n`;
  };

  // Gerador: Está na flor
  javascriptGenerator.forBlock['bee_at_flower'] = function(block) {
    return ['atFlower()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  // Gerador: Está na colmeia
  javascriptGenerator.forBlock['bee_at_hive'] = function(block) {
    return ['atHive()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  // Gerador: Néctar disponível
  javascriptGenerator.forBlock['bee_nectar_available'] = function(block) {
    return ['nectarAvailable()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };
};
