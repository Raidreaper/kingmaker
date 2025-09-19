// Quick test for your API endpoint
const VERCEL_URL = 'https://kingmaker-ten.vercel.app';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoint...');
    
    // Test health check
    const response = await fetch(`${VERCEL_URL}/api/ai`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ API is working!');
      
      // Test chat
      const chatResponse = await fetch(`${VERCEL_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello!' })
      });
      
      const chatData = await chatResponse.json();
      console.log('Chat Status:', chatResponse.status);
      console.log('Chat Response:', chatData);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAPI();
