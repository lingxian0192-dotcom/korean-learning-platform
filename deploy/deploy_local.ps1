
<#
.SYNOPSIS
    Local Deployment Script for Poor Network VPS
    Runs on YOUR PC, uploads compiled files to VPS.
    
.DESCRIPTION
    1. Builds Frontend locally (Vite)
    2. Builds Backend locally (Esbuild bundled)
    3. Uploads files via SCP
    4. Configures VPS via SSH
#>

param (
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$User = "root"
)

$ErrorActionPreference = "Stop"

Write-Host "=== 🚀 开始本地构建部署流程 ===" -ForegroundColor Cyan

# 1. 前端构建
Write-Host "`n📦 [1/4] 正在构建前端 (Client)..." -ForegroundColor Green
Set-Location "$PSScriptRoot\..\apps\client"
npm install
npm run build
if (-not (Test-Path "dist\index.html")) {
    Write-Error "前端构建失败，未找到 dist/index.html"
}

# 2. 后端构建
Write-Host "`n📦 [2/4] 正在构建后端 (Server)..." -ForegroundColor Green
Set-Location "$PSScriptRoot\..\apps\server"
npm install
npm run build:vps
if (-not (Test-Path "dist\server.js")) {
    Write-Error "后端构建失败，未找到 dist/server.js"
}

# 3. 准备服务器环境 (SSH)
Write-Host "`n🔧 [3/4] 正在配置服务器环境 (可能需要输入密码)..." -ForegroundColor Green
$RemoteScript = @"
# 1. 停止并清理旧服务 (防止端口冲突)
echo '正在清理旧服务...'
pm2 delete project_demo_server 2>/dev/null || true
pm2 delete korean-server 2>/dev/null || true
# 确保端口 3001 被释放
fuser -k 3001/tcp 2>/dev/null || true

# 2. 清理旧的前端文件 (防止缓存残留)
echo '正在清理旧文件...'
rm -rf /var/www/project_demo/html/*
mkdir -p /var/www/project_demo/html
mkdir -p /opt/project_demo/server

# 3. 安装基础软件 (如果缺失)
if ! command -v node &> /dev/null; then
    echo '安装 Node.js...'
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo '安装 PM2...'
    npm install -g pm2
fi

if ! command -v nginx &> /dev/null; then
    echo '安装 Nginx...'
    apt-get update
    apt-get install -y nginx
fi

# 创建目录
mkdir -p /opt/project_demo/server
mkdir -p /var/www/project_demo/html
"@

ssh -o StrictHostKeyChecking=no "$User@$ServerIP" "$RemoteScript"

# 4. 上传文件 (SCP)
Write-Host "`nPwD: $PWD"
Write-Host "`n📤 [4/4] 正在上传文件 (这可能需要几分钟)..." -ForegroundColor Green

# 上传后端 (合并为一个命令，减少密码输入次数)
Write-Host "  - 上传后端程序 (server.js + .env)..."
scp "$PSScriptRoot\..\apps\server\dist\server.js" "$PSScriptRoot\..\apps\server\.env" "$User@${ServerIP}:/opt/project_demo/server/"

# 上传前端
Write-Host "  - 上传前端资源..."
scp -r "$PSScriptRoot\..\apps\client\dist\*" "$User@${ServerIP}:/var/www/project_demo/html/"

# 5. 启动服务
Write-Host "`n🚀 正在启动服务..." -ForegroundColor Green
# 使用 @' '@ 单引号 Here-String 避免 PowerShell 变量替换，全部原样发送给 SSH
$StartScript = @'
# 启动后端 (如果已存在则重启)
cd /opt/project_demo/server
pm2 restart project_demo_server || pm2 start server.js --name project_demo_server

# 配置 Nginx (使用转义 EOF 防止 Shell 提前解析)
cat > /etc/nginx/sites-available/project_demo <<'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/project_demo/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 启用站点并重启 Nginx
ln -sf /etc/nginx/sites-available/project_demo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "✅ 部署完成！"
'@

ssh "$User@$ServerIP" "$StartScript"

Write-Host "`n✨ 全流程结束！请访问: http://$ServerIP" -ForegroundColor Cyan
