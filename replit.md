# Dating Quest - Replit Setup

## Overview
Dating Quest is a modern React-based mobile-first web app for tracking daily dating interactions and progress. The main application is built with React 18, TypeScript, and Vite.

## Project Structure
This repository contains multiple implementations:
- **React_Cursor_DatingQuest/** - Main React/Vite app (primary version, configured for Replit)
- **Expo_Cursor_DatingQuest/** - Expo/React Native version (mobile native)
- **HTML_Cursor_DatingQuest/** - Legacy HTML version
- **GameDesignDocuments/** - Design assets and documentation

## Current Setup (Replit)
- **Framework**: React 18 + TypeScript + Vite
- **Port**: 5000 (frontend)
- **Host**: 0.0.0.0 (configured for Replit proxy)
- **Storage**: LocalStorage (no backend required)

## Features
- Dashboard with 4 counter buttons (Approaches, Missed Opportunities, Contacts, Instant Dates)
- Calendar view for historical tracking
- Interactive map with geolocation
- Daily automatic reset
- PWA support for mobile installation

## Development
The Vite dev server is configured to run on port 5000 and is optimized for the Replit environment with:
- Host set to 0.0.0.0 for external access
- WebSocket HMR configured for Replit's proxy
- Base path set to '/' for development

## Deployment
The app uses local storage only - no backend or database required. All data is stored in the browser's localStorage.

## Recent Changes
- 2025-10-05: Initial Replit setup
  - Installed Node.js 20 and npm dependencies
  - Configured Vite for Replit environment (port 5000, 0.0.0.0 host, allowedHosts enabled)
  - Set up workflow for React dev server
  - Created .gitignore for Node.js project
  - Configured autoscale deployment with serve package
