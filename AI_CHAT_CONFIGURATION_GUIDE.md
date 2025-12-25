# 🤖 AI Chat Configuration Guide

## Current Issues
1. ✅ **Chat Interface** - Already working correctly! Shows full conversation history
2. ❌ **AI Responses** - Shows "AI service is not configured" - needs Gemini API key

---

## Fix: Add Gemini API Key

### Step 1: Get Your Free API Key

1. Visit: **https://makersuite.google.com/app/apikey**
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

### Step 2: Add to AI Service

**Option A: Direct Configuration (Quickest)**

1. Open: `ai-service\src\main\resources\application.properties`
2. Add this line:
   ```properties
   gemini.api.key=YOUR_API_KEY_HERE
   ```
3. Replace `YOUR_API_KEY_HERE` with your actual key

**Option B: Environment Variable (More Secure)**

1. Open: `ai-service\src\main\resources\application.properties`
2. Add:
   ```properties
   gemini.api.key=${GEMINI_API_KEY:}
   ```
3. Set environment variable before running:
   ```powershell
   $env:GEMINI_API_KEY="YOUR_API_KEY_HERE"
   java -jar target/ai-service-1.0.0.jar
   ```

### Step 3: Restart AI Service

```powershell
# Stop current AI service (if running)
$processId = (Get-NetTCPConnection -LocalPort 8092 -ErrorAction SilentlyContinue).OwningProcess
if($processId) { taskkill /F /PID $processId }

# Rebuild with new config
cd ai-service
mvn package -DskipTests

# Start service
java -jar target/ai-service-1.0.0.jar
```

---

## About the Chat Interface

### ✅ Your chat IS already conversational!

The AIAssistant component (`AIAssistant.tsx`) already:
- ✅ Maintains full conversation history in `messages` state
- ✅ Shows all previous messages (both user and AI)
- ✅ Allows continuous back-and-forth conversation
- ✅ Auto-scrolls to latest message
- ✅ Shows typing indicators

**The interface is working perfectly!** You just need the API key for real AI responses.

### Current Behavior:

**Without API Key:**
```
User: "Hello"
AI: "AI service is not configured. Please contact support."
User: "Help me"
AI: "AI service is not configured. Please contact support."
```
↑ **This is what you're seeing now**

**With API Key:**
```
User: "Hello"
AI: "Hi! I'm your MEATHUB assistant. How can I help you today?"
User: "I want to order chicken"
AI: "Great! I can help you order chicken. What type would you like? We have:
     • Chicken Breast
     • Chicken Curry Cut
     • Chicken Thighs
     • Chicken Legs"
User: "Chicken breast, 500g"
AI: "Perfect! I'm adding 500g of chicken breast to your cart..."
```
↑ **This is what you'll get after adding the API key**

---

## Testing After Configuration

### Test 1: Simple Chat
1. Open your app: http://localhost:5173
2. Click the AI chat bubble (bottom right)
3. Type: "Hello"
4. You should get a personalized AI response

### Test 2: Conversation Flow
```
You: "What meats do you have?"
AI: [Lists available meats]
You: "Tell me about chicken breast"
AI: [Explains chicken breast details]
You: "How do I cook it?"
AI: [Gives cooking instructions]
You: "Add 500g to cart"
AI: [Helps add to cart]
```

All messages stay visible - full conversation history!

---

## Alternative: Use Local Fallback (No API Key)

If you don't want to use Gemini API, I can modify the AI service to use rule-based responses:

**File:** `ai-service/src/main/java/com/meatup/ai/service/AiChatService.java`

Add fallback logic to provide helpful responses without external API:
- Order tracking: "Your order ORD-123 is being prepared..."
- Product info: "Chicken breast is high in protein..."
- Cooking tips: "For grilled chicken..."
- etc.

This would work offline but be less intelligent than Gemini.

---

## Quick Command Reference

```powershell
# Check if AI service is running
netstat -ano | findstr ":8092"

# View AI service config
Get-Content ai-service\src\main\resources\application.properties

# Test AI endpoint
$body = '{"message":"Hello","language":"EN"}'
Invoke-WebRequest -Uri "http://localhost:8092/ai/chat" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"

# Expected with API key: Real AI response
# Expected without: "AI service is not configured"
```

---

## Summary

1. ✅ **Chat UI** - Already perfect! Shows full conversation
2. ❌ **Backend** - Needs Gemini API key for intelligent responses
3. 🔧 **Fix** - Add API key to `application.properties`
4. ⏱️ **Time** - 2 minutes to add key + restart service

**Your chat interface is working correctly!** It's just waiting for the AI backend to give real responses instead of the "not configured" message.

---

## Need Help?

**Get API Key Issues?**
- Visit: https://aistudio.google.com/ (alternative link)
- Make sure you're logged into Google account
- API keys are free for testing

**Still seeing "not configured"?**
- Check the key is correctly added (no extra spaces)
- Restart the AI service after adding key
- Check AI service logs for errors

---

*Ready to have intelligent conversations with your AI assistant!* 🚀
