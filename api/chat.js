// Simplified AI Chat Function for Vercel using Gemini
const https = require('https');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      ok: true, 
      message: 'AI Chat API is live',
      hasGemini: !!process.env.GEMINI_API_KEY,
      hasGroq: !!process.env.GROQ_API_KEY
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) { body = {}; }
    }
    
    const { message } = body || {};
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(200).json({ 
        response: `You said: "${message}". The AI service is not configured yet. Please try again later.` 
      });
    }

    // Call Gemini API
    const geminiResponse = await callGeminiAPI(GEMINI_API_KEY, message);
    
    if (geminiResponse.error) {
      return res.status(502).json({ 
        error: 'AI service error', 
        details: geminiResponse.error 
      });
    }

    return res.status(200).json({ 
      response: geminiResponse.text,
      model: 'gemini-1.5-flash'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};

// Simplified Gemini API call
function callGeminiAPI(apiKey, userMessage) {
  return new Promise((resolve) => {
    const prompt = `You are RaidBot, an AI assistant for Obaniwa Michael's developer portfolio. 
    
OWNER: Obaniwa Michael. ROLE: Full-Stack Developer (React Native, Flutter, modern web). 
Speak about the owner as "Obaniwa Michael" or "the developer". 
If asked who owns this site, answer: Obaniwa Michael.

STYLE GUIDE:
- Write clearly with short paragraphs and visible blank lines between ideas.
- Use clean bullets with a leading hyphen and one space (e.g., "- item").
- Do not use Markdown bold (**). For emphasis, use brief headings, CAPS for key words, or short callouts on their own line.
- Be friendly, direct, and practical.

User message: ${userMessage}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    };

    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
            resolve({ text });
          } else {
            const msg = parsed.error?.message || `HTTP ${res.statusCode}`;
            resolve({ error: msg });
          }
        } catch (err) {
          resolve({ error: 'Invalid JSON response from Gemini API' });
        }
      });
    });

    req.on('error', (err) => resolve({ error: `Network error: ${err.message}` }));
    req.setTimeout(30000, () => { 
      req.destroy(); 
      resolve({ error: 'Request timeout' }); 
    });
    
    req.write(JSON.stringify(body));
    req.end();
  });
}
