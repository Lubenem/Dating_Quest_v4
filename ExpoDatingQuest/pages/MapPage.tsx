import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Platform, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Users, MessageCircle, Heart, Clock } from 'lucide-react-native';
import { useLocation } from '../hooks/useLocation';
import { useActionsContext } from '../contexts/ActionsContext';
import { usePopup } from '../contexts/PopupContext';
import { Map as MapConstants, Colors, ActionColors, ActionIcons, MapTrail } from '../constants';
import { ActionType, Action } from '../types';
import { MapClusterPopup } from '../components/ui/MapClusterPopup';

let MapView: any;
let Marker: any;
let Callout: any;
let Circle: any;
let Polyline: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.default;
  Marker = RNMaps.Marker;
  Callout = RNMaps.Callout;
  Circle = RNMaps.Circle;
  Polyline = RNMaps.Polyline;
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

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getPriorityValue = (type: ActionType): number => {
  const priorityOrder: Record<ActionType, number> = {
    instantDate: 4,
    contact: 3,
    approach: 2,
    missedOpportunity: 1,
  };
  return priorityOrder[type];
};

type MarkerCluster = {
  id: string;
  actions: Action[];
  coordinate: { latitude: number; longitude: number };
  topAction: Action;
};

export const MapPage: React.FC = () => {
  const { location, permissionGranted, error } = useLocation();
  const { actions, getDayActions, isLoading, selectedDate } = useActionsContext();
  const { showMapClusterPopup } = usePopup();
  const mapRef = useRef<any>(null);
  const hasAnimatedToLocation = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [markersRendered, setMarkersRendered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      setMarkersRendered(false);
      
      if (mapRef.current) {
        setMapReady(true);
      } else {
        setMapReady(false);
      }
      
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    if (isFocused) {
      setMarkersRendered(false);
    }
  }, [selectedDate, isFocused]);

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

  const markerClusters = React.useMemo((): MarkerCluster[] => {
    if (!isFocused) return [];
    
    const selectedDateString = selectedDate.toDateString();
    const dayActions = getDayActions(selectedDateString);
    
    if (dayActions.length === 0) return [];

    const clusters: MarkerCluster[] = [];
    const processed = new Set<string>();

    dayActions.forEach((action) => {
      if (processed.has(action.id)) return;

      const nearbyActions: Action[] = [action];
      processed.add(action.id);

      dayActions.forEach((otherAction) => {
        if (processed.has(otherAction.id)) return;
        
        const distance = calculateDistance(
          action.location.latitude,
          action.location.longitude,
          otherAction.location.latitude,
          otherAction.location.longitude
        );

        if (distance <= MapConstants.clusterRadius) {
          nearbyActions.push(otherAction);
          processed.add(otherAction.id);
        }
      });

      nearbyActions.sort((a, b) => getPriorityValue(b.type) - getPriorityValue(a.type));
      const topAction = nearbyActions[0];

      clusters.push({
        id: `cluster-${topAction.id}`,
        actions: nearbyActions,
        coordinate: topAction.location,
        topAction,
      });
    });

    return clusters.sort((a, b) => getPriorityValue(a.topAction.type) - getPriorityValue(b.topAction.type));
  }, [isFocused, actions.length, getDayActions, selectedDate]);

  const trailCoordinates = React.useMemo(() => {
    const allActions = markerClusters.flatMap(cluster => cluster.actions);
    if (!isFocused || allActions.length < 2) return [];
    
    const sortedByTime = [...allActions].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    return sortedByTime.map(action => ({
      latitude: action.location.latitude,
      longitude: action.location.longitude,
    }));
  }, [markerClusters, isFocused]);

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

        {mapReady && MapTrail.display && trailCoordinates.length > 0 && (
          <Polyline
            coordinates={trailCoordinates}
            strokeColor={MapTrail.color}
            strokeWidth={MapTrail.width}
            zIndex={1}
          />
        )}

        {mapReady && markerClusters.map((cluster, index) => {
          const IconComponent = getIconForActionType(cluster.topAction.type);
          const markerColor = ActionColors[cluster.topAction.type];
          const zIndexValue = getPriorityValue(cluster.topAction.type) + 10;
          const isCluster = cluster.actions.length > 1;
          
          return (
            <Marker
              key={cluster.id}
              coordinate={cluster.coordinate}
              tracksViewChanges={!markersRendered}
              zIndex={zIndexValue}
              onPress={() => {
                showMapClusterPopup(cluster.actions);
              }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View 
                style={styles.markerWrapper}
                onLayout={() => {
                  if (!markersRendered && index === markerClusters.length - 1) {
                    setMarkersRendered(true);
                  }
                }}
              >
                <View style={styles.markerInner}>
                  <View style={[
                    styles.iconWrapper, 
                    { 
                      backgroundColor: markerColor,
                      borderColor: isCluster ? Colors.accent : '#ffffff'
                    }
                  ]}>
                    <IconComponent size={20} color={isCluster ? Colors.accent : '#ffffff'} />
                  </View>
                </View>
              </View>
              <Callout tooltip>
                <View />
              </Callout>
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
  markerWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

