#!/bin/bash

# 停止脚本在遇到错误时继续执行
set -e

echo "=== 开始安装服务器环境 (Ubuntu) ==="

# 1. 更新系统包
echo ">>> 更新系统软件包..."
sudo apt-get update
sudo apt-get install -y curl git nginx build-essential

# 2. 安装 Node.js 20 (LTS)
echo ">>> 安装 Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js 已安装: $(node -v)"
fi

# 3. 安装全局 PM2
echo ">>> 安装 PM2..."
sudo npm install -g pm2

# 4. 安装项目依赖
echo ">>> 安装项目依赖 (这可能需要几分钟)..."
# 确保在项目根目录
cd "$(dirname "$0")/.."
npm install

# 5. 构建项目
echo ">>> 构建项目..."
npm run build

# 6. 配置 PM2 启动后端
echo ">>> 启动后端服务..."
# 检查是否已有同名进程，有则重启，无则启动
if pm2 list | grep -q "api-server"; then
    pm2 reload api-server
else
    pm2 start apps/server/dist/src/main.js --name "api-server"
fi
pm2 save
pm2 startup | grep "sudo" | bash || true # 尝试自动设置开机自启

echo "=== 环境安装与项目构建完成 ==="
echo "下一步操作："
echo "1. 修改 deploy/nginx.conf 中的域名 (server_name)"
echo "2. 将配置文件复制到 Nginx: sudo cp deploy/nginx.conf /etc/nginx/sites-available/default"
echo "3. 重启 Nginx: sudo service nginx restart"
