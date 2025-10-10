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
## <TopProgressBar>
## <BottomNavBar>

## <Map>
[] Add and test expo maps (empty with just current location)
[] Add the markers logic (from React app)
[] Adjust the style (dark and fancy)

# [Commits]

## `10.10.25.Fri`

<Map>
* Added static background gradient

<Map>
* `Action` type refactor

<Map>
* Files/Folders/Naming restructure

<Map>
* Started over with `material-top-bar-tabs` template (react-navigation)

## `09.10.25.Thu`

<Map>
* Start over investigation. Expo Tab Templates

<Map>
* Added `constants.ts`
* Fixed the web

<Map>
* Moved to `react-navigation` for page transition horizontal animation
* Still need to fix the flickering when go back to `Dashboard`

<Map>
* Look and feel fix

## `08.10.25.Wed`

<Map>
* Added 3 different maps to test

<Map>
* restructured the project

# [Prompts]

## `10.10.25.Fri`

<> State Management Doc Questions:
I've read the @Documents\AI_Docs\Learning_Expo\Actions_State_Tutorial.md, and I have questions. Don't perceive it as I am telling you, that you are wrong. Please perceive it rather as I am a young padawan asking for the enlightenment from you, a wise jedi master.
\
1. types/index.ts/Action
Why do we have `timestamp` and `date` and `location.timestamp`, cant' we jsut use Action.timestamp?

{
  id: "lm3k9js",
  type: "approach",
  timestamp: "2025-10-10T14:30:00.000Z",
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    timestamp: "2025-10-10T14:30:00.000Z"
  },
  notes: "Coffee shop on 5th Ave",
  date: "Fri Oct 10 2025"
}
\
2. Why do we have Actions and Counters, As I understand we updated both of this data lists when we do one action. How axactly does it help us save resources? Do we only subscribe to the `counters` state in our UI components and pages, or some of them relly also on actions?