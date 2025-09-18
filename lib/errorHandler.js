// Comprehensive Error Handling System
class AIError extends Error {
  constructor(message, type, statusCode, details = {}) {
    super(message);
    this.name = 'AIError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.correlationId = this.generateCorrelationId();
  }

  generateCorrelationId() {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

class RetryableError extends AIError {
  constructor(message, originalError, retryAfter = null) {
    super(message, 'RETRYABLE', 0, { originalError });
    this.retryAfter = retryAfter;
  }
}

class RateLimitError extends AIError {
  constructor(message, retryAfter) {
    super(message, 'RATE_LIMIT', 429, { retryAfter });
    this.retryAfter = retryAfter;
  }
}

class APIKeyError extends AIError {
  constructor(message, provider) {
    super(message, 'API_KEY', 401, { provider });
  }
}

class TimeoutError extends AIError {
  constructor(message, timeoutMs) {
    super(message, 'TIMEOUT', 408, { timeoutMs });
  }
}

// Error classification
function classifyError(error, response = null) {
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return new RetryableError('Network connection failed', error);
  }

  if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
    return new TimeoutError('Request timed out', 30000);
  }

  if (response) {
    switch (response.status) {
      case 400:
        return new AIError('Invalid request format', 'BAD_REQUEST', 400);
      case 401:
        return new APIKeyError('Invalid or missing API key', 'unknown');
      case 403:
        return new AIError('Access forbidden', 'FORBIDDEN', 403);
      case 429:
        const retryAfter = response.headers['retry-after'] || 60;
        return new RateLimitError('Rate limit exceeded', retryAfter);
      case 500:
      case 502:
      case 503:
      case 504:
        return new RetryableError('Server error occurred', error);
      default:
        return new AIError(`HTTP ${response.status} error`, 'HTTP_ERROR', response.status);
    }
  }

  return new AIError(error.message || 'Unknown error occurred', 'UNKNOWN', 500);
}

// User-friendly error messages
function getUserFriendlyMessage(error) {
  switch (error.type) {
    case 'RATE_LIMIT':
      return 'AI service is busy. Please wait a moment and try again.';
    case 'TIMEOUT':
      return 'Request timed out. Please try again.';
    case 'API_KEY':
      return 'AI service is not properly configured. Please contact support.';
    case 'NETWORK':
      return 'Unable to connect to AI service. Please check your internet connection.';
    case 'RETRYABLE':
      return 'AI service is temporarily unavailable. Please try again in a moment.';
    default:
      return 'Something went wrong. Please try again or contact support if the issue persists.';
  }
}

// Logging system
function logError(error, context = {}) {
  const logData = {
    correlationId: error.correlationId,
    type: error.type,
    statusCode: error.statusCode,
    message: error.message,
    timestamp: error.timestamp,
    context,
    stack: error.stack
  };

  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    console.error('AI_ERROR:', JSON.stringify(logData));
  } else {
    console.error('AI Error:', logData);
  }
}

module.exports = {
  AIError,
  RetryableError,
  RateLimitError,
  APIKeyError,
  TimeoutError,
  classifyError,
  getUserFriendlyMessage,
  logError
};
