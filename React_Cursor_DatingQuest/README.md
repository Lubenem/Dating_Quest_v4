# Dating Quest - React Version

A modern React-based mobile-first web app for tracking daily dating interactions and progress.

## 🚀 Features

✅ **Dashboard Page**
- 4 large counter buttons in a 2x2 grid
- Approaches, Contacts, Instant Dates, Planned Dates
- Daily automatic reset
- Tap to increment counters
- Minus buttons for mistake correction
- Visual feedback and animations

✅ **Calendar Page**
- Monthly calendar view
- Daily data display with all 4 counter values
- Historical tracking
- Previous/next month navigation
- Visual indicators for days with data
- Always-visible day details panel

✅ **Map Page**
- Interactive map using React-Leaflet
- Current location detection with GPS
- Custom red dot marker showing your position
- Full-screen map experience

✅ **Navigation**
- Bottom tab bar with Dashboard, Calendar, and Map
- Smooth page transitions with React Router
- Mobile-first responsive design

✅ **Data Storage**
- Local storage (no backend needed)
- Data persists between sessions
- Daily data isolation

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Maps**: React-Leaflet with OpenStreetMap
- **Icons**: Lucide React
- **Storage**: LocalStorage
- **Design**: Mobile-first, responsive CSS

## 🎨 Design Features

- **Dark Theme**: Deep dark blue background (#1a1a2e)
- **Purple-Pink Gradients**: Beautiful gradient buttons and highlights
- **Professional Icons**: Clean SVG icons from Lucide React
- **Mobile-First**: Optimized for mobile devices
- **PWA Support**: Install as app on mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd react-cursor-datingquest
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Local: http://localhost:5173
   - Mobile: Use your computer's IP address

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

## 📱 Mobile Testing

1. Start the dev server
2. Find your computer's IP: `ip addr show`
3. Open `http://YOUR_IP:5173` on your phone
4. Add to home screen for app-like experience

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard with counters
│   ├── Calendar.tsx    # Calendar view with day details
│   ├── Map.tsx         # Interactive map
│   └── Navigation.tsx  # Bottom navigation
├── hooks/              # Custom React hooks
│   └── useCounters.ts  # Counter state management
├── types/              # TypeScript type definitions
│   └── index.ts        # App types
├── App.tsx             # Main app component
├── App.css             # Global styles
└── main.tsx            # App entry point
```

## 🎯 Key Improvements over HTML Version

- **Component Architecture**: Reusable, maintainable components
- **Type Safety**: Full TypeScript support
- **State Management**: Custom hooks for clean state logic
- **Modern Tooling**: Vite for fast development and building
- **Professional Icons**: Lucide React for consistent iconography
- **Better Performance**: React's virtual DOM and optimizations
- **Scalability**: Easy to add new features and components

## 🔮 Future Enhancements

- **Analytics Dashboard**: Charts and progress visualization
- **Achievements System**: Gamification with badges
- **Data Export**: CSV/PDF reports
- **Themes**: Multiple color schemes
- **Social Features**: Share progress, leaderboards
- **Premium Features**: Advanced analytics, unlimited history

## 📊 Usage

1. **Track Daily Interactions**: Tap colored buttons to increment counters
2. **Correct Mistakes**: Use minus buttons to decrement if needed
3. **View Progress**: Switch to Calendar tab to see historical data
4. **Check Location**: Use Map tab to see your current location
5. **Install App**: Add to home screen for native app experience

The app automatically saves your data and resets counters each day at midnight.