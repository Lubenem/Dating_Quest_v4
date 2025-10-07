🎮 Dating Quest – Game Design Document

## ✨ Essence of the Game
Dating Quest is not just a tracker — it’s an RPG-style adventure designed to gamify the challenging yet rewarding experience of approaching women in real life. The goal is not the outcome of each interaction, but the courage, consistency, and growth of the player. Every outing is a mission, every interaction is an XP opportunity, and every milestone is an achievement. This game transforms fear into play, hesitation into progress, and rejection into experience points. The soul of Dating Quest is about fun, self-improvement, and adventure.

## Tech Stack
`Expo` (react-native)

## Pages and UI Componenets
# Progress Topbar
# Navigation Footbar
 * Contains all of the pages names in the order listed here.
 * The page transition should be an animation (horizontal movement, like swipe)
\
# Dashboard (Main Page)
 * Has 4 main suqare blocks counters that take most of the space of the main screen.
  - `Approaches` (purple)
  - `Missed Opportunities` (black)
  - `Contacts` (blue)
  - `Instant Dates` (pink)
 * The counters data is stored per day. Each new day, the counters go to 0.
# Calendar
 * Contains a calendar view, where the counters data is presented for each day.
# Map
# Contacts 
# Settings | 🔒 leave out for MVP

## Data Storage
* MVP
 - We store everything locally
* Finished Product | 🔒 leave out for MVP
 - Connect `supabase` or `firebase`
 - Auth logic

## Additinoal Features | 🔒 leave out for MVP
* 🔥 Streak logic (calendar)
* 🏹 Daily Quests
* 🎲 Randomizer Pool (AI suggested pickup lines?)
* 🥇 XP System, Levels, Achievements (?)