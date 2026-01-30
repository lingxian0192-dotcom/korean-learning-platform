#!/bin/bash
set -e

echo "=== 开始部署 (Docker + PM2) ==="

# 1. 检查并安装 Docker (如果没安装的话)
if ! command -v docker &> /dev/null; then
    echo ">>> 未检测到 Docker，正在自动安装..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    echo ">>> Docker 安装完成。"
fi

# 2. 检查并安装 Docker Compose 插件
if ! docker compose version &> /dev/null; then
    echo ">>> 未检测到 Docker Compose，正在安装..."
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
fi

echo ">>> 环境检查完毕，开始构建..."

# 3. 进入 deploy 目录并启动
cd "$(dirname "$0")"
docker compose up -d --build

echo "=== 部署成功！ ==="
echo "前端访问: http://<你的服务器IP>"
echo "后端 API: http://<你的服务器IP>/api/"
echo "查看日志: docker compose logs -f"
