# Contribuindo para o Blockly NT

Obrigado por considerar contribuir para este projeto! 🎉

## Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor:

1. Verifique se o bug já não foi reportado nas [Issues](../../issues)
2. Se não foi reportado, crie uma nova issue com:
   - Título claro e descritivo
   - Descrição detalhada do problema
   - Passos para reproduzir o bug
   - Comportamento esperado vs atual
   - Screenshots se aplicável
   - Informações do ambiente (OS, browser, versão do Node.js)

### Sugerindo Melhorias

Para sugerir uma nova funcionalidade:

1. Verifique se a sugestão já não existe nas [Issues](../../issues)
2. Crie uma nova issue com:
   - Título claro descrevendo a funcionalidade
   - Descrição detalhada da funcionalidade
   - Justificativa de por que seria útil
   - Exemplos de uso se aplicável

### Contribuindo com Código

#### Configuração do Ambiente

1. Faça um fork do repositório
2. Clone seu fork:
   ```bash
   git clone https://github.com/SEU_USUARIO/blockly-games-clone.git
   ```
3. Instale as dependências:
   ```bash
   cd blockly-games-clone
   npm install
   ```
4. Execute o projeto:
   ```bash
   npm run dev
   ```

#### Processo de Desenvolvimento

> ⚠️ **Importante**: Este projeto usa um processo automatizado de CI/CD. Leia sobre o fluxo completo em [`.github/CI_CD_README.md`](.github/CI_CD_README.md)

1. **Configure o ambiente**:
   ```bash
   # Clone e instale dependências com pnpm
   git clone https://github.com/SEU_USUARIO/blockly-games-clone.git
   cd blockly-games-clone
   pnpm install
   ```

2. **Crie uma branch** a partir de `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nome-da-funcionalidade
   ```

3. **Desenvolva e teste localmente**:
   ```bash
   # Desenvolvimento
   pnpm dev
   
   # Teste o build
   pnpm build
   
   # Execute linting
   pnpm lint
   ```

4. **Commit e push**:
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   git push origin feature/nome-da-funcionalidade
   ```

5. **Processo automático**:
   - ✅ GitHub Action executa build automaticamente
   - ✅ Se bem-sucedido, cria PR para `develop` automaticamente
   - ✅ Você receberá notificação do PR criado

6. **Revisar e aprovar**:
   - Revise o PR criado automaticamente
   - Aguarde aprovação de um maintainer
   - Merge será feito para `develop`

#### 🔒 Proteções de Branch

- **`main`** e **`develop`** são branches protegidas
- ❌ Commits diretos não são permitidos
- ✅ Apenas via Pull Request com aprovação
- ✅ Build deve passar antes do merge

#### Diretrizes de Código

- **JavaScript**: Use ES6+ e sintaxe moderna
- **React**: Use hooks funcionais ao invés de classes
- **CSS**: Use Bootstrap classes quando possível
- **Nomeação**: Use camelCase para variáveis e PascalCase para componentes
- **Comentários**: Comente código complexo em português
- **Estrutura**: Mantenha componentes pequenos e focados

#### Estrutura de Commits

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para mudanças na documentação
- `style:` para mudanças de formatação
- `refactor:` para refatoração de código
- `test:` para adição de testes
- `chore:` para tarefas de manutenção

Exemplos:
```
feat: adiciona sistema de pontuação
fix: corrige movimento diagonal do personagem
docs: atualiza README com novas instruções
```

### Áreas que Precisam de Ajuda

> 📖 **Antes de contribuir**: Leia sobre nosso processo de CI/CD automatizado em [`.github/CI_CD_README.md`](.github/CI_CD_README.md)

#### 🔄 Fluxo de CI/CD

Este projeto implementa um fluxo automatizado:

1. **Feature Branch** → Build automático → PR automático para `develop`
2. **Develop** → Build automático → PR automático para `main`
3. **Main** → Deploy para produção

**Benefícios:**
- ✅ Builds validados automaticamente
- ✅ PRs criados automaticamente após builds bem-sucedidos
- ✅ Processo padronizado e confiável
- ✅ Integração contínua garantida

Estamos especialmente interessados em contribuições nas seguintes áreas:

#### 🎮 Funcionalidades do Jogo
- [ ] Integração com Blockly real
- [ ] Novos níveis de labirinto
- [ ] Animações suaves
- [ ] Sistema de pontuação
- [ ] Outros jogos (Bird, Turtle, etc.)

#### 🎨 Interface e UX
- [ ] Melhorias na responsividade
- [ ] Animações e transições
- [ ] Temas alternativos
- [ ] Acessibilidade

#### 🔧 Técnico
- [ ] Testes automatizados
- [ ] Performance optimization
- [ ] PWA features
- [ ] Internacionalização

#### 📚 Documentação
- [ ] Tutorial interativo
- [ ] Guias de desenvolvimento
- [ ] Exemplos de uso
- [ ] Tradução da documentação

### Revisão de Pull Requests

Todos os Pull Requests passam por revisão. Durante a revisão, verificamos:

- ✅ Funcionalidade implementada corretamente
- ✅ Código segue as diretrizes do projeto
- ✅ Não quebra funcionalidades existentes
- ✅ Documentação atualizada se necessário
- ✅ Commits seguem o padrão estabelecido

### Código de Conduta

Este projeto segue um código de conduta baseado no [Contributor Covenant](https://www.contributor-covenant.org/). Esperamos que todos os participantes:

- Sejam respeitosos e inclusivos
- Aceitem críticas construtivas
- Foquem no que é melhor para a comunidade
- Demonstrem empatia com outros membros

### Dúvidas?

Se você tem dúvidas sobre como contribuir:

1. Verifique a documentação existente
2. Procure nas [Issues](../../issues) por discussões similares
3. Crie uma nova issue com a tag `question`
4. Entre em contato através dos canais de comunicação do projeto

---

Obrigado por contribuir! 🚀

