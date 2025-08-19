<?php
// Groq AI Chat API for cPanel Hosting
// This file handles the AI chat requests

header('Content-Type: application/json');

// CORS configuration (whitelist)
$allowed_origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4173',
    'https://kingmaker.infy.uk',
    'https://kingsmaker.infy.uk'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if ($origin && in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else if (!$origin) {
    // Non-browser clients (no Origin) - allow
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Vary: Origin');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get the POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Message is required']);
        exit();
    }
    
    $message = $input['message'];
    
    // Your Groq API key (store this securely!)
    // Preferred: Environment variable (e.g., set in hosting control panel)
    $GROQ_API_KEY = getenv('GROQ_API_KEY');

    // Fallback: Optional config file outside web root (not committed)
    if (!$GROQ_API_KEY) {
        $configPath = __DIR__ . '/../config.php';
        if (file_exists($configPath)) {
            $config = include $configPath;
            if (is_array($config) && isset($config['groq_api_key'])) {
                $GROQ_API_KEY = $config['groq_api_key'];
            }
        }
    }
    
    if (!$GROQ_API_KEY) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Groq API key not configured',
            'message' => 'Please configure the API key in chat.php'
        ]);
        exit();
    }
    
    // Prepare the request to Groq
    $groqData = [
        'model' => 'meta-llama/llama-4-scout-17b-16e-instruct',
        'messages' => [
            [
                'role' => 'system',
                'content' => 'You are a helpful AI assistant for a developer portfolio. 
                The portfolio showcases skills in React, JavaScript, Python, Mobile Development, 
                and various other technologies. Be friendly, helpful, and informative about 
                the developer\'s skills and projects. Keep responses concise and engaging.
                
                When users ask about the portfolio, focus on:
                - The developer\'s technical skills and expertise
                - Projects showcased in the portfolio
                - How to navigate and use the site
                - Contact information and ways to reach the developer
                - Professional background and capabilities
                
                Be conversational, helpful, and always promote the developer\'s skills and projects.'
            ],
            [
                'role' => 'user',
                'content' => $message
            ]
        ],
        'temperature' => 1,
        'max_tokens' => 1024,
        'top_p' => 1,
        'stream' => false,
        'stop' => null
    ];
    
    // Make the request to Groq
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.groq.com/openai/v1/chat/completions');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($groqData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $GROQ_API_KEY,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($curlError) {
        throw new Exception('cURL Error: ' . $curlError);
    }
    
    if ($httpCode !== 200) {
        throw new Exception('Groq API returned HTTP ' . $httpCode . ': ' . $response);
    }
    
    $data = json_decode($response, true);
    
    if (!$data || isset($data['error'])) {
        throw new Exception('Groq API Error: ' . ($data['error']['message'] ?? 'Unknown error'));
    }
    
    if (!isset($data['choices'][0]['message']['content'])) {
        throw new Exception('Invalid response format from Groq API');
    }
    
    $aiResponse = $data['choices'][0]['message']['content'];
    
    // Return the successful response
    echo json_encode([
        'response' => $aiResponse,
        'usage' => $data['usage'] ?? null,
        'model' => 'meta-llama/llama-4-scout-17b-16e-instruct'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
}
?>


