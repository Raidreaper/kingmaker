// Simple test function to debug Vercel deployment
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      ok: true, 
      message: 'Test API is working',
      env: {
        hasGroq: !!process.env.GROQ_API_KEY,
        hasGemini: !!process.env.GEMINI_API_KEY,
        nodeVersion: process.version
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) { body = {}; }
    }
    
    return res.status(200).json({ 
      message: 'Test successful',
      received: body,
      env: {
        hasGroq: !!process.env.GROQ_API_KEY,
        hasGemini: !!process.env.GEMINI_API_KEY
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    });
  }
};

