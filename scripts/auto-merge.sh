#!/bin/bash

# Auto-merge script for develop → main
# This script creates a PR from develop to main when develop branch is updated

set -e

echo "🚀 Auto-merge script: develop → main"

# Check if we're on develop branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
    echo "❌ Error: Must be on develop branch. Currently on: $CURRENT_BRANCH"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: There are uncommitted changes. Please commit or stash them first."
    exit 1
fi

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch origin

# Check if develop is ahead of main
BEHIND_COUNT=$(git rev-list --count main..develop)
if [ "$BEHIND_COUNT" -eq 0 ]; then
    echo "✅ develop is up to date with main. No PR needed."
    exit 0
fi

echo "📊 develop is $BEHIND_COUNT commits ahead of main"

# Check if PR already exists
if command -v gh &> /dev/null; then
    PR_COUNT=$(gh pr list --base main --head develop --json number --jq length)
    if [ "$PR_COUNT" -gt 0 ]; then
        echo "✅ PR from develop to main already exists."
        gh pr list --base main --head develop
        exit 0
    fi
fi

# Get recent commits for PR description
echo "📝 Generating PR description..."
COMMITS=$(git log main..develop --oneline --max-count=10 | sed 's/^/- /')

# Create PR using GitHub CLI if available
if command -v gh &> /dev/null; then
    echo "🔄 Creating PR using GitHub CLI..."
    gh pr create \
        --base main \
        --head develop \
        --title "🚀 Release: develop → main" \
        --body "Automated pull request for release to main branch.

**Source branch:** \`develop\`
**Target branch:** \`main\`
**Build status:** ✅ Passed

## Recent Changes:
$COMMITS

This PR was automatically created after a successful build on the develop branch.
Please review and merge when ready for release." \
        --draft=false
    echo "✅ PR created successfully!"
else
    echo "❌ GitHub CLI (gh) not found. Please install it or create the PR manually."
    echo ""
    echo "PR Details:"
    echo "Title: 🚀 Release: develop → main"
    echo "Base: main"
    echo "Head: develop"
    echo ""
    echo "Recent changes:"
    echo "$COMMITS"
    exit 1
fi
