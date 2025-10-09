import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../../app/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SwipeablePagesProps {
  pages: Array<{
    key: string;
    title: string;
    component: React.ReactNode;
  }>;
  initialPage?: number;
}

export const SwipeablePages: React.FC<SwipeablePagesProps> = ({ 
  pages, 
  initialPage = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialPage);
  const translateX = useSharedValue(-initialPage * SCREEN_WIDTH);
  const startX = useSharedValue(0);

  const updateIndex = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  // Edge swipe zones (from left or right edge only)
  const EDGE_SWIPE_WIDTH = 50;

  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((event, stateManager) => {
      // Only activate if starting from left or right edge
      const touchX = event.allTouches[0]?.x ?? 0;
      const fromLeftEdge = touchX < EDGE_SWIPE_WIDTH;
      const fromRightEdge = touchX > SCREEN_WIDTH - EDGE_SWIPE_WIDTH;
      
      if (fromLeftEdge || fromRightEdge) {
        stateManager.activate();
      } else {
        stateManager.fail();
      }
    })
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const newTranslateX = startX.value + event.translationX;
      const minTranslate = -(pages.length - 1) * SCREEN_WIDTH;
      const maxTranslate = 0;
      
      translateX.value = Math.max(minTranslate, Math.min(maxTranslate, newTranslateX));
    })
    .onEnd((event) => {
      const threshold = SCREEN_WIDTH * 0.3;
      let newIndex = currentIndex;
      
      if (event.translationX < -threshold && currentIndex < pages.length - 1) {
        newIndex = currentIndex + 1;
      } else if (event.translationX > threshold && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }

      translateX.value = withSpring(-newIndex * SCREEN_WIDTH, {
        damping: 20,
        stiffness: 90,
      });

      if (newIndex !== currentIndex) {
        runOnJS(updateIndex)(newIndex);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const goToPage = (index: number) => {
    translateX.value = withSpring(-index * SCREEN_WIDTH, {
      damping: 20,
      stiffness: 90,
    });
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.pagesContainer, animatedStyle]}>
          {pages.map((page, index) => (
            <View key={page.key} style={styles.page}>
              {page.component}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>

      <View style={styles.indicator}>
        {pages.map((page, index) => (
          <TouchableOpacity
            key={page.key}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
            onPress={() => goToPage(index)}
          >
            <Text style={[
              styles.dotLabel,
              currentIndex === index && styles.activeDotLabel,
            ]}>
              {page.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagesContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    width: SCREEN_WIDTH,
  },
  indicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  activeDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  dotLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  activeDotLabel: {
    color: Colors.primary,
  },
});
