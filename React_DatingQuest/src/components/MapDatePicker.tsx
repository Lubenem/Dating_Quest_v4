import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface MapDatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const MapDatePicker: React.FC<MapDatePickerProps> = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (date: Date | null) => {
    onDateChange(date);
    setIsOpen(false);
  };

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="map-date-picker-container">
      <button
        className="map-date-picker-button"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="date-picker-icon">📅</span>
        <span className="date-picker-text">{formatDisplayDate(selectedDate)}</span>
        <span className="date-picker-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="date-picker-dropdown">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            showPopperArrow={false}
            calendarClassName="custom-datepicker"
            maxDate={new Date()}
            dateFormat="MMM dd, yyyy"
          />
        </div>
      )}
    </div>
  );
};

export default MapDatePicker;
