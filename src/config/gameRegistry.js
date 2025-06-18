// Central registry for all games in the Blockly Games Clone application
// This registry enables dynamic discovery and loading of games

import { MAZE_GAME_CONFIG } from '../games/maze/config/mazeConfig';
import { PUZZLE_GAME_CONFIG } from '../games/puzzle/config/puzzleGameConfig';

// Enhanced game configurations with metadata for the registry
const enhanceGameConfig = (baseConfig, metadata) => ({
  ...baseConfig,
  ...metadata
});

export const GAMES_REGISTRY = {
  // Maze Game Registration
  maze: enhanceGameConfig(MAZE_GAME_CONFIG, {
    name: 'Jogo do Labirinto',
    icon: '🧩',
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
    route: '/games/maze',
    component: 'MazePage',
    isActive: true,
    enabled: true, // Adicionado para compatibilidade com HomePage
    featured: true,
    ageRange: '8+',
    objectives: [
      'Entender sequências de comandos',
      'Usar loops para otimizar código',
      'Aplicar condicionais para tomada de decisão',
      'Resolver problemas de navegação'
    ],
    metadata: {
      totalPhases: 10,
      hasProgressTracking: true,
      supportsMultipleUsers: false,
      lastUpdated: '2025-06-18',
      version: '2.0.0'
    }
  }),

  // Puzzle Game Registration  
  puzzle: enhanceGameConfig(PUZZLE_GAME_CONFIG, {
    name: 'Quebra-Cabeça dos Animais',
    icon: '🧩',
    description: 'Aprenda sobre variáveis e propriedades configurando animais com blocos Blockly',
    category: 'Variáveis',
    difficulty: 'Iniciante',
    estimatedTime: '20-40 min',
    concepts: [
      'Variáveis',
      'Propriedades de objetos',
      'Tipos de dados',
      'Estruturas de dados'
    ],
    route: '/games/puzzle',
    component: 'PuzzlePage',
    isActive: true,
    enabled: true, // Adicionado para compatibilidade com HomePage
    featured: true,
    ageRange: '7+',
    objectives: [
      'Compreender conceito de variáveis',
      'Trabalhar com propriedades de objetos',
      'Conectar dados relacionados',
      'Resolver problemas lógicos'
    ],
    metadata: {
      totalPhases: 5,
      hasProgressTracking: true,
      supportsMultipleUsers: false,
      lastUpdated: '2025-06-18',
      version: '2.0.0'
    }
  })
};

// Game categories for organization
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

// Difficulty levels
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

// Helper functions for registry manipulation
export const gameRegistryUtils = {
  // Get all active games
  getActiveGames() {
    return Object.values(GAMES_REGISTRY).filter(game => game.isActive);
  },

  // Get featured games
  getFeaturedGames() {
    return Object.values(GAMES_REGISTRY).filter(game => game.featured && game.isActive);
  },

  // Get games by category
  getGamesByCategory(category) {
    return Object.values(GAMES_REGISTRY).filter(game => 
      game.category === category && game.isActive
    );
  },

  // Get games by difficulty
  getGamesByDifficulty(difficulty) {
    return Object.values(GAMES_REGISTRY).filter(game => 
      game.difficulty === difficulty && game.isActive
    );
  },

  // Get game by ID
  getGameById(id) {
    return GAMES_REGISTRY[id];
  },

  // Search games by name or description
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

  // Get all categories with game counts
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

  // Register a new game (for extensibility)
  registerGame(gameConfig) {
    if (!gameConfig.id) {
      throw new Error('Game must have an ID');
    }
    GAMES_REGISTRY[gameConfig.id] = gameConfig;
  },

  // Unregister a game
  unregisterGame(gameId) {
    delete GAMES_REGISTRY[gameId];
  },

  // Update game metadata
  updateGame(gameId, updates) {
    if (GAMES_REGISTRY[gameId]) {
      GAMES_REGISTRY[gameId] = { ...GAMES_REGISTRY[gameId], ...updates };
    }
  }
};

// Legacy compatibility functions
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

// Backward compatibility
export const GAME_REGISTRY = GAMES_REGISTRY;

export default GAMES_REGISTRY;

