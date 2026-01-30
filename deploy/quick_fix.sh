#!/bin/bash
set -e

echo "=== 开始执行一键修复程序 ==="

# 确保进入 deploy 目录
cd "$(dirname "$0")"

echo ">>> 步骤 1/3: 停止旧服务..."
# 停止容器并移除孤儿容器，防止端口冲突
docker compose down --remove-orphans

echo ">>> 步骤 2/3: 强制重新构建..."
# --build: 重新构建镜像
# --force-recreate: 强制重新创建容器
echo "正在构建镜像，请耐心等待（取决于网络速度）..."
docker compose up -d --build --force-recreate

echo ">>> 步骤 3/3: 检查服务状态..."
if docker compose ps | grep "Up"; then
    echo "=== 修复成功！服务已重启 ==="
    echo "请在浏览器中按 Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac) 强制刷新页面。"
    echo "如果仍有问题，请运行以下命令查看日志："
    echo "cd deploy && docker compose logs -f client"
else
    echo "!!! 警告：服务似乎没有正常启动，请检查日志 !!!"
fi
