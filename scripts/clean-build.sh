#!/bin/bash

# Remove Next.js build cache
rm -rf .next
rm -rf .turbo
rm -rf out

# Remove node_modules cache
rm -rf node_modules/.cache

# Clear npm cache
npm cache clean --force 2>/dev/null || true
pnpm store prune 2>/dev/null || true

echo "Build cache cleaned successfully!"
