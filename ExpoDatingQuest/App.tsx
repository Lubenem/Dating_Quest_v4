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
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ActionsProvider } from './contexts/ActionsContext';
import { TopBar } from './components/bars/TopBar';
import { BottomBar } from './components/bars/BottomBar';

/**
 * Main App Component
 */
export default function App() {
  return (
    <ActionsProvider>
      <SafeAreaProvider>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <NavigationContainer
            theme={{
              dark: false,
              colors: {
                primary: '#8b5cf6',
                background: 'transparent',
                card: 'transparent',
                text: '#ffffff',
                border: 'transparent',
                notification: '#f093fb',
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
