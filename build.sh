#!/bin/bash

# Exit on error
set -e

echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build

echo "📦 Moving frontend build to backend..."
# Create a static directory in backend if it doesn't exist
mkdir -p ../backend/static
# Remove any existing frontend build
rm -rf ../backend/static/*
# Copy the new build
cp -r dist/* ../backend/static/

echo "✨ Build complete! Frontend assets are now in backend/static/" 