import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MapPin, Globe } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../app/constants';

const Tab = createBottomTabNavigator();

interface BottomBarProps {
  DummyComponent: React.ComponentType;
}

export const BottomBar: React.FC<BottomBarProps> = ({ DummyComponent }) => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          paddingBottom: insets.bottom,
          elevation: 0,
          height: 85,
        },
        tabBarActiveTintColor: Colors.selectedText,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 2,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        lazy: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DummyComponent}
        options={{
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      
      <Tab.Screen
        name={Platform.OS === 'web' ? "Open Map" : "Map"}
        component={DummyComponent}
        options={{
          tabBarIcon: ({ color }) => (
            Platform.OS === 'web' ? 
              <Globe size={20} color={color} /> : 
              <MapPin size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

