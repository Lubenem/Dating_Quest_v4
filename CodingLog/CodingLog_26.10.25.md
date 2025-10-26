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


## <Field1Fixes>
[x] GPPs coordinates are not saving correctly, I need to reaload the app each time to update the position
 * Every time we update the action the coordinates should be actual current coordinates (not saved from past)
 * Or maybe every each seconds?
 * There was one time I've pressed an action but the map was not yet loaded (with coordinates), so the action was added, but not displayed on the map. I guess it was added with no location at all. It's bad
\
[x] Build configuration issues
 * Dark theme for system ui parts top and bottom. The preview build has the white system top and bottom bars, I want them to be dark for all builds
 * Dev client build and Preview build should be different apps, and I should be able to have them separately at the same time at the same phone. Currently one updates the other
 * Add nice icons to differentiate the dev build and preview build. e. g.:
  - Dev build: Red heart
  - Preview build: Blue heart
\
[x] Map Markers Issue
* When a lot of markers in close radius of let's say 5m (should be configurable const) we need to combine them, display only one marker (according to the hirarcy), when pressed there should be a popup/text block (kiss) which lists everything that happend here.
* When I press on any marker I shouldn't see the google maps default icons for building the direction in google maps, remove this
* Sometimes when markers are close, and I zoom out, they overlap. That's ok I think, but I want them to overlap in the actions hierarchical order. Is it a difficult task or a quick fix? If easy let's do it, if it's a hack let's skip
\
[?] Datepicker ui is not the best, make it wider.
[?] Flickering still persistce when change date on map
[?] Map | Page transition problem
[?] Map | Cluster popup and badge issue

# [Commits]

## `26.10.25.Sun`

## <Field2Fixes>
* Map | Improved map clusters logic

