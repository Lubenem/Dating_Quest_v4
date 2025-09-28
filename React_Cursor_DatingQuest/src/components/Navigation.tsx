import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Map } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <div className="bottom-nav">
      <NavLink to="/" className="nav-item" end>
        <div className="nav-icon">
          <Home size={20} />
        </div>
        <div className="nav-label">Dashboard</div>
      </NavLink>
      <NavLink to="/calendar" className="nav-item">
        <div className="nav-icon">
          <Calendar size={20} />
        </div>
        <div className="nav-label">Calendar</div>
      </NavLink>
      <NavLink to="/map" className="nav-item">
        <div className="nav-icon">
          <Map size={20} />
        </div>
        <div className="nav-label">Map</div>
      </NavLink>
    </div>
  );
};

export default Navigation;
