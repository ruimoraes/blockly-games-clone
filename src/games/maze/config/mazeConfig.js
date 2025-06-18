// Configuração do jogo Maze
export const MAZE_GAME_CONFIG = {
  gameId: 'maze',
  gameName: 'Jogo do Labirinto',
  phases: [
    {
      level: 1,
      name: "Primeiro Passo",
      description: "Aprenda a mover para frente",
      maxBlocks: Infinity,
      startPosition: { x: 2, y: 4, direction: 1 },
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
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 2, 1, 1, 0, 0],
        [0, 0, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 3,
      name: "Curva à Esquerda",
      description: "Aprenda a virar à esquerda",
      maxBlocks: Infinity,
      startPosition: { x: 2, y: 4, direction: 1 },
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 2, 1, 1, 0, 0],
        [0, 0, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 4,
      name: "Caminho em Zigue-Zague",
      description: "Combine movimentos e curvas",
      maxBlocks: Infinity,
      startPosition: { x: 1, y: 5, direction: 1 },
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 5,
      name: "Primeiro Loop",
      description: "Use repetição para economizar blocos",
      maxBlocks: 5,
      startPosition: { x: 1, y: 3, direction: 1 },
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 1, 3],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 6,
      name: "Escadaria",
      description: "Padrão repetitivo com curvas",
      maxBlocks: 8,
      startPosition: { x: 1, y: 5, direction: 1 },
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0],
        [0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 7,
      name: "Labirinto Quadrado",
      description: "Navegue por um labirinto mais complexo",
      maxBlocks: 12,
      startPosition: { x: 1, y: 1, direction: 2 },
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 8,
      name: "Espiral",
      description: "Siga o padrão em espiral",
      maxBlocks: 10,
      startPosition: { x: 3, y: 5, direction: 0 },
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 3, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 2, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 9,
      name: "Labirinto Complexo",
      description: "Teste suas habilidades avançadas",
      maxBlocks: 15,
      startPosition: { x: 1, y: 1, direction: 1 },
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 2, 1, 0, 1, 1, 0],
        [0, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 3, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    },
    {
      level: 10,
      name: "Desafio Final",
      description: "O último desafio - use tudo que aprendeu!",
      maxBlocks: 20,
      startPosition: { x: 1, y: 5, direction: 1 },
      map: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 3, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 0],
        [0, 2, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    }
  ]
};
