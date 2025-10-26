# Build Configuration Guide

## Overview

Your app now supports three distinct build variants that can coexist on the same device:

| Build Type | Bundle ID | App Name | Icon | Status Bar |
|------------|-----------|----------|------|------------|
| **Development** | `com.karakum.datingquest.dev` | DatingQuest DEV | Red Heart + "D" | Dark |
| **Preview** | `com.karakum.datingquest.preview` | DatingQuest Preview | Blue Heart + "P" | Dark |
| **Production** | `com.karakum.datingquest` | Dating Quest | Blue Heart | Dark |

## ✅ What's Been Configured

### 1. Dark System UI Theme
- ✅ Status bar: Black background with light content
- ✅ Navigation bar (Android): Black background
- ✅ Configured in `App.tsx` with `<StatusBar>` component
- ✅ Set in `app.config.js` for iOS Info.plist
- ✅ Set in `app.config.js` for Android theme

### 2. Separate Bundle Identifiers
- ✅ Development: `com.karakum.datingquest.dev`
- ✅ Preview: `com.karakum.datingquest.preview`
- ✅ Production: `com.karakum.datingquest`
- ✅ All three can be installed simultaneously on the same device

### 3. Different App Icons
- ✅ Configuration ready in `app.config.js`
- ✅ Placeholder icons created (currently all the same)
- ⏳ Custom colored icons pending (see `assets/ICONS_SETUP.md`)

## Files Modified

### 1. `app.json` → `app.config.js`
Converted static JSON to dynamic JavaScript config that reads `EAS_BUILD_PROFILE` environment variable to configure:
- App name with build variant suffix
- Bundle identifier with variant suffix
- Icon paths based on variant
- Dark theme settings

### 2. `eas.json`
Added environment variables for each build profile:
```json
{
  "development": { "env": { "APP_VARIANT": "development" } },
  "preview": { "env": { "APP_VARIANT": "preview" } },
  "production": { "env": { "APP_VARIANT": "production" } }
}
```

### 3. `App.tsx`
Added `StatusBar` component with dark theme configuration:
```javascript
<StatusBar
  barStyle="light-content"
  backgroundColor="#000000"
  translucent={Platform.OS === 'android'}
/>
```

### 4. New Files Created
- `app.config.js` - Dynamic app configuration
- `assets/ICONS_SETUP.md` - Icon creation guide
- `scripts/setup-icons.js` - Icon placeholder generator
- `BUILD_CONFIGURATION.md` - This file

## Building Each Variant

### Development Build (Red Heart - Dev Client)
```bash
cd ExpoDatingQuest
eas build --profile development --platform android
```
- Includes Expo Dev Client for hot reload
- Red heart icon with "D" badge
- App name: "DatingQuest DEV"
- Bundle ID: `com.karakum.datingquest.dev`

### Preview Build (Blue Heart with "P")
```bash
cd ExpoDatingQuest
eas build --profile preview --platform android
```
- Standalone APK for testing
- Blue heart icon with "P" badge
- App name: "DatingQuest Preview"
- Bundle ID: `com.karakum.datingquest.preview`

### Production Build (Blue Heart)
```bash
cd ExpoDatingQuest
eas build --profile production --platform android
```
- Production-ready APK
- Blue heart icon (clean)
- App name: "Dating Quest"
- Bundle ID: `com.karakum.datingquest`

## Verifying Configuration

### Check Bundle Identifier
After building, install the APK and check:
```bash
adb shell pm list packages | grep karakum
```
Should show:
```
com.karakum.datingquest.dev       # Development
com.karakum.datingquest.preview   # Preview
com.karakum.datingquest           # Production
```

### Check App Name
Look at your phone's app drawer - you should see:
- DatingQuest DEV
- DatingQuest Preview  
- Dating Quest

### Check Status Bar
Open any build - the status bar and navigation bar should be dark/black.

## Next Steps

### 1. Create Custom Icons
Follow the guide in `assets/ICONS_SETUP.md` to create:
- Red heart icon for development
- Blue heart with "P" for preview
- Blue heart (clean) for production

### 2. Test Builds
```bash
# Build all three variants
eas build --profile development --platform android
eas build --profile preview --platform android
eas build --profile production --platform android

# Install all three on your device
# They should all appear as separate apps
```

### 3. Verify Dark Theme
- Open each app
- Check that status bar (top) is dark
- Check that navigation bar (bottom) is dark on Android
- Verify across all three builds

## Troubleshooting

### Issue: Icons still look the same
**Solution**: Replace placeholder icons with custom colored versions (see `assets/ICONS_SETUP.md`)

### Issue: Apps overwrite each other
**Solution**: Make sure you're building with different profiles:
```bash
# NOT THIS (will use same bundle ID):
eas build --platform android

# DO THIS (specifies profile):
eas build --profile development --platform android
```

### Issue: Status bar not dark
**Solution**: 
1. Check `App.tsx` has `<StatusBar barStyle="light-content" />`
2. Rebuild the app
3. On iOS, may need to restart device

### Issue: Build fails with "icon not found"
**Solution**: Run icon setup script:
```bash
cd ExpoDatingQuest
node scripts/setup-icons.js
```

## Configuration Details

### Dynamic App Name Logic
```javascript
const getAppName = () => {
  if (IS_DEV) return 'DatingQuest DEV';
  if (IS_PREVIEW) return 'DatingQuest Preview';
  return 'Dating Quest';
};
```

### Bundle Identifier Logic
```javascript
const getAppIdentifier = () => {
  const base = 'com.karakum.datingquest';
  if (IS_DEV) return `${base}.dev`;
  if (IS_PREVIEW) return `${base}.preview`;
  return base;
};
```

### Icon Selection Logic
```javascript
const getAppIcon = () => {
  if (IS_DEV) return './assets/icon-dev.png';
  if (IS_PREVIEW) return './assets/icon-preview.png';
  return './assets/icon.png';
};
```

## Testing Checklist

- [ ] Build development variant
- [ ] Build preview variant
- [ ] Build production variant
- [ ] Install all three on device simultaneously
- [ ] Verify different app names in app drawer
- [ ] Verify dark status bar in all builds
- [ ] Verify dark navigation bar on Android
- [ ] Create custom colored icons
- [ ] Rebuild with new icons
- [ ] Verify different icon colors

## Support

For issues or questions:
1. Check `assets/ICONS_SETUP.md` for icon creation help
2. Review `app.config.js` for configuration logic
3. Check EAS build logs: `eas build:list`

