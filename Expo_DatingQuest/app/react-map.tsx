import React, { useRef, useEffect, useState } from 'react';
import { Platform, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { useActionsContext } from '../contexts/ActionsContext';
import { Colors, ActionColors } from '../constants';
import { Users, MessageCircle, Clock, XCircle } from 'lucide-react-native';

// ========== TEST MODE TOGGLE ==========
const ENABLE_TEST_MARKERS = true;
// ======================================

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export default function ReactNativeMapScreen() {
  const { permissionGranted, geoError, userLocation } = useActionsContext();
  const mapRef = useRef<MapView>(null);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  const handleMarkerLayout = () => {
    if (tracksViewChanges) setTracksViewChanges(false);
  };

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 300);
    }
  }, []);

  // ========== TEST: Helper function to offset location by ~10m ==========
  const offsetLocation = (lat: number, lng: number, direction: 'north' | 'east' | 'south' | 'west') => {
    const offset = 0.001; // ~10 meters
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

  if (!userLocation) {
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
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        mapType="standard"
      >
          <Circle
            center={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            radius={20}
            fillColor="rgba(0, 122, 255, 0.2)"
            strokeColor="transparent"
            strokeWidth={0}
          />
          
          <Circle
            center={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            radius={8}
            fillColor="#007AFF"
            strokeColor="#ffffff"
            strokeWidth={2}
          />

          {/* ========== TEST MARKERS START ========== */}
          {ENABLE_TEST_MARKERS && (
            <>
              {/* Yellow circle 10m to the north */}
              <Circle
                center={offsetLocation(userLocation.latitude, userLocation.longitude, 'north')}
                radius={5}
                fillColor="#FFD700"
                strokeColor="#FFA500"
                strokeWidth={2}
              />

              {/* Approach marker (Users icon) - 10m to the east */}
              <Marker
                coordinate={offsetLocation(userLocation.latitude, userLocation.longitude, 'east')}
                tracksViewChanges={tracksViewChanges}
              >
                <View style={styles.markerContainer} onLayout={handleMarkerLayout}>
                  <View style={[styles.iconWrapper, { backgroundColor: ActionColors.approach }]}>
                    <Users size={20} color="#ffffff" />
                  </View>
                </View>
              </Marker>

              {/* Contact marker (MessageCircle icon) - 10m to the south */}
              <Marker
                coordinate={offsetLocation(userLocation.latitude, userLocation.longitude, 'south')}
                tracksViewChanges={tracksViewChanges}
              >
                <View style={styles.markerContainer} onLayout={handleMarkerLayout}>
                  <View style={[styles.iconWrapper, { backgroundColor: ActionColors.contact }]}>
                    <MessageCircle size={20} color="#ffffff" />
                  </View>
                </View>
              </Marker>

              {/* Instant Date marker (Clock icon) - 10m to the west */}
              <Marker
                coordinate={offsetLocation(userLocation.latitude, userLocation.longitude, 'west')}
                tracksViewChanges={tracksViewChanges}
              >
                <View style={styles.markerContainer} onLayout={handleMarkerLayout}>
                  <View style={[styles.iconWrapper, { backgroundColor: ActionColors.instantDate }]}>
                    <Clock size={20} color="#ffffff" />
                  </View>
                </View>
              </Marker>
            </>
          )}
          {/* ========== TEST MARKERS END ========== */}
      </MapView>
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
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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

