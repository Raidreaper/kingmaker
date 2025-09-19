// Working AI API for Vercel with Gemini/Groq integration
const https = require('https');

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

      // Try to get AI response
      let aiResponse = null;
      let model = 'none';

      // Try Gemini first
      if (process.env.GEMINI_API_KEY) {
        try {
          aiResponse = await callGeminiAPI(process.env.GEMINI_API_KEY, message);
          model = 'gemini-1.5-flash';
        } catch (error) {
          console.log('Gemini failed:', error.message);
        }
      }

      // Fallback to Groq if Gemini fails or not configured
      if (!aiResponse && process.env.GROQ_API_KEY) {
        try {
          aiResponse = await callGroqAPI(process.env.GROQ_API_KEY, message);
          model = 'groq:llama-3.1-8b-instant';
        } catch (error) {
          console.log('Groq failed:', error.message);
        }
      }

      // If no AI service available, return a basic response
      if (!aiResponse) {
        return res.status(200).json({
          success: true,
          response: `You said: "${message}". The AI service is not configured yet. Please try again later.`,
          model: 'fallback',
          timestamp: new Date().toISOString()
        });
      }

      return res.status(200).json({
        success: true,
        response: aiResponse,
        model: model,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
};

// Gemini API call
function callGeminiAPI(apiKey, message) {
  return new Promise((resolve, reject) => {
    const prompt = `You are RaidBot, an AI assistant for Obaniwa Michael's developer portfolio.

OWNER: Obaniwa Michael. ROLE: Full-Stack Developer (React Native, Flutter, modern web).
Speak about the owner as "Obaniwa Michael" or "the developer".
If asked who owns this site, answer: Obaniwa Michael.

STYLE GUIDE:
- Write clearly with short paragraphs and visible blank lines between ideas.
- Use clean bullets with a leading hyphen and one space (e.g., "- item").
- Do not use Markdown bold (**). For emphasis, use brief headings, CAPS for key words, or short callouts on their own line.
- Be friendly, direct, and practical.

User message: ${message}`;
    
    const body = {
      contents: [{
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
      timeout: 25000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
            resolve(text);
          } else {
            reject(new Error(parsed.error?.message || `HTTP ${res.statusCode}`));
          }
        } catch (parseError) {
          reject(new Error('Invalid JSON response from Gemini API'));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API request timed out'));
    });

    req.setTimeout(25000);
    req.write(JSON.stringify(body));
    req.end();
  });
}

// Groq API call
function callGroqAPI(apiKey, message) {
  return new Promise((resolve, reject) => {
    const messages = [
      {
        role: 'system',
        content: `You are RaidBot, an AI assistant for Obaniwa Michael's developer portfolio.

OWNER: Obaniwa Michael. ROLE: Full-Stack Developer (React Native, Flutter, modern web).
Speak about the owner as "Obaniwa Michael" or "the developer".
If asked who owns this site, answer: Obaniwa Michael.

STYLE GUIDE:
- Write clearly with short paragraphs and visible blank lines between ideas.
- Use clean bullets with a leading hyphen and one space (e.g., "- item").
- Do not use Markdown bold (**). For emphasis, use brief headings, CAPS for key words, or short callouts on their own line.
- Be friendly, direct, and practical.`
      },
      {
        role: 'user',
        content: message
      }
    ];

    const body = {
      model: 'llama-3.1-8b-instant',
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
      timeout: 25000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const text = parsed.choices?.[0]?.message?.content || 'No response generated';
            resolve(text);
          } else {
            reject(new Error(parsed.error?.message || `HTTP ${res.statusCode}`));
          }
        } catch (parseError) {
          reject(new Error('Invalid JSON response from Groq API'));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Groq API request timed out'));
    });

    req.setTimeout(25000);
    req.write(JSON.stringify(body));
    req.end();
  });
}