import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { gameRegistryUtils, GAME_CATEGORIES, DIFFICULTY_LEVELS } from '../config/gameRegistry';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import ResponsiveHeader from '../components/layout/ResponsiveHeader';
import ResponsiveFooter from '../components/layout/ResponsiveFooter';
import GameCard from '../components/games/GameCard';
import StatsSection from '../components/ui/StatsSection';
import ResponsiveCard from '../components/ui/ResponsiveCard';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Get games based on filters
  const getFilteredGames = () => {
    let games = gameRegistryUtils.getActiveGames();

    if (searchQuery) {
      games = gameRegistryUtils.searchGames(searchQuery);
    }

    if (selectedCategory) {
      games = games.filter(game => game.category === selectedCategory);
    }

    if (selectedDifficulty) {
      games = games.filter(game => game.difficulty === selectedDifficulty);
    }

    return games;
  };

  const games = getFilteredGames();
  const categories = Object.keys(GAME_CATEGORIES);
  const difficulties = Object.keys(DIFFICULTY_LEVELS);

  // Dados para as estatísticas
  const statsData = [
    {
      value: gameRegistryUtils.getActiveGames().length,
      label: 'Jogos Ativos'
    },
    {
      value: categories.length,
      label: 'Categorias'
    },
    {
      value: gameRegistryUtils.getActiveGames().reduce((total, game) => 
        total + (game.metadata?.totalPhases || game.levels || 0), 0
      ),
      label: 'Total de Níveis'
    }
  ];  return (
    <ResponsiveLayout 
      backgroundGradient="hero"
      style={{
        background: 'linear-gradient(135deg, #ED1B2F 0%, #ED0973 30%, #B624C0 70%, #9333EA 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <ResponsiveHeader />

      {/* Games Section */}
      <Container className="pb-5">
        <div className="text-center mb-4 mb-md-5">
          <h2 className="text-white mb-3 display-responsive" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            Jogos Disponíveis
          </h2>
          <p className="text-white-75 lead-responsive">
            {games.length} jogo{games.length !== 1 ? 's' : ''} encontrado{games.length !== 1 ? 's' : ''}
          </p>
        </div>

        {games.length === 0 ? (
          <Row className="justify-content-center">
            <Col lg={6}>
              <ResponsiveCard variant="glass" className="text-center">
                <ResponsiveCard.Body className="py-5">
                  <h4 className="mb-3">Nenhum jogo encontrado</h4>
                  <p className="text-muted mb-3">
                    Não há jogos que correspondam aos filtros selecionados.
                  </p>
                  <Button
                    variant="primary"
                    className="hover-lift"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                      setSelectedDifficulty('');
                    }}
                  >
                    Limpar filtros
                  </Button>
                </ResponsiveCard.Body>
              </ResponsiveCard>
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-center g-3 g-md-4">
            {games.map((game) => (
              <Col key={game.id} lg={10} xl={8} className="mb-3 mb-md-4">
                <GameCard game={game} />
              </Col>
            ))}
          </Row>
        )}

        {/* Statistics */}
        {games.length > 0 && (
          <StatsSection stats={statsData} className="mt-4 mt-md-5" />
        )}
      </Container>

      {/* Footer */}
      <ResponsiveFooter />
    </ResponsiveLayout>
  );
}

export default HomePage;
