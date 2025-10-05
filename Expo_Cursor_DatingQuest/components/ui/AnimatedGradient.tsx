import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const colorSets = [
  ['#667eea', '#764ba2', '#f093fb'],
  ['#f093fb', '#f5576c', '#feca57'],
  ['#4facfe', '#00f2fe', '#43e97b'],
  ['#fa709a', '#fee140', '#30cfd0'],
  ['#a8edea', '#fed6e3', '#f093fb'],
  ['#ff9a9e', '#fecfef', '#ffdde1'],
];

export const AnimatedGradient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorIndex = useRef(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const currentColors = useRef([...colorSets[0]]);
  const nextColors = useRef([...colorSets[1]]);

  useEffect(() => {
    const animate = () => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: false,
      }).start(() => {
        colorIndex.current = (colorIndex.current + 1) % colorSets.length;
        const nextIndex = (colorIndex.current + 1) % colorSets.length;
        
        currentColors.current = [...colorSets[colorIndex.current]];
        nextColors.current = [...colorSets[nextIndex]];
        
        animatedValue.setValue(0);
        animate();
      });
    };

    animate();
  }, []);

  const interpolateColors = (index: number) => {
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [currentColors.current[index], nextColors.current[index]],
    });
  };

  const color1 = interpolateColors(0);
  const color2 = interpolateColors(1);
  const color3 = interpolateColors(2);

  return (
    <Animated.View style={styles.container}>
      <LinearGradient
        colors={[color1, color2, color3] as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});
