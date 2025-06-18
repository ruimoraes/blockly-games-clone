# Configurações de Proteção de Branch para GitHub

Este documento descreve as configurações de proteção de branch que devem ser aplicadas ao repositório no GitHub.

## Configuração via GitHub Web Interface

### 1. Acessar as Configurações de Branch Protection

1. Vá para o repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Branches**
4. Clique em **Add rule** (Adicionar regra) ou edite uma regra existente

### 2. Proteção da Branch `main`

**Branch name pattern:** `main`

**Configurações recomendadas:**
- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals:** 1
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners** (se houver CODEOWNERS)
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - Status checks requeridos:
    - `build-and-test`
    - `Develop CI - Build and PR to Main / build-and-test`
- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits** (opcional, mas recomendado)
- ✅ **Require linear history** (opcional)
- ✅ **Include administrators** (aplicar regras aos administradores)
- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Allow force pushes:** Desabilitado
- ✅ **Allow deletions:** Desabilitado

### 3. Proteção da Branch `develop`

**Branch name pattern:** `develop`

**Configurações recomendadas:**
- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals:** 1
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - Status checks requeridos:
    - `build-and-test`
    - `CI - Build and Auto PR / build-and-test`
- ✅ **Require conversation resolution before merging**
- ✅ **Include administrators** (aplicar regras aos administradores)
- ✅ **Allow force pushes:** Desabilitado
- ✅ **Allow deletions:** Desabilitado

## Configuração via GitHub CLI (Alternativa)

Se preferir configurar via linha de comando, você pode usar o GitHub CLI:

```bash
# Instalar GitHub CLI se ainda não tiver
# https://cli.github.com/

# Fazer login
gh auth login

# Configurar proteção para main
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"checks":[{"context":"build-and-test","app_id":null}]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

# Configurar proteção para develop
gh api repos/{owner}/{repo}/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"checks":[{"context":"build-and-test","app_id":null}]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

## Workflow de Desenvolvimento Recomendado

1. **Feature Branches:** Criar branches a partir de `develop`
2. **Commits:** Fazer commits na feature branch
3. **Build Automático:** GitHub Actions executa build automaticamente
4. **PR Automático:** Se build for bem-sucedido, cria PR para `develop`
5. **Review e Merge:** Revisar e fazer merge do PR para `develop`
6. **Release:** Build em `develop` cria PR automático para `main`
7. **Deploy:** Merge em `main` pode disparar deploy para produção

## Verificação das Configurações

Para verificar se as configurações foram aplicadas corretamente:

```bash
# Verificar proteção da main
gh api repos/{owner}/{repo}/branches/main/protection

# Verificar proteção da develop  
gh api repos/{owner}/{repo}/branches/develop/protection
```
