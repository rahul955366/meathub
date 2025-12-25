# 🚀 Google Gemini API Setup Guide

## Quick Setup

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the API Key

**Option A: Environment Variable (Recommended)**
```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your-api-key-here"

# Windows CMD
set GEMINI_API_KEY=your-api-key-here

# Linux/Mac
export GEMINI_API_KEY=your-api-key-here
```

**Option B: application.properties**
Edit `ai-service/src/main/resources/application.properties`:
```properties
gemini.api.key=your-api-key-here
```

### 3. Enable AI Service

In `ai-service/src/main/resources/application.properties`:
```properties
ai.enabled=true
ai.provider=gemini
gemini.model=gemini-1.5-flash
```

### 4. Restart the AI Service

Restart the `ai-service` microservice for changes to take effect.

## Configuration Options

```properties
# AI Service
ai.enabled=true                    # Enable/disable AI
ai.provider=gemini                 # gemini, openai

# Gemini Configuration
gemini.api.key=${GEMINI_API_KEY:your-api-key-here}
gemini.model=gemini-1.5-flash      # gemini-1.5-flash (fast), gemini-1.5-pro (better)
gemini.temperature=0.7             # 0.0-1.0 (creativity)
gemini.max-tokens=1000             # Response length
```

## Available Models

- `gemini-1.5-flash` - Fast, cost-effective (recommended)
- `gemini-1.5-pro` - More capable, slower
- `gemini-pro` - Legacy model

## Testing

Test the AI service:
```bash
curl -X POST http://localhost:8092/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Hello!",
    "language": "en",
    "context": "GYM",
    "userContext": {
      "goal": "BULKING",
      "dailyProtein": 250
    }
  }'
```

## Specialized AI Contexts

- `GYM` - Gym & Fitness AI Coach
- `PET` - Pet Nutrition AI Assistant
- `GENERAL` - General MEATHUB Assistant (default)

## Troubleshooting

**Error: "AI assistant is not configured"**
- Check that `ai.enabled=true`
- Verify API key is set correctly
- Check API key has proper permissions

**Error: "Error calling Gemini API"**
- Verify API key is valid
- Check internet connection
- Review logs for detailed error messages

**Rate Limits**
- Free tier: 15 requests per minute
- Paid tier: Higher limits available

## Next Steps

1. ✅ Get API key
2. ✅ Set environment variable or update properties
3. ✅ Enable AI service
4. ✅ Restart service
5. ✅ Test with Gym AI Assistant on gym page

