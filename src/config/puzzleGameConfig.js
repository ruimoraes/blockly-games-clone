// Configuração do jogo Puzzle
export const PUZZLE_GAME_CONFIG = {
  gameId: 'puzzle',
  gameName: 'Quebra-Cabeça',
  phases: [
    {
      level: 1,
      name: "Primeiros Passos",
      description: "Aprenda sobre propriedades básicas dos animais",
      maxBlocks: Infinity,
      difficulty: 'easy',
      animals: [
        {
          name: 'Duck',
          displayName: 'Pato',
          picture: '/images/animals/duck.png',
          legs: 2,
          traits: ['Beak', 'Feathers'],
          color: '#4CAF50'
        }
      ],
      targetTraits: ['Beak', 'Feathers'],
      instructions: "Complete as propriedades do pato: anexe sua imagem, defina o número de pernas e adicione suas características."
    },
    {
      level: 2,
      name: "Dois Animais",
      description: "Compare propriedades entre diferentes animais",
      maxBlocks: Infinity,
      difficulty: 'easy',
      animals: [
        {
          name: 'Duck',
          displayName: 'Pato',
          picture: '/images/animals/duck.png',
          legs: 2,
          traits: ['Beak', 'Feathers'],
          color: '#4CAF50'
        },
        {
          name: 'Bee',
          displayName: 'Abelha',
          picture: '/images/animals/bee.png',
          legs: 6,
          traits: ['Wings', 'Stinger'],
          color: '#FFC107'
        }
      ],
      targetTraits: ['Beak', 'Feathers', 'Wings', 'Stinger'],
      instructions: "Configure as propriedades do pato e da abelha. Note as diferenças no número de pernas e características."
    },
    {
      level: 3,
      name: "Três Espécies",
      description: "Trabalhe com múltiplas variáveis e propriedades",
      maxBlocks: 15,
      difficulty: 'medium',
      animals: [
        {
          name: 'Duck',
          displayName: 'Pato',
          picture: '/images/animals/duck.png',
          legs: 2,
          traits: ['Beak', 'Feathers'],
          color: '#4CAF50'
        },
        {
          name: 'Bee',
          displayName: 'Abelha',
          picture: '/images/animals/bee.png',
          legs: 6,
          traits: ['Wings', 'Stinger'],
          color: '#FFC107'
        },
        {
          name: 'Snail',
          displayName: 'Caracol',
          picture: '/images/animals/snail.png',
          legs: 0,
          traits: ['Shell', 'Slime'],
          color: '#9C27B0'
        }
      ],
      targetTraits: ['Beak', 'Feathers', 'Wings', 'Stinger', 'Shell', 'Slime'],
      instructions: "Configure três animais diferentes. Use blocos de repetição para otimizar seu código."
    },
    {
      level: 4,
      name: "Propriedades Avançadas",
      description: "Use condicionais para definir propriedades",
      maxBlocks: 12,
      difficulty: 'medium',
      animals: [
        {
          name: 'Duck',
          displayName: 'Pato',
          picture: '/images/animals/duck.png',
          legs: 2,
          traits: ['Beak', 'Feathers'],
          color: '#4CAF50'
        },
        {
          name: 'Bee',
          displayName: 'Abelha',
          picture: '/images/animals/bee.png',
          legs: 6,
          traits: ['Wings', 'Stinger'],
          color: '#FFC107'
        },
        {
          name: 'Snail',
          displayName: 'Caracol',
          picture: '/images/animals/snail.png',
          legs: 0,
          traits: ['Shell', 'Slime'],
          color: '#9C27B0'
        },
        {
          name: 'Cat',
          displayName: 'Gato',
          picture: '/images/animals/cat.png',
          legs: 4,
          traits: ['Whiskers', 'Fur'],
          color: '#FF5722'
        }
      ],
      targetTraits: ['Beak', 'Feathers', 'Wings', 'Stinger', 'Shell', 'Slime', 'Whiskers', 'Fur'],
      instructions: "Use condicionais para definir propriedades baseadas no tipo de animal. Otimize com loops."
    },
    {
      level: 5,
      name: "Desafio Final",
      description: "Domine variáveis e propriedades complexas",
      maxBlocks: 10,
      difficulty: 'hard',
      animals: [
        {
          name: 'Duck',
          displayName: 'Pato',
          picture: '/images/animals/duck.png',
          legs: 2,
          traits: ['Beak', 'Feathers'],
          color: '#4CAF50'
        },
        {
          name: 'Bee',
          displayName: 'Abelha',
          picture: '/images/animals/bee.png',
          legs: 6,
          traits: ['Wings', 'Stinger'],
          color: '#FFC107'
        },
        {
          name: 'Snail',
          displayName: 'Caracol',
          picture: '/images/animals/snail.png',
          legs: 0,
          traits: ['Shell', 'Slime'],
          color: '#9C27B0'
        },
        {
          name: 'Cat',
          displayName: 'Gato',
          picture: '/images/animals/cat.png',
          legs: 4,
          traits: ['Whiskers', 'Fur'],
          color: '#FF5722'
        },
        {
          name: 'Spider',
          displayName: 'Aranha',
          picture: '/images/animals/spider.png',
          legs: 8,
          traits: ['Web', 'Venom'],
          color: '#795548'
        }
      ],
      targetTraits: ['Beak', 'Feathers', 'Wings', 'Stinger', 'Shell', 'Slime', 'Whiskers', 'Fur', 'Web', 'Venom'],
      instructions: "Desafio final! Configure 5 animais usando o mínimo de blocos possível. Use todas as técnicas aprendidas."
    }
  ]
};

