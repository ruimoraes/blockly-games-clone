import { AUTOMATO_GAME_CONFIG } from '../games/automato/config/automatoConfig';
import { BEE_GAME_CONFIG } from '../games/bee/config/beeConfig';

const enhanceGameConfig = (baseConfig, metadata) => ({
  ...baseConfig,
  ...metadata
});

export const GAMES_REGISTRY = {
  maze: enhanceGameConfig(AUTOMATO_GAME_CONFIG, {
    name: 'Autômato',
    icon: '🤖',
    description: 'Aprenda programação navegando por labirintos com blocos Blockly',
    category: 'Lógica',
    difficulty: 'Iniciante',
    estimatedTime: '15-30 min',
    concepts: [
      'Sequências',
      'Loops/Repetição', 
      'Condicionais',
      'Estruturas de controle'
    ],
    route: '/games/automato',
    component: 'AutomatoPage',
    isActive: true,
    enabled: true,
    featured: true,
    objectives: [
      'Entender sequências de comandos',
      'Usar loops para otimizar código',
      'Aplicar condicionais para tomada de decisão',
      'Resolver problemas de navegação'
    ],
    metadata: {
      totalPhases: 15,
      hasProgressTracking: true,
      supportsMultipleUsers: false,
      lastUpdated: '2025-06-18',
      version: '2.0.0'
    }
  }),

  bee: enhanceGameConfig(BEE_GAME_CONFIG, {
    name: 'Abelha',
    icon: '🐝',
    description: 'Aprenda programação visual guiando uma abelha para coletar néctar',
    category: 'Lógica',
    difficulty: 'Iniciante',
    estimatedTime: '15-30 min',
    concepts: [
      'Movimento baseado em ângulos',
      'Coleta de recursos',
      'Condicionais',
      'Loops básicos'
    ],
    route: '/games/bee',
    component: 'BeePage',
    isActive: true,
    enabled: true,
    featured: true,
    objectives: [
      'Entender movimento baseado em ângulos',
      'Coletar recursos de forma eficiente',
      'Usar condicionais para tomada de decisão',
      'Resolver problemas de navegação'
    ],
    metadata: {
      totalPhases: 10,
      hasProgressTracking: true,
      supportsMultipleUsers: false,
      lastUpdated: '2025-07-08',
      version: '1.0.0'
    }
  }),
};

export const GAME_CATEGORIES = {
  'Lógica': {
    name: 'Lógica e Algoritmos',
    description: 'Jogos focados em pensamento lógico e estruturas algorítmicas',
    color: '#3498db',
    icon: '🧠'
  },
  'Variáveis': {
    name: 'Variáveis e Dados',
    description: 'Jogos que ensinam sobre armazenamento e manipulação de dados',
    color: '#e74c3c',
    icon: '📊'
  },
  'Funções': {
    name: 'Funções e Módulos',
    description: 'Jogos sobre criação e uso de funções reutilizáveis',
    color: '#2ecc71',
    icon: '⚙️'
  },
  'Eventos': {
    name: 'Eventos e Interação',
    description: 'Jogos focados em programação orientada a eventos',
    color: '#f39c12',
    icon: '🎮'
  }
};

export const DIFFICULTY_LEVELS = {
  'Iniciante': {
    name: 'Iniciante',
    description: 'Ideal para quem está começando',
    color: '#27ae60',
    level: 1
  },
  'Intermediário': {
    name: 'Intermediário', 
    description: 'Para quem já tem conhecimento básico',
    color: '#f39c12',
    level: 2
  },
  'Avançado': {
    name: 'Avançado',
    description: 'Para usuários experientes',
    color: '#e74c3c',
    level: 3
  }
};

export const gameRegistryUtils = {
  getActiveGames() {
    return Object.values(GAMES_REGISTRY).filter(game => game.isActive);
  },

  getFeaturedGames() {
    return Object.values(GAMES_REGISTRY).filter(game => game.featured && game.isActive);
  },

  getGamesByCategory(category) {
    return Object.values(GAMES_REGISTRY).filter(game => 
      game.category === category && game.isActive
    );
  },

  getGamesByDifficulty(difficulty) {
    return Object.values(GAMES_REGISTRY).filter(game => 
      game.difficulty === difficulty && game.isActive
    );
  },

  getGameById(id) {
    return GAMES_REGISTRY[id];
  },

  searchGames(query) {
    const searchTerm = query.toLowerCase();
    return Object.values(GAMES_REGISTRY).filter(game =>
      game.isActive && (
        game.name.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm) ||
        game.concepts.some(concept => concept.toLowerCase().includes(searchTerm))
      )
    );
  },

  getCategoriesWithCounts() {
    const categories = {};
    Object.values(GAMES_REGISTRY).forEach(game => {
      if (game.isActive) {
        if (!categories[game.category]) {
          categories[game.category] = {
            ...GAME_CATEGORIES[game.category],
            games: []
          };
        }
        categories[game.category].games.push(game);
      }
    });
    return categories;
  },

  registerGame(gameConfig) {
    if (!gameConfig.id) {
      throw new Error('Game must have an ID');
    }
    GAMES_REGISTRY[gameConfig.id] = gameConfig;
  },

  unregisterGame(gameId) {
    delete GAMES_REGISTRY[gameId];
  },

  updateGame(gameId, updates) {
    if (GAMES_REGISTRY[gameId]) {
      GAMES_REGISTRY[gameId] = { ...GAMES_REGISTRY[gameId], ...updates };
    }
  }
};

export const getGameConfig = (gameId) => {
  const config = GAMES_REGISTRY[gameId];
  if (!config) {
    throw new Error(`Jogo '${gameId}' não encontrado no registry`);
  }
  return config;
};

export const getAllGames = () => {
  return Object.values(GAMES_REGISTRY);
};

export const registerGame = (gameConfig) => {
  if (!gameConfig.gameId && !gameConfig.id) {
    throw new Error('gameId ou id é obrigatório para registrar um jogo');
  }
  
  const id = gameConfig.gameId || gameConfig.id;
  GAMES_REGISTRY[id] = gameConfig;
  return gameConfig;
};

export const GAME_REGISTRY = GAMES_REGISTRY;

export default GAMES_REGISTRY;

