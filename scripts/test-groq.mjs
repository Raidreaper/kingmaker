import 'dotenv/config';

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.error('GROQ_API_KEY is not set. Create a .env file with GROQ_API_KEY=...');
  process.exit(1);
}

const payload = {
  model: 'meta-llama/llama-4-scout-17b-16e-instruct',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Say hello in one short sentence.' }
  ],
  temperature: 0.2,
  max_tokens: 20,
  stream: false
};

try {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  console.log('Status:', res.status, res.statusText);
  const data = await res.json();
  console.log('Response keys:', Object.keys(data));
  if (data.error) {
    console.error('API Error:', data.error);
    process.exit(2);
  }
  console.log('Model:', data.model || (data.choices && data.choices[0] && data.choices[0].model));
  console.log('AI:', data.choices?.[0]?.message?.content || '(no content)');
} catch (err) {
  console.error('Request failed:', err);
  process.exit(3);
}


