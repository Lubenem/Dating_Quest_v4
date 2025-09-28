#!/bin/bash

# Build and deploy script for GitHub Pages
echo "🚀 Building React app for GitHub Pages..."

# Build the app to Build folder
npm run build

echo "✅ Build complete! Files are in the Build/ folder."
echo "📁 Commit and push to GitHub Pages."
echo "🌐 App will be available at: https://lubenem.github.io/Dating_Quest_v4/React_Cursor_DatingQuest/Build/"
