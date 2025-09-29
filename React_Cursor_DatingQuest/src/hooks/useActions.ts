import { useState, useEffect } from 'react';
import type { Action, ActionType, DayData, Counters } from '../types';
import { useGeolocation } from './useGeolocation';

export const useActions = () => {
  const { getCurrentLocation, permissionGranted, error: geoError } = useGeolocation();
  const [actions, setActions] = useState<Action[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      if (!permissionGranted) {
        console.warn('Geolocation permission not granted');
        return null;
      }

      const location = await getCurrentLocation();
      
      const newAction: Action = {
        id: generateActionId(),
        type,
        timestamp: new Date().toISOString(),
        location,
        notes,
        tags,
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
    
    return {
      approaches: dayActions.filter(action => action.type === 'approach').length,
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
  };
};
