import AsyncStorage from '@react-native-async-storage/async-storage';
import { Action } from '../types';

const STORAGE_KEYS = {
  ACTIONS: 'actions',
  CURRENT_LEVEL: 'currentLevel',
  STREAK: 'streak',
  DAILY_GOAL: 'approachesDayGoal',
  APP_MODE: 'appMode',
  LEVEL_UP_POPUP_SHOWN: 'levelUpPopupShown',
} as const;

export const StorageService = {
  async getActions(): Promise<Action[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.ACTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading actions:', error);
      return [];
    }
  },

  async setActions(actions: Action[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
    } catch (error) {
      console.error('Error saving actions:', error);
    }
  },

  async getCurrentLevel(): Promise<number | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL);
      return stored !== null ? parseInt(stored, 10) : null;
    } catch (error) {
      console.error('Error loading current level:', error);
      return null;
    }
  },

  async setCurrentLevel(level: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, level.toString());
    } catch (error) {
      console.error('Error saving current level:', error);
    }
  },

  async getStreak(): Promise<number> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
      return stored !== null ? parseInt(stored, 10) : 0;
    } catch (error) {
      console.error('Error loading streak:', error);
      return 0;
    }
  },

  async setStreak(streak: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    } catch (error) {
      console.error('Error saving streak:', error);
    }
  },

  async getDailyGoal(): Promise<number | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_GOAL);
      return stored !== null ? parseInt(stored, 10) : null;
    } catch (error) {
      console.error('Error loading daily goal:', error);
      return null;
    }
  },

  async setDailyGoal(goal: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_GOAL, goal.toString());
    } catch (error) {
      console.error('Error saving daily goal:', error);
    }
  },

  async getAppMode(): Promise<'basic' | 'fullscale' | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.APP_MODE);
      if (stored === 'basic' || stored === 'fullscale') {
        return stored;
      }
      return null;
    } catch (error) {
      console.error('Error loading app mode:', error);
      return null;
    }
  },

  async setAppMode(mode: 'basic' | 'fullscale'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_MODE, mode);
    } catch (error) {
      console.error('Error saving app mode:', error);
    }
  },

  async getLevelUpPopupShown(): Promise<number | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LEVEL_UP_POPUP_SHOWN);
      return stored !== null ? parseInt(stored, 10) : null;
    } catch (error) {
      console.error('Error loading level up popup status:', error);
      return null;
    }
  },

  async setLevelUpPopupShown(level: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LEVEL_UP_POPUP_SHOWN, level.toString());
    } catch (error) {
      console.error('Error saving level up popup status:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  getKeys() {
    return STORAGE_KEYS;
  },
};

