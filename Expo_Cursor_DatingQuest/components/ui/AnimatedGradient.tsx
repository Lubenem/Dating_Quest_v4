import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
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
  const [colorIndex, setColorIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colorSets.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <LinearGradient
      colors={colorSets[colorIndex]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
