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

## Expo Mobile App (Expo_Cursor_DatingQuest)
Dating Quest is being migrated to a native mobile app using Expo/React Native.

### Current Status
- **Framework**: Expo SDK 54, React Native, TypeScript
- **Features Implemented**:
  - Dashboard with animated gradient background
  - Edge-based swipe navigation between Dashboard and Map pages (swipe from left/right edge)
  - Map page with react-native-maps featuring custom dark theme
  - Color-coded numbered markers for all action types (approach, contact, instant date, missed opportunity)
  - Location services with expo-location
  - Gesture system that allows map interaction (pan, zoom, rotate) without page swipe interference
  
### Testing & Building
- **Important**: react-native-maps requires a development build and **will NOT work in Expo Go**
- Use EAS Build to create native builds for testing on device

### Build Commands (via npm scripts)
```bash
# Development build (APK for testing with dev client)
npm run build:dev

# Preview build (APK for internal testing)
npm run build:preview

# Production build (AAB for Google Play Store)
npm run build:prod
```

### First Time Setup for EAS Build
1. **Login to Expo**: `npx eas-cli login`
2. **Build for Android**: `npm run build:dev`
3. EAS will prompt for Android keystore - press Y to auto-generate
4. Wait for cloud build to complete (~10-15 minutes)
5. Install APK from the dashboard or scan QR code
6. Run `npm run start:dev-client` to connect to dev server

### Configuration
- **Package**: com.lubenem.datingquest
- **EAS Project**: Already configured in app.json
- **Build Profiles**: Configured in eas.json
  - `development`: Debug APK with dev client
  - `preview`: Release APK for testing
  - `production`: AAB for Play Store

### Future Features (Planned)
- Action markers on map (approaches, contacts, instant dates, missed opportunities)
- Date picker for historical data
- Marker clustering for nearby actions
- Polylines connecting action points
- Marker details on tap

## Recent Changes
- 2025-10-05: Initial Replit setup
  - Installed Node.js 20 and npm dependencies
  - Configured Vite for Replit environment (port 5000, 0.0.0.0 host, allowedHosts enabled)
  - Set up workflow for React dev server
  - Created .gitignore for Node.js project
  - Configured autoscale deployment with serve package
  
- 2025-10-05: Expo Mobile App Development
  - Implemented Map page with expo-maps integration
  - Created swipe navigation between Dashboard and Map
  - Fixed gesture handling with proper shared values and threshold logic
  - Configured EAS Build for Android development builds
  - Added build scripts to package.json (build:dev, build:preview, build:prod)
  - Installed expo-dev-client and eas-cli for development builds

- 2025-10-07: Map & Gesture Improvements
  - Migrated from expo-maps to react-native-maps for better customization
  - Implemented custom dark map theme with sexy styling using customMapStyle
  - Added color-coded numbered markers for all action types
  - Fixed critical gesture conflict using edge-based swipe detection (50px zones)
  - Implemented manual gesture activation with stateManager API
  - Map now supports full interaction (pan, zoom, rotate) without page swipe interference
  - Removed map page header to maximize screen space
  - Cleaned up unused expo-maps dependency
  - Fixed NullPointerException crash when leaving app (added onUserLeaveHint override in MainActivity.kt)
