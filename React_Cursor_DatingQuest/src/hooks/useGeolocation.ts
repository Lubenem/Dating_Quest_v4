import { useState, useEffect } from 'react';
import type { LocationData } from '../types';

interface GeolocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
    permissionGranted: false,
  });

  const requestLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location: ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Position unavailable';
              break;
            case error.TIMEOUT:
              errorMessage += 'Request timeout';
              break;
            default:
              errorMessage += 'Unknown error';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  const checkPermission = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const location = await requestLocation();
      
      setState({
        location,
        loading: false,
        error: null,
        permissionGranted: true,
      });
    } catch (error) {
      setState({
        location: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        permissionGranted: false,
      });
    }
  };

  const getCurrentLocation = async (): Promise<LocationData> => {
    if (state.location && state.permissionGranted) {
      // Return cached location if it's recent (less than 5 minutes old)
      const locationAge = Date.now() - new Date(state.location.timestamp).getTime();
      if (locationAge < 300000) { // 5 minutes
        return state.location;
      }
    }
    
    return await requestLocation();
  };

  useEffect(() => {
    // Check geolocation permission on app load
    const initGeolocation = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const location = await requestLocation();
        
        setState({
          location,
          loading: false,
          error: null,
          permissionGranted: true,
        });
      } catch (error) {
        setState({
          location: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          permissionGranted: false,
        });
      }
    };

    initGeolocation();
  }, []); // Empty dependency array to run only once

  return {
    ...state,
    checkPermission,
    getCurrentLocation,
  };
};
