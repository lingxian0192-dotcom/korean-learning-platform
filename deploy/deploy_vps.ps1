# deploy_vps.ps1 - One-click deployment to VPS
param (
    [string]$ServerIP = "115.191.23.62",
    [string]$User = "root"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Starting One-Click Deployment to $ServerIP ===" -ForegroundColor Green

# 1. Build Frontend
Write-Host ">>> Building Frontend..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\apps\client"
cmd /c "npm run build"
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }

# 2. Build Backend
Write-Host ">>> Building Backend..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\apps\server"
cmd /c "npm run build:vps"
if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }

# 3. Prepare Package
Write-Host ">>> Packaging artifacts..." -ForegroundColor Cyan
$PackageDir = "$PSScriptRoot\deploy_package"
if (Test-Path $PackageDir) { Remove-Item $PackageDir -Recurse -Force }
New-Item -ItemType Directory -Path $PackageDir | Out-Null
New-Item -ItemType Directory -Path "$PackageDir\html" | Out-Null

# Copy Frontend
Copy-Item "$PSScriptRoot\..\apps\client\dist\*" "$PackageDir\html" -Recurse

# Copy Backend
Copy-Item "$PSScriptRoot\..\apps\server\dist\server.js" "$PackageDir\server.js"

# Copy Configs
Copy-Item "$PSScriptRoot\docker-compose.offline.yml" "$PackageDir\docker-compose.yml"
Copy-Item "$PSScriptRoot\Dockerfile.backend.offline" "$PackageDir\Dockerfile.backend.offline"
Copy-Item "$PSScriptRoot\Dockerfile.frontend.offline" "$PackageDir\Dockerfile.frontend.offline"
Copy-Item "$PSScriptRoot\..\apps\client\nginx.conf" "$PackageDir\nginx.conf"
Copy-Item "$PSScriptRoot\init_db.sql" "$PackageDir\init_db.sql"

# Zip
$ZipFile = "$PSScriptRoot\deploy_package.zip"
if (Test-Path $ZipFile) { Remove-Item $ZipFile -Force }
Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipFile

Write-Host ">>> Package created at $ZipFile" -ForegroundColor Green

# 4. Upload and Deploy
Write-Host ">>> Uploading to VPS (You may be asked for password: 7Fp#kT9x!L2s`$V@NqY8z^C&H*dM4bW)..." -ForegroundColor Yellow
# Note: $V needs escape in string if expanding, but here single quote or escape is needed for password display.
# Using scp
scp "$ZipFile" "${User}@${ServerIP}:/root/deploy_package.zip"

Write-Host ">>> Executing remote deployment..." -ForegroundColor Yellow
$RemoteCommands = "
    echo '>>> Unzipping...';
    rm -rf /root/deploy_app;
    mkdir -p /root/deploy_app;
    unzip -o /root/deploy_package.zip -d /root/deploy_app;
    cd /root/deploy_app;
    echo '>>> Stopping old services...';
    docker compose down || true;
    echo '>>> Starting new services...';
    docker compose up -d --build;
    echo '>>> Deployment Complete!';
"

ssh "$User@$ServerIP" $RemoteCommands

Write-Host "=== Deployment Finished Successfully! ===" -ForegroundColor Green
Write-Host "Visit http://$ServerIP"
