/**
 * Type Definitions for Dating Quest
 * 
 * This file contains all TypeScript types and interfaces used throughout the app.
 * Think of this as the "blueprint" that defines what data looks like in our app.
 */

/**
 * ActionType - The 4 types of actions you can track
 * 
 * - approach: When you approach someone
 * - contact: When you get their contact (number, social media, etc.)
 * - instantDate: When you go on an impromptu date
 * - missedOpportunity: When you see someone attractive but don't approach
 */
export type ActionType = 'approach' | 'contact' | 'instantDate' | 'missedOpportunity';

/**
 * LocationData - GPS coordinates for where an action happened
 * 
 * @property latitude - North/South position (-90 to 90)
 * @property longitude - East/West position (-180 to 180)
 * @property accuracy - How accurate the GPS reading is (in meters)
 * 
 * Example:
 * {
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 10
 * }
 */
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Action - A single tracked action with all its metadata
 * 
 * This is the core data structure! Every time you tap a counter button,
 * we create one of these Action objects and save it.
 * 
 * @property id - Unique identifier (generated automatically)
 * @property type - What kind of action (approach, contact, etc.)
 * @property timestamp - When the action happened (ISO 8601 format)
 * @property location - Where the action happened (GPS coordinates)
 * @property notes - Optional notes you can add
 * @property tags - Optional tags for categorization (future feature)
 * 
 * Example:
 * {
 *   id: "lm3k9js",
 *   type: "approach",
 *   timestamp: "2025-10-10T14:30:00.000Z",
 *   location: {
 *     latitude: 40.7128,
 *     longitude: -74.0060
 *   },
 *   notes: "Coffee shop on 5th Ave"
 * }
 */
export interface Action {
  id: string;
  type: ActionType;
  timestamp: string;
  location: LocationData;
  notes?: string;
  tags?: string[];
}

/**
 * DayData - All actions for a specific day, grouped together
 * 
 * This helps us organize actions by date. Useful for the calendar view!
 * 
 * @property date - The day (e.g., "Fri Oct 10 2025")
 * @property actions - Array of all actions that happened on this day
 */
export interface DayData {
  date: string;
  actions: Action[];
}

/**
 * Counters - The current count for each action type
 * 
 * This is what you see on the dashboard! It's a simple summary
 * of how many of each action type you've done today.
 * 
 * @property approaches - Total approaches today
 * @property contacts - Total contacts received today
 * @property instantDates - Total instant dates today
 * @property missedOpportunities - Total missed opportunities today
 * 
 * Example:
 * {
 *   approaches: 5,
 *   contacts: 2,
 *   instantDates: 1,
 *   missedOpportunities: 3
 * }
 */
export interface Counters {
  approaches: number;
  contacts: number;
  instantDates: number;
  missedOpportunities: number;
}


