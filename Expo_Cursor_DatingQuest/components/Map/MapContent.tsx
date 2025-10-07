import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useActionsContext } from '../../contexts/ActionsContext';
import { Colors } from '../../constants';
import { darkMapStyle } from '../../constants/mapStyles';
import { ActionType } from '../../types';

// Marker colors for different action types
const markerColors: Record<ActionType, string> = {
  approach: '#4CAF50',        // Green
  contact: '#2196F3',         // Blue
  instantDate: '#FF1744',     // Red/Pink
  missedOpportunity: '#FFC107' // Amber/Yellow
};

export const MapContent: React.FC = () => {
  const { actions, permissionGranted, geoError } = useActionsContext();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      if (permissionGranted && Platform.OS !== 'web') {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(coords);
          
          // Animate map to user's location when fetched
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              ...coords,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }, 1000);
          }
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={darkMapStyle}
          initialRegion={{
            ...centerLocation,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          rotateEnabled={true}
          pitchEnabled={false}
        >
          {/* Render markers for all actions */}
          {actions.map((action, index) => (
            <Marker
              key={action.id}
              coordinate={{
                latitude: action.location.latitude,
                longitude: action.location.longitude,
              }}
              pinColor={markerColors[action.type]}
              title={`${action.type.charAt(0).toUpperCase() + action.type.slice(1).replace(/([A-Z])/g, ' $1').trim()}`}
              description={new Date(action.timestamp).toLocaleString()}
            >
              <View style={[styles.markerContainer, { backgroundColor: markerColors[action.type] }]}>
                <Text style={styles.markerText}>{index + 1}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
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
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
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
