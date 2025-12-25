# 🔧 Fix Gemini API - Complete Step-by-Step Guide

**Estimated Time:** 30-60 minutes  
**Result:** Fully working, intelligent Gemini AI

---

## 📋 STEP 1: Enable Generative Language API

### 1.1 Visit Google Cloud Console
**URL:** https://console.cloud.google.com/

**Actions:**
1. Sign in with your Google account
2. If you see a project selector, note the current project name
3. If no project exists, you'll need to create one

### 1.2 Enable the Generative Language API
**DIRECT LINK:** https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

**Actions:**
1. Click the **"ENABLE"** button (big blue button)
2. Wait for the API to be enabled (10-30 seconds)
3. You should see "API enabled" confirmation

**Screenshot checkpoint:** You should see "Generative Language API" with a green checkmark

---

## 📋 STEP 2: Create API Key (The Right Way)

### 2.1 Go to Credentials Page
**DIRECT LINK:** https://console.cloud.google.com/apis/credentials

**Actions:**
1. Click **"+ CREATE CREDENTIALS"** at the top
2. Select **"API key"** from the dropdown
3. Wait for key generation (5 seconds)
4. **IMPORTANT:** Copy the key immediately and save it somewhere safe!

### 2.2 Configure API Key (NO RESTRICTIONS for Testing)
After the key is created, you'll see a dialog:

**Actions:**
1. Click **"EDIT API KEY"** (or edit the key from credentials list)
2. **Name:** "MEATHUB AI Service" (or any name you like)
3. **Application restrictions:** Select **"None"** (for testing)
4. **API restrictions:** 
   - Select **"Restrict key"**
   - Check **only** "Generative Language API"
5. Click **"SAVE"**

**Your key should look like:** `AIzaSy...` (39 characters long)

---

## 📋 STEP 3: Test in AI Studio FIRST

**This is the most important step!** Test the key BEFORE integrating.

### 3.1 Visit Google AI Studio
**URL:** https://aistudio.google.com/

**Actions:**
1. Make sure you're signed in with the SAME Google account
2. You should see the AI Studio interface
3. Look for a text prompt box

### 3.2 Test Your Key in AI Studio
**Actions:**
1. In the prompt box, type: **"Hello, please respond with a friendly greeting"**
2. Click **"Run"** or press Enter
3. **EXPECTED:** You should see an AI-generated response like:
   ```
   "Hello! It's nice to meet you. How can I help you today?"
   ```
4. **WRONG:** If you see errors about quota or API not enabled, go back to Step 1

**Checkpoint:** If AI Studio works, your key is 100% valid!

---

## 📋 STEP 4: Test Key with PowerShell (Verify)

Before integrating, let's test the key programmatically.

```powershell
# Replace YOUR_KEY_HERE with the key you just created
$apiKey = "YOUR_KEY_HERE"

$body = @'
{
  "contents": [{
    "parts": [{"text": "Say exactly: TEST SUCCESSFUL"}]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 100
  }
}
'@

try {
    $response = Invoke-WebRequest `
        -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✅ API KEY IS VALID!" -ForegroundColor Green
    $result = ($response.Content | ConvertFrom-Json)
    $text = $result.candidates[0].content.parts[0].text
    Write-Host "Gemini says: $text" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ API Key Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    
    if ($_.ErrorDetails) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorObj.error.message)" -ForegroundColor Red
    }
}
```

**Expected Output:**
```
✅ API KEY IS VALID!
Gemini says: TEST SUCCESSFUL
```

**If you get errors:**
- 400: API not enabled → Go back to Step 1
- 403: Key restrictions → Go back to Step 2.2
- 404: Wrong endpoint → Check the URL
- 429: Quota exceeded → Wait 1 minute

---

## 📋 STEP 5: Integrate into Your Service

Once confirmed working, integrate the key.

### 5.1 Stop AI Service
```powershell
cd "C:\Users\sango\OneDrive\Desktop\myProject_MEAT"
$pid = (Get-NetTCPConnection -LocalPort 8092 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
if($pid) { taskkill /F /PID $pid }
```

### 5.2 Update Configuration
```powershell
cd ai-service\src\main\resources

# Replace YOUR_VERIFIED_KEY with the key that passed Step 4
$newKey = "YOUR_VERIFIED_KEY"

$config = Get-Content application.properties
$config = $config -replace 'ai.enabled=false', 'ai.enabled=true'
$config = $config -replace 'gemini.api.key=.*', "gemini.api.key=$newKey"
Set-Content application.properties -Value $config

Write-Host "✅ Configuration updated!" -ForegroundColor Green
```

### 5.3 Rebuild Service
```powershell
cd ..\..\..\
mvn clean package -DskipTests
```

**Wait for:** `BUILD SUCCESS`

### 5.4 Start Service
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\sango\OneDrive\Desktop\myProject_MEAT\ai-service'; java -jar target/ai-service-1.0.0.jar"
```

**Wait:** 20-30 seconds for service to start

---

## 📋 STEP 6: Test Real Gemini AI in Your App

### 6.1 Test via API
```powershell
Start-Sleep -Seconds 25

$testBody = '{"message":"Hello! I am a fitness enthusiast who wants to bulk up. What protein-rich foods should I eat and when?","language":"EN"}'

$response = Invoke-WebRequest `
    -Uri "http://localhost:8092/ai/chat" `
    -Method POST `
    -Body $testBody `
    -ContentType "application/json"

$aiResponse = ($response.Content | ConvertFrom-Json).response

Write-Host "`n🤖 AI Response:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host $aiResponse -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Check if it's real AI
if ($aiResponse.Length -gt 200 -and $aiResponse -notlike "*I'd love to help*" -and $aiResponse -notlike "*not configured*") {
    Write-Host "`n✅ REAL GEMINI AI IS WORKING!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Still getting fallback responses" -ForegroundColor Yellow
}
```

**Expected (Real Gemini):**
```
For bulking up, you need a strategic approach to nutrition! Here's what I recommend:

Protein-Rich Foods:
• Chicken breast - 31g protein per 100g (lean and versatile)
• Fish - 20-25g protein per 100g (omega-3 benefits)
• Prawns - 24g protein per 100g (very lean)

Meal Timing for Muscle Growth:
1. Morning (within 30 mins of waking): 30g protein
2. Pre-workout (1-2 hours before): 25-30g protein + complex carbs
3. Post-workout (within 30 mins): 40g protein + fast carbs
4. Before bed: 25g slow-digesting protein

Daily Target: 1.6-2.2g per kg bodyweight

Would you like me to create a specific meal plan based on your weight and training schedule?
```

**Wrong (Fallback):**
```
I'd love to help you order! 🥩
We have:
• Chicken - Breast, curry cut...
```

### 6.2 Test in Your Frontend
1. Open: http://localhost:5173
2. Click AI chat bubble (bottom right)
3. Type: "I want to gain muscle, what should I eat?"
4. **Expected:** Detailed, personalized, intelligent response
5. Type: "Add 500g chicken breast to my cart"
6. **Expected:** AI actually adds it and confirms

---

## 📋 STEP 7: Test Advanced Features

### 7.1 Test Context Memory
```
Message 1: "My name is John"
Expected: "Nice to meet you, John!"

Message 2: "What's my name?"
Expected: "You told me your name is John."
```

### 7.2 Test Action Execution
```
Message: "Add 500g chicken breast to my cart"
Expected: 
1. AI calls the cart API
2. Item is actually added
3. AI confirms with cart total
```

### 7.3 Test Gym AI (Optional)
Open Gym page and use the Gym AI Assistant:
```
Message: "I want to bulk up fast"
Expected: Personalized gym nutrition advice
```

---

## ✅ SUCCESS CHECKLIST

Once all steps complete, verify:

- [ ] Generative Language API is enabled in Google Cloud
- [ ] API key created with no restrictions
- [ ] Key tested successfully in AI Studio
- [ ] Key tested successfully in PowerShell
- [ ] Configuration updated (`ai.enabled=true` + new key)
- [ ] Service rebuilt and restarted
- [ ] API test shows intelligent responses (>200 characters)
- [ ] Frontend chat shows natural conversation
- [ ] AI remembers context
- [ ] Actions work (add to cart, track orders)

---

## 🔍 TROUBLESHOOTING

### Issue: "API not enabled"
**Solution:**
- Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- Make sure you're in the CORRECT project
- Click Enable again
- Wait 2-3 minutes

### Issue: "403 Forbidden"
**Solution:**
- Edit API key in Google Cloud Console
- Set Application Restrictions to "None"
- Set API Restrictions to "Generative Language API" only
- Save and wait 1 minute

### Issue: "Still getting fallback responses"
**Solution:**
- Check service logs for errors
- Verify `ai.enabled=true` in application.properties
- Restart service completely
- Test the key in AI Studio first

### Issue: "429 Quota Exceeded"
**Solution:**
- Free tier: 60 requests/minute
- Wait 1 minute and try again
- For production, upgrade to paid tier

---

## 📊 What You'll Get After Setup

### Before (Fallback):
```
You: "I want to order chicken"
AI: "I'd love to help you order! 🥩"
```

### After (Real Gemini):
```
You: "I want to order chicken"
AI: "Great choice! I can help you order chicken. 

To give you the best recommendation, let me ask:
1. What type of chicken do you prefer?
   - Chicken breast (high protein, lean)
   - Curry cut (versatile, with bones)
   - Thighs (more flavor, tender)
   - Drumsticks (economical)

2. How much do you need?
3. When do you need delivery?

I can also suggest recipes based on what you choose!"
```

**Plus:**
- Actually adds items to cart
- Tracks real orders
- Personalized advice
- Remembers conversation
- Contextual understanding

---

## 🎯 Next Steps

After completing all steps:

1. ✅ Your AI will be fully intelligent
2. ✅ All actions will work (cart, orders, etc.)
3. ✅ Gym AI will provide real coaching
4. ✅ Conversations will be natural
5. ✅ No more mock responses

**Total setup time:** 30-60 minutes  
**Result:** Production-ready AI! 🚀

---

**Ready to start? Begin with Step 1!**

Once you have a working key (verified in Step 3), let me know and I'll help you integrate it!
