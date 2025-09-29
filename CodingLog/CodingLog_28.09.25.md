# Tasks

[t] Move to React
[] Map action dots
[] ...

# Commits

## `29.09.25.Mon`

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

## `29.09.25.Mon`


[] Map improvement
* Remove `.page.padding: 20px;` for map, will look better
* Remove +/- button on map, not needed
* Make sure all other icons on the map locations are either romved or made less bright, cause our focus should be on our points that we add to the map 

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