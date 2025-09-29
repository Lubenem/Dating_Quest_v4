import React from 'react';
import { useActions } from '../hooks/useActions';

// Calculate progress-based color (same as map dots)
const getProgressColor = (progress: number): string => {
  if (progress <= 0.33) {
    // Blue phase (0-33% of goal)
    const intensity = progress / 0.33;
    return `rgb(${Math.round(30 + intensity * 70)}, ${Math.round(100 + intensity * 155)}, ${Math.round(200 + intensity * 55)})`;
  } else if (progress <= 0.66) {
    // Green phase (33-66% of goal)
    const intensity = (progress - 0.33) / 0.33;
    return `rgb(${Math.round(100 + intensity * 155)}, ${Math.round(200 + intensity * 55)}, ${Math.round(30 + intensity * 70)})`;
  } else {
    // Gold phase (66-100% of goal)
    const intensity = (progress - 0.66) / 0.34;
    return `rgb(${Math.round(255)}, ${Math.round(200 + intensity * 55)}, ${Math.round(0)})`;
  }
};

const ProgressBar: React.FC = () => {
  const { getTodayCounters, getDailyGoal } = useActions();
  
  const todayCounters = getTodayCounters();
  const dailyGoal = getDailyGoal();
  const currentProgress = todayCounters.approaches;
  const progressPercentage = Math.min((currentProgress / dailyGoal) * 100, 100);
  const progressDecimal = Math.min(currentProgress / dailyGoal, 1);
  
  const progressColor = getProgressColor(progressDecimal);
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <div className="progress-info">
          <span className="progress-label">Progress</span>
          <span className="progress-value">{currentProgress}/{dailyGoal}</span>
        </div>
        <div className="progress-percentage">{Math.round(progressPercentage)}%</div>
      </div>
      
      <div className="horizontal-progress">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{
              width: `${progressPercentage}%`,
              background: `linear-gradient(90deg, ${progressColor} 0%, ${progressColor} 100%)`,
              boxShadow: `0 0 12px ${progressColor}60`
            }}
          >
            <div className="progress-glow"></div>
            <div className="progress-fill-content">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress milestones */}
      <div className="progress-milestones">
        <div className="milestone milestone-33">
          <div className="milestone-dot"></div>
          <div className="milestone-label">33%</div>
        </div>
        <div className="milestone milestone-66">
          <div className="milestone-dot"></div>
          <div className="milestone-label">66%</div>
        </div>
        <div className="milestone milestone-100">
          <div className="milestone-dot"></div>
          <div className="milestone-label">Goal!</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
