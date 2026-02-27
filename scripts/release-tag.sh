#!/usr/bin/env bash
set -euo pipefail

TAG="${1:-}"

if [[ -z "$TAG" ]]; then
  echo "Usage: npm run release:tag -- <tag>"
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: this command must run inside a git repository."
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "Error: current branch is '$CURRENT_BRANCH'. Switch to 'main' first."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree is not clean. Commit or stash your changes first."
  exit 1
fi

if git show-ref --tags --verify --quiet "refs/tags/$TAG"; then
  echo "Error: tag '$TAG' already exists."
  exit 1
fi

if git ls-remote --exit-code --tags origin "refs/tags/$TAG" >/dev/null 2>&1; then
  echo "Error: tag '$TAG' already exists on origin."
  exit 1
fi

if [[ -f versions.json ]] && jq -e --arg v "$TAG" '.[] | select(. == $v)' versions.json >/dev/null; then
  echo "Error: Docusaurus version '$TAG' already exists in versions.json."
  exit 1
fi

echo "Creating Docusaurus docs version: $TAG"
npx docusaurus docs:version "$TAG"

echo "Committing generated version files"
git add versions.json versioned_docs versioned_sidebars

if git diff --cached --quiet; then
  echo "No version file changes detected. Nothing to commit."
  exit 1
fi

git commit -m "docs: add Docusaurus version $TAG"

echo "Pushing main"
git push origin main

echo "Creating and pushing tag: $TAG"
git tag "$TAG"
git push origin "$TAG"

echo "Done."
