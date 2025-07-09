export const BEE_GAME_CONFIG = {
  gameId: 'bee',
  gameName: 'Bee',
  maxLevel: 10,
  phases: [
    {
      level: 1,
      name: "Primeiro Voo",
      description: "Aprenda a voar para frente",
      maxBlocks: Infinity,
      startPosition: { x: 20, y: 20 },
      startAngle: 0,
      allowedBlocks: ['bee_move'],
      flower: { x: 80, y: 20 },
      hive: null, // Não há colmeia neste nível
      walls: []
    },
    {
      level: 2,
      name: "Mudança de Direção",
      description: "Aprenda a voar em diferentes direções",
      maxBlocks: Infinity,
      startPosition: { x: 20, y: 20 },
      startAngle: 0,
      allowedBlocks: ['bee_move'],
      flower: { x: 20, y: 80 },
      hive: null,
      walls: []
    },
    {
      level: 3,
      name: "Primeira Coleta",
      description: "Colete néctar e retorne à colmeia",
      maxBlocks: Infinity,
      startPosition: { x: 20, y: 20 },
      startAngle: 0,
      allowedBlocks: ['bee_move', 'bee_nectar'],
      flower: { x: 80, y: 20 },
      hive: { x: 20, y: 80 },
      walls: []
    },
    {
      level: 4,
      name: "Evitando Obstáculos",
      description: "Navegue ao redor das paredes",
      maxBlocks: Infinity,
      startPosition: { x: 20, y: 20 },
      startAngle: 0,
      allowedBlocks: ['bee_move', 'bee_nectar'],
      flower: { x: 80, y: 20 },
      hive: { x: 20, y: 80 },
      walls: [
        { x1: 50, y1: 0, x2: 50, y2: 40 }
      ]
    },
    {
      level: 5,
      name: "Condições Básicas",
      description: "Use condições para verificar se há néctar",
      maxBlocks: 5,
      startPosition: { x: 20, y: 20 },
      startAngle: 0,
      allowedBlocks: ['bee_move', 'bee_nectar', 'bee_if_flower'],
      flower: { x: 80, y: 20 },
      hive: { x: 20, y: 80 },
      walls: []
    },
    {
      level: 6,
      name: "Decisões Múltiplas",
      description: "Use if/else para tomar decisões",
      maxBlocks: 8,
      startPosition: { x: 20, y: 20 },
      startAngle: 0,
      allowedBlocks: ['bee_move', 'bee_nectar', 'bee_if_flower', 'bee_if_else'],
      flower: { x: 80, y: 20 },
      hive: { x: 20, y: 80 },
      walls: []
    },
    {
      level: 7,
      name: "Múltiplas Flores",
      description: "Colete de várias flores",
      maxBlocks: 10,
      startPosition: { x: 20, y: 20 },
      startAngle: 0,
      allowedBlocks: ['bee_move', 'bee_nectar', 'bee_if_flower', 'bee_if_else', 'bee_repeat'],
      flowers: [
        { x: 50, y: 20 },
        { x: 80, y: 20 },
        { x: 80, y: 50 }
      ],
      hive: { x: 20, y: 80 },
      walls: []
    },
    {
      level: 8,
      name: "Labirinto Floral",
      description: "Navegue por um labirinto complexo",
      maxBlocks: 12,
      startPosition: { x: 20, y: 20 },
      startAngle: 0,
      allowedBlocks: ['bee_move', 'bee_nectar', 'bee_if_flower', 'bee_if_else', 'bee_repeat'],
      flowers: [
        { x: 50, y: 50 },
        { x: 80, y: 80 }
      ],
      hive: { x: 20, y: 80 },
      walls: [
        { x1: 40, y1: 0, x2: 40, y2: 40 },
        { x1: 60, y1: 40, x2: 60, y2: 100 },
        { x1: 0, y1: 60, x2: 40, y2: 60 }
      ]
    },
    {
      level: 9,
      name: "Eficiência Energética",
      description: "Complete com o mínimo de movimentos",
      maxBlocks: 8,
      startPosition: { x: 20, y: 50 },
      startAngle: 0,
      allowedBlocks: ['bee_move', 'bee_nectar', 'bee_if_flower', 'bee_if_else', 'bee_repeat'],
      flowers: [
        { x: 80, y: 50 }
      ],
      hive: { x: 50, y: 20 },
      walls: [
        { x1: 35, y1: 35, x2: 65, y2: 35 },
        { x1: 35, y1: 65, x2: 65, y2: 65 }
      ]
    },
    {
      level: 10,
      name: "Desafio Final",
      description: "Use todas as habilidades aprendidas",
      maxBlocks: 15,
      startPosition: { x: 20, y: 80 },
      startAngle: 0,
      allowedBlocks: ['bee_move', 'bee_nectar', 'bee_if_flower', 'bee_if_else', 'bee_repeat'],
      flowers: [
        { x: 50, y: 20 },
        { x: 80, y: 50 },
        { x: 30, y: 50 }
      ],
      hive: { x: 80, y: 80 },
      walls: [
        { x1: 0, y1: 35, x2: 35, y2: 35 },
        { x1: 65, y1: 35, x2: 100, y2: 35 },
        { x1: 35, y1: 35, x2: 35, y2: 65 },
        { x1: 65, y1: 35, x2: 65, y2: 65 }
      ]
    }
  ],

  // Configurações de elementos do jogo
  ElementType: {
    EMPTY: 0,
    FLOWER: 1,
    HIVE: 2,
    WALL: 3,
    BEE: 4
  },

  // Configurações de cores dos blocos
  BlockColors: {
    MOVEMENT: 160,    // Verde para movimento
    ACTIONS: 40,      // Laranja para ações
    LOGIC: 210,       // Azul para lógica
    SENSORS: 290      // Roxo para sensores
  }
};
