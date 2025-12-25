# ========================================
# Setup Real Gemini AI - Quick Script
# ========================================

Write-Host @"

╔══════════════════════════════════════════════════╗
║  🤖 SETUP REAL GEMINI AI                        ║
║  Transform Your Chat to Intelligent AI          ║
╚══════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Step 1: Get API Key
Write-Host "`n📝 STEP 1: Get Your Gemini API Key" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "`n1. Visit: " -NoNewline
Write-Host "https://aistudio.google.com/app/apikey" -ForegroundColor Green
Write-Host "2. Click 'Create API Key'"
Write-Host "3. Copy the key (starts with AIza...)"
Write-Host "`n"

$apiKey = Read-Host "Paste your Gemini API key here"

if (-not $apiKey -or $apiKey.Length -lt 30) {
    Write-Host "`n❌ Invalid API key. Please run this script again with a valid key." -ForegroundColor Red
    exit
}

Write-Host "`n✅ API Key received!" -ForegroundColor Green

# Step 2: Update Configuration
Write-Host "`n⚙️  STEP 2: Updating Configuration" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$configPath = "C:\Users\sango\OneDrive\Desktop\myProject_MEAT\ai-service\src\main\resources\application.properties"

if (-not (Test-Path $configPath)) {
    Write-Host "`n❌ Config file not found at: $configPath" -ForegroundColor Red
    exit
}

# Read current config
$config = Get-Content $configPath

# Update AI enabled
$config = $config -replace 'ai.enabled=false', 'ai.enabled=true'

# Update Gemini API key
$config = $config -replace 'gemini.api.key=.*', "gemini.api.key=$apiKey"

# Save config
Set-Content -Path $configPath -Value $config

Write-Host "✅ Configuration updated!" -ForegroundColor Green
Write-Host "   • ai.enabled=true"
Write-Host "   • gemini.api.key=***" + $apiKey.Substring($apiKey.Length - 10)

# Step 3: Stop AI Service
Write-Host "`n🛑 STEP 3: Stopping AI Service" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$processId = (Get-NetTCPConnection -LocalPort 8092 -ErrorAction SilentlyContinue).OwningProcess | Select-Object -First 1
if ($processId) {
    taskkill /F /PID $processId 2>&1 | Out-Null
    Write-Host "✅ Stopped old AI service (PID: $processId)" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "⚠️  No AI service running" -ForegroundColor Yellow
}

# Step 4: Rebuild
Write-Host "`n🔨 STEP 4: Rebuilding AI Service" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "This will take about 15-20 seconds..." -ForegroundColor Gray

cd "C:\Users\sango\OneDrive\Desktop\myProject_MEAT\ai-service"
$buildResult = mvn clean package -DskipTests 2>&1 | Out-String

if ($buildResult -like "*BUILD SUCCESS*") {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Build failed. Check the logs above." -ForegroundColor Red
    exit
}

# Step 5: Start Service
Write-Host "`n🚀 STEP 5: Starting AI Service with Gemini" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\sango\OneDrive\Desktop\myProject_MEAT\ai-service'; Write-Host '🤖 AI Service with Real Gemini AI' -ForegroundColor Green; java -jar target/ai-service-1.0.0.jar"

Write-Host "✅ AI Service starting in new window..." -ForegroundColor Green
Write-Host "`nWaiting 25 seconds for service to start..." -ForegroundColor Gray
Start-Sleep -Seconds 25

# Step 6: Test
Write-Host "`n🧪 STEP 6: Testing Real Gemini AI" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$testBody = '{"message":"Hello, I am a fitness enthusiast who wants to bulk up. What should I eat?","language":"EN"}'

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8092/ai/chat" `
        -Method POST `
        -Body $testBody `
        -ContentType "application/json" `
        -ErrorAction Stop

    $aiResponse = ($response.Content | ConvertFrom-Json).response

    Write-Host "`n✅ SUCCESS! Real Gemini AI is working!" -ForegroundColor Green
    Write-Host "`nAI Response:" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host $aiResponse -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

    if ($aiResponse -like "*I'd love to help*" -or $aiResponse -like "*We have:*") {
        Write-Host "`n⚠️  WARNING: Still getting fallback responses!" -ForegroundColor Yellow
        Write-Host "This might mean the API key is invalid or quota exceeded." -ForegroundColor Yellow
        Write-Host "Try getting a fresh API key from: https://aistudio.google.com/app/apikey" -ForegroundColor Yellow
    } else {
        Write-Host "`n🎉 Perfect! You now have real, intelligent AI!" -ForegroundColor Green
    }

} catch {
    Write-Host "`n❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Make sure the service started successfully." -ForegroundColor Yellow
}

# Summary
Write-Host @"

╔══════════════════════════════════════════════════╗
║  ✅ SETUP COMPLETE!                             ║
╚══════════════════════════════════════════════════╝

Your AI Chat Now Has:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Real Gemini AI (not mock responses)
✅ Intelligent conversations
✅ Add to cart functionality
✅ Order tracking
✅ Gym nutrition coaching
✅ Contextual responses

Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Open your app: http://localhost:5173
2. Click the AI chat bubble
3. Try: "I want to order 500g chicken breast"
4. See real, intelligent AI in action!

If you see fallback responses:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Get a fresh API key
• Make sure quota isn't exceeded
• Check service logs for errors

"@ -ForegroundColor Cyan

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
