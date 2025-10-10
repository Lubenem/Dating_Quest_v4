# Dating Quest - Material Top Tabs Version

> A social confidence tracking app with beautiful horizontal swipe navigation!

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Scan QR code with Expo Go app (or your dev-client)
```

---

## 📁 Project Structure

```
Expo_Drawer_DatingQuest/
│
├── types/              # TypeScript type definitions
│   └── index.ts        # Action, Counters, LocationData types
│
├── hooks/              # Custom React hooks
│   └── useLocation.ts  # GPS location tracking hook
│
├── contexts/           # Global state management
│   └── ActionsContext.tsx  # Actions & counters state
│
├── constants/          # App-wide constants
│   └── index.ts        # Colors, layouts, animations
│
├── components/         # Reusable UI components
│   ├── ui/             # Generic UI components
│   │   └── CounterButton.tsx
│   └── dashboard/      # Dashboard-specific components
│       └── CounterGrid.tsx
│
├── pages/              # Screen/Page components
│   └── DashboardPage.tsx
│
├── docs/               # Documentation
│   ├── Actions-State-Tutorial.md      # Learning guide
│   └── Implementation-Summary.md      # What we built
│
└── App.tsx             # Root component with navigation
```

---

## 🎯 Features

### ✅ Implemented
- **Dashboard** with 4 action counters (Approaches, Contacts, Instant Dates, Missed Opportunities)
- **Material Top Tabs** navigation with horizontal swipe
- **GPS Location Tracking** for each action
- **Data Persistence** (AsyncStorage)
- **Haptic Feedback** on button press
- **Smooth Animations** (scale effects)
- **Gradient Backgrounds** throughout app
- **Type-Safe** (Full TypeScript)

### 🚧 Coming Soon
- Map view (show actions as pins)
- Calendar view (historical data)
- Statistics and charts
- User profile and settings

---

## 📚 Documentation

### For Learning:
**[Actions & State Tutorial](docs/Actions-State-Tutorial.md)** - Complete guide to understanding:
- How state management works
- Data flow from button press to UI update
- Context API patterns
- Storage and persistence
- Step-by-step code walkthroughs

### For Development:
**[Implementation Summary](docs/Implementation-Summary.md)** - Overview of:
- Architecture and file structure
- Key features and components
- Design system and colors
- Tech stack and dependencies

---

## 🎨 Design System

### Colors
- **Primary**: Purple (#8b5cf6)
- **Secondary**: Pink (#f093fb)
- **Selected**: Gold (#FFD700)
- **Background**: Dark blue-gray (#1a1a2e)

### Action Colors
- **Approach**: Purple gradient
- **Contact**: Blue gradient
- **Instant Date**: Pink gradient
- **Missed Opportunity**: Dark gradient

---

## 🔧 Tech Stack

- React Native 0.81.4
- Expo SDK 54
- TypeScript
- React Navigation (Material Top Tabs)
- AsyncStorage
- Expo Location
- Expo Linear Gradient
- Expo Haptics

---

## 📱 Usage

### Track an Action
Tap any counter button to record an action with GPS location.

### Undo Last Action
Tap the minus button (top-right corner of counter) to remove the last action of that type.

### View Daily Progress
All counters reset at midnight. Your historical data is preserved in storage.

### Navigate Between Pages
Swipe horizontally or tap the tab bar icons to switch between Dashboard and Map.

---

## 🛠️ Development

### Available Scripts

```bash
npm start                # Start development server
npm run start:dev-client # Start with dev-client
npm run build:dev        # Build dev-client on EAS (Android)
npm run android          # Run on Android emulator
npm run ios              # Run on iOS simulator
npm run web              # Run on web browser
```

### Key Files to Understand

1. **App.tsx** - Navigation setup and app root
2. **contexts/ActionsContext.tsx** - Global state manager
3. **pages/DashboardPage.tsx** - Main dashboard screen
4. **components/ui/CounterButton.tsx** - Action counter buttons
5. **types/index.ts** - All TypeScript types

---

## 🎓 Learning Path

If you're new to React Native, follow this order:

1. Read `docs/Actions-State-Tutorial.md` (comprehensive guide)
2. Explore `types/index.ts` (understand data structures)
3. Study `contexts/ActionsContext.tsx` (state management)
4. Review `pages/DashboardPage.tsx` (component structure)
5. Examine `components/ui/CounterButton.tsx` (UI patterns)

---

## 💡 Code Philosophy

- **KISS Principle** - Keep it simple, avoid unnecessary complexity
- **Type Safety** - Leverage TypeScript for better DX
- **Documentation** - Every file has extensive comments
- **Separation of Concerns** - Pages, components, hooks, contexts
- **Reusability** - DRY (Don't Repeat Yourself)

---

## 🐛 Troubleshooting

### Location Permission Issues
- Ensure location services are enabled on your device
- Grant location permission when prompted
- Check app settings if permission was denied

### Data Not Persisting
- AsyncStorage requires native modules (won't work in Expo Go on web)
- Use dev-client or physical device for full functionality

### Animation Lag
- Ensure `useNativeDriver: true` in animation configs
- Test on physical device (emulators can be slow)

---

## 📄 License

MIT

---

**Built with ❤️ for social confidence and personal growth!**


