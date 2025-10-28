import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, Flame, Users, MessageCircle, Heart, Clock } from 'lucide-react-native';
import { useActionsContext } from '../contexts/ActionsContext';
import { Colors, ActionColors } from '../constants';

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
          <Flame size={50} color={Colors.accent} fill={Colors.accent} strokeWidth={1.5} />
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
  const { getDayActions, setSelectedDate, selectedDate, getDailyGoalForDate, actions } = useActionsContext();
  const [viewDate, setViewDate] = useState(new Date());

  const selectedDateActions = useMemo(() => {
    const dateStr = selectedDate.toDateString();
    return getDayActions(dateStr);
  }, [selectedDate, getDayActions]);

  const selectedDateCounts = useMemo(() => {
    return {
      approach: selectedDateActions.filter(a => a.type === 'approach').length,
      contact: selectedDateActions.filter(a => a.type === 'contact').length,
      instantDate: selectedDateActions.filter(a => a.type === 'instantDate').length,
      missedOpportunity: selectedDateActions.filter(a => a.type === 'missedOpportunity').length,
    };
  }, [selectedDateActions]);

  const totalCounts = useMemo(() => {
    return {
      approach: actions.filter(a => a.type === 'approach').length,
      contact: actions.filter(a => a.type === 'contact').length,
      instantDate: actions.filter(a => a.type === 'instantDate').length,
      missedOpportunity: actions.filter(a => a.type === 'missedOpportunity').length,
    };
  }, [actions]);

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Convert getDay() from Sunday=0 to Monday=0 format
    // Sunday becomes 6, Monday becomes 0, etc.
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];
    
    // Add days from previous month to fill the first week
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    // Add days from next month to fill the last week(s)
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
    <View style={styles.container}>
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
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
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

      <View style={styles.statsContainer}>
        <View style={styles.statsBlock}>
          <Text style={styles.statsTitle}>Selected</Text>
          <View style={styles.statsItems}>
            <View style={styles.statsItem}>
              <View style={[styles.iconCircle, { backgroundColor: ActionColors.approach }]}>
                <Users size={20} color="#ffffff" />
              </View>
              <Text style={styles.statsCount}>{selectedDateCounts.approach}</Text>
            </View>
            <View style={styles.statsItem}>
              <View style={[styles.iconCircle, { backgroundColor: ActionColors.contact }]}>
                <MessageCircle size={20} color="#ffffff" />
              </View>
              <Text style={styles.statsCount}>{selectedDateCounts.contact}</Text>
            </View>
            <View style={styles.statsItem}>
              <View style={[styles.iconCircle, { backgroundColor: ActionColors.instantDate }]}>
                <Heart size={20} color="#ffffff" />
              </View>
              <Text style={styles.statsCount}>{selectedDateCounts.instantDate}</Text>
            </View>
            <View style={styles.statsItem}>
              <View style={[styles.iconCircle, { backgroundColor: ActionColors.missedOpportunity }]}>
                <Clock size={20} color="#ffffff" />
              </View>
              <Text style={styles.statsCount}>{selectedDateCounts.missedOpportunity}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsBlock}>
          <Text style={styles.statsTitle}>Total</Text>
          <View style={styles.statsItems}>
            <View style={styles.statsItem}>
              <View style={[styles.iconCircle, { backgroundColor: ActionColors.approach }]}>
                <Users size={20} color="#ffffff" />
              </View>
              <Text style={styles.statsCount}>{totalCounts.approach}</Text>
            </View>
            <View style={styles.statsItem}>
              <View style={[styles.iconCircle, { backgroundColor: ActionColors.contact }]}>
                <MessageCircle size={20} color="#ffffff" />
              </View>
              <Text style={styles.statsCount}>{totalCounts.contact}</Text>
            </View>
            <View style={styles.statsItem}>
              <View style={[styles.iconCircle, { backgroundColor: ActionColors.instantDate }]}>
                <Heart size={20} color="#ffffff" />
              </View>
              <Text style={styles.statsCount}>{totalCounts.instantDate}</Text>
            </View>
            <View style={styles.statsItem}>
              <View style={[styles.iconCircle, { backgroundColor: ActionColors.missedOpportunity }]}>
                <Clock size={20} color="#ffffff" />
              </View>
              <Text style={styles.statsCount}>{totalCounts.missedOpportunity}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
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
    marginTop: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayText: {
    width: '13%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayCell: {
    width: '13%',
    aspectRatio: 1,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  dayCellInactive: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  dayCellToday: {
    borderColor: '#ffffff',
  },
  dayCellSelected: {
    backgroundColor: 'transparent',
    borderColor: Colors.accent,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    zIndex: 10,
  },
  dayTextInactive: {
    color: '#ffffff',
    opacity: 0.2,
  },
  fireBackground: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    bottom: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statsBlock: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    margin: 0,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsItems: {
    gap: 8,
    alignItems: 'center',
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  statsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    minWidth: 24,
  },
});

