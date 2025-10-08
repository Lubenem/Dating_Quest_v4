import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionsContext } from '../contexts/ActionsContext';
import { Colors } from '../constants';

let MapContainer: any;
let TileLayer: any;
let Circle: any;
let L: any;

export default function OpenStreetMapScreen() {
  const { permissionGranted, geoError, userLocation } = useActionsContext();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      import('leaflet').then((leafletModule) => {
        L = leafletModule.default;
        
        import('react-leaflet').then((reactLeafletModule) => {
          MapContainer = reactLeafletModule.MapContainer;
          TileLayer = reactLeafletModule.TileLayer;
          Circle = reactLeafletModule.Circle;
          setIsMapLoaded(true);
        });
      });

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, []);

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

  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Web Only</Text>
          <Text style={styles.errorMessage}>
            OpenStreetMap is available on web only.{'\n'}
            Build and test on web browser.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isMapLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerText}>OpenStreetMap (Leaflet)</Text>
      </View>
      <View style={styles.mapContainer}>
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
          
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={20}
            pathOptions={{
              fillColor: 'rgba(102, 126, 234, 0.3)',
              fillOpacity: 1,
              color: 'transparent',
              weight: 0,
            }}
          />

          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={8}
            pathOptions={{
              fillColor: '#667eea',
              fillOpacity: 1,
              color: '#ffffff',
              weight: 3,
            }}
          />
        </MapContainer>
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

