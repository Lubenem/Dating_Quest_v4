import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { Animation } from '../../app/constants';

interface AnimatedPageContainerProps {
  children: [React.ReactNode, React.ReactNode];
}

export const AnimatedPageContainer: React.FC<AnimatedPageContainerProps> = ({ children }) => {
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;
  const routeIndex = useNavigationState(state => state?.index ?? 0);

  useEffect(() => {
    if (__DEV__) {
      console.log('[ANIM] routeIndex changed:', routeIndex, 'sliding to:', -routeIndex * width);
    }
    Animated.timing(translateX, {
      toValue: -routeIndex * width,
      duration: Animation.pageTransitionMs,
      useNativeDriver: true,
    }).start();
  }, [routeIndex, width]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pager, { width: width * 2, transform: [{ translateX }] }]}>
        <View style={{ width, flex: 1 }}>
          {children[0]}
        </View>
        <View style={{ width, flex: 1 }}>
          {children[1]}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  pager: {
    flexDirection: 'row',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

