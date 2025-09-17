// Serverless AI Chat Function for Vercel using Groq (CommonJS)
// Load .env in local development so GROQ_API_KEY is available
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (_) {}
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

  // Only allow POST requests
  if (req.method !== 'POST') {
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

    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Your Groq API key
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      // Fallback placeholder response when key is not configured (e.g., local dev)
      const reply = `You said: "${message}". The AI service is not configured yet. Please try again later.`;
      return res.status(200).json({ response: reply });
    }

    // Detect a URL in the user's message and scrape minimal readable text
    const urlRegex = /(https?:\/\/[^\s)]+)\/?/ig;
    const urls = [...String(message).matchAll(urlRegex)].map(m => m[1]);
    let scrapedContext = '';
    if (urls.length > 0) {
      const targetUrl = urls[0];
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const pageRes = await fetch(targetUrl, {
          signal: controller.signal,
          headers: { 'User-Agent': 'RaidBot/1.0 (+portfolio)' }
        });
        clearTimeout(timeout);
        if (pageRes.ok) {
          const html = await pageRes.text();
          scrapedContext = extractReadableText(html);
          if (scrapedContext.length > 12000) scrapedContext = scrapedContext.slice(0, 12000);
        }
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

    // Call Groq API with Llama 4 Scout model
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages,
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false, // Set to false for serverless function
        stop: null
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('❌ Groq API Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const aiResponse = data.choices[0].message.content;
    console.log('✅ Groq API Response:', aiResponse);

    return res.status(200).json({ 
      response: aiResponse,
      usage: data.usage,
      model: 'meta-llama/llama-4-scout-17b-16e-instruct'
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Something went wrong while processing your request'
    });
  }
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
