import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AnimatedGradient } from '../components/ui/AnimatedGradient';
import { TopBar } from '../components/navigation/TopBar';
import { BottomBar } from '../components/navigation/BottomBar';
import { AnimatedPageContainer } from '../components/navigation/AnimatedPageContainer';
import { DashboardScreen } from '../screens/DashboardScreen';
import { MapScreen } from '../screens/MapScreen';

function PageContainer() {
  return (
    <AnimatedPageContainer>
      <DashboardScreen />
      <MapScreen />
    </AnimatedPageContainer>
  );
}

export default function HomeScreen() {
  return (
    <AnimatedGradient>
      <View style={styles.container}>
        <TopBar />
        
        <View style={styles.content}>
          <BottomBar DummyComponent={PageContainer} />
        </View>
      </View>
    </AnimatedGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
});
