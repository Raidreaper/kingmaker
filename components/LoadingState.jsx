// Loading State Component for AI Integration
import React from 'react';

const LoadingState = ({ 
  message = "AI is thinking...", 
  showProgress = true, 
  progress = 0,
  isRetrying = false 
}) => {
  return (
    <div className="ai-loading-state">
      <div className="ai-loading-content">
        <div className="ai-loading-spinner">
          <div className="ai-spinner"></div>
        </div>
        
        <div className="ai-loading-text">
          <p className="ai-loading-message">
            {isRetrying ? "Retrying..." : message}
          </p>
          
          {showProgress && (
            <div className="ai-progress-container">
              <div className="ai-progress-bar">
                <div 
                  className="ai-progress-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <span className="ai-progress-text">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Typing indicator component
export const TypingIndicator = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="ai-typing-indicator">
      <div className="ai-typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

// Progress indicator component
export const ProgressIndicator = ({ 
  current = 0, 
  total = 100, 
  label = "Processing..." 
}) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="ai-progress-indicator">
      <div className="ai-progress-header">
        <span className="ai-progress-label">{label}</span>
        <span className="ai-progress-percentage">{percentage}%</span>
      </div>
      <div className="ai-progress-bar">
        <div 
          className="ai-progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Retry button component
export const RetryButton = ({ 
  onRetry, 
  isRetrying = false, 
  retryCount = 0, 
  maxRetries = 3 
}) => {
  const canRetry = retryCount < maxRetries && !isRetrying;
  
  if (!canRetry) return null;

  return (
    <button 
      onClick={onRetry}
      disabled={isRetrying}
      className={`ai-retry-button ${isRetrying ? 'ai-retry-button--loading' : ''}`}
    >
      {isRetrying ? (
        <>
          <span className="ai-retry-spinner"></span>
          Retrying...
        </>
      ) : (
        `Retry (${retryCount}/${maxRetries})`
      )}
    </button>
  );
};

export default LoadingState;
