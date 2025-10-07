import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionsContext } from '../../contexts/ActionsContext';
import { CounterGrid } from './CounterGrid';
import { ProgressBar } from '../ui/ProgressBar';
import { Colors } from '../../constants';
import { ActionType } from '../../types';

export const DashboardContent: React.FC = () => {
  const { 
    addAction, 
    removeLastAction, 
    counters, 
    dailyGoal, 
    permissionGranted, 
    geoError 
  } = useActionsContext();

  const handleIncrement = async (type: ActionType) => {
    try {
      const result = await addAction(type);
      if (!result) {
        Alert.alert(
          'Action Failed',
          'Unable to add action. Please check your location permissions.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error adding action:', error);
      Alert.alert('Error', 'Failed to add action. Please try again.');
    }
  };

  const handleDecrement = (type: ActionType) => {
    const success = removeLastAction(type);
    if (!success) {
      Alert.alert('No Actions', 'No actions of this type to remove.');
    }
  };

  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dating Quest</Text>
          <Text style={styles.subtitle}>{formatDate()}</Text>
          
          {!permissionGranted && geoError && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Location permission denied - action tracking disabled
              </Text>
              <Text style={styles.errorText}>{geoError}</Text>
            </View>
          )}
        </View>

        <ProgressBar
          current={counters.approaches}
          goal={dailyGoal}
          color={Colors.primary}
        />

        <CounterGrid
          counters={counters}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          disabled={!permissionGranted}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  warningContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.error + '20',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    width: '100%',
  },
  warningText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
