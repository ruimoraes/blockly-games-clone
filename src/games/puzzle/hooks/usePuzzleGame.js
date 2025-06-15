import { useState, useCallback, useEffect } from 'react';
import { useGamePhases } from '../../../hooks/useGamePhases';
import { PUZZLE_GAME_CONFIG } from '../../../config/puzzleGameConfig';

export const usePuzzleGame = () => {
  const [configuredAnimals, setConfiguredAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Usar o hook genérico de fases
  const gamePhases = useGamePhases(PUZZLE_GAME_CONFIG);
  const { 
    currentPhase, 
    getCurrentPhaseData, 
    completePhase, 
    isPhaseCompleted 
  } = gamePhases;

  // Obter dados da fase atual
  const currentPhaseData = getCurrentPhaseData();
  const animals = currentPhaseData?.animals || [];
  const targetTraits = currentPhaseData?.targetTraits || [];

  // Carregar configurações salvas da fase atual
  useEffect(() => {
    const savedConfigs = localStorage.getItem(`puzzle-phase-${currentPhase}-configs`);
    if (savedConfigs) {
      try {
        setConfiguredAnimals(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        setConfiguredAnimals([]);
      }
    } else {
      setConfiguredAnimals([]);
    }
  }, [currentPhase]);

  // Salvar configurações no localStorage
  const saveConfigurations = useCallback((configs) => {
    localStorage.setItem(`puzzle-phase-${currentPhase}-configs`, JSON.stringify(configs));
    setConfiguredAnimals(configs);
  }, [currentPhase]);

  // Configurar um animal
  const configureAnimal = useCallback((animalName, config) => {
    const newConfigs = configuredAnimals.filter(c => c.name !== animalName);
    newConfigs.push({
      name: animalName,
      ...config
    });
    saveConfigurations(newConfigs);
  }, [configuredAnimals, saveConfigurations]);

  // Abrir modal de configuração
  const openConfigModal = useCallback((animal) => {
    setSelectedAnimal(animal);
    setShowConfigModal(true);
  }, []);

  // Fechar modal de configuração
  const closeConfigModal = useCallback(() => {
    setSelectedAnimal(null);
    setShowConfigModal(false);
  }, []);

  // Verificar se a fase está completa
  const checkPhaseCompletion = useCallback(() => {
    if (!animals.length) return false;
    
    return animals.every(animal => {
      const config = configuredAnimals.find(c => c.name === animal.name);
      return config && 
             config.picture && 
             config.legs !== undefined && 
             config.traits.length > 0;
    });
  }, [animals, configuredAnimals]);

  // Verificar se todas as configurações estão corretas
  const checkCorrectConfiguration = useCallback(() => {
    if (!animals.length) return false;
    
    return animals.every(animal => {
      const config = configuredAnimals.find(c => c.name === animal.name);
      if (!config) return false;
      
      return config.picture === animal.picture &&
             config.legs === animal.legs &&
             JSON.stringify(config.traits.sort()) === JSON.stringify(animal.traits.sort());
    });
  }, [animals, configuredAnimals]);

  // Completar fase automaticamente quando todas as configurações estão corretas
  useEffect(() => {
    if (checkPhaseCompletion() && checkCorrectConfiguration() && !isPhaseCompleted(currentPhase)) {
      completePhase(currentPhase);
    }
  }, [checkPhaseCompletion, checkCorrectConfiguration, currentPhase, completePhase, isPhaseCompleted]);

  // Resetar configurações da fase atual
  const resetPhase = useCallback(() => {
    localStorage.removeItem(`puzzle-phase-${currentPhase}-configs`);
    setConfiguredAnimals([]);
  }, [currentPhase]);

  // Obter configuração atual de um animal
  const getAnimalConfig = useCallback((animalName) => {
    return configuredAnimals.find(config => config.name === animalName);
  }, [configuredAnimals]);

  // Calcular progresso da fase
  const getPhaseProgress = useCallback(() => {
    if (!animals.length) return 0;
    const configuredCount = animals.filter(animal => {
      const config = getAnimalConfig(animal.name);
      return config && config.picture && config.legs !== undefined && config.traits.length > 0;
    }).length;
    return (configuredCount / animals.length) * 100;
  }, [animals, getAnimalConfig]);

  return {
    // Estado do jogo
    configuredAnimals,
    selectedAnimal,
    showConfigModal,
    animals,
    targetTraits,
    currentPhaseData,
    
    // Ações
    configureAnimal,
    openConfigModal,
    closeConfigModal,
    resetPhase,
    getAnimalConfig,
    
    // Verificações
    checkPhaseCompletion,
    checkCorrectConfiguration,
    getPhaseProgress,
    
    // Hook de fases (spread para expor todas as funcionalidades)
    ...gamePhases
  };
};

