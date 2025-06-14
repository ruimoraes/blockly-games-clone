// Dados dos labirintos - 10 níveis
export const MAZE_LEVELS = [
  // Nível 1 - Simples caminho reto
  {
    level: 1,
    maxBlocks: Infinity,
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
  // Nível 2 - Curva simples
  {
    level: 2,
    maxBlocks: Infinity,
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
  // Nível 3 - Caminho reto longo
  {
    level: 3,
    maxBlocks: 2,
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
  },
  // Nível 4 - Caminho diagonal
  {
    level: 4,
    maxBlocks: 5,
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
  },
  // Nível 5 - Caminho vertical
  {
    level: 5,
    maxBlocks: 5,
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
  },
  // Nível 6 - Labirinto com curvas
  {
    level: 6,
    maxBlocks: 5,
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
  },
  // Nível 7 - Labirinto mais complexo
  {
    level: 7,
    maxBlocks: 10,
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
  // Nível 8 - Labirinto com obstáculos
  {
    level: 8,
    maxBlocks: 7,
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
  // Nível 9 - Labirinto avançado
  {
    level: 9,
    maxBlocks: 10,
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
  // Nível 10 - Labirinto final
  {
    level: 10,
    maxBlocks: 10,
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
];

// Tipos de quadrados
export const SquareType = {
  WALL: 0,
  OPEN: 1,
  START: 2,
  FINISH: 3
};

// Direções
export const DirectionType = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3
};

// Temas/Skins disponíveis
export const SKINS = [
  {
    id: 0,
    name: 'Pegman',
    sprite: '/src/assets/images/pegman.png',
    tiles: '/src/assets/images/tiles_pegman.png',
    background: false,
    look: '#000'
  },
  {
    id: 1,
    name: 'Astronaut',
    sprite: '/src/assets/images/astro.png',
    tiles: '/src/assets/images/tiles_astro.png',
    background: '/src/assets/images/bg_astro.jpg',
    look: '#fff'
  },
  {
    id: 2,
    name: 'Panda',
    sprite: '/src/assets/images/panda.png',
    tiles: '/src/assets/images/tiles_panda.png',
    background: '/src/assets/images/bg_panda.jpg',
    look: '#000'
  }
];

// Configurações do jogo
export const GAME_CONFIG = {
  SQUARE_SIZE: 50,
  PEGMAN_HEIGHT: 52,
  PEGMAN_WIDTH: 49,
  PATH_WIDTH: 16, // SQUARE_SIZE / 3
  ANIMATION_SPEED: 300, // milliseconds
  MAX_EXECUTION_TIME: 10000 // 10 seconds
};

// Estados do jogo
export const GameState = {
  IDLE: 'idle',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILURE: 'failure',
  TIMEOUT: 'timeout',
  ERROR: 'error'
};

