# Relatório: Estrutura do Jogo Maze - Blockly NT

## Visão Geral do Projeto

O **Blockly NT** é uma plataforma educacional de programação visual construída com React, baseada no conceito dos Blockly Games do Google. A aplicação ensina conceitos de programação através de jogos interativos onde os usuários programam usando blocos visuais em vez de código textual.

## Estrutura do Jogo Maze (Autômato)

### 1. Arquitetura Geral

#### 1.1 Componentes Principais
- **MazeGame.jsx**: Componente principal que orquestra todo o jogo
- **BaseGame.jsx**: Componente genérico que fornece layout e funcionalidades comuns
- **MazeRenderer.jsx**: Responsável pela renderização visual do labirinto
- **useMazeGame.js**: Hook customizado com toda a lógica do jogo
- **mazeBlocks.js**: Definição dos blocos Blockly específicos do jogo
- **mazeConfig.js**: Configuração das fases e mapas do jogo

#### 1.2 Hooks Auxiliares
- **useBaseGame.js**: Hook genérico para funcionalidades comuns de jogos
- **useGamePhases.js**: Gerenciamento do sistema de fases
- **useResponsive.js**: Detecção de dispositivos móveis
- **useViewportHeight.js**: Ajuste de altura da viewport

### 2. Fluxo de Funcionamento

#### 2.1 Inicialização
1. **MazeGame** carrega usando **useMazeGame**
2. **useMazeGame** utiliza **useBaseGame** para funcionalidades básicas
3. **useBaseGame** integra-se com **useGamePhases** para gerenciar fases
4. Configuração carregada de **mazeConfig.js**
5. Blocos definidos em **mazeBlocks.js**

#### 2.2 Ciclo de Execução
1. **Edição de Blocos**: Usuário programa no BlocklyEditor
2. **Geração de Código**: Blocos são convertidos para JavaScript
3. **Execução**: Código executado no contexto do jogo
4. **Animação**: Personagem se move no labirinto
5. **Verificação**: Sistema verifica sucesso/falha

### 3. Componentes Detalhados

#### 3.1 MazeGame.jsx
**Responsabilidades:**
- Gerenciar estado geral do jogo
- Integrar editor de blocos com área de jogo
- Controlar execução e reset
- Gerenciar navegação entre fases

**Características:**
- Usa **useMazeGame** para lógica complexa
- Integra **BlocklyEditor** e **GameArea**
- Suporte a dispositivos móveis com tabs
- Sistema de debug integrado

#### 3.2 useMazeGame.js
**Funcionalidades principais:**
- **Controle de Posição**: Gerencia posição e direção do personagem
- **Sistema de Movimento**: Implementa moveForward, turnLeft, turnRight
- **Detecção de Caminhos**: isPathAhead, isPathLeft, isPathRight
- **Execução de Código**: Interpreta e executa código JavaScript gerado
- **Sistema de Segurança**: Previne loops infinitos e travamentos

**Controles de Execução:**
```javascript
const EXECUTION_CONFIG = {
    MAX_ITERATIONS: 99000,
    MAX_TIME: 99000,
    STUCK_THRESHOLD: 20,
    YIELD_INTERVAL: 50
};
```

#### 3.3 MazeRenderer.jsx
**Sistema de Renderização:**
- **SVG Based**: Usa SVG para renderização precisa
- **Sistema de Tiles**: Mapas construídos com sistema de tiles
- **Animações**: Animações suaves para movimentos
- **Sprites**: Usa sprite sheets para personagem

**Componentes Visuais:**
- Tiles do labirinto (walls, paths)
- Sprite do personagem (Pegman)
- Marcador de objetivo
- Sistema de clipping para animações

#### 3.4 mazeBlocks.js
**Blocos Disponíveis:**
- **Movimento**: moveForward, turnLeft, turnRight
- **Condicionais**: automato_if, automato_ifElse  
- **Sensores**: isPathAhead, isPathLeft, isPathRight
- **Loops**: automato_repeat_until_goal

**Geração de Código:**
```javascript
// Exemplo de gerador
javascriptGenerator.forBlock['automato_move_forward'] = function() {
    return 'await moveForward();\n';
};
```

#### 3.5 mazeConfig.js
**Configuração de Fases:**
- **15 níveis progressivos**: Do básico ao avançado
- **Mapas matriciais**: Representação numérica dos labirintos
- **Blocos permitidos**: Controle granular de complexidade
- **Posições iniciais**: Configuração de spawn e objetivo

**Estrutura de Fase:**
```javascript
{
    level: 1,
    name: "Primeiro Passo",
    description: "Aprenda a mover para frente",
    maxBlocks: Infinity,
    startPosition: { x: 2, y: 4 },
    allowedBlocks: ['moveForward'],
    map: [/* matriz 8x8 */]
}
```

### 4. Sistema de Fases

#### 4.1 Progressão
- **Fase 1**: Movimento básico (moveForward)
- **Fase 2**: Introdução às curvas (turnLeft, turnRight)
- **Fase 3**: Loops (automato_repeat_until_goal)
- **Fases 4-5**: Navegação complexa
- **Fases 6+**: Condicionais (automato_if, automato_ifElse)

#### 4.2 Sistema de Desbloqueio
- Fases desbloqueadas sequencialmente
- Progresso salvo no localStorage
- Sistema de debug para desenvolvimento

### 5. Características Técnicas

#### 5.1 Responsividade
- **Design Adaptativo**: Funciona em desktop e mobile
- **Modo Tabs**: Interface especial para dispositivos móveis
- **Viewport Dinâmico**: Ajusta automaticamente ao tamanho da tela

#### 5.2 Performance
- **Controle de Execução**: Limitações para evitar travamentos
- **Animações Otimizadas**: Timeouts controlados
- **Yield to Main Thread**: Evita bloqueio da UI

#### 5.3 Segurança
- **Sandbox de Execução**: Código executado em contexto controlado
- **Limites de Iteração**: Previne loops infinitos
- **Timeout Protection**: Interrompe execução longa

### 6. Integração com Blockly

#### 6.1 Toolbox Dinâmica
- Blocos disponíveis baseados na fase atual
- Categorização por tipo (movimento, lógica, sensores)
- Cores consistentes por categoria

#### 6.2 Geração de Código
- Conversão automática de blocos para JavaScript
- Contexto de execução com funções específicas do jogo
- Suporte a programação assíncrona

### 7. Pontos Fortes da Arquitetura

#### 7.1 Modularidade
- Separação clara de responsabilidades
- Hooks reutilizáveis
- Componentes independentes

#### 7.2 Extensibilidade
- Fácil adição de novos blocos
- Sistema de fases flexível
- Configuração externa

#### 7.3 Manutenibilidade
- Código bem estruturado
- Documentação inline
- Padrões consistentes

### 8. Limitações Identificadas

#### 8.1 Acoplamento
- Dependência específica do formato de mapa
- Lógica de renderização acoplada ao jogo

#### 8.2 Escalabilidade
- Configuração manual de fases
- Sistema de blocos hardcoded

## Análise para Criação do Jogo Bee

### Componentes Reutilizáveis

#### 1. Infraestrutura Base (100% reutilizável)
- **BaseGame.jsx**: Layout e funcionalidades comuns
- **BlocklyEditor.jsx**: Editor de blocos
- **GameArea.jsx**: Área de jogo genérica
- **useBaseGame.js**: Hook base para jogos
- **useGamePhases.js**: Sistema de fases

#### 2. Componentes Adaptáveis (80% reutilizáveis)
- **Sistema de Blocos**: Estrutura similar, blocos diferentes
- **Sistema de Execução**: Mesma base, contexto específico
- **Sistema de Configuração**: Mesmo formato, dados diferentes

#### 3. Componentes Específicos (0% reutilizáveis)
- **MazeRenderer**: Específico para labirintos
- **useMazeGame**: Lógica específica do maze
- **mazeBlocks**: Blocos específicos do maze

### Diferenças do Jogo Bird (Baseado no Blockly Games Original)

#### 1. Mecânica de Movimento
**Maze**: Movimento discreto em grid
**Bird**: Movimento contínuo em espaço 2D

#### 2. Sistema de Coordenadas
**Maze**: Coordenadas discretas (x, y em grid)
**Bird**: Coordenadas contínuas (x, y em plano)

#### 3. Blocos Principais
**Bird** (baseado na análise do código original):
- **bird_heading**: Movimento direccional com ângulo
- **bird_position**: Obter posição X ou Y
- **bird_compare**: Comparar posições
- **bird_noWorm**: Verificar se não tem verme
- **bird_and**: Operador lógico AND
- **bird_ifElse**: Condicional if/else

#### 4. Objetivos do Jogo
**Maze**: Navegar labirinto até objetivo
**Bird**: Coletar verme e retornar ao ninho

#### 5. Elementos de Jogo
**Bird**:
- **Pássaro**: Personagem principal
- **Verme**: Item a coletar
- **Ninho**: Objetivo final
- **Paredes**: Obstáculos com detecção de colisão

### Implementação Sugerida para BeeGame

#### 1. Estrutura Base
```
src/games/bee/
├── BeeGame.jsx              # Componente principal
├── hooks/
│   └── useBeeGame.js        # Lógica específica
├── components/
│   └── BeeRenderer.jsx      # Renderização
├── blocks/
│   └── beeBlocks.js         # Blocos específicos
└── config/
    └── beeConfig.js         # Configuração fases
```

#### 2. Blocos Específicos do Bee
- **bee_move**: Movimento com direção/ângulo
- **bee_turn**: Rotação
- **bee_nectar**: Coletar néctar
- **bee_at_flower**: Verificar se está em flor
- **bee_at_hive**: Verificar se está na colmeia
- **bee_nectar_available**: Verificar disponibilidade

#### 3. Mecânica de Jogo
- **Movimento**: Baseado em ângulos (similar ao Bird)
- **Objetivo**: Coletar néctar e retornar à colmeia
- **Obstáculos**: Paredes e elementos do ambiente
- **Progressão**: Níveis com complexidade crescente

### Estimativa de Desenvolvimento

#### Fase 1 (Reutilização): 2-3 dias
- Configurar estrutura base
- Adaptar sistema de fases
- Integrar com BaseGame

#### Fase 2 (Blocos Específicos): 3-4 dias
- Desenvolver blocos do Bee
- Implementar geradores de código
- Configurar toolbox dinâmica

#### Fase 3 (Lógica do Jogo): 4-5 dias
- Implementar useBeeGame
- Sistema de movimento e coleta
- Detecção de colisões

#### Fase 4 (Renderização): 3-4 dias
- Desenvolver BeeRenderer
- Animações e sprites
- Interface visual

#### Fase 5 (Fases e Teste): 2-3 dias
- Configurar níveis
- Testes e ajustes
- Polimento final

**Total Estimado**: 14-19 dias

### Progresso do Desenvolvimento

#### ✅ Fase 1 Concluída (Reutilização): 2-3 dias
- ✅ Estrutura base configurada
- ✅ Sistema de fases adaptado
- ✅ Integração com BaseGame realizada
- ✅ Configuração inicial (beeConfig.js)
- ✅ Blocos básicos implementados (beeBlocks.js)
- ✅ Hook principal criado (useBeeGame.js)
- ✅ Componente de renderização básico (BeeRenderer.jsx)
- ✅ Componente principal (BeeGame.jsx)
- ✅ Página do jogo (BeePage.jsx)
- ✅ Registro no sistema (gameRegistry.js)

#### 🔄 Próximas Fases:
- **Fase 2**: Blocos Específicos (3-4 dias)
- **Fase 3**: Lógica do Jogo (4-5 dias)
- **Fase 4**: Renderização (3-4 dias)
- **Fase 5**: Fases e Teste (2-3 dias)

### Conclusão

A arquitetura do projeto está bem preparada para a criação de novos jogos. O sistema modular permite alto reaproveitamento de código, especialmente na infraestrutura base. O jogo Bee pode ser desenvolvido seguindo os mesmos padrões, adaptando principalmente a lógica de movimento, blocos específicos e renderização visual.

A base sólida criada com o Maze fornece um excelente framework para expansão da plataforma educacional.
