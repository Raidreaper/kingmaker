// Simplified AI API for Vercel - Direct Gemini/Groq Integration
const https = require('https');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint
  if (req.method === 'GET') {
    try {
      const hasGemini = !!process.env.GEMINI_API_KEY;
      const hasGroq = !!process.env.GROQ_API_KEY;
      
      return res.status(200).json({
        status: 'healthy',
        providers: {
          gemini: { status: hasGemini ? 'configured' : 'not configured' },
          groq: { status: hasGroq ? 'configured' : 'not configured' }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
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
          error: 'Invalid JSON in request body'
        });
      }
    }

    const { message } = body || {};
    
    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string'
      });
    }

    // Try Gemini first, then Groq as fallback
    let response;
    let model;
    
    // Try Gemini API
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiResponse = await callGeminiAPI(process.env.GEMINI_API_KEY, message);
        response = geminiResponse.text;
        model = 'gemini-1.5-flash';
      } catch (geminiError) {
        console.log('Gemini failed, trying Groq:', geminiError.message);
        
        // Fallback to Groq
        if (process.env.GROQ_API_KEY) {
          try {
            const groqResponse = await callGroqAPI(process.env.GROQ_API_KEY, message);
            response = groqResponse.text;
            model = 'groq:llama-3.1-8b-instant';
          } catch (groqError) {
            throw new Error(`Both APIs failed: Gemini: ${geminiError.message}, Groq: ${groqError.message}`);
          }
        } else {
          throw geminiError;
        }
      }
    } else if (process.env.GROQ_API_KEY) {
      // Only Groq available
      try {
        const groqResponse = await callGroqAPI(process.env.GROQ_API_KEY, message);
        response = groqResponse.text;
        model = 'groq:llama-3.1-8b-instant';
      } catch (groqError) {
        throw groqError;
      }
    } else {
      return res.status(500).json({
        error: 'No AI providers configured. Please set GEMINI_API_KEY or GROQ_API_KEY environment variables.'
      });
    }

    return res.status(200).json({
      success: true,
      response: response,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
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
            resolve({ text });
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
            resolve({ text });
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