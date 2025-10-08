import React from 'react';
import { Platform, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionsContext } from '../contexts/ActionsContext';
import { Colors } from '../constants';

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Expo Maps (Apple/Google Native)</Text>
      </View>
      <View style={styles.mapContainer}>
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
            ]}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
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

