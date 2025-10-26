/**
 * App.tsx - Main Application Component
 * 
 * This is the root of our Dating Quest app!
 * It sets up:
 * - ActionsProvider (global state)
 * - LinearGradient background
 * - TopBar (persistent progress bar)
 * - BottomBar (tab navigation)
 */

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ActionsProvider, useActionsContext } from './contexts/ActionsContext';
import { TopBar } from './components/bars/TopBar';
import { BottomBar } from './components/bars/BottomBar';
import { LoadingOverlay } from './components/ui/LoadingOverlay';
import { Colors } from './constants';

const AppContent: React.FC = () => {
  const { permissionGranted, userLocation } = useActionsContext();
  const shouldShowLoader = permissionGranted && !userLocation;

  return (
    <>
      <NavigationContainer
        theme={{
          dark: false,
          colors: {
            primary: Colors.primary,
            background: 'transparent',
            card: 'transparent',
            text: Colors.text,
            border: 'transparent',
            notification: Colors.secondary,
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            },
          },
        }}
      >
        <TopBar />
        <BottomBar />
      </NavigationContainer>
      {shouldShowLoader && <LoadingOverlay />}
    </>
  );
};

/**
 * Main App Component
 */
export default function App() {
  return (
    <ActionsProvider>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#000000"
          translucent={Platform.OS === 'android'}
        />
        <LinearGradient
          colors={Colors.gradients.background}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <AppContent />
        </LinearGradient>
      </SafeAreaProvider>
    </ActionsProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
