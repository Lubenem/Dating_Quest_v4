import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import * as Location from 'expo-location';
import { useActionsContext } from '../../contexts/ActionsContext';
import { Colors } from '../../constants';

export const MapContent: React.FC = () => {
  const { permissionGranted, geoError } = useActionsContext();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      if (permissionGranted && Platform.OS !== 'web') {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }
    };

    getUserLocation();
  }, [permissionGranted]);

  const defaultLocation = {
    latitude: 40.7128,
    longitude: -74.0060,
  };

  const centerLocation = userLocation || defaultLocation;

  const cameraPosition = {
    coordinates: centerLocation,
    zoom: 14,
  };

  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Location Permission Required</Text>
          <Text style={styles.errorMessage}>
            Please enable location permissions to view the map and track your actions.
          </Text>
          {geoError && (
            <Text style={styles.errorDetail}>{geoError}</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Map View</Text>
        <Text style={styles.subtitle}>Your action locations</Text>
      </View>

      <View style={styles.mapContainer}>
        {Platform.OS === 'ios' ? (
          <AppleMaps.View
            style={styles.map}
            cameraPosition={cameraPosition}
          />
        ) : Platform.OS === 'android' ? (
          <GoogleMaps.View
            style={styles.map}
            cameraPosition={cameraPosition}
          />
        ) : (
          <View style={[styles.map, styles.centerContent]}>
            <Text style={styles.errorMessage}>
              Maps are only available on iOS and Android
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 10,
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
  mapContainer: {
    flex: 1,
    margin: 16,
    marginBottom: 80,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  errorDetail: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 8,
  },
});
