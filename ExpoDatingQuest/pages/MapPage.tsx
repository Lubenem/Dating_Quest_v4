import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text, ActivityIndicator } from 'react-native';
import { Users, MessageCircle, Clock, XCircle } from 'lucide-react-native';
import { useLocation } from '../hooks/useLocation';
import { useActionsContext } from '../contexts/ActionsContext';
import { Map as MapConstants, Colors, ActionColors } from '../constants';
import { ActionType } from '../types';

let MapView: any;
let Marker: any;
let Circle: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.default;
  Marker = RNMaps.Marker;
  Circle = RNMaps.Circle;
  PROVIDER_GOOGLE = RNMaps.PROVIDER_GOOGLE;
}

const LATITUDE_DELTA = MapConstants.initialScale / 111000;
const LONGITUDE_DELTA = MapConstants.initialScale / (111000 * Math.cos(0));

const getIconForActionType = (type: ActionType) => {
  switch (type) {
    case 'approach':
      return Users;
    case 'contact':
      return MessageCircle;
    case 'instantDate':
      return Clock;
    case 'missedOpportunity':
      return XCircle;
  }
};

export const MapPage: React.FC = () => {
  const { location, permissionGranted, error } = useLocation();
  const { actions, getDayActions, isLoading } = useActionsContext();
  const mapRef = useRef<any>(null);
  const hasAnimatedToLocation = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [markersRendered, setMarkersRendered] = useState(false);

  useEffect(() => {
    if (location && mapRef.current && !hasAnimatedToLocation.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 1000);
      hasAnimatedToLocation.current = true;
    }
  }, [location]);

  useEffect(() => {
    if (mapReady) {
      setMarkersRendered(false);
    }
  }, [mapReady, actions.length]);

  const todayActions = React.useMemo(() => {
    const dayActions = getDayActions(new Date().toDateString());
    
    console.log('MapPage - actions.length:', actions.length);
    console.log('MapPage - todayActions.length:', dayActions.length);
    console.log('MapPage - isLoading:', isLoading);
    
    const priorityOrder: Record<ActionType, number> = {
      missedOpportunity: 1,
      approach: 2,
      contact: 3,
      instantDate: 4,
    };
    
    return dayActions.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);
  }, [actions, getDayActions, isLoading]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Map Not Available on Web</Text>
          <Text style={styles.messageText}>
            Please run the app on a mobile device or emulator to view the map.
          </Text>
        </View>
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Location Permission Required</Text>
          <Text style={styles.messageText}>
            Please enable location permissions to view the map.
          </Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    );
  }

  if (!location || isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.messageText}>
            {!location ? 'Getting your location...' : 'Loading actions...'}
          </Text>
        </View>
      </View>
    );
  }

  const initialRegion = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={true}
        customMapStyle={darkMapStyle}
        onMapReady={() => {
          console.log('MapView - onMapReady fired, map is ready for markers');
          setMapReady(true);
        }}
      >
        <Circle
          center={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
          radius={location.coords.accuracy || 50}
          fillColor="rgba(0, 122, 255, 0.2)"
          strokeColor="transparent"
        />
        <Circle
          center={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
          radius={8}
          fillColor="#007AFF"
          strokeColor="#ffffff"
          strokeWidth={2}
        />

        {mapReady && todayActions.map((action, index) => {
          const IconComponent = getIconForActionType(action.type);
          const markerColor = ActionColors[action.type];
          
          console.log(`Rendering marker ${index}: ${action.type} tracksViewChanges:`, !markersRendered);
          
          return (
            <Marker
              key={`${action.id}-${actions.length}`}
              coordinate={{
                latitude: action.location.latitude,
                longitude: action.location.longitude,
              }}
              tracksViewChanges={!markersRendered}
            >
              <View 
                style={styles.markerContainer}
                onLayout={() => {
                  if (!markersRendered && index === todayActions.length - 1) {
                    setMarkersRendered(true);
                  }
                }}
              >
                <View style={[styles.iconWrapper, { backgroundColor: markerColor }]}>
                  <IconComponent size={20} color="#ffffff" />
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#181818' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#1b1b1b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8a8a8a' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#373737' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3c3c3c' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#4e4e4e' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3d3d3d' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 10,
    textAlign: 'center',
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
});

