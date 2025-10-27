import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react-native';
import { useActionsContext } from '../contexts/ActionsContext';
import { Colors } from '../constants';

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onPress: () => void;
  getDayActions: (dateStr: string) => any[];
  getDailyGoalForDate: (dateStr: string) => Promise<number>;
}

const DayCell: React.FC<DayCellProps> = ({ 
  date, 
  isCurrentMonth, 
  isToday: isTodayDate, 
  isSelected: isSelectedDate, 
  onPress,
  getDayActions,
  getDailyGoalForDate
}) => {
  const [goalMet, setGoalMet] = useState(false);

  useEffect(() => {
    const checkGoal = async () => {
      if (!isCurrentMonth) {
        setGoalMet(false);
        return;
      }

      const dateStr = date.toDateString();
      const dayActions = getDayActions(dateStr);
      const approaches = dayActions.filter(a => a.type !== 'missedOpportunity').length;
      const dayGoal = await getDailyGoalForDate(dateStr);
      
      setGoalMet(approaches >= dayGoal);
    };

    checkGoal();
  }, [date, isCurrentMonth, getDayActions, getDailyGoalForDate]);

  return (
    <TouchableOpacity
      style={[
        styles.dayCell,
        !isCurrentMonth && styles.dayCellInactive,
        isTodayDate && styles.dayCellToday,
        isSelectedDate && styles.dayCellSelected,
      ]}
      onPress={onPress}
      disabled={!isCurrentMonth}
    >
      {goalMet && (
        <View style={styles.fireBackground}>
          <Flame size={38} color={Colors.accent} fill={Colors.accent} strokeWidth={1.5} />
        </View>
      )}
      
      <Text
        style={[
          styles.dayText,
          !isCurrentMonth && styles.dayTextInactive,
        ]}
      >
        {date.getDate()}
      </Text>
    </TouchableOpacity>
  );
};

export const CalendarPage: React.FC = () => {
  const { getDayActions, setSelectedDate, selectedDate, getDailyGoalForDate } = useActionsContext();
  const [viewDate, setViewDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];
    
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [viewDate]);

  const goToPreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>{monthName}</Text>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <ChevronRight size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarData.map((day, index) => (
          <DayCell
            key={index}
            date={day.date}
            isCurrentMonth={day.isCurrentMonth}
            isToday={isToday(day.date)}
            isSelected={isSelected(day.date)}
            onPress={() => handleDayPress(day.date)}
            getDayActions={getDayActions}
            getDailyGoalForDate={getDailyGoalForDate}
          />
        ))}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendGrid}>
          <View style={styles.legendItem}>
            <Flame size={16} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.legendText}>Daily goal reached</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    opacity: 0.7,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  dayCell: {
    width: '14.6%',
    
    aspectRatio: 1,
    padding: 4,
    marginHorizontal: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 6,
    position: 'relative',
  },
  dayCellInactive: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  dayCellToday: {
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  dayCellSelected: {
    backgroundColor: 'transparent',
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    zIndex: 10,
  },
  dayTextInactive: {
    color: Colors.textSecondary,
    opacity: 0.3,
  },
  fireBackground: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  legend: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

