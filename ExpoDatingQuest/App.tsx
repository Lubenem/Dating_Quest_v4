/**
 * App.tsx - Main Application Component
 * 
 * This is the root of our Dating Quest app!
 * It sets up:
 * - ActionsProvider (global state)
 * - LinearGradient background
 * - Material Top Tabs navigation
 * - Dashboard and Map pages
 */

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, MapPin } from 'lucide-react-native';

// Import our context provider
import { ActionsProvider } from './contexts/ActionsContext';

// Import pages
import { DashboardPage } from './pages/DashboardPage';

/**
 * Placeholder Map Screen (will implement later)
 */
function MapScreen() {
  return (
    <View style={styles.screen}>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

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
            <Tab.Navigator
              initialRouteName="Dashboard"
              screenOptions={{
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: '#ffffff',
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '600',
                  textTransform: 'none',
                },
                tabBarStyle: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(255, 255, 255, 0.1)',
                },
                tabBarIndicatorStyle: {
                  backgroundColor: '#FFD700',
                  height: 3,
                },
                tabBarShowIcon: true,
                swipeEnabled: true,
              }}
              tabBarPosition="bottom"
            >
              <Tab.Screen 
                name="Dashboard" 
                component={DashboardPage}
                options={{
                  tabBarIcon: ({ color }) => <Home size={20} color={color} />,
                }}
              />
              <Tab.Screen 
                name="Map" 
                component={MapScreen}
                options={{
                  tabBarIcon: ({ color }) => <MapPin size={20} color={color} />,
                }}
              />
            </Tab.Navigator>
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
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
