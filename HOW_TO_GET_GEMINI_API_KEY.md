# 🔑 How to Get Google Gemini API Key - Step-by-Step Guide

## Quick Steps Overview
1. Go to Google AI Studio
2. Sign in with Google account
3. Create API key
4. Copy and save the key
5. Configure in your project

---

## 📋 Detailed Step-by-Step Instructions

### Step 1: Visit Google AI Studio
Open your web browser and go to:
```
https://makersuite.google.com/app/apikey
```
OR
```
https://aistudio.google.com/app/apikey
```

### Step 2: Sign In
- Click **"Sign in"** button (top right)
- Use your **Google account** (Gmail account)
- If you don't have a Google account, create one first at [accounts.google.com](https://accounts.google.com)

### Step 3: Create API Key
1. Once signed in, you'll see the **"Get API Key"** page
2. Click the **"Create API Key"** button (usually a blue button)
3. You may be asked to:
   - Select a Google Cloud project (or create a new one)
   - Accept terms of service
4. Click **"Create API Key in New Project"** or select existing project

### Step 4: Copy Your API Key
- Your API key will appear on screen (looks like: `AIzaSyC...`)
- **⚠️ IMPORTANT:** Copy this key immediately - you won't be able to see it again!
- Click the **copy icon** or select all and copy (Ctrl+C)

### Step 5: Save Your API Key Securely
- Save it in a secure place (password manager, notes app, etc.)
- **Never share this key publicly** or commit it to GitHub

---

## 🔧 Configure API Key in Your Project

### Option 1: Environment Variable (Recommended for Development)

**Windows PowerShell:**
```powershell
# Set for current session
$env:GEMINI_API_KEY="YOUR_API_KEY_HERE"

# Set permanently (requires admin)
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'YOUR_API_KEY_HERE', 'User')
```

**Windows CMD:**
```cmd
set GEMINI_API_KEY=YOUR_API_KEY_HERE
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY="YOUR_API_KEY_HERE"

# Make it permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export GEMINI_API_KEY="YOUR_API_KEY_HERE"' >> ~/.bashrc
source ~/.bashrc
```

### Option 2: application.properties (Quick Setup)

1. Open file: `ai-service/src/main/resources/application.properties`
2. Find this line:
   ```properties
   gemini.api.key=${GEMINI_API_KEY:your-api-key-here}
   ```
3. Replace `your-api-key-here` with your actual API key:
   ```properties
   gemini.api.key=AIzaSyC_YOUR_ACTUAL_API_KEY_HERE
   ```
4. **⚠️ WARNING:** Don't commit this file to Git if it contains your real API key!

---

## ✅ Verify Setup

### Check Configuration
1. Open `ai-service/src/main/resources/application.properties`
2. Verify these settings:
   ```properties
   ai.enabled=true
   ai.provider=gemini
   gemini.model=gemini-1.5-flash
   gemini.api.key=YOUR_KEY_HERE
   ```

### Test the API Key
After restarting your AI service, test it:

**Using curl:**
```bash
curl -X POST http://localhost:8092/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Hello!",
    "language": "en"
  }'
```

**Or test in your Gym AI Assistant:**
1. Go to Gym page
2. Open Gym AI Assistant
3. Type: "Hello"
4. Should get a response from Gemini AI

---

## 🚨 Troubleshooting

### Problem: "AI assistant is not configured"
**Solution:**
- Check `ai.enabled=true` in application.properties
- Verify API key is set correctly
- Restart the AI service

### Problem: "Error calling Gemini API"
**Possible causes:**
1. **Invalid API Key**
   - Double-check you copied the entire key
   - No extra spaces before/after

2. **API Key Not Activated**
   - Go back to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Verify your key is active

3. **Rate Limit Exceeded**
   - Free tier: 15 requests/minute
   - Wait a minute and try again

4. **Internet Connection**
   - Check your internet connection
   - Check firewall settings

### Problem: "API key not found"
**Solution:**
- If using environment variable: Restart your terminal/IDE
- If using application.properties: Make sure file is saved
- Restart the AI service

---

## 📊 API Key Limits (Free Tier)

- **15 requests per minute**
- **1,500 requests per day**
- **32,000 tokens per minute**

For higher limits, upgrade to paid tier in Google Cloud Console.

---

## 🔒 Security Best Practices

1. ✅ **Use Environment Variables** in production
2. ✅ **Never commit API keys** to Git
3. ✅ **Add to .gitignore:**
   ```
   application.properties
   *.env
   ```
4. ✅ **Rotate keys** if exposed
5. ✅ **Use different keys** for dev/prod

---

## 🎯 Quick Reference

| Item | Value |
|------|-------|
| **API Key URL** | https://aistudio.google.com/app/apikey |
| **Config File** | `ai-service/src/main/resources/application.properties` |
| **Property Name** | `gemini.api.key` |
| **Default Model** | `gemini-1.5-flash` |
| **Service Port** | `8092` |

---

## 📞 Need Help?

1. Check logs: `ai-service` console output
2. Verify API key at: https://aistudio.google.com/app/apikey
3. Check Google Cloud Console for usage/quota
4. Review `ai-service/GEMINI_SETUP.md` for more details

---

## ✅ Checklist

- [ ] Got API key from Google AI Studio
- [ ] Saved API key securely
- [ ] Set environment variable OR updated application.properties
- [ ] Verified `ai.enabled=true`
- [ ] Verified `ai.provider=gemini`
- [ ] Restarted AI service
- [ ] Tested with Gym AI Assistant

**You're all set! 🎉**

