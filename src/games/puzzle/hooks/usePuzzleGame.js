import { useState, useCallback, useEffect } from 'react';
import * as Blockly from 'blockly';
import { useBaseGame } from '../../../hooks/useBaseGame';
import { PUZZLE_GAME_CONFIG } from '../config/puzzleGameConfig';
import { checkPuzzleSolution, ANIMALS_DATA } from '../blocks/puzzleBlocks';

export const usePuzzleGame = () => {
  // Estados específicos do Puzzle
  const [animalStates, setAnimalStates] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameState, setGameState] = useState('idle');
  const [isExecuting, setIsExecuting] = useState(false);

  // Usar hook base genérico
  const baseGameHook = useBaseGame(PUZZLE_GAME_CONFIG);
  
  // Desestruturar dados do hook base
  const {
    currentPhase,
    getCurrentPhaseData,
    completePhase,
    handlePhaseChange,
    handleNextPhase,
    handlePreviousPhase,
    unlockedPhases,
    completedPhases,
    totalPhases,
    getPhaseData,
    gameConfig
  } = baseGameHook;

  // Obter dados da fase atual
  const currentPhaseData = getCurrentPhaseData();

  // Inicializar estados dos animais baseado na fase atual
  const initializeAnimalStates = useCallback(() => {
    const phaseData = getCurrentPhaseData();
    if (phaseData) {
      const requiredAnimals = phaseData.requiredAnimals || 1;
      const initialStates = Array(requiredAnimals).fill(null).map(() => ({
        animalId: '0',
        isCorrect: false,
        hasImage: false,
        hasLegs: false,
        hasTraits: false
      }));
      setAnimalStates(initialStates);
      setIsComplete(false);
    }
  }, [getCurrentPhaseData]);

  // Executar inicialização quando a fase mudar
  useEffect(() => {
    initializeAnimalStates();
  }, [initializeAnimalStates]);

  // Verificar solução do puzzle
  const checkSolution = useCallback(() => {
    if (!workspace) return false;

    const animalBlocks = workspace.getBlocksByType('puzzle_animal');
    const newStates = [...animalStates];
    let correctCount = 0;

    // Verificar cada bloco de animal
    animalBlocks.forEach((block, index) => {
      if (index < newStates.length) {
        const animalId = block.getFieldValue('ANIMAL_ID');
        const isCorrect = block.isCorrect();
        
        newStates[index] = {
          animalId,
          isCorrect,
          hasImage: !!block.getInputTargetBlock('PICTURE'),
          hasLegs: !!block.getInputTargetBlock('LEGS'),
          hasTraits: !!block.getInputTargetBlock('TRAITS')
        };

        if (isCorrect) correctCount++;
      }
    });

    // Verificar se há blocos de animal suficientes
    const requiredAnimals = currentPhaseData?.requiredAnimals || 1;
    
    if (animalBlocks.length < requiredAnimals) {
      // Preencher estados faltantes
      for (let i = animalBlocks.length; i < requiredAnimals; i++) {
        if (i < newStates.length) {
          newStates[i] = {
            animalId: '0',
            isCorrect: false,
            hasImage: false,
            hasLegs: false,
            hasTraits: false
          };
        }
      }
    }

    setAnimalStates(newStates);

    // Verificar se o puzzle está completo
    const isPhaseComplete = correctCount >= requiredAnimals;
    setIsComplete(isPhaseComplete);

    if (isPhaseComplete) {
      completePhase(currentPhase);
    }

    return isPhaseComplete;
  }, [workspace, animalStates, currentPhaseData, completePhase, currentPhase]);

  // Resetar puzzle
  const resetPuzzle = useCallback(() => {
    if (workspace) {
      workspace.clear();
    }
    initializeAnimalStates();
    setShowHint(false);
  }, [workspace, initializeAnimalStates]);

  // Mostrar dica
  const toggleHint = useCallback(() => {
    setShowHint(prev => !prev);
  }, []);

  // Obter dica para a fase atual
  const getCurrentHint = useCallback(() => {
    if (!currentPhaseData) return '';
    return currentPhaseData.hint || 'Arraste blocos para configurar os animais.';
  }, [currentPhaseData]);

  // Listener para mudanças no workspace
  const handleWorkspaceChange = useCallback((newWorkspace, event) => {
    if (newWorkspace && newWorkspace !== workspace) {
      setWorkspace(newWorkspace);
    }

    // Verificar solução automaticamente em mudanças relevantes
    if (event && (
      event.type === Blockly.Events.BLOCK_CHANGE ||
      event.type === Blockly.Events.BLOCK_MOVE ||
      event.type === Blockly.Events.BLOCK_DELETE
    )) {
      setTimeout(() => {
        checkSolution();
      }, 100);
    }
  }, [workspace, checkSolution]);

  // Função executeCode para compatibilidade com BaseGame
  const executeCode = useCallback((code) => {
    setIsExecuting(true);
    setGameState('running');
    
    setTimeout(() => {
      const isCorrect = checkSolution();
      setGameState(isCorrect ? 'success' : 'idle');
      setIsExecuting(false);
    }, 500);
  }, [checkSolution]);

  // Calcular estatísticas
  const correctCount = animalStates.filter(state => state.isCorrect).length;
  const totalAnimals = animalStates.length;

  return {
    // Estados básicos (compatibilidade com BaseGame)
    gameState,
    isExecuting,
    
    // Estados específicos do puzzle
    animalStates,
    isComplete,
    correctCount,
    totalAnimals,
    showHint,
    currentHint: getCurrentHint(),
    
    // Dados da fase (vem da base genérica)
    currentPhase,
    currentPhaseData,
    totalPhases,
    unlockedPhases,
    completedPhases,
    gameConfig,
    
    // Ações específicas do puzzle
    checkSolution,
    resetPuzzle,
    toggleHint,
    handleWorkspaceChange,
    executeCode,
    
    // Ações de fase (vem da base genérica)
    handlePhaseChange,
    handleNextPhase,
    handlePreviousPhase,
    getPhaseData
  };
};
