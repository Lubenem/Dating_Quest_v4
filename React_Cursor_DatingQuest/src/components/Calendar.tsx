import React, { useState, useEffect } from 'react';
import { useActions } from '../hooks/useActions';
import type { Counters } from '../types';

const Calendar: React.FC = () => {
  const { getDayCounters } = useActions();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayDetails, setDayDetails] = useState<Counters>({
    approaches: 0,
    contacts: 0,
    instantDates: 0,
    plannedDates: 0,
  });

  useEffect(() => {
    // Set today as selected by default
    const today = new Date();
    setSelectedDay(today);
    updateDayDetails(today);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const updateDayDetails = (date: Date) => {
    const dateString = date.toDateString();
    const counters = getDayCounters(dateString);
    setDayDetails(counters);
  };

  const selectDay = (date: Date) => {
    setSelectedDay(date);
    updateDayDetails(date);
  };

  const previousMonth = () => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const generateCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const today = new Date();
    const currentDateStr = today.toDateString();
    
    const days = [];
    
    // Add day headers
    dayHeaders.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="calendar-day-header">
          {day}
        </div>
      );
    });
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      if (date.getMonth() === month) {
        const dateString = date.toDateString();
        const counters = getDayCounters(dateString);
        const total = Object.values(counters).reduce((sum, val) => sum + val, 0);
        
        const isToday = dateString === currentDateStr;
        const isSelected = selectedDay && dateString === selectedDay.toDateString();
        
        days.push(
          <div
            key={i}
            className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${total > 0 ? 'has-data' : ''}`}
            onClick={() => selectDay(date)}
          >
            <div className="day-number">{date.getDate()}</div>
          </div>
        );
      } else {
        days.push(<div key={i} className="calendar-day"></div>);
      }
    }
    
    return days;
  };

  const formatSelectedDate = () => {
    if (!selectedDay) return "Today's Progress";
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return selectedDay.toLocaleDateString('en-US', options);
  };

  return (
    <div className="page calendar">
      <div className="header">
        <h1>Progress Calendar</h1>
      </div>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="calendar-nav" onClick={previousMonth}>
            ‹ Prev
          </button>
          <div className="calendar-title">
            {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
          </div>
          <button className="calendar-nav" onClick={nextMonth}>
            Next ›
          </button>
        </div>
        
        <div className="calendar-grid">
          {generateCalendar()}
        </div>
      </div>

      {/* Day Details Panel */}
      <div className="day-details">
        <div className="day-details-header">
          <div className="day-details-title">{formatSelectedDate()}</div>
        </div>
        <div className="day-details-grid">
          <div className="day-detail-item approaches">
            <div className="day-detail-label">Approaches</div>
            <div className="day-detail-value">{dayDetails.approaches}</div>
          </div>
          <div className="day-detail-item contacts">
            <div className="day-detail-label">Contacts</div>
            <div className="day-detail-value">{dayDetails.contacts}</div>
          </div>
          <div className="day-detail-item instant-dates">
            <div className="day-detail-label">Instant Dates</div>
            <div className="day-detail-value">{dayDetails.instantDates}</div>
          </div>
          <div className="day-detail-item planned-dates">
            <div className="day-detail-label">Planned Dates</div>
            <div className="day-detail-value">{dayDetails.plannedDates}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
