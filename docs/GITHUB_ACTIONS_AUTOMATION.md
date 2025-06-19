# GitHub Actions Workflows e Automação

Este documento descreve os workflows do GitHub Actions configurados para o projeto e as opções de automação disponíveis.

## Workflows Configurados

### 1. CI Workflow (`.github/workflows/ci.yml`)
**Trigger:** Push para qualquer branch, Pull Requests para `main`

**Funcionalidades:**
- ✅ Configuração do Node.js 20
- ✅ Cache de dependências npm
- ✅ Instalação de dependências (`npm ci`)
- ✅ Execução de linting (`npm run lint`)
- ✅ Build da aplicação (`npm run build`)
- ✅ Upload de artefatos de build

### 2. Develop Workflow (`.github/workflows/develop.yml`)
**Trigger:** Push para `develop`, Pull Requests para `develop`

**Funcionalidades:**
- ✅ Todos os passos do CI Workflow
- ✅ Criação automática de PR para `main` quando push para `develop`
- ✅ Verificação se PR já existe (evita duplicatas)
- ✅ Geração automática de descrição do PR com commits recentes
- ✅ Fallback usando GitHub CLI se necessário

### 3. Simple Test Workflow (`.github/workflows/simple-test.yml`)
**Trigger:** Push para qualquer branch

**Funcionalidades:**
- ✅ Teste simples de lint e build
- ✅ Execução rápida para validação básica

## Automação de Pull Requests

### Método 1: GitHub Actions (Automático)
O workflow `develop.yml` automaticamente cria PRs de `develop` para `main` quando há push para a branch `develop`.

**Características:**
- ✅ Totalmente automático
- ✅ Executa após build bem-sucedido
- ✅ Verifica se PR já existe
- ✅ Inclui descrição detalhada com commits recentes
- ✅ Usa `peter-evans/create-pull-request` action
- ✅ Fallback com GitHub CLI

### Método 2: Script Manual (`scripts/auto-merge.sh`)
Script que pode ser executado manualmente ou via npm script.

**Como usar:**
```bash
# Via npm script
npm run auto-merge

# Ou diretamente
./scripts/auto-merge.sh
```

**Características:**
- ✅ Verificação de branch atual
- ✅ Verificação de mudanças não commitadas
- ✅ Fetch automático de mudanças
- ✅ Verificação se develop está à frente de main
- ✅ Verificação se PR já existe
- ✅ Criação automática via GitHub CLI
- ✅ Descrição detalhada do PR

## Permissões Necessárias

### GitHub Actions
```yaml
permissions:
  contents: write        # Para acessar código
  pull-requests: write   # Para criar PRs
  issues: write         # Para comentários
  actions: read         # Para status de actions
  checks: read          # Para verificações
```

### GitHub CLI
Para usar o script manual, certifique-se de ter:
- GitHub CLI instalado: `gh auth login`
- Permissões de escrita no repositório

## Fluxo de Desenvolvimento Recomendado

### Para Projeto Solo
1. **Trabalhe na branch `develop`**
2. **Commit e push suas mudanças**
3. **O workflow automaticamente:**
   - Executa testes e build
   - Cria PR para `main` se build passar
4. **Revise e aprove o PR manualmente**
5. **Merge para `main`**

### Comandos Úteis
```bash
# Desenvolvimento
git checkout develop
git add .
git commit -m "feat: nova funcionalidade"
git push origin develop

# O workflow fará o resto automaticamente!

# Alternativa manual
npm run auto-merge
```

## Limitações Conhecidas

### GitHub Actions e Pull Requests
- O GITHUB_TOKEN tem limitações para alguns tipos de automação
- A action `peter-evans/create-pull-request` resolve a maioria dos casos
- Script manual como fallback para casos especiais

### Soluções Implementadas
1. **Permissões elevadas** (`contents: write`)
2. **Action especializada** (`peter-evans/create-pull-request`)
3. **Fallback com GitHub CLI**
4. **Script manual independente**

## Monitoramento

### Verificar Status dos Workflows
- Vá para **Actions** no GitHub
- Verifique execuções recentes
- Logs detalhados para debugging

### Verificar PRs Automáticos
- Vá para **Pull Requests**
- Procure por PRs com título "🚀 Release: develop → main"
- Revise mudanças antes de aprovar

## Troubleshooting

### Workflow não cria PR
1. Verifique permissões do repositório
2. Confirme que há commits em `develop` não presentes em `main`
3. Verifique se PR já existe
4. Use script manual como alternativa

### Script manual falha
1. Verifique se GitHub CLI está instalado: `gh --version`
2. Confirme autenticação: `gh auth status`
3. Verifique se está na branch `develop`
4. Confirme que não há mudanças não commitadas

### Build falha
1. Execute localmente: `npm run lint && npm run build`
2. Corrija erros encontrados
3. Commit e push novamente

## Configuração de Branch Protection

Para repositório solo, a proteção de branch está configurada para permitir auto-aprovação:
- Require pull request reviews: ✅ Habilitado
- Dismiss stale reviews: ✅ Habilitado  
- Allow force pushes: ❌ Desabilitado
- Allow auto-merge: ✅ Habilitado (se disponível)

Consulte `docs/BRANCH_PROTECTION.md` para mais detalhes.
