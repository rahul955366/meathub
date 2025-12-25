# MEATHUB - Move Project to D Drive

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MOVING MEATHUB TO D: DRIVE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$source = "C:\Users\sango\OneDrive\Desktop\myProject_MEAT"
$destination = "D:\myProject_MEAT"

# Check if source exists
if (-not (Test-Path $source)) {
    Write-Host "[ERROR] Source folder not found: $source" -ForegroundColor Red
    exit
}

# Check if destination already exists
if (Test-Path $destination) {
    Write-Host "[WARNING] Destination folder already exists!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite? (yes/no)"
    if ($response -ne "yes") {
        Write-Host "Move cancelled." -ForegroundColor Yellow
        exit
    }
    Write-Host "Removing existing folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $destination
}

Write-Host "Moving project to D: drive..." -ForegroundColor Cyan
Write-Host "Source: $source" -ForegroundColor White
Write-Host "Destination: $destination" -ForegroundColor White
Write-Host ""

# Create D: drive folder
New-Item -ItemType Directory -Path $destination -Force | Out-Null

Write-Host "Copying files... This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Copy with progress
$fileCount = (Get-ChildItem -Path $source -Recurse -File).Count
Write-Host "Total files to copy: $fileCount" -ForegroundColor Cyan
Write-Host ""

# Use Robocopy for faster, better copy
Write-Host "Using Robocopy for optimal copy..." -ForegroundColor Cyan
robocopy $source $destination /E /MT:8 /R:3 /W:1 /NFL /NDL /NC /NS /NP

if ($LASTEXITCODE -le 7) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  COPY COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Update all startup scripts
    Write-Host "Updating startup scripts with new path..." -ForegroundColor Cyan
    
    $scriptsToUpdate = @(
        "$destination\START_ALL.ps1",
        "$destination\STOP_ALL.ps1",
        "$destination\START_BACKEND_LOW_MEMORY.ps1",
        "$destination\CHECK_BACKEND.ps1"
    )
    
    foreach ($script in $scriptsToUpdate) {
        if (Test-Path $script) {
            $content = Get-Content $script -Raw
            $content = $content -replace [regex]::Escape("C:\Users\sango\OneDrive\Desktop\myProject_MEAT"), "D:\myProject_MEAT"
            $content | Set-Content $script
            Write-Host "  Updated: $(Split-Path $script -Leaf)" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  NEXT STEPS" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Close ALL running services and portals" -ForegroundColor Yellow
    Write-Host "2. Navigate to: D:\myProject_MEAT" -ForegroundColor Yellow
    Write-Host "3. Run: .\START_ALL.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "New project location: $destination" -ForegroundColor Green
    Write-Host ""
    
    $deleteOld = Read-Host "Do you want to delete the old folder from C: drive? (yes/no)"
    if ($deleteOld -eq "yes") {
        Write-Host "Deleting old folder..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force $source
        Write-Host "Old folder deleted!" -ForegroundColor Green
    } else {
        Write-Host "Old folder kept. You can delete it manually later." -ForegroundColor Cyan
    }
    
} else {
    Write-Host ""
    Write-Host "[ERROR] Copy failed with error code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Please try again or copy manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
