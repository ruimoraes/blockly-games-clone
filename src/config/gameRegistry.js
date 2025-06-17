import { MAZE_GAME_CONFIG } from '../games/maze/config/mazeConfig';
import { PUZZLE_GAME_CONFIG } from '../games/puzzle/config/puzzleGameConfig';

// Registry de todos os jogos disponíveis
export const GAME_REGISTRY = {
  maze: MAZE_GAME_CONFIG,
  puzzle: PUZZLE_GAME_CONFIG,
  paint: PAINT_GAME_CONFIG
};

// Função para obter configuração de um jogo
export const getGameConfig = (gameId) => {
  const config = GAME_REGISTRY[gameId];
  if (!config) {
    throw new Error(`Jogo '${gameId}' não encontrado no registry`);
  }
  return config;
};

// Função para listar todos os jogos disponíveis
export const getAllGames = () => {
  return Object.values(GAME_REGISTRY);
};

// Função para registrar um novo jogo
export const registerGame = (gameConfig) => {
  if (!gameConfig.gameId) {
    throw new Error('gameId é obrigatório para registrar um jogo');
  }
  
  GAME_REGISTRY[gameConfig.gameId] = gameConfig;
  return gameConfig;
};

