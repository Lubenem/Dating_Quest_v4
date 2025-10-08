import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { AnimatedGradient } from '../components/ui/AnimatedGradient';
import { DashboardContent } from '../components/Dashboard/DashboardContent';
import ExpoMapScreen from './expo-map';
import ReactNativeMapScreen from './react-map';
import OpenStreetMapScreen from './open-map';
import { Colors } from '../constants';
import { Home, Map, MapPin, Globe } from 'lucide-react-native';

type PageType = 'dashboard' | 'expo-map' | 'react-map' | 'open-map';

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  return (
    <AnimatedGradient>
      <View style={styles.container}>
        {/* Content */}
        <View style={styles.content}>
          {currentPage === 'dashboard' && <DashboardContent />}
          {currentPage === 'expo-map' && <ExpoMapScreen />}
          {currentPage === 'react-map' && <ReactNativeMapScreen />}
          {currentPage === 'open-map' && <OpenStreetMapScreen />}
        </View>

        {/* Bottom Tab Navigation */}
        <ScrollView 
          horizontal 
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[styles.tab, currentPage === 'dashboard' && styles.tabActive]}
            onPress={() => setCurrentPage('dashboard')}
          >
            <Home
              size={20}
              color={currentPage === 'dashboard' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentPage === 'dashboard' && styles.tabTextActive]}>
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentPage === 'expo-map' && styles.tabActive]}
            onPress={() => setCurrentPage('expo-map')}
          >
            <Map
              size={20}
              color={currentPage === 'expo-map' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentPage === 'expo-map' && styles.tabTextActive]}>
              Expo Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentPage === 'react-map' && styles.tabActive]}
            onPress={() => setCurrentPage('react-map')}
          >
            <MapPin
              size={20}
              color={currentPage === 'react-map' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentPage === 'react-map' && styles.tabTextActive]}>
              React Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentPage === 'open-map' && styles.tabActive]}
            onPress={() => setCurrentPage('open-map')}
          >
            <Globe
              size={20}
              color={currentPage === 'open-map' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentPage === 'open-map' && styles.tabTextActive]}>
              Open Map
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
