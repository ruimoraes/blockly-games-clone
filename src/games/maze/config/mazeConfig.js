export const MAZE_GAME_CONFIG = {
  gameId: 'automato',
  gameName: 'Autômato',
  maxLevel: 10,
  phases: [
    {
      level: 1,
      name: "Primeiro Passo",
      description: "Aprenda a mover para frente",
      maxBlocks: Infinity,
      startPosition: { x: 2, y: 4 },
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
      startPosition: { x: 2, y: 4 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight'],
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
      startPosition: { x: 1, y: 4 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal'],
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
    }, {
      level: 4,
      name: "Escadaria",
      description: "Navegue pela escadaria diagonal",
      maxBlocks: 5,
      startPosition: { x: 1, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal'],
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
    }, {
      level: 5,
      name: "Torre",
      description: "Suba a torre",
      maxBlocks: 5,
      startPosition: { x: 3, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal'],
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
    }, {
      level: 6,
      name: "Caminho em Bloco",
      description: "Use condicionais - verifique se há caminho à frente",
      maxBlocks: 5,
      startPosition: { x: 1, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if'],
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
    }, {
      level: 7,
      name: "Labirinto Ramificado",
      description: "Navegue por caminhos que se ramificam - use condicionais gerais",
      maxBlocks: 10,
      startPosition: { x: 1, y: 2 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if'],
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
      startPosition: { x: 1, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if'],
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
    {
      level: 9,
      name: "Labirinto Avançado",
      description: "Use todas suas habilidades - agora com condicionais if/else",
      maxBlocks: 10,
      startPosition: { x: 5, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if', 'automato_ifElse'],
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
      name: "Labirinto Avançado II",
      description: "Desafie-se com novos caminhos e becos sem saída!",
      maxBlocks: 10,
      startPosition: { x: 6, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if', 'automato_ifElse'],
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 3, 0],
        [0, 1, 0, 1, 0, 1, 1, 0],
        [0, 1, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 0, 1, 0, 0],
        [0, 2, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 11,
      name: "Desafio Final",
      description: "O último desafio - use tudo que aprendeu!",
      maxBlocks: 10,
      startPosition: { x: 1, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if', 'automato_ifElse'],
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
    },
    {
      level: 12,
      name: "Desafio Final II",
      description: "O último desafio - caminho alternativo!",
      maxBlocks: 10,
      startPosition: { x: 6, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if', 'automato_ifElse'],
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 3, 0],
        [0, 1, 0, 1, 0, 1, 1, 0],
        [0, 1, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 0, 1, 0, 0],
        [0, 2, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 13,
      name: "Desafio Final III",
      description: "O labirinto mais complexo até agora!",
      maxBlocks: 10,
      startPosition: { x: 1, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if', 'automato_ifElse'],
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 1, 1, 3, 0],
        [0, 1, 0, 1, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 2, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    }, {
      level: 14,
      name: "Labirinto Avançado III",
      description: "Mais voltas, mais becos, mais desafio!",
      maxBlocks: 10,
      startPosition: { x: 6, y: 6 },
      allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if', 'automato_ifElse'],
      map: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 1, 3, 0],
        [0, 1, 0, 0, 0, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 0, 1, 0, 0],
        [0, 2, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
  level: 15,
  name: "Labirinto Avançado IV",
  description: "Desafie-se sem if/else, só lógica e repetição!",
  maxBlocks: 8,
  startPosition: { x: 6, y: 6 },
  allowedBlocks: ['moveForward', 'turnLeft', 'turnRight', 'automato_repeat_until_goal', 'automato_if'],
  map: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 3, 0],
    [0, 1, 0, 1, 0, 1, 1, 0],
    [0, 1, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0, 1, 0, 0],
    [0, 2, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]
}
  ],

  SquareType: {
    WALL: 0,
    OPEN: 1,
    START: 2,
    FINISH: 3
  },

  DirectionType: {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
  },

  BlockColors: {
    MOVEMENT: 290,  // Roxo para movimento
    LOOPS: 120,     // Verde para loops
    LOGIC: 210      // Azul para lógica
  }
};
