# 🔴 MEATHUB - Kill All Processes

Write-Host "🔴 Stopping all MEATHUB services..." -ForegroundColor Red
Write-Host ""

$ports = @(8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 5173, 5174, 5175)

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($proc in $processes) {
            try {
                Stop-Process -Id $proc -Force -ErrorAction Stop
                Write-Host "✓ Killed process on port $port (PID: $proc)" -ForegroundColor Green
            } catch {
                Write-Host "✗ Failed to kill process on port $port" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "- No process running on port $port" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ All processes stopped!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
