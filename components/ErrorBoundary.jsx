// Error Boundary Component for AI Integration
import React from 'react';

class AIErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
      retryCount: this.state.retryCount + 1
    });

    // Log error for debugging
    console.error('AI Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="ai-error-boundary">
          <div className="ai-error-content">
            <div className="ai-error-icon">⚠️</div>
            <h3>Something went wrong with the AI assistant</h3>
            <p>We're sorry, but the AI assistant encountered an unexpected error.</p>
            
            {this.state.retryCount < 3 && (
              <div className="ai-error-actions">
                <button 
                  onClick={this.handleRetry}
                  className="ai-retry-button"
                >
                  Try Again
                </button>
                <button 
                  onClick={this.handleReset}
                  className="ai-reset-button"
                >
                  Reset
                </button>
              </div>
            )}

            {this.state.retryCount >= 3 && (
              <div className="ai-error-message">
                <p>Multiple retry attempts failed. Please refresh the page or contact support.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="ai-refresh-button"
                >
                  Refresh Page
                </button>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="ai-error-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AIErrorBoundary;
