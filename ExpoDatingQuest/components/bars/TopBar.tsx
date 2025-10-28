import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react-native';
import { useActionsContext } from '../../contexts/ActionsContext';
import { usePopup } from '../../contexts/PopupContext';
import { Colors, App as AppConstants } from '../../constants';

export const TopBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { counters, selectedDateGoal, currentLevel, streak, selectedDate, setSelectedDate, isToday } = useActionsContext();
  const { showLevelUpPopup } = usePopup();

  const progress = selectedDateGoal > 0 ? (counters.approaches / selectedDateGoal) * 100 : 0;
  const progressClamped = Math.min(progress, 100);

  const showFireIcon = streak >= AppConstants.streakThresholds.twoFires;

  const goToPreviousDay = async () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    await setSelectedDate(newDate);
  };

  const goToNextDay = async () => {
    if (isToday) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    await setSelectedDate(newDate);
  };

  const goToToday = async () => {
    await setSelectedDate(new Date());
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.levelContainer}
          onPress={() => showLevelUpPopup(currentLevel)}
          activeOpacity={0.7}
        >
          <Text style={styles.levelText}>Lvl {currentLevel ?? 1}</Text>
          {showFireIcon && (
            <Flame size={14} color={Colors.accent} fill={Colors.accent} />
          )}
        </TouchableOpacity>
        
        <View style={styles.datePickerContainer}>
          <TouchableOpacity 
            onPress={goToPreviousDay} 
            style={styles.dateArrow}
            hitSlop={{ top: 10, bottom: 10, left: 15, right: 15 }}
          >
            <ChevronLeft size={20} color={Colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={isToday ? undefined : goToToday} 
            style={styles.dateDisplay}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Text style={[styles.dateText, !isToday && styles.dateTextPast]}>
              {formatDate(selectedDate)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={goToNextDay} 
            style={styles.dateArrow}
            disabled={isToday}
            hitSlop={{ top: 10, bottom: 10, left: 15, right: 15 }}
          >
            <ChevronRight 
              size={20} 
              color={Colors.text}
              opacity={isToday ? 0.3 : 1}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.progressContainer}
          onPress={() => showLevelUpPopup(currentLevel)}
          activeOpacity={0.7}
        >
          <Text style={styles.progressText}>
            {counters.approaches} / {selectedDateGoal}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progressClamped}%` }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  levelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 70,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  dateArrow: {
    padding: 0,
    paddingHorizontal: 15,
  },
  dateDisplay: {
    paddingHorizontal: 6,
    paddingVertical: 0,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 80,
    textAlign: 'center',
  },
  dateTextPast: {
    color: Colors.accent,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'flex-end',
    minWidth: 60,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
});

