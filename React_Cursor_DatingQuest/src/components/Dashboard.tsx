import React, { useState } from 'react';
import { Minus } from 'lucide-react';
import { useCounters } from '../hooks/useCounters';

const Dashboard: React.FC = () => {
  const { counters, incrementCounter, decrementCounter } = useCounters();
  const [animatingButtons, setAnimatingButtons] = useState<Set<string>>(new Set());

  const counterTypes = [
    { 
      key: 'approaches' as const, 
      label: 'Approaches',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      key: 'contacts' as const, 
      label: 'Contacts',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      key: 'instantDates' as const, 
      label: 'Instant Dates',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      key: 'plannedDates' as const, 
      label: 'Planned Dates',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
  ];

  const handleIncrement = (key: string) => {
    incrementCounter(key as any);
    triggerAnimation(key, 'increment');
  };

  const handleDecrement = (key: string, event: React.MouseEvent) => {
    event.stopPropagation();
    decrementCounter(key as any);
    triggerAnimation(key, 'decrement');
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

  return (
    <div className="page dashboard-page">
      <div className="header">
        <h1>Dating Quest</h1>
        <div className="date">{formatDate()}</div>
      </div>
      
      <div className="counters-grid">
        {counterTypes.map(({ key, label, gradient }) => (
          <button
            key={key}
            className={`counter-button ${key} ${animatingButtons.has(`${key}-increment`) ? 'animate-increment' : ''} ${animatingButtons.has(`${key}-decrement`) ? 'animate-decrement' : ''}`}
            onClick={() => handleIncrement(key)}
            style={{ background: gradient }}
          >
            <button
              className="counter-minus"
              onClick={(e) => handleDecrement(key, e)}
            >
              <Minus size={18} color="white" />
            </button>
            <div className="counter-title">{label}</div>
            <div className="counter-value">{counters[key]}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
