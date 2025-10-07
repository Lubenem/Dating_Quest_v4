import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AnimatedGradient } from '../components/ui/AnimatedGradient';
import { DashboardContent } from '../components/Dashboard/DashboardContent';
import { MapContent } from '../components/Map/MapContent';
import { Colors } from '../constants';
import { Home, Map } from 'lucide-react-native';

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'map'>('dashboard');

  return (
    <AnimatedGradient>
      <View style={styles.container}>
        {/* Content */}
        <View style={styles.content}>
          {currentPage === 'dashboard' ? <DashboardContent /> : <MapContent />}
        </View>

        {/* Bottom Tab Navigation */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, currentPage === 'dashboard' && styles.tabActive]}
            onPress={() => setCurrentPage('dashboard')}
          >
            <Home
              size={24}
              color={currentPage === 'dashboard' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentPage === 'dashboard' && styles.tabTextActive]}>
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentPage === 'map' && styles.tabActive]}
            onPress={() => setCurrentPage('map')}
          >
            <Map
              size={24}
              color={currentPage === 'map' ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentPage === 'map' && styles.tabTextActive]}>
              Map
            </Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
