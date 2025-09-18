// Retry Logic with Exponential Backoff
const { RetryableError, RateLimitError, logError } = require('./errorHandler');

class RetryManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000; // 1 second
    this.maxDelay = options.maxDelay || 30000; // 30 seconds
    this.backoffMultiplier = options.backoffMultiplier || 2;
    this.jitter = options.jitter || true;
  }

  async executeWithRetry(operation, context = {}) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await operation();
        if (attempt > 0) {
          console.log(`Operation succeeded on attempt ${attempt + 1}`);
        }
        return result;
      } catch (error) {
        lastError = error;
        
        // Don't retry on non-retryable errors
        if (!this.shouldRetry(error, attempt)) {
          throw error;
        }

        // If this is the last attempt, throw the error
        if (attempt === this.maxRetries) {
          throw error;
        }

        const delay = this.calculateDelay(attempt, error);
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error.message);
        
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  shouldRetry(error, attempt) {
    // Don't retry if we've exceeded max attempts
    if (attempt >= this.maxRetries) {
      return false;
    }

    // Don't retry non-retryable errors
    if (error.type && !['RETRYABLE', 'RATE_LIMIT', 'TIMEOUT'].includes(error.type)) {
      return false;
    }

    // Don't retry API key errors
    if (error.type === 'API_KEY') {
      return false;
    }

    // Don't retry client errors (4xx except 429)
    if (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
      return false;
    }

    return true;
  }

  calculateDelay(attempt, error) {
    let delay = this.baseDelay * Math.pow(this.backoffMultiplier, attempt);
    
    // Cap at max delay
    delay = Math.min(delay, this.maxDelay);
    
    // Add jitter to prevent thundering herd
    if (this.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }
    
    // For rate limit errors, use the retry-after header if available
    if (error.type === 'RATE_LIMIT' && error.retryAfter) {
      delay = Math.max(delay, error.retryAfter * 1000);
    }
    
    return Math.floor(delay);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Circuit Breaker Pattern
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.monitoringPeriod = options.monitoringPeriod || 10000; // 10 seconds
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error('Circuit breaker is OPEN. Service temporarily unavailable.');
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
      console.log(`Circuit breaker opened after ${this.failureCount} failures`);
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime
    };
  }
}

// Request timeout wrapper
function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    })
  ]);
}

module.exports = {
  RetryManager,
  CircuitBreaker,
  withTimeout
};
