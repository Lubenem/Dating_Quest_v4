export interface Counters {
  approaches: number;
  contacts: number;
  instantDates: number;
  plannedDates: number;
}

export interface DayData {
  date: string;
  counters: Counters;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}
