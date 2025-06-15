import { useState, useCallback, useEffect } from 'react';

// Configuração dos 10 níveis do labirinto
const MAZE_LEVELS = [
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
];

export const useGamePhases = () => {
  const [unlockedPhases, setUnlockedPhases] = useState(() => {
    const saved = localStorage.getItem('blockly-games-unlocked-phases');
    return saved ? JSON.parse(saved) : [1]; // Sempre começa com fase 1 desbloqueada
  });

  const [completedPhases, setCompletedPhases] = useState(() => {
    const saved = localStorage.getItem('blockly-games-completed-phases');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPhase, setCurrentPhase] = useState(() => {
    const saved = localStorage.getItem('blockly-games-current-phase');
    return saved ? parseInt(saved) : 1;
  });

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('blockly-games-unlocked-phases', JSON.stringify(unlockedPhases));
  }, [unlockedPhases]);

  useEffect(() => {
    localStorage.setItem('blockly-games-completed-phases', JSON.stringify(completedPhases));
  }, [completedPhases]);

  useEffect(() => {
    localStorage.setItem('blockly-games-current-phase', currentPhase.toString());
  }, [currentPhase]);

  // Função para desbloquear próxima fase
  const unlockNextPhase = useCallback((phaseNumber) => {
    const nextPhase = phaseNumber + 1;
    if (nextPhase <= 10 && !unlockedPhases.includes(nextPhase)) {
      setUnlockedPhases(prev => [...prev, nextPhase].sort((a, b) => a - b));
    }
  }, [unlockedPhases]);

  // Função para marcar fase como completada
  const completePhase = useCallback((phaseNumber) => {
    if (!completedPhases.includes(phaseNumber)) {
      setCompletedPhases(prev => [...prev, phaseNumber].sort((a, b) => a - b));
      unlockNextPhase(phaseNumber);
    }
  }, [completedPhases, unlockNextPhase]);

  // Função para mudar fase atual
  const changePhase = useCallback((phaseNumber) => {
    if (unlockedPhases.includes(phaseNumber)) {
      setCurrentPhase(phaseNumber);
      return true;
    }
    return false;
  }, [unlockedPhases]);

  // Função para resetar progresso
  const resetProgress = useCallback(() => {
    setUnlockedPhases([1]);
    setCompletedPhases([]);
    setCurrentPhase(1);
    localStorage.removeItem('blockly-games-unlocked-phases');
    localStorage.removeItem('blockly-games-completed-phases');
    localStorage.removeItem('blockly-games-current-phase');
  }, []);

  // Função para ir para próxima fase
  const goToNextPhase = useCallback(() => {
    const nextPhase = currentPhase + 1;
    if (nextPhase <= 10 && unlockedPhases.includes(nextPhase)) {
      setCurrentPhase(nextPhase);
      return true;
    }
    return false;
  }, [currentPhase, unlockedPhases]);

  // Função para ir para fase anterior
  const goToPreviousPhase = useCallback(() => {
    const prevPhase = currentPhase - 1;
    if (prevPhase >= 1) {
      setCurrentPhase(prevPhase);
      return true;
    }
    return false;
  }, [currentPhase]);

  // Verificar se uma fase está desbloqueada
  const isPhaseUnlocked = useCallback((phaseNumber) => {
    return unlockedPhases.includes(phaseNumber);
  }, [unlockedPhases]);

  // Verificar se uma fase está completada
  const isPhaseCompleted = useCallback((phaseNumber) => {
    return completedPhases.includes(phaseNumber);
  }, [completedPhases]);

  // Obter dados da fase atual
  const getCurrentPhaseData = useCallback(() => {
    return MAZE_LEVELS[currentPhase - 1];
  }, [currentPhase]);

  // Obter dados de uma fase específica
  const getPhaseData = useCallback((phaseNumber) => {
    return MAZE_LEVELS[phaseNumber - 1];
  }, []);

  return {
    // Estado
    currentPhase,
    unlockedPhases,
    completedPhases,
    
    // Dados
    getCurrentPhaseData,
    getPhaseData,
    totalPhases: MAZE_LEVELS.length,
    
    // Ações
    changePhase,
    completePhase,
    goToNextPhase,
    goToPreviousPhase,
    resetProgress,
    
    // Verificações
    isPhaseUnlocked,
    isPhaseCompleted,
    
    // Constantes
    MAZE_LEVELS
  };
};

