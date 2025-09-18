// Custom React Hook for AI Integration with Error Handling
import { useState, useCallback, useRef, useEffect } from 'react';

const AI_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  RETRYING: 'retrying'
};

const ERROR_TYPES = {
  NETWORK: 'network',
  RATE_LIMIT: 'rate_limit',
  TIMEOUT: 'timeout',
  API_KEY: 'api_key',
  SERVER: 'server',
  UNKNOWN: 'unknown'
};

class AIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.retryManager = new RetryManager();
    this.circuitBreaker = new CircuitBreaker();
  }

  async generateResponse(message, options = {}) {
    const operation = () => this.callAPI(message, options);
    return await this.retryManager.executeWithRetry(operation);
  }

  async callAPI(message, options = {}) {
    const response = await fetch(`${this.baseURL}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, options }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AIError(
        errorData.error || `HTTP ${response.status}`,
        this.classifyErrorType(response.status),
        response.status
      );
    }

    return await response.json();
  }

  classifyErrorType(statusCode) {
    switch (statusCode) {
      case 400:
      case 422:
        return ERROR_TYPES.CLIENT;
      case 401:
      case 403:
        return ERROR_TYPES.API_KEY;
      case 429:
        return ERROR_TYPES.RATE_LIMIT;
      case 408:
        return ERROR_TYPES.TIMEOUT;
      case 500:
      case 502:
      case 503:
      case 504:
        return ERROR_TYPES.SERVER;
      default:
        return ERROR_TYPES.UNKNOWN;
    }
  }
}

class RetryManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 10000;
    this.backoffMultiplier = options.backoffMultiplier || 2;
  }

  async executeWithRetry(operation) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (!this.shouldRetry(error, attempt)) {
          throw error;
        }

        if (attempt === this.maxRetries) {
          throw error;
        }

        const delay = this.calculateDelay(attempt, error);
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  shouldRetry(error, attempt) {
    if (attempt >= this.maxRetries) return false;
    if (error.type === ERROR_TYPES.API_KEY) return false;
    if (error.type === ERROR_TYPES.CLIENT) return false;
    return true;
  }

  calculateDelay(attempt, error) {
    let delay = this.baseDelay * Math.pow(this.backoffMultiplier, attempt);
    delay = Math.min(delay, this.maxDelay);
    return delay * (0.5 + Math.random() * 0.5); // Add jitter
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.resetTimeout;
    }
  }
}

class AIError extends Error {
  constructor(message, type, statusCode) {
    super(message);
    this.name = 'AIError';
    this.type = type;
    this.statusCode = statusCode;
  }
}

// Custom hook
export function useAI(options = {}) {
  const [state, setState] = useState(AI_STATES.IDLE);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const clientRef = useRef(new AIClient(options.baseURL));
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (message, messageOptions = {}) => {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      setError(new AIError('Message is required', ERROR_TYPES.CLIENT, 400));
      setState(AI_STATES.ERROR);
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(AI_STATES.LOADING);
    setError(null);
    setResponse(null);

    try {
      const result = await clientRef.current.generateResponse(message, messageOptions);
      
      if (result.success) {
        setResponse(result);
        setState(AI_STATES.SUCCESS);
        setRetryCount(0);
      } else {
        throw new AIError(result.error, result.type, 500);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled
      }

      setError(err);
      setState(AI_STATES.ERROR);
    }
  }, []);

  const retry = useCallback(async () => {
    if (!response && !error) return;

    setIsRetrying(true);
    setState(AI_STATES.RETRYING);
    setRetryCount(prev => prev + 1);

    try {
      // Extract the original message from the last request
      const lastMessage = response?.lastMessage || error?.lastMessage;
      if (!lastMessage) {
        throw new Error('No previous message to retry');
      }

      const result = await clientRef.current.generateResponse(lastMessage);
      
      if (result.success) {
        setResponse(result);
        setState(AI_STATES.SUCCESS);
        setError(null);
      } else {
        throw new AIError(result.error, result.type, 500);
      }
    } catch (err) {
      setError(err);
      setState(AI_STATES.ERROR);
    } finally {
      setIsRetrying(false);
    }
  }, [response, error]);

  const clearError = useCallback(() => {
    setError(null);
    setState(AI_STATES.IDLE);
  }, []);

  const reset = useCallback(() => {
    setState(AI_STATES.IDLE);
    setResponse(null);
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    state,
    response,
    error,
    retryCount,
    isRetrying,
    
    // Computed
    isLoading: state === AI_STATES.LOADING || state === AI_STATES.RETRYING,
    isError: state === AI_STATES.ERROR,
    isSuccess: state === AI_STATES.SUCCESS,
    canRetry: state === AI_STATES.ERROR && retryCount < 3,
    
    // Actions
    sendMessage,
    retry,
    clearError,
    reset
  };
}

export { AI_STATES, ERROR_TYPES };
