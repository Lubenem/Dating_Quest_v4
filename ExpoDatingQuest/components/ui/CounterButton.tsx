/**
 * CounterButton Component
 * 
 * A beautiful, animated button for tracking actions!
 * Each button shows:
 * - An icon representing the action type
 * - The action label (e.g., "Approaches")
 * - Current count for today
 * - A minus button to undo (top-right corner)
 * 
 * Features:
 * - Gradient background (different color for each action type)
 * - Haptic feedback on tap (feels great!)
 * - Scale animation when pressed
 * - Shadow/elevation for depth
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Minus, Users, MessageCircle, Heart, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ActionType } from '../../types';
import { Colors, Layout, ActionIcons } from '../../constants';

const DISABLED_OPACITY = 0.7;

/**
 * Props for CounterButton
 */
interface CounterButtonProps {
  type: ActionType;                           // Which action type (approach, contact, etc.)
  count: number;                              // Current count to display
  onIncrement: (type: ActionType) => void;    // Function to call when button pressed
  onDecrement: (type: ActionType) => void;    // Function to call when minus pressed
  disabled?: boolean;                         // Disable interaction (e.g., no location permission)
  isToday?: boolean;                          // Whether viewing today's date
}

/**
 * Get icon component from icon name
 */
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Users':
      return Users;
    case 'MessageCircle':
      return MessageCircle;
    case 'Heart':
      return Heart;
    case 'Clock':
      return Clock;
    default:
      return Users;
  }
};

/**
 * Configuration for each action type
 * Maps action type to label, gradient colors, and icon
 */
const getCounterConfig = (type: ActionType) => {
  switch (type) {
    case 'approach':
      return {
        label: 'Approaches',
        gradient: Colors.gradients.approach,
        icon: getIconComponent(ActionIcons.approach),
      };
    case 'contact':
      return {
        label: 'Contacts',
        gradient: Colors.gradients.contact,
        icon: getIconComponent(ActionIcons.contact),
      };
    case 'instantDate':
      return {
        label: 'Instant Dates',
        gradient: Colors.gradients.instantDate,
        icon: getIconComponent(ActionIcons.instantDate),
      };
    case 'missedOpportunity':
      return {
        label: 'Missed Opportunities',
        gradient: Colors.gradients.missedOpportunity,
        icon: getIconComponent(ActionIcons.missedOpportunity),
      };
  }
};

/**
 * CounterButton Component
 */
export const CounterButton: React.FC<CounterButtonProps> = ({
  type,
  count,
  onIncrement,
  onDecrement,
  disabled = false,
  isToday = true,
}) => {
  // Animation value for scale effect
  const [scaleValue] = useState(new Animated.Value(1));
  
  // Get configuration for this action type
  const config = getCounterConfig(type);
  const IconComponent = config?.icon;

  /**
   * Handle increment (main button press)
   * - Triggers haptic feedback
   * - Plays scale-down then scale-up animation
   * - Calls the onIncrement callback
   */
  const handleIncrement = async () => {
    if (disabled) return;
    
    // Haptic feedback (vibration) - feels responsive!
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Animation: Scale down to 0.95, then back to 1
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

    // Call the increment function
    onIncrement(type);
  };

  /**
   * Handle decrement (minus button press)
   * - Triggers haptic feedback
   * - Plays scale-up then scale-down animation (opposite of increment)
   * - Calls the onDecrement callback
   * - Stops event from bubbling to parent (prevents double-tap)
   */
  const handleDecrement = async (event: any) => {
    event.stopPropagation(); // Don't trigger the main button
    if (disabled || count === 0) return;
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Animation: Scale up to 1.05, then back to 1
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

    // Call the decrement function
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
          {/* Icon in top-left corner */}
          <View style={[styles.iconContainer, disabled && isToday && styles.iconContainerDisabled]}>
            {IconComponent && <IconComponent size={32} color="white" />}
          </View>
          
          {/* Minus button in top-right corner */}
          <TouchableOpacity
            style={[styles.minusButton, (count === 0 || disabled) && styles.minusButtonDisabled]}
            onPress={handleDecrement}
            disabled={count === 0 || disabled}
            activeOpacity={0.7}
          >
            <Minus size={22} color="white" />
          </TouchableOpacity>
          
          {/* Label text */}
          <Text style={[styles.title, disabled && isToday && styles.textDisabled]}>{config?.label || 'Counter'}</Text>
          
          {/* Count number (big and bold!) */}
          <Text style={[styles.count, disabled && isToday && styles.textDisabled, !isToday && styles.textPastDate]}>{count}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * Styles for CounterButton
 */
const styles = StyleSheet.create({
  container: {
    width: Layout.counterWidth,
    height: Layout.counterHeight,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    
    // Shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      // Elevation for Android
      android: {
        elevation: 8,
      },
    }),
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
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  iconContainerDisabled: {
    opacity: DISABLED_OPACITY,
  },
  minusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
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
    lineHeight: 22,
  },
  count: {
    color: 'white',
    fontSize: 56,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textDisabled: {
    opacity: DISABLED_OPACITY,
  },
  textPastDate: {
    color: Colors.accent,
  },
});


