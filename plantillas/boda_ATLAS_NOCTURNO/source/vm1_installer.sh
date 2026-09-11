#!/bin/bash

# VM1 Launcher Script
# Cleans and reinstalls dependencies, then starts Vite dev server

echo "🧹 Cleaning node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "🗑️  Cleaning npm cache..."
npm cache clean --force

echo "⚙️  Setting npm maxsockets to 3..."
npm set maxsockets 3

echo "📦 Installing dependencies..."
npm i

echo "🚀 Starting Vite dev server on 0.0.0.0:8000..."
npx vite --host 0.0.0.0 --port 8000
