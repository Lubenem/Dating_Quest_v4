import React, { useState, useEffect } from 'react';
import { Minus, Users, MessageCircle, Clock, Calendar } from 'lucide-react';
import { useActions } from '../hooks/useActions';
import type { Counters } from '../types';

const Dashboard: React.FC = () => {
  const { addAction, removeLastAction, getTodayCounters, permissionGranted, geoError } = useActions();
  const [counters, setCounters] = useState<Counters>({
    approaches: 0,
    contacts: 0,
    instantDates: 0,
    plannedDates: 0,
  });
  const [animatingButtons, setAnimatingButtons] = useState<Set<string>>(new Set());

  // Update counters on mount
  useEffect(() => {
    const todayCounters = getTodayCounters();
    setCounters(todayCounters);
  }, []);

  const updateCounters = () => {
    const todayCounters = getTodayCounters();
    setCounters(todayCounters);
  };

  const counterTypes = [
    { 
      key: 'approach' as const, 
      label: 'Approaches',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: Users
    },
    { 
      key: 'contact' as const, 
      label: 'Contacts',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: MessageCircle
    },
    { 
      key: 'instantDate' as const, 
      label: 'Instant Dates',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: Clock
    },
    { 
      key: 'plannedDate' as const, 
      label: 'Planned Dates',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: Calendar
    },
  ];

  const handleIncrement = async (key: string) => {
    const actionType = key as any;
    const success = await addAction(actionType);
    
    if (success) {
      updateCounters();
      triggerAnimation(key, 'increment');
    } else {
      console.warn('Failed to add action - check geolocation permissions');
    }
  };

  const handleDecrement = (key: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const actionType = key as any;
    const success = removeLastAction(actionType);
    
    if (success) {
      updateCounters();
      triggerAnimation(key, 'decrement');
    }
  };

  const triggerAnimation = (key: string, type: 'increment' | 'decrement') => {
    setAnimatingButtons(prev => new Set(prev).add(`${key}-${type}`));
    setTimeout(() => {
      setAnimatingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${key}-${type}`);
        return newSet;
      });
    }, 300);
  };

  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  const getCounterValue = (key: string): number => {
    switch (key) {
      case 'approach': return counters.approaches;
      case 'contact': return counters.contacts;
      case 'instantDate': return counters.instantDates;
      case 'plannedDate': return counters.plannedDates;
      default: return 0;
    }
  };

  return (
    <div className="page dashboard-page">
      <div className="header">
        <h1>Dating Quest</h1>
        <div className="date">{formatDate()}</div>
        {!permissionGranted && geoError && (
          <div className="geo-warning">
            <p>⚠️ Location permission denied - action tracking disabled</p>
            <p className="geo-error">{geoError}</p>
          </div>
        )}
      </div>
      
      <div className="counters-grid">
        {counterTypes.map(({ key, label, gradient, icon: Icon }) => (
          <button
            key={key}
            className={`counter-button ${key} ${animatingButtons.has(`${key}-increment`) ? 'animate-increment' : ''} ${animatingButtons.has(`${key}-decrement`) ? 'animate-decrement' : ''}`}
            onClick={() => handleIncrement(key)}
            style={{ background: gradient }}
            disabled={!permissionGranted}
          >
            <div className="counter-icon">
              <Icon size={24} color="white" />
            </div>
            <button
              className="counter-minus"
              onClick={(e) => handleDecrement(key, e)}
              disabled={getCounterValue(key) === 0}
            >
              <Minus size={18} color="white" />
            </button>
            <div className="counter-title">{label}</div>
            <div className="counter-value">{getCounterValue(key)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
