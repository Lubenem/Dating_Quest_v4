import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Home, MapPin } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { DashboardPage } from '../../pages/DashboardPage';

const Tab = createMaterialTopTabNavigator();

function MapScreen() {
  return (
    <View style={styles.screen}>
    </View>
  );
}

export const BottomBar: React.FC = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

