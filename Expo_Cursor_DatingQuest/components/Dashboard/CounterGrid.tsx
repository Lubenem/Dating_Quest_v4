import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CounterButton } from '../ui/CounterButton';
import { ActionType } from '../../types';

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
}

const counterTypes: ActionType[] = ['approach', 'contact', 'instantDate', 'missedOpportunity'];

export const CounterGrid: React.FC<CounterGridProps> = ({
  counters,
  onIncrement,
  onDecrement,
  disabled = false,
}) => {
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
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
});