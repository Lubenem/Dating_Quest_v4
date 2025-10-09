import React from 'react';
import { Platform } from 'react-native';
import ReactNativeMapScreen from '../app/react-map';

let OpenStreetMapScreen: any = null;
if (Platform.OS === 'web') {
  OpenStreetMapScreen = require('../app/open-map').default;
}

export const MapScreen: React.FC = () => {
  if (Platform.OS === 'web' && OpenStreetMapScreen) {
    return <OpenStreetMapScreen />;
  }
  return <ReactNativeMapScreen />;
};

