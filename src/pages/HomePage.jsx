import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameRegistryUtils, GAME_CATEGORIES, DIFFICULTY_LEVELS } from '../config/gameRegistry';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Obter jogos filtrados
  const filteredGames = useMemo(() => {
    let games = gameRegistryUtils.getActiveGames();

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      games = games.filter(game => game.category === selectedCategory);
    }

    // Filtrar por dificuldade
    if (selectedDifficulty !== 'all') {
      games = games.filter(game => game.difficulty === selectedDifficulty);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      games = games.filter(game =>
        game.name.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.concepts.some(concept => concept.toLowerCase().includes(query))
      );
    }

    return games;
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const featuredGames = gameRegistryUtils.getFeaturedGames();
  const categoriesWithCounts = gameRegistryUtils.getCategoriesWithCounts();

  // Carrossel functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play do carrossel
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGameSelect = (game) => {
    if (game.route) {
      navigate(game.route);
    } else {
      // Fallback para jogos sem rota específica
      navigate(`/games/${game.gameId || game.id}`);
    }
  };

  const getDifficultyColor = (difficulty) => {
    return DIFFICULTY_LEVELS[difficulty]?.color || '#6c757d';
  };

  const getCategoryColor = (category) => {
    return GAME_CATEGORIES[category]?.color || '#6c757d';
  };

  // Função para obter slides visíveis baseado no tamanho da tela
  const getSlidesPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2;  // md
      return 1; // sm
    }
    return 1;
  };

  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  React.useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - Tela Completa */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Texto à esquerda */}
          <div className="hero-text">
            <div className="hero-logo">
              <img src="/home/logo_blockly.png" alt="Logo Blockly NT" />
            </div>
            <div className="mb-8">
              <h1 className="hero-title">
                Aprenda
                <br />
                <span className="hero-title-programming">Programação</span>
                <br />
                brincando com
                <br />
                <span className="hero-title-blocks">Blocos</span>
              </h1>
              <p className="hero-description">
                Descubra o mundo da programação através de jogos educativos e interativos. 
                Desenvolva habilidades lógicas enquanto se diverte!
              </p>
              <div className="hero-buttons">
                <button 
                  onClick={() => {
                    const el = document.getElementById('featured-section');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 24;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="hero-button-primary"
                >
                  Explorar Jogos
                </button>
                <button className="hero-button-secondary">
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
              <div className="absolute inset-0 z-0 pointer-events-none"  />              
              <img src="/home/img_home.png" alt="Ilustração Blockly NT" className="hero-image" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="floating-element floating-element-1">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <img src="/home/puzzle_red.svg" alt="Float 1" style={{ width: '70%', height: '70%', background: 'transparent', opacity: 0.7 }} />
            </div>
          </div>
          <div className="floating-element floating-element-2">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <img src="/home/code.svg" alt="Float 2" style={{ width: '70%', height: '70%', background: 'transparent', opacity: 0.7 }} />
            </div>
          </div>
          <div className="floating-element floating-element-3">
            <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <img src="/home/starship.svg" alt="Float 3" style={{ width: '60%', height: '60%', background: 'transparent', opacity: 0.7 }} />
            </div>
          </div>
          <div className="floating-element floating-element-4">
            <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <img src="/home/puzzle_blue.svg" alt="Float 4" style={{ width: '70%', height: '70%', background: 'transparent', opacity: 0.7 }} />
            </div>
          </div>
          <div className="floating-element floating-element-5">
            <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <img src="/home/idea.svg" alt="Float 5" style={{ width: '70%', height: '70%', background: 'transparent', opacity: 0.7 }} />
            </div>
          </div>
        </div>
      </section>
      <section id="featured-section" className="featured-section">
        <div className="featured-overlay"></div>
        <div className="featured-container">
          <div className="featured-content">
            <div className="featured-header">
              <h2 className="featured-title">
                🌟 Jogos em Destaque
              </h2>
              <p className="featured-description">
                Comece sua jornada com nossos jogos mais populares e educativos
              </p>
            </div>
            <div className="relative">
              {/* Carrossel Container */}
              <div className="carousel-container">
                <div 
                  className="carousel-track"
                  style={{ 
                    transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
                    width: `${(featuredGames.length * 100) / slidesPerView}%`
                  }}
                >
                  {featuredGames.map((game, index) => (
                    <div
                      key={game.gameId || game.id}
                      className="carousel-slide"
                      style={{ width: `${100 / featuredGames.length}%` }}
                    >
                      <div
                        onClick={() => handleGameSelect(game)}
                        className="carousel-card group"
                      >
                        <div className="carousel-card-content">
                          <div className="text-center">
                            <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                              {game.icon}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              {game.name}
                            </h3>
                            
                            <p className="text-gray-600 mb-6 line-clamp-3">
                              {game.description}
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-center gap-3">
                              <span
                                className="px-4 py-2 text-sm font-bold rounded-full text-white"
                                style={{ backgroundColor: getCategoryColor(game.category) }}
                              >
                                {game.category}
                              </span>
                              <span
                                className="px-4 py-2 text-sm font-bold rounded-full text-white"
                                style={{ backgroundColor: getDifficultyColor(game.difficulty) }}
                              >
                                {game.difficulty}
                              </span>
                            </div>
                            
                            <div className="flex justify-center gap-6 text-sm text-gray-500">
                              <span>⏱️ {game.estimatedTime}</span>
                              <span>🎯 {game.ageRange}</span>
                              <span>📊 {game.metadata?.totalPhases || 0} fases</span>
                            </div>

                            <button className="w-full mt-auto btn-gradient py-4 px-6 transition-all duration-300 transform group-hover:scale-105">
                              Jogar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="carousel-nav-button carousel-nav-left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="carousel-nav-button carousel-nav-right"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Pagination Dots */}
              <div className="carousel-dots">
                {featuredGames.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`carousel-dot ${
                      index === currentSlide ? 'active' : ''
                    }`}
                  />
                ))}
              </div>
              {/* Botão Explorar mais jogos */}
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => {
                    const el = document.getElementById('all-games-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setTimeout(() => {
                        const y = el.getBoundingClientRect().top + window.scrollY - 24;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }, 400);
                    }
                  }}
                  className="btn-gradient py-4 px-10 shadow-lg text-xl"
                >
                  Explorar mais jogos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Games Section - Tela Completa */}
      <section id="all-games-section" className="games-section">
        <div className="games-container">
          {/* Search and Filters */}
          <div className="games-filters">
            <div className="games-filters-card">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  🎮 Todos os Jogos
                </h2>
                <p className="text-xl text-gray-600">
                  Use os filtros abaixo para encontrar jogos que se adequem ao seu nível
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Bar */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Buscar jogos
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Digite o nome do jogo..."
                      className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Categoria
                  </label>
                  <select
                    className="w-full px-6 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Todas as categorias</option>
                    {Object.entries(GAME_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Dificuldade
                  </label>
                  <select
                    className="w-full px-6 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    <option value="all">Todas as dificuldades</option>
                    {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                      <option key={key} value={key}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedDifficulty('all');
                      setSearchQuery('');
                    }}
                    className="btn-gradient py-3 px-8"
                  >
                    🔄 Limpar todos os filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Games Grid */}
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Explore os Jogos'}
            </h3>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold">
              {filteredGames.length} {filteredGames.length === 1 ? 'jogo' : 'jogos'}
            </div>
          </div>

          {filteredGames.length > 0 ? (
            <div className="games-grid">
              {filteredGames.map((game) => (
                <div
                  key={game.gameId || game.id}
                  onClick={() => handleGameSelect(game)}
                  className="game-card group"
                >
                  <div className="game-card-content">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                          {game.icon}
                        </div>
                        <div className="flex gap-2">
                          <span
                            className="px-3 py-1 text-xs font-bold rounded-full text-white"
                            style={{ backgroundColor: getCategoryColor(game.category) }}
                          >
                            {game.category}
                          </span>
                          <span
                            className="px-3 py-1 text-xs font-bold rounded-full text-white"
                            style={{ backgroundColor: getDifficultyColor(game.difficulty) }}
                          >
                            {game.difficulty}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {game.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                        {game.description}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500 mb-6">
                        <span>⏱️ {game.estimatedTime}</span>
                        <span>🎯 {game.ageRange}</span>
                        <span>📊 {game.metadata?.totalPhases || 0} fases</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {game.concepts.slice(0, 2).map((concept) => (
                          <span
                            key={concept}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {concept}
                          </span>
                        ))}
                        {game.concepts.length > 2 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{game.concepts.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="w-full mt-auto btn-gradient py-4 px-6 transition-all duration-300 transform group-hover:scale-105">
                      Jogar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">🎮</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Nenhum jogo encontrado
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Não encontramos jogos que correspondam aos seus critérios. 
                Que tal tentar uma busca diferente?
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setSearchQuery('');
                }}
                className="btn-gradient py-4 px-8"
              >
                Ver todos os jogos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Simplificado */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors duration-300">Jogos Educativos</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Comunidade</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors duration-300">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Feedback</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Relatório de Bugs</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Blockly NT. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
