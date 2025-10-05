# Map Page Technical Plan for Dating Quest Expo App

**Date:** October 5, 2025  
**Project:** Expo_Cursor_DatingQuest  
**Reference:** React_Cursor_DatingQuest (web version)

---

## Executive Summary

This document outlines the technical approach for implementing a map page in the Dating Quest Expo mobile app, replicating the functionality from the existing React web version while adapting it for native mobile platforms (iOS & Android).

---

## Current State Analysis

### React Web App (React_Cursor_DatingQuest)
**Library:** react-leaflet + leaflet  
**Map Tiles:** OpenStreetMap (free, no API key required)  
**Platform:** Web only

**Key Features:**
- Interactive map showing all action points with geolocation
- Date picker to view historical actions from previous days
- Custom marker clustering (groups nearby actions within ~50m)
- Sequential numbering of actions (1, 2, 3...) based on timestamp
- Progress-based color coding (blue → green → gold) based on daily goal
- Different markers for:
  - Regular actions (approaches, contacts, instant dates)
  - Missed opportunities (gray with X)
  - Current location (black dot)
- Polylines connecting action points showing the user's path
- Popup details showing action type, time, coordinates, and notes
- Custom marker sizes and animations for the latest action
- Semi-transparent location marker that's always visible

**Technical Implementation:**
- Uses L.divIcon for custom HTML-based markers
- Implements custom clustering algorithm (not using a library)
- Progress color calculation: `getProgressColor(actionIndex, dailyGoal)`
- Marker size scaling based on importance (latest = 24px, others = 20px)
- Z-index management to keep latest markers on top

---

## Expo/React Native Map Library Options

### Option 1: **react-native-maps** ⭐ RECOMMENDED
**Status:** Mature, production-ready  
**Platforms:** iOS (Apple Maps) + Android (Google Maps)  
**GitHub Stars:** 15,000+  
**Expo Compatibility:** Works with Expo Go for testing, requires dev build for production

**Pros:**
✅ Most popular and stable solution  
✅ Excellent documentation and community support  
✅ Built-in clustering support via `react-native-map-clustering`  
✅ Native performance (uses platform map SDKs)  
✅ Full feature parity with web version capabilities  
✅ Custom markers, polylines, polygons supported  
✅ Animated regions and markers  
✅ No ongoing API costs (uses native maps)

**Cons:**
❌ Requires development build for production (can't use Expo Go in production)  
❌ Android requires Google Maps API key (free tier: 28,000 loads/month)  
❌ No web support (not needed for this project)  
❌ Slightly larger app bundle size

**API Key Requirements:**
- **iOS:** No API key needed (Apple Maps is default, free)
- **Android:** Google Maps API key required (free tier sufficient for most apps)

**Installation:**
```bash
npx expo install react-native-maps
npm install react-native-map-clustering
```

**Configuration in app.json:**
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

---

### Option 2: **expo-maps**
**Status:** ALPHA (v0.12.8)  
**Platforms:** iOS (Apple Maps only) + Android (Google Maps only)  
**Expo Compatibility:** Requires dev build, NOT available in Expo Go

**Pros:**
✅ Official Expo library  
✅ Modern native implementation (SwiftUI + Jetpack Compose)  
✅ Cleaner API design  
✅ Future-proof (will be the standard)

**Cons:**
❌ Currently in ALPHA - breaking changes expected  
❌ Requires iOS 18.0+ minimum (too new)  
❌ Limited community resources and examples  
❌ No Google Maps support on iOS  
❌ Less mature clustering solutions

**Recommendation:** Wait until stable release (beta/v1.0)

---

### Option 3: **@rnmapbox/maps** (Mapbox)
**Status:** Mature, feature-rich  
**Platforms:** iOS + Android  
**Best For:** Advanced customization, 3D maps, offline maps

**Pros:**
✅ Highly customizable styling  
✅ Offline map support  
✅ 3D terrain and buildings  
✅ Vector tiles for better performance

**Cons:**
❌ Requires Mapbox API key  
❌ Cost considerations (free tier: 50,000 loads/month, then $0.50 per 1,000)  
❌ Cannot use with Expo Go  
❌ More complex setup  
❌ Vendor lock-in

**Not recommended** for this use case - overkill for basic map needs.

---

### Option 4: **MapLibre** (Open-source)
**Status:** Stable, cross-platform  
**Platforms:** iOS + Android + Web  
**Best For:** Avoiding vendor lock-in

**Pros:**
✅ Open-source (fork of Mapbox v1)  
✅ Works on native AND web  
✅ No licensing concerns  
✅ Free tile providers available

**Cons:**
❌ Requires platform aliasing configuration in metro.config.js  
❌ More complex setup for native + web  
❌ Smaller community than react-native-maps  
❌ Requires external tile provider (MapTiler, etc.)

**Not recommended** - unnecessary complexity since we don't need web support.

---

## Recommended Solution: react-native-maps

### Why react-native-maps is the Best Choice

1. **Battle-Tested:** 15k+ stars, used by thousands of production apps
2. **Perfect Feature Match:** All features from web version can be replicated
3. **Native Performance:** Uses iOS MapKit and Android Google Maps SDK
4. **No Ongoing Costs:** Free on iOS, free Google Maps tier sufficient for Android
5. **Great Documentation:** Extensive examples and community support
6. **Clustering Support:** `react-native-map-clustering` library integrates seamlessly
7. **Custom Markers:** Full support for SVG icons or Image-based markers

---

## Technical Implementation Plan

### Architecture Overview

```
app/
├── map/
│   └── index.tsx              # Main map screen (Expo Router)
├── components/
│   └── Map/
│       ├── MapView.tsx        # Map container component
│       ├── ActionMarker.tsx   # Custom marker component
│       ├── LocationMarker.tsx # Current location marker
│       ├── MapDatePicker.tsx  # Date picker for historical view
│       └── ActionCluster.tsx  # Cluster marker component
├── hooks/
│   ├── useLocation.ts         # Already exists (use expo-location)
│   └── useMapData.ts          # Fetch and filter actions by date
├── utils/
│   └── mapHelpers.ts          # Color calculation, clustering logic
└── types/
    └── index.ts               # Already exists (Action, ActionType)
```

### Component Breakdown

#### 1. **Main Map Screen** (`app/map/index.tsx`)
- Expo Router screen for /map route
- Wraps MapView component
- Manages map state (center, zoom, selected date)
- Navigation integration

#### 2. **MapView Component** (`components/Map/MapView.tsx`)
- Main map container using react-native-maps
- Renders all markers and polylines
- Handles map gestures (pan, zoom, tap)
- Centers map on user location

#### 3. **ActionMarker Component** (`components/Map/ActionMarker.tsx`)
- Custom marker for each action point
- Props: action, sequentialNumber, dailyGoal, isLatest
- Dynamic color based on progress (blue → green → gold)
- Size variation (latest = 24px, others = 20px)
- Shows callout/popup on tap with action details

#### 4. **LocationMarker Component** (`components/Map/LocationMarker.tsx`)
- Black dot marker for current location
- Semi-transparent, always visible
- Auto-updates when location changes

#### 5. **MapDatePicker Component** (`components/Map/MapDatePicker.tsx`)
- Date selector dropdown/modal
- Shows calendar to pick historical dates
- Filters actions based on selected date
- Default: today's date

#### 6. **useMapData Hook** (`hooks/useMapData.ts`)
```typescript
const useMapData = (selectedDate: Date) => {
  const { getDayActions, dailyGoal } = useActionsContext();
  const [clusters, setClusters] = useState([]);
  const [polylineCoords, setPolylineCoords] = useState([]);
  
  // Filter actions by date
  // Create clusters
  // Generate polyline coordinates
  // Return processed data
}
```

#### 7. **Map Helpers** (`utils/mapHelpers.ts`)
- `getProgressColor(actionIndex, dailyGoal): string`
  - Calculate RGB color based on progress
  - Blue phase (0-33%): #1e64ff → #64afff
  - Green phase (33-66%): #64ff1e → #ffff1e  
  - Gold phase (66-100%): #ffd700
  
- `clusterActions(actions, userLocation, radius): Cluster[]`
  - Group actions within ~50m radius
  - Calculate cluster center
  - Track sequential numbers
  
- `getActionTypeColor(type: ActionType): string`
  - approach: #667eea
  - contact: #f093fb
  - instantDate: #4facfe
  - missedOpportunity: #2d3748

---

## Feature Parity Checklist

Replicating all features from React web version:

### Core Features
- [x] Interactive map with user location
- [x] Custom markers for each action type
- [x] Sequential numbering (1, 2, 3...)
- [x] Progress-based color coding
- [x] Marker clustering for nearby actions
- [x] Polylines connecting action points
- [x] Date picker for historical view
- [x] Popup/callout with action details
- [x] Current location marker (always visible)
- [x] Different marker for missed opportunities
- [x] Marker size scaling (latest = bigger)
- [x] Z-index management (latest on top)

### Advanced Features
- [x] Marker animations (pulse effect for latest)
- [x] Cluster count badges
- [x] Smart clustering (prioritize regular actions over missed opportunities)
- [x] Coordinate display in popups
- [x] Notes display in popups
- [x] Auto-center on user location
- [x] Smooth transitions between dates

---

## Custom Marker Implementation

### react-native-maps Marker Approach

**Option A: Image-based Markers** (Simpler, less flexible)
```tsx
<Marker
  coordinate={coordinate}
  image={require('./assets/marker-blue.png')}
  title="Action #1"
/>
```

**Option B: Custom View Markers** (More flexible, RECOMMENDED)
```tsx
<Marker coordinate={coordinate}>
  <View style={[styles.marker, { backgroundColor: color }]}>
    <Text style={styles.markerText}>{sequentialNumber}</Text>
  </View>
</Marker>
```

**Option C: SVG Markers** (Best quality, scalable)
```tsx
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

<Marker coordinate={coordinate}>
  <Svg height="40" width="40">
    <Circle cx="20" cy="20" r="18" fill={color} stroke="#fff" strokeWidth="3" />
    <SvgText x="20" y="26" fontSize="14" fill="#fff" textAnchor="middle">
      {sequentialNumber}
    </SvgText>
  </Svg>
</Marker>
```

**Recommendation:** Use Option B (Custom View) for initial implementation, migrate to Option C (SVG) if quality issues arise.

---

## Clustering Strategy

### Library: react-native-map-clustering

**Why use a library vs custom implementation?**
- Performance optimized for mobile
- Handles edge cases (zoom levels, map bounds)
- Easy to customize cluster appearance
- Automatic marker aggregation

**Basic Usage:**
```tsx
import MapView from 'react-native-map-clustering';

<MapView
  clusterColor="#8b5cf6"
  clusterTextColor="#fff"
  clusteringEnabled={true}
  radius={50} // meters
>
  {actions.map(action => (
    <Marker key={action.id} coordinate={action.location} />
  ))}
</MapView>
```

**Custom Cluster Rendering:**
```tsx
renderCluster={(cluster) => {
  const { pointCount, coordinate, clusterId } = cluster;
  return (
    <Marker coordinate={coordinate}>
      <View style={styles.clusterMarker}>
        <Text style={styles.clusterText}>{pointCount}</Text>
      </View>
    </Marker>
  );
}}
```

---

## Date Picker Implementation

### Options:

**Option 1: @react-native-community/datetimepicker**
- Native date picker UI
- Platform-specific appearance
- Small bundle size

**Option 2: react-native-calendars**
- Custom calendar view
- More control over styling
- Better for date ranges

**Recommendation:** Use Option 1 for consistency with native OS

**Implementation:**
```tsx
import DateTimePicker from '@react-native-community/datetimepicker';

const [selectedDate, setSelectedDate] = useState(new Date());
const [showPicker, setShowPicker] = useState(false);

<TouchableOpacity onPress={() => setShowPicker(true)}>
  <Text>📅 {selectedDate.toLocaleDateString()}</Text>
</TouchableOpacity>

{showPicker && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display="default"
    onChange={(event, date) => {
      setShowPicker(false);
      if (date) setSelectedDate(date);
    }}
    maximumDate={new Date()}
  />
)}
```

---

## Polyline Implementation

**Connecting action points with lines:**

```tsx
import { Polyline } from 'react-native-maps';

<Polyline
  coordinates={sortedActionCoordinates}
  strokeColor="#8b5cf6"
  strokeWidth={3}
  lineDashPattern={[5, 10]} // Dashed line
  strokeOpacity={0.7}
/>
```

---

## Location Permissions

Already handled by existing `expo-location` in the app:

```typescript
// hooks/useLocation.ts (already exists)
import * as Location from 'expo-location';

const { permissionGranted } = useActionsContext();

// Check if permission is granted before showing map
if (!permissionGranted) {
  return <LocationPermissionScreen />;
}
```

---

## Navigation Integration

### Add Map Tab to Navigation

Update navigation to include Map screen:

```typescript
// app/_layout.tsx or navigation component
<Tabs>
  <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
  <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
  <Tabs.Screen name="map" options={{ title: 'Map' }} />
</Tabs>
```

---

## Performance Considerations

### Optimization Strategies:

1. **Marker Memoization**
   - Use `React.memo()` for ActionMarker component
   - Only re-render when action data changes

2. **Cluster Radius Tuning**
   - Start with 50m radius
   - Increase to 100m if too many individual markers

3. **Limit Visible Actions**
   - Only render actions within map bounds
   - Use `onRegionChangeComplete` to filter

4. **Lazy Loading**
   - Load map component only when user navigates to map tab
   - Use Expo Router's lazy loading

5. **Image Caching**
   - Cache marker images if using image-based markers
   - Use `react-native-fast-image` for better performance

---

## API Key Setup

### Google Maps API Key (Android only)

**1. Get API Key:**
- Go to Google Cloud Console
- Enable "Maps SDK for Android"
- Create API key (restrict to Android apps)

**2. Add to app.json:**
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSy..."
        }
      }
    }
  }
}
```

**3. Secure API Key:**
- Restrict to your app's package name
- Restrict to Maps SDK only (not Directions, Places, etc.)
- Monitor usage in Google Cloud Console

**Cost:** Free tier = 28,000 map loads/month (sufficient for most apps)

---

## Development Workflow

### Phase 1: Basic Map Setup (Day 1)
1. Install react-native-maps
2. Create map screen with basic MapView
3. Show user's current location
4. Add simple markers for today's actions

### Phase 2: Custom Markers (Day 1-2)
1. Implement ActionMarker component
2. Add sequential numbering
3. Implement progress-based colors
4. Add marker size scaling

### Phase 3: Clustering (Day 2)
1. Install react-native-map-clustering
2. Implement cluster markers
3. Test cluster behavior at different zoom levels

### Phase 4: Date Picker (Day 2-3)
1. Add date picker UI
2. Implement date filtering
3. Test historical data display

### Phase 5: Polylines & Polish (Day 3)
1. Add polylines connecting actions
2. Implement marker callouts/popups
3. Add missed opportunity markers
4. Fine-tune animations and transitions

### Phase 6: Testing (Day 3-4)
1. Test on iOS and Android devices
2. Test with various data scenarios (0 actions, 100+ actions)
3. Test location permissions
4. Test date picker edge cases

---

## Testing Strategy

### Test Cases:

1. **No Actions:** Map shows only current location
2. **Single Action:** One marker at action location
3. **Multiple Actions:** All markers with numbers, polyline connecting them
4. **Clustered Actions:** Actions within 50m show as cluster
5. **Historical Date:** Selecting past date shows old actions
6. **No Location Permission:** Show permission request screen
7. **Marker Taps:** Callout/popup shows action details
8. **Zoom Levels:** Clusters expand/contract appropriately
9. **Latest Action:** Biggest marker, pulse animation
10. **Missed Opportunities:** Gray X marker, lower z-index

---

## Migration Path from Web to Native

### Key Differences:

| Web (Leaflet) | Native (react-native-maps) |
|---------------|----------------------------|
| L.divIcon with HTML | Custom View components |
| CSS animations | Animated API |
| react-leaflet TileLayer | Native map tiles |
| Custom clustering algo | react-native-map-clustering |
| react-datepicker | DateTimePicker |
| DOM-based popups | Callout component |

### Code Reuse:
- ✅ Color calculation logic (utils/mapHelpers.ts)
- ✅ Clustering algorithm (can adapt or use library)
- ✅ Action filtering by date (useMapData hook)
- ✅ Context integration (useActionsContext)
- ❌ Marker implementation (need native components)
- ❌ Map container (different API)

---

## Dependencies Summary

### Required Packages:
```json
{
  "react-native-maps": "^1.14.0",
  "react-native-map-clustering": "^3.4.2",
  "@react-native-community/datetimepicker": "^7.6.2"
}
```

### Already Installed:
- expo-location (for geolocation)
- react-native-reanimated (for animations)
- lucide-react-native (for icons)

### Installation Commands:
```bash
npx expo install react-native-maps
npm install react-native-map-clustering
npx expo install @react-native-community/datetimepicker
```

---

## Risks & Mitigations

### Risk 1: Development Build Required
**Impact:** Cannot test with Expo Go in production  
**Mitigation:** Use Expo Go for development, create dev build for final testing  
**Command:** `eas build --profile development --platform android`

### Risk 2: Google Maps API Costs
**Impact:** Potential charges if app becomes very popular  
**Mitigation:** 
- Monitor usage in Google Cloud Console
- Set up billing alerts at $10, $50, $100
- Free tier (28k loads/month) should cover most use cases

### Risk 3: Marker Performance with 100+ Actions
**Impact:** Lag when rendering many markers  
**Mitigation:**
- Use clustering (reduces visible markers)
- Limit to 100 most recent actions per day
- Implement viewport-based filtering

### Risk 4: Clustering Library Customization
**Impact:** May need custom behavior not supported by library  
**Mitigation:**
- Fork react-native-map-clustering if needed
- Or implement custom clustering (more work)

---

## Alternatives Considered

### Alternative 1: Static Map Image (Google Static Maps API)
**Pros:** Simpler, no native maps needed  
**Cons:** Not interactive, poor UX, API costs  
**Verdict:** ❌ Not suitable - need interactivity

### Alternative 2: Mapbox Web View
**Pros:** Reuse web code, cross-platform  
**Cons:** Performance issues, not native feel  
**Verdict:** ❌ Not recommended - poor performance

### Alternative 3: Wait for expo-maps Stable
**Pros:** Official Expo solution, modern API  
**Cons:** Still in alpha, timeline unknown  
**Verdict:** ❌ Too risky - use react-native-maps now

---

## Conclusion

**Recommended Approach:** react-native-maps + react-native-map-clustering

**Estimated Development Time:** 3-4 days

**Complexity Level:** Medium (custom markers and clustering add complexity)

**User Impact:** High (map view is a core feature for visualizing progress)

**Technical Debt:** Low (react-native-maps is mature and well-maintained)

---

## Next Steps

1. **Install Dependencies:**
   ```bash
   cd Expo_Cursor_DatingQuest
   npx expo install react-native-maps
   npm install react-native-map-clustering
   npx expo install @react-native-community/datetimepicker
   ```

2. **Get Google Maps API Key** (Android):
   - Visit: https://console.cloud.google.com/
   - Enable Maps SDK for Android
   - Create API key

3. **Configure app.json:**
   - Add Google Maps API key for Android

4. **Create Map Screen Structure:**
   - Create `app/map/index.tsx`
   - Create `components/Map/` directory
   - Create `hooks/useMapData.ts`
   - Create `utils/mapHelpers.ts`

5. **Implement Phase by Phase:**
   - Follow the development workflow outlined above

---

## Questions for User

Before implementation, clarify:

1. **Priority:** Is map view needed for MVP, or can it wait?
2. **Google Maps API:** Willing to set up Google Cloud account for Android?
3. **iOS Testing:** Have access to iOS device for testing?
4. **Timeline:** How urgent is this feature?
5. **Scope:** Any features to skip or add beyond web version?

---

**Document prepared by:** AI Assistant  
**Last updated:** October 5, 2025  
**Status:** Ready for review and implementation
