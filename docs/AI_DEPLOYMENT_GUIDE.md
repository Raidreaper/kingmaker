# AI Service Deployment Guide

## Overview
This guide covers deploying the robust AI service with comprehensive error handling to Vercel.

## Prerequisites
- Vercel account
- Gemini API key
- Groq API key (optional, for fallback)

## Environment Variables

### Required
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Optional
```bash
GROQ_API_KEY=your_groq_api_key_here
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=production
```

## Deployment Steps

### 1. Set Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the required environment variables

### 2. Deploy the Application
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

### 3. Verify Deployment
Test the health endpoint:
```bash
curl https://your-domain.vercel.app/api/ai
```

Expected response:
```json
{
  "status": "healthy",
  "providers": {
    "gemini": { "status": "healthy" }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## API Endpoints

### Health Check
- **GET** `/api/ai`
- Returns service health status

### AI Chat
- **POST** `/api/ai`
- **Body**: `{ "message": "Your question" }`
- **Response**: `{ "success": true, "response": "AI response", "model": "gemini-1.5-flash" }`

## Error Handling

### Client-Side
The client automatically handles:
- Network errors with retry
- Rate limiting with backoff
- Timeout errors
- Server errors with fallback

### Server-Side
The server provides:
- Comprehensive error logging
- Circuit breaker pattern
- Automatic failover between providers
- Request timeout handling

## Monitoring

### Logs
Check Vercel function logs for:
- Error details
- Performance metrics
- Request correlation IDs

### Health Monitoring
Monitor the health endpoint for:
- Service availability
- Provider status
- Response times

## Troubleshooting

### Common Issues

#### 1. FUNCTION_INVOCATION_FAILED
- Check environment variables are set
- Verify API keys are valid
- Check function logs for syntax errors

#### 2. 500 Internal Server Error
- Verify API keys are correct
- Check rate limits
- Review function logs

#### 3. Timeout Errors
- Reduce request complexity
- Check network connectivity
- Verify API provider status

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
```

## Performance Optimization

### Request Timeout
- Default: 25 seconds (under Vercel's 30s limit)
- Adjustable in configuration

### Retry Logic
- Max retries: 3
- Exponential backoff with jitter
- Circuit breaker for failing services

### Caching
- No caching implemented (stateless)
- Consider implementing for production

## Security Considerations

### API Keys
- Never expose API keys in client-side code
- Use environment variables only
- Rotate keys regularly

### Rate Limiting
- Implemented at service level
- Consider additional client-side limiting

### Input Validation
- Message length limits (4000 characters)
- Content sanitization
- Request size limits

## Scaling Considerations

### Vercel Limits
- 30-second function timeout
- 50MB payload limit
- 1000 concurrent executions

### Optimization
- Use connection pooling
- Implement request batching
- Consider edge functions for global performance

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Load Testing
```bash
npm run test:load
```

## Maintenance

### Regular Tasks
1. Monitor error rates
2. Check API key validity
3. Review performance metrics
4. Update dependencies

### Updates
1. Test in development
2. Deploy to staging
3. Monitor production
4. Rollback if needed

## Support

### Logs
- Vercel Function Logs
- Browser Console
- Network Tab

### Debugging
- Use correlation IDs for tracing
- Check health endpoint status
- Verify environment variables

### Contact
- GitHub Issues
- Email support
- Documentation updates
