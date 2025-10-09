import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionsContext } from '../../contexts/ActionsContext';
import { Colors } from '../../app/constants';

export const TopBar: React.FC = () => {
  const { counters, dailyGoal } = useActionsContext();
  const percentage = Math.min((counters.approaches / dailyGoal) * 100, 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Daily Progress</Text>
          <Text style={styles.count}>
            {counters.approaches} / {dailyGoal}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${percentage}%` },
              ]}
            />
          </View>
          <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  count: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.selectedText,
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
    backgroundColor: Colors.primary,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 35,
    textAlign: 'right',
  },
});

