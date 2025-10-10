import React, { useState } from 'react';
import { Minus, Users, MessageCircle, Clock, XCircle } from 'lucide-react';
import { useActionsContext } from '../contexts/ActionsContext';

const Dashboard: React.FC = () => {
  const { addAction, removeLastAction, counters, permissionGranted, geoError } = useActionsContext();
  const [animatingButtons, setAnimatingButtons] = useState<Set<string>>(new Set());

  const counterTypes = [
    { 
      key: 'approach' as const, 
      label: 'Approaches',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: Users
    },
    { 
      key: 'missedOpportunity' as const, 
      label: 'Missed Opportunities',
      gradient: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
      icon: XCircle
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
    }
  ];

  const handleIncrement = async (key: string) => {
    const actionType = key as any;
    const result = await addAction(actionType);
    
    if (result) {
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
      case 'missedOpportunity': return counters.missedOpportunities;
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
