// Serverless AI Chat Function for Vercel using Groq (CommonJS)
// Load .env in local development so GROQ_API_KEY is available
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (_) {}
}

// Use Node.js built-in modules for better Vercel compatibility
const https = require('https');
const http = require('http');

// Small utility to perform HTTPS JSON POST
function httpsJsonPost({ hostname, path, headers, body, timeoutMs = 30000 }) {
  return new Promise((resolve) => {
    const req = https.request({ hostname, path, method: 'POST', headers, timeout: timeoutMs }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          resolve({ statusCode: res.statusCode || 0, body: parsed });
        } catch (_) {
          resolve({ statusCode: res.statusCode || 0, body: undefined, raw: data });
        }
      });
    });
    req.on('error', (err) => resolve({ error: `Network error: ${err.message}` }));
    try { req.write(typeof body === 'string' ? body : JSON.stringify(body)); } catch (_) {}
    req.end();
  });
}

module.exports = async function handler(req, res) {
  // Set CORS headers for Vercel deployment
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Lightweight health check via GET
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: 'RaidBot API is live' });
  }

  // Only allow POST requests
  if ((req.method || '').toUpperCase() !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Basic in-memory token bucket (per-process)
    if (!global.__rl) {
      global.__rl = { tokens: 40, last: Date.now() }; // 40 req / minute burst
    }
    const now = Date.now();
    const elapsed = (now - global.__rl.last) / 1000; // seconds
    const refillRate = 0.8; // tokens per second (~48/min)
    global.__rl.tokens = Math.min(60, global.__rl.tokens + elapsed * refillRate);
    global.__rl.last = now;
    if (global.__rl.tokens < 1) {
      res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment and try again.' });
      return;
    }
    global.__rl.tokens -= 1;

    // Parse JSON body defensively (Vercel may pass stringified body)
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) { body = {}; }
    }
    const { message } = body || {};

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Your API keys
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // Build optional scraped context before calling models

    // Detect a URL in the user's message and scrape minimal readable text
    const urlRegex = /(https?:\/\/[^\s)]+)\/?/ig;
    const urls = [...String(message).matchAll(urlRegex)].map(m => m[1]);
    let scrapedContext = '';
    if (urls.length > 0) {
      const targetUrl = urls[0];
      try {
        scrapedContext = await scrapeUrl(targetUrl);
        if (scrapedContext.length > 12000) scrapedContext = scrapedContext.slice(0, 12000);
      } catch (_) {
        // ignore scraping failures
      }
    }

    // Construct messages with optional scraped context
    const messages = [
      {
        role: 'system',
        content: `You are RaidBot, an AI assistant for a developer portfolio.

STYLE GUIDE
- Write clearly with short paragraphs and visible blank lines between ideas.
- Use clean bullets with a leading hyphen and one space (e.g., "- item").
- Prefer concise headings followed by content when listing multiple sections.
- Do not use Markdown bold (**). For emphasis, use brief headings, CAPS for key words, or short callouts on their own line.
- Avoid walls of text. Keep lists tight and relevant.

SCOPE
- Focus on portfolio support: skills, projects, navigation, contact info.
- When a URL is provided, summarize faithfully from the page context given. Do not invent details.
- Be friendly, direct, and practical.`
      },
      { role: 'system', content: `OWNER: Obaniwa Michael. ROLE: Full-Stack Developer (React Native, Flutter, modern web). Speak about the owner as "Obaniwa Michael" or "the developer". If asked who owns this site, answer: Obaniwa Michael.` },
      scrapedContext ? { role: 'system', content: `Webpage context (truncated):\n${scrapedContext}` } : null,
      { role: 'user', content: message }
    ].filter(Boolean);

    // Prefer Groq if configured, otherwise try Gemini; if primary fails, fall back to the other
    let primaryTried = false;
    let lastError = null;

    if (GROQ_API_KEY) {
      primaryTried = true;
      const groqResponse = await callGroqAPI(GROQ_API_KEY, messages);
      if (!groqResponse.error) {
        const aiResponse = groqResponse.choices[0].message.content;
        return res.status(200).json({ response: aiResponse, usage: groqResponse.usage, model: 'groq:meta-llama/llama-4-scout-17b-16e-instruct' });
      }
      lastError = `Groq: ${groqResponse.error}`;
    }

    if (GEMINI_API_KEY) {
      const systemText = messages
        .filter(m => m.role === 'system')
        .map(m => m.content)
        .join('\n\n');
      const userText = message;
      const geminiResponse = await callGeminiAPI(GEMINI_API_KEY, systemText, scrapedContext, userText);
      if (!geminiResponse.error) {
        const aiResponse = geminiResponse.text;
        return res.status(200).json({ response: aiResponse, model: geminiResponse.model || 'gemini-1.5-flash' });
      }
      lastError = lastError ? `${lastError}; Gemini: ${geminiResponse.error}` : `Gemini: ${geminiResponse.error}`;
    }

    if (!primaryTried && !GEMINI_API_KEY) {
      const reply = `You said: "${message}". The AI service is not configured yet. Please try again later.`;
      return res.status(200).json({ response: reply });
    }

    // If both failed
    return res.status(502).json({ error: 'Upstream AI service error', details: lastError || 'Unknown error' });

  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Something went wrong while processing your request'
    });
  }
}

// Helper function to scrape URL content using Node.js native HTTP
function scrapeUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
    
    const req = client.get(url, {
      headers: { 'User-Agent': 'RaidBot/1.0 (+portfolio)' }
    }, (res) => {
      clearTimeout(timeout);
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const text = extractReadableText(data);
          resolve(text);
        } catch (err) {
          reject(err);
        }
      });
    });
    
    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      clearTimeout(timeout);
      reject(new Error('Request timeout'));
    });
  });
}

// Helper function to call Groq API using Node.js native HTTP
function callGroqAPI(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages,
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    const options = {
      hostname: 'api.groq.com',
      port: 443,
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            const error = parsed.error?.message || parsed.error || `HTTP ${res.statusCode}`;
            resolve({ error });
          } else if (parsed.error) {
            resolve({ error: parsed.error.message || 'Groq API error' });
          } else {
            resolve(parsed);
          }
        } catch (err) {
          resolve({ error: 'Invalid JSON response from Groq API' });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ error: `Network error: ${err.message}` });
    });

    req.setTimeout(30000, () => {
      req.destroy();
      resolve({ error: 'Request timeout' });
    });

    req.write(postData);
    req.end();
  });
}

// Helper function to call Google Gemini API
// We convert our chat format into a single prompt: [SYSTEM]\n[CONTEXT]\n[USER]
function callGeminiAPI(apiKey, systemText, scrapedContext, userText) {
  return new Promise((resolve) => {
    const promptParts = [];
    if (systemText) promptParts.push(systemText);
    if (scrapedContext) promptParts.push(`Webpage context (truncated):\n${scrapedContext}`);
    if (userText) promptParts.push(userText);
    const fullPrompt = promptParts.join('\n\n');

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const path = `/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: fullPrompt }]
        }
      ]
    };

    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `${path}?key=${encodeURIComponent(apiKey)}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            resolve({ text, model });
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
    req.setTimeout(30000, () => { req.destroy(); resolve({ error: 'Request timeout' }); });
    req.write(JSON.stringify(body));
    req.end();
  });
}

// Simple readable text extractor for scraped HTML
function extractReadableText(html) {
  try {
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ');
    text = text.replace(/<\/(p|div|h\d|li|br|section|article)>/gi, '\n');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    text = text.replace(/\s+/g, ' ').trim();
    return text;
  } catch (_) {
    return '';
  }
}
