# App Technical Overview

## How the App Works

- **Expo** lets you build mobile apps using React (JavaScript/TypeScript).
- Your app uses **React Context** for state management (tracking counters, actions, etc.).
- **AsyncStorage** is used to save data on the device (so your progress isn’t lost).
- The UI is made of **components** (reusable building blocks).
- **Navigation** is handled by Expo Router (file-based routing).

---

## Key Code Files and Their Responsibilities

### Dashboard Page
- **components/Dashboard/DashboardScreen.tsx**
  - The main screen for the dashboard.
  - Handles displaying the counters, date, and warning messages.
  - Handles increment/decrement logic for counters.
- **components/Dashboard/CounterGrid.tsx**
  - Lays out the 4 counter buttons in a grid.
- **components/ui/CounterButton.tsx**
  - The individual counter button (with icon, gradient, animations, minus button).

### State Management
- **contexts/ActionsContext.tsx**
  - Stores all actions (approaches, contacts, etc.).
  - Provides functions to add/remove actions, get counters, etc.
  - Handles saving/loading data from AsyncStorage.

### Other Pages
- **app/(tabs)/calendar.tsx** (not shown, but would be here)
  - Calendar page logic.
- **app/(tabs)/map.tsx** (not shown, but would be here)
  - Map page logic.

### UI Constants
- **constants/index.ts**
  - Colors, layout sizes, etc.

### Types
- **types/index.ts**
  - TypeScript types for actions, counters, etc.

---

## If You Want to Change the Dashboard Page

- **UI Layout/Design:**  
  Edit `DashboardScreen.tsx` and `CounterGrid.tsx`.
- **Counter Button Look/Feel:**  
  Edit `CounterButton.tsx`.
- **Counter Logic (add/remove):**  
  Edit `ActionsContext.tsx`.
- **Colors/Gradients:**  
  Edit `constants/index.ts`.

---

**Summary:**  
- Dashboard UI = `DashboardScreen.tsx`, `CounterGrid.tsx`, `CounterButton.tsx`
- State/data = `ActionsContext.tsx`
- Styles/colors = `constants/index.ts`

Let me know if you want to dive into any specific part!