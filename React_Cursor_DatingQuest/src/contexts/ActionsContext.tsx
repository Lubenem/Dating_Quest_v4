import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Action, ActionType, Counters } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';

interface ActionsContextType {
  // State
  actions: Action[];
  counters: Counters;
  dailyGoal: number;
  
  // Actions
  addAction: (type: ActionType, notes?: string) => Promise<Action | null>;
  removeLastAction: (type: ActionType) => boolean;
  getDayActions: (date: string) => Action[];
  getDayCounters: (date: string) => Counters;
  getTodayCounters: () => Counters;
  setDailyGoal: (goal: number) => void;
  
  // Geolocation
  permissionGranted: boolean;
  geoError: string | null;
}

const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

export const useActionsContext = () => {
  const context = useContext(ActionsContext);
  if (context === undefined) {
    throw new Error('useActionsContext must be used within an ActionsProvider');
  }
  return context;
};

interface ActionsProviderProps {
  children: ReactNode;
}

export const ActionsProvider: React.FC<ActionsProviderProps> = ({ children }) => {
  const { getCurrentLocation, permissionGranted, error: geoError } = useGeolocation();
  const [actions, setActions] = useState<Action[]>([]);
  const [counters, setCounters] = useState<Counters>({
    approaches: 0,
    contacts: 0,
    instantDates: 0,
    missedOpportunities: 0,
  });
  const [dailyGoal, setDailyGoalState] = useState<number>(10);

  // Check if we're in localhost testing mode
  const isLocalhostTesting = (): boolean => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  };

  // Generate random location within 1000 meters for testing
  const generateRandomTestLocation = async (): Promise<{ latitude: number; longitude: number }> => {
    const userLocation = await getCurrentLocation();
    if (!userLocation) {
      return {
        latitude: 40.7128,
        longitude: -74.0060
      };
    }
    
    const maxOffset = 0.009;
    const latOffset = (Math.random() - 0.5) * maxOffset;
    const lngOffset = (Math.random() - 0.5) * maxOffset;
    
    return {
      latitude: userLocation.latitude + latOffset,
      longitude: userLocation.longitude + lngOffset
    };
  };

  // Generate unique ID for actions
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Get today's date string
  const getTodayString = (): string => {
    return new Date().toDateString();
  };

  // Load actions from localStorage
  const loadActions = (): Action[] => {
    try {
      const stored = localStorage.getItem('actions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading actions:', error);
      return [];
    }
  };

  // Save actions to localStorage
  const saveActions = (actionsToSave: Action[]): void => {
    try {
      localStorage.setItem('actions', JSON.stringify(actionsToSave));
    } catch (error) {
      console.error('Error saving actions:', error);
    }
  };

  // Update counters based on current actions
  const updateCounters = (): void => {
    const todayActions = getDayActions(getTodayString());
    const newCounters: Counters = {
      approaches: todayActions.filter(action => action.type !== 'missedOpportunity').length, // All actions except missed opportunities count as approaches
      contacts: todayActions.filter(action => action.type === 'contact').length,
      instantDates: todayActions.filter(action => action.type === 'instantDate').length,
      missedOpportunities: todayActions.filter(action => action.type === 'missedOpportunity').length,
    };
    setCounters(newCounters);
  };

  // Add action
  const addAction = async (type: ActionType, notes: string = ''): Promise<Action | null> => {
    try {
      let location: { latitude: number; longitude: number };
      
      if (isLocalhostTesting()) {
        location = await generateRandomTestLocation();
      } else {
        const userLocation = await getCurrentLocation();
        if (!userLocation) {
          console.error('No location available');
          return null;
        }
        location = userLocation;
      }

      const newAction: Action = {
        id: generateId(),
        type,
        timestamp: new Date().toISOString(),
        location: {
          ...location,
          timestamp: new Date().toISOString()
        },
        notes,
        date: getTodayString()
      };

      const updatedActions = [...actions, newAction];
      setActions(updatedActions);
      saveActions(updatedActions);
      updateCounters();
      
      return newAction;
    } catch (error) {
      console.error('Error adding action:', error);
      return null;
    }
  };

  // Remove last action of specific type
  const removeLastAction = (type: ActionType): boolean => {
    const todayActions = getDayActions(getTodayString());
    let lastActionIndex = -1;
    
    // Find the last action of the specified type
    for (let i = todayActions.length - 1; i >= 0; i--) {
      if (todayActions[i].type === type) {
        lastActionIndex = i;
        break;
      }
    }
    
    if (lastActionIndex === -1) {
      return false;
    }

    const actionToRemove = todayActions[lastActionIndex];
    const updatedActions = actions.filter(action => action.id !== actionToRemove.id);
    
    setActions(updatedActions);
    saveActions(updatedActions);
    updateCounters();
    
    return true;
  };

  // Get actions for a specific day
  const getDayActions = (date: string): Action[] => {
    return actions.filter(action => action.date === date);
  };

  // Get counters for a specific day
  const getDayCounters = (date: string): Counters => {
    const dayActions = getDayActions(date);
    return {
      approaches: dayActions.filter(action => action.type !== 'missedOpportunity').length,
      contacts: dayActions.filter(action => action.type === 'contact').length,
      instantDates: dayActions.filter(action => action.type === 'instantDate').length,
      missedOpportunities: dayActions.filter(action => action.type === 'missedOpportunity').length,
    };
  };

  // Get today's counters
  const getTodayCounters = (): Counters => {
    return getDayCounters(getTodayString());
  };

  // Set daily goal
  const setDailyGoal = (goal: number): void => {
    setDailyGoalState(goal);
    localStorage.setItem('approachesDayGoal', goal.toString());
  };

  // Load initial data
  useEffect(() => {
    const loadedActions = loadActions();
    setActions(loadedActions);
    updateCounters();
    
    // Load daily goal
    const storedGoal = localStorage.getItem('approachesDayGoal');
    if (storedGoal) {
      setDailyGoalState(parseInt(storedGoal, 10));
    }
  }, []);

  // Update counters when actions change
  useEffect(() => {
    updateCounters();
  }, [actions]);

  const value: ActionsContextType = {
    actions,
    counters,
    dailyGoal,
    addAction,
    removeLastAction,
    getDayActions,
    getDayCounters,
    getTodayCounters,
    setDailyGoal,
    permissionGranted,
    geoError,
  };

  return (
    <ActionsContext.Provider value={value}>
      {children}
    </ActionsContext.Provider>
  );
};
