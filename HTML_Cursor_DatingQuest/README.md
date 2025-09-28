# Dating Quest - HTML Web App

A simple mobile-first web app for tracking daily dating interactions.

## Features

✅ **Dashboard Page**
- 4 large counter buttons in a 2x2 grid
- Approaches, Contacts, Instant Dates, Planned Dates
- Daily automatic reset
- Tap to increment counters
- Visual feedback and animations

✅ **Calendar Page**
- Monthly calendar view
- Daily data display with all 4 counter values
- Historical tracking
- Previous/next month navigation
- Visual indicators for days with data

✅ **Navigation**
- Bottom tab bar with Dashboard and Calendar
- Smooth page transitions
- Mobile-first responsive design

✅ **Data Storage**
- Local storage (no backend needed)
- Data persists between sessions
- Daily data isolation

## How to Run

### Option 1: GitHub Pages (Recommended for Mobile Testing)
1. Push this repository to GitHub
2. Enable GitHub Pages in repository settings
3. Access your app at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`
4. The root `index.html` will automatically redirect to the app

### Option 2: Python Server (Local Development)
```bash
cd /home/lubenem/Code/Dating_Quest/HTML_Cursor_DatingQuest
python3 server.py
```
Then open http://localhost:8000 in your browser

### Option 3: Direct File
Simply open `index.html` in your web browser

### Option 4: Mobile Testing (Local Network)
1. Start the Python server
2. Find your computer's IP address: `ip addr show`
3. Open `http://YOUR_IP:8000` on your phone

## Mobile-First Design

- Optimized for mobile screens (max-width: 414px)
- Large touch targets (140px+ buttons)
- Responsive grid layout
- Touch-friendly navigation
- Smooth animations and feedback

## Future Enhancements

- PWA (Progressive Web App) support
- APK conversion using Capacitor
- Offline functionality
- Data export/import
- Themes and customization

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: LocalStorage
- **Design**: Mobile-first, responsive
- **Server**: Python HTTP server (for testing)

## File Structure

```
HTML_Cursor_DatingQuest/
├── index.html          # Main app file
├── server.py           # Local development server
└── README.md           # This file
```

## Usage

1. **Track Daily Interactions**: Tap the colored buttons to increment counters
2. **View Progress**: Switch to Calendar tab to see historical data
3. **Reset Data**: Use "Reset Today" button to clear current day's data
4. **Navigate**: Use bottom tabs to switch between Dashboard and Calendar

The app automatically saves your data and resets counters each day at midnight.
