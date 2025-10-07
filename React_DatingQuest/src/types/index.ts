export type ActionType = 'approach' | 'contact' | 'instantDate' | 'missedOpportunity';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

export interface Action {
  id: string;
  type: ActionType;
  timestamp: string;
  location: LocationData;
  notes?: string;
  tags?: string[];
  date: string; // "Mon Sep 30 2024"
}

export interface DayData {
  date: string; // "Mon Sep 30 2024"
  actions: Action[];
}

export interface Counters {
  approaches: number;
  contacts: number;
  instantDates: number;
  missedOpportunities: number;
}
