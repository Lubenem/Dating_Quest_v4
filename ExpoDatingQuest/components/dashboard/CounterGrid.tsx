/**
 * CounterGrid Component
 * 
 * Displays a 2x2 grid of CounterButtons
 * 
 * Layout:
 * ┌──────────────┬──────────────┐
 * │  Approaches  │  Missed Op.  │
 * ├──────────────┼──────────────┤
 * │   Contacts   │ Instant Date │
 * └──────────────┴──────────────┘
 * 
 * This component is "dumb" - it just displays the buttons.
 * All the logic lives in the parent (DashboardPage) and context.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CounterButton } from '../ui/CounterButton';
import { ActionType } from '../../types';

/**
 * Props for CounterGrid
 */
interface CounterGridProps {
  counters: {
    approaches: number;
    contacts: number;
    instantDates: number;
    missedOpportunities: number;
  };
  onIncrement: (type: ActionType) => void;
  onDecrement: (type: ActionType) => void;
  disabled?: boolean;
  isToday?: boolean;
}

/**
 * Order of counter types in the grid
 * This defines the layout: Approaches, Missed Op., Contacts, Instant Date
 */
const counterTypes: ActionType[] = [
  'approach',
  'missedOpportunity',
  'contact',
  'instantDate'
];

/**
 * CounterGrid Component
 * 
 * @param counters - Current counts for each action type
 * @param onIncrement - Function to call when incrementing a counter
 * @param onDecrement - Function to call when decrementing a counter
 * @param disabled - Whether to disable all buttons (e.g., no location permission)
 */
export const CounterGrid: React.FC<CounterGridProps> = ({
  counters,
  onIncrement,
  onDecrement,
  disabled = false,
  isToday = true,
}) => {
  /**
   * Get the count value for a specific action type
   * Maps from ActionType to the corresponding counter value
   * 
   * @param type - The action type
   * @returns The current count for that type
   */
  const getCounterValue = (type: ActionType): number => {
    switch (type) {
      case 'approach':
        return counters.approaches;
      case 'contact':
        return counters.contacts;
      case 'instantDate':
        return counters.instantDates;
      case 'missedOpportunity':
        return counters.missedOpportunities;
      default:
        return 0;
    }
  };

  return (
    <View style={styles.grid}>
      {counterTypes.map((type) => (
        <CounterButton
          key={type}
          type={type}
          count={getCounterValue(type)}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          disabled={disabled}
          isToday={isToday}
        />
      ))}
    </View>
  );
};

/**
 * Styles for CounterGrid
 */
const styles = StyleSheet.create({
  grid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 8,
    overflow: 'visible',
  },
});

