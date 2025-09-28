import React from 'react';
import { Minus } from 'lucide-react';
import { useCounters } from '../hooks/useCounters';

const Dashboard: React.FC = () => {
  const { counters, incrementCounter, decrementCounter } = useCounters();

  const counterTypes = [
    { key: 'approaches' as const, label: 'Approaches' },
    { key: 'contacts' as const, label: 'Contacts' },
    { key: 'instantDates' as const, label: 'Instant Dates' },
    { key: 'plannedDates' as const, label: 'Planned Dates' },
  ];

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
    <div className="page">
      <div className="header">
        <h1>Dating Quest</h1>
        <div className="date">{formatDate()}</div>
      </div>
      
      <div className="counters-grid">
        {counterTypes.map(({ key, label }) => (
          <button
            key={key}
            className="counter-button"
            onClick={() => incrementCounter(key)}
          >
            <button
              className="counter-minus"
              onClick={(e) => {
                e.stopPropagation();
                decrementCounter(key);
              }}
            >
              <Minus size={16} color="white" />
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
