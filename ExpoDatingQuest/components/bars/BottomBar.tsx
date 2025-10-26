import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Home, MapPin } from 'lucide-react-native';
import { DashboardPage } from '../../pages/DashboardPage';
import { MapPage } from '../../pages/MapPage';
import { Colors } from '../../constants';
import { useActionsContext } from '../../contexts/ActionsContext';

const Tab = createMaterialTopTabNavigator();

export const BottomBar: React.FC = () => {
  const { appMode } = useActionsContext();
  
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
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
          elevation: 0,
        },
        tabBarContentContainerStyle: {
          padding:0,
          paddingBottom: 15,
          margin: 0,
        },
        tabBarItemStyle: {
          padding: 0,
          paddingVertical: 8,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.accent,
          height: 2,
          top: 0,
        },
        tabBarPressColor: 'rgba(255, 255, 255, 0.1)',
        tabBarShowIcon: true,
        swipeEnabled: appMode === 'fullscale',
        lazy: false,
        lazyPreloadDistance: 0,
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
      {appMode === 'fullscale' && (
        <Tab.Screen 
          name="Map" 
          component={MapPage}
          options={{
            tabBarIcon: ({ color }) => <MapPin size={20} color={color} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
};
