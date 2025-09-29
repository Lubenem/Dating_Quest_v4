import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Map from './components/Map';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <div className="app">
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/map" element={<Map />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Navigation />
        </div>
      </Router>
    </div>
  );
}

export default App;