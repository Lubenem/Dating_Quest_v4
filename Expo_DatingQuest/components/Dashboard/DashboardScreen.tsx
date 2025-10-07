import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionsContext } from '../../contexts/ActionsContext';
import { CounterGrid } from '../Dashboard/CounterGrid';
import { Colors, Layout } from '../../constants';

export default function DashboardScreen() {
  const { 
    addAction, 
    removeLastAction, 
    counters, 
    permissionGranted, 
    geoError 
  } = useActionsContext();

  const handleIncrement = async (type: any) => {
    const result = await addAction(type);
    
    if (!result) {
      Alert.alert(
        'Action Failed',
        'Unable to add action. Please check your location permissions.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDecrement = (type: any) => {
    const success = removeLastAction(type);
    
    if (!success) {
      Alert.alert(
        'No Actions',
        'No actions of this type to remove.',
        [{ text: 'OK' }]
      );
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
      <ScrollView contentContainerStyle={styles.content}>
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
        
        <CounterGrid
          counters={counters}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          disabled={!permissionGranted}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 0,
  },
  header: {
    marginBottom: 0,
    margin: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 100,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  warningContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.error + '20',
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
