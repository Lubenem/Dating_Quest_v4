# Tasks

# V1.0
[] Backend Supabase / Auth
[] Friendship
[] ...

# Mvp
[t] Add Map History Path and Progress Bar (desire to grind)
\
[] Add `Contacts` Page
[x] Move to React
[x] Map action dots

# Commits

## `30.09.25.Tue`

React_Cursor_DatingQuest
* Calendar Improvement

React_Cursor_DatingQuest
* Map | Date Selection Improvement

## `29.09.25.Mon`

React_Cursor_DatingQuest
* Add Map History Path and Progress Bar (desire to grind)

React_Cursor_DatingQuest
* Map fix

React_Cursor_DatingQuest
* UI Improvements

React_Cursor_DatingQuest
* Map improvement

React_Cursor_DatingQuest
* Data storage refactoring

React_Cursor_DatingQuest
* Scrolls

React_Cursor_DatingQuest
* UI improvements

React_Cursor_DatingQuest
* Fix Routing

## `28.09.25.Sun`

React_Cursor_DatingQuest
* Fix white screen bug

React_Cursor_DatingQuest
* Move to React

HTML_Cursor_DatingQuest 
* Improve look / theme (dark, purple)

HTML_Cursor_DatingQuest 
* Map page

Dating_Quest_Html
* Github pages installation fix

Dating_Quest_Html
* Calendar fix

# Prompts

## `30.09.25.Tue`

[t] Calendar Improvement
* Calendar | Remove top text "Progress Calendar" its a redundant UI component that takes too much vertical space. Leave only text for current month and year, but it should be on the same vertical level as the "Prev/Next" buttons. Shift the calendar up. To use the space optimally.
* Calendar | We should visually distinguishe between 3 day types: 'actionDay', 'toDay', 'selectedDay'. On day can have all 3 types at the same time.
* 'actionDay' - each day when at least on action was made should be marked somehow visually, to give the user a feeling of accomplishment and a desire no to break the streak.
* 'today' - is today, changes each day. User should always understand clearly which day cell represents today.
* 'selected' - the day for which we see the stats at the bottom, we analyze it currently, by default it's always 'today'
* Make the calendar look more professional and nativeApp-like


[t] Map | Date Selection Improvement
* Map | Remove the Top UI block with date selection. Takes too much space. Only leave the Date Selection Button, with no wrappers at the to right corner. Today's current date should be correctly displayed on the date selection button by default.
* Map | Date Selection Button | Make sure the date selection button works correctly. I fI select a certain date, it should be displayed on the button and only action points from this date are shown on the map

## `29.09.25.Mon`

[x] Add Map History Path and Progress Bar (desire to grind)
* Map | there should be a selection of a date on top of the map. We show points only for a certain date (for now)
* Dashboard | each other action then `approach` is also `approach`, it's like a derivative, so when we count them, the `approach` counter is automatically inremented also. 
* Map | each action point will have a number inside in order in which they were created (starting with 1), also the points should be connected with the arrows pointing in direction of users path, to show us our progress and make us more engaged, satisfied and locked in.
* Map | If more than one action point at the same place, only count `approaches` and display only one heighest number
\
* Storage | User should have a variable stored `approachesDayGoal`, it will be changing in the future depedning on his level. By default it's `30`.
* Map | Color Gradients and Effects: As we go closer to the `approachesDayGoal`, for dots on map use a gradient that changes as the user completes more actions. For instance, the first action could be a light color, and as they progress, the color could become more vibrant, like a shift from blue to green to gold (`approachesDayGoal`).
\
* Top Progress Bar | Progress Bar: Add a progress bar as the top component which is visible throughout the whole app, just like the bottom nav bar. It fills up as the users completes his `approachesDayGoal`, the progress bar should look cool, engaging and have the same progress color gradiant as the dots on the map.
\
* Add cool temp app icon. Maybe download it from some fancy site or smth, can be a `heart` icon or smth like that

[x] Map fix
* Make sure the action points are on the heigher layer then my current position
* Make sure that if I decrement one counter, it removes exactly one last action of this type, and map will still show the rest
* Make sure if I have only one action on dashobard and imidiatly switch to map, I should see it, without any reloading of the app or page or anything like that

[x] UI Improvements
* Dashboard | remove the annoying geolocation message, we should only see it if the geo data was refused by the system
* Dashboard | Counters look good but their are not vertiaclly centered on my screen, they are a bit lower, not good
* Dasboard | Counters | Make the minus sign backround not transparent, I want to clearly see those buttons
*  Dasboard | Counters | Increment animations are behaving weirdly, please rework, make it look professional
* Dashboard | Enhance the page, make it look more professional and solid (for example, let's chagne the page's background from current boring color, to some cool gradiant)
\
* Nice, also: use the same cool gradiant background for all other app pages, it alos should go even under the navbar, the navebar block can be semitranspartent dark bock on top of the cool graint app background
* Dashboard | add fancy icons to each of counter (top left corner)
* Calendar | Bottom UI Details Block | Make more professional lookin, align everying. User fancy icons for each counter instead of text. 
* Calendar | Top ui and text `Progress Calendar` and `September...` look stacked in one place
\
* Whenever I am opening the map component, the map should always fetch again the storage for actions, to make sure we have the latest updated on the map. Sometime I needed to reopen the app to see them
* Make the calendar day cells with black background, instead of current gray or smth, cause it blends in with the page gradiant background   

[x] Map improvement
* Remove `.page.padding: 20px;` for map, will look better
* Remove +/- button on map, not needed
* Make sure all other icons on the map locations are either romved or made less bright, cause our focus should be on our points that we add to the map
* When map page starting, load from locall storage all user actions. Use their `geoposition` to place a dot of an appropriate color (action color), when taped, give details on action
* My current position should be either a black dot or some neat icon
\
* Good! but: When I press the point, it shows html tags, fix please (can be jsut text if no other option works)
* What if we have a bunch of points a the same location? It's difficult to find out what are the actions, and select a specific one, cause they are overlapping each otehr. Let's brain storm a solution. 

[x] Data storage refactoring
* Explain to me, the current data storage logic.
Where do we do it, how the data structures look. I might wanna extend this logic and also store some additiional logic for each action log (like coordinates)
* Let's use the `ActionLog` approach instead of our current apporach. It will be better cause our app in the future will have aditional new action types. I need all of the actions be structed the same. The `ActionLog`, or maybe just `Action` for simplicity, should have action type, curent datetime, current geoposition, and other necessary details about the action.
* The calendar and dashboard pages now will fetch our local storage system for appropriate actions by `datetime` and `type` to present the info on the screen
* On load our app should always check if we have the geo permissions, if not always aks for it. We need them for our actions storage

[] Scrolls
* I am using Samsung Galaxy A32, and I have scrolls on dashboard and calendar.
* The scrolls doesn't look profesional. We should keep in mind that we are doing a mobile phone app
* What can be a solution here? I want my page height to be always adjusted to the screen height

[] UI improvements
* GOOD!, next:
* Dashbord | Counter blocks | Good, but, ake their parent block have a fixed hight, so they are not moving appart when screen is longer
* Dashbord | Counter blocks | Remove the mouse hover animations. We don't need them in mobile
* Dashbord | Counter blocks | The minus buttons, make them darker, so they don't blend in
* Calendar | Bottom details block | Make the conuters blocks use the same colors like in dashboard

[] Dashboard | UI improvements
Center the counter blocks vertically and make them bigger.
* I want each of the counter have it's unique color, it should be like a natural gradiant
* Make the page look more professional and solid
* The minus buttons should be more suared and bigger, it's hard to touch
* Animattions| there should be two diff animations, one for increment, and one for decrememt, after the animation is done, the block should go to the initial state

[x] Calendar | UI improvements
* Don't display any data inside the date cell, doesn't look good, also we already have the counters data on the bottom of the screen
* Current date should just have interesting special border, the color of the cell should be the same as others, though the currently selected date can have color change

[t] Fix Routing
`https://lubenem.github.io/Dating_Quest_v4/React_Cursor_DatingQuest/Build/`
* This url should always prepend any of other page or component, weather it's `calendar` or `dashboard`.
Currently when I click on the calendar the url becomes `lubenem.github.io/calendar` and I get an 404 error when I reoload.
* Also make sure `dashboard` is always the dauflt page

## `28.09.25.Sun`

[x] Move to React
Let's move to React to leverage the ready to use components, solutions and features instead of reainwenting the wheel. Let's not touch our `HTML_Cursor_DatingQuest` folder, instead let's duplicate it into a new project folder alongside, we will call it `React_Cursor_DatingQuest`. Review the old code and reabuild eveyrhing we have so far in react using best practises for react

[x] UI improvements
* Calendar | Any 1 date should be always select and the bottom details component should be always present
* Calendar | Bottom details component | no `x` button, so it is not closing, the text inside counter blocks should be white, cause currently it's difficult to see (gray)
* Map | remove all the ui exept for map (location found block, my location button etc)
* Dashboard | remove `reset today`, instead each counter shoud a nice little `-` button on the top right corenr, that will decrement the counter by 1 (needed for a case if a mistake was made)

[x] Improve look / theme (dark, purple)
Let's chagne our ui look and theme. Mainly lets focus on changing colors.
Please look into `dashboard.png` the image of an old app. We should look and feel similar.
* The theme should be dark always
* The colroing should be `gradiant purple + pink` like on png (only text can be white)
* The navbar and the app in general should avoid using emojies which look cheap, we should use preloaded icons from some fancy server created for this purpose (use common practise)
* remove the underlying UI under map, cause we can see it sometimes when the map is loading, and it is not needed

[x] Map page
Added a third page - `Map`. Should be also available on the navbar
Integrate google maps (or some alterantive if easier and free), the map should show my current location as a dot

[x] Github pages installation fix
I am using github pages to test the app on my phone, there is a possibility to install the app, when I open it, but it doesn't work properly since our index.html is located not in the root folder `Dating_Quest` but in the sub folder `HTML_Cursor_DatingQuest`. Is there a ways of fixing this without moving html project to a root folder? Maybe we can add an index.html to a root folder that will redirect us correctly to our subfolder??

[x] Calendar and highlight fixes 
* when I touch on phone, it selects objects, not cool
* nav bar is dissapearing if I am clicking on different dates on calendar
* when I am on the calendar, I want to see data for one currently selected day at the bottom of the screen, neatly looking, not inside the date square
* I have move the proj folder to Dating_Quest, please proceed there