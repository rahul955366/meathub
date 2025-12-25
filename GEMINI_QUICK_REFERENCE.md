# ⚡ Gemini API Setup - Quick Reference

## 🔗 Important Links (Open These)

1. **Enable API:** https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. **Create Key:** https://console.cloud.google.com/apis/credentials
3. **Test AI Studio:** https://aistudio.google.com/
4. **Project Dashboard:** https://console.cloud.google.com/

---

## ✅ Quick Checklist

### Phase 1: Google Cloud Setup
- [ ] Visit https://console.cloud.google.com/
- [ ] Select or create project
- [ ] Enable "Generative Language API"
- [ ] Wait for "API Enabled" confirmation

### Phase 2: Create API Key
- [ ] Go to Credentials page
- [ ] Click "CREATE CREDENTIALS" → "API key"
- [ ] Copy and save the key (starts with AIza...)
- [ ] Edit key settings:
  - [ ] Application restrictions: **None**
  - [ ] API restrictions: **Generative Language API only**
- [ ] Click Save

### Phase 3: Test Key
- [ ] Visit https://aistudio.google.com/
- [ ] Type test message: "Hello, respond with a greeting"
- [ ] Verify you get AI response (not error)
- [ ] If works in AI Studio → Key is VALID! ✅

### Phase 4: PowerShell Test
```powershell
# Replace YOUR_KEY with actual key
$apiKey = "YOUR_KEY"
$body = '{"contents":[{"parts":[{"text":"Say: SUCCESS"}]}]}'

Invoke-WebRequest `
  -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey" `
  -Method POST -Body $body -ContentType "application/json"
```
- [ ] Response shows "SUCCESS" → Ready to integrate! ✅

### Phase 5: Integrate
```powershell
cd "C:\Users\sango\OneDrive\Desktop\myProject_MEAT"

# Stop service
$pid = (Get-NetTCPConnection -LocalPort 8092).OwningProcess[0]
taskkill /F /PID $pid

# Update config
cd ai-service\src\main\resources
$config = Get-Content application.properties
$config = $config -replace 'ai.enabled=false', 'ai.enabled=true'
$config = $config -replace 'gemini.api.key=.*', 'gemini.api.key=YOUR_KEY'
Set-Content application.properties -Value $config

# Rebuild
cd ..\..\..\
mvn clean package -DskipTests

# Start
java -jar target/ai-service-1.0.0.jar
```

### Phase 6: Final Test
```powershell
Start-Sleep -Seconds 25

$test = '{"message":"Hello, I want fitness advice","language":"EN"}'
Invoke-WebRequest -Uri "http://localhost:8092/ai/chat" `
  -Method POST -Body $test -ContentType "application/json"
```
- [ ] Response is long (>200 chars) and intelligent ✅
- [ ] No "not configured" or template responses ✅

---

## 🚨 Common Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| 400 Bad Request | API not enabled | Enable in Google Cloud |
| 403 Forbidden | Key restrictions | Set to "None" |
| 404 Not Found | Wrong endpoint | Check URL |
| 429 Too Many | Quota exceeded | Wait 1 minute |

---

## 📞 When to Contact Me

**After Step 3:** If AI Studio test works, tell me and I'll help with integration!

**If stuck:** Tell me which step and what error you're seeing.

---

## 🎯 Success Criteria

You'll know it's working when:
1. ✅ AI Studio responds intelligently
2. ✅ PowerShell test returns AI response
3. ✅ Service logs show "Calling Gemini API"
4. ✅ Frontend chat gives detailed, personalized answers
5. ✅ AI can add items to cart and track orders

---

**Full Guide:** See `FIX_GEMINI_API_GUIDE.md` for detailed instructions!

**Stuck?** Let me know which step and I'll help! 🚀
