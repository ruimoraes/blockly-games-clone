# Automação de Pull Requests

## Visão Geral

Este projeto implementa automação para facilitar o processo de release do branch `develop` para `main`.

## Workflows Disponíveis

### 1. develop.yml - Automação Completa
**Arquivo:** `.github/workflows/develop.yml`

Este workflow tenta criar automaticamente um PR de `develop` para `main` quando:
- Há push no branch `develop`
- Build e testes passam com sucesso
- Não existe PR aberto entre os branches

**Características:**
- ✅ Build e teste automático
- ✅ Verificação de PR existente
- ⚠️ Criação de PR pode falhar devido a limitações do GitHub Actions

### 2. notify-release.yml - Notificação Alternativa
**Arquivo:** `.github/workflows/notify-release.yml`

Este workflow cria uma issue para notificar que o código está pronto para release:
- ✅ Build e teste automático
- ✅ Criação de issue com instruções
- ✅ Lista de commits recentes
- ✅ Comandos prontos para copy/paste

## Processo de Release Manual

Caso a automação não funcione, siga estes passos:

### Opção 1: Via GitHub CLI
```bash
# Verificar se há diferenças entre develop e main
git log main..develop --oneline

# Criar PR automaticamente
gh pr create --base main --head develop \
  --title "🚀 Release: develop → main" \
  --body "Release ready for main branch"

# Ou listar PRs existentes
gh pr list --base main
```

### Opção 2: Via Interface Web
1. Acesse o repositório no GitHub
2. Clique em "Pull requests"
3. Clique em "New pull request"
4. Selecione `main` como base e `develop` como compare
5. Adicione título e descrição
6. Clique em "Create pull request"

## Limitações Conhecidas

### GitHub Actions e PRs
O GitHub Actions tem uma limitação de segurança que impede a criação automática de PRs usando o token padrão `GITHUB_TOKEN`. Isso é para evitar loops infinitos e problemas de segurança.

**Soluções Possíveis:**
1. **Personal Access Token (PAT):** Criar um PAT com permissões de repo e configurar como secret
2. **GitHub App:** Usar uma GitHub App com permissões específicas
3. **Processo Manual:** Usar notificações para lembrar de criar PRs manualmente

### Configuração com PAT (Opcional)

Se desejar automação completa:

1. **Criar PAT:**
   - Vá em GitHub Settings > Developer settings > Personal access tokens
   - Crie um token com permissões `repo` e `workflow`

2. **Adicionar como Secret:**
   ```bash
   gh secret set AUTO_PR_TOKEN --body "seu_token_aqui"
   ```

3. **Atualizar workflow:**
   ```yaml
   - name: Create Pull Request
     uses: peter-evans/create-pull-request@v5
     with:
       token: ${{ secrets.AUTO_PR_TOKEN }}
   ```

## Monitoramento

### Verificar Status dos Workflows
```bash
# Listar execuções recentes
gh run list

# Ver detalhes de uma execução
gh run view [RUN_ID]

# Ver logs de uma execução
gh run view [RUN_ID] --log
```

### Verificar PRs e Issues
```bash
# Listar PRs abertos
gh pr list

# Listar issues abertas
gh issue list

# Ver notificações de release
gh issue list --label "release"
```

## Troubleshooting

### Erro: "GitHub Actions is not permitted to create or approve pull requests"
**Causa:** Limitação de segurança do GitHub Actions  
**Solução:** Usar processo manual ou configurar PAT conforme seção acima

### Build falha no workflow
**Causa:** Problemas de lint, testes ou build  
**Solução:** 
```bash
# Rodar localmente para debug
npm ci
npm run lint
npm run build
```

### PR já existe
**Causa:** Workflow detecta PR existente entre develop e main  
**Solução:** Verificar PRs existentes:
```bash
gh pr list --base main --head develop
```

## Recomendações

1. **Sempre revisar** PRs antes de fazer merge para main
2. **Testar localmente** antes de push para develop
3. **Monitorar workflows** para detectar problemas cedo
4. **Usar branches feature** para desenvolvimento de funcionalidades
5. **Manter develop atualizado** com main regularmente

## Estrutura de Branches

```
main (produção)
  ↑
  PR (review necessário)
  ↑
develop (staging)
  ↑
  merge direto
  ↑
feature/* (desenvolvimento)
```
