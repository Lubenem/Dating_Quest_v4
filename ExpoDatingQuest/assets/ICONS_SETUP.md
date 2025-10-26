# App Icons Setup Guide

## Required Icons

You need to create 6 icon files with heart variations:

### 1. Production Icons (Blue Heart)
- `icon.png` - 1024x1024px - Blue heart icon
- `adaptive-icon.png` - 1024x1024px - Blue heart adaptive icon (Android)

### 2. Preview Icons (Blue Heart with "P" badge)
- `icon-preview.png` - 1024x1024px - Blue heart with small "P" badge
- `adaptive-icon-preview.png` - 1024x1024px - Blue heart adaptive icon with "P"

### 3. Development Icons (Red Heart with "D" badge)
- `icon-dev.png` - 1024x1024px - Red heart with small "D" badge
- `adaptive-icon-dev.png` - 1024x1024px - Red heart adaptive icon with "D"

## Design Specifications

### Base Icon (1024x1024px)
- Background: Transparent or gradient (#1a1a2e to #16213e)
- Heart icon: Centered, ~700x700px
- Production: Blue (#4A90E2)
- Preview: Blue (#4A90E2) with "P" badge in corner
- Development: Red (#E74C3C) with "D" badge in corner

### Adaptive Icon (Android - 1024x1024px)
- Safe zone: Center 66% (683x683px) - critical content here
- Full bleed: Can use entire 1024x1024px
- Background layer: Can be separate if needed
- Badge placement: Bottom-right corner, ~200x200px

## Quick Icon Generation Options

### Option 1: Using Figma/Design Tool
1. Create 1024x1024px canvas
2. Add heart shape (❤️)
3. Apply colors:
   - Blue: #4A90E2 (Production/Preview)
   - Red: #E74C3C (Development)
4. Add badge text ("P" or "D") in bottom-right corner
5. Export as PNG

### Option 2: Using Expo Icon Generator
```bash
# After creating base icons, use expo's icon generator
npx expo-optimize
```

### Option 3: Using Online Tools
- https://icon.kitchen/ - Generate adaptive icons
- https://www.appicon.co/ - Generate all sizes
- https://easyappicon.com/ - Simple icon generator

## Icon Checklist

- [ ] `icon.png` (Production - Blue heart)
- [ ] `icon-preview.png` (Preview - Blue heart + "P")
- [ ] `icon-dev.png` (Development - Red heart + "D")
- [ ] `adaptive-icon.png` (Production - Blue)
- [ ] `adaptive-icon-preview.png` (Preview - Blue + "P")
- [ ] `adaptive-icon-dev.png` (Development - Red + "D")

## Testing Icons

After creating icons, test them:

```bash
# Development build (Red heart)
eas build --profile development --platform android

# Preview build (Blue heart with P)
eas build --profile preview --platform android

# Production build (Blue heart)
eas build --profile production --platform android
```

## Current Status

✅ Configuration files updated
✅ Build profiles configured
❌ Icon files need to be created (use existing icon.png as template)

## Quick Start

If you want to quickly test the setup:
1. Copy `icon.png` to `icon-dev.png` and `icon-preview.png`
2. Copy `adaptive-icon.png` to `adaptive-icon-dev.png` and `adaptive-icon-preview.png`
3. Build and test - icons will look the same but bundle IDs will be different
4. Then create proper icons with different colors later

