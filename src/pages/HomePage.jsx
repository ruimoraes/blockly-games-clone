import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Search, Play, Clock, Users, Star } from 'lucide-react';
import { gameRegistryUtils, GAME_CATEGORIES, DIFFICULTY_LEVELS } from '../config/gameRegistry';

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
  }; const games = getFilteredGames();
  const categories = Object.keys(GAME_CATEGORIES); // Usar as chaves em vez dos valores
  const difficulties = Object.keys(DIFFICULTY_LEVELS); // Usar as chaves em vez dos valores

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
      case 'iniciante':
        return 'success';
      case 'intermediate':
      case 'intermediário':
        return 'warning';
      case 'advanced':
      case 'avançado':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'logic': return '🧩';
      case 'programming': return '💻';
      case 'puzzle': return '🧩';
      case 'maze': return '🌟';
      default: return '🎮';
    }
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header className="py-5 text-white">
        <Container>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-3">
              <span className="me-3">🎮</span>
              Blockly Games Clone
            </h1>
            <p className="lead mb-4">
              Aprenda programação de forma divertida com jogos educacionais
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                <Star size={16} className="me-1" />
                Educacional
              </Badge>
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                <Users size={16} className="me-1" />
                Para todas as idades
              </Badge>
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6">
                <Play size={16} className="me-1" />
                Gratuito
              </Badge>
            </div>
          </div>
        </Container>
      </header>

      {/* Search and Filters */}
      <Container className="py-4">
        <Row className="justify-content-center mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>              <Card.Body className="p-4">
                <Row>
                  <Col md={6} className="mb-3 mb-md-0">
                    <InputGroup>
                      <InputGroup.Text>
                        <Search size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Buscar jogos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={3} className="mb-3 mb-md-0">
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                    >
                      <option value="">Todas as dificuldades</option>
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Games Section */}
      <Container className="pb-5">
        <div className="text-center mb-5">
          <h2 className="text-white mb-3">Jogos Disponíveis</h2>
          <p className="text-white-50">
            {games.length} jogo{games.length !== 1 ? 's' : ''} encontrado{games.length !== 1 ? 's' : ''}
          </p>
        </div>

        {games.length === 0 ? (
          <Row className="justify-content-center">
            <Col lg={6}>
              <Card className="text-center border-0 shadow-sm" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}>
                <Card.Body className="py-5">
                  <h4 className="mb-3">Nenhum jogo encontrado</h4>
                  <p className="text-muted mb-3">
                    Não há jogos que correspondam aos filtros selecionados.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                      setSelectedDifficulty('');
                    }}
                  >
                    Limpar filtros
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row className="justify-content-center">
            {games.map((game) => (
              <Col key={game.id} lg={8} md={10} className="mb-4">
                <Card className="h-100 shadow-lg border-0" style={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}>
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col md={2} className="text-center mb-3 mb-md-0">
                        <div
                          className="rounded-circle d-inline-flex align-items-center justify-content-center"
                          style={{
                            width: '80px',
                            height: '80px',
                            fontSize: '2.5rem',
                            background: `var(--bs-${game.theme?.primaryColor || 'primary'})`,
                            color: 'white'
                          }}
                        >
                          {game.icon || getCategoryIcon(game.category)}
                        </div>
                      </Col>

                      <Col md={7}>
                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <h3 className="mb-0">{game.name}</h3>
                            <Badge bg={getDifficultyColor(game.difficulty)}>
                              {game.difficulty}
                            </Badge>
                            {game.isNew && (
                              <Badge bg="danger">Novo!</Badge>
                            )}
                          </div>
                          <p className="text-muted mb-3">{game.description}</p>

                          <div className="d-flex gap-3 text-sm text-muted mb-3">
                            <div className="d-flex align-items-center gap-1">
                              <Play size={14} />
                              <span>{game.metadata?.totalPhases || game.levels || 0} níveis</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <Users size={14} />
                              <span>{game.stats?.totalPlayers || 'Novo'}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <Clock size={14} />
                              <span>{game.estimatedTime}</span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <h6 className="text-muted mb-2">Características:</h6>                            <div className="d-flex flex-wrap gap-1">
                              {(game.concepts || game.features || []).map((feature, index) => (
                                <Badge bg="light" text="dark" className="px-2 py-1">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col md={3} className="text-center">
                        <Link to={game.route || game.path} className="text-decoration-none">
                          <Button
                            variant={game.theme?.primaryColor || 'primary'}
                            size="lg"
                            className="w-100 shadow-sm"
                            style={{
                              transition: 'all 0.3s ease',
                              transform: 'translateY(0)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                            }}
                            disabled={!game.enabled}
                          >
                            <Play size={20} className="me-2" />
                            {game.enabled ? 'Jogar Agora' : 'Em Breve'}
                          </Button>
                        </Link>

                        <div className="mt-3">
                          <small className="text-muted">
                            {game.enabled ? 'Comece do nível 1' : 'Em desenvolvimento'}
                          </small>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Statistics */}
        {games.length > 0 && (
          <Row className="justify-content-center mt-5">
            <Col lg={8}>
              <Card className="border-0 shadow-sm" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>                <Card.Body className="py-4">
                  <Row className="text-center text-white">
                    <Col md={4}>
                      <h3 className="fw-bold">{gameRegistryUtils.getActiveGames().length}</h3>
                      <p className="mb-0">Jogos Ativos</p>
                    </Col>
                    <Col md={4}>
                      <h3 className="fw-bold">{categories.length}</h3>
                      <p className="mb-0">Categorias</p>
                    </Col>
                    <Col md={4}>
                      <h3 className="fw-bold">
                        {gameRegistryUtils.getActiveGames().reduce((total, game) => total + (game.metadata?.totalPhases || game.levels || 0), 0)}
                      </h3>
                      <p className="mb-0">Total de Níveis</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Footer */}
      <footer className="py-4 mt-5" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
        <Container>
          <div className="text-center text-white-50">
            <p className="mb-0">
              © 2025 Blockly Games Clone - Sistema de Registry Dinâmico v3.0
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default HomePage;
