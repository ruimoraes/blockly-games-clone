// Exemplo de configuração para um futuro jogo de quebra-cabeças
export const PUZZLE_GAME_CONFIG = {
  gameId: 'puzzle',
  gameName: 'Jogo de Quebra-Cabeças',
  phases: [
    {
      level: 1,
      name: "Primeiro Quebra-Cabeça",
      description: "Aprenda os conceitos básicos",
      maxBlocks: Infinity,
      difficulty: 'easy',
      puzzleData: {
        // Dados específicos do quebra-cabeças
        pieces: 4,
        theme: 'animals'
      }
    },
    // Mais fases podem ser adicionadas aqui
  ]
};

// Exemplo de configuração para um futuro jogo de pintura
export const PAINT_GAME_CONFIG = {
  gameId: 'paint',
  gameName: 'Jogo de Pintura',
  phases: [
    {
      level: 1,
      name: "Primeira Pintura",
      description: "Aprenda a usar as cores",
      maxBlocks: Infinity,
      difficulty: 'easy',
      paintData: {
        // Dados específicos da pintura
        canvas: { width: 400, height: 300 },
        colors: ['red', 'blue', 'yellow']
      }
    },
    // Mais fases podem ser adicionadas aqui
  ]
};

// Função helper para criar configurações de jogos
export const createGameConfig = (gameId, gameName, phases) => {
  return {
    gameId,
    gameName,
    phases: phases.map((phase, index) => ({
      level: index + 1,
      ...phase
    }))
  };
};

// Função para validar configuração de jogo
export const validateGameConfig = (config) => {
  const required = ['gameId', 'gameName', 'phases'];
  const missing = required.filter(field => !config[field]);
  
  if (missing.length > 0) {
    throw new Error(`Configuração de jogo inválida. Campos obrigatórios ausentes: ${missing.join(', ')}`);
  }
  
  if (!Array.isArray(config.phases) || config.phases.length === 0) {
    throw new Error('Configuração deve ter pelo menos uma fase');
  }
  
  config.phases.forEach((phase, index) => {
    const phaseRequired = ['name', 'description'];
    const phaseMissing = phaseRequired.filter(field => !phase[field]);
    
    if (phaseMissing.length > 0) {
      throw new Error(`Fase ${index + 1} inválida. Campos obrigatórios ausentes: ${phaseMissing.join(', ')}`);
    }
  });
  
  return true;
};

