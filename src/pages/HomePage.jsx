import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Play, Star, Users, Clock } from 'lucide-react';

const HomePage = () => {
  const games = [
    {
      id: 'maze',
      title: 'Jogo do Labirinto',
      description: 'Aprenda programação visual guiando um personagem através de labirintos usando blocos de código.',
      difficulty: 'Iniciante',
      levels: 10,
      players: '1.2k+',
      estimatedTime: '30 min',
      image: '🧩',
      color: 'primary',
      path: '/games/maze',
      features: [
        'Programação visual com Blockly',
        '10 níveis progressivos',
        'Conceitos de loops e sequências',
        'Interface intuitiva'
      ]
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'iniciante':
        return 'success';
      case 'intermediário':
        return 'warning';
      case 'avançado':
        return 'danger';
      default:
        return 'secondary';
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

      {/* Games Section */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="text-white mb-3">Jogos Disponíveis</h2>
          <p className="text-white-50">
            Escolha um jogo para começar sua jornada de aprendizado
          </p>
        </div>

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
                          background: `var(--bs-${game.color})`,
                          color: 'white'
                        }}
                      >
                        {game.image}
                      </div>
                    </Col>
                    
                    <Col md={7}>
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h3 className="mb-0">{game.title}</h3>
                          <Badge bg={getDifficultyColor(game.difficulty)}>
                            {game.difficulty}
                          </Badge>
                        </div>
                        <p className="text-muted mb-3">{game.description}</p>
                        
                        <div className="d-flex gap-3 text-sm text-muted mb-3">
                          <div className="d-flex align-items-center gap-1">
                            <Play size={14} />
                            <span>{game.levels} níveis</span>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <Users size={14} />
                            <span>{game.players} jogadores</span>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <Clock size={14} />
                            <span>{game.estimatedTime}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h6 className="text-muted mb-2">Características:</h6>
                          <div className="d-flex flex-wrap gap-1">
                            {game.features.map((feature, index) => (
                              <Badge key={index} bg="light" text="dark" className="px-2 py-1">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={3} className="text-center">
                      <Link to={game.path} className="text-decoration-none">
                        <Button 
                          variant={game.color} 
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
                        >
                          <Play size={20} className="me-2" />
                          Jogar Agora
                        </Button>
                      </Link>
                      
                      <div className="mt-3">
                        <small className="text-muted">
                          Comece do nível 1
                        </small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Coming Soon Section */}
        <div className="text-center mt-5">
          <Card className="border-0 shadow-sm" style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Card.Body className="py-4">
              <h4 className="text-white mb-3">🚀 Mais jogos em breve!</h4>
              <p className="text-white-50 mb-0">
                Estamos trabalhando em novos jogos educacionais para expandir sua experiência de aprendizado.
              </p>
            </Card.Body>
          </Card>
        </div>
      </Container>

      {/* Footer */}
      <footer className="py-4 mt-5" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
        <Container>
          <div className="text-center text-white-50">
            <p className="mb-0">
              © 2025 Blockly Games Clone - Desenvolvido para fins educacionais
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;

