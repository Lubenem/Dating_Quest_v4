/**
 * DashboardPage Component
 * 
 * The main dashboard screen of the app!
 * Shows:
 * - Today's date
 * - Counter grid (4 action buttons)
 * - Location permission warnings (if permission denied)
 * 
 * This is the "smart" component that:
 * - Connects to the ActionsContext
 * - Handles user interactions (increment/decrement)
 * - Shows alerts for errors
 * - Passes data down to "dumb" components (CounterGrid)
 * 
 * Think of it as the "controller" in Angular terms!
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionsContext } from '../contexts/ActionsContext';
import { CounterGrid } from '../components/dashboard/CounterGrid';
import { Colors } from '../constants';
import { ActionType } from '../types';

/**
 * DashboardPage Component
 * 
 * This is what the user sees when they open the app!
 */
export const DashboardPage: React.FC = () => {
  // Get data and functions from the ActionsContext
  const { 
    addAction,              // Function to add an action
    removeLastAction,       // Function to remove an action
    counters,               // Counter values for selected date
    permissionGranted,      // Does user allow location?
    geoError,               // Any location errors?
    selectedDate,           // Currently selected date
    isToday,                // Is selected date today?
  } = useActionsContext();

  /**
   * Handle increment (when user taps a counter button)
   * 
   * @param type - Which action type to increment
   */
  const handleIncrement = async (type: ActionType) => {
    // Try to add the action
    const result = await addAction(type);
    
    // If failed (no location permission), show an alert
    if (!result) {
      Alert.alert(
        'Action Failed',
        'Unable to add action. Please check your location permissions.',
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * Handle decrement (when user taps the minus button)
   * 
   * @param type - Which action type to decrement
   */
  const handleDecrement = (type: ActionType) => {
    removeLastAction(type);
  };

  /**
   * Format selected date in a nice readable format
   * Example: "Friday, October 10, 2025"
   * 
   * @returns Formatted date string
   */
  const formatDate = (): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header section */}
        <View style={styles.header}>
          <Text style={styles.title}>Dating Quest</Text>
          <Text style={styles.subtitle}>{formatDate()}</Text>
          
          {/* Show warning if location permission denied */}
          {!permissionGranted && geoError && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Location permission denied - action tracking disabled
              </Text>
              <Text style={styles.errorText}>{geoError}</Text>
            </View>
          )}
        </View>
        
        {/* Counter grid - the main UI! */}
        <CounterGrid
          counters={counters}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          disabled={!permissionGranted || !isToday}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles for DashboardPage
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
    overflow: 'visible',
  },
  content: {
    backgroundColor: 'transparent',
    paddingBottom: 40,
    overflow: 'visible',
  },
  header: {
    backgroundColor: 'transparent',
    marginBottom: 20,
    alignItems: 'center',
  },
  title: { 
    backgroundColor: 'transparent',
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    backgroundColor: 'transparent',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  warningContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.error + '20', // Red with 20% opacity
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  warningText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});


