import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Minus, Users, MessageCircle, Clock, XCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ActionType } from '../../types';
import { Colors } from '../../app/constants';

interface CounterButtonProps {
  type: ActionType;
  count: number;
  onIncrement: (type: ActionType) => void;
  onDecrement: (type: ActionType) => void;
  disabled?: boolean;
}

const getCounterConfig = (type: ActionType) => {
  switch (type) {
    case 'approach':
      return {
        label: 'Approaches',
        gradient: Colors.gradients.approach,
        icon: Users,
      };
    case 'contact':
      return {
        label: 'Contacts',
        gradient: Colors.gradients.contact,
        icon: MessageCircle,
      };
    case 'instantDate':
      return {
        label: 'Instant Dates',
        gradient: Colors.gradients.instantDate,
        icon: Clock,
      };
    case 'missedOpportunity':
      return {
        label: 'Missed Opportunities',
        gradient: Colors.gradients.missedOpportunity,
        icon: XCircle,
      };
  }
};

export const CounterButton: React.FC<CounterButtonProps> = ({
  type,
  count,
  onIncrement,
  onDecrement,
  disabled = false,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const config = getCounterConfig(type);
  const IconComponent = config?.icon;

  const handleIncrement = async () => {
    if (disabled) return;
    
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onIncrement(type);
  };

  const handleDecrement = async (event: any) => {
    event.stopPropagation();
    if (disabled || count === 0) return;
    
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onDecrement(type);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={styles.container}
        onPress={handleIncrement}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={config?.gradient || Colors.gradients.approach}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.iconContainer}>
            {IconComponent && <IconComponent size={32} color="white" />}
          </View>
          
          <TouchableOpacity
            style={[styles.minusButton, count === 0 && styles.minusButtonDisabled]}
            onPress={handleDecrement}
            disabled={count === 0}
            activeOpacity={0.7}
          >
            <Minus size={22} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.title}>{config?.label || 'Counter'}</Text>
          <Text style={styles.count}>{count}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  minusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  minusButtonDisabled: {
    opacity: 0.3,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 22,
  },
  count: {
    color: 'white',
    fontSize: 56,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
});

