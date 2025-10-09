import React from 'react';
import { Platform, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionsContext } from '../contexts/ActionsContext';
import { Colors } from '../constants';

// ========== TEST MODE TOGGLE ==========
const ENABLE_TEST_MARKERS = true;
// ======================================

let AppleMaps: any;
let GoogleMaps: any;

if (Platform.OS !== 'web') {
  try {
    const ExpoMaps = require('expo-maps');
    AppleMaps = ExpoMaps.AppleMaps;
    GoogleMaps = ExpoMaps.GoogleMaps;
  } catch (error) {
    console.warn('expo-maps not available');
  }
}

export default function ExpoMapScreen() {
  const { permissionGranted, geoError, userLocation } = useActionsContext();

  // ========== TEST: Helper function to offset location by ~10m ==========
  const offsetLocation = (lat: number, lng: number, direction: 'north' | 'east' | 'south' | 'west') => {
    const offset = 0.00009; // ~10 meters
    switch (direction) {
      case 'north': return { latitude: lat + offset, longitude: lng };
      case 'east': return { latitude: lat, longitude: lng + offset };
      case 'south': return { latitude: lat - offset, longitude: lng };
      case 'west': return { latitude: lat, longitude: lng - offset };
    }
  };
  // ====================================================================

  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Location Permission Required</Text>
          <Text style={styles.errorMessage}>
            Please enable location permissions to view the map.
          </Text>
          {geoError && <Text style={styles.errorDetail}>{geoError}</Text>}
        </View>
      </SafeAreaView>
    );
  }

  if (!userLocation && Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && AppleMaps && userLocation ? (
          <AppleMaps.View
            style={styles.map}
            colorScheme="DARK"
            showPointsOfInterest={false}
            showBuildings={false}
            cameraPosition={{
              coordinates: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
              zoom: 16.5,
            }}
            markers={[
              {
                id: 'user-location',
                coordinates: {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                },
                tintColor: '#667eea',
              },
              // ========== TEST MARKERS START ==========
              ...(ENABLE_TEST_MARKERS ? [
                {
                  id: 'test-approach',
                  coordinates: offsetLocation(userLocation.latitude, userLocation.longitude, 'east'),
                  tintColor: Colors.gradients.approach[0],
                },
                {
                  id: 'test-contact',
                  coordinates: offsetLocation(userLocation.latitude, userLocation.longitude, 'south'),
                  tintColor: Colors.gradients.contact[0],
                },
                {
                  id: 'test-instant-date',
                  coordinates: offsetLocation(userLocation.latitude, userLocation.longitude, 'west'),
                  tintColor: Colors.gradients.instantDate[0],
                },
              ] : []),
              // ========== TEST MARKERS END ==========
            ]}
            circles={ENABLE_TEST_MARKERS ? [
              {
                id: 'test-yellow-circle',
                center: offsetLocation(userLocation.latitude, userLocation.longitude, 'north'),
                radius: 5,
                fillColor: '#FFD700',
                strokeColor: '#FFA500',
                strokeWidth: 2,
              },
            ] : []}
          />
        ) : Platform.OS === 'android' && GoogleMaps && userLocation ? (
          <GoogleMaps.View
            style={styles.map}
            colorScheme="DARK"
            showPointsOfInterest={false}
            showBuildings={false}
            cameraPosition={{
              coordinates: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
              zoom: 16.5,
            }}
            circles={[
              {
                id: 'location-dot',
                center: {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                },
                radius: 10,
                fillColor: '#667eea',
                strokeColor: '#ffffff',
                strokeWidth: 2,
              },
              // ========== TEST MARKERS START ==========
              ...(ENABLE_TEST_MARKERS ? [
                {
                  id: 'test-yellow-circle',
                  center: offsetLocation(userLocation.latitude, userLocation.longitude, 'north'),
                  radius: 5,
                  fillColor: '#FFD700',
                  strokeColor: '#FFA500',
                  strokeWidth: 2,
                },
                {
                  id: 'test-approach-circle',
                  center: offsetLocation(userLocation.latitude, userLocation.longitude, 'east'),
                  radius: 5,
                  fillColor: Colors.gradients.approach[0],
                  strokeColor: '#ffffff',
                  strokeWidth: 2,
                },
                {
                  id: 'test-contact-circle',
                  center: offsetLocation(userLocation.latitude, userLocation.longitude, 'south'),
                  radius: 5,
                  fillColor: Colors.gradients.contact[0],
                  strokeColor: '#ffffff',
                  strokeWidth: 2,
                },
                {
                  id: 'test-instant-date-circle',
                  center: offsetLocation(userLocation.latitude, userLocation.longitude, 'west'),
                  radius: 5,
                  fillColor: Colors.gradients.instantDate[0],
                  strokeColor: '#ffffff',
                  strokeWidth: 2,
                },
              ] : []),
              // ========== TEST MARKERS END ==========
            ]}
          />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Map Not Available</Text>
            <Text style={styles.errorMessage}>
              Expo Maps only available on iOS and Android
            </Text>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.background,
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

