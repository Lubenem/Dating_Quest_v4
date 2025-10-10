import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, MapPin } from 'lucide-react-native';

// Dashboard Screen
function DashboardScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to Dating Quest!</Text>
      <Text style={styles.info}>✨ Swipe horizontally to see the Map!</Text>
      <Text style={styles.info}>Or tap the Map icon at the bottom</Text>
    </View>
  );
}

// Map Screen
function MapScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Map</Text>
      <Text style={styles.subtitle}>Your location-based actions</Text>
      <Text style={styles.info}>✨ Swipe horizontally to go back to Dashboard!</Text>
      <Text style={styles.info}>Or tap the Dashboard icon at the bottom</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
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
            tabBarIconStyle: {
              width: 24,
              height: 24,
            },
            swipeEnabled: true, // Enable horizontal swipe!
          }}
          tabBarPosition="bottom" // Position tabs at bottom!
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 30,
    opacity: 0.8,
  },
  info: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 8,
  },
});