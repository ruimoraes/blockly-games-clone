#!/bin/bash

# Script de auto-merge para develop → main
# Este script cria um PR de develop para main quando a branch develop é atualizada

set -e

echo "🚀 Script de auto-merge: develop → main"

# Verificar se estamos na branch develop
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
    echo "❌ Erro: Deve estar na branch develop. Atualmente em: $CURRENT_BRANCH"
    exit 1
fi

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    echo "❌ Erro: Há mudanças não commitadas. Por favor, faça commit ou stash primeiro."
    exit 1
fi

# Buscar as mudanças mais recentes
echo "📥 Buscando mudanças mais recentes..."
git fetch origin

# Verificar se develop está à frente de main
BEHIND_COUNT=$(git rev-list --count main..develop)
if [ "$BEHIND_COUNT" -eq 0 ]; then
    echo "✅ develop está atualizada com main. Nenhum PR necessário."
    exit 0
fi

echo "📊 develop está $BEHIND_COUNT commits à frente de main"

# Verificar se PR já existe
if command -v gh &> /dev/null; then
    PR_COUNT=$(gh pr list --base main --head develop --json number --jq length)
    if [ "$PR_COUNT" -gt 0 ]; then
        echo "✅ PR de develop para main já existe."
        gh pr list --base main --head develop
        exit 0
    fi
fi

# Obter commits recentes para descrição do PR
echo "📝 Gerando descrição do PR..."
COMMITS=$(git log main..develop --oneline --max-count=10 | sed 's/^/- /')

# Criar PR usando GitHub CLI se disponível
if command -v gh &> /dev/null; then
    echo "🔄 Criando PR usando GitHub CLI..."
    gh pr create \
        --base main \
        --head develop \
        --title "🚀 Release: develop → main" \
        --body "Pull request automatizado para release na branch main.

**Branch origem:** \`develop\`
**Branch destino:** \`main\`
**Status da build:** ✅ Aprovado

## Mudanças Recentes:
$COMMITS

Este PR foi criado automaticamente após uma build bem-sucedida na branch develop.
Por favor, revise e faça merge quando estiver pronto para release." \
        --draft=false
    echo "✅ PR criado com sucesso!"
else
    echo "❌ GitHub CLI (gh) não encontrado. Instale ou crie o PR manualmente."
    echo ""
    echo "Detalhes do PR:"
    echo "Título: 🚀 Release: develop → main"
    echo "Base: main"
    echo "Head: develop"
    echo ""
    echo "Mudanças recentes:"
    echo "$COMMITS"
    exit 1
fi
