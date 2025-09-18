// Complete AI Chat Component with Error Handling
import React, { useState, useRef, useEffect } from 'react';
import { useAI, AI_STATES, ERROR_TYPES } from '../hooks/useAI';
import LoadingState, { TypingIndicator, RetryButton } from './LoadingState';
import AIErrorBoundary from './ErrorBoundary';

const AIChat = ({ 
  className = '',
  placeholder = "Ask me anything about this portfolio...",
  maxRetries = 3,
  showTypingIndicator = true
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const {
    state,
    response,
    error,
    retryCount,
    isRetrying,
    isLoading,
    isError,
    isSuccess,
    canRetry,
    sendMessage,
    retry,
    clearError,
    reset
  } = useAI();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show toast notifications
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    try {
      await sendMessage(userMessage);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Handle retry
  const handleRetry = async () => {
    try {
      await retry();
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  // Handle error clear
  const handleClearError = () => {
    clearError();
  };

  // Handle reset
  const handleReset = () => {
    reset();
    setMessages([]);
  };

  // Add AI response to messages when received
  useEffect(() => {
    if (isSuccess && response) {
      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: response.response,
        timestamp: new Date().toISOString(),
        provider: response.provider,
        model: response.model,
        correlationId: response.correlationId
      };
      
      setMessages(prev => [...prev, aiMessage]);
      showToastNotification('Response received!', 'success');
    }
  }, [isSuccess, response]);

  // Show error toast
  useEffect(() => {
    if (isError && error) {
      showToastNotification(error.message, 'error');
    }
  }, [isError, error]);

  // Get error message for display
  const getErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';
    
    switch (error.type) {
      case ERROR_TYPES.NETWORK:
        return 'Unable to connect to AI service. Please check your internet connection.';
      case ERROR_TYPES.RATE_LIMIT:
        return 'AI service is busy. Please wait a moment and try again.';
      case ERROR_TYPES.TIMEOUT:
        return 'Request timed out. Please try again.';
      case ERROR_TYPES.API_KEY:
        return 'AI service is not properly configured. Please contact support.';
      case ERROR_TYPES.SERVER:
        return 'AI service is temporarily unavailable. Please try again in a moment.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  };

  return (
    <AIErrorBoundary>
      <div className={`ai-chat-container ${className}`}>
        {/* Toast Notifications */}
        {showToast && (
          <div className={`ai-toast ai-toast--${toastType}`}>
            <span className="ai-toast-message">{toastMessage}</span>
            <button 
              className="ai-toast-close"
              onClick={() => setShowToast(false)}
            >
              ×
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="ai-chat-messages">
          {messages.length === 0 && (
            <div className="ai-welcome-message">
              <h3>👋 Hello! I'm RaidBot</h3>
              <p>Your Portfolio AI Assistant powered by Gemini! I can help you understand this portfolio and answer questions about:</p>
              <ul>
                <li>The developer's skills and technologies</li>
                <li>Projects showcased here</li>
                <li>How to navigate the site</li>
                <li>Contact information</li>
                <li>And much more!</li>
              </ul>
              <p>What would you like to know? 😊</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`ai-message ai-message--${message.type}`}>
              <div className="ai-message-content">
                {message.content}
              </div>
              <div className="ai-message-meta">
                <span className="ai-message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                {message.provider && (
                  <span className="ai-message-provider">
                    via {message.provider}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="ai-message ai-message--ai">
              <div className="ai-message-content">
                <LoadingState 
                  message="AI is thinking..."
                  showProgress={false}
                  isRetrying={isRetrying}
                />
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && error && (
            <div className="ai-message ai-message--error">
              <div className="ai-message-content">
                <div className="ai-error-message">
                  <div className="ai-error-icon">⚠️</div>
                  <div className="ai-error-text">
                    <p>{getErrorMessage(error)}</p>
                    {canRetry && (
                      <div className="ai-error-actions">
                        <RetryButton 
                          onRetry={handleRetry}
                          isRetrying={isRetrying}
                          retryCount={retryCount}
                          maxRetries={maxRetries}
                        />
                        <button 
                          onClick={handleClearError}
                          className="ai-clear-button"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="ai-chat-input-form">
          <div className="ai-input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="ai-chat-input"
              maxLength={4000}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="ai-send-button"
            >
              {isLoading ? (
                <div className="ai-send-spinner"></div>
              ) : (
                'Send'
              )}
            </button>
          </div>
          
          {/* Character count */}
          <div className="ai-input-footer">
            <span className="ai-char-count">
              {input.length}/4000
            </span>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="ai-reset-button"
              >
                Clear Chat
              </button>
            )}
          </div>
        </form>
      </div>
    </AIErrorBoundary>
  );
};

export default AIChat;
