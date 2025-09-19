// Vercel API Route with Robust Error Handling
const AIService = require('../lib/aiService');
const { logError } = require('../lib/errorHandler');

// Initialize AI service
const aiService = new AIService({
  timeout: 25000, // 25 seconds (under Vercel's 30s limit)
  maxRetries: 3
});

async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint
  if (req.method === 'GET') {
    try {
      const health = await aiService.healthCheck();
      return res.status(200).json(health);
    } catch (error) {
      logError(error, { endpoint: 'health_check' });
      return res.status(500).json({
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Only allow POST requests for AI chat
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'OPTIONS']
    });
  }

  try {
    // Parse request body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (parseError) {
        return res.status(400).json({
          error: 'Invalid JSON in request body',
          details: parseError.message
        });
      }
    }

    const { message, options = {} } = body;

    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Validate message length
    if (message.length > 4000) {
      return res.status(400).json({
        error: 'Message too long',
        maxLength: 4000,
        actualLength: message.length
      });
    }

    // Generate AI response
    const startTime = Date.now();
    const result = await aiService.generateResponse(message, options);
    const processingTime = Date.now() - startTime;

    // Add performance metrics
    result.metrics = {
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString()
    };

    // Return success response
    return res.status(200).json(result);

  } catch (error) {
    logError(error, { 
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    // Return appropriate error response
    const statusCode = error.statusCode || 500;
    const errorResponse = {
      success: false,
      error: error.message || 'Internal server error',
      type: error.type || 'UNKNOWN',
      correlationId: error.correlationId,
      timestamp: new Date().toISOString()
    };

    // Don't expose internal details in production
    if (process.env.NODE_ENV === 'production') {
      delete errorResponse.type;
      delete errorResponse.correlationId;
    }

    return res.status(statusCode).json(errorResponse);
  }
}

// Export for Vercel
module.exports = handler;
