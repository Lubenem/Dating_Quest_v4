import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionsContext } from '../../contexts/ActionsContext';
import { Colors } from '../../constants';
import { WebMap } from './WebMap';

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

export const MapContent: React.FC = () => {
  const { permissionGranted, geoError, userLocation } = useActionsContext();

  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Location Permission Required</Text>
          <Text style={styles.errorMessage}>
            Please enable location permissions to view the map.
          </Text>
          {geoError && (
            <Text style={styles.errorDetail}>{geoError}</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const initialRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' && userLocation ? (
          <WebMap
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
            markers={[]}
          />
        ) : Platform.OS === 'web' ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Map Loading</Text>
            <Text style={styles.errorMessage}>
              Waiting for location...
            </Text>
          </View>
        ) : Platform.OS === 'ios' && AppleMaps ? (
          <AppleMaps.View
            style={styles.map}
            cameraPosition={{
              coordinates: {
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
              },
              zoom: 15,
            }}
            markers={
              userLocation
                ? [
                    {
                      id: 'user-location',
                      coordinates: {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                      },
                      tintColor: '#007AFF',
                    },
                  ]
                : []
            }
          />
        ) : Platform.OS === 'android' && GoogleMaps ? (
          <GoogleMaps.View
            style={styles.map}
            cameraPosition={{
              coordinates: {
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
              },
              zoom: 15,
            }}
            userLocation={
              userLocation
                ? {
                    coordinates: {
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    },
                    followUserLocation: false,
                  }
                : undefined
            }
          />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Map Not Available</Text>
            <Text style={styles.errorMessage}>
              Maps require expo-maps package on mobile devices
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
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
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
