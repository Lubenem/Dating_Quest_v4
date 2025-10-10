import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

let Location: any;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

type LocationObject = {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
};

export const useLocation = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(Platform.OS === 'web');
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      setPermissionGranted(true);
      setError(null);
      return true;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setPermissionGranted(false);
        return false;
      }
      setPermissionGranted(true);
      setError(null);
      return true;
    } catch (err) {
      setError('Error requesting location permission');
      setPermissionGranted(false);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      if ('geolocation' in navigator) {
        return new Promise<LocationObject | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const webLocation: LocationObject = {
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  altitude: position.coords.altitude,
                  accuracy: position.coords.accuracy,
                  altitudeAccuracy: position.coords.altitudeAccuracy,
                  heading: position.coords.heading,
                  speed: position.coords.speed,
                },
                timestamp: position.timestamp,
              };
              setLocation(webLocation);
              setPermissionGranted(true);
              setError(null);
              resolve(webLocation);
            },
            (error) => {
              setError('Web geolocation error: ' + error.message);
              setPermissionGranted(false);
              resolve(null);
            }
          );
        });
      } else {
        setError('Geolocation not supported in this browser');
        setPermissionGranted(false);
        return null;
      }
    }

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return null;

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(currentLocation);
      return currentLocation;
    } catch (err) {
      setError('Error getting current location');
      return null;
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    permissionGranted,
    error,
    getCurrentLocation,
    requestPermission,
  };
};

