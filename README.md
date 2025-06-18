# 🎮 Blockly Games Clone

Um clone educacional do Blockly Games desenvolvido em React, focando no ensino de programação através de blocos visuais.

![Blockly Games Clone](https://img.shields.io/badge/React-18-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Sobre o Projeto

Este projeto é uma reimplementação do famoso [Blockly Games](https://blockly.games/) do Google, criado para ensinar conceitos de programação de forma visual e interativa. Atualmente implementa o jogo **Maze** (Labirinto), onde os usuários programam um personagem para navegar através de labirintos usando blocos de código visual.

### 🎮 Demo

O jogo inclui:
- **Labirinto interativo** renderizado em SVG
- **Personagem animado** com sistema de movimento
- **Interface responsiva** que funciona em desktop e mobile
- **Sistema de estados** com feedback visual
- **Controles intuitivos** para movimento e rotação

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework JavaScript moderno
- **Bootstrap 5** - Framework CSS para design responsivo
- **Vite** - Build tool rápido e moderno
- **SVG** - Gráficos vetoriais para renderização do jogo
- **JavaScript ES6+** - Linguagem de programação

## 📦 Instalação

### Pré-requisitos
- Node.js 18 ou superior
- npm ou pnpm

### Passos para instalação

```bash
# Clone o repositório
git clone https://github.com/ruimoraes/blockly-games-clone.git

# Entre no diretório
cd blockly-games-clone

# Instale as dependências
npm install
# ou
pnpm install

# Execute o projeto em modo de desenvolvimento
npm run dev
# ou
pnpm run dev

# Acesse no navegador
http://localhost:5173
```

## 🎮 Como Jogar

1. **Objetivo**: Mover o personagem (círculo azul) até o objetivo (círculo dourado)
2. **Controles disponíveis**:
   - **Mover Frente**: Move o personagem uma posição à frente
   - **Virar ↺**: Gira 90° para a esquerda  
   - **Virar ↻**: Gira 90° para a direita
   - **Executar**: Executa uma sequência automática de movimentos
   - **Resetar**: Volta o personagem à posição inicial

## 🏗️ Estrutura do Projeto

```
blockly-games-clone/
├── public/                 # Arquivos públicos
├── src/
│   ├── components/         # Componentes React (preparado para expansão)
│   │   ├── layout/        # Componentes de layout
│   │   ├── blockly/       # Componentes do Blockly
│   │   ├── maze/          # Componentes específicos do jogo Maze
│   │   └── ui/            # Componentes de interface
│   ├── hooks/             # Custom hooks React
│   ├── utils/             # Utilitários e helpers
│   ├── assets/            # Imagens, sons, etc.
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos principais
│   └── main.jsx           # Ponto de entrada
├── package.json
├── README.md
└── .gitignore
```

## ✨ Funcionalidades Implementadas

### ✅ Jogo Maze
- [x] Renderização visual do labirinto em SVG
- [x] Sistema de movimento do personagem
- [x] Detecção de colisões com paredes
- [x] Detecção de vitória ao alcançar o objetivo
- [x] Sistema de reset para reiniciar o jogo
- [x] Feedback visual para diferentes estados

### ✅ Interface e UX
- [x] Design responsivo para desktop e mobile
- [x] Layout Bootstrap com grid system
- [x] Componentes reutilizáveis
- [x] Estados visuais (sucesso, falha, execução)
- [x] Indicadores de posição e direção

### ✅ Arquitetura
- [x] Código modular e bem estruturado
- [x] Componentes React organizados
- [x] Preparado para expansão com novos jogos
- [x] Documentação completa

## 🔮 Roadmap

### Próximas Funcionalidades
- [ ] **Integração Blockly**: Workspace visual real para programação
- [ ] **Múltiplos níveis**: Labirintos progressivamente mais complexos
- [ ] **Animações**: Transições suaves para movimentos
- [ ] **Sistema de pontuação**: Scoring baseado em eficiência

### Funcionalidades Futuras
- [ ] **Outros jogos**: Bird, Turtle, Movie, Pond
- [ ] **Editor de níveis**: Criação de labirintos customizados
- [ ] **Sistema de usuário**: Login e progresso persistente
- [ ] **Tutorial interativo**: Guia passo-a-passo para iniciantes

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Scripts Disponíveis

```bash
npm run dev          # Executa em modo de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa linting do código
```

## 🎨 Design System

### Cores Principais
- **Primário**: Azul Bootstrap (#0d6efd)
- **Personagem**: Azul (#4A90E2)
- **Sucesso**: Verde (#32CD32)
- **Erro**: Vermelho (#FF6B6B)
- **Objetivo**: Dourado (#FFD700)

### Responsividade
- **Desktop**: Layout de duas colunas lado a lado
- **Tablet**: Layout adaptativo
- **Mobile**: Layout empilhado, otimizado para touch

## 📊 Performance

- ⚡ **Renderização SVG otimizada**
- 📱 **Interface responsiva**
- 🎯 **Código modular para fácil manutenção**
- 🔧 **Build otimizado com Vite**

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Google Blockly](https://developers.google.com/blockly) - Inspiração e conceito original
- [Blockly Games](https://blockly.games/) - Referência de gameplay
- [React](https://reactjs.org/) - Framework utilizado
- [Bootstrap](https://getbootstrap.com/) - Framework CSS

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

