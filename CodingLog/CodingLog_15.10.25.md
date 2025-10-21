# [Tasks]

## <Improvement_V1.1>
[] Backend Supabase / Auth
[] Friendship

## <Realse_V1.0>
[] Add `Payment`
[?] Daily task
[] Add popups, explanations, suggestions
[] Add `Levels/XP`

## <MVP_V0.5>
[] Add `Contacts`
[] Add `Calendar`
[] Add `TopBar`
[] Add `BottomBar`
[] Add `Map`
[] Add `Dashboard`

--- --- ---

## <TopBar>
## <BottomBar>
## <Contacts>
## <Map> 
## <Dashboard>
## <Calendar>

--- --- ---

## <Dashboard>
[] Fix the counter animations

--- --- ---

# [Commits]

## `21.10.25.Tue`

## <Map>
* Markers display fix (still flickering)

## <Map>
* Added the trail logic

## <Dashboard>
* Ui fixes

## <Calendar>
* Add simple calendar to topbar

## <Dashboard>
* Change the missedOp and InstantDate icons (heart...)

## <Map>
* Added the map text color const
* Smooth Dash -> Map transition fix attempt

## `20.10.25.Mon`

## <Map>
* Fixed and optimized the markers logic

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

## `21.10.25.Tue`

[x] ## <Map> | Trail
* Let's display trail. A line which connects action markers on the map in chronological order. Move the line color to constant (make it green), make it look nice and thick, z-index hirarchy should be belove markers

[x] ## <Calendar> | Change action icons
* Ok, now a big one
* I want to be able to set an app-wide variable `selectedDate`. Should be stored in state. It will affect all our other pages. For example `Dashboard` now will access the current `selectedDate` prop from our state beofre displaying anything an use it to get the actions for the date. Same with the `Map`.
* Date selection logic: To our `TopBar` we will add a simple date selection component, so it will be possible to change the app's `selectedDate` from any page. Make it look nice, and align with other already exisitng UI elements on the topbar well. Default `selectedDate` should be always today ;), store it only in state.
* There should not be a possibility to change the past or future :) If we choose any date except for today, the action buttons on dashboard should be blocked (make it look nice)

[x] Dashboard & Map | Change action icons
* For `missedOps` I want an icon from current `InstantDates` (clock)
* For `InstantDates` I want an icon of a heart.
* Apply both to dashboard and map, not color changes required
* Make sure in both places the icon come from one configurable source, so if I would wanna later change the icon it would be one action that applies it app-wide

## `20.10.25.Mon`

[x] MAP | Dev build
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