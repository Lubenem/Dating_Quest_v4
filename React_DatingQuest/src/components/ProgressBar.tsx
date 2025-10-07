import React from 'react';
import { useActionsContext } from '../contexts/ActionsContext';

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
  const { counters, dailyGoal } = useActionsContext();
  
  const currentProgress = counters.approaches;
  const progressPercentage = Math.min((currentProgress / dailyGoal) * 100, 100);
  const progressDecimal = Math.min(currentProgress / dailyGoal, 1);
  const progressColor = getProgressColor(progressDecimal);
  
  return (
    <div className="game-progress-container">
      <div className="progress-label">
        Approaches: {currentProgress}/{dailyGoal}
      </div>
      <div className="game-progress-bar">
        <div 
          className="progress-fill"
          style={{
            width: `${progressPercentage}%`,
            background: `linear-gradient(90deg, ${progressColor} 0%, ${progressColor} 100%)`,
            boxShadow: `0 0 12px ${progressColor}60`
          }}
        >
          <div className="progress-glow"></div>
          <div className="progress-shine"></div>
        </div>
        <div className="progress-border"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
