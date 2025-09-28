# Dating Quest MVP - AI App Generator Prompt

## App Concept
A simple mobile tracker that gamifies approaching women in real life. Users track daily interactions and view progress in a calendar.

## Tech Requirements
- **Platform**: React Native with Expo
- **Target**: Native mobile app feel
- **Storage**: Local storage only (no backend needed)

## Core Features

### 1. Dashboard Page
- **4 large counter buttons** in a 2x2 grid:
  - Approaches
  - Contacts  
  - Instant Dates
  - Planned Dates
- **Daily reset**: All counters reset to 0 each day
- **Tap to increment**: Each button adds +1 when tapped
- **Visual feedback**: Buttons show current count prominently

### 2. Calendar Page  
- **Monthly calendar view**
- **Daily data display**: Show all 4 counter values for each day
- **Historical tracking**: View past days' progress
- **Simple navigation**: Previous/next month buttons

### 3. Navigation
- **Bottom tab bar** with 2 tabs:
  - Dashboard (home icon)
  - Calendar (calendar icon)
- **Smooth transitions**: Horizontal swipe between pages

## UI/UX Requirements
- **Clean, minimal design**
- **Large touch targets** (easy to tap)
- **Clear typography** for numbers
- **Intuitive navigation**
- **Mobile-first responsive design**

## Success Criteria
- User can quickly increment counters
- Daily progress is clearly visible
- Calendar shows historical data
- App feels native and responsive
- No complex features or animations