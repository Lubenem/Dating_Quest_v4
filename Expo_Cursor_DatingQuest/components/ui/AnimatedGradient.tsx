import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % colorSets.length);
        fadeAnim.setValue(0);
      });
    };

    const interval = setInterval(animate, 5000);
    animate();

    return () => clearInterval(interval);
  }, [nextIndex]);

  return (
    <>
      <LinearGradient
        colors={colorSets[currentIndex]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
      <Animated.View
        style={[
          styles.gradientOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={colorSets[nextIndex]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
