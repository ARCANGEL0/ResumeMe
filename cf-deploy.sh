#!/bin/bash
set -euo pipefail

# Cloudflare Pages deploy script for ResumeMe
# Usage: chmod +x cf-deploy.sh && ./cf-deploy.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "[1/3] Building project..."
npm run build
if [ ! -d "dist" ]; then
  echo "Error: dist/ directory not found after build." >&2
  exit 1
fi

echo "[2/3] Checking wrangler config..."
if [ ! -f "wrangler.toml" ]; then
  echo "Error: wrangler.toml not found." >&2
  exit 1
fi

echo "[3/3] Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=resumeme

echo "✅ Deploy complete!"
