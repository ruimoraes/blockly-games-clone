# Contribuindo para o Blockly Games Clone

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

1. Crie uma branch para sua funcionalidade:
   ```bash
   git checkout -b feature/nome-da-funcionalidade
   ```

2. Faça suas alterações seguindo as diretrizes de código

3. Teste suas alterações:
   ```bash
   npm run dev
   ```

4. Commit suas alterações:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```

5. Push para sua branch:
   ```bash
   git push origin feature/nome-da-funcionalidade
   ```

6. Abra um Pull Request

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

