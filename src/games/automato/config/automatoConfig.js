// Configuração do jogo Automato (baseada no Blockly Games Maze original)
export const AUTOMATO_GAME_CONFIG = {
  gameId: 'automato',
  gameName: 'Autômato',
  maxLevel: 10,
  phases: [
    {
      level: 1,
      name: "Primeiro Passo",
      description: "Aprenda a mover para frente",
      maxBlocks: Infinity,
      startPosition: { x: 2, y: 4, direction: 1 },
      allowedBlocks: ['moveForward'], // Apenas movimento básico
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 1, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 2,
      name: "Primeira Curva",
      description: "Aprenda a virar à direita",
      maxBlocks: Infinity,
      startPosition: { x: 2, y: 4, direction: 1 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight'], // Adiciona movimentos de rotação
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 3, 0, 0, 0],
        [0, 0, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 3,
      name: "Linha Reta",
      description: "Use repetição para economizar blocos",
      maxBlocks: 2,
      startPosition: { x: 1, y: 4, direction: 1 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'controls_repeat_ext'], // Adiciona repetição
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },    {
      level: 4,
      name: "Escadaria",
      description: "Navegue pela escadaria diagonal",
      maxBlocks: 5,
      startPosition: { x: 1, y: 6, direction: 1 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'controls_repeat_ext'], // Continua com repetição
      map: [
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 3, 1, 0],
        [0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0],
        [0, 2, 1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0]
      ]
    },    {
      level: 5,
      name: "Torre",
      description: "Suba a torre",
      maxBlocks: 5,
      startPosition: { x: 3, y: 6, direction: 1 }, // Corrigido: direção 1 (Leste) para seguir o caminho
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'controls_repeat_ext'], // Ainda com repetição
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 2, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },    {
      level: 6,
      name: "Caminho em Bloco",
      description: "Use condicionais - verifique se há caminho à frente",
      maxBlocks: 5,
      startPosition: { x: 1, y: 6, direction: 1 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'controls_repeat_ext', 'automato_if'], // Adiciona primeira condicional específica para "caminho à frente"
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 3, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 2, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },    {
      level: 7,
      name: "Labirinto Ramificado",
      description: "Navegue por caminhos que se ramificam - use condicionais gerais",
      maxBlocks: 10,
      startPosition: { x: 1, y: 2, direction: 1 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'controls_repeat_ext', 'automato_if'], // Mantém condicional específica
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0],
        [0, 2, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0],
        [0, 1, 1, 3, 0, 1, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 8,
      name: "Caminho Complexo",
      description: "Um labirinto mais desafiador",
      maxBlocks: 7,
      startPosition: { x: 1, y: 6, direction: 1 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'controls_repeat_ext', 'automato_if'], // Mantém condicional específica
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 2, 1, 1, 0, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {      level: 9,
      name: "Labirinto Avançado",
      description: "Use todas suas habilidades - agora com condicionais if/else",
      maxBlocks: 10,
      startPosition: { x: 5, y: 6, direction: 1 }, // Corrigido: direção 1 (Leste) para seguir o caminho
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'controls_repeat_ext', 'automato_if', 'automato_ifElse'], // Adiciona if/else
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [3, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 2, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 10,
      name: "Desafio Final",
      description: "O último desafio - use tudo que aprendeu!",
      maxBlocks: 10,
      startPosition: { x: 1, y: 6, direction: 1 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'controls_repeat_ext', 'automato_if', 'automato_ifElse'], // Todos os blocos disponíveis
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 3, 0, 1, 0],
        [0, 1, 1, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 1, 0],
        [0, 2, 1, 1, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    }
  ],

  // Configuração dos tipos de mapa
  SquareType: {
    WALL: 0,
    OPEN: 1,
    START: 2,
    FINISH: 3
  },

  // Configuração das direções
  DirectionType: {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
  },

  // Configuração das cores dos blocos (HSV hue)
  BlockColors: {
    MOVEMENT: 290,  // Roxo para movimento
    LOOPS: 120,     // Verde para loops
    LOGIC: 210      // Azul para lógica
  }
};
