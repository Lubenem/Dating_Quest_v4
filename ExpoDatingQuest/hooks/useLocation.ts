/**
 * useLocation Hook
 * 
 * This custom React hook handles all location-related functionality:
 * - Requesting location permissions
 * - Getting the user's current GPS coordinates
 * - Handling errors and permission denials
 * 
 * It works cross-platform (iOS, Android, Web) with platform-specific logic.
 */

import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Conditionally import expo-location only on native platforms
// This prevents bundling issues on web
let Location: any;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

/**
 * LocationObject - The shape of location data returned by expo-location
 * This matches the structure from Expo's Location.getCurrentPositionAsync()
 */
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

/**
 * useLocation Hook
 * 
 * @returns {object} Location state and functions
 * - location: Current GPS coordinates (or null if not available)
 * - permissionGranted: Whether user granted location permission
 * - error: Any error message from location services
 * - getCurrentLocation: Function to refresh location
 * - requestPermission: Function to request location permission
 * 
 * Example usage:
 * ```typescript
 * const { location, permissionGranted, error } = useLocation();
 * 
 * if (permissionGranted && location) {
 *   console.log('User is at:', location.coords.latitude, location.coords.longitude);
 * }
 * ```
 */
export const useLocation = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(Platform.OS === 'web');
  const [error, setError] = useState<string | null>(null);

  /**
   * Request location permission from the user
   * 
   * On mobile: Uses Expo Location API
   * On web: Automatically granted (browser handles permission)
   * 
   * @returns {Promise<boolean>} True if permission granted, false otherwise
   */
  const requestPermission = async (): Promise<boolean> => {
    // Web: Auto-grant (browser will show its own permission prompt)
    if (Platform.OS === 'web') {
      setPermissionGranted(true);
      setError(null);
      return true;
    }

    // Mobile: Request permission via Expo Location
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

  /**
   * Get the user's current GPS location
   * 
   * On mobile: Uses Expo Location with balanced accuracy
   * On web: Uses browser's geolocation API
   * 
   * @returns {Promise<LocationObject | null>} Current location or null if failed
   */
  const getCurrentLocation = async (): Promise<LocationObject | null> => {
    // Web implementation using browser geolocation API
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

    // Mobile implementation using Expo Location
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return null;

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Balance between accuracy and battery
      });
      
      setLocation(currentLocation);
      return currentLocation;
    } catch (err) {
      setError('Error getting current location');
      return null;
    }
  };

  /**
   * Effect: Get location on component mount
   * This automatically fetches the user's location when the hook is first used
   */
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


