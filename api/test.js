// Simple test function to debug Vercel deployment
module.exports = async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return res.status(200).json({ 
      ok: true, 
      message: 'Test API is working',
      method: req.method,
      env: {
        hasGroq: !!process.env.GROQ_API_KEY,
        hasGemini: !!process.env.GEMINI_API_KEY,
        nodeVersion: process.version
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Test failed',
      message: error.message
    });
  }
};

