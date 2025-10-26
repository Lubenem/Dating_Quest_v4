/**
 * Actions Context - Global State Manager for User Actions
 * 
 * This is the BRAIN of the app! It manages all user actions and provides them
 * to any component that needs them.
 * 
 * Think of it like a central database that:
 * 1. Stores all actions (approaches, contacts, etc.)
 * 2. Calculates daily counters
 * 3. Saves data to phone storage (persists across app restarts)
 * 4. Provides functions to add/remove actions
 * 5. Tracks GPS location for each action
 * 
 * Any component can access this data by using the useActionsContext() hook!
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Action, ActionType, Counters } from '../types';
import { useLocation } from '../hooks/useLocation';
import { Map as MapConstants, App as AppConstants } from '../constants';

/**
 * ActionsContextType - Defines what the context provides
 * 
 * This is the "contract" that says what data and functions
 * are available to components that use this context.
 */
interface ActionsContextType {
  // STATE - Current data
  actions: Action[];                                    // All actions ever recorded
  counters: Counters;                                   // Today's counters (for selected date)
  dailyGoal: number;                                    // User's daily approach goal
  isLoading: boolean;                                   // Is data loading from storage?
  selectedDate: Date;                                   // Currently selected date for viewing
  isToday: boolean;                                     // Is selected date today?
  appMode: 'basic' | 'fullscale';                       // App mode: basic or fullscale
  setAppMode: (mode: 'basic' | 'fullscale') => void;   // Set app mode
  
  // ACTIONS - Functions to modify state
  addAction: (type: ActionType, notes?: string) => Promise<Action | null>;
  removeLastAction: (type: ActionType) => boolean;
  getDayActions: (date: string) => Action[];
  getDayCounters: (date: string) => Counters;
  getTodayCounters: () => Counters;
  setDailyGoal: (goal: number) => void;
  setSelectedDate: (date: Date) => void;               // Set the selected date
  
  // GEOLOCATION - Location tracking
  permissionGranted: boolean;                           // Does user allow location?
  geoError: string | null;                              // Any location errors?
  userLocation: { latitude: number; longitude: number } | null; // Current GPS position
}

/**
 * Create the context with undefined as default
 * We'll provide the actual value in the Provider below
 */
const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

/**
 * useActionsContext - Hook to access the actions context
 * 
 * This is how components get access to the context!
 * 
 * Usage in any component:
 * ```typescript
 * const { actions, addAction, counters } = useActionsContext();
 * ```
 * 
 * @throws Error if used outside of ActionsProvider
 */
export const useActionsContext = () => {
  const context = useContext(ActionsContext);
  if (context === undefined) {
    throw new Error('useActionsContext must be used within an ActionsProvider');
  }
  return context;
};

/**
 * ActionsProvider Props
 */
interface ActionsProviderProps {
  children: ReactNode; // The app components that will have access to this context
}

/**
 * ActionsProvider - The component that provides actions data to the app
 * 
 * Wrap your entire app (or part of it) with this provider to give
 * all child components access to actions data!
 * 
 * Example:
 * ```typescript
 * <ActionsProvider>
 *   <App />
 * </ActionsProvider>
 * ```
 */
export const ActionsProvider: React.FC<ActionsProviderProps> = ({ children }) => {
  // Use the location hook to track GPS
  const { location, permissionGranted, error: geoError, getCurrentLocation } = useLocation();
  
  // STATE - All our app's data lives here
  const [actions, setActions] = useState<Action[]>([]);
  const [counters, setCounters] = useState<Counters>({
    approaches: 0,
    contacts: 0,
    instantDates: 0,
    missedOpportunities: 0,
  });
  const [dailyGoal, setDailyGoalState] = useState<number>(AppConstants.defaultDailyGoal);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [selectedDate, setSelectedDateState] = useState<Date>(new Date());
  const [isToday, setIsToday] = useState<boolean>(true);
  const [appMode, setAppModeState] = useState<'basic' | 'fullscale'>('fullscale');

  /**
   * Generate a unique ID for actions
   * Uses timestamp + random string for uniqueness
   * 
   * @returns {string} A unique ID like "lm3k9js"
   */
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const generateRandomCoordinates = (
    centerLat: number,
    centerLng: number,
    radiusMeters: number
  ): { latitude: number; longitude: number } => {
    const radiusInDegrees = radiusMeters / 111000;
    
    const u = Math.random();
    const v = Math.random();
    const w = radiusInDegrees * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    
    const newLat = centerLat + y;
    const newLng = centerLng + x / Math.cos(centerLat * Math.PI / 180);
    
    return {
      latitude: newLat,
      longitude: newLng,
    };
  };

  /**
   * Get date string from timestamp
   * Format: "Fri Oct 10 2025"
   * 
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Date string
   */
  const getDateString = (timestamp: string): string => {
    return new Date(timestamp).toDateString();
  };

  /**
   * Get today's date as a string
   * Format: "Fri Oct 10 2025"
   * 
   * @returns {string} Today's date string
   */
  const getTodayString = (): string => {
    return new Date().toDateString();
  };

  /**
   * Load actions from phone storage
   * Actions persist across app restarts!
   * 
   * @returns {Promise<Action[]>} All saved actions
   */
  const loadActions = async (): Promise<Action[]> => {
    try {
      const stored = await AsyncStorage.getItem('actions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading actions:', error);
      return [];
    }
  };

  /**
   * Save actions to phone storage
   * This ensures data persists even if app is closed
   * 
   * @param {Action[]} actionsToSave - Actions to save
   */
  const saveActions = async (actionsToSave: Action[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('actions', JSON.stringify(actionsToSave));
    } catch (error) {
      console.error('Error saving actions:', error);
    }
  };

  /**
   * Get all actions for a specific day
   * Useful for calendar view or historical data!
   * 
   * @param {string} date - Date string (e.g., "Fri Oct 10 2025")
   * @returns {Action[]} All actions on that day
   */
  const getDayActions = useCallback((date: string): Action[] => {
    return actions.filter(action => getDateString(action.timestamp) === date);
  }, [actions]);

  /**
   * Update counters based on today's actions
   * Counts how many of each action type happened today
   */
  const updateCounters = useCallback((): void => {
    const selectedDateString = selectedDate.toDateString();
    const dayActions = getDayActions(selectedDateString);
    const newCounters: Counters = {
      // Approaches = all actions except missed opportunities
      approaches: dayActions.filter(action => action.type !== 'missedOpportunity').length,
      
      // Count each specific type
      contacts: dayActions.filter(action => action.type === 'contact').length,
      instantDates: dayActions.filter(action => action.type === 'instantDate').length,
      missedOpportunities: dayActions.filter(action => action.type === 'missedOpportunity').length,
    };
    setCounters(newCounters);
  }, [getDayActions, selectedDate]);

  /**
   * Add a new action
   * This is called when user taps a counter button!
   * 
   * @param {ActionType} type - Type of action (approach, contact, etc.)
   * @param {string} notes - Optional notes about the action
   * @returns {Promise<Action | null>} The created action or null if failed
   * 
   * Example:
   * ```typescript
   * const action = await addAction('approach', 'Met at coffee shop');
   * ```
   */
  const addAction = async (type: ActionType, notes: string = ''): Promise<Action | null> => {
    try {
      let locationData: { latitude: number; longitude: number };

      if (appMode === 'basic' || !permissionGranted || !location) {
        locationData = { latitude: 0, longitude: 0 };
      } else {
        const realLat = location.coords.latitude;
        const realLng = location.coords.longitude;
        
        if (MapConstants.testMode.enabled) {
          locationData = generateRandomCoordinates(
            realLat,
            realLng,
            MapConstants.testMode.radiusMeters
          );
        } else {
          locationData = {
            latitude: realLat,
            longitude: realLng,
          };
        }
      }

      const newAction: Action = {
        id: generateId(),
        type,
        timestamp: new Date().toISOString(),
        location: locationData,
        notes
      };

      const updatedActions = [...actions, newAction];
      setActions(updatedActions);
      await saveActions(updatedActions);
      updateCounters();
      
      return newAction;
    } catch (error) {
      console.error('Error adding action:', error);
      return null;
    }
  };

  /**
   * Remove the last action of a specific type
   * This is called when user taps the minus button!
   * 
   * @param {ActionType} type - Type of action to remove
   * @returns {boolean} True if action was removed, false if none to remove
   * 
   * Example:
   * ```typescript
   * const removed = removeLastAction('approach');
   * if (removed) {
   *   console.log('Successfully removed last approach');
   * }
   * ```
   */
  const removeLastAction = (type: ActionType): boolean => {
    const todayActions = getDayActions(getTodayString());
    let lastActionIndex = -1;
    
    // Find the last action of this type (search backwards)
    for (let i = todayActions.length - 1; i >= 0; i--) {
      if (todayActions[i].type === type) {
        lastActionIndex = i;
        break;
      }
    }
    
    // No action found to remove
    if (lastActionIndex === -1) {
      return false;
    }

    // Remove the action
    const actionToRemove = todayActions[lastActionIndex];
    const updatedActions = actions.filter(action => action.id !== actionToRemove.id);
    
    setActions(updatedActions);
    saveActions(updatedActions);
    updateCounters();
    
    return true;
  };


  /**
   * Get counters for a specific day
   * 
   * @param {string} date - Date string (e.g., "Fri Oct 10 2025")
   * @returns {Counters} Counter totals for that day
   */
  const getDayCounters = useCallback((date: string): Counters => {
    const dayActions = getDayActions(date);
    return {
      approaches: dayActions.filter(action => action.type !== 'missedOpportunity').length,
      contacts: dayActions.filter(action => action.type === 'contact').length,
      instantDates: dayActions.filter(action => action.type === 'instantDate').length,
      missedOpportunities: dayActions.filter(action => action.type === 'missedOpportunity').length,
    };
  }, [getDayActions]);

  /**
   * Get today's counters (convenience function)
   * 
   * @returns {Counters} Today's counter totals
   */
  const getTodayCounters = (): Counters => {
    return getDayCounters(getTodayString());
  };

  /**
   * Set the user's daily approach goal
   * This is saved to storage and persists across app restarts
   * 
   * @param {number} goal - New daily goal (e.g., 10 approaches per day)
   */
  const setDailyGoal = async (goal: number): Promise<void> => {
    setDailyGoalState(goal);
    try {
      await AsyncStorage.setItem('approachesDayGoal', goal.toString());
    } catch (error) {
      console.error('Error saving daily goal:', error);
    }
  };

  const setSelectedDate = (date: Date): void => {
    setSelectedDateState(date);
    const today = new Date();
    const isSameDay = date.toDateString() === today.toDateString();
    setIsToday(isSameDay);
  };

  const setAppMode = async (mode: 'basic' | 'fullscale'): Promise<void> => {
    setAppModeState(mode);
    try {
      await AsyncStorage.setItem('appMode', mode);
    } catch (error) {
      console.error('Error saving app mode:', error);
    }
  };

  /**
   * EFFECT: Load data when app starts
   * This runs once when the provider mounts
   */
  useEffect(() => {
    const initializeData = async () => {
      const loadedActions = await loadActions();
      setActions(loadedActions);
      
      try {
        const storedGoal = await AsyncStorage.getItem('approachesDayGoal');
        if (storedGoal) {
          setDailyGoalState(parseInt(storedGoal, 10));
        }

        const storedMode = await AsyncStorage.getItem('appMode');
        
        if (permissionGranted) {
          if (storedMode !== 'fullscale') {
            setAppModeState('fullscale');
            await AsyncStorage.setItem('appMode', 'fullscale');
          } else {
            setAppModeState('fullscale');
          }
        } else {
          if (storedMode !== 'basic') {
            setAppModeState('basic');
            await AsyncStorage.setItem('appMode', 'basic');
          } else {
            setAppModeState('basic');
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
      
      setHasInitialized(true);
    };

    initializeData();
  }, [permissionGranted]);

  useEffect(() => {
    if (hasInitialized && isLoading) {
      setIsLoading(false);
    }
  }, [hasInitialized, isLoading]);

  /**
   * EFFECT: Update counters when actions change
   * Keeps counters in sync with actions array
   */
  useEffect(() => {
    updateCounters();
  }, [actions, selectedDate, updateCounters]);

  /**
   * EFFECT: Update userLocation when GPS coordinates change
   * Only updates if coordinates actually changed (prevents unnecessary re-renders)
   */
  useEffect(() => {
    if (location) {
      const newLat = location.coords.latitude;
      const newLng = location.coords.longitude;
      
      // Only update if coordinates changed
      if (!userLocation || userLocation.latitude !== newLat || userLocation.longitude !== newLng) {
        setUserLocation({ latitude: newLat, longitude: newLng });
      }
    }
  }, [location]);

  /**
   * Bundle everything together to provide to child components
   */
  const value: ActionsContextType = {
    actions,
    counters,
    dailyGoal,
    isLoading,
    selectedDate,
    isToday,
    addAction,
    removeLastAction,
    getDayActions,
    getDayCounters,
    getTodayCounters,
    setDailyGoal,
    setSelectedDate,
    permissionGranted,
    geoError,
    userLocation,
    appMode,
    setAppMode,
  };

  return (
    <ActionsContext.Provider value={value}>
      {children}
    </ActionsContext.Provider>
  );
};


