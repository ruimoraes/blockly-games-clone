// Configuração do jogo Puzzle com fases progressivas
// Ensina conceitos de variáveis e propriedades através de blocos Blockly

export const PUZZLE_GAME_CONFIG = {
  id: 'puzzle',
  name: 'Quebra-Cabeça',
  description: 'Aprenda sobre variáveis e propriedades configurando animais com blocos Blockly',
  
  phases: [
    {
      id: 1,
      title: 'Primeiro Animal',
      description: 'Configure seu primeiro animal usando blocos Blockly',
      instructions: 'Arraste um bloco "Animal", selecione "Pato" e configure suas propriedades: imagem, 2 pernas e características (Bico, Penas).',
      difficulty: 'Fácil',
      maxBlocks: null, // Ilimitado
      requiredAnimals: 1,
      availableAnimals: ['Pato'],
      hint: 'Comece arrastando um bloco "Animal" da categoria "Animais". Depois conecte os blocos de propriedades.',
      objectives: [
        'Usar blocos Blockly para configurar propriedades',
        'Entender conceito de variáveis (imagem, pernas, características)',
        'Conectar blocos corretamente'
      ]
    },
    
    {
      id: 2,
      title: 'Dois Animais',
      description: 'Configure dois animais diferentes',
      instructions: 'Configure o Pato (2 pernas, Bico, Penas) e o Gato (4 pernas, Bigodes, Pelo) usando blocos separados.',
      difficulty: 'Fácil',
      maxBlocks: null,
      requiredAnimals: 2,
      availableAnimals: ['Pato', 'Gato'],
      hint: 'Crie dois blocos "Animal" separados. Cada animal precisa de suas próprias propriedades conectadas.',
      objectives: [
        'Gerenciar múltiplos objetos',
        'Comparar propriedades entre animais',
        'Organizar workspace com múltiplos blocos'
      ]
    },
    
    {
      id: 3,
      title: 'Três Espécies',
      description: 'Trabalhe com três animais diferentes',
      instructions: 'Configure Pato, Gato e Abelha. A Abelha tem 6 pernas e características: Asas, Listras.',
      difficulty: 'Médio',
      maxBlocks: 15,
      requiredAnimals: 3,
      availableAnimals: ['Pato', 'Gato', 'Abelha'],
      hint: 'Organize bem o workspace. Use a categoria "Características" para encontrar os blocos de traits.',
      objectives: [
        'Trabalhar com limitação de blocos',
        'Gerenciar três objetos simultaneamente',
        'Otimizar uso do workspace'
      ]
    },
    
    {
      id: 4,
      title: 'Quatro Animais',
      description: 'Configure quatro animais com propriedades únicas',
      instructions: 'Configure todos os animais: Pato, Gato, Abelha e Caracol. O Caracol tem 0 pernas e características: Concha, Antenas.',
      difficulty: 'Médio',
      maxBlocks: 20,
      requiredAnimals: 4,
      availableAnimals: ['Pato', 'Gato', 'Abelha', 'Caracol'],
      hint: 'O Caracol é especial - tem 0 pernas! Certifique-se de configurar o número correto.',
      objectives: [
        'Dominar todos os tipos de animais',
        'Trabalhar com casos especiais (0 pernas)',
        'Gerenciar workspace complexo'
      ]
    },
    
    {
      id: 5,
      title: 'Desafio Final',
      description: 'Demonstre domínio completo dos conceitos',
      instructions: 'Configure todos os quatro animais corretamente usando o mínimo de blocos possível. Seja eficiente!',
      difficulty: 'Difícil',
      maxBlocks: 16,
      requiredAnimals: 4,
      availableAnimals: ['Pato', 'Gato', 'Abelha', 'Caracol'],
      hint: 'Pense em eficiência! Você pode reutilizar alguns blocos ou organizar melhor o workspace.',
      objectives: [
        'Otimização e eficiência',
        'Domínio completo dos conceitos',
        'Pensamento computacional avançado'
      ]
    }
  ],
  
  // Configurações globais
  settings: {
    autoSave: true,
    showHints: true,
    allowSkipPhases: false,
    progressTracking: true
  },
  
  // Dados educacionais
  concepts: [
    {
      name: 'Variáveis',
      description: 'Propriedades que armazenam informações sobre os animais',
      examples: ['imagem', 'número de pernas', 'características']
    },
    {
      name: 'Tipos de Dados',
      description: 'Diferentes tipos de informação que as variáveis podem armazenar',
      examples: ['Imagem (string)', 'Pernas (número)', 'Características (lista)']
    },
    {
      name: 'Objetos',
      description: 'Entidades que possuem múltiplas propriedades relacionadas',
      examples: ['Animal com imagem, pernas e características']
    },
    {
      name: 'Conexões Lógicas',
      description: 'Como diferentes propriedades se relacionam para formar um objeto completo',
      examples: ['Conectar blocos para formar animal completo']
    }
  ],
  
  // Critérios de avaliação
  evaluation: {
    correctness: 'Todas as propriedades devem estar corretas para cada animal',
    efficiency: 'Usar blocos de forma organizada e eficiente',
    understanding: 'Demonstrar compreensão dos conceitos de variáveis e propriedades'
  }
};

