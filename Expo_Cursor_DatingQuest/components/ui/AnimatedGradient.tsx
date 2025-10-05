import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const colorSets = [
  ['#667eea', '#764ba2', '#f093fb'],
  ['#f093fb', '#f5576c', '#feca57'],
  ['#4facfe', '#00f2fe', '#43e97b'],
  ['#fa709a', '#fee140', '#30cfd0'],
  ['#a8edea', '#fed6e3', '#f093fb'],
  ['#ff9a9e', '#fecfef', '#ffdde1'],
];

export const AnimatedGradient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(colorSets.length, {
        duration: colorSets.length * 5000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const index = Math.floor(progress.value) % colorSets.length;
    const nextIndex = (index + 1) % colorSets.length;
    const interpolation = progress.value % 1;

    const color1 = interpolateColor(
      interpolation,
      [0, 1],
      [colorSets[index][0], colorSets[nextIndex][0]]
    );
    const color2 = interpolateColor(
      interpolation,
      [0, 1],
      [colorSets[index][1], colorSets[nextIndex][1]]
    );
    const color3 = interpolateColor(
      interpolation,
      [0, 1],
      [colorSets[index][2], colorSets[nextIndex][2]]
    );

    return {
      colors: [color1, color2, color3],
    };
  });

  return (
    <AnimatedLinearGradient
      animatedProps={animatedProps}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </AnimatedLinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
