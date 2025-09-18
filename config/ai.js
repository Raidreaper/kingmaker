// AI Service Configuration for Different Environments
const config = {
  development: {
    apiEndpoint: '/api/ai',
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 1000,
    maxRetryDelay: 10000,
    enableLogging: true,
    enableCircuitBreaker: true,
    circuitBreakerThreshold: 5,
    circuitBreakerTimeout: 60000
  },
  
  production: {
    apiEndpoint: '/api/ai',
    timeout: 25000, // Under Vercel's 30s limit
    maxRetries: 3,
    retryDelay: 1000,
    maxRetryDelay: 10000,
    enableLogging: false, // Use proper logging service
    enableCircuitBreaker: true,
    circuitBreakerThreshold: 3,
    circuitBreakerTimeout: 30000
  },
  
  test: {
    apiEndpoint: '/api/ai',
    timeout: 5000,
    maxRetries: 1,
    retryDelay: 100,
    maxRetryDelay: 1000,
    enableLogging: true,
    enableCircuitBreaker: false,
    circuitBreakerThreshold: 10,
    circuitBreakerTimeout: 10000
  }
};

// Get current environment
function getEnvironment() {
  if (typeof window !== 'undefined') {
    // Client-side
    return window.location.hostname === 'localhost' ? 'development' : 'production';
  } else {
    // Server-side
    return process.env.NODE_ENV || 'development';
  }
}

// Get configuration for current environment
function getConfig() {
  const env = getEnvironment();
  return {
    ...config[env],
    environment: env
  };
}

// Environment-specific API endpoints
const API_ENDPOINTS = {
  development: '/api/ai',
  production: '/api/ai',
  test: '/api/ai'
};

// Error handling configuration
const ERROR_CONFIG = {
  retryableErrors: [
    'NETWORK_ERROR',
    'TIMEOUT',
    'RATE_LIMIT',
    'SERVER_ERROR'
  ],
  
  nonRetryableErrors: [
    'API_KEY_ERROR',
    'CLIENT_ERROR',
    'AUTHENTICATION_ERROR'
  ],
  
  userFriendlyMessages: {
    NETWORK_ERROR: 'Unable to connect to AI service. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    RATE_LIMIT: 'AI service is busy. Please wait a moment and try again.',
    SERVER_ERROR: 'AI service is temporarily unavailable. Please try again in a moment.',
    API_KEY_ERROR: 'AI service is not properly configured. Please contact support.',
    CLIENT_ERROR: 'Invalid request. Please check your message and try again.',
    AUTHENTICATION_ERROR: 'Authentication failed. Please contact support.',
    UNKNOWN: 'Something went wrong. Please try again or contact support if the issue persists.'
  }
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  requestsPerMinute: 30,
  burstLimit: 10,
  windowMs: 60000
};

// Monitoring configuration
const MONITORING_CONFIG = {
  enableMetrics: true,
  enableTracing: true,
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  correlationIdHeader: 'X-Correlation-ID'
};

module.exports = {
  getConfig,
  getEnvironment,
  API_ENDPOINTS,
  ERROR_CONFIG,
  RATE_LIMIT_CONFIG,
  MONITORING_CONFIG
};
