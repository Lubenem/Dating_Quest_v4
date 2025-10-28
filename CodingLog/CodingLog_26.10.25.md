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
--- --- ---

## <Popups>
## <Levels>
---
## <TopBar>
## <BottomBar>
## <Contacts>
## <Map> 
## <Dashboard>
## <Calendar>
---

## <Calendar>
[] Let's improve the Calendar :)
* The text color should be always white, no opacity (accept for when the color is of `accent`, but we don't have this in calendar)
* When we select a date, the cell's row height changes, cells size shoud be fixed, no matter weather it is selected and has border or not.
\
* Below the calendar we will do smth interesting :)
Remove the legend. Instead we will have two block, aligned horizontally. Take all posible space
 - `Selected` | Current Date's info. This tab is selected by default
 - `Total` | Shows total info
 - Inside  each block we just list vertically each actions icon and number after
 Should look, simple neat and nice


# [Commits]

## `28.10.25.Tue`

## <Calendar>
* Calendar v0.8

## `27.10.25.Mon`

## <Calendar>
[x] Let's add a Calendar page finaly :)

## <Calendar>
* Added clendar view app from figma AI (based on pcicture from old flutter app)

## <Popups>
[x] Let's unify our popup logic and styling!

## <TopBar>
* DatePicker | made wider

## <Levels>
* Added simple level system

## `26.10.25.Sun`

## <Field2Fixes>
* Introduced two app modes `BasicMode` and `FullscaleMode`

## <Field2Fixes>
* Map | Improved map clusters logic

# [Prompts]

## `27.10.25.Mon`

## <Calendar>
[x] Let's add a Calendar page finaly :)
* Should look nice and transparent look here for reference [FigamCalendarApp](OldVersions\FigmaCalendarView\src\components\CalendarComponent.tsx), but remember to KISS. Step by step. I've used FIGMA AI to generate that page.
* Add Streak logic with fire emojis (if that day the approaches goal for that day was satisfied)
* The calendar should simply show different days, and show us how we did that particular day, we should be able to select a day and check data for the day (actions)
\
* BottomBar | I've changed the order of item in navbar, make sure no matter what first page that is selected right after app init is always `Dashboard`, currently `Calendar`
* Calendar | let's simplify the markers on the date, remove the dots logic, instead just mark only the days where the goal was reached with fire icon or smth cool like that. I think it should be a simple logic: Each time we init an app when we calculate level we should also store the day goal for current day, and then when we open calend for each displayed day we just compare `selctedCalendarDate.Approaches` and `selctedCalendarDate.ApproachesGoal`, if `approaches` is greater then goal was completed for that day, and we show fire. Adjust the current `streak calc` logic, and `level up/down calc` logic to also use this new approach.
* Calendar | for testing purposes, in our consts configs let's add the `goalShenanigans` bool, which will do a next thing, everywhere in the system where we are trying to fetch the `ApproachesGoal` for a certain date in the past, it will replace it with `-1`, so we pretend like we always reached our goal even with 0 approaches, and the calendar should be on fire :)
Remember KISS, DRY, Best Practices and Optimization!

## <Popups>
[x] Let's unify our popup logic and styling!
* I like how you've currently implement the popup on the dashboard, as a separate component/file, as it should be. Only thing there I want you to add the `x` button on the top right corner (like on the map cluster popup), to be able to close the poupup like that
* MapClusterPopup, should be rewriten and use the same code for popup we use for `LevelPopup`(on dashboard), use same styling, and logic. The scroll should be inside popup, if content is too big. If we will not manage to handle scrolling, we will search the web for best practices libs for poupups on expo/reactnative and implement it

## <Levels>
[x] Level system:
 - we start from 1st level, if you are not doing a base of 1 appraoches for 3 days in a row => you go to 0 level (approaches goal: 1)
 - 3 times 10 approaches a day in a row => go to 2nd level, approaches goal: 15
 - 3 times 15 approaches a day in a row => go to 3rd level, approaches goal: 20
 - 3 times 20 approaches a day in a row => go to 4th level, approaches goal: 25
 - 3 times 25 approaches a day in a row => go to 5th level, approaches goal: 30
* If you do less approaches then level's base (e.g. 1 level base is 1, 2 level base is 10) for 3 days in a row you lose one level. This way if you stop playing game, every 3 days you loose level
* The approaches daily goal for each level should be configurable (const)
* Remove the `App.defaultDailyGoal: 15,` from consts, not needed anymore, instead give me the ability to set `currentLevel` set to null by default (meaning defined by the system and users progress), but if not null, use the level from consts (for testing)
* Display the current level nicely on the top bar, add the fire icon if there is a more than 2 last consequent days of achiveing the day goal, if more then last 3 consequent days, add 3 fire icons

## <Field2Fixes>
[x] Let's introduce two app modes `BasicMode` and `FullscaleMode`
* `FullScaleMode` contains everything we have right now.
* `BasicMode` only includes Dashboard page, Bottom Bar with one nav item, and topbar with progress,
no map, no geolocation traking, just counters, the locations can be saved as null or smth like that, and it will be fine.
* When the user opens the app first time we ask for the geo locations right, 
 - if given => `FullscaleMode`
 - if refused => `BasicMode`
* When asked for geo once, remember the answer and don't ask again, till the app is reinstalled
* In the future `FullscaleMode` will require payed subscription (don't worry about that right now)
[x] Move The daily approaches goal variable to consts, so I could configure it, and set 15 instead of 10

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

