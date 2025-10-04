import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Action, ActionType, Counters } from '../types';
import { useLocation } from '../hooks/useLocation';

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
  const { location, permissionGranted, error: geoError, getCurrentLocation } = useLocation();
  const [actions, setActions] = useState<Action[]>([]);
  const [counters, setCounters] = useState<Counters>({
    approaches: 0,
    contacts: 0,
    instantDates: 0,
    missedOpportunities: 0,
  });
  const [dailyGoal, setDailyGoalState] = useState<number>(10);

  // Generate unique ID for actions
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Get today's date string
  const getTodayString = (): string => {
    return new Date().toDateString();
  };

  // Load actions from AsyncStorage
  const loadActions = async (): Promise<Action[]> => {
    try {
      const stored = await AsyncStorage.getItem('actions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading actions:', error);
      return [];
    }
  };

  // Save actions to AsyncStorage
  const saveActions = async (actionsToSave: Action[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('actions', JSON.stringify(actionsToSave));
    } catch (error) {
      console.error('Error saving actions:', error);
    }
  };

  // Update counters based on current actions
  const updateCounters = (): void => {
    const todayActions = getDayActions(getTodayString());
    const newCounters: Counters = {
      approaches: todayActions.filter(action => action.type !== 'missedOpportunity').length,
      contacts: todayActions.filter(action => action.type === 'contact').length,
      instantDates: todayActions.filter(action => action.type === 'instantDate').length,
      missedOpportunities: todayActions.filter(action => action.type === 'missedOpportunity').length,
    };
    setCounters(newCounters);
  };

  // Add action
  const addAction = async (type: ActionType, notes: string = ''): Promise<Action | null> => {
    try {
      let locationData: { latitude: number; longitude: number };
      
      if (permissionGranted && location) {
        locationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      } else {
        // Fallback to NYC coordinates if no location available
        locationData = {
          latitude: 40.7128,
          longitude: -74.0060,
        };
      }

      const newAction: Action = {
        id: generateId(),
        type,
        timestamp: new Date().toISOString(),
        location: {
          ...locationData,
          timestamp: new Date().toISOString()
        },
        notes,
        date: getTodayString()
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
  const setDailyGoal = async (goal: number): Promise<void> => {
    setDailyGoalState(goal);
    try {
      await AsyncStorage.setItem('approachesDayGoal', goal.toString());
    } catch (error) {
      console.error('Error saving daily goal:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {
      const loadedActions = await loadActions();
      setActions(loadedActions);
      updateCounters();
      
      // Load daily goal
      try {
        const storedGoal = await AsyncStorage.getItem('approachesDayGoal');
        if (storedGoal) {
          setDailyGoalState(parseInt(storedGoal, 10));
        }
      } catch (error) {
        console.error('Error loading daily goal:', error);
      }
    };

    initializeData();
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

