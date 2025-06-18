#!/bin/bash

# Script de desenvolvimento para Blockly NT
# Facilita tarefas comuns de desenvolvimento

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

show_help() {
    echo "🚀 Blockly NT - Script de Desenvolvimento"
    echo ""
    echo "Uso: ./scripts/dev.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  setup          - Configuração inicial do projeto"
    echo "  dev            - Iniciar servidor de desenvolvimento"
    echo "  build          - Build da aplicação"
    echo "  lint           - Executar linting"
    echo "  lint:fix       - Executar linting com correção automática"
    echo "  test           - Executar testes (quando implementados)"
    echo "  clean          - Limpar builds e cache"
    echo "  branch         - Criar nova branch de feature"
    echo "  check          - Verificar se tudo está funcionando"
    echo "  help           - Mostrar esta ajuda"
    echo ""
}

setup_project() {
    print_status "Configurando projeto..."
    
    # Verificar se pnpm está instalado
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm não está instalado. Instale com: npm install -g pnpm"
        exit 1
    fi
    
    # Instalar dependências
    print_status "Instalando dependências..."
    pnpm install
    
    # Configurar Git hooks (se houver)
    if [ -f ".husky/install" ]; then
        print_status "Configurando Git hooks..."
        pnpm husky install
    fi
    
    print_success "Projeto configurado com sucesso!"
    print_status "Execute './scripts/dev.sh dev' para iniciar o desenvolvimento"
}

start_dev() {
    print_status "Iniciando servidor de desenvolvimento..."
    pnpm dev
}

build_project() {
    print_status "Construindo aplicação..."
    
    # Limpar build anterior
    rm -rf dist/
    
    # Executar build
    pnpm build
    
    if [ $? -eq 0 ]; then
        print_success "Build concluído com sucesso!"
        print_status "Arquivos gerados em: ./dist/"
    else
        print_error "Build falhou!"
        exit 1
    fi
}

run_lint() {
    print_status "Executando linting..."
    pnpm lint
    
    if [ $? -eq 0 ]; then
        print_success "Linting passou sem problemas!"
    else
        print_warning "Problemas encontrados no linting. Execute 'lint:fix' para tentar correções automáticas."
    fi
}

run_lint_fix() {
    print_status "Executando linting com correção automática..."
    
    # ESLint com fix (se configurado)
    if [ -f "eslint.config.js" ]; then
        npx eslint . --fix
    fi
    
    # Prettier (se configurado)
    if [ -f ".prettierrc" ] || [ -f "prettier.config.js" ]; then
        npx prettier --write .
    fi
    
    print_success "Correções automáticas aplicadas!"
}

run_tests() {
    print_status "Executando testes..."
    # Adicionar comando de teste quando implementado
    print_warning "Testes ainda não implementados"
}

clean_project() {
    print_status "Limpando projeto..."
    
    # Remover builds
    rm -rf dist/
    rm -rf build/
    
    # Limpar cache do pnpm
    pnpm store prune
    
    # Limpar node_modules e reinstalar (opcional)
    read -p "Deseja limpar node_modules e reinstalar? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf node_modules/
        pnpm install
    fi
    
    print_success "Limpeza concluída!"
}

create_branch() {
    print_status "Criando nova branch de feature..."
    
    # Verificar se está em develop
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "develop" ]; then
        print_warning "Você não está na branch develop. Mudando para develop..."
        git checkout develop
        git pull origin develop
    fi
    
    # Solicitar nome da feature
    echo -n "Digite o nome da feature (sem espaços): "
    read feature_name
    
    if [ -z "$feature_name" ]; then
        print_error "Nome da feature é obrigatório!"
        exit 1
    fi
    
    # Criar e trocar para nova branch
    branch_name="feature/$feature_name"
    git checkout -b "$branch_name"
    
    print_success "Branch '$branch_name' criada com sucesso!"
    print_status "Você pode agora começar a desenvolver sua feature."
    print_status "Quando terminar, faça commit e push:"
    echo "  git add ."
    echo "  git commit -m 'feat: adiciona $feature_name'"
    echo "  git push origin $branch_name"
}

check_project() {
    print_status "Verificando projeto..."
    
    # Verificar dependências
    print_status "Verificando dependências..."
    pnpm install --frozen-lockfile
    
    # Executar linting
    print_status "Verificando código..."
    pnpm lint
    
    # Executar build
    print_status "Testando build..."
    pnpm build
    
    print_success "✅ Projeto está funcionando corretamente!"
}

# Processar argumentos
case "${1:-help}" in
    "setup")
        setup_project
        ;;
    "dev")
        start_dev
        ;;
    "build")
        build_project
        ;;
    "lint")
        run_lint
        ;;
    "lint:fix")
        run_lint_fix
        ;;
    "test")
        run_tests
        ;;
    "clean")
        clean_project
        ;;
    "branch")
        create_branch
        ;;
    "check")
        check_project
        ;;
    "help"|*)
        show_help
        ;;
esac
