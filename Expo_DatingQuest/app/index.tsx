import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedGradient } from '../components/ui/AnimatedGradient';
import { TopBar } from '../components/ui/TopBar';
import { DashboardContent } from '../components/Dashboard/DashboardContent';
import ReactNativeMapScreen from './react-map';
import { Colors } from '../constants';
import { Home, MapPin, Globe } from 'lucide-react-native';

let OpenStreetMapScreen: any = null;
if (Platform.OS === 'web') {
  OpenStreetMapScreen = require('./open-map').default;
}

type PageType = 'dashboard' | 'react-map' | 'open-map';

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  return (
    <AnimatedGradient>
      <View style={styles.container}>
        {/* Top Bar */}
        <TopBar />

        {/* Content with simple cross-fade */}
        <View style={styles.content}>
          <CrossFadeView active={currentPage === 'dashboard'}>
            <DashboardContent />
          </CrossFadeView>
          <CrossFadeView active={currentPage === 'react-map'}>
            <ReactNativeMapScreen />
          </CrossFadeView>
          {OpenStreetMapScreen && (
            <CrossFadeView active={currentPage === 'open-map'}>
              <OpenStreetMapScreen />
            </CrossFadeView>
          )}
        </View>

        {/* Bottom Tab Navigation */}
        <SafeAreaView style={styles.tabBarContainer} edges={['bottom']}>
          <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, currentPage === 'dashboard' && styles.tabActive]}
            onPress={() => setCurrentPage('dashboard')}
          >
            <Home
              size={20}
              color={currentPage === 'dashboard' ? Colors.selectedText : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentPage === 'dashboard' && styles.tabTextActive]}>
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentPage === 'react-map' && styles.tabActive]}
            onPress={() => setCurrentPage('react-map')}
          >
            <MapPin
              size={20}
              color={currentPage === 'react-map' ? Colors.selectedText : Colors.textSecondary}
            />
            <Text style={[styles.tabText, currentPage === 'react-map' && styles.tabTextActive]}>
              Map
            </Text>
          </TouchableOpacity>

            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={[styles.tab, currentPage === 'open-map' && styles.tabActive]}
                onPress={() => setCurrentPage('open-map')}
              >
                <Globe
                  size={20}
                  color={currentPage === 'open-map' ? Colors.selectedText : Colors.textSecondary}
                />
                <Text style={[styles.tabText, currentPage === 'open-map' && styles.tabTextActive]}>
                  Open Map
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>
    </AnimatedGradient>
  );
}

const CrossFadeView: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => {
  const opacity = useMemo(() => new Animated.Value(active ? 1 : 0), []);

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: active ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [active]);

  return (
    <Animated.View pointerEvents={active ? 'auto' : 'none'} style={[StyleSheet.absoluteFillObject, { opacity }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    alignSelf: 'stretch',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 0,
    marginHorizontal: 0,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  tabTextActive: {
    color: Colors.selectedText,
    fontWeight: '600',
  },
});
