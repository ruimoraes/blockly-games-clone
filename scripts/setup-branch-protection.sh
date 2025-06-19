#!/bin/bash

# Script para configurar proteções de branch no GitHub
# Requer GitHub CLI (gh) instalado e autenticado

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se gh CLI está instalado
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) não está instalado. Instale em: https://cli.github.com/"
    exit 1
fi

# Verificar se está autenticado
if ! gh auth status &> /dev/null; then
    print_error "Não está autenticado no GitHub CLI. Execute: gh auth login"
    exit 1
fi

# Obter informações do repositório
REPO_INFO=$(gh repo view --json owner,name)
OWNER=$(echo $REPO_INFO | jq -r '.owner.login')
REPO=$(echo $REPO_INFO | jq -r '.name')

print_status "Configurando proteções para repositório: $OWNER/$REPO"

# Função para configurar proteção de branch
configure_branch_protection() {
    local branch=$1
    local context_checks=$2
    
    print_status "Configurando proteção para branch: $branch"
    
    # Configuração da proteção
    local protection_config='{
        "required_status_checks": {
            "strict": true,
            "checks": '"$context_checks"'
        },
        "enforce_admins": true,
        "required_pull_request_reviews": {
            "required_approving_review_count": 1,
            "dismiss_stale_reviews": true,
            "require_code_owner_reviews": false,
            "require_last_push_approval": false
        },
        "restrictions": null,
        "allow_force_pushes": false,
        "allow_deletions": false,
        "block_creations": false,
        "required_conversation_resolution": true
    }'
    
    # Aplicar configuração
    if gh api "repos/$OWNER/$REPO/branches/$branch/protection" \
        --method PUT \
        --input - <<< "$protection_config" > /dev/null 2>&1; then
        print_success "Proteção configurada para branch: $branch"
    else
        print_warning "Falha ao configurar proteção para branch: $branch (branch pode não existir ainda)"
    fi
}

# Configurações específicas para cada branch
print_status "Iniciando configuração de proteções de branch..."

# Main branch - aguarda checks de develop e CI
MAIN_CHECKS='[
    {"context": "build-and-test", "app_id": null},
    {"context": "Develop CI - Build and PR to Main / build-and-test", "app_id": null}
]'

# Develop branch - aguarda checks de CI
DEVELOP_CHECKS='[
    {"context": "build-and-test", "app_id": null},
    {"context": "CI - Build and Auto PR / build-and-test", "app_id": null}
]'

# Configurar proteções
configure_branch_protection "main" "$MAIN_CHECKS"
configure_branch_protection "develop" "$DEVELOP_CHECKS"

print_success "Configuração de proteções de branch concluída!"

# Mostrar status atual
print_status "Status atual das proteções:"
echo
print_status "Branch: main"
if gh api "repos/$OWNER/$REPO/branches/main/protection" --jq '.required_status_checks.checks[].context' 2>/dev/null; then
    print_success "✓ Proteção ativa"
else
    print_warning "⚠ Proteção não encontrada ou branch não existe"
fi

echo
print_status "Branch: develop"
if gh api "repos/$OWNER/$REPO/branches/develop/protection" --jq '.required_status_checks.checks[].context' 2>/dev/null; then
    print_success "✓ Proteção ativa"
else
    print_warning "⚠ Proteção não encontrada ou branch não existe"
fi

echo
print_status "Para criar as branches develop e main se não existirem:"
echo "git checkout -b develop"
echo "git push -u origin develop"
echo "git checkout -b main" 
echo "git push -u origin main"
