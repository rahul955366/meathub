# 🚀 Quick Start: Enable Gen AI in MEATHUB

## Step 1: Choose Your AI Provider

### Option A: OpenAI (Recommended for Production)
1. Go to https://platform.openai.com/api-keys
2. Sign up/Login
3. Add payment method ($5 minimum)
4. Create API key
5. Copy the key

### Option B: Google Gemini (Free Tier - Good for Testing)
1. Go to https://makersuite.google.com/app/apikey
2. Create API key (free)
3. Copy the key

## Step 2: Configure Environment

### Windows (PowerShell):
```powershell
# For OpenAI
$env:OPENAI_API_KEY="sk-your-key-here"

# OR For Gemini
$env:GEMINI_API_KEY="your-key-here"
```

### Linux/Mac:
```bash
# For OpenAI
export OPENAI_API_KEY="sk-your-key-here"

# OR For Gemini
export GEMINI_API_KEY="your-key-here"
```

## Step 3: Update Configuration

Edit `ai-service/src/main/resources/application.properties`:

```properties
# Enable AI
ai.enabled=true
ai.provider=openai  # or "gemini"

# Add your API key (or use environment variable)
openai.api.key=${OPENAI_API_KEY:}
# OR
gemini.api.key=${GEMINI_API_KEY:}
```

## Step 4: Rebuild and Run

```bash
cd ai-service
mvn clean package
java -jar target/ai-service-1.0.0.jar
```

## Step 5: Test

```bash
curl -X POST http://localhost:8000/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "What chicken products do you have?"}'
```

## Step 6: Use in Frontend

The AI Assistant component is already integrated! Just:
1. Click the chat icon in the UI
2. Start chatting with the AI
3. Try: "Show me chicken products", "Track my order", "Recipe for biryani"

---

## 💡 Example Queries

- "I need 2kg chicken for dinner"
- "What's the best mutton for curry?"
- "Where is my order?"
- "Show me high protein options"
- "Recipe for butter chicken"
- "Compare chicken breast vs whole chicken"

---

## 🔧 Troubleshooting

**AI not responding?**
- Check API key is set correctly
- Verify `ai.enabled=true` in properties
- Check logs: `logging.level.com.meatup.ai=DEBUG`

**Getting errors?**
- Ensure WebFlux dependency is added (already done)
- Check API key has credits (OpenAI) or is valid (Gemini)
- Verify network connectivity

**Want to use local AI?**
- Install Ollama: https://ollama.ai
- Run: `ollama run llama2`
- Set `ai.provider=ollama` and configure endpoint

---

## 📊 Cost Monitoring

**OpenAI GPT-3.5-turbo:**
- ~$0.0015 per 1K tokens
- Average chat: ~500 tokens = $0.00075
- 1000 chats/day = ~$0.75/day = $22.50/month

**Google Gemini (Free Tier):**
- 60 requests/minute
- Free up to 15 requests/minute
- Perfect for testing!

---

**Ready to go!** Your AI assistant is now powered by real Gen AI! 🎉

