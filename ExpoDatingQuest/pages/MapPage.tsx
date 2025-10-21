import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Platform, Text, ActivityIndicator, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Users, MessageCircle, Heart, Clock } from 'lucide-react-native';
import { useLocation } from '../hooks/useLocation';
import { useActionsContext } from '../contexts/ActionsContext';
import { Map as MapConstants, Colors, ActionColors, ActionIcons } from '../constants';
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

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Users':
      return Users;
    case 'MessageCircle':
      return MessageCircle;
    case 'Heart':
      return Heart;
    case 'Clock':
      return Clock;
    default:
      return Users;
  }
};

const getIconForActionType = (type: ActionType) => {
  return getIconComponent(ActionIcons[type]);
};

export const MapPage: React.FC = () => {
  const { location, permissionGranted, error } = useLocation();
  const { actions, getDayActions, isLoading } = useActionsContext();
  const mapRef = useRef<any>(null);
  const hasAnimatedToLocation = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [markersRendered, setMarkersRendered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const actionsLengthRef = useRef(actions.length);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      setMarkersRendered(false);
      actionsLengthRef.current = actions.length;
      
      if (mapRef.current) {
        setMapReady(true);
      } else {
        setMapReady(false);
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
      
      return () => {
        setIsFocused(false);
      };
    }, [actions.length, fadeAnim])
  );

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

  const todayActions = React.useMemo(() => {
    if (!isFocused) return [];
    
    const dayActions = getDayActions(new Date().toDateString());
    
    const priorityOrder: Record<ActionType, number> = {
      missedOpportunity: 1,
      approach: 2,
      contact: 3,
      instantDate: 4,
    };
    
    return dayActions.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);
  }, [isFocused, actions.length, getDayActions]);

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
      {!mapReady && (
        <Animated.View style={[styles.loadingOverlay, { opacity: fadeAnim }]}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </Animated.View>
      )}
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={true}
        customMapStyle={darkMapStyle}
        onMapReady={() => {
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
          
          return (
            <Marker
              key={action.id}
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
    stylers: [{ color: MapConstants.textColor }],
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
    stylers: [{ color: MapConstants.textColor }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: MapConstants.textColor }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: MapConstants.textColor }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#181818' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: MapConstants.textColor }],
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
    stylers: [{ color: MapConstants.textColor }],
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
    stylers: [{ color: MapConstants.textColor }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [{ color: MapConstants.textColor }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: MapConstants.textColor }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.accent,
    marginTop: 10,
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

