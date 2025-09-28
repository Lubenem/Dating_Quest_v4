import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface MapComponentProps {
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, setUserLocation }) => {
  const mapRef = useRef<L.Map>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mapRef.current) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView(userLocation, 15);
    }
  }, [userLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
      },
      (error) => {
        console.error('Error getting location:', error);
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
  }, []);

  return (
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
        whenReady={() => setLoading(false)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
          maxZoom={19}
          subdomains={['a', 'b', 'c']}
        />
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background: #e74c3c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <b>📍 Your Location</b><br />
              Lat: {userLocation[0].toFixed(6)}<br />
              Lng: {userLocation[1].toFixed(6)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

const Map: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  return (
    <div className="page">
      <MapComponent userLocation={userLocation} setUserLocation={setUserLocation} />
    </div>
  );
};

export default Map;
