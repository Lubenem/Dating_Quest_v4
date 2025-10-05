import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated as RNAnimated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedLinearGradient =
  RNAnimated.createAnimatedComponent(LinearGradient);

const colorSets = [
  ["#667eea", "#764ba2", "#f093fb"],
  ["#f093fb", "#f5576c", "#feca57"],
  ["#4facfe", "#00f2fe", "#43e97b"],
  ["#fa709a", "#fee140", "#30cfd0"],
  ["#a8edea", "#fed6e3", "#f093fb"],
  ["#ff9a9e", "#fecfef", "#ffdde1"],
  ["#667eea", "#764ba2", "#f093fb"],
];

export const AnimatedGradient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const animValue = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const animation = RNAnimated.loop(
      RNAnimated.timing(animValue, {
        toValue: colorSets.length,
        duration: colorSets.length * 20000,
        useNativeDriver: false,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const allColors = colorSets.flat();

  const color1 = animValue.interpolate({
    inputRange: colorSets.map((_, i) => i),
    outputRange: colorSets.map((set) => set[0]),
  });

  const color2 = animValue.interpolate({
    inputRange: colorSets.map((_, i) => i),
    outputRange: colorSets.map((set) => set[1]),
  });

  const color3 = animValue.interpolate({
    inputRange: colorSets.map((_, i) => i),
    outputRange: colorSets.map((set) => set[2]),
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

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
