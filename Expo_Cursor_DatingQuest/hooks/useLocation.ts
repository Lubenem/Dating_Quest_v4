import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
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

