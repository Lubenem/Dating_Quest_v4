import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useActions } from '../hooks/useActions';
import type { Action, ActionType } from '../types';

// Cluster interface for grouping nearby actions
interface ActionCluster {
  id: string;
  center: [number, number];
  actions: Action[];
  count: number;
  hasCurrentLocation: boolean;
}

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Action type colors
const getActionColor = (type: ActionType): string => {
  switch (type) {
    case 'approach': return '#667eea';
    case 'contact': return '#f093fb';
    case 'instantDate': return '#4facfe';
    case 'plannedDate': return '#43e97b';
    default: return '#8b5cf6';
  }
};

// Create custom icons for actions
const createActionIcon = (type: ActionType) => {
  const color = getActionColor(type);
  return L.divIcon({
    className: 'action-marker',
    html: `<div style="
      background: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      z-index: 1000;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// Create cluster icon for multiple actions
const createClusterIcon = (count: number, hasCurrentLocation: boolean = false) => {
  const size = Math.min(20 + count * 2, 40); // Scale with count, max 40px
  const background = hasCurrentLocation 
    ? 'linear-gradient(135deg, #000000 0%, #333333 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)';
  
  return L.divIcon({
    className: 'cluster-marker',
    html: `<div style="
      background: ${background};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: ${Math.min(12 + count, 16)}px;
      z-index: 1000;
    ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

// Create current location icon
const createCurrentLocationIcon = () => {
  return L.divIcon({
    className: 'current-location-marker',
    html: `<div style="
      background: #000000;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.4);
      z-index: 1;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Clustering function to group nearby actions and current location
const clusterActions = (actions: Action[], userLocation: [number, number] | null, clusterRadius: number = 0.0005): ActionCluster[] => {
  const clusters: ActionCluster[] = [];
  const processed = new Set<string>();

  actions.forEach((action, index) => {
    if (processed.has(action.id)) return;

    const cluster: ActionCluster = {
      id: `cluster-${index}`,
      center: [action.location.latitude, action.location.longitude],
      actions: [action],
      count: 1,
      hasCurrentLocation: false
    };

    // Check if this action is near user's current location
    if (userLocation) {
      const distanceToUser = Math.sqrt(
        Math.pow(action.location.latitude - userLocation[0], 2) +
        Math.pow(action.location.longitude - userLocation[1], 2)
      );

      if (distanceToUser <= clusterRadius) {
        cluster.hasCurrentLocation = true;
        cluster.center = userLocation; // Use user location as center
      }
    }

    // Find nearby actions
    actions.forEach((otherAction) => {
      if (otherAction.id === action.id || processed.has(otherAction.id)) return;
      
      const distance = Math.sqrt(
        Math.pow(action.location.latitude - otherAction.location.latitude, 2) +
        Math.pow(action.location.longitude - otherAction.location.longitude, 2)
      );

      if (distance <= clusterRadius) {
        cluster.actions.push(otherAction);
        cluster.count++;
        processed.add(otherAction.id);
      }
    });

    // Calculate cluster center if not using user location
    if (cluster.count > 1 && !cluster.hasCurrentLocation) {
      const avgLat = cluster.actions.reduce((sum, a) => sum + a.location.latitude, 0) / cluster.count;
      const avgLng = cluster.actions.reduce((sum, a) => sum + a.location.longitude, 0) / cluster.count;
      cluster.center = [avgLat, avgLng];
    }

    clusters.push(cluster);
    processed.add(action.id);
  });

  return clusters;
};

const Map: React.FC = () => {
  const { getDayActions, refreshTrigger } = useActions();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [actionClusters, setActionClusters] = useState<ActionCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<L.Map>(null);

  // Load all actions from localStorage
  const loadAllActions = () => {
    const allActions: Action[] = [];
    
    // Get all localStorage keys (dates)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.match(/^[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4}$/)) { // Date pattern
        const dayActions = getDayActions(key);
        allActions.push(...dayActions);
      }
    }
    
    // Cluster nearby actions and current location
    const clusters = clusterActions(allActions, userLocation);
    
    // If no actions exist but we have location, create a location-only cluster
    if (allActions.length === 0 && userLocation) {
      const locationCluster: ActionCluster = {
        id: 'location-only',
        center: userLocation,
        actions: [],
        count: 0,
        hasCurrentLocation: true
      };
      clusters.push(locationCluster);
    }
    
    setActionClusters(clusters);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
    loadAllActions();
  }, []);

  // Refresh action data every time the map route is accessed
  useEffect(() => {
    if (location.pathname === '/map') {
      loadAllActions();
    }
  }, [location.pathname]);

  // Refresh action data when actions are added/removed
  useEffect(() => {
    loadAllActions();
  }, [refreshTrigger]);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15);
    }
  }, [userLocation]);

  const formatActionDetails = (action: Action): string => {
    const date = new Date(action.timestamp);
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    const actionType = action.type.charAt(0).toUpperCase() + action.type.slice(1);
    const coordinates = `${action.location.latitude.toFixed(4)}, ${action.location.longitude.toFixed(4)}`;
    const notes = action.notes ? `Notes: ${action.notes}` : '';
    
    return `${actionType}\n${dateStr} at ${timeStr}\n${coordinates}\n${notes}`;
  };


  return (
    <div className="page map">
      <div className="map-container">
        {loading && (
          <div className="map-loading">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading map...</div>
          </div>
        )}
        <MapContainer
          ref={mapRef}
          center={[40.7128, -74.0060]} // Default to NYC
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false} // Remove zoom controls
          attributionControl={false} // Remove attribution
          whenReady={() => setLoading(false)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
            maxZoom={19}
            subdomains={['a', 'b', 'c']}
            opacity={0.7} // Make map tiles less bright
          />
          
          {/* Action clusters (including current location if nearby) */}
          {actionClusters.map((cluster) => (
            <Marker
              key={cluster.id}
              position={cluster.center}
              icon={
                cluster.count === 0 ? 
                  createCurrentLocationIcon() : // Location-only marker
                  cluster.count === 1 ? 
                    createActionIcon(cluster.actions[0].type) : 
                    createClusterIcon(cluster.count, cluster.hasCurrentLocation)
              }
            >
              <Popup>
                {cluster.count === 0 ? (
                  // Location-only popup
                  <div>
                    <b>📍 Your Current Location</b><br />
                    Lat: {cluster.center[0].toFixed(6)}<br />
                    Lng: {cluster.center[1].toFixed(6)}
                  </div>
                ) : cluster.count === 1 ? (
                  cluster.hasCurrentLocation ? (
                    <div>
                      <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#000' }}>
                        📍 Your Current Location
                      </div>
                      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                        {cluster.actions[0].type.charAt(0).toUpperCase() + cluster.actions[0].type.slice(1)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(cluster.actions[0].timestamp).toLocaleString()}
                      </div>
                      {cluster.actions[0].notes && (
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                          {cluster.actions[0].notes}
                        </div>
                      )}
                    </div>
                  ) : (
                    formatActionDetails(cluster.actions[0])
                  )
                ) : (
                  <div>
                    <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                      {cluster.hasCurrentLocation ? '📍 Your Location + ' : ''}{cluster.count} actions
                    </div>
                    {cluster.actions.map((action) => (
                      <div key={action.id} style={{ marginBottom: '8px', padding: '5px', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontWeight: 'bold', color: getActionColor(action.type) }}>
                          {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {new Date(action.timestamp).toLocaleString()}
                        </div>
                        {action.notes && (
                          <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                            {action.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
          
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
