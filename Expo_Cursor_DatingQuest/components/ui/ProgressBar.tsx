import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants';

interface ProgressBarProps {
  current: number;
  goal: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  goal,
  color = Colors.primary,
}) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Daily Progress</Text>
        <Text style={styles.count}>
          {current} / {goal}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  count: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    minWidth: 35,
    textAlign: 'right',
  },
});