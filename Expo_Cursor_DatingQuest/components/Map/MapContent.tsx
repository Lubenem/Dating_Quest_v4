import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useActionsContext } from '../../contexts/ActionsContext';
import { Colors } from '../../constants';

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
        {Platform.OS === 'ios' ? (
          <AppleMaps.View
            style={styles.map}
            initialCameraPosition={{
              center: {
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
              },
              zoom: 15,
            }}
            showsUserLocation={true}
          />
        ) : Platform.OS === 'android' ? (
          <GoogleMaps.View
            style={styles.map}
            initialCameraPosition={{
              target: {
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
              },
              zoom: 15,
            }}
            showsUserLocation={true}
          />
        ) : (
          <View style={styles.errorContainer}>
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
