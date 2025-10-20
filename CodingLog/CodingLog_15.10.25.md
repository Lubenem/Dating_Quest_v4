# [Tasks]

## <Improvement_V1.1>
[] Backend Supabase / Auth
[] Friendship

## <Realse_V1.0>
[] Add `Payment`
[?] Daily task
[] Add popups, explanations, suggestions
[] Add `Levels/XP`

--- --- ---

## <MVP_V0.5>
[] Add `Contacts`
[] Add `Calendar`
[] Add `TopProgressBar`
[] Add `BottomNavBar`
[] Add `Map`
[] Add `Dashboard`

## <Calendar>
## <Contacts>

## <Map>
[x] Add react-map (empty with just current location)
[] Adjust the style (dark and fancy)
[] Add the markers logic (from React app)

## <TopProgressBar>
## <BottomNavBar>

## <Dashboard>
[] Fix the counter animations
[] Change teh missedOp and InstantDate icons (heart...)

# [Commits]

## `20.10.25.Mon`

## <Map>
* Add the markers logic (from React app)

## <Dashboard>
* Counters UI improvement

## <BottomNavBar>
* EdgeToEdge = false

## <BottomNavBar>
* Removed padding

## <TopProgressBar>
## <BottomNavBar>
## <Dashboard>
## <Map>
* Aded the accent color constant (yellow)
* Added the map

## `15.10.25.Wed`

## <Map>
* Added topbar and bottmbar as separate files

# [Prompts]

## <Map>

[] MAP | Dev build
When dev build, I only sit at one place and it is difficult for me to test the map markers. Implement the logic of instead of saving the real coordinates each time the action is done, we save randomly generated mocked coordinates in radius of 1 km from my real position. The radius should be a configurable variable. There should be a `MapTestMode` it is only active by default for the dev build, but if I want I can mannualy set it of even for my dev build, to test a couple of makrers at one location

[x] MAP | Display order
Add display order logic, when more then one marker at one place. They should be displayed with this z-index (priority):
- InstantDates
- Contacts
- Approaches
- MissedOpps

[x] MAP | Add a simple markers logic
* Check the context to understand how the markers logic worked earlier
* Each time a new action is created make sure an appropirate marker is added to the map (check the last expo app, the markers visual was good)
* Overlap. If more then one markers are very close or at one point, make sure it is expected and doesn't make the app start fricking out, it's fine.

[x] Add a simple map
* Create a simple react-native-map on the map page, which is empty right now
* The map should be focused at my current location with scale like 1000 meters (I should be able to configure this variable)
* There should be not re-loading each time I switch to map page, it should be loaded and focuesd on me just once, and then stay active like that even if it is not visible, let's not care much about the resources, the UX matters much more.
* Dark theme
