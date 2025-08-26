// Serverless AI Chat Function for Vercel using Groq
// This provides real AI responses for your portfolio chat

export default async function handler(req, res) {
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
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Your Groq API key
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'Groq API key not configured',
        message: 'Please add GROQ_API_KEY to your environment variables'
      });
    }

    console.log('🤖 Sending message to Groq:', message);

    // Call Groq API with Llama 4 Scout model
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for a developer portfolio. 
            The portfolio showcases skills in React, JavaScript, Python, Mobile Development, 
            and various other technologies. Be friendly, helpful, and informative about 
            the developer's skills and projects. Keep responses concise and engaging.
            
            When users ask about the portfolio, focus on:
            - The developer's technical skills and expertise
            - Projects showcased in the portfolio
            - How to navigate and use the site
            - Contact information and ways to reach the developer
            - Professional background and capabilities
            
            Be conversational, helpful, and always promote the developer's skills and projects.`
          },
          {
            role: 'user',
            content: message
          }
        ],
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
