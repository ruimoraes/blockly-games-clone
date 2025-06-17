import { useState, useCallback, useEffect } from 'react';
import * as Blockly from 'blockly';
import { useGamePhases } from '../../../hooks/useGamePhases';
import { PUZZLE_GAME_CONFIG } from '../config/puzzleGameConfig';
import { checkPuzzleSolution, ANIMALS_DATA } from '../blocks/puzzleBlocks';

export const usePuzzleGame = () => {
  // Usar sistema genérico de fases
  const {
    currentPhase,
    gameState,
    goToNextPhase,
    goToPreviousPhase,
    resetProgress,
    completePhase,
    completedPhases, // adicionado
    gameConfig
  } = useGamePhases(PUZZLE_GAME_CONFIG);

  // Estado específico do puzzle
  const [animalStates, setAnimalStates] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Inicializar estados dos animais baseado na fase atual
  useEffect(() => {
    const currentPhaseData = gameConfig.phases[currentPhase - 1];
    if (currentPhaseData) {
      const requiredAnimals = currentPhaseData.requiredAnimals || 1;
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
  }, [currentPhase, gameConfig]);

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
    const currentPhaseData = gameConfig.phases[currentPhase - 1];
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

    if (isPhaseComplete && !completedPhases.includes(currentPhase)) {
      completePhase(currentPhase);
    }

    return isPhaseComplete;
  }, [workspace, animalStates, currentPhase, gameConfig, gameState, completePhase]);

  // Resetar puzzle
  const resetPuzzle = useCallback(() => {
    if (workspace) {
      workspace.clear();
    }
    
    const currentPhaseData = gameConfig.phases[currentPhase - 1];
    const requiredAnimals = currentPhaseData?.requiredAnimals || 1;
    const initialStates = Array(requiredAnimals).fill(null).map(() => ({
      animalId: '0',
      isCorrect: false,
      hasImage: false,
      hasLegs: false,
      hasTraits: false
    }));
    
    setAnimalStates(initialStates);
    setIsComplete(false);
    setShowHint(false);
    resetProgress();
  }, [workspace, currentPhase, gameConfig, resetProgress]);

  // Mostrar dica
  const toggleHint = useCallback(() => {
    setShowHint(prev => !prev);
  }, []);

  // Obter dica para a fase atual
  const getCurrentHint = useCallback(() => {
    const currentPhaseData = gameConfig.phases[currentPhase - 1];
    if (!currentPhaseData) return '';

    const hints = [
      'Arraste um bloco "Animal" da categoria "Animais" para o workspace.',
      'Conecte um bloco "Imagem" ao campo "imagem" do animal.',
      'Conecte um bloco "Pernas" ao campo "pernas" do animal.',
      'Conecte um bloco "Características" ao campo "características" do animal.',
      'Verifique se todas as propriedades estão corretas para o animal selecionado.'
    ];

    return currentPhaseData.hint || hints[Math.min(currentPhase - 1, hints.length - 1)];
  }, [currentPhase, gameConfig]);

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
      // Usar timeout para permitir que o DOM se atualize
      setTimeout(() => {
        checkSolution();
      }, 100);
    }
  }, [workspace, checkSolution]);

  // Avançar para próxima fase
  const goToNextPhaseHandler = useCallback(() => {
    if (isComplete) {
      goToNextPhase();
      setShowHint(false);
    }
  }, [isComplete, goToNextPhase]);

  // Voltar para fase anterior
  const goToPreviousPhaseHandler = useCallback(() => {
    goToPreviousPhase();
    setShowHint(false);
  }, [goToPreviousPhase]);

  // Calcular estatísticas
  const correctCount = animalStates.filter(state => state.isCorrect).length;
  const totalAnimals = animalStates.length;
  const currentPhaseData = gameConfig.phases[currentPhase - 1];

  return {
    // Estado do jogo
    gameState,
    currentPhase,
    gameConfig,
    
    // Estado do puzzle
    animalStates,
    isComplete,
    correctCount,
    totalAnimals,
    
    // Dicas
    showHint,
    currentHint: getCurrentHint(),
    
    // Ações
    checkSolution,
    resetPuzzle,
    toggleHint,
    handleWorkspaceChange,
    goToNextPhase: goToNextPhaseHandler,
    goToPreviousPhase: goToPreviousPhaseHandler,
    
    // Dados da fase atual
    currentPhaseData,
    
    // Dados dos animais
    animalsData: ANIMALS_DATA
  };
};

