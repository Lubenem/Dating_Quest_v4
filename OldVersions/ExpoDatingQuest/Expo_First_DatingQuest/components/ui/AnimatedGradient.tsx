import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated as RNAnimated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const colorSets = [
  ['#667eea', '#764ba2', '#f093fb'],
  ['#4facfe', '#00f2fe', '#43e97b'],
  ['#a8edea', '#fed6e3', '#f093fb'],
  ['#ff9a9e', '#fecfef', '#ffdde1'],
  ['#f093fb', '#f5576c', '#feca57'],
  ['#fa709a', '#fee140', '#30cfd0'],
  ['#667eea', '#764ba2', '#f093fb'],
];

const WebAnimatedGradient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % colorSets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentColors = colorSets[currentIndex];

  return (
    <LinearGradient
      colors={currentColors as [string, string, ...string[]]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const NativeAnimatedGradient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const AnimatedLinearGradient = RNAnimated.createAnimatedComponent(LinearGradient);
  const animValue = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const animation = RNAnimated.loop(
      RNAnimated.timing(animValue, {
        toValue: colorSets.length - 1,
        duration: (colorSets.length - 1) * 20000,
        useNativeDriver: false,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const color1 = animValue.interpolate({
    inputRange: colorSets.map((_, i) => i),
    outputRange: colorSets.map(set => set[0]),
  });

  const color2 = animValue.interpolate({
    inputRange: colorSets.map((_, i) => i),
    outputRange: colorSets.map(set => set[1]),
  });

  const color3 = animValue.interpolate({
    inputRange: colorSets.map((_, i) => i),
    outputRange: colorSets.map(set => set[2]),
  });

  return (
    <AnimatedLinearGradient
      colors={[color1, color2, color3] as any}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </AnimatedLinearGradient>
  );
};

export const AnimatedGradient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (Platform.OS === 'web') {
    return <WebAnimatedGradient>{children}</WebAnimatedGradient>;
  }
  return <NativeAnimatedGradient>{children}</NativeAnimatedGradient>;
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
