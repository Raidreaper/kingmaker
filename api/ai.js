// Ultra-simple AI API for Vercel
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      providers: {
        gemini: { status: process.env.GEMINI_API_KEY ? 'configured' : 'not configured' },
        groq: { status: process.env.GROQ_API_KEY ? 'configured' : 'not configured' }
      },
      timestamp: new Date().toISOString()
    });
  }

  // POST request for AI chat
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { message } = body || {};

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Simple response for now to test if the function works
      return res.status(200).json({
        success: true,
        response: `You said: "${message}". The AI service is working!`,
        model: 'test',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
};