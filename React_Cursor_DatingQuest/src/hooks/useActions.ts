import { useState, useEffect } from 'react';
import type { Action, ActionType, DayData, Counters } from '../types';
import { useGeolocation } from './useGeolocation';

export const useActions = () => {
  const { getCurrentLocation, permissionGranted, error: geoError } = useGeolocation();
  const [actions, setActions] = useState<Action[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check if we're in localhost testing mode
  const isLocalhostTesting = (): boolean => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  };

  // Generate random location within 1000 meters for testing
  const generateRandomTestLocation = async (): Promise<{ latitude: number; longitude: number }> => {
    // Get user's actual location as base
    const userLocation = await getCurrentLocation();
    if (!userLocation) {
      // Fallback to NYC if no location available
      return {
        latitude: 40.7128,
        longitude: -74.0060
      };
    }
    
    // Generate random offset within 1000 meters (approximately 0.009 degrees)
    const maxOffset = 0.009;
    const latOffset = (Math.random() - 0.5) * maxOffset;
    const lngOffset = (Math.random() - 0.5) * maxOffset;
    
    return {
      latitude: userLocation.latitude + latOffset,
      longitude: userLocation.longitude + lngOffset
    };
  };

  // Get daily goal (default 10)
  const getDailyGoal = (): number => {
    const stored = localStorage.getItem('approachesDayGoal');
    return stored ? parseInt(stored, 10) : 10;
  };

  // Set daily goal
  const setDailyGoal = (goal: number): void => {
    localStorage.setItem('approachesDayGoal', goal.toString());
    triggerRefresh();
  };

  // Generate unique ID for actions
  const generateActionId = (): string => {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Get today's date string
  const getTodayString = (): string => {
    return new Date().toDateString();
  };

  // Load actions for a specific day
  const getDayActions = (dateString: string): Action[] => {
    const data = localStorage.getItem(dateString);
    if (data) {
      const dayData: DayData = JSON.parse(data);
      return dayData.actions || [];
    }
    return [];
  };

  // Save actions for a specific day
  const saveDayActions = (dateString: string, dayActions: Action[]) => {
    const dayData: DayData = {
      date: dateString,
      actions: dayActions,
    };
    localStorage.setItem(dateString, JSON.stringify(dayData));
  };

  // Add a new action
  const addAction = async (type: ActionType, notes?: string, tags?: string[]): Promise<Action | null> => {
    try {
      if (!permissionGranted && !isLocalhostTesting()) {
        console.warn('Geolocation permission not granted');
        return null;
      }

      let location: { latitude: number; longitude: number; accuracy?: number; timestamp: string };
      
      if (isLocalhostTesting()) {
        // Use random location for localhost testing
        const randomLoc = await generateRandomTestLocation();
        location = {
          latitude: randomLoc.latitude,
          longitude: randomLoc.longitude,
          accuracy: 10,
          timestamp: new Date().toISOString()
        };
        console.log('🧪 Testing mode: Using random location:', randomLoc);
      } else {
        // Use real geolocation for production
        const realLocation = await getCurrentLocation();
        if (!realLocation) {
          console.error('Failed to get current location');
          return null;
        }
        location = {
          latitude: realLocation.latitude,
          longitude: realLocation.longitude,
          accuracy: realLocation.accuracy || 10,
          timestamp: realLocation.timestamp
        };
      }
      
      const newAction: Action = {
        id: generateActionId(),
        type,
        timestamp: new Date().toISOString(),
        location,
        notes,
        tags,
        date: getTodayString(),
      };

      const today = getTodayString();
      const todayActions = getDayActions(today);
      const updatedActions = [...todayActions, newAction];
      
      saveDayActions(today, updatedActions);
      
      // Update local state if it's today's actions
      if (today === getTodayString()) {
        setActions(updatedActions);
      }

      // Trigger refresh for other components
      triggerRefresh();

      return newAction;
    } catch (error) {
      console.error('Failed to add action:', error);
      return null;
    }
  };

  // Remove an action (for decrement functionality)
  const removeLastAction = (type: ActionType): boolean => {
    const today = getTodayString();
    const todayActions = getDayActions(today);
    
    // Find the last action of this type by iterating backwards
    let lastActionIndex = -1;
    for (let i = todayActions.length - 1; i >= 0; i--) {
      if (todayActions[i].type === type) {
        lastActionIndex = i;
        break;
      }
    }
    
    if (lastActionIndex !== -1) {
      const updatedActions = todayActions.filter((_, index) => index !== lastActionIndex);
      saveDayActions(today, updatedActions);
      
      // Update local state if it's today's actions
      if (today === getTodayString()) {
        setActions(updatedActions);
      }

      // Trigger refresh for other components
      triggerRefresh();
      
      return true;
    }
    
    return false;
  };

  // Get counters for a specific day
  const getDayCounters = (dateString: string): Counters => {
    const dayActions = getDayActions(dateString);
    
    // All action types are derivatives of approach, so they all count as approaches
    const totalApproaches = dayActions.length; // All actions count as approaches
    
    return {
      approaches: totalApproaches,
      contacts: dayActions.filter(action => action.type === 'contact').length,
      instantDates: dayActions.filter(action => action.type === 'instantDate').length,
      plannedDates: dayActions.filter(action => action.type === 'plannedDate').length,
    };
  };

  // Get today's counters
  const getTodayCounters = (): Counters => {
    return getDayCounters(getTodayString());
  };

  // Trigger refresh for components that need to update
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Load today's actions on mount
  useEffect(() => {
    const todayActions = getDayActions(getTodayString());
    setActions(todayActions);
  }, []);

  return {
    actions,
    addAction,
    removeLastAction,
    getDayActions,
    getDayCounters,
    getTodayCounters,
    permissionGranted,
    geoError,
    refreshTrigger,
    getDailyGoal,
    setDailyGoal,
  };
};
