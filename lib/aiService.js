// AI Service Abstraction Layer with Robust Error Handling
const https = require('https');
const { 
  classifyError, 
  getUserFriendlyMessage, 
  logError,
  AIError,
  RetryableError 
} = require('./errorHandler');
const { RetryManager, CircuitBreaker, withTimeout } = require('./retryLogic');

class AIService {
  constructor(options = {}) {
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.timeout = options.timeout || 25000; // 25 seconds (under Vercel's 30s limit)
    this.maxRetries = options.maxRetries || 3;
    
    // Initialize retry manager and circuit breakers
    this.retryManager = new RetryManager({ 
      maxRetries: this.maxRetries,
      baseDelay: 1000,
      maxDelay: 10000
    });
    
    this.groqCircuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 30000
    });
    
    this.geminiCircuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 30000
    });
  }

  async generateResponse(message, options = {}) {
    const context = {
      message,
      timestamp: new Date().toISOString(),
      correlationId: this.generateCorrelationId()
    };

    try {
      // Try Gemini first (primary), then Groq (fallback)
      const providers = this.getAvailableProviders();
      
      for (const provider of providers) {
        try {
          const response = await this.callProvider(provider, message, context);
          return {
            success: true,
            response: response.text,
            model: response.model,
            provider: provider.name,
            usage: response.usage,
            correlationId: context.correlationId
          };
        } catch (error) {
          logError(error, { ...context, provider: provider.name });
          
          // If this is the last provider, throw the error
          if (provider === providers[providers.length - 1]) {
            throw error;
          }
          
          // Otherwise, continue to next provider
          console.log(`Provider ${provider.name} failed, trying next provider`);
        }
      }
    } catch (error) {
      const classifiedError = classifyError(error);
      logError(classifiedError, context);
      
      return {
        success: false,
        error: getUserFriendlyMessage(classifiedError),
        technicalError: classifiedError.message,
        correlationId: context.correlationId,
        type: classifiedError.type
      };
    }
  }

  getAvailableProviders() {
    const providers = [];
    
    if (this.geminiApiKey) {
      providers.push({
        name: 'gemini',
        apiKey: this.geminiApiKey,
        circuitBreaker: this.geminiCircuitBreaker
      });
    }
    
    if (this.groqApiKey) {
      providers.push({
        name: 'groq',
        apiKey: this.groqApiKey,
        circuitBreaker: this.groqCircuitBreaker
      });
    }
    
    if (providers.length === 0) {
      throw new AIError('No AI providers configured', 'CONFIGURATION', 500);
    }
    
    return providers;
  }

  async callProvider(provider, message, context) {
    const operation = () => this.callProviderAPI(provider, message, context);
    const circuitBreakerOperation = () => provider.circuitBreaker.execute(operation);
    const timeoutOperation = () => withTimeout(circuitBreakerOperation(), this.timeout);
    
    return await this.retryManager.executeWithRetry(timeoutOperation, context);
  }

  async callProviderAPI(provider, message, context) {
    switch (provider.name) {
      case 'gemini':
        return await this.callGeminiAPI(provider.apiKey, message, context);
      case 'groq':
        return await this.callGroqAPI(provider.apiKey, message, context);
      default:
        throw new AIError(`Unknown provider: ${provider.name}`, 'CONFIGURATION', 500);
    }
  }

  async callGeminiAPI(apiKey, message, context) {
    return new Promise((resolve, reject) => {
      const prompt = this.buildPrompt(message);
      
      const body = {
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        }
      };

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(body))
        },
        timeout: this.timeout
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data || '{}');
            
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
              resolve({
                text,
                model: 'gemini-1.5-flash',
                usage: parsed.usageMetadata
              });
            } else {
              const error = new AIError(
                parsed.error?.message || `HTTP ${res.statusCode}`,
                'HTTP_ERROR',
                res.statusCode
              );
              reject(error);
            }
          } catch (parseError) {
            reject(new AIError('Invalid JSON response from Gemini API', 'PARSE_ERROR', 500));
          }
        });
      });

      req.on('error', (err) => {
        reject(classifyError(err));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new AIError('Gemini API request timed out', 'TIMEOUT', 408));
      });

      req.setTimeout(this.timeout);
      req.write(JSON.stringify(body));
      req.end();
    });
  }

  async callGroqAPI(apiKey, message, context) {
    return new Promise((resolve, reject) => {
      const messages = [
        {
          role: 'system',
          content: this.buildSystemPrompt()
        },
        {
          role: 'user',
          content: message
        }
      ];

      const body = {
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      };

      const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(body))
        },
        timeout: this.timeout
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data || '{}');
            
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const text = parsed.choices?.[0]?.message?.content || 'No response generated';
              resolve({
                text,
                model: 'groq:meta-llama/llama-4-scout-17b-16e-instruct',
                usage: parsed.usage
              });
            } else {
              const error = new AIError(
                parsed.error?.message || `HTTP ${res.statusCode}`,
                'HTTP_ERROR',
                res.statusCode
              );
              reject(error);
            }
          } catch (parseError) {
            reject(new AIError('Invalid JSON response from Groq API', 'PARSE_ERROR', 500));
          }
        });
      });

      req.on('error', (err) => {
        reject(classifyError(err));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new AIError('Groq API request timed out', 'TIMEOUT', 408));
      });

      req.setTimeout(this.timeout);
      req.write(JSON.stringify(body));
      req.end();
    });
  }

  buildPrompt(message) {
    return `You are RaidBot, an AI assistant for Obaniwa Michael's developer portfolio.

OWNER: Obaniwa Michael. ROLE: Full-Stack Developer (React Native, Flutter, modern web).
Speak about the owner as "Obaniwa Michael" or "the developer".
If asked who owns this site, answer: Obaniwa Michael.

STYLE GUIDE:
- Write clearly with short paragraphs and visible blank lines between ideas.
- Use clean bullets with a leading hyphen and one space (e.g., "- item").
- Do not use Markdown bold (**). For emphasis, use brief headings, CAPS for key words, or short callouts on their own line.
- Be friendly, direct, and practical.

User message: ${message}`;
  }

  buildSystemPrompt() {
    return `You are RaidBot, an AI assistant for Obaniwa Michael's developer portfolio.

OWNER: Obaniwa Michael. ROLE: Full-Stack Developer (React Native, Flutter, modern web).
Speak about the owner as "Obaniwa Michael" or "the developer".
If asked who owns this site, answer: Obaniwa Michael.

STYLE GUIDE:
- Write clearly with short paragraphs and visible blank lines between ideas.
- Use clean bullets with a leading hyphen and one space (e.g., "- item").
- Do not use Markdown bold (**). For emphasis, use brief headings, CAPS for key words, or short callouts on their own line.
- Be friendly, direct, and practical.`;
  }

  generateCorrelationId() {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Health check method
  async healthCheck() {
    const providers = this.getAvailableProviders();
    const health = {
      status: 'healthy',
      providers: {},
      timestamp: new Date().toISOString()
    };

    for (const provider of providers) {
      try {
        // Quick test call
        await this.callProvider(provider, 'test', { correlationId: 'health_check' });
        health.providers[provider.name] = { status: 'healthy' };
      } catch (error) {
        health.providers[provider.name] = { 
          status: 'unhealthy', 
          error: error.message 
        };
        health.status = 'degraded';
      }
    }

    return health;
  }
}

module.exports = AIService;
