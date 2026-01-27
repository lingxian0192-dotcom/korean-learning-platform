Write-Host ">>> Starting Clean Deployment Process..." -ForegroundColor Cyan

# Define paths
$clientPath = Join-Path $PSScriptRoot "apps\client"
$serverPath = Join-Path $PSScriptRoot "apps\server"

# Function to clean directories
function Clean-Directory($path) {
    Write-Host "Cleaning $path..." -ForegroundColor Yellow
    if (Test-Path "$path\node_modules") { 
        Remove-Item -Recurse -Force "$path\node_modules" -ErrorAction SilentlyContinue 
        Write-Host "  Removed node_modules" -ForegroundColor Gray
    }
    if (Test-Path "$path\dist") { 
        Remove-Item -Recurse -Force "$path\dist" -ErrorAction SilentlyContinue 
        Write-Host "  Removed dist" -ForegroundColor Gray
    }
}

# 1. Clean
Clean-Directory $clientPath
Clean-Directory $serverPath

# 2. Install & Build Client
Write-Host "`n>>> Building Client..." -ForegroundColor Cyan
Push-Location $clientPath
try {
    Write-Host "Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) { throw "Client npm install failed" }
    
    Write-Host "Building..."
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Client build failed" }
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# 3. Install & Build Server
Write-Host "`n>>> Building Server..." -ForegroundColor Cyan
Push-Location $serverPath
try {
    Write-Host "Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) { throw "Server npm install failed" }
    
    Write-Host "Building..."
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Server build failed" }
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

Write-Host "`n>>> All builds completed successfully!" -ForegroundColor Green
Write-Host "You can now deploy to Vercel." -ForegroundColor Green
