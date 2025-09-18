// Comprehensive Test Suite for AI Service
const AIService = require('../lib/aiService');
const { RetryManager, CircuitBreaker } = require('../lib/retryLogic');
const { AIError, RetryableError, RateLimitError } = require('../lib/errorHandler');

// Mock fetch for testing
global.fetch = jest.fn();

describe('AI Service', () => {
  let aiService;
  
  beforeEach(() => {
    aiService = new AIService({
      timeout: 5000,
      maxRetries: 2
    });
    fetch.mockClear();
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      fetch.mockRejectedValue(new Error('Network error'));
      
      const result = await aiService.generateResponse('test message');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unable to connect');
    });

    test('should handle API key errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid API key' })
      });
      
      const result = await aiService.generateResponse('test message');
      
      expect(result.success).toBe(false);
      expect(result.type).toBe('API_KEY_ERROR');
    });

    test('should handle rate limit errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 429,
        headers: { get: () => '60' },
        json: () => Promise.resolve({ error: 'Rate limit exceeded' })
      });
      
      const result = await aiService.generateResponse('test message');
      
      expect(result.success).toBe(false);
      expect(result.type).toBe('RATE_LIMIT');
    });

    test('should handle server errors with retry', async () => {
      fetch
        .mockRejectedValueOnce(new Error('Server error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ 
            success: true, 
            response: 'Test response',
            model: 'gemini-1.5-flash'
          })
        });
      
      const result = await aiService.generateResponse('test message');
      
      expect(result.success).toBe(true);
      expect(result.response).toBe('Test response');
    });
  });

  describe('Retry Logic', () => {
    test('should retry on retryable errors', async () => {
      const retryManager = new RetryManager({ maxRetries: 2 });
      let attemptCount = 0;
      
      const operation = () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new RetryableError('Temporary error');
        }
        return 'Success';
      };
      
      const result = await retryManager.executeWithRetry(operation);
      
      expect(result).toBe('Success');
      expect(attemptCount).toBe(3);
    });

    test('should not retry on non-retryable errors', async () => {
      const retryManager = new RetryManager({ maxRetries: 2 });
      let attemptCount = 0;
      
      const operation = () => {
        attemptCount++;
        throw new AIError('Non-retryable error', 'CLIENT_ERROR', 400);
      };
      
      await expect(retryManager.executeWithRetry(operation)).rejects.toThrow();
      expect(attemptCount).toBe(1);
    });
  });

  describe('Circuit Breaker', () => {
    test('should open circuit after threshold failures', async () => {
      const circuitBreaker = new CircuitBreaker({ 
        failureThreshold: 2,
        resetTimeout: 1000
      });
      
      const failingOperation = () => {
        throw new Error('Operation failed');
      };
      
      // First two failures
      await expect(circuitBreaker.execute(failingOperation)).rejects.toThrow();
      await expect(circuitBreaker.execute(failingOperation)).rejects.toThrow();
      
      // Circuit should be open now
      await expect(circuitBreaker.execute(failingOperation)).rejects.toThrow('Circuit breaker is OPEN');
    });

    test('should reset circuit after timeout', async () => {
      const circuitBreaker = new CircuitBreaker({ 
        failureThreshold: 1,
        resetTimeout: 100
      });
      
      const failingOperation = () => {
        throw new Error('Operation failed');
      };
      
      const successOperation = () => 'Success';
      
      // Trigger failure
      await expect(circuitBreaker.execute(failingOperation)).rejects.toThrow();
      
      // Wait for reset timeout
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should work again
      const result = await circuitBreaker.execute(successOperation);
      expect(result).toBe('Success');
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const health = await aiService.healthCheck();
      
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('providers');
      expect(health).toHaveProperty('timestamp');
    });
  });
});

// Integration tests
describe('AI Service Integration', () => {
  test('should handle complete request flow', async () => {
    const aiService = new AIService();
    
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        response: 'Test AI response',
        model: 'gemini-1.5-flash',
        provider: 'gemini'
      })
    });
    
    const result = await aiService.generateResponse('Hello');
    
    expect(result.success).toBe(true);
    expect(result.response).toBe('Test AI response');
    expect(result.model).toBe('gemini-1.5-flash');
  });
});

// Performance tests
describe('Performance Tests', () => {
  test('should handle concurrent requests', async () => {
    const aiService = new AIService();
    
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        response: 'Test response'
      })
    });
    
    const requests = Array(10).fill().map((_, i) => 
      aiService.generateResponse(`Message ${i}`)
    );
    
    const results = await Promise.all(requests);
    
    expect(results).toHaveLength(10);
    results.forEach(result => {
      expect(result.success).toBe(true);
    });
  });

  test('should respect timeout limits', async () => {
    const aiService = new AIService({ timeout: 100 });
    
    fetch.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 200))
    );
    
    const result = await aiService.generateResponse('test');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('timeout');
  });
});

// Error boundary tests
describe('Error Boundary', () => {
  test('should catch and handle errors gracefully', () => {
    const ErrorBoundary = require('../components/ErrorBoundary');
    const { render } = require('@testing-library/react');
    
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(container.textContent).toContain('Something went wrong');
  });
});
