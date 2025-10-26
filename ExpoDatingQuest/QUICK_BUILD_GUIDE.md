# Quick Build Reference

## Build Commands

```bash
cd ExpoDatingQuest

# Development (Red Heart + Dev Client)
eas build --profile development --platform android

# Preview (Blue Heart with P)
eas build --profile preview --platform android

# Production (Blue Heart)
eas build --profile production --platform android
```

## What's Different

| Feature | Development | Preview | Production |
|---------|-------------|---------|------------|
| Bundle ID | `.dev` suffix | `.preview` suffix | Base ID |
| App Name | "DatingQuest DEV" | "DatingQuest Preview" | "Dating Quest" |
| Icon | Red heart + D | Blue heart + P | Blue heart |
| Dev Tools | ✅ Included | ❌ None | ❌ None |
| Can Coexist | ✅ Yes | ✅ Yes | ✅ Yes |

## Quick Status Check

✅ Dark status bar configured
✅ Dark navigation bar configured (Android)
✅ Different bundle IDs for each variant
✅ Different app names for each variant
✅ Placeholder icons created
⏳ Custom colored icons needed

## Next: Create Custom Icons

See `assets/ICONS_SETUP.md` for detailed instructions.

**Quick option**: Copy existing icons and edit colors:
1. Open `icon.png` in any image editor
2. Change color to red → save as `icon-dev.png`
3. Change color to blue + add "P" text → save as `icon-preview.png`
4. Repeat for `adaptive-icon-*.png` files
5. Rebuild!

## Files to Review

- `BUILD_CONFIGURATION.md` - Complete setup documentation
- `assets/ICONS_SETUP.md` - Icon creation guide
- `app.config.js` - Dynamic configuration logic

