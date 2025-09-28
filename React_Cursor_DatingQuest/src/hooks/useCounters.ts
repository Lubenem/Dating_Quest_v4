import { useState, useEffect } from 'react';
import type { Counters } from '../types';


export const useCounters = () => {
  const [counters, setCounters] = useState<Counters>({
    approaches: 0,
    contacts: 0,
    instantDates: 0,
    plannedDates: 0,
  });

  useEffect(() => {
    loadDailyData();
  }, []);

  const loadDailyData = () => {
    const today = new Date().toDateString();
    const data = localStorage.getItem(today);
    
    if (data) {
      setCounters(JSON.parse(data));
    } else {
      // Reset counts if it's a new day
      localStorage.setItem('lastResetDate', today);
      setCounters({ approaches: 0, contacts: 0, instantDates: 0, plannedDates: 0 });
    }
  };

  const saveDailyData = (newCounters: Counters) => {
    const today = new Date().toDateString();
    localStorage.setItem(today, JSON.stringify(newCounters));
  };

  const incrementCounter = (type: keyof Counters) => {
    const newCounters = { ...counters, [type]: counters[type] + 1 };
    setCounters(newCounters);
    saveDailyData(newCounters);
  };

  const decrementCounter = (type: keyof Counters) => {
    if (counters[type] > 0) {
      const newCounters = { ...counters, [type]: counters[type] - 1 };
      setCounters(newCounters);
      saveDailyData(newCounters);
    }
  };

  const getDayData = (dateString: string): Counters => {
    const data = localStorage.getItem(dateString);
    return data ? JSON.parse(data) : { approaches: 0, contacts: 0, instantDates: 0, plannedDates: 0 };
  };

  return {
    counters,
    incrementCounter,
    decrementCounter,
    getDayData,
  };
};
