# Tasks

[t] Move to React
[] Map action dots
[] ...

# Commits

React_Cursor_DatingQuest
* Fix Routing

## `28.09.25`

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

[t] Fix Routing
`https://lubenem.github.io/Dating_Quest_v4/React_Cursor_DatingQuest/Build/`
* This url should always prepend any of other page or component, weather it's `calendar` or `dashboard`.
Currently when I click on the calendar the url becomes `lubenem.github.io/calendar` and I get an 404 error when I reoload.
* Also make sure `dashboard` is always the dauflt page

## `28.09.25`

[x] Move to React
Let's move to React to leverage the ready to use components, solutions and features instead of reainwenting the wheel. Let's not touch our `HTML_Cursor_DatingQuest` folder, instead let's duplicate it into a new project folder alongside, we will call it `React_Cursor_DatingQuest`. Review the old code and reabuild eveyrhing we have so far in react using best practises for react

[-] UI improvements
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