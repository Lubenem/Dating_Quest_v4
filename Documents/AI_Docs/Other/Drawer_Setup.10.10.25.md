# Expo Drawer Navigation - Horizontal Slide Animation

## ✅ What You Get

This setup uses **React Navigation Drawer** which provides:
- ✅ **Horizontal slide animation** when switching between screens
- ✅ **Swipe gesture** from screen edge to open drawer
- ✅ **Menu button** in header to toggle drawer
- ✅ **Smooth animations** powered by Reanimated
- ✅ Works with your existing dev-client (same app identity)

## 🎯 How It Works

### Drawer Types:
The drawer has different `drawerType` options:

1. **`'slide'`** (CURRENT) ← **This gives you the horizontal animation!**
   - Content slides horizontally as drawer opens
   - Drawer menu slides in from the side
   - This is what you wanted!

2. **`'front'`**
   - Drawer appears on top of content
   - Content doesn't move
   - No horizontal slide

3. **`'back'`**
   - Content slides to reveal drawer underneath
   - Less common

4. **`'permanent'`**
   - Drawer always visible (tablet/desktop)
   - Not suitable for mobile

## 🚀 Current Configuration

```typescript
<Drawer.Navigator
  screenOptions={{
    drawerType: 'slide',     // ← Horizontal slide animation!
    swipeEnabled: true,      // Enable swipe gesture
    swipeEdgeWidth: 50,      // Swipe from 50px edge
    overlayColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
  }}
>
```

## 🎨 Customization

### Change Animation Speed
In `App.tsx`, you can customize the drawer behavior:

```typescript
screenOptions={{
  drawerType: 'slide',
  // Add custom transition specs (advanced)
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300, // milliseconds
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
      },
    },
  },
}}
```

### Disable Header (Bottom Tabs Instead)
If you want bottom tabs + drawer:

```typescript
screenOptions={{
  headerShown: false, // Hide header
  drawerType: 'slide',
}}
```

Then add bottom tabs inside each screen component.

## 📱 User Experience

### Opening Drawer:
1. **Swipe from left edge** → Drawer slides in with animation
2. **Tap menu button** → Drawer slides in with animation
3. **Content slides to the right** as drawer appears

### Switching Screens:
1. Tap "Map" in drawer
2. **Horizontal slide animation** from Dashboard to Map
3. Drawer closes automatically
4. Smooth transition!

### Closing Drawer:
1. **Swipe back** to left edge
2. **Tap outside** drawer (on overlay)
3. **Tap current screen** in drawer menu
4. Content slides back with animation

## 🎯 Why This Works Better Than Custom Solution

| Feature | Custom Animated.View | Drawer Navigation |
|---------|---------------------|-------------------|
| Horizontal Animation | ✅ (with effort) | ✅ (built-in) |
| No Flicker | ❌ (had issues) | ✅ |
| Map Gestures | ❌ (conflicted) | ✅ (no conflict) |
| Swipe to Open | ❌ | ✅ |
| Menu Button | ❌ (manual) | ✅ (automatic) |
| Maintained by | You | React Navigation team |

## 🔧 Testing

1. **Start the app**: `npm start`
2. **Scan QR** with your existing dev-client
3. **Try these**:
   - Swipe from left edge → See drawer slide in
   - Tap "Map" → See horizontal slide to Map screen
   - Swipe back → See smooth return animation
   - Tap menu button → Drawer toggles with animation

## 🎨 Making It Look Like Bottom Tabs

If you want it to **look like** bottom tabs but use drawer navigation:

1. Hide the header: `headerShown: false`
2. Add a custom bottom bar component with icons
3. Use `navigation.navigate()` on icon tap
4. Drawer provides the animation, your UI looks like tabs!

This is actually how many apps achieve "tab-like" horizontal animations!

## 📊 Comparison: Drawer vs Tabs

### Bottom Tabs (Standard):
- ✅ Industry standard
- ❌ **No horizontal slide animation**
- ✅ Clear navigation model
- ✅ No gesture conflicts with map

### Drawer with `drawerType: 'slide'`:
- ✅ **Horizontal slide animation** ← What you want!
- ✅ Smooth, maintained by experts
- ✅ Can be styled to look like tabs
- ⚠️ Less common pattern for bottom navigation
- ✅ No gesture conflicts (swipe from edge, not anywhere)

## 🎯 Recommendation

**Try this drawer setup!**

Advantages:
1. ✅ Gets you the horizontal slide animation
2. ✅ No flicker issues
3. ✅ No custom animation code to maintain
4. ✅ Battle-tested by React Navigation
5. ✅ Works with your existing dev-client
6. ✅ Can be customized to look however you want

The "drawer" is just a navigation pattern. You can make it look like anything - bottom tabs, side menu, whatever. The important part is it gives you **smooth horizontal slide animations** that actually work!

## 🚀 Next Steps

1. **Test it now** - see if the animation feels right
2. **If you like it**: Copy your Dashboard/Map components into this setup
3. **Style the drawer** to match your design (or hide it and add bottom tabs UI)
4. **Add your business logic** (contexts, state, etc.)

You'll have working horizontal animations in 5 minutes instead of fighting with custom solutions for days! 🎉

